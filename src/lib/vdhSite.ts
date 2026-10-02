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

/** Estimativa simples (não substitui a análise da Caixa). */
export function estimate(price: number, income: number) {
  const entrada = price * 0.2;
  const financiado = price - entrada;
  const i = 0.0866 / 12;
  const n = 360;
  const parcela = financiado * (i / (1 - Math.pow(1 + i, -n)));
  const capacidade = income * 0.3;
  const ratio = capacidade > 0 ? parcela / capacidade : 99;
  const verdict = ratio <= 1 ? 'boa' : ratio <= 1.4 ? 'compositor' : 'fora';
  return { entrada, financiado, parcela, capacidade, verdict } as const;
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
