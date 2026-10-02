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
// Compara nomes tolerando letras perdidas (�) na lista vinda pelo Firecrawl
const sameName = (garbled: string, clean: string) => {
  const g = norm(garbled), c = norm(clean);
  if (g === c) return true;
  if (!g.includes("\uFFFD") && !g.includes("?")) return false;
  const re = new RegExp("^" + g.split(/[\uFFFD?]+/).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".{1,2}") + "$");
  return re.test(c);
};
// Restaura acentos perdidos (ex.: "URUP\uFFFD" -> "URUPÊ") com IA, em lote
async function fixAccents(values: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const bad = [...new Set(values.filter((v) => v && /[\uFFFD]/.test(v)))];
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
            { role: "system", content: "Você corrige textos em português do Brasil (nomes de bairros, ruas e cidades brasileiras) onde letras acentuadas (Ç, Ã, Õ, Á, É, Í, Ó, Ú, Â, Ê, Ô, À, Ü) foram trocadas pelo caractere �. Substitua cada � pela letra correta, mantendo maiúsculas/minúsculas e todo o resto idêntico. Responda apenas JSON: {\"fixed\": [...]} na mesma ordem e quantidade." },
            { role: "user", content: JSON.stringify(part) },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!r.ok) { console.error("fixAccents", r.status, await r.text()); continue; }
      const d = await r.json();
      const fixed: string[] = JSON.parse(d.choices?.[0]?.message?.content || "{}").fixed || [];
      part.forEach((v, k) => { if (fixed[k] && fixed[k].length >= v.length - 2) out.set(v, fixed[k]); });
    } catch (e) { console.error("fixAccents error", e); }
  }
  return out;
}
const repairAll = (s: string, map: Map<string, string>) => map.get(s) || s.replace(/\uFFFD/g, "");
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

async function fetchCountdown(id: string, key: string): Promise<string | null> {
  try {
    const r = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url: `https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnOrigem=index&hdnimovel=${id}`, formats: ["markdown"], waitFor: 3000, proxy: "auto" }),
    });
    const b = await r.json().catch(() => null);
    const md: string = b?.data?.markdown || "";
    const m = md.match(/Tempo restante:[\s\S]{0,40}?(\d+)\s*DIAS[\s\S]{0,20}?(\d+)\s*HORAS/i);
    if (!m) return null;
    return new Date(Date.now() + (Number(m[1]) * 24 + Number(m[2])) * 3600_000).toISOString();
  } catch { return null; }
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
    const listCities = body?.action === "list_cities";
    if (!STATE_NAMES[uf] || (!listCities && body?.action !== "refresh_countdowns" && city.length < 2) || city.length > 80) return json({ success: false, error: "Informe estado (UF) e cidade" }, 400);

    if (body?.action === "repair_accents") {
      const { data: items, error: qErr } = await supabase.from("auto_post_queue").select("id, property_data").limit(5000);
      const bad = (items || []).filter((it) => /\uFFFD/.test(JSON.stringify(it.property_data)));
      const fix = await fixAccents(bad.flatMap((it) => [it.property_data.neighborhood, it.property_data.fullAddress, it.property_data.street, it.property_data.city]));
      for (const it of bad) {
        const p = it.property_data;
        await supabase.from("auto_post_queue").update({ property_data: { ...p, neighborhood: repairAll(p.neighborhood || "", fix), fullAddress: repairAll(p.fullAddress || "", fix), street: repairAll(p.street || "", fix), city: repairAll(p.city || "", fix) } }).eq("id", it.id);
      }
      const { data: sps } = await supabase.from("scraped_properties").select("id, neighborhood, address, city").like("external_id", "caixa-csv-%").limit(5000);
      const badSp = (sps || []).filter((s) => /\uFFFD/.test(`${s.neighborhood}${s.address}${s.city}`));
      const fix2 = await fixAccents(badSp.flatMap((s) => [s.neighborhood, s.address, s.city]));
      for (const s of badSp) {
        await supabase.from("scraped_properties").update({ neighborhood: repairAll(s.neighborhood || "", fix2), address: repairAll(s.address || "", fix2), city: repairAll(s.city || "", fix2) }).eq("id", s.id);
      }
      return json({ success: true, fixed: bad.length, fixedScraped: badSp.length, qErr });
    }
    if (body?.action === "refresh_countdowns") {
      const key = Deno.env.get("FIRECRAWL_API_KEY");
      if (!key) return json({ success: false, error: "Leitura indisponível" }, 500);
      const { data: items } = await supabase.from("auto_post_queue")
        .select("id, property_data, scraped_properties(external_id, raw_data)")
        .eq("status", "pending").eq("property_data->>acceptsFinancing", "true").eq("property_data->>state", STATE_NAMES[uf]);
      const list = (items || []).filter((i: any) => !city || norm(i.property_data?.city || "") === norm(city)).slice(0, 60);
      let found = 0;
      for (let i = 0; i < list.length; i += 6) {
        await Promise.all(list.slice(i, i + 6).map(async (it: any) => {
          const sp = it.scraped_properties;
          const hid = sp?.raw_data?.hdnimovel || String(sp?.external_id || "").replace(/^\D+-/, "").replace(/^caixa-csv-/, "");
          if (!hid) return;
          const end = await fetchCountdown(hid, key);
          if (end) found++;
          await supabase.from("auto_post_queue").update({ property_data: { ...it.property_data, countdownEndsAt: end } }).eq("id", it.id);
        }));
      }
      return json({ success: true, checked: list.length, with_countdown: found });
    }

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

    if (listCities) {
      const counts = new Map<string, number>();
      text.split(/\r?\n/).map((l) => l.split(";").map((c) => c.trim()))
        .filter((c) => c.length >= 12 && /^\d{6,}$/.test(c[0]) && ALLOWED.has(c[10].toLowerCase()))
        .forEach((c) => { const n = title(c[2]); counts.set(n, (counts.get(n) || 0) + 1); });
      const cityFix = await fixAccents([...counts.keys()]);
      const cities = [...counts.entries()].map(([name, count]) => ({ name: repairAll(name, cityFix), count })).sort((a, b) => b.count - a.count);
      return json({ success: true, state: uf, cities });
    }

    const target = norm(city);
    const rows = text.split(/\r?\n/).map((l) => l.split(";").map((c) => c.trim()))
      .filter((c) => c.length >= 12 && /^\d{6,}$/.test(c[0]) && (norm(c[2]) === target || sameName(c[2], city)));
    const allowed = rows.filter((c) => ALLOWED.has(c[10].toLowerCase()));

    const ids = allowed.map((c) => `caixa-csv-${c[0]}`);
    const existing = new Set<string>();
    for (let i = 0; i < ids.length; i += 200) {
      const { data } = await supabase.from("scraped_properties").select("external_id").in("external_id", ids.slice(i, i + 200));
      (data || []).forEach((r) => existing.add(r.external_id));
    }
    const fresh = allowed.filter((c) => !existing.has(`caixa-csv-${c[0]}`));
    // Restaura acentos de cidade, bairro e endereço só dos novos
    const accentFix = await fixAccents(fresh.flatMap((c) => [c[2], c[3], c[4]]));
    fresh.forEach((c) => { c[2] = /\uFFFD/.test(c[2]) ? city.toUpperCase() : c[2]; c[3] = repairAll(c[3], accentFix); c[4] = repairAll(c[4], accentFix); });

    // Leitura do cronômetro desativada a pedido do usuário (economia de créditos)
    const countdowns = new Map<string, string | null>();

    let inserted = 0, financing = 0, cash = 0, noPhoto = 0;
    for (let i = 0; i < fresh.length; i += 20) {
      const batch = fresh.slice(i, i + 20);
      const prepared = await Promise.all(batch.map(async (c) => {
        const [id, , cidade, bairro, endereco, preco, aval, desc, fin, descr, modal, link] = c;
        // A Caixa usa o número com 13 dígitos (zeros à esquerda) no nome da foto
        const photo = `https://venda-imoveis.caixa.gov.br/fotos/F${id.padStart(13, "0")}21.jpg`;
        // Servidores em nuvem são bloqueados pela Caixa; se a checagem falhar, mantém a foto mesmo assim
        const hasPhoto = (await photoExists(photo)) || true;
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
          countdownEndsAt: countdowns.get(id) || null,
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
      new_properties: inserted, financing, cash, without_photo: noPhoto, with_countdown: [...countdowns.values()].filter(Boolean).length,
    });
  } catch (e) {
    console.error("import-caixa-city error:", e);
    return json({ success: false, error: e instanceof Error ? e.message : "Erro desconhecido" }, 500);
  }
});
