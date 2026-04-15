import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TARGET_CITIES: Record<string, string> = {
  AM: "Manaus",
  CE: "Fortaleza",
  MS: "Campo Grande",
  PB: "João Pessoa",
  RN: "Natal",
  SC: "Florianópolis",
};

const STATE_FULL_NAMES: Record<string, string> = {
  AM: "Amazonas",
  CE: "Ceará",
  MS: "Mato Grosso do Sul",
  PB: "Paraíba",
  RN: "Rio Grande do Norte",
  SC: "Santa Catarina",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function buildPropertyData(item: any, state: string): any {
  const evalValue = item.valorAvaliacao || item.valorMinimo || 0;
  const minValue = item.valorMinimo || 0;
  const discount = evalValue > 0 ? Math.round(((evalValue - minValue) / evalValue) * 100) : 0;

  const acceptsFinancing = !!item.aceitaFinanciamento;
  const acceptsFGTS = !!item.aceitaFGTS;
  const paymentMethod = acceptsFinancing ? "À vista ou financiado" : "Somente à vista";
  const propertyType = item.tipoImovel || "Casa";

  return {
    entryValue: "",
    propertySource: "Imóvel Caixa",
    type: propertyType,
    bedrooms: String(item.quartos || 0),
    city: item.cidade || TARGET_CITIES[state],
    state: STATE_FULL_NAMES[state] || state,
    neighborhood: item.bairro || "",
    evaluationValue: formatCurrency(evalValue),
    minimumValue: formatCurrency(minValue),
    discount: String(discount),
    garageSpaces: String(item.vagas || 0),
    bathrooms: String(item.banheiros || 0),
    area: String(item.areaTotal || item.areaPrivativa || ""),
    acceptsFGTS,
    acceptsFinancing,
    hasEasyEntry: false,
    canUseFGTS: acceptsFGTS,
    creci: "",
    features: [],
    customSlide2Texts: ["", "", ""],
    customSlide3Texts: ["", "", ""],
    contactPhone: "(92) 98839-1098",
    contactName: "Iury Sampaio",
    propertyName: item.nomeCondominio || "",
    paymentMethod,
    hasSala: false,
    hasCozinha: false,
    hasAreaServico: false,
    areaTotal: String(item.areaTotal || ""),
    areaPrivativa: String(item.areaPrivativa || ""),
    areaTerreno: String(item.areaTerreno || ""),
    street: item.endereco || "",
    number: "",
    complement: "",
    cep: item.cep || "",
    fullAddress: item.endereco || "",
    customPhotoSpecs: [],
    condominiumRules: "Responsabilidade do comprador (até 10% do valor de avaliação). A CAIXA arcará com o excedente.",
    taxRules: "Responsabilidade do comprador.",
    selectedBroker: "iury" as const,
  };
}

async function scrapeWithFirecrawl(apiKey: string, state: string, city: string): Promise<any[]> {
  const modalities = ["venda-direta", "venda-online"];
  const allItems: any[] = [];

  for (const modality of modalities) {
    const url = `https://smartleiloescaixa.com.br/imoveis/${state.toLowerCase()}/${encodeURIComponent(city.toLowerCase().replace(/ /g, "-"))}?modalidade=${modality}`;
    
    console.log(`Scraping: ${url}`);
    
    try {
      const response = await fetch(`${FIRECRAWL_V2}/scrape`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          formats: [
            {
              type: "json",
              schema: {
                type: "object",
                properties: {
                  imoveis: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Código ou ID do imóvel" },
                        tipoImovel: { type: "string", description: "Tipo: Casa, Apartamento, Terreno etc" },
                        endereco: { type: "string", description: "Endereço completo" },
                        bairro: { type: "string", description: "Bairro" },
                        cidade: { type: "string", description: "Cidade" },
                        cep: { type: "string", description: "CEP" },
                        valorAvaliacao: { type: "number", description: "Valor de avaliação em reais" },
                        valorMinimo: { type: "number", description: "Valor mínimo de venda em reais" },
                        desconto: { type: "number", description: "Percentual de desconto" },
                        quartos: { type: "number", description: "Número de quartos" },
                        banheiros: { type: "number", description: "Número de banheiros" },
                        vagas: { type: "number", description: "Vagas de garagem" },
                        areaTotal: { type: "number", description: "Área total em m²" },
                        areaPrivativa: { type: "number", description: "Área privativa em m²" },
                        areaTerreno: { type: "number", description: "Área do terreno em m²" },
                        aceitaFinanciamento: { type: "boolean", description: "Aceita financiamento" },
                        aceitaFGTS: { type: "boolean", description: "Aceita FGTS" },
                        modalidade: { type: "string", description: "Modalidade: Venda Direta ou Venda Online" },
                        imagemUrl: { type: "string", description: "URL da imagem principal do imóvel" },
                        linkDetalhe: { type: "string", description: "Link para página de detalhe do imóvel" },
                        nomeCondominio: { type: "string", description: "Nome do condomínio se houver" },
                      },
                    },
                  },
                },
              },
              prompt: "Extract all property listings shown on this page. Each property card has type, address, neighborhood, city, prices (avaliação and mínimo), discount percentage, bedrooms, bathrooms, parking spaces, area, financing info, and an image. Extract all of them.",
            },
          ],
          waitFor: 5000,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Firecrawl error for ${state}/${modality}: ${response.status} - ${errText}`);
        continue;
      }

      const data = await response.json();
      const jsonData = data?.data?.json || data?.json || {};
      const items = jsonData?.imoveis || [];

      console.log(`Found ${items.length} items for ${city}/${modality}`);

      for (const item of items) {
        allItems.push({
          ...item,
          _modality: modality === "venda-direta" ? "Venda Direta" : "Venda Online",
          _state: state,
          _city: city,
        });
      }
    } catch (err) {
      console.error(`Scrape error for ${state}/${modality}:`, err);
    }
  }

  return allItems;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlKey) {
      throw new Error("FIRECRAWL_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Optionally filter by state from request body
    let targetStates = Object.keys(TARGET_CITIES);
    try {
      const body = await req.json().catch(() => null);
      if (body?.states && Array.isArray(body.states)) {
        targetStates = body.states.filter((s: string) => TARGET_CITIES[s]);
      }
    } catch {}

    let totalNew = 0;
    let totalSkipped = 0;

    for (const state of targetStates) {
      const city = TARGET_CITIES[state];
      console.log(`Processing ${city}, ${state}...`);

      const items = await scrapeWithFirecrawl(firecrawlKey, state, city);

      for (const item of items) {
        const externalId = item.id || 
          `${item._state}-${(item.cidade || city).replace(/\s+/g, "-")}-${(item.endereco || "").replace(/\s+/g, "-")}-${item.valorMinimo || 0}`.toLowerCase();

        // Check if already exists
        const { data: existing } = await supabase
          .from("scraped_properties")
          .select("id")
          .eq("external_id", externalId)
          .maybeSingle();

        if (existing) {
          totalSkipped++;
          continue;
        }

        const photoUrls: string[] = [];
        if (item.imagemUrl) photoUrls.push(item.imagemUrl);

        const propertyData = buildPropertyData(item, state);

        const { data: scraped, error: scrapeErr } = await supabase
          .from("scraped_properties")
          .insert({
            external_id: externalId,
            source_url: item.linkDetalhe || null,
            sale_modality: item._modality,
            property_type: item.tipoImovel || "Casa",
            address: item.endereco || null,
            neighborhood: item.bairro || null,
            city: item.cidade || city,
            state: state,
            zip_code: item.cep || null,
            price_evaluation: item.valorAvaliacao || null,
            price_minimum: item.valorMinimo || null,
            discount_percentage: item.desconto || null,
            bedrooms: item.quartos || 0,
            bathrooms: item.banheiros || 0,
            garage_spaces: item.vagas || 0,
            area_total: item.areaTotal || null,
            area_private: item.areaPrivativa || null,
            area_terrain: item.areaTerreno || null,
            photo_urls: photoUrls,
            accepts_financing: !!item.aceitaFinanciamento,
            accepts_fgts: !!item.aceitaFGTS,
            payment_method: propertyData.paymentMethod,
            raw_data: item,
            status: "new",
          })
          .select("id")
          .single();

        if (scrapeErr) {
          console.error(`Insert error for ${externalId}:`, scrapeErr);
          continue;
        }

        const { error: queueErr } = await supabase
          .from("auto_post_queue")
          .insert({
            scraped_property_id: scraped.id,
            property_data: propertyData,
            photos: photoUrls,
            status: "pending",
          });

        if (queueErr) {
          console.error(`Queue insert error:`, queueErr);
          continue;
        }

        totalNew++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        new_properties: totalNew,
        skipped_existing: totalSkipped,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Scrape error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
