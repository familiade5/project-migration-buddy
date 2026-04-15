import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SMART_API_BASE = "https://api-dot-site-smart-leiloes.rj.r.appspot.com/api";
const PAGE_SIZE = 24;
const PAGE_BATCH_SIZE = 5;

const STATE_FULL_NAMES: Record<string, string> = {
  AM: "Amazonas", CE: "Ceará", MS: "Mato Grosso do Sul",
  PB: "Paraíba", RN: "Rio Grande do Norte", SC: "Santa Catarina",
  GO: "Goiás", SP: "São Paulo", RJ: "Rio de Janeiro", MG: "Minas Gerais",
  PR: "Paraná", RS: "Rio Grande do Sul", BA: "Bahia", PE: "Pernambuco",
  PA: "Pará", MA: "Maranhão", MT: "Mato Grosso", PI: "Piauí",
  AL: "Alagoas", SE: "Sergipe", RO: "Rondônia", TO: "Tocantins",
  AC: "Acre", AP: "Amapá", RR: "Roraima", ES: "Espírito Santo", DF: "Distrito Federal",
};

const ALLOWED_MODALITIES = new Set(["Venda Direta", "Venda Direta Online"]);

type SmartProperty = {
  _id?: string;
  hdnImovel?: string;
  endereco?: string;
  bairro?: string;
  estado?: string;
  cidade?: string;
  tipoImovel?: string;
  precoAvaliacao?: number;
  precoVenda?: number;
  modoVenda?: string;
  areaPrivativa?: number;
  areaTotal?: number;
  areaTerreno?: number;
  aceitaFGTS?: boolean;
  aceitaFinanciamentoHabitacional?: boolean;
  desconto?: number;
  imagens?: Array<{ fileReference?: string; fileUrl?: string }>;
  siteLeiloeiro?: string;
};

type SmartSearchResponse = {
  count: number;
  records: SmartProperty[];
};

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function toTitleCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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

function buildExternalId(item: SmartProperty): string {
  return `smart-caixa-${item.hdnImovel || item._id || `${item.estado}-${item.cidade}-${item.endereco}`}`.toLowerCase();
}

function buildPhotoUrls(item: SmartProperty): string[] {
  const urls = (item.imagens || [])
    .map((image) => {
      if (image.fileUrl) return image.fileUrl;
      if (image.fileReference) return `https://storage.googleapis.com/imagens-imoveis-smart-leiloes/${image.fileReference}`;
      return null;
    })
    .filter((url): url is string => Boolean(url));

  return [...new Set(urls)];
}

function buildPropertyData(item: SmartProperty): any {
  const evalValue = item.precoAvaliacao || item.precoVenda || 0;
  const minValue = item.precoVenda || 0;
  const discount = item.desconto || (evalValue > 0 ? Math.round(((evalValue - minValue) / evalValue) * 100) : 0);
  const acceptsFinancing = !!item.aceitaFinanciamentoHabitacional;
  const acceptsFGTS = !!item.aceitaFGTS;
  const paymentMethod = acceptsFinancing ? "À vista ou financiado" : "Somente à vista";
  const stateUF = resolveState(item.estado || "");

  return {
    entryValue: "",
    propertySource: "Imóvel Caixa",
    type: item.tipoImovel || "Casa",
    bedrooms: String(item.quartos || 0),
    city: toTitleCase(item.cidade || ""),
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

async function fetchActiveCreciStates(supabase: ReturnType<typeof createClient>): Promise<string[]> {
  const { data, error } = await supabase
    .from("crecis")
    .select("state")
    .eq("is_active", true);

  if (error) throw error;

  return [...new Set((data || []).map((row) => resolveState(row.state || "")).filter(Boolean))];
}

async function fetchSmartPage(state: string, offset: number, includeCount = false): Promise<SmartSearchResponse> {
  const response = await fetch(`${SMART_API_BASE}/imovel/busca`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      queryDataMode: "leilao",
      estados: [state],
      modosVenda: [...ALLOWED_MODALITIES],
      max: PAGE_SIZE,
      offset,
      countImoveis: includeCount,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Smart API error for ${state} offset ${offset}: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return {
    count: typeof data?.count === "number" ? data.count : 0,
    records: Array.isArray(data?.records) ? data.records : [],
  };
}

async function fetchAllSmartPagesForState(state: string): Promise<SmartProperty[]> {
  const firstPage = await fetchSmartPage(state, 0, true);
  const totalCount = Math.max(firstPage.count, firstPage.records.length);

  if (totalCount <= PAGE_SIZE) {
    return firstPage.records;
  }

  const remainingOffsets: number[] = [];
  for (let offset = PAGE_SIZE; offset < totalCount; offset += PAGE_SIZE) {
    remainingOffsets.push(offset);
  }

  console.log(`State ${state}: fetching ${totalCount} properties across ${remainingOffsets.length + 1} pages`);

  const remainingRecords: SmartProperty[] = [];

  for (let index = 0; index < remainingOffsets.length; index += PAGE_BATCH_SIZE) {
    const batchOffsets = remainingOffsets.slice(index, index + PAGE_BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batchOffsets.map((offset) => fetchSmartPage(state, offset))
    );

    batchResults.forEach((result, batchIndex) => {
      if (result.status === "rejected") {
        console.error(`Request failed for ${state} offset ${batchOffsets[batchIndex]}:`, result.reason);
      }
    });

    remainingRecords.push(
      ...batchResults
        .filter((result): result is PromiseFulfilledResult<SmartSearchResponse> => result.status === "fulfilled")
        .flatMap((result) => result.value.records)
    );
  }

  return [...firstPage.records, ...remainingRecords];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const targetStates = await fetchActiveCreciStates(supabase);
    if (targetStates.length === 0) {
      throw new Error("Nenhum estado com CRECI ativo foi encontrado para importar imóveis");
    }

    const results = await Promise.allSettled(
      targetStates.map((state) => fetchAllSmartPagesForState(state))
    );

    const failedRequests = results.filter((result) => result.status === "rejected");
    if (failedRequests.length === results.length) {
      throw new Error(`Falha ao consultar a API de imóveis: ${failedRequests.map((result) => (result as PromiseRejectedResult).reason?.message || "erro desconhecido").join(" | ")}`);
    }

    failedRequests.forEach((result) => {
      console.error("Request failed:", (result as PromiseRejectedResult).reason);
    });

    const fetchedItems = results
      .filter((result): result is PromiseFulfilledResult<SmartProperty[]> => result.status === "fulfilled")
      .flatMap((result) => result.value);

    const uniqueItems = Array.from(
      new Map(
        fetchedItems
          .filter((item) => targetStates.includes(resolveState(item.estado || "")))
          .filter((item) => ALLOWED_MODALITIES.has(item.modoVenda || ""))
          .map((item) => [buildExternalId(item), item])
      ).values()
    );

    console.log(`Fetched ${fetchedItems.length} items and kept ${uniqueItems.length} unique direct-sale properties`);

    // Lookup existing IDs in batches of 200
    const BATCH_LOOKUP = 200;
    const externalIds = uniqueItems.map(buildExternalId);
    const existingIds = new Set<string>();

    for (let i = 0; i < externalIds.length; i += BATCH_LOOKUP) {
      const batch = externalIds.slice(i, i + BATCH_LOOKUP);
      const { data: existingRows, error: existingError } = await supabase
        .from("scraped_properties")
        .select("external_id")
        .in("external_id", batch);

      if (existingError) throw existingError;
      (existingRows || []).forEach((row) => existingIds.add(row.external_id));
    }

    const newItems = uniqueItems.filter((item) => !existingIds.has(buildExternalId(item)));

    let totalNew = 0;

    if (newItems.length > 0) {
      const preparedItems = newItems.map((item) => {
        const stateUF = resolveState(item.estado || "");
        const photoUrls = buildPhotoUrls(item);
        const propertyData = buildPropertyData(item);

        return {
          externalId: buildExternalId(item),
          propertyData,
          photoUrls,
          insertRow: {
            external_id: buildExternalId(item),
            source_url: item.siteLeiloeiro || null,
            sale_modality: item.modoVenda || null,
            property_type: item.tipoImovel || "Casa",
            address: item.endereco || null,
            neighborhood: item.bairro || null,
            city: item.cidade || "",
            state: stateUF,
            zip_code: null,
            price_evaluation: item.precoAvaliacao || null,
            price_minimum: item.precoVenda || null,
            discount_percentage: item.desconto || null,
            bedrooms: 0,
            bathrooms: 0,
            garage_spaces: 0,
            area_total: item.areaTotal || null,
            area_private: item.areaPrivativa || null,
            area_terrain: item.areaTerreno || null,
            photo_urls: photoUrls,
            accepts_financing: !!item.aceitaFinanciamentoHabitacional,
            accepts_fgts: !!item.aceitaFGTS,
            payment_method: propertyData.paymentMethod,
            raw_data: { hdnImovel: item.hdnImovel, modoVenda: item.modoVenda, siteLeiloeiro: item.siteLeiloeiro },
            status: "new",
          },
        };
      });

      const preparedMap = new Map(preparedItems.map((item) => [item.externalId, item]));

      // Insert in batches of 50
      const BATCH_INSERT = 20;
      for (let i = 0; i < preparedItems.length; i += BATCH_INSERT) {
        const batch = preparedItems.slice(i, i + BATCH_INSERT);

        const { data: insertedRows, error: insertError } = await supabase
          .from("scraped_properties")
          .insert(batch.map((item) => item.insertRow))
          .select("id, external_id");

        if (insertError) throw insertError;

        const queueRows = (insertedRows || []).map((row) => {
          const prepared = preparedMap.get(row.external_id);
          if (!prepared) {
            throw new Error(`Dados preparados não encontrados para ${row.external_id}`);
          }

          return {
            scraped_property_id: row.id,
            property_data: prepared.propertyData,
            photos: prepared.photoUrls,
            status: "pending",
          };
        });

        if (queueRows.length > 0) {
          const { error: queueError } = await supabase
            .from("auto_post_queue")
            .insert(queueRows);

          if (queueError) throw queueError;
        }

        totalNew += queueRows.length;
      }
    }

    const totalSkipped = uniqueItems.length - newItems.length;
    const totalFiltered = fetchedItems.length - uniqueItems.length;

    console.log(`Results: ${totalNew} new, ${totalSkipped} skipped, ${totalFiltered} filtered out`);

    return new Response(
      JSON.stringify({
        success: true,
        total_scraped: fetchedItems.length,
        unique_candidates: uniqueItems.length,
        new_properties: totalNew,
        skipped_existing: totalSkipped,
        filtered_out: totalFiltered,
        states_used: targetStates,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Scrape error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
