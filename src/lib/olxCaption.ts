// Utilities to sanitize captions before sending to OLX / ZAP / VivaReal.
// These portals don't render emojis properly (they show as "?"), and we also
// want to strip the broker phone/contact line, since the portals provide
// their own contact channel.

// Match emoji + symbol ranges (broad coverage incl. ZWJ + variation selectors).
const EMOJI_REGEX =
  /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2460}-\u{24FF}\u{2500}-\u{257F}\u{2580}-\u{259F}\u{25A0}-\u{27BF}\u{2900}-\u{297F}\u{2B00}-\u{2BFF}\u{3030}\u{303D}\u{3297}\u{3299}\u{FE0F}\u{200D}]/gu;

const PHONE_LINE_REGEX =
  /^.*(?:\(?\d{2}\)?\s?9?\d{4,5}[-\s]?\d{4}|whats?app|telefone|tel\.?\s*:|contato\s*:|☎|📱|📞).*$/gim;

export function stripEmojis(text: string): string {
  if (!text) return '';
  return text.replace(EMOJI_REGEX, '');
}

/**
 * Returns a caption ready for OLX/ZAP/VivaReal:
 *  - removes emojis,
 *  - removes lines that contain phone numbers / "Contato" / "WhatsApp",
 *  - collapses extra blank lines and trims trailing spaces.
 */
export function sanitizeCaptionForOlx(text: string): string {
  if (!text) return '';
  const noEmojis = stripEmojis(text);
  const noPhone = noEmojis.replace(PHONE_LINE_REGEX, '');
  return noPhone
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ---------------------------------------------------------------------------
// Structured OLX description builder
// ---------------------------------------------------------------------------

const formatBRL = (n: number): string =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

const ordinal = (floor: string | number | undefined | null): string => {
  if (floor === undefined || floor === null) return '';
  const s = String(floor).trim();
  if (!s) return '';
  // Already contains º / ° / "andar"
  if (/[º°]/.test(s) || /andar/i.test(s)) return s;
  const n = parseInt(s, 10);
  if (Number.isFinite(n)) return `${n}º Andar`;
  return s;
};

export interface OlxDescriptionInput {
  title?: string;
  propertyType?: string;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  area?: number;
  garageSpaces?: number;
  floor?: string | number;
  furnished?: boolean;
  salePrice?: number;
  rentalPrice?: number;
  acceptsFinancing?: boolean;
  acceptsFGTS?: boolean;
  condominiumFee?: number;
  iptu?: number;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  leisureItems?: string;
  brokerName?: string;
  creci?: string;
}

/**
 * Builds the rich OLX/ZAP/VivaReal description in the standard agency format:
 *
 *   Title - N Quartos - Neighborhood
 *
 *   Valor de Venda de R$ X,XX Aceita financiamento e FGTS
 *
 *   N quartos
 *   Nº Andar
 *   N vaga de garagem
 *   Nm²
 *   Área de lazer completa
 *
 *   Localização: Address - Neighborhood, City - UF
 *
 *   Broker | Corretor de Imóveis
 *   CRECI X
 */
export function buildOlxDescription(
  d: OlxDescriptionInput,
  txType: 'venda' | 'aluguel' | 'lancamento' = 'venda',
): string {
  const lines: string[] = [];

  // Header line
  const headerParts: string[] = [];
  if (d.title?.trim()) headerParts.push(d.title.trim());
  else if (d.propertyType) headerParts.push(d.propertyType);
  if (d.bedrooms) headerParts.push(`${d.bedrooms} Quarto${d.bedrooms > 1 ? 's' : ''}`);
  if (d.neighborhood) headerParts.push(d.neighborhood);
  if (headerParts.length) lines.push(headerParts.join(' - '));
  lines.push('');

  // Price line
  const isRent = txType === 'aluguel';
  const price = isRent ? d.rentalPrice : d.salePrice;
  if (price && price > 0) {
    const label = isRent ? 'Aluguel' : txType === 'lancamento' ? 'Lançamento a partir de' : 'Venda';
    let priceLine = `Valor de ${label} de ${formatBRL(price)}`;
    if (!isRent && d.acceptsFinancing && d.acceptsFGTS) priceLine += ' Aceita financiamento e FGTS';
    else if (!isRent && d.acceptsFinancing) priceLine += ' Aceita financiamento';
    else if (!isRent && d.acceptsFGTS) priceLine += ' Aceita FGTS';
    lines.push(priceLine);
    lines.push('');
  }

  // Specs (one per line, agency style)
  if (d.bedrooms) lines.push(`${d.bedrooms} quarto${d.bedrooms > 1 ? 's' : ''}`);
  if (d.suites) lines.push(`${d.suites} suíte${d.suites > 1 ? 's' : ''}`);
  if (d.bathrooms) lines.push(`${d.bathrooms} banheiro${d.bathrooms > 1 ? 's' : ''}`);
  const floorLabel = ordinal(d.floor);
  if (floorLabel) lines.push(floorLabel);
  if (d.garageSpaces) lines.push(`${d.garageSpaces} vaga${d.garageSpaces > 1 ? 's' : ''} de garagem`);
  if (d.area) lines.push(`${d.area}m²`);
  if (d.furnished) lines.push('Mobiliado');

  const leisure = (d.leisureItems || '').replace(/\s+/g, ' ').trim();
  if (leisure) {
    // Keep it concise: single line summary
    lines.push(leisure.length > 80 ? 'Área de lazer completa' : `Lazer: ${leisure}`);
  }

  if (d.condominiumFee && d.condominiumFee > 0) lines.push(`Condomínio: ${formatBRL(d.condominiumFee)}`);
  if (d.iptu && d.iptu > 0) lines.push(`IPTU: ${formatBRL(d.iptu)}`);

  lines.push('');

  // Location
  const locParts: string[] = [];
  if (d.address?.trim()) locParts.push(d.address.trim());
  const cityUf = [d.city, d.state].filter(Boolean).join(' - ');
  const tail = [d.neighborhood, cityUf].filter(Boolean).join(', ');
  const loc = [locParts.join(''), tail].filter(Boolean).join(' - ');
  if (loc) lines.push(`Localização: ${loc}`);

  lines.push('');

  // Broker signature
  if (d.brokerName?.trim()) lines.push(`${d.brokerName.trim()} | Corretor de Imóveis`);
  if (d.creci?.trim()) lines.push(`CRECI ${d.creci.trim()}`);

  return sanitizeCaptionForOlx(lines.join('\n'));
}