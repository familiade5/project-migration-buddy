import { CxDocument, CxExtraction } from '@/types/correspondente';

/** Ficha pessoal consolidada a partir dos documentos lidos pela IA. */
export interface CxProfileData {
  full_name?: string | null;
  cpf?: string | null;
  rg?: string | null;
  birth_date?: string | null;
  mother_name?: string | null;
  marital_status?: string | null;
  profession?: string | null;
  employer?: string | null;
  address?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  monthly_income?: number | null;
}

export const CX_PROFILE_LABELS: { key: keyof CxProfileData; label: string }[] = [
  { key: 'full_name', label: 'Nome completo' },
  { key: 'cpf', label: 'CPF' },
  { key: 'rg', label: 'RG / Identidade' },
  { key: 'birth_date', label: 'Data de nascimento' },
  { key: 'mother_name', label: 'Nome da mãe' },
  { key: 'marital_status', label: 'Estado civil' },
  { key: 'profession', label: 'Profissão / Cargo' },
  { key: 'employer', label: 'Empresa' },
  { key: 'address', label: 'Endereço' },
  { key: 'neighborhood', label: 'Bairro' },
  { key: 'city', label: 'Cidade' },
  { key: 'state', label: 'UF' },
  { key: 'zip_code', label: 'CEP' },
];

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const has = (l: string, ...terms: string[]) => terms.some((t) => l.includes(t));

const parseMoney = (value: string): number | null => {
  const clean = value.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
  const n = Number(clean);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** Lê um documento extraído e devolve os campos pessoais reconhecidos. */
export function profileFromExtraction(extraction?: CxExtraction | Record<string, never> | null): CxProfileData {
  const out: CxProfileData = {};
  if (!extraction || !('groups' in extraction) || !Array.isArray(extraction.groups)) return out;

  const set = <K extends keyof CxProfileData>(key: K, value: CxProfileData[K]) => {
    if (out[key] == null && value != null && String(value).trim() !== '' && String(value).trim() !== '-') {
      out[key] = value;
    }
  };

  for (const group of extraction.groups) {
    for (const field of group.fields || []) {
      const l = norm(field.label);
      const v = field.value.trim();
      if (!v) continue;

      if (
        has(l, 'nome completo', 'nome do empregado', 'nome do titular', 'nome do trabalhador', 'nome do declarante', 'nome do beneficiario') ||
        l === 'nome'
      ) {
        set('full_name', v);
      }
      if (l === 'cpf' || (has(l, 'cpf') && !has(l, 'cnpj', 'conjuge', 'fonte'))) set('cpf', v);
      if (l === 'rg' || has(l, 'rg (numero)', 'numero do rg', 'identidade', 'registro geral')) set('rg', v);
      if (has(l, 'data de nascimento') || l === 'nascimento') set('birth_date', v);
      if (has(l, 'nome da mae')) set('mother_name', v);
      if (has(l, 'estado civil')) set('marital_status', v);
      if (has(l, 'cargo', 'profissao', 'funcao', 'ocupacao')) set('profession', v);
      if (has(l, 'empresa', 'razao social', 'empregador')) set('employer', v);
      if (has(l, 'logradouro') || l === 'endereco' || has(l, 'endereco completo')) set('address', v);
      if (l === 'bairro') set('neighborhood', v);
      if (has(l, 'cidade', 'municipio')) set('city', v);
      if (l === 'uf' || has(l, 'estado/uf', 'orgao emissor/uf') || (l === 'estado' && !has(l, 'civil'))) {
        set('state', v.length <= 4 ? v.toUpperCase() : v);
      }
      if (l === 'cep' || has(l, 'cep')) set('zip_code', v);
      if (has(l, 'valor liquido', 'salario base', 'ultimo salario', 'salario registrado')) {
        const money = parseMoney(v);
        if (money != null && out.monthly_income == null) out.monthly_income = money;
      }
    }
  }

  const bank = 'bankAnalysis' in extraction ? extraction.bankAnalysis : null;
  if (bank?.holder) set('full_name', bank.holder);
  const irpf = 'irpfAnalysis' in extraction ? extraction.irpfAnalysis : null;
  if (irpf?.holder) set('full_name', irpf.holder);
  if (irpf?.cpf) set('cpf', irpf.cpf);

  return out;
}

/** Documentos mais confiáveis para cada tipo de informação vêm primeiro. */
const DOC_PRIORITY = [
  'rg',
  'cpf',
  'certidao',
  'ctps',
  'contracheque',
  'comprovante_residencia',
  'imposto_renda',
  'recibo_ir',
  'extrato_fgts',
  'extrato_bancario',
];

const docRank = (type: string) => {
  const i = DOC_PRIORITY.indexOf(type);
  return i === -1 ? DOC_PRIORITY.length : i;
};

/** Junta todos os documentos do cliente numa única ficha. */
export function consolidateProfile(documents: CxDocument[]): CxProfileData {
  const ordered = [...documents]
    .filter((d) => d.status === 'done')
    .sort((a, b) => docRank(a.doc_type) - docRank(b.doc_type));

  const result: CxProfileData = {};
  for (const doc of ordered) {
    const partial = profileFromExtraction(doc.extracted);
    for (const [key, value] of Object.entries(partial)) {
      const k = key as keyof CxProfileData;
      if (result[k] == null && value != null && value !== '') {
        (result as Record<string, unknown>)[k] = value;
      }
    }
  }
  return result;
}

export const onlyDigits = (value?: string | null) => (value || '').replace(/\D/g, '');

/** Formata CPF quando vier só com dígitos. */
export const formatCpf = (value?: string | null) => {
  const d = onlyDigits(value);
  if (d.length !== 11) return value || '';
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const nameKey = (name: string) => norm(name).replace(/\s+/g, ' ');

/** Encontra um cliente já cadastrado pelo CPF ou pelo nome completo. */
export function matchClient<T extends { id: string; full_name: string; cpf?: string | null }>(
  clients: T[],
  profile: CxProfileData,
): T | null {
  const cpf = onlyDigits(profile.cpf);
  if (cpf.length === 11) {
    const byCpf = clients.find((c) => onlyDigits(c.cpf) === cpf);
    if (byCpf) return byCpf;
  }
  if (profile.full_name) {
    const key = nameKey(profile.full_name);
    const byName = clients.find((c) => nameKey(c.full_name) === key);
    if (byName) return byName;
  }
  return null;
}
