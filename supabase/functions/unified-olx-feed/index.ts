// Edge function: serves a UNIFIED public VRSYNC XML feed for OLX / ZAP / VivaReal
// Merges listings from am_olx_listings + vdh_olx_listings + af_olx_listings
// Canal Pro only allows ONE feed URL per account, so we combine all 3 modules here.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function esc(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cdata(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v).replace(/]]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${s}]]>`;
}

function mapPropertyType(t: string): { category: string; type: string } {
  const x = (t || '').toLowerCase();
  if (x.includes('cobertura')) return { category: 'Apartamento', type: 'Cobertura' };
  if (x.includes('casa em cond')) return { category: 'Casa', type: 'Casa de Condomínio' };
  if (x.includes('casa')) return { category: 'Casa', type: 'Padrão' };
  if (x.includes('terreno') || x.includes('lote')) return { category: 'Terreno/Lote', type: 'Padrão' };
  if (x.includes('comercial') || x.includes('sala')) return { category: 'Comercial', type: 'Sala/Conjunto' };
  return { category: 'Apartamento', type: 'Padrão' };
}

function transactionTag(t: string): string {
  if (t === 'aluguel') return 'RENTAL';
  return 'SALE';
}

function stateName(uf: string): string {
  const map: Record<string, string> = {
    AM: 'Amazonas', CE: 'Ceará', MS: 'Mato Grosso do Sul',
    SP: 'São Paulo', RJ: 'Rio de Janeiro', MG: 'Minas Gerais',
    BA: 'Bahia', PR: 'Paraná', RS: 'Rio Grande do Sul', SC: 'Santa Catarina',
    GO: 'Goiás', PE: 'Pernambuco', DF: 'Distrito Federal', PA: 'Pará',
    MA: 'Maranhão', PB: 'Paraíba', RN: 'Rio Grande do Norte', AL: 'Alagoas',
    PI: 'Piauí', SE: 'Sergipe', MT: 'Mato Grosso', ES: 'Espírito Santo',
    TO: 'Tocantins', RO: 'Rondônia', AC: 'Acre', RR: 'Roraima', AP: 'Amapá',
  };
  return map[uf] || uf;
}

function renderListing(p: Record<string, unknown>, prefix: string, defaultState: string): string {
  const ptype = mapPropertyType(String(p.property_type ?? 'Apartamento'));
  const tx = transactionTag(String(p.transaction_type ?? 'venda'));
  const isLaunch = p.transaction_type === 'lancamento';
  const photos = Array.isArray(p.photos) ? (p.photos as string[]) : [];
  const photosXml = photos
    .map((url, i) => `      <Item medium="image" caption="Foto ${i + 1}"${i === 0 ? ' primary="true"' : ''}>${esc(url)}</Item>`)
    .join('\n');

  const price = tx === 'RENTAL' ? Number(p.rental_price ?? 0) : Number(p.sale_price ?? 0);
  const uf = String(p.state ?? defaultState);
  // Prefix the ListingID so codes from different modules never collide
  const listingId = `${prefix}-${String(p.code ?? p.id)}`;

  return `  <Listing>
    <ListingID>${esc(listingId)}</ListingID>
    <Title>${cdata(p.title)}</Title>
    <TransactionType>For ${tx === 'RENTAL' ? 'Rent' : 'Sale'}</TransactionType>
    <PublicationType>${isLaunch ? 'PREMIUM' : 'STANDARD'}</PublicationType>
    <Media>
${photosXml}
    </Media>
    <Details>
      <PropertyType>${esc(ptype.category)}</PropertyType>
      <PropertySubtype>${esc(ptype.type)}</PropertySubtype>
      <Description>${cdata(p.description)}</Description>
      ${tx === 'RENTAL'
        ? `<RentalPrice currency="BRL" period="Monthly">${price > 0 ? Math.round(price) : ''}</RentalPrice>`
        : `<ListPrice currency="BRL">${price > 0 ? Math.round(price) : ''}</ListPrice>`}
      <YearlyTax currency="BRL">${Math.round(Number(p.iptu ?? 0))}</YearlyTax>
      <LivingArea unit="square metres">${Number(p.area ?? 0)}</LivingArea>
      <Bedrooms>${Number(p.bedrooms ?? 0)}</Bedrooms>
      <Bathrooms>${Number(p.bathrooms ?? 0)}</Bathrooms>
      <Suites>${Number(p.suites ?? 0)}</Suites>
      <Garage type="Parking Space">${Number(p.garage_spaces ?? 0)}</Garage>
      <Floor>${esc(p.floor)}</Floor>
      <PropertyAdministrationFee currency="BRL">${Math.round(Number(p.condominium_fee ?? 0))}</PropertyAdministrationFee>
      <Furnish>${p.furnished ? 'Furnished' : 'Not Furnished'}</Furnish>
    </Details>
    <Location displayAddress="Street">
      <Country abbreviation="BR">Brasil</Country>
      <State abbreviation="${esc(uf)}">${esc(stateName(uf))}</State>
      <City>${esc(p.city)}</City>
      <Neighborhood>${esc(p.neighborhood)}</Neighborhood>
      <Address>${esc(p.address)}</Address>
      <StreetNumber>${esc(p.address_number)}</StreetNumber>
      <PostalCode>${esc((() => { const d = String(p.zip_code ?? '').replace(/\D/g, ''); return d.length === 8 ? `${d.slice(0,5)}-${d.slice(5)}` : ''; })())}</PostalCode>
    </Location>
    <ContactInfo>
      <Name>${cdata(p.broker_name)}</Name>
      <Email>${esc(p.broker_email)}</Email>
      <Telephone>${esc(p.broker_phone)}</Telephone>
      <Creci>${esc(p.creci)}</Creci>
    </ContactInfo>
  </Listing>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const sb = createClient(SUPABASE_URL, SERVICE_KEY);

    const [amRes, vdhRes, afRes] = await Promise.all([
      sb.from('am_olx_listings').select('*').eq('is_active', true),
      sb.from('vdh_olx_listings').select('*').eq('is_active', true),
      sb.from('af_olx_listings').select('*').eq('is_active', true),
    ]);

    if (amRes.error) throw amRes.error;
    if (vdhRes.error) throw vdhRes.error;
    if (afRes.error) throw afRes.error;

    const amItems = (amRes.data ?? []).map((p) => renderListing(p, 'AM', 'AM'));
    const vdhItems = (vdhRes.data ?? []).map((p) => renderListing(p, 'VDH', 'MS'));
    const afItems = (afRes.data ?? []).map((p) => renderListing(p, 'AF', 'CE'));

    const items = [...amItems, ...vdhItems, ...afItems].join('\n');
    const now = new Date().toISOString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ListingDataFeed xmlns="http://www.vivareal.com/schemas/1.0/VRSync" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.vivareal.com/schemas/1.0/VRSync http://xml.vivareal.com/vrsync.xsd">
  <Header>
    <Provider>Fixa App - Catálogo Unificado</Provider>
    <Email>contato@fixaapp.com.br</Email>
    <ContactName>Fixa App</ContactName>
    <PublishDate>${now}</PublishDate>
  </Header>
  <Listings>
${items}
  </Listings>
</ListingDataFeed>`;

    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=600',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(`<?xml version="1.0"?><Error>${esc(message)}</Error>`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
    });
  }
});