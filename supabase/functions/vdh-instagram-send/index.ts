// VDH Instagram DM send — sends a message via Meta Graph API and stores it
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const META_TOKEN = Deno.env.get("META_ACCESS_TOKEN")!;
const VDH_IG_ID = Deno.env.get("INSTAGRAM_BUSINESS_ACCOUNT_ID")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  // Auth
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
  if (claimsErr || !claimsData?.claims) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const userId = claimsData.claims.sub as string;

  // Service client for verified writes
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Inbox access check
  const { data: hasAccess } = await admin.rpc("has_vdh_inbox_access", { _user_id: userId });
  if (!hasAccess) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { conversation_id?: string; text?: string };
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { conversation_id, text } = body;
  if (!conversation_id || !text || text.trim().length === 0) {
    return new Response(JSON.stringify({ error: "conversation_id and text required" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (text.length > 1000) {
    return new Response(JSON.stringify({ error: "Message too long" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: conv, error: convErr } = await admin
    .from("vdh_conversations")
    .select("id, ig_participant_id")
    .eq("id", conversation_id)
    .single();
  if (convErr || !conv) {
    return new Response(JSON.stringify({ error: "Conversation not found" }), {
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Fetch sender name
  const { data: profile } = await admin
    .from("profiles").select("full_name, email").eq("id", userId).maybeSingle();
  const senderName = profile?.full_name ?? profile?.email ?? "Atendente";

  // Send via Meta Graph API
  const url = `https://graph.facebook.com/v21.0/${VDH_IG_ID}/messages`;
  const metaRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: conv.ig_participant_id },
      message: { text },
      access_token: META_TOKEN,
    }),
  });
  const metaJson = await metaRes.json();
  if (!metaRes.ok) {
    console.error("Meta send error", metaJson);
    return new Response(JSON.stringify({ error: "Meta API error", detail: metaJson }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Save message
  await admin.from("vdh_messages").insert({
    conversation_id: conv.id,
    ig_message_id: metaJson.message_id ?? null,
    direction: "out",
    text,
    sent_by_user_id: userId,
    sent_by_name: senderName,
  });

  await admin.from("vdh_conversations").update({
    last_message_text: text,
    last_message_at: new Date().toISOString(),
    last_message_direction: "out",
    updated_at: new Date().toISOString(),
  }).eq("id", conv.id);

  return new Response(JSON.stringify({ ok: true, message_id: metaJson.message_id }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});