import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const STATE_NAMES: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará", DF: "Distrito Federal",
  ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais",
  PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
};
const ALLOWED = new Set(["venda direta online", "venda online", "venda direta"]);

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
const brNum = (s: string) => Number((s || "0").replace(/\./g, "").replace(",", ".")) || 0;
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const title = (s: string) => s.trim().toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
const grab = (desc: string, re: RegExp) => desc.match(re)?.[1] || "";

async function photoExists(url: string) {
  try {
    const r = await fetch(url, { method: "HEAD", headers: { "User-Agent": "Mozilla/5.0" } });
    return r.ok && (r.headers.get("content-type") || "").startsWith("image");
  } catch { return false; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const auth = req.headers.get("Authorization") || "";
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ success: false, error: "Não autenticado" }, 401);
    const supabase = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return json({ success: false, error: "Apenas administradores" }, 403);

    const body = await req.json().catch(() => ({}));
    const uf = String(body?.state || "").trim().toUpperCase();
    const city = String(body?.city || "").trim();
    if (!STATE_NAMES[uf] || city.length < 2 || city.length > 80) return json({ success: false, error: "Informe estado (UF) e cidade" }, 400);

    const csvUrl = `https://venda-imoveis.caixa.gov.br/listaweb/Lista_imoveis_${uf}.csv`;
    let text = "";
    const res = await fetch(csvUrl, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36", "Accept": "text/csv,*/*" } });
    if (res.ok) {
      text = new TextDecoder("latin1").decode(await res.arrayBuffer());
    } else {
      // A Caixa bloqueia servidores em nuvem — busca via Firecrawl
      console.log(`Direct fetch blocked (${res.status}); using Firecrawl`);
      const key = Deno.env.get("FIRECRAWL_API_KEY");
      if (!key) return json({ success: false, error: `A Caixa bloqueou a leitura (${res.status})` }, 502);
      const fc = await fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url: csvUrl, formats: ["rawHtml"], onlyMainContent: false, location: { country: "BR" }, proxy: "auto" }),
      });
      const fcBody = await fc.json().catch(() => null);
      if (!fc.ok) {
        console.error("Firecrawl error", fc.status, JSON.stringify(fcBody));
        return json({ success: false, error: `Não foi possível ler a lista da Caixa (${fc.status})` }, 502);
      }
      text = fcBody?.data?.rawHtml || fcBody?.rawHtml || fcBody?.data?.markdown || "";
      text = text.replace(/<[^>]+>/g, "\n").replace(/&amp;/g, "&");
    }
    if (!text.includes(";")) return json({ success: false, error: "A Caixa não retornou a lista de imóveis" }, 502);

    const target = norm(city);
    const rows = text.split(/\r?\n/).map((l) => l.split(";").map((c) => c.trim()))
      .filter((c) => c.length >= 12 && /^\d{6,}$/.test(c[0]) && norm(c[2]) === target);
    const allowed = rows.filter((c) => ALLOWED.has(c[10].toLowerCase()));

    const ids = allowed.map((c) => `caixa-csv-${c[0]}`);
    const existing = new Set<string>();
    for (let i = 0; i < ids.length; i += 200) {
      const { data } = await supabase.from("scraped_properties").select("external_id").in("external_id", ids.slice(i, i + 200));
      (data || []).forEach((r) => existing.add(r.external_id));
    }
    const fresh = allowed.filter((c) => !existing.has(`caixa-csv-${c[0]}`));

    let inserted = 0, financing = 0, cash = 0, noPhoto = 0;
    for (let i = 0; i < fresh.length; i += 20) {
      const batch = fresh.slice(i, i + 20);
      const prepared = await Promise.all(batch.map(async (c) => {
        const [id, , cidade, bairro, endereco, preco, aval, desc, fin, descr, modal, link] = c;
        const photo = `https://venda-imoveis.caixa.gov.br/fotos/F${id}21.jpg`;
        const hasPhoto = await photoExists(photo);
        if (!hasPhoto) noPhoto++;
        // OLX exige 5 imagens: repete a única foto 5 vezes
        const photos = hasPhoto ? Array(5).fill(photo) : [];
        const min = brNum(preco), ev = brNum(aval);
        const acceptsFinancing = norm(fin) === "SIM";
        acceptsFinancing ? financing++ : cash++;
        const type = descr.split(",")[0]?.trim() || "Casa";
        const bedrooms = grab(descr, /(\d+)\s*qto/i) || "0";
        const garage = grab(descr, /(\d+)\s*vaga/i) || "0";
        const areaPriv = grab(descr, /([\d.]+)\s*de .{1,2}rea privativa/i);
        const areaTerr = grab(descr, /([\d.]+)\s*de .{1,2}rea do terreno/i);
        const areaTot = grab(descr, /([\d.]+)\s*de .{1,2}rea total/i);
        const number = grab(endereco, /N\.\s*([^,]+)/i);
        const street = endereco.split(",")[0]?.trim() || endereco;
        const property_data = {
          entryValue: "", propertySource: "Imóvel Caixa", type, bedrooms,
          city: title(cidade), state: STATE_NAMES[uf], neighborhood: title(bairro),
          evaluationValue: brl(ev), minimumValue: brl(min), discount: String(Math.round(brNum(desc.replace(".", ",")))),
          garageSpaces: garage, bathrooms: /WC/i.test(descr) ? "1" : "0",
          area: areaPriv && areaPriv !== "0.00" ? areaPriv : areaTerr,
          acceptsFGTS: acceptsFinancing, acceptsFinancing, hasEasyEntry: false, canUseFGTS: acceptsFinancing,
          creci: "", features: [], customSlide2Texts: ["", "", ""], customSlide3Texts: ["", "", ""],
          contactPhone: "", contactName: "", propertyName: "",
          paymentMethod: acceptsFinancing ? "À vista ou financiado" : "Somente à vista",
          hasSala: /sala/i.test(descr), hasCozinha: /cozinha/i.test(descr), hasAreaServico: /a\.serv/i.test(descr),
          areaTotal: areaTot, areaPrivativa: areaPriv, areaTerreno: areaTerr,
          street, number, complement: "", cep: "", fullAddress: `${endereco}, ${title(bairro)} - ${title(cidade)}/${uf}`,
          customPhotoSpecs: [],
          condominiumRules: "Responsabilidade do comprador (até 10% do valor de avaliação). A CAIXA arcará com o excedente.",
          taxRules: "Responsabilidade do comprador.", saleModality: modal, caixaLink: link,
        };
        return {
          row: {
            external_id: `caixa-csv-${id}`, source_url: link, sale_modality: modal, property_type: type,
            address: endereco, neighborhood: bairro, city: cidade, state: uf,
            price_evaluation: ev, price_minimum: min, discount_percentage: brNum(desc.replace(".", ",")),
            bedrooms: Number(bedrooms), bathrooms: Number(property_data.bathrooms), garage_spaces: Number(garage),
            area_total: Number(areaTot) || null, area_private: Number(areaPriv) || null, area_terrain: Number(areaTerr) || null,
            photo_urls: photos, accepts_financing: acceptsFinancing, accepts_fgts: acceptsFinancing,
            payment_method: property_data.paymentMethod, raw_data: { source: "caixa-csv", hdnimovel: id, description: descr },
            status: "new",
          },
          property_data, photos,
        };
      }));

      const { data: rowsIn, error } = await supabase.from("scraped_properties").insert(prepared.map((p) => p.row)).select("id, external_id");
      if (error) throw error;
      const byId = new Map(prepared.map((p) => [p.row.external_id, p]));
      const queue = (rowsIn || []).map((r) => ({
        scraped_property_id: r.id, property_data: byId.get(r.external_id)!.property_data,
        photos: byId.get(r.external_id)!.photos, status: "pending",
      }));
      const { error: qErr } = await supabase.from("auto_post_queue").insert(queue);
      if (qErr) throw qErr;
      inserted += queue.length;
    }

    return json({
      success: true, city: title(city), state: uf, total_city: rows.length, allowed: allowed.length,
      ignored_modality: rows.length - allowed.length, already_existing: allowed.length - fresh.length,
      new_properties: inserted, financing, cash, without_photo: noPhoto,
    });
  } catch (e) {
    console.error("import-caixa-city error:", e);
    return json({ success: false, error: e instanceof Error ? e.message : "Erro desconhecido" }, 500);
  }
});
