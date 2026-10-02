import { supabase } from '@/integrations/supabase/client';

export const SITE_GREEN = '#006633';
export const SITE_GREEN_DARK = '#004d26';
export const SITE_GOLD = '#c9a84c';
export const SITE_WHATSAPP = '5592988391098';

export const SITE_STATES: { uf: string; name: string }[] = [
  { uf: 'CE', name: 'Ceará' },
  { uf: 'RN', name: 'Rio Grande do Norte' },
  { uf: 'PB', name: 'Paraíba' },
  { uf: 'AM', name: 'Amazonas' },
  { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'SC', name: 'Santa Catarina' },
];
export const stateName = (uf: string) => SITE_STATES.find((s) => s.uf === uf.toUpperCase())?.name || uf;

export interface SiteProperty {
  code: string;
  uf: string;
  city: string;
  neighborhood: string | null;
  address: string | null;
  property_type: string | null;
  description: string | null;
  price: number;
  evaluation: number;
  discount: number;
  accepts_financing: boolean;
  sale_modality: string | null;
  caixa_link: string | null;
  photo_url: string | null;
  bedrooms: number;
  garage_spaces: number;
  area: number | null;
  countdown_ends_at: string | null;
  status: string;
  first_seen_at: string;
}

export const brl = (n: number) =>
  (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export const slugCity = (c: string) => encodeURIComponent(c);

export const isNew = (p: SiteProperty) => Date.now() - new Date(p.first_seen_at).getTime() < 3 * 86400_000;

export const hasFivePercentEntry = (p: Pick<SiteProperty, 'sale_modality' | 'accepts_financing'>) => {
  const modality = (p.sale_modality || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return p.accepts_financing && (modality === 'venda direta' || modality === 'venda direta online');
};

export const minimumEntry = (p: Pick<SiteProperty, 'price' | 'sale_modality' | 'accepts_financing'>) =>
  hasFivePercentEntry(p) ? p.price * 0.05 : null;

export const matriculaUrl = (p: Pick<SiteProperty, 'code' | 'uf'>) =>
  `https://venda-imoveis.caixa.gov.br/editais/matricula/${p.uf.toUpperCase()}/${p.code}.pdf`;

export function countdownLabel(iso: string | null) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return null;
  const h = Math.floor(ms / 3600_000);
  return h >= 24 ? `${Math.floor(h / 24)}d ${h % 24}h` : `${h}h`;
}

export function whatsappLink(p?: Pick<SiteProperty, 'code' | 'address' | 'city' | 'uf'> | null) {
  const msg = p
    ? `Olá! Vi no site o imóvel ${p.code} (${p.address || ''} - ${p.city}/${p.uf}) e quero saber mais.`
    : 'Olá! Vim pelo site Venda Direta Hoje e quero tirar uma dúvida.';
  return `https://wa.me/${SITE_WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

/** Busca todas as linhas, contornando o limite de 1000 por consulta. */
export async function fetchAll<T>(build: (from: number, to: number) => any): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; from < 20000; from += 1000) {
    const { data, error } = await build(from, from + 999);
    if (error) throw error;
    out.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  return out;
}

export const siteTable = () => (supabase as any).from('vdh_site_properties');

export function formatDescription(p: SiteProperty) {
  const lines = [
    `🏡 ${(p.property_type || 'Imóvel').toUpperCase()}${p.neighborhood ? ` - ${p.neighborhood.toUpperCase()}` : ''}`,
    '',
    `💰 Valor de avaliação: ${brl(p.evaluation)}`,
    `🔥 Valor de venda: ${brl(p.price)}${p.discount > 0 ? ` (${Math.round(p.discount)}% de desconto)` : ''}`,
    '',
    `🏷️ Modalidade: ${p.sale_modality || 'Consulte as condições'}`,
    p.accepts_financing ? '🏦 Aceita financiamento' : '💵 Pagamento à vista',
    hasFivePercentEntry(p) ? `📥 Entrada a partir de 5% (${brl(p.price * 0.05)})*` : null,
    '',
    '📌 Características do imóvel:',
    `🏠 Tipo: ${p.property_type || 'Imóvel'}`,
    p.bedrooms ? `🛏️ ${p.bedrooms} quarto${p.bedrooms > 1 ? 's' : ''}` : null,
    p.garage_spaces ? `🚗 ${p.garage_spaces} vaga${p.garage_spaces > 1 ? 's' : ''} de garagem` : null,
    p.area ? `📐 Área: ${Math.round(p.area)} m²` : null,
    p.description ? `📝 ${p.description}` : null,
    '',
    '📍 Localização:',
    `📍 ${p.address || 'Endereço informado pela Caixa'}`,
    `📍 ${p.city}/${p.uf}`,
    '',
    `🔎 Código do imóvel na Caixa: ${p.code}`,
    hasFivePercentEntry(p) ? '' : null,
    hasFivePercentEntry(p) ? '*Entrada mínima sujeita à análise de crédito, às condições do edital e às regras vigentes da Caixa.' : null,
  ].filter(l => l !== null);
  return lines.join('\n');
}
