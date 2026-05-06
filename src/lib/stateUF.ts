const STATE_UF_MAP: Record<string, string> = {
  'acre': 'AC', 'alagoas': 'AL', 'amapá': 'AP', 'amapa': 'AP',
  'amazonas': 'AM', 'bahia': 'BA', 'ceará': 'CE', 'ceara': 'CE',
  'distrito federal': 'DF', 'espírito santo': 'ES', 'espirito santo': 'ES',
  'goiás': 'GO', 'goias': 'GO', 'maranhão': 'MA', 'maranhao': 'MA',
  'mato grosso do sul': 'MS', 'mato grosso': 'MT',
  'minas gerais': 'MG', 'pará': 'PA', 'para': 'PA',
  'paraíba': 'PB', 'paraiba': 'PB', 'paraná': 'PR', 'parana': 'PR',
  'pernambuco': 'PE', 'piauí': 'PI', 'piaui': 'PI',
  'rio de janeiro': 'RJ', 'rio grande do norte': 'RN',
  'rio grande do sul': 'RS', 'rondônia': 'RO', 'rondonia': 'RO',
  'roraima': 'RR', 'santa catarina': 'SC', 'são paulo': 'SP', 'sao paulo': 'SP',
  'sergipe': 'SE', 'tocantins': 'TO',
};

const VALID_UFS = new Set(Object.values(STATE_UF_MAP));

export const resolveUF = (stateInput: string | undefined | null): string => {
  if (!stateInput) return '';
  const clean = stateInput.trim().toLowerCase();
  if (!clean) return '';
  if (clean.length === 2) return clean.toUpperCase();
  if (STATE_UF_MAP[clean]) return STATE_UF_MAP[clean];
  // Try without diacritics
  const noAccent = clean.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (STATE_UF_MAP[noAccent]) return STATE_UF_MAP[noAccent];
  // Last resort: only use slice fallback if it produces a valid UF
  const slice = stateInput.trim().slice(0, 2).toUpperCase();
  return VALID_UFS.has(slice) ? slice : slice;
};