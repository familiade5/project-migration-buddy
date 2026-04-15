import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// States where we have CRECI PJ
const TARGET_STATES = new Set(["AM", "CE", "MS", "PB", "RN", "SC"]);

const STATE_FULL_NAMES: Record<string, string> = {
  AM: "Amazonas", CE: "Ceará", MS: "Mato Grosso do Sul",
  PB: "Paraíba", RN: "Rio Grande do Norte", SC: "Santa Catarina",
  GO: "Goiás", SP: "São Paulo", RJ: "Rio de Janeiro", MG: "Minas Gerais",
  PR: "Paraná", RS: "Rio Grande do Sul", BA: "Bahia", PE: "Pernambuco",
  PA: "Pará", MA: "Maranhão", MT: "Mato Grosso", PI: "Piauí",
  AL: "Alagoas", SE: "Sergipe", RO: "Rondônia", TO: "Tocantins",
  AC: "Acre", AP: "Amapá", RR: "Roraima", ES: "Espírito Santo", DF: "Distrito Federal",
};

const ALLOWED_MODALITIES = new Set(["Venda Direta", "Venda Online", "Venda Direta Online"]);
const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function resolveState(raw: string): string {
  const clean = raw.trim().toUpperCase();
  if (clean.length === 2) return clean;
  const lower = raw.trim().toLowerCase();
  for (const [uf, name] of Object.entries(STATE_FULL_NAMES)) {
    if (name.toLowerCase() === lower) return uf;
  }
  return clean.slice(0, 2);
}

function buildPropertyData(item: any): any {
  const evalValue = item.valorAvaliacao || item.valorVenda || 0;
  const minValue = item.valorVenda || item.valorMinimo || 0;
  const discount = item.desconto || (evalValue > 0 ? Math.round(((evalValue - minValue) / evalValue) * 100) : 0);
  const acceptsFinancing = !!item.aceitaFinanciamento;
  const acceptsFGTS = !!item.aceitaFGTS;
  const paymentMethod = acceptsFinancing ? "À vista ou financiado" : "Somente à vista";
  const stateUF = resolveState(item.estado || "");

  return {
    entryValue: "",
    propertySource: "Imóvel Caixa",
    type: item.tipo || "Casa",
    bedrooms: String(item.quartos || 0),
    city: (item.cidade || "").replace(/^(.)(.*)/,(_:string,f:string,r:string) => f + r.toLowerCase()),
    state: STATE_FULL_NAMES[stateUF] || item.estado || "",
    neighborhood: item.bairro || "",
    evaluationValue: formatCurrency(evalValue),
    minimumValue: formatCurrency(minValue),
    discount: String(discount),
    garageSpaces: String(item.vagas || 0),
    bathrooms: String(item.banheiros || 0),
    area: String(item.areaPrivativa || item.areaTerreno || ""),
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

const SCRAPE_SCHEMA = {
  type: "object",
  properties: {
    imoveis: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tipo: { type: "string", description: "Tipo: Casa, Apartamento, Terreno" },
          cidade: { type: "string", description: "Nome da cidade em maiúsculas" },
          estado: { type: "string", description: "Sigla do estado (UF) com 2 letras" },
          endereco: { type: "string", description: "Endereço completo do imóvel" },
          bairro: { type: "string", description: "Bairro" },
          cep: { type: "string", description: "CEP completo" },
          valorAvaliacao: { type: "number", description: "Valor de avaliação em reais" },
          valorVenda: { type: "number", description: "Valor mínimo de venda em reais" },
          desconto: { type: "number", description: "Percentual de desconto" },
          quartos: { type: "number", description: "Número de quartos" },
          banheiros: { type: "number", description: "Número de banheiros" },
          vagas: { type: "number", description: "Vagas de garagem" },
          areaPrivativa: { type: "number", description: "Área privativa em m²" },
          areaTerreno: { type: "number", description: "Área do terreno em m²" },
          areaTotal: { type: "number", description: "Área total em m²" },
          modalidade: { type: "string", description: "Venda Direta, Venda Online, Leilão, etc." },
          aceitaFGTS: { type: "boolean", description: "Se aceita FGTS" },
          aceitaFinanciamento: { type: "boolean", description: "Se aceita financiamento" },
          imagemUrl: { type: "string", description: "URL da imagem principal" },
          nomeCondominio: { type: "string", description: "Nome do condomínio se houver" },
        },
      },
    },
  },
};

const SCRAPE_PROMPT = "Extract ALL property listings (imóveis) visible on this page. Each property card shows: type (Casa/Apartamento/Terreno), city and state (UF), full address with CEP, areas in m², evaluation price (Avaliação), sale/minimum price, discount percentage, sale modality (Venda Direta/Venda Online/Leilão), FGTS acceptance, financing, and an image. Extract every single property card shown.";

async function scrapePage(apiKey: string, url: string): Promise<any[]> {
  console.log(`Scraping: ${url}`);

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
          schema: SCRAPE_SCHEMA,
          prompt: SCRAPE_PROMPT,
        },
      ],
      waitFor: 10000,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`Firecrawl error for ${url}: ${response.status} - ${errText}`);
    return [];
  }

  const data = await response.json();
  const jsonData = data?.data?.json || data?.json || {};
  return jsonData?.imoveis || [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlKey) throw new Error("FIRECRAWL_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Scrape page 1 and page 2 in parallel
    const [page1Items, page2Items] = await Promise.all([
      scrapePage(firecrawlKey, "https://smartleiloescaixa.com.br/home"),
      scrapePage(firecrawlKey, "https://smartleiloescaixa.com.br/home?page=2"),
    ]);

    const allItems = [...page1Items, ...page2Items];
    console.log(`Scraped ${allItems.length} total items from 2 pages`);

    let totalNew = 0;
    let totalSkipped = 0;
    let totalFiltered = 0;

    for (const item of allItems) {
      const stateUF = resolveState(item.estado || "");

      // Filter: only target states
      if (!TARGET_STATES.has(stateUF)) {
        totalFiltered++;
        continue;
      }

      // Filter: only Venda Direta and Venda Online (no Leilão)
      const modality = item.modalidade || "";
      if (!ALLOWED_MODALITIES.has(modality)) {
        totalFiltered++;
        continue;
      }

      // Generate unique ID from address + price
      const externalId = `${stateUF}-${(item.cidade || "").replace(/\s+/g, "-")}-${(item.endereco || "").replace(/\s+/g, "-").slice(0, 80)}-${item.valorVenda || 0}`.toLowerCase();

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

      const propertyData = buildPropertyData(item);

      const { data: scraped, error: scrapeErr } = await supabase
        .from("scraped_properties")
        .insert({
          external_id: externalId,
          source_url: null,
          sale_modality: modality,
          property_type: item.tipo || "Casa",
          address: item.endereco || null,
          neighborhood: item.bairro || null,
          city: item.cidade || "",
          state: stateUF,
          zip_code: item.cep || null,
          price_evaluation: item.valorAvaliacao || null,
          price_minimum: item.valorVenda || null,
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
        console.error(`Insert error:`, scrapeErr);
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

    console.log(`Results: ${totalNew} new, ${totalSkipped} skipped, ${totalFiltered} filtered out`);

    return new Response(
      JSON.stringify({
        success: true,
        total_scraped: allItems.length,
        new_properties: totalNew,
        skipped_existing: totalSkipped,
        filtered_out: totalFiltered,
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
