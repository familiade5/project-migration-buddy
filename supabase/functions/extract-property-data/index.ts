import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      console.error("No image provided");
      return new Response(
        JSON.stringify({ error: "Nenhuma imagem fornecida" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Extracting property data from image...");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Você é um especialista em extrair informações de imóveis de screenshots de sites de bancos brasileiros (Caixa, Banco do Brasil, etc.).

Analise a imagem e extraia TODAS as informações disponíveis sobre o imóvel. Retorne os dados usando a função extract_property_data.

Regras importantes:
- Extraia valores monetários no formato brasileiro (R$ 123.456,78)
- Calcule o desconto se houver valor de avaliação e valor mínimo
- Identifique se aceita FGTS baseado no texto (procure por "FGTS", "permite utilização de FGTS", etc.)
- IMPORTANTE sobre financiamento: Se nas formas de pagamento aparecer SOMENTE "Recurso Próprio" e/ou "FGTS" (sem mencionar "Financiamento Habitacional" ou "Parcelamento"), então acceptsFinancing deve ser FALSE
- Se aparecer "Financiamento Habitacional" ou menção explícita a financiamento bancário, então acceptsFinancing deve ser TRUE
- IMPORTANTE sobre entrada facilitada: Se NÃO houver menção a "Entrada Mínima", "Entrada Facilitada" ou valor de entrada, então hasEasyEntry deve ser FALSE
- Se houver valor de entrada especificado, extraia em entryValue
- Extraia cidade, estado e bairro separadamente
- Identifique o tipo de imóvel (Casa, Apartamento, Terreno, etc.)
- IMPORTANTE sobre quartos/banheiros/garagem: Só extraia se houver NÚMERO ESPECÍFICO mencionado. Se apenas mencionar "quarto" ou "banheiro" sem quantidade, DEIXE O CAMPO VAZIO. Não invente números.
- Extraia o ENDEREÇO COMPLETO incluindo rua, número, complemento, bairro, cidade e estado
- Para o paymentMethod, descreva as formas de pagamento disponíveis (ex: "À Vista, FGTS" ou "Financiamento Habitacional, FGTS")`;

    // Retry logic for transient errors
    let response: Response | null = null;
    let lastError: string = "";
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt} to call AI gateway...`);
        
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
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/png;base64,${imageBase64}`
                    }
                  },
                  {
                    type: "text",
                    text: "Extraia todas as informações do imóvel desta imagem do site da Caixa/Banco."
                  }
                ]
              }
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "extract_property_data",
                  description: "Extrai dados estruturados de um imóvel a partir de uma imagem",
                  parameters: {
                    type: "object",
                    properties: {
                      type: { 
                        type: "string", 
                        description: "Tipo do imóvel: Casa, Apartamento, Terreno, Comercial, Galpão, Fazenda, Chácara" 
                      },
                      propertySource: { 
                        type: "string", 
                        description: "Origem do imóvel: Imóvel Caixa, Banco do Brasil, Santander, etc." 
                      },
                      city: { type: "string", description: "Cidade do imóvel" },
                      state: { type: "string", description: "Estado do imóvel (nome completo)" },
                      neighborhood: { type: "string", description: "Bairro do imóvel" },
                      evaluationValue: { type: "string", description: "Valor de avaliação no formato R$ 123.456,78" },
                      minimumValue: { type: "string", description: "Valor mínimo de venda no formato R$ 123.456,78" },
                      discount: { type: "string", description: "Percentual de desconto (apenas número, ex: 41,33)" },
                      bedrooms: { type: "string", description: "Número de quartos. DEIXE VAZIO se não houver número específico mencionado (ex: se diz apenas 'quarto' sem número, não preencha)" },
                      bathrooms: { type: "string", description: "Número de banheiros. DEIXE VAZIO se não houver número específico mencionado" },
                      garageSpaces: { type: "string", description: "Número de vagas de garagem. DEIXE VAZIO se não houver número específico mencionado" },
                      area: { type: "string", description: "Área do imóvel em m²" },
                      areaTotal: { type: "string", description: "Área total em m²" },
                      areaPrivativa: { type: "string", description: "Área privativa em m²" },
                      acceptsFGTS: { type: "boolean", description: "Se aceita FGTS (procure por 'FGTS' nas formas de pagamento)" },
                      acceptsFinancing: { type: "boolean", description: "Se aceita financiamento habitacional bancário. FALSE se apenas 'Recurso Próprio' e 'FGTS' sem menção a financiamento" },
                      hasEasyEntry: { type: "boolean", description: "Se tem entrada facilitada/parcelada. FALSE se não houver menção a entrada" },
                      entryValue: { type: "string", description: "Valor da entrada mínima se houver" },
                      paymentMethod: { type: "string", description: "Formas de pagamento disponíveis (ex: 'À Vista, FGTS' ou 'Financiamento Habitacional')" },
                      street: { type: "string", description: "Nome completo da rua/avenida" },
                      number: { type: "string", description: "Número do endereço" },
                      complement: { type: "string", description: "Complemento (apto, casa, bloco)" },
                      cep: { type: "string", description: "CEP no formato 00000-000" },
                      fullAddress: { type: "string", description: "Endereço completo formatado" },
                      condominiumRules: { type: "string", description: "Regras de condomínio/despesas" },
                      taxRules: { type: "string", description: "Regras de tributos/IPTU" },
                      hasSala: { type: "boolean", description: "Se possui sala" },
                      hasCozinha: { type: "boolean", description: "Se possui cozinha" },
                      hasAreaServico: { type: "boolean", description: "Se possui área de serviço" },
                      features: { 
                        type: "array", 
                        items: { type: "string" },
                        description: "Lista de diferenciais/características do imóvel" 
                      }
                    },
                    required: ["type", "city", "state"]
                  }
                }
              }
            ],
            tool_choice: { type: "function", function: { name: "extract_property_data" } }
          }),
        });

        if (response.ok) {
          break; // Success, exit retry loop
        }

        lastError = await response.text();
        console.error(`Attempt ${attempt} failed:`, response.status, lastError);
        
        // Don't retry on client errors (4xx), only on server errors (5xx)
        if (response.status < 500) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      } catch (fetchError) {
        console.error(`Attempt ${attempt} fetch error:`, fetchError);
        lastError = fetchError instanceof Error ? fetchError.message : "Erro de conexão";
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    if (!response || !response.ok) {
      const status = response?.status || 500;
      
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos na sua conta Lovable." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error("All retry attempts failed. Last error:", lastError);
      return new Response(
        JSON.stringify({ error: "Serviço temporariamente indisponível. Tente novamente em alguns instantes." }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("AI response received:", JSON.stringify(data, null, 2));

    // Extract the tool call arguments
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call found in response");
      throw new Error("Não foi possível extrair dados da imagem");
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    console.log("Extracted property data:", extractedData);

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error extracting property data:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao processar imagem" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
