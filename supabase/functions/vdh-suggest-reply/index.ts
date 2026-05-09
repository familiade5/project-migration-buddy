// VDH — Sugestão de resposta rápida via Lovable AI
// Recebe a última mensagem do lead + lista de respostas; retorna a melhor sugestão.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

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

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: hasAccess } = await admin.rpc("has_vdh_inbox_access", { _user_id: userId });
  if (!hasAccess) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { message?: string };
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const message = (body.message ?? "").trim();
  if (!message) {
    return new Response(JSON.stringify({ suggestion: null }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: replies } = await admin
    .from("vdh_quick_replies")
    .select("id, title, keywords, content")
    .eq("is_active", true);

  if (!replies || replies.length === 0) {
    return new Response(JSON.stringify({ suggestion: null }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const repliesText = replies.map((r, i) =>
    `${i + 1}. ID=${r.id} | TÍTULO="${r.title}" | PALAVRAS-CHAVE="${r.keywords ?? ""}"`
  ).join("\n");

  const systemPrompt = `Você é um classificador. Analise a mensagem de um lead imobiliário e identifique se alguma das respostas prontas se encaixa.

Respostas disponíveis:
${repliesText}

Responda APENAS em JSON com este formato exato:
{"reply_id": "<uuid ou null>", "confidence": <0 a 1>}

Use confidence alto (0.7+) só quando tiver certeza. Se nenhuma resposta se encaixar bem, retorne {"reply_id": null, "confidence": 0}.`;

  try {
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Mensagem do lead: "${message}"` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      console.error("AI gateway error", aiRes.status, await aiRes.text());
      return new Response(JSON.stringify({ suggestion: null }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const content = aiJson.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    const replyId = parsed.reply_id;
    const confidence = Number(parsed.confidence ?? 0);

    if (!replyId || confidence < 0.5) {
      return new Response(JSON.stringify({ suggestion: null }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const matched = replies.find((r) => r.id === replyId);
    if (!matched) {
      return new Response(JSON.stringify({ suggestion: null }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      suggestion: { id: matched.id, title: matched.title, content: matched.content, confidence },
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("suggest-reply error", e);
    return new Response(JSON.stringify({ suggestion: null }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});