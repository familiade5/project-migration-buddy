// VDH Instagram backfill — imports existing IG DM conversations + messages
// into vdh_conversations / vdh_messages via Meta Graph API.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const META_TOKEN = Deno.env.get("META_ACCESS_TOKEN")!;
const VDH_IG_ID = Deno.env.get("INSTAGRAM_BUSINESS_ACCOUNT_ID")!;
const FACEBOOK_PAGE_ID = Deno.env.get("FACEBOOK_PAGE_ID") ?? "";
// Tokens IGAA... usam graph.instagram.com (Instagram Login for Business),
// não graph.facebook.com. Detecta automaticamente.
const GRAPH = META_TOKEN.startsWith("IGAA")
  ? "https://graph.instagram.com/v21.0"
  : "https://graph.facebook.com/v21.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function gget(url: string) {
  const finalUrl = url.includes("access_token=")
    ? url
    : `${url}${url.includes("?") ? "&" : "?"}access_token=${encodeURIComponent(META_TOKEN)}`;
  const res = await fetch(finalUrl);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Meta API ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

async function getGrantedPermissions() {
  try {
    const res = await gget(`https://graph.facebook.com/v21.0/me/permissions`);
    const granted = Array.isArray(res?.data)
      ? res.data.filter((item: any) => item?.status === "granted").map((item: any) => String(item.permission))
      : [];
    return granted;
  } catch {
    return [] as string[];
  }
}

function buildConversationSources(limitConvs: number) {
  const sources: Array<{ label: string; url: string }> = [];

  if (FACEBOOK_PAGE_ID) {
    sources.push({
      label: `facebook-page:${FACEBOOK_PAGE_ID}`,
      url: `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/conversations?platform=instagram&fields=id,participants,updated_time&limit=${limitConvs}`,
    });
  }

  if (GRAPH.includes("graph.instagram.com")) {
    sources.push({
      label: "instagram-me",
      url: `${GRAPH}/me/conversations?fields=id,participants,updated_time&limit=${limitConvs}`,
    });
  } else {
    sources.push({
      label: `instagram-business:${VDH_IG_ID}`,
      url: `${GRAPH}/${VDH_IG_ID}/conversations?platform=instagram&fields=id,participants,updated_time&limit=${limitConvs}`,
    });
  }

  return sources;
}

async function fetchProfile(igUserId: string) {
  try {
    return await gget(`${GRAPH}/${igUserId}?fields=name,username,profile_pic`);
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const log: string[] = [];
  const stats = { conversations: 0, messages: 0, skipped: 0, errors: 0 };
  let body: any = {};
  try { body = await req.json(); } catch { body = {}; }
  const testMode = body?.test === true;

  try {
    // DIAGNÓSTICO
    const tokenLen = (META_TOKEN ?? "").length;
    const tokenPreview = tokenLen > 12 ? `${META_TOKEN.slice(0, 6)}...${META_TOKEN.slice(-4)}` : "(empty/short)";
    log.push(`META_ACCESS_TOKEN len=${tokenLen} preview=${tokenPreview}`);
    log.push(`GRAPH=${GRAPH}`);
    log.push(`INSTAGRAM_BUSINESS_ACCOUNT_ID=${VDH_IG_ID || "(missing)"}`);
    log.push(`FACEBOOK_PAGE_ID=${FACEBOOK_PAGE_ID || "(missing)"}`);

    // Testa o token: /me deve retornar id do ator
    try {
      const me = await gget(`${GRAPH}/me?fields=id,name`);
      log.push(`/me OK: ${JSON.stringify(me)}`);
    } catch (e) {
      throw new Error(`Token inválido em /me — verifique META_ACCESS_TOKEN. Detalhe: ${e instanceof Error ? e.message : String(e)}`);
    }

    // Teste: lista 1 página de conversas e retorna
    if (testMode) {
      const tests = [] as Array<{ source: string; count: number; error?: string; sample?: any }>;
      for (const source of buildConversationSources(5)) {
        try {
          log.push(`testSource=${source.label} url=${source.url}`);
          const sample: any = await gget(source.url);
          const count = (sample?.data ?? []).length;
          log.push(`conversations test [${source.label}]: ${count} encontradas`);
          tests.push({ source: source.label, count, sample });
        } catch (e) {
          const error = e instanceof Error ? e.message : String(e);
          log.push(`conversations test [${source.label}] erro: ${error}`);
          tests.push({ source: source.label, count: 0, error });
        }
      }

      const grantedPermissions = await getGrantedPermissions();
      return new Response(
        JSON.stringify({ success: true, testMode: true, log, tests, grantedPermissions }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const limitConvs = 50;
    let totalRemoteConversations = 0;
    for (const source of buildConversationSources(limitConvs)) {
      let url: string | null = source.url;
      let pageNum = 0;
      let emptyPages = 0;
      let sourceConversationCount = 0;

      log.push(`Import source=${source.label}`);

      while (url) {
        pageNum++;
        if (pageNum > 50) { log.push(`stop [${source.label}]: 50 páginas`); break; }
        const page: any = await gget(url);
        const convs = page?.data ?? [];
        totalRemoteConversations += convs.length;
        sourceConversationCount += convs.length;
        log.push(`Página ${pageNum} [${source.label}]: ${convs.length} conversas`);
        if (convs.length === 0) {
          emptyPages++;
          if (emptyPages >= 5) { log.push(`stop [${source.label}]: 5 páginas vazias seguidas`); break; }
        } else {
          emptyPages = 0;
        }

        for (const conv of convs) {
          try {
            const parts = conv.participants?.data ?? [];
            const other = parts.find((p: any) => String(p.id) !== String(VDH_IG_ID)) ?? parts[0];
            if (!other) {
              stats.skipped++;
              continue;
            }
            const participantId: string = String(other.id);

            let convRow: any;
            const { data: existing } = await supabase
              .from("vdh_conversations")
              .select("id")
              .eq("ig_participant_id", participantId)
              .maybeSingle();

            if (existing) {
              convRow = existing;
            } else {
              const profile = await fetchProfile(participantId);
              const { data, error } = await supabase
                .from("vdh_conversations")
                .insert({
                  ig_participant_id: participantId,
                  ig_username: other.username ?? profile?.username ?? null,
                  ig_full_name: other.name ?? profile?.name ?? profile?.username ?? "Usuário Instagram",
                  ig_profile_pic: profile?.profile_pic ?? null,
                })
                .select("id")
                .single();
              if (error) throw error;
              convRow = data;
              stats.conversations++;
            }

            const msgUrl = `${GRAPH}/${conv.id}?fields=messages.limit(50){id,created_time,from,to,message,attachments}`;
            const msgPage: any = await gget(msgUrl);
            const msgs = msgPage?.messages?.data ?? [];

            const ordered = [...msgs].reverse();
            let lastText = "";
            let lastAt: string | null = null;
            let lastDir: "in" | "out" | null = null;

            for (const m of ordered) {
              const fromId = String(m.from?.id ?? "");
              const direction = fromId === String(VDH_IG_ID) ? "out" : "in";
              const text = m.message ?? "";
              const att = m.attachments?.data?.[0];

              const { data: dup } = await supabase
                .from("vdh_messages")
                .select("id")
                .eq("ig_message_id", m.id)
                .maybeSingle();
              if (dup) continue;

              const { error: msgErr } = await supabase.from("vdh_messages").insert({
                conversation_id: convRow.id,
                ig_message_id: m.id,
                direction,
                text,
                attachment_type: att?.image_data ? "image" : att?.video_data ? "video" : null,
                attachment_url: att?.image_data?.url ?? att?.video_data?.url ?? null,
                created_at: m.created_time,
                raw_payload: m,
              });
              if (msgErr) {
                stats.errors++;
                continue;
              }
              stats.messages++;
              lastText = text || (att ? "[anexo]" : "");
              lastAt = m.created_time;
              lastDir = direction;
            }

            if (lastAt) {
              await supabase
                .from("vdh_conversations")
                .update({
                  last_message_text: lastText,
                  last_message_at: lastAt,
                  last_message_direction: lastDir,
                })
                .eq("id", convRow.id);
            }
          } catch (e) {
            stats.errors++;
            log.push(`Erro conv ${conv.id} [${source.label}]: ${e instanceof Error ? e.message : String(e)}`);
          }
        }

        url = page?.paging?.next ?? null;
      }

      if (sourceConversationCount > 0) {
        log.push(`Fonte ${source.label} retornou conversas; fallback encerrado.`);
        break;
      }
    }

    if (totalRemoteConversations === 0) {
      const grantedPermissions = await getGrantedPermissions();
      const requiredPermissions = [
        "instagram_manage_messages",
        "pages_manage_metadata",
        "pages_read_engagement",
        "instagram_basic",
      ];
      const missingPermissions = requiredPermissions.filter((permission) => !grantedPermissions.includes(permission));

      throw new Error(
        missingPermissions.length > 0
          ? `A API da Meta não retornou conversas. Faltam permissões no token atual: ${missingPermissions.join(", ")}. Gere um token de usuário/página com essas permissões e com a Página do Facebook conectada ao Instagram.`
          : `A API da Meta não retornou conversas para este token/conta. Verifique se o Instagram está vinculado à Página configurada e se há DMs acessíveis pela API nos últimos 30 dias.`,
      );
    }

    return new Response(
      JSON.stringify({ success: true, stats, log }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("backfill failed", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : String(e), stats, log }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});