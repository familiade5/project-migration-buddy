// VDH Instagram DM webhook — receives messages from Meta Graph API
// PUBLIC endpoint (no JWT). Validated by verify_token + dedup by ig_message_id.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hub-signature-256",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const VERIFY_TOKEN = Deno.env.get("META_VERIFY_TOKEN") ?? "vdh_inbox_verify_2026";
const META_TOKEN = Deno.env.get("META_ACCESS_TOKEN")!;
const VDH_IG_ID = Deno.env.get("INSTAGRAM_BUSINESS_ACCOUNT_ID")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function fetchIgUserProfile(igUserId: string) {
  try {
    const url = `https://graph.facebook.com/v21.0/${igUserId}?fields=name,username,profile_pic&access_token=${META_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("fetchIgUserProfile failed", e);
    return null;
  }
}

async function upsertConversation(participantId: string) {
  // Check existing
  const { data: existing } = await supabase
    .from("vdh_conversations")
    .select("id, ig_full_name")
    .eq("ig_participant_id", participantId)
    .maybeSingle();

  if (existing) return existing.id as string;

  // New conversation — fetch profile from Meta
  const profile = await fetchIgUserProfile(participantId);
  const { data, error } = await supabase
    .from("vdh_conversations")
    .insert({
      ig_participant_id: participantId,
      ig_username: profile?.username ?? null,
      ig_full_name: profile?.name ?? profile?.username ?? "Usuário Instagram",
      ig_profile_pic: profile?.profile_pic ?? null,
    })
    .select("id")
    .single();

  if (error) {
    // Race condition: another concurrent insert won
    const { data: again } = await supabase
      .from("vdh_conversations")
      .select("id")
      .eq("ig_participant_id", participantId)
      .maybeSingle();
    return again?.id as string;
  }
  return data!.id as string;
}

async function handleMessageEvent(messaging: any) {
  const senderId = messaging.sender?.id;
  const recipientId = messaging.recipient?.id;
  const message = messaging.message;
  if (!senderId || !recipientId || !message) return;

  // Determine direction. If sender == our IG account, it's an outbound echo.
  const isOutbound = senderId === VDH_IG_ID;
  const participantId = isOutbound ? recipientId : senderId;
  const direction: "in" | "out" = isOutbound ? "out" : "in";

  // Skip echoes of our own outbound API calls (we already saved them on send)
  if (message.is_echo) {
    console.log("Skipping echo message", message.mid);
    return;
  }

  const conversationId = await upsertConversation(participantId);
  if (!conversationId) {
    console.error("Failed to get/create conversation");
    return;
  }

  const text: string | null = message.text ?? null;
  let attachmentType: string | null = null;
  let attachmentUrl: string | null = null;
  let storyUrl: string | null = null;

  if (message.attachments?.[0]) {
    const att = message.attachments[0];
    attachmentType = att.type;
    attachmentUrl = att.payload?.url ?? null;
    if (att.type === "story_mention") {
      storyUrl = att.payload?.url ?? null;
    }
  } else if (message.reaction) {
    attachmentType = "reaction";
  }

  // Insert message (idempotent via unique ig_message_id)
  const { error: msgErr } = await supabase
    .from("vdh_messages")
    .insert({
      conversation_id: conversationId,
      ig_message_id: message.mid ?? null,
      direction,
      text,
      attachment_type: attachmentType,
      attachment_url: attachmentUrl,
      story_url: storyUrl,
      reply_to_ig_message_id: message.reply_to?.mid ?? null,
      raw_payload: messaging,
    });

  if (msgErr) {
    if (msgErr.code === "23505") {
      console.log("Duplicate message skipped");
      return;
    }
    console.error("Insert message error", msgErr);
    return;
  }

  // Update conversation summary
  const updates: Record<string, unknown> = {
    last_message_text: text ?? `[${attachmentType ?? "anexo"}]`,
    last_message_at: new Date(messaging.timestamp ?? Date.now()).toISOString(),
    last_message_direction: direction,
    updated_at: new Date().toISOString(),
  };

  if (direction === "in") {
    // Increment unread
    const { data: conv } = await supabase
      .from("vdh_conversations")
      .select("unread_count, status")
      .eq("id", conversationId)
      .single();
    updates.unread_count = (conv?.unread_count ?? 0) + 1;
    if (conv?.status === "archived") updates.status = "open";
  }

  await supabase.from("vdh_conversations").update(updates).eq("id", conversationId);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Meta webhook verification (GET)
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new Response(challenge ?? "ok", { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // Webhook event delivery (POST)
  if (req.method === "POST") {
    try {
      const body = await req.json();
      // Respond fast, then process. Meta retries if we don't 200 within ~20s.
      // Process inline since Edge Functions can't background reliably.
      const entries = body.entry ?? [];
      for (const entry of entries) {
        const messagingEvents = entry.messaging ?? [];
        for (const ev of messagingEvents) {
          if (ev.message) {
            await handleMessageEvent(ev);
          }
        }
      }
      return new Response("EVENT_RECEIVED", { status: 200, headers: corsHeaders });
    } catch (e) {
      console.error("Webhook error:", e);
      // Always 200 to avoid Meta retries flooding us
      return new Response("ok", { status: 200, headers: corsHeaders });
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
});