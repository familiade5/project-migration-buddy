import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `Você é um analista de crédito imobiliário da CAIXA. Receberá um resultado SIRIC, análise de risco, simulação, carta de crédito, proposta, laudo, planilha ou captura do sistema e deve extrair os dados para uma NOVA análise histórica.

Regras:
- NUNCA invente valores. Se um dado não constar no documento, deixe o campo fora do retorno (null).
- Valores monetários como NÚMERO puro em reais (ex.: 235000.5), sem "R$", sem separador de milhar.
- "bank" deve ser o nome do banco/instituição (ex.: "Caixa Econômica Federal", "Itaú", "Bradesco", "Banco do Brasil", "Santander", "Inter").
- "property_value" = valor de venda/avaliação do imóvel; "financing_value" = valor financiado; "down_payment" = recursos próprios/entrada; "fgts_value" = FGTS utilizado; "subsidy_value" = subsídio/desconto do governo (MCMV); "monthly_income" = renda bruta familiar considerada; "installment_value" = valor da primeira prestação/parcela total.
- Classifique "result" como "aprovado", "condicionado", "reprovado" ou "erro". "Avaliação de Risco Aprovada não Propagada" é aprovada. Não confunda erro de validação com reprovação.
- Extraia literalmente códigos da proposta, avaliação e correspondente, CPF/nome, protocolo, agência, operador, datas de validade, origem de recurso, modalidade, produto, linha MCMV/SBPE, faixa, indexador, amortização, prazo e sistema originador.
- Se condicionado, separe a mensagem em "condition_reason" e a prestação possível em "possible_installment".
- Se reprovado, classifique "rejection_category" como "rating", "capacidade" ou "outro" e preserve a mensagem literal em "rejection_reason".
- Se erro, preserve a mensagem em "error_message" e a pergunta/referência em "error_reference".
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
        result: { type: ["string", "null"], enum: ["aprovado", "condicionado", "reprovado", "erro", null] },
        proposal_code: { type: ["string", "null"] },
        appraisal_code: { type: ["string", "null"] },
        correspondent_code: { type: ["string", "null"] },
        analyzed_cpf: { type: ["string", "null"] },
        analyzed_name: { type: ["string", "null"] },
        registration_protocol: { type: ["string", "null"] },
        relationship_agency: { type: ["string", "null"] },
        funding_source: { type: ["string", "null"] },
        modality: { type: ["string", "null"] },
        product: { type: ["string", "null"] },
        credit_line: { type: ["string", "null"], enum: ["mcmv", "sbpe", "outro", null] },
        mcmv_tier: { type: ["string", "null"], enum: ["faixa_1", "faixa_2", "faixa_3", "faixa_4", null] },
        bank: { type: ["string", "null"] },
        property_value: { type: ["number", "null"] },
        financing_value: { type: ["number", "null"] },
        down_payment: { type: ["number", "null"] },
        fgts_value: { type: ["number", "null"] },
        subsidy_value: { type: ["number", "null"] },
        monthly_income: { type: ["number", "null"] },
        installment_value: { type: ["number", "null"] },
        possible_installment: { type: ["number", "null"] },
        indexer: { type: ["string", "null"] },
        amortization_system: { type: ["string", "null"] },
        term_months: { type: ["integer", "null"] },
        originating_system: { type: ["string", "null"] },
        validity_start: { type: ["string", "null"] },
        validity_end: { type: ["string", "null"] },
        rating: { type: ["string", "null"] },
        margin_value: { type: ["number", "null"] },
        approved_value: { type: ["number", "null"] },
        condition_category: { type: ["string", "null"] },
        condition_reason: { type: ["string", "null"] },
        rejection_category: { type: ["string", "null"], enum: ["rating", "capacidade", "outro", null] },
        rejection_reason: { type: ["string", "null"] },
        error_message: { type: ["string", "null"] },
        error_reference: { type: ["string", "null"] },
        operator_name: { type: ["string", "null"] },
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
    const { fileBase64, mimeType, fileName, pageImages } = await req.json();
    const pages: string[] = Array.isArray(pageImages) ? pageImages.filter((x: unknown) => typeof x === "string" && x).slice(0, 40) : [];

    if (pages.length === 0 && (!fileBase64 || typeof fileBase64 !== "string")) {
      return new Response(JSON.stringify({ error: "Arquivo não enviado" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const mime = typeof mimeType === "string" && mimeType ? mimeType : "image/jpeg";
    const isPdf = mime.includes("pdf");

    const contentBlocks: unknown[] = pages.length > 0
      ? pages.map((page) => ({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${page}` } }))
      : [isPdf
      ? {
          type: "file",
          file: { filename: typeof fileName === "string" && fileName ? fileName : "financiamento.pdf", file_data: `data:${mime};base64,${fileBase64}` },
        }
      : {
          type: "image_url",
          image_url: { url: `data:${mime};base64,${fileBase64}` },
        }];

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
                ...contentBlocks,
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
