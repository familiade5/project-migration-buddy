import { PropertyData } from '@/types/property';

export interface VdhCreciOption {
  id: string;
  creci_number: string;
  state: string;
  name: string | null;
  is_default?: boolean;
}

const STATE_UF_MAP: Record<string, string> = {
  acre: 'AC',
  alagoas: 'AL',
  'amapá': 'AP',
  amapa: 'AP',
  amazonas: 'AM',
  bahia: 'BA',
  'ceará': 'CE',
  ceara: 'CE',
  'distrito federal': 'DF',
  'espírito santo': 'ES',
  'espirito santo': 'ES',
  'goiás': 'GO',
  goias: 'GO',
  'maranhão': 'MA',
  maranhao: 'MA',
  'mato grosso do sul': 'MS',
  'mato grosso': 'MT',
  'minas gerais': 'MG',
  'pará': 'PA',
  para: 'PA',
  'paraíba': 'PB',
  paraiba: 'PB',
  'paraná': 'PR',
  parana: 'PR',
  pernambuco: 'PE',
  'piauí': 'PI',
  piaui: 'PI',
  'rio de janeiro': 'RJ',
  'rio grande do norte': 'RN',
  'rio grande do sul': 'RS',
  'rondônia': 'RO',
  rondonia: 'RO',
  roraima: 'RR',
  'santa catarina': 'SC',
  'são paulo': 'SP',
  'sao paulo': 'SP',
  sergipe: 'SE',
  tocantins: 'TO',
};

const resolveUF = (stateInput: string): string => {
  const clean = stateInput.trim().toLowerCase();
  if (clean.length === 2) return clean.toUpperCase();
  return STATE_UF_MAP[clean] || stateInput.trim().slice(0, 2).toUpperCase();
};

const getFeatureEmoji = (feature: string): string => {
  const emojiMap: Record<string, string> = {
    Piscina: '🏊',
    Churrasqueira: '🍖',
    'Área de Lazer': '🎯',
    'Portaria 24h': '🔐',
    Academia: '💪',
    'Ar Condicionado': '❄️',
    Mobiliado: '🛋️',
    Quintal: '🌳',
    Varanda: '🌅',
    Elevador: '🛗',
    'Pet Friendly': '🐕',
  };

  return emojiMap[feature] || '✨';
};

const getPjCreci = (
  data: PropertyData,
  crecis: VdhCreciOption[],
  formatCreci: (creci: VdhCreciOption) => string,
): string => {
  if (!data.state || crecis.length === 0) return data.creci;

  const uf = resolveUF(data.state);
  const pjCreci = crecis.find((creci) => creci.state.toUpperCase() === uf && creci.name === 'PJ');
  if (pjCreci) return formatCreci(pjCreci);

  const stateCreci = crecis.find((creci) => creci.state.toUpperCase() === uf);
  if (stateCreci) return formatCreci(stateCreci);

  const anyPj = crecis.find((creci) => creci.name === 'PJ');
  return anyPj ? formatCreci(anyPj) : data.creci;
};

export const buildVdhCaption = (
  data: PropertyData,
  crecis: VdhCreciOption[],
  formatCreci: (creci: VdhCreciOption) => string,
): string => {
  const lines: string[] = [];

  if (data.propertyName) {
    lines.push(`🏡 ${data.propertyName.toUpperCase()}`);
  } else if (data.neighborhood) {
    lines.push(`🏡 ${(data.type || 'Imóvel').toUpperCase()} - ${data.neighborhood.toUpperCase()}`);
  } else {
    lines.push(`🏡 ${(data.type || 'Imóvel').toUpperCase()} - ${(data.city || 'Sem cidade').toUpperCase()}`);
  }
  lines.push('');

  lines.push(`💰 Valor de Avaliação: ${data.evaluationValue}`);
  lines.push(`🔥 Valor Mínimo de Venda: ${data.minimumValue} (desconto de ${data.discount}%)`);
  lines.push('');

  lines.push(`💵 ${data.paymentMethod}`);
  lines.push(data.acceptsFGTS ? '💼 Aceita FGTS' : '❌ Não Aceita FGTS');
  lines.push(data.acceptsFinancing ? '🏦 Aceita Financiamento' : '❌ Não Aceita Financiamento');

  if (data.hasEasyEntry && data.entryValue) {
    lines.push(`📥 Entrada Facilitada: ${data.entryValue}`);
  } else if (data.hasEasyEntry) {
    lines.push('📥 Entrada Facilitada');
  }
  lines.push('');

  lines.push('📌 Características do Imóvel:');
  lines.push(`🏠 Tipo: ${data.type}`);

  if (data.bedrooms && data.bedrooms !== '0') {
    lines.push(`🛏️ ${data.bedrooms} Quarto${Number(data.bedrooms) > 1 ? 's' : ''}`);
  }
  if (data.hasSala) lines.push('🛋️ Sala');
  if (data.hasCozinha) lines.push('🍽️ Cozinha');
  if (data.bathrooms && data.bathrooms !== '0') {
    lines.push(`🚿 ${data.bathrooms} Banheiro${Number(data.bathrooms) > 1 ? 's' : ''}`);
  }
  if (data.hasAreaServico) lines.push('🧺 Área de Serviço');
  if (data.garageSpaces && data.garageSpaces !== '0') {
    lines.push(`🚗 ${data.garageSpaces} Vaga${Number(data.garageSpaces) > 1 ? 's' : ''} de Garagem`);
  }

  data.features.forEach((feature) => {
    if (feature !== 'Vaga de Garagem') {
      lines.push(`${getFeatureEmoji(feature)} ${feature}`);
    }
  });
  lines.push('');

  if (data.areaTotal || data.areaPrivativa || data.areaTerreno || data.area) {
    if (data.areaTotal) lines.push(`📐 Área Total: ${data.areaTotal} m²`);
    if (data.areaPrivativa) lines.push(`📐 Área Privativa: ${data.areaPrivativa} m²`);
    if (data.areaTerreno) lines.push(`📐 Área do Terreno: ${data.areaTerreno} m²`);
    if (data.area && !data.areaTotal && !data.areaPrivativa && !data.areaTerreno) {
      lines.push(`📐 Área: ${data.area} m²`);
    }
    lines.push('');
  }

  lines.push('📍 Endereço:');
  if (data.street) {
    let addressLine = `📍 ${data.street}`;
    if (data.number) addressLine += `, nº ${data.number}`;
    if (data.complement) addressLine += ` – ${data.complement}`;
    lines.push(addressLine);
  }
  if (data.neighborhood) lines.push(`📍 ${data.neighborhood}`);
  lines.push(`📍 ${data.city} – ${data.state}`);
  if (data.cep) lines.push(`📮 CEP: ${data.cep}`);
  lines.push('');

  if (data.condominiumRules || data.taxRules) {
    lines.push('⚠️ Regras sobre despesas:');
    if (data.condominiumRules) lines.push(`🏘️ Condomínio: ${data.condominiumRules}`);
    if (data.taxRules) lines.push(`💸 Tributos: ${data.taxRules}`);
    lines.push('');
  }

  const pjCreci = getPjCreci(data, crecis, formatCreci);

  lines.push('📞 Mais informações:');
  if (data.selectedBroker === 'almir') {
    lines.push('👤 Almir Neto - Regional');
    lines.push('📄 CRECI 29013 CE');
    lines.push('📱 (85) 99271-0485');
    lines.push('');
    lines.push('👤 Iury Sampaio - Nacional');
    lines.push(`📄 ${pjCreci}`);
    lines.push('📱 (92) 98839-1098');
  } else {
    if (data.contactName) lines.push(`👤 ${data.contactName}`);
    if (data.creci) lines.push(`📄 ${pjCreci}`);
    if (data.contactPhone) lines.push(`📱 ${data.contactPhone}`);
  }

  return lines.join('\n');
};
