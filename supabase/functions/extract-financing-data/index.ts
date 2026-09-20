import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `Você é um analista de crédito imobiliário da CAIXA. Receberá um documento (simulação de financiamento, carta de crédito, proposta, laudo, aprovação de crédito, planilha ou print de simulador) e deve extrair os dados do financiamento para preencher a ficha do cliente.

Regras:
- NUNCA invente valores. Se um dado não constar no documento, deixe o campo fora do retorno (null).
- Valores monetários como NÚMERO puro em reais (ex.: 235000.5), sem "R$", sem separador de milhar.
- "bank" deve ser o nome do banco/instituição (ex.: "Caixa Econômica Federal", "Itaú", "Bradesco", "Banco do Brasil", "Santander", "Inter").
- "property_value" = valor de venda/avaliação do imóvel; "financing_value" = valor financiado; "down_payment" = recursos próprios/entrada; "fgts_value" = FGTS utilizado; "subsidy_value" = subsídio/desconto do governo (MCMV); "monthly_income" = renda bruta familiar considerada; "installment_value" = valor da primeira prestação/parcela total.
- "rating" = rating/score do cliente informado pelo banco, se houver.
- "margin_value" = margem de comprometimento disponível; "approved_value" = valor aprovado/limite de crédito.
- "pendencies" = pendências, condicionantes ou exigências listadas no documento.
- "notes" = resumo curto com prazo (meses), sistema de amortização, taxa de juros e demais informações relevantes.
- Retorne APENAS pela função extract_financing_data.`;

const tool = {
  type: "function",
  function: {
    name: "extract_financing_data",
    description: "Dados do financiamento extraídos do documento",
    parameters: {
      type: "object",
      properties: {
        bank: { type: ["string", "null"] },
        property_value: { type: ["number", "null"] },
        financing_value: { type: ["number", "null"] },
        down_payment: { type: ["number", "null"] },
        fgts_value: { type: ["number", "null"] },
        subsidy_value: { type: ["number", "null"] },
        monthly_income: { type: ["number", "null"] },
        installment_value: { type: ["number", "null"] },
        rating: { type: ["string", "null"] },
        margin_value: { type: ["number", "null"] },
        approved_value: { type: ["number", "null"] },
        pendencies: { type: ["string", "null"] },
        notes: { type: ["string", "null"] },
      },
      required: [],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, mimeType } = await req.json();

    if (!fileBase64 || typeof fileBase64 !== "string") {
      return new Response(JSON.stringify({ error: "Arquivo não enviado" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const mime = typeof mimeType === "string" && mimeType ? mimeType : "image/jpeg";
    const isPdf = mime.includes("pdf");

    const contentBlock = isPdf
      ? {
          type: "file",
          file: { filename: "financiamento.pdf", file_data: `data:${mime};base64,${fileBase64}` },
        }
      : {
          type: "image_url",
          image_url: { url: `data:${mime};base64,${fileBase64}` },
        };

    let response: Response | null = null;
    let lastError = "";

    for (let attempt = 1; attempt <= 3; attempt++) {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: "Extraia os dados do financiamento deste documento." },
                contentBlock,
              ],
            },
          ],
          tools: [tool],
          tool_choice: { type: "function", function: { name: "extract_financing_data" } },
        }),
      });

      if (response.ok) break;
      lastError = await response.text();
      console.error(`Tentativa ${attempt} falhou (${response.status}): ${lastError}`);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas solicitações. Aguarde alguns segundos e tente novamente." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos no workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status < 500) break;
      await new Promise((r) => setTimeout(r, attempt * 1000));
    }

    if (!response || !response.ok) {
      return new Response(
        JSON.stringify({ error: `Falha na leitura do documento: ${lastError.slice(0, 300)}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const result = await response.json();
    const call = result?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      return new Response(
        JSON.stringify({ error: "A IA não conseguiu extrair dados deste documento." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = JSON.parse(call.function.arguments);
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro inesperado" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
