// VDH Train Knowledge — analisa o histórico do Instagram com IA (Gemini)
// e atualiza vdh_ai_knowledge com perguntas frequentes + tom de voz.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const SYSTEM_CONTEXT = `A Venda Direta Hoje (VDH) trabalha EXCLUSIVAMENTE com Venda Direta e Venda Direta Online da Caixa Econômica Federal — imóveis retomados pela Caixa, vendidos diretamente pelo banco (sem leilão), com excelentes descontos. Modalidades de pagamento: à vista, financiamento Caixa, uso de FGTS e parcelamento Caixa.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Buscar últimas 500 mensagens
    const { data: msgs, error } = await supabase
      .from("vdh_messages")
      .select("direction, text, created_at, conversation_id")
      .not("text", "is", null)
      .neq("text", "")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;
    if (!msgs || msgs.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Nenhuma mensagem para treinar. Importe o histórico primeiro." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Agrupar por conversa para contexto
    const byConv: Record<string, any[]> = {};
    for (const m of msgs) {
      (byConv[m.conversation_id] ??= []).push(m);
    }
    const transcript = Object.values(byConv)
      .slice(0, 80)
      .map((arr) =>
        arr.reverse().map((m: any) => `${m.direction === "in" ? "LEAD" : "VDH"}: ${m.text}`).join("\n"),
      )
      .join("\n---\n");

    const prompt = `Você está analisando o histórico de DMs do Instagram de uma imobiliária.

CONTEXTO FIXO DO NEGÓCIO:
${SYSTEM_CONTEXT}

TRANSCRIÇÕES (LEAD = cliente, VDH = atendente):
${transcript.slice(0, 60000)}

Sua tarefa:
1. Liste as 15 perguntas/intenções mais comuns dos LEADS, com a melhor resposta padrão (curta, em português, tom usado pela VDH).
2. Descreva o tom de voz e estilo de atendimento da VDH em 3-5 bullets curtos.

Responda SOMENTE em JSON válido:
{
  "common_questions": [{"question":"...", "intent":"...", "suggested_reply":"..."}],
  "tone_guidelines": "..."
}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: "Você é um analista de atendimento. Responda apenas JSON válido." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      throw new Error(`AI ${aiRes.status}: ${t}`);
    }
    const aiJson = await aiRes.json();
    let content: string = aiJson?.choices?.[0]?.message?.content ?? "{}";
    content = content.replace(/```json\s*|\s*```/g, "").trim();
    let parsed: any = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
    }

    // Pegar registro existente (sempre 1)
    const { data: existing } = await supabase
      .from("vdh_ai_knowledge")
      .select("id")
      .limit(1)
      .maybeSingle();

    const payload = {
      business_context: SYSTEM_CONTEXT,
      common_questions: parsed.common_questions ?? [],
      tone_guidelines: parsed.tone_guidelines ?? "",
      trained_messages_count: msgs.length,
      last_trained_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase.from("vdh_ai_knowledge").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("vdh_ai_knowledge").insert(payload);
    }

    return new Response(
      JSON.stringify({ success: true, trained: msgs.length, knowledge: payload }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("train failed", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});