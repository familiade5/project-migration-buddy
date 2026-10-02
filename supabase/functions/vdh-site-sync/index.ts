import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Sincroniza a vitrine pública do site VDH com a lista oficial da Caixa.
// Imóveis novos também entram na fila de Aprovação Posts (marcados autoSync).
const STATES = ["AM", "CE", "MS", "PB", "RN", "SC"];
const ALLOWED = new Set(["venda direta online", "venda online", "venda direta"]);

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
const brNum = (s: string) => Number((s || "0").replace(/\./g, "").replace(",", ".")) || 0;
const title = (s: string) => s.trim().toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
const grab = (d: string, re: RegExp) => d.match(re)?.[1] || "";
const COMMON: [RegExp, string][] = [
  [/PR\uFFFDDIO/g, "PRÉDIO"], [/Pr\uFFFDdio/g, "Prédio"], [/\uFFFDREA/g, "ÁREA"], [/\uFFFDrea/g, "área"],
  [/T\uFFFDRREO/g, "TÉRREO"], [/T\uFFFDrreo/g, "Térreo"], [/IM\uFFFDVEL/g, "IMÓVEL"], [/Im\uFFFDvel/g, "Imóvel"],
  [/CONCEI\uFFFD\uFFFDO/g, "CONCEIÇÃO"], [/S\uFFFDO /g, "SÃO "], [/S\uFFFDo /g, "São "], [/JO\uFFFDO/g, "JOÃO"], [/Jo\uFFFDo/g, "João"],
];
const fixCommon = (s: string) => COMMON.reduce((a, [re, v]) => a.replace(re, v), s);

async function fixAccents(values: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const bad = [...new Set(values.filter((v) => v && /\uFFFD/.test(v)))];
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!bad.length || !key) return out;
  for (let i = 0; i < bad.length; i += 80) {
    const part = bad.slice(i, i + 80);
    try {
      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "Você corrige textos em português do Brasil (bairros, ruas, cidades e descrições de imóveis) onde letras acentuadas foram trocadas pelo caractere �. Substitua cada � pela letra correta, mantendo o resto idêntico. Responda apenas JSON: {\"fixed\": [...]} na mesma ordem e quantidade." },
            { role: "user", content: JSON.stringify(part) },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!r.ok) { console.error("fixAccents", r.status); continue; }
      const d = await r.json();
      const fixed: string[] = JSON.parse(d.choices?.[0]?.message?.content || "{}").fixed || [];
      part.forEach((v, k) => { if (fixed[k] && fixed[k].length >= v.length - 2) out.set(v, fixed[k]); });
    } catch (e) { console.error("fixAccents error", e); }
  }
  return out;
}
const repair = (s: string, m: Map<string, string>) => m.get(s) || s.replace(/\uFFFD/g, "");

async function loadList(supabase: any, uf: string): Promise<string> {
  const cachePath = `caixa-cache/${uf}.json`;
  try {
    const { data: blob } = await supabase.storage.from("exported-creatives").download(cachePath);
    if (blob) {
      const c = JSON.parse(await blob.text());
      if (c?.text && Date.now() - Number(c.at) < 3 * 3600_000) return c.text;
    }
  } catch { /* sem cache */ }
  const csvUrl = `https://venda-imoveis.caixa.gov.br/listaweb/Lista_imoveis_${uf}.csv`;
  let text = "";
  const res = await fetch(csvUrl, { headers: { "User-Agent": "Mozilla/5.0 Chrome/124", Accept: "text/csv,*/*" } }).catch(() => null);
  if (res?.ok) {
    text = new TextDecoder("latin1").decode(await res.arrayBuffer());
  } else {
    const key = Deno.env.get("FIRECRAWL_API_KEY");
    if (!key) throw new Error("Leitura da Caixa indisponível");
    let fc: Response | null = null, body: any = null;
    for (let a = 0; a < 4; a++) {
      fc = await fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url: csvUrl, formats: ["rawHtml"], onlyMainContent: false, location: { country: "BR" }, proxy: "auto" }),
      });
      body = await fc.json().catch(() => null);
      if (fc.status !== 429) break;
      const wait = Math.min(Number(String(body?.error || "").match(/retry after (\d+)s/)?.[1] || 10) + 1, 20);
      await new Promise((r) => setTimeout(r, wait * 1000));
    }
    if (!fc?.ok) throw new Error(`Não foi possível ler a lista da Caixa (${fc?.status})`);
    text = (body?.data?.rawHtml || "").replace(/<[^>]+>/g, "\n").replace(/&amp;/g, "&");
  }
  if (text.includes(";")) {
    await supabase.storage.from("exported-creatives").upload(cachePath, new Blob([JSON.stringify({ at: Date.now(), text })], { type: "application/json" }), { upsert: true }).catch(() => null);
  }
  return text;
}

async function syncState(supabase: any, uf: string) {
  const started = new Date().toISOString();
  const text = await loadList(supabase, uf);
  if (!text.includes(";")) throw new Error("Lista vazia");
  const rows = text.split(/\r?\n/).map((l) => l.split(";").map((c) => c.trim()))
    .filter((c) => c.length >= 12 && /^\d{6,}$/.test(c[0]) && ALLOWED.has((c[10] || "").toLowerCase()));
  if (rows.length < 5) throw new Error(`Lista suspeita (${rows.length} imóveis) — nada foi alterado`);

  const codes = rows.map((c) => c[0]);
  const existing = new Set<string>();
  for (let i = 0; i < codes.length; i += 300) {
    const { data } = await supabase.from("vdh_site_properties").select("code").in("code", codes.slice(i, i + 300));
    (data || []).forEach((r: any) => existing.add(r.code));
  }
  const fresh = rows.filter((c) => !existing.has(c[0]));
  fresh.forEach((c) => { for (const k of [2, 3, 4, 9]) c[k] = fixCommon(c[k] || ""); });
  const fix = await fixAccents(fresh.flatMap((c) => [c[2], c[3], c[4], c[9]]));

  const toInsert = fresh.map((c) => {
    const [id, , cidade, bairro, endereco, preco, aval, desc, fin, descr, modal, link] = c;
    const d = repair(descr, fix);
    const areaPriv = Number(grab(d, /([\d.]+)\s*de .{1,2}rea privativa/i)) || 0;
    const areaTerr = Number(grab(d, /([\d.]+)\s*de .{1,2}rea do terreno/i)) || 0;
    return {
      code: id, uf, city: title(repair(cidade, fix)), neighborhood: title(repair(bairro, fix)),
      address: repair(endereco, fix), property_type: d.split(",")[0]?.trim() || "Imóvel", description: d,
      price: brNum(preco), evaluation: brNum(aval), discount: brNum((desc || "").replace(".", ",")),
      accepts_financing: norm(fin) === "SIM", sale_modality: modal, caixa_link: link,
      photo_url: `https://venda-imoveis.caixa.gov.br/fotos/F${id.padStart(13, "0")}21.jpg`,
      bedrooms: Number(grab(d, /(\d+)\s*qto/i)) || 0, garage_spaces: Number(grab(d, /(\d+)\s*vaga/i)) || 0,
      area: areaPriv || areaTerr || null, status: "active", first_seen_at: started, last_seen_at: started,
    };
  });
  for (let i = 0; i < toInsert.length; i += 300) {
    const { error } = await supabase.from("vdh_site_properties").upsert(toInsert.slice(i, i + 300), { onConflict: "code" });
    if (error) throw error;
  }
  const kept = [...existing];
  for (let i = 0; i < kept.length; i += 300) {
    await supabase.from("vdh_site_properties").update({ last_seen_at: started, status: "active", sold_at: null }).in("code", kept.slice(i, i + 300));
  }
  const { data: sold } = await supabase.from("vdh_site_properties")
    .update({ status: "sold", sold_at: started }).eq("uf", uf).eq("status", "active").lt("last_seen_at", started).select("code");
  await supabase.from("vdh_site_properties").delete().eq("uf", uf).eq("status", "sold").lt("sold_at", new Date(Date.now() - 30 * 86400_000).toISOString());
  const queued = await queueNewPosts(supabase, uf, toInsert);
  return { uf, total: rows.length, new: toInsert.length, sold: (sold || []).length, queued };
}

const STATE_NAMES: Record<string, string> = { AM: "Amazonas", CE: "Ceará", MS: "Mato Grosso do Sul", PB: "Paraíba", RN: "Rio Grande do Norte", SC: "Santa Catarina" };
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Imóveis novos na Caixa também entram na Aprovação Posts (aba "Adicionados recentemente")
async function queueNewPosts(supabase: any, uf: string, props: any[]) {
  if (!props.length) return 0;
  const ids = props.map((p) => `caixa-csv-${p.code}`);
  const existing = new Set<string>();
  for (let i = 0; i < ids.length; i += 200) {
    const { data } = await supabase.from("scraped_properties").select("external_id").in("external_id", ids.slice(i, i + 200));
    (data || []).forEach((r: any) => existing.add(r.external_id));
  }
  const fresh = props.filter((p) => !existing.has(`caixa-csv-${p.code}`));
  let queued = 0;
  for (let i = 0; i < fresh.length; i += 50) {
    const batch = fresh.slice(i, i + 50).map((p) => {
      const d = p.description || "";
      const areaPriv = grab(d, /([\d.]+)\s*de .{1,2}rea privativa/i);
      const areaTerr = grab(d, /([\d.]+)\s*de .{1,2}rea do terreno/i);
      const areaTot = grab(d, /([\d.]+)\s*de .{1,2}rea total/i);
      const addr = p.address || "";
      const photos = Array(5).fill(p.photo_url);
      const fin = p.accepts_financing;
      const property_data = {
        entryValue: "", propertySource: "Imóvel Caixa", type: p.property_type, bedrooms: String(p.bedrooms || 0),
        city: p.city, state: STATE_NAMES[uf], neighborhood: p.neighborhood || "",
        evaluationValue: brl(p.evaluation), minimumValue: brl(p.price), discount: String(Math.round(p.discount || 0)),
        garageSpaces: String(p.garage_spaces || 0), bathrooms: /WC/i.test(d) ? "1" : "0",
        area: areaPriv && areaPriv !== "0.00" ? areaPriv : areaTerr,
        acceptsFGTS: fin, acceptsFinancing: fin, hasEasyEntry: false, canUseFGTS: fin,
        creci: "", features: [], customSlide2Texts: ["", "", ""], customSlide3Texts: ["", "", ""],
        contactPhone: "", contactName: "", propertyName: "",
        paymentMethod: fin ? "À vista ou financiado" : "Somente à vista",
        hasSala: /sala/i.test(d), hasCozinha: /cozinha/i.test(d), hasAreaServico: /a\.serv/i.test(d),
        areaTotal: areaTot, areaPrivativa: areaPriv, areaTerreno: areaTerr,
        street: addr.split(",")[0]?.trim() || addr, number: grab(addr, /N\.\s*([^,]+)/i), complement: "", cep: "",
        fullAddress: `${addr}, ${p.neighborhood || ""} - ${p.city}/${uf}`, customPhotoSpecs: [],
        condominiumRules: "Responsabilidade do comprador (até 10% do valor de avaliação). A CAIXA arcará com o excedente.",
        taxRules: "Responsabilidade do comprador.", saleModality: p.sale_modality, caixaLink: p.caixa_link,
        countdownEndsAt: null, autoSync: true,
      };
      return {
        row: {
          external_id: `caixa-csv-${p.code}`, source_url: p.caixa_link, sale_modality: p.sale_modality, property_type: p.property_type,
          address: addr, neighborhood: p.neighborhood, city: p.city, state: uf,
          price_evaluation: p.evaluation, price_minimum: p.price, discount_percentage: p.discount,
          bedrooms: p.bedrooms, bathrooms: Number(property_data.bathrooms), garage_spaces: p.garage_spaces,
          area_total: Number(areaTot) || null, area_private: Number(areaPriv) || null, area_terrain: Number(areaTerr) || null,
          photo_urls: photos, accepts_financing: fin, accepts_fgts: fin, payment_method: property_data.paymentMethod,
          raw_data: { source: "caixa-csv", hdnimovel: p.code, description: d, via: "vdh-site-sync" }, status: "new",
        },
        property_data, photos,
      };
    });
    const { data: rowsIn, error } = await supabase.from("scraped_properties").insert(batch.map((b) => b.row)).select("id, external_id");
    if (error) { console.error("queueNewPosts scraped", error); continue; }
    const byId = new Map(batch.map((b) => [b.row.external_id, b]));
    const queue = (rowsIn || []).map((r: any) => ({ scraped_property_id: r.id, property_data: byId.get(r.external_id)!.property_data, photos: byId.get(r.external_id)!.photos, status: "pending" }));
    const { error: qErr } = await supabase.from("auto_post_queue").insert(queue);
    if (qErr) { console.error("queueNewPosts queue", qErr); continue; }
    queued += queue.length;
  }
  return queued;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body = await req.json().catch(() => ({}));
    const list = body?.state ? [String(body.state).toUpperCase()] : STATES;
    if (list.some((s) => !STATES.includes(s))) return json({ success: false, error: "Estado sem CRECI" }, 400);
    const results = [];
    for (const uf of list) {
      try { results.push(await syncState(supabase, uf)); }
      catch (e) { results.push({ uf, error: e instanceof Error ? e.message : String(e) }); }
    }
    return json({ success: true, results });
  } catch (e) {
    console.error("vdh-site-sync", e);
    return json({ success: false, error: e instanceof Error ? e.message : "Erro" }, 500);
  }
});
