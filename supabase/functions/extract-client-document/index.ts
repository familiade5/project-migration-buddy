import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DOC_HINTS: Record<string, string> = {
  rg: "Documento de identidade (RG/CNH). Extraia: Nome completo, Nome da mãe, Nome do pai, Data de nascimento, Naturalidade, RG (número), Órgão emissor/UF, Data de expedição, CPF.",
  cpf: "Documento de CPF. Extraia: Nome completo, CPF, Data de nascimento.",
  certidao:
    "Certidão de nascimento ou casamento. Extraia: Tipo de certidão, Estado civil, Nome completo, Nome do cônjuge (se casamento), Regime de bens, Data do casamento/nascimento, Matrícula da certidão, Cartório.",
  comprovante_residencia:
    "Comprovante de residência. Extraia: Nome do titular, Logradouro, Número, Complemento, Bairro, Cidade, UF, CEP, Mês de referência, Concessionária/empresa.",
  contracheque:
    "Contracheque/holerite. Extraia OBRIGATORIAMENTE: Nome do empregado, CPF, Empresa (razão social), CNPJ, Mês de referência, Cargo, Data de admissão, Salário base, Valor bruto (total de proventos), Adiantamento, Valor do imposto recolhido (IRRF), INSS, Valor líquido.",
  imposto_renda:
    "Declaração de Imposto de Renda. Extraia: Nome do declarante, CPF, Ano-calendário/exercício, Renda tributável total, Imposto devido, Imposto a restituir ou a pagar, Total de bens e direitos.",
  recibo_ir:
    "Recibo de entrega da Declaração de Imposto de Renda. Extraia: Nome, CPF, Exercício/ano-calendário, Número do recibo, Data/hora da transmissão.",
  ctps:
    "Carteira de Trabalho (CTPS). Extraia: Nome completo, CPF, PIS/PASEP, Número e série da CTPS, Empresa atual, CNPJ, Cargo, Data de admissão, Último salário registrado.",
  extrato_fgts:
    "Extrato de FGTS. Extraia: Nome do trabalhador, CPF, PIS/PASEP, Empregador, CNPJ, Saldo total do FGTS, Data do saldo, Conta/Número da conta vinculada.",
  extrato_bancario:
    "Extrato bancário usado para comprovação de renda. Extraia: Nome do titular, Banco, Agência/Conta, Período do extrato e TODAS as entradas (créditos) do período.",
  outro: "Documento genérico. Extraia todos os dados identificáveis relevantes para análise de crédito imobiliário.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, mimeType, fileName, docType } = await req.json();

    if (!fileBase64 || typeof fileBase64 !== "string") {
      return new Response(JSON.stringify({ error: "Arquivo não enviado" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const type = typeof docType === "string" && DOC_HINTS[docType] ? docType : "outro";
    const mime = typeof mimeType === "string" && mimeType ? mimeType : "image/jpeg";
    const isPdf = mime.includes("pdf");

    const isBank = type === "extrato_bancario";

    const bankPrompt = `Você é um analista de crédito imobiliário da CAIXA especializado em comprovação de renda por extrato bancário.

Leia o extrato bancário enviado e liste TODAS as entradas (créditos) do período, uma por uma, com data, descrição original, contraparte (quem enviou) e valor.

Para cada crédito, decida se ele CONTA como renda (included = true) ou NÃO CONTA (included = false), seguindo estas regras rígidas:
- NÃO CONTA: transferência, PIX, TED ou DOC recebido em que a contraparte é a MESMA PESSOA titular da conta (mesmo nome ou mesmo CPF do titular) — é dinheiro dele mesmo.
- NÃO CONTA: estornos, devoluções, cancelamentos, "estorno de", "devolução de compra", chargeback.
- NÃO CONTA: resgates de aplicação/poupança, transferências entre contas do próprio titular, empréstimos, financiamentos, cheque especial, saldo anterior.
- NÃO CONTA: lançamentos duplicados do mesmo valor no mesmo dia que sejam claramente o par de um estorno.
- CONTA: salário, pró-labore, pagamentos de clientes, PIX/TED de terceiros com origem em pessoa ou empresa DIFERENTE do titular, depósitos em dinheiro, benefícios recorrentes.
- Débitos/saídas NÃO devem ser listados.
Sempre preencha "reason" explicando em poucas palavras por que foi contado ou descartado (ex.: "PIX do próprio titular", "estorno", "PIX de terceiro").

Regras gerais:
- NUNCA invente lançamentos. Liste apenas o que está no extrato.
- "amount" deve ser um NÚMERO puro em reais (ex.: 1520.35), sem "R$" e sem separador de milhar.
- "date" no formato DD/MM/AAAA.
- Em "months" liste as competências presentes no formato MM/AAAA.
- Em "groups" traga os dados de identificação (Titular, Banco, Agência, Conta, Período, CPF se visível).
- Retorne o resultado APENAS pela função extract_document_data.`;

    const systemPrompt = `Você é um especialista em análise documental para correspondente bancário CAIXA (crédito imobiliário e preenchimento do SICAQ).

Leia o documento enviado e extraia os dados de forma literal e precisa. ${DOC_HINTS[type]}

Regras:
- NUNCA invente dados. Se um campo não estiver visível, simplesmente não o inclua.
- Copie exatamente como está no documento (mantenha acentos e maiúsculas do nome).
- Formate CPF como 000.000.000-00, CNPJ como 00.000.000/0000-00, CEP como 00000-000, datas como DD/MM/AAAA.
- Valores monetários no formato R$ 0.000,00.
- Se o documento tiver vários meses/competências (ex.: mais de um contracheque), gere um grupo separado para cada competência.
- Use rótulos curtos e claros em português (ex.: "CNPJ", "Valor Bruto", "Valor Líquido", "Mês de Referência").
- Retorne o resultado APENAS pela função extract_document_data.`;

    const contentBlock = isPdf
      ? {
          type: "file",
          file: {
            filename: typeof fileName === "string" && fileName ? fileName : "documento.pdf",
            file_data: `data:${mime};base64,${fileBase64}`,
          },
        }
      : {
          type: "image_url",
          image_url: { url: `data:${mime};base64,${fileBase64}` },
        };

    const tool = {
      type: "function",
      function: {
        name: "extract_document_data",
        description: "Retorna os dados extraídos do documento organizados em grupos e campos.",
        parameters: {
          type: "object",
          properties: {
            documentType: {
              type: "string",
              description: "Tipo de documento identificado (ex.: RG, CPF, Contracheque, Extrato FGTS).",
            },
            summary: { type: "string", description: "Resumo em uma frase do que é o documento." },
            groups: {
              type: "array",
              description: "Grupos de dados extraídos.",
              items: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Título do grupo (ex.: Dados Pessoais, Contracheque 03/2026)." },
                  fields: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        value: { type: "string" },
                      },
                      required: ["label", "value"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["title", "fields"],
                additionalProperties: false,
              },
            },
          },
          required: ["groups"],
          additionalProperties: false,
        },
      },
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
            { role: "system", content: isBank ? bankPrompt : systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: isBank
                    ? "Liste todos os créditos deste extrato bancário e classifique cada um conforme as regras."
                    : "Extraia os dados deste documento.",
                },
                contentBlock,
              ],
            },
          ],
          tools: [tool],
          tool_choice: { type: "function", function: { name: "extract_document_data" } },
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
    const groups = Array.isArray(data.groups)
      ? data.groups
          .map((g: { title?: string; fields?: { label?: string; value?: string }[] }) => ({
            title: String(g.title || "Dados"),
            fields: (g.fields || [])
              .filter((f) => f && f.label && f.value && String(f.value).trim() !== "")
              .map((f) => ({ label: String(f.label), value: String(f.value).trim() })),
          }))
          .filter((g: { fields: unknown[] }) => g.fields.length > 0)
      : [];

    let bankAnalysis = null;
    if (isBank && data.bankAnalysis && Array.isArray(data.bankAnalysis.credits)) {
      const credits = data.bankAnalysis.credits
        .map((c: Record<string, unknown>) => ({
          date: String(c.date || ""),
          description: String(c.description || ""),
          counterparty: c.counterparty ? String(c.counterparty) : null,
          kind: c.kind ? String(c.kind) : null,
          amount: Number(c.amount) || 0,
          included: c.included !== false,
          reason: c.reason ? String(c.reason) : null,
        }))
        .filter((c: { amount: number }) => c.amount > 0);
      bankAnalysis = {
        holder: data.bankAnalysis.holder || null,
        bank: data.bankAnalysis.bank || null,
        account: data.bankAnalysis.account || null,
        period: data.bankAnalysis.period || null,
        months: Array.isArray(data.bankAnalysis.months) ? data.bankAnalysis.months.map(String) : [],
        credits,
      };
    }

    return new Response(
      JSON.stringify({
        data: {
          documentType: data.documentType || null,
          summary: data.summary || null,
          groups,
          bankAnalysis,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("extract-client-document error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
