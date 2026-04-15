import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Capitals for states where we have CRECI PJ
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

const ALLOWED_MODALITIES = ["Venda Direta", "Venda Online"];

const API_BASE = "https://api-dot-site-smart-leiloes.rj.r.appspot.com/api/imovel/busca";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function buildPropertyData(item: any, state: string): any {
  const evalValue = item.valorAvaliacao || item.valorMinimo || 0;
  const minValue = item.valorMinimo || 0;
  const discount = evalValue > 0 ? Math.round(((evalValue - minValue) / evalValue) * 100) : 0;

  const acceptsFinancing = item.formasDePagamento?.some((f: string) =>
    f.toLowerCase().includes("financiamento")
  ) || false;
  const acceptsFGTS = item.formasDePagamento?.some((f: string) =>
    f.toLowerCase().includes("fgts")
  ) || false;

  const paymentMethod = acceptsFinancing
    ? "À vista ou financiado"
    : "Somente à vista";

  const propertyType = item.tipoImovel || "Casa";
  const bedrooms = String(item.quartos || 0);
  const bathrooms = String(item.banheiros || 0);
  const garageSpaces = String(item.vagas || 0);

  return {
    entryValue: "",
    propertySource: "Imóvel Caixa",
    type: propertyType,
    bedrooms,
    city: item.cidade || TARGET_CITIES[state],
    state: STATE_FULL_NAMES[state] || state,
    neighborhood: item.bairro || "",
    evaluationValue: formatCurrency(evalValue),
    minimumValue: formatCurrency(minValue),
    discount: String(discount),
    garageSpaces,
    bathrooms,
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

async function fetchPropertiesForState(state: string, city: string): Promise<any[]> {
  const results: any[] = [];
  
  for (const modality of ALLOWED_MODALITIES) {
    try {
      const params = new URLSearchParams({
        estado: state,
        cidade: city,
        modalidade: modality,
        pagina: "1",
        itensPorPagina: "50",
      });

      const response = await fetch(`${API_BASE}?${params.toString()}`);
      if (!response.ok) {
        console.error(`API error for ${state}/${modality}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const items = data.imoveis || data.data || data.results || [];
      
      if (Array.isArray(items)) {
        for (const item of items) {
          results.push({ ...item, _modality: modality, _state: state });
        }
      }
    } catch (err) {
      console.error(`Fetch error for ${state}/${modality}:`, err);
    }
  }
  
  return results;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let totalNew = 0;
    let totalSkipped = 0;

    for (const [state, city] of Object.entries(TARGET_CITIES)) {
      console.log(`Fetching properties for ${city}, ${state}...`);
      const items = await fetchPropertiesForState(state, city);
      console.log(`Found ${items.length} items for ${city}, ${state}`);

      for (const item of items) {
        // Generate a unique external ID
        const externalId = item.id?.toString() || item.codigo || 
          `${item._state}-${item.cidade}-${item.endereco}-${item.valorMinimo}`.replace(/\s+/g, "-").toLowerCase();

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

        // Extract photo URLs
        const photoUrls: string[] = [];
        if (item.fotos && Array.isArray(item.fotos)) {
          for (const foto of item.fotos) {
            if (typeof foto === "string") photoUrls.push(foto);
            else if (foto?.url) photoUrls.push(foto.url);
          }
        }
        if (item.imagemPrincipal) {
          photoUrls.unshift(item.imagemPrincipal);
        }

        // Build property data for VDH post generation
        const propertyData = buildPropertyData(item, state);

        // Insert scraped property
        const { data: scraped, error: scrapeErr } = await supabase
          .from("scraped_properties")
          .insert({
            external_id: externalId,
            source_url: item.link || item.url || null,
            sale_modality: item._modality,
            property_type: item.tipoImovel || "Casa",
            address: item.endereco || null,
            neighborhood: item.bairro || null,
            city: item.cidade || city,
            state: state,
            zip_code: item.cep || null,
            price_evaluation: item.valorAvaliacao || null,
            price_minimum: item.valorMinimo || null,
            discount_percentage: propertyData.discount ? parseFloat(propertyData.discount) : null,
            bedrooms: item.quartos || 0,
            bathrooms: item.banheiros || 0,
            garage_spaces: item.vagas || 0,
            area_total: item.areaTotal || null,
            area_private: item.areaPrivativa || null,
            area_terrain: item.areaTerreno || null,
            photo_urls: photoUrls,
            accepts_financing: propertyData.acceptsFinancing,
            accepts_fgts: propertyData.acceptsFGTS,
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

        // Create queue entry with property data ready for VDH post
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
