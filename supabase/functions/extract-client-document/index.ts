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
  matricula_imovel:
    "Matrícula do imóvel / certidão narrativa do registro de imóveis. Extraia: Número da matrícula, Cartório/Registro de Imóveis, Endereço e descrição do imóvel, Averbações, Registros, Ônus (penhoras, alienações, hipotecas, cauções), Proprietários.",
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
    const isIrpf = type === "imposto_renda";
    const isProperty = type === "matricula_imovel";

    const bankPrompt = `Você é um analista de crédito imobiliário da CAIXA especializado em comprovação de renda por extrato bancário.

Leia o extrato bancário enviado e liste TODAS as entradas (créditos) do período, uma por uma, com data, descrição original, contraparte (quem enviou) e valor.

Para cada crédito, decida se ele CONTA como renda (included = true) ou NÃO CONTA (included = false), seguindo estas regras rígidas:
- NÃO CONTA: transferência, PIX, TED ou DOC recebido em que a contraparte é a MESMA PESSOA titular da conta (mesmo nome ou mesmo CPF do titular) — é dinheiro dele mesmo.
- NÃO CONTA: estornos, devoluções, cancelamentos, "estorno de", "devolução de compra", chargeback.
- NÃO CONTA (MUITO IMPORTANTE): qualquer crédito vindo de casas de apostas, bets, cassinos, jogos de azar, loterias online, apostas esportivas ou plataformas de jogos (ex.: Bet365, Betano, Blaze, Betfair, Sportingbet, Pixbet, Estrela Bet, KTO, Stake, "BET", "CASSINO", "GAMING", "APOSTAS", "LOTERIA", "JOGOS"). Bancos NÃO aceitam esse tipo de valor como renda. Nesses casos SEMPRE use kind = "aposta", included = false e reason = "Casa de apostas/jogos".
- NÃO CONTA: resgates de aplicação/poupança, transferências entre contas do próprio titular, empréstimos, financiamentos, cheque especial, saldo anterior.
- NÃO CONTA: lançamentos duplicados do mesmo valor no mesmo dia que sejam claramente o par de um estorno.
- CONTA: salário, pró-labore, pagamentos de clientes, PIX/TED de terceiros com origem em pessoa ou empresa DIFERENTE do titular, depósitos em dinheiro, benefícios recorrentes.
- Débitos/saídas NÃO devem ser listados.
Sempre preencha "reason" explicando em poucas palavras por que foi contado ou descartado (ex.: "PIX do próprio titular", "estorno", "PIX de terceiro", "Casa de apostas/jogos").

Regras gerais:
- NUNCA invente lançamentos. Liste apenas o que está no extrato.
- "amount" deve ser um NÚMERO puro em reais (ex.: 1520.35), sem "R$" e sem separador de milhar.
- "date" no formato DD/MM/AAAA.
- Em "months" liste as competências presentes no formato MM/AAAA.
- Em "periodStart" e "periodEnd" informe a PRIMEIRA e a ÚLTIMA data do período coberto pelo extrato, no formato DD/MM/AAAA, exatamente como consta no cabeçalho do documento (ou, na falta dele, a primeira e a última data de lançamento).
- Em "groups" traga os dados de identificação (Titular, Banco, Agência, Conta, Período, CPF se visível).
- Retorne o resultado APENAS pela função extract_document_data.`;


    const irpfPrompt = `Você é um analista de crédito imobiliário da CAIXA especializado em leitura de Declaração de Imposto de Renda Pessoa Física (IRPF).

Leia a declaração completa e preencha a função extract_document_data com "irpfAnalysis", detalhando:

1) RENDIMENTOS TRIBUTÁVEIS RECEBIDOS DE PESSOA JURÍDICA (ficha/quadro "RENDIMENTOS TRIBUTÁVEIS RECEBIDOS DE PESSOA JURÍDICA PELO TITULAR"): a tabela tem as colunas "NOME DA FONTE PAGADORA" (com a linha "CNPJ/CPF:" logo abaixo), "REND. RECEBIDOS DE PES. JURÍDICA", "CONTR. PREVID. OFICIAL", "IMPOSTO RETIDO NA FONTE", "13º SALÁRIO" e "IRRF SOBRE 13º SALÁRIO". Crie UM item por fonte pagadora com: cnpj (o CNPJ/CPF logo abaixo do nome), sourceName (nome completo da fonte, mesmo quebrado em várias linhas), taxableIncome (REND. RECEBIDOS), inssAmount (CONTR. PREVID. OFICIAL), irrfAmount (IMPOSTO RETIDO NA FONTE), thirteenthSalary (13º SALÁRIO) e irrf13Amount (IRRF SOBRE 13º). NÃO inclua a linha "TOTAL" como fonte pagadora. Marque inssWithheld = true SOMENTE se CONTR. PREVID. OFICIAL > 0 para aquela fonte; caso contrário false (0,00 = false).

2) RENDIMENTOS ISENTOS E NÃO TRIBUTÁVEIS (quadro "RENDIMENTOS ISENTOS E NÃO TRIBUTÁVEIS"): esse quadro tem itens numerados; alguns têm subtabelas com "Beneficiário / CPF / CNPJ da Fonte Pagadora / Nome da Fonte Pagadora / Valor". Liste UMA linha por fonte pagadora dessas subtabelas (e uma linha para os itens sem subtabela), sempre com description (o texto do item, ex.: "13. Rendimento de sócio ou titular de microempresa..."), cnpj (CNPJ da fonte pagadora), sourceName e amount.
   Marque isProfitDistribution = true APENAS para lucros e dividendos recebidos, distribuição/retirada de lucro e "Rendimento de sócio ou titular de microempresa ou empresa de pequeno porte optante pelo Simples Nacional". Itens como poupança, LCI/LCA, CRI/CRA, indenizações, PLR, bolsas e heranças têm isProfitDistribution = false.

3) BENS E DIREITOS (ficha "Bens e Direitos"): liste cada bem com código, descrição e valor, e classifique category como: "empresa" (participação societária, quotas, capital social, ações de empresa própria), "imovel" (apartamento, casa, terreno, sala, loja), "veiculo" ou "outro".

Regras:
- NUNCA invente dados; liste apenas o que consta na declaração.
- Valores como NÚMERO puro em reais (ex.: 125430.55), sem "R$" e sem separador de milhar.
- CNPJ no formato 00.000.000/0000-00.
- Em "groups" traga os dados de identificação e os totais (Declarante, CPF, Exercício/Ano-calendário, Total de rendimentos tributáveis, Total de isentos, Imposto devido, Imposto a pagar/restituir, Total de bens e direitos).
- Retorne o resultado APENAS pela função extract_document_data.`;


    const propertyPrompt = `Você é um analista de correspondente bancário CAIXA especializado em análise de matrícula de imóvel / certidão narrativa do registro de imóveis, verificando se há impedimentos para a transferência do bem.

Leia TODOS os atos (registros R-x e averbações AV-x) da matrícula, do primeiro ao último, e preencha "propertyAnalysis":

1) IMÓVEL: "address" com o endereço completo atual do imóvel (com CEP se constar) e "description" com a descrição do imóvel (tipo, área privativa/total, fração ideal, confrontações resumidas, vaga, unidade, bloco).

2) ÔNUS E RESTRIÇÕES ("liens"): liste TODA penhora, arresto, indisponibilidade, hipoteca, alienação fiduciária, caução, usufruto, cláusula de inalienabilidade, ação judicial, execução fiscal ou qualquer ato que possa impedir a transferência. Para cada um: type (penhora, alienacao_fiduciaria, caucao, hipoteca, usufruto, processo, indisponibilidade ou outro), act (ex.: "AV-7"), date (DD/MM/AAAA), creditor (banco/credor/exequente), description (texto resumido do ato, incluindo número do processo e vara quando houver) e active = false SOMENTE se houver averbação posterior de baixa/cancelamento/quitação do mesmo ato; caso contrário active = true.

3) ENDEREÇOS E CONSTRUÇÕES ("addressEntries"): liste em ordem cronológica as averbações de mudança/retificação de endereço/denominação de logradouro e as averbações de construção/habite-se/ampliação/demolição, com act, date, kind ("endereco" ou "construcao"), address (endereço averbado), cep (quando constar) e description. Preencha também "firstAddress" (o endereço da abertura da matrícula) e "lastAddress" (o endereço mais recente averbado), ambos com CEP quando houver.

4) MATRÍCULA: "registrationNumber" (número da matrícula) e "notaryOffice" (nome/número do cartório de registro de imóveis e comarca/UF).

5) PROPRIETÁRIOS ("owners"): liste os proprietários na ordem cronológica dos registros, priorizando os ÚLTIMOS. Para cada um: name (nome completo), cpf, qualification (nacionalidade, estado civil, regime de bens, profissão, cônjuge — exatamente como consta) , acquisitionAct (ex.: "R-5"), acquisitionDate e current = true apenas para o(s) proprietário(s) atual(is).

6) MATRÍCULA MUNICIPAL / IPU: "municipalRegistration" com a numeração da inscrição municipal, IPTU ou IPU quando constar no documento. Se NÃO houver, deixe o campo ausente (não invente).

7) FGTS: "fgtsUsed" = true se algum registro/averbação mencionar uso do FGTS na aquisição (ex.: "com recursos do FGTS", "utilização de recursos do FGTS", SFH com FGTS); nesse caso preencha "fgtsDate" com a data do ato (DD/MM/AAAA) e "fgtsNote" com o trecho resumido. Se não houver menção, fgtsUsed = false.

Regras:
- NUNCA invente dados; extraia apenas o que consta no documento.
- Datas DD/MM/AAAA, CPF 000.000.000-00, CEP 00000-000.
- Em "groups" traga um resumo de identificação (Matrícula, Cartório, Endereço, Proprietário atual, Área, Inscrição municipal).
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
            irpfAnalysis: {
              type: "object",
              description: "Preencher SOMENTE quando o documento for uma Declaração de Imposto de Renda (IRPF).",
              properties: {
                holder: { type: "string" },
                cpf: { type: "string" },
                year: { type: "string", description: "Exercício / ano-calendário" },
                pjIncomes: {
                  type: "array",
                  description: "Rendimentos tributáveis recebidos de pessoa jurídica, um item por fonte pagadora.",
                  items: {
                    type: "object",
                    properties: {
                      cnpj: { type: "string" },
                      sourceName: { type: "string" },
                      taxableIncome: { type: "number" },
                      inssWithheld: { type: "boolean", description: "true se houve contribuição previdenciária oficial (INSS) para essa fonte" },
                      inssAmount: { type: "number" },
                      irrfAmount: { type: "number" },
                      thirteenthSalary: { type: "number", description: "Coluna 13º SALÁRIO" },
                      irrf13Amount: { type: "number", description: "Coluna IRRF SOBRE 13º SALÁRIO" },
                    },
                    required: ["taxableIncome", "inssWithheld"],
                    additionalProperties: false,
                  },
                },
                exemptIncomes: {
                  type: "array",
                  description: "Rendimentos isentos e não tributáveis.",
                  items: {
                    type: "object",
                    properties: {
                      description: { type: "string" },
                      cnpj: { type: "string" },
                      sourceName: { type: "string" },
                      amount: { type: "number" },
                      isProfitDistribution: { type: "boolean", description: "true para lucros/dividendos, retirada de lucro ou rendimento de sócio" },
                    },
                    required: ["description", "amount", "isProfitDistribution"],
                    additionalProperties: false,
                  },
                },
                assets: {
                  type: "array",
                  description: "Bens e direitos declarados.",
                  items: {
                    type: "object",
                    properties: {
                      code: { type: "string" },
                      description: { type: "string" },
                      category: { type: "string", description: "empresa, imovel, veiculo ou outro" },
                      value: { type: "number" },
                    },
                    required: ["description", "category"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["pjIncomes", "exemptIncomes", "assets"],
              additionalProperties: false,
            },
            propertyAnalysis: {
              type: "object",
              description: "Preencher SOMENTE quando o documento for matrícula de imóvel / certidão narrativa.",
              properties: {
                address: { type: "string" },
                description: { type: "string" },
                registrationNumber: { type: "string" },
                notaryOffice: { type: "string" },
                municipalRegistration: { type: "string", description: "Inscrição municipal / IPTU / IPU" },
                firstAddress: { type: "string" },
                lastAddress: { type: "string" },
                liens: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { type: "string", description: "penhora, alienacao_fiduciaria, caucao, hipoteca, usufruto, processo, indisponibilidade, outro" },
                      act: { type: "string" },
                      date: { type: "string" },
                      creditor: { type: "string" },
                      description: { type: "string" },
                      active: { type: "boolean" },
                    },
                    required: ["type", "description", "active"],
                    additionalProperties: false,
                  },
                },
                addressEntries: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      act: { type: "string" },
                      date: { type: "string" },
                      kind: { type: "string", description: "endereco ou construcao" },
                      address: { type: "string" },
                      cep: { type: "string" },
                      description: { type: "string" },
                    },
                    required: ["kind"],
                    additionalProperties: false,
                  },
                },
                owners: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      cpf: { type: "string" },
                      qualification: { type: "string" },
                      acquisitionAct: { type: "string" },
                      acquisitionDate: { type: "string" },
                      current: { type: "boolean" },
                    },
                    required: ["name"],
                    additionalProperties: false,
                  },
                },
                fgtsUsed: { type: "boolean" },
                fgtsDate: { type: "string" },
                fgtsNote: { type: "string" },
              },
              required: ["liens", "addressEntries", "owners", "fgtsUsed"],
              additionalProperties: false,
            },
            bankAnalysis: {
              type: "object",
              description: "Preencher SOMENTE quando o documento for um extrato bancário.",
              properties: {
                holder: { type: "string" },
                bank: { type: "string" },
                account: { type: "string" },
                period: { type: "string" },
                periodStart: { type: "string", description: "Primeira data coberta pelo extrato (DD/MM/AAAA)" },
                periodEnd: { type: "string", description: "Última data coberta pelo extrato (DD/MM/AAAA)" },
                months: { type: "array", items: { type: "string" } },
                credits: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: { type: "string" },
                      description: { type: "string" },
                      counterparty: { type: "string" },
                      kind: { type: "string", description: "pix, ted, doc, deposito, salario, estorno, resgate, aposta, outro. Use 'aposta' para casas de apostas/bets/cassinos/jogos." },
                      amount: { type: "number" },
                      included: { type: "boolean" },
                      reason: { type: "string" },
                    },
                    required: ["date", "description", "amount", "included", "reason"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["credits", "months"],
              additionalProperties: false,
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
            { role: "system", content: isBank ? bankPrompt : isIrpf ? irpfPrompt : isProperty ? propertyPrompt : systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: isBank
                    ? "Liste todos os créditos deste extrato bancário e classifique cada um conforme as regras."
                    : isIrpf
                    ? "Extraia os rendimentos de PJ, os rendimentos isentos e não tributáveis e os bens e direitos desta declaração de imposto de renda."
                    : isProperty
                    ? "Analise esta matrícula/narrativa do imóvel: endereço, ônus (penhoras, alienações, cauções, processos), averbações de endereço e construção, matrícula e cartório, proprietários com CPF e qualificação, inscrição municipal/IPU e uso de FGTS."
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
        periodStart: data.bankAnalysis.periodStart || null,
        periodEnd: data.bankAnalysis.periodEnd || null,
        months: Array.isArray(data.bankAnalysis.months) ? data.bankAnalysis.months.map(String) : [],
        credits,
      };
    }

    let irpfAnalysis = null;
    if (isIrpf && data.irpfAnalysis) {
      const a = data.irpfAnalysis;
      const num = (v: unknown) => (Number(v) || 0);
      irpfAnalysis = {
        holder: a.holder || null,
        cpf: a.cpf || null,
        year: a.year || null,
        pjIncomes: Array.isArray(a.pjIncomes)
          ? a.pjIncomes.map((r: Record<string, unknown>) => ({
              cnpj: r.cnpj ? String(r.cnpj) : null,
              sourceName: r.sourceName ? String(r.sourceName) : null,
              taxableIncome: num(r.taxableIncome),
              inssWithheld: r.inssWithheld === true || num(r.inssAmount) > 0,
              inssAmount: r.inssAmount != null ? num(r.inssAmount) : null,
              irrfAmount: r.irrfAmount != null ? num(r.irrfAmount) : null,
              thirteenthSalary: r.thirteenthSalary != null ? num(r.thirteenthSalary) : null,
              irrf13Amount: r.irrf13Amount != null ? num(r.irrf13Amount) : null,
            }))
            .filter((r: { taxableIncome: number; sourceName: string | null }) =>
              r.taxableIncome > 0 && !/^total$/i.test((r.sourceName || "").trim()))
          : [],
        exemptIncomes: Array.isArray(a.exemptIncomes)
          ? a.exemptIncomes
              .map((r: Record<string, unknown>) => ({
                description: String(r.description || ""),
                cnpj: r.cnpj ? String(r.cnpj) : null,
                sourceName: r.sourceName ? String(r.sourceName) : null,
                amount: num(r.amount),
                isProfitDistribution: r.isProfitDistribution === true,
              }))
              .filter((r: { amount: number }) => r.amount > 0)
          : [],
        assets: Array.isArray(a.assets)
          ? a.assets.map((r: Record<string, unknown>) => ({
              code: r.code ? String(r.code) : null,
              description: String(r.description || ""),
              category: r.category ? String(r.category).toLowerCase() : "outro",
              value: r.value != null ? num(r.value) : null,
            }))
          : [],
      };
    }

    let propertyAnalysis = null;
    if (isProperty && data.propertyAnalysis) {
      const a = data.propertyAnalysis;
      const str = (v: unknown) => (v != null && String(v).trim() !== "" ? String(v).trim() : null);
      propertyAnalysis = {
        address: str(a.address),
        description: str(a.description),
        registrationNumber: str(a.registrationNumber),
        notaryOffice: str(a.notaryOffice),
        municipalRegistration: str(a.municipalRegistration),
        firstAddress: str(a.firstAddress),
        lastAddress: str(a.lastAddress),
        liens: Array.isArray(a.liens)
          ? a.liens
              .map((l: Record<string, unknown>) => ({
                type: String(l.type || "outro").toLowerCase(),
                act: str(l.act),
                date: str(l.date),
                creditor: str(l.creditor),
                description: String(l.description || ""),
                active: l.active !== false,
              }))
              .filter((l: { description: string }) => l.description.trim() !== "")
          : [],
        addressEntries: Array.isArray(a.addressEntries)
          ? a.addressEntries.map((e: Record<string, unknown>) => ({
              act: str(e.act),
              date: str(e.date),
              kind: String(e.kind || "endereco").toLowerCase(),
              address: str(e.address),
              cep: str(e.cep),
              description: str(e.description),
            }))
          : [],
        owners: Array.isArray(a.owners)
          ? a.owners
              .map((o: Record<string, unknown>) => ({
                name: String(o.name || ""),
                cpf: str(o.cpf),
                qualification: str(o.qualification),
                acquisitionAct: str(o.acquisitionAct),
                acquisitionDate: str(o.acquisitionDate),
                current: o.current === true,
              }))
              .filter((o: { name: string }) => o.name.trim() !== "")
          : [],
        fgtsUsed: a.fgtsUsed === true,
        fgtsDate: str(a.fgtsDate),
        fgtsNote: str(a.fgtsNote),
      };
    }

    return new Response(
      JSON.stringify({
        data: {
          documentType: data.documentType || null,
          summary: data.summary || null,
          groups,
          bankAnalysis,
          irpfAnalysis,
          propertyAnalysis,
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
