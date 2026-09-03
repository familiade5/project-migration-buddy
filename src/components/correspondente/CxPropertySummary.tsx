import {
  AlertTriangle,
  Building,
  CheckCircle2,
  FileSignature,
  Home,
  Landmark,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { CxDocument, CxPropertyLien } from '@/types/correspondente';
import { CopyText } from './CopyText';
import { cxGetPropertyAnalysis, cxSummarizeProperty, cxIsBlockingLien } from '@/lib/cxProperty';


const LIEN_LABEL: Record<string, string> = {
  penhora: 'Penhora',
  alienacao_fiduciaria: 'Alienação fiduciária',
  alienacao: 'Alienação fiduciária',
  caucao: 'Caução',
  hipoteca: 'Hipoteca',
  usufruto: 'Usufruto',
  processo: 'Ação judicial / processo',
  indisponibilidade: 'Indisponibilidade',
  outro: 'Outro ônus',
};

function LienCard({ lien }: { lien: CxPropertyLien }) {
  const blocking = cxIsBlockingLien(lien);
  const cleared = lien.active === false;
  const tone = cleared
    ? 'border-slate-200 bg-slate-50'
    : blocking
      ? 'border-red-200 bg-red-50'
      : 'border-amber-200 bg-amber-50';
  const text = cleared ? 'text-slate-600' : blocking ? 'text-red-700' : 'text-amber-800';
  return (
    <div className={`rounded-xl border p-3 ${tone}`}>
      <div className="flex items-start gap-2">
        {cleared ? (
          <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" />
        ) : (
          <ShieldAlert className={`w-4 h-4 mt-0.5 flex-shrink-0 ${text}`} />
        )}
        <div className="min-w-0 space-y-1">
          <p className={`text-[13px] font-bold ${text}`}>
            {LIEN_LABEL[lien.type] || lien.type}
            {lien.act ? ` · ${lien.act}` : ''}
            {lien.date ? ` · ${lien.date}` : ''}
            {cleared ? ' — baixado/cancelado' : ''}
          </p>
          {lien.creditor && <p className="text-xs font-semibold text-slate-700">Credor: {lien.creditor}</p>}
          <p className="text-xs text-slate-600">{lien.description}</p>
        </div>
      </div>
    </div>
  );
}

function Section({
  n,
  title,
  icon,
  children,
}: {
  n: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
        <span className="text-slate-400">{icon}</span>
        {n}. {title}
      </p>
      {children}
    </section>
  );
}

export function CxPropertySummary({ documents }: { documents: CxDocument[] }) {
  const analyses = documents
    .filter((d) => d.doc_type === 'matricula_imovel')
    .map((d) => ({ doc: d, analysis: cxGetPropertyAnalysis(d) }))
    .filter((x) => x.analysis) as {
    doc: CxDocument;
    analysis: NonNullable<ReturnType<typeof cxGetPropertyAnalysis>>;
  }[];

  if (analyses.length === 0) return null;

  return (
    <div className="space-y-4">
      {analyses.map(({ doc, analysis }) => {
        const s = cxSummarizeProperty(analysis);
        const clear = s.blockingCount === 0 && !s.fgtsRecent;
        return (
          <div key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-sm font-bold text-slate-900">Análise da matrícula do imóvel</h3>
              {analysis.registrationNumber && (
                <span className="text-xs text-slate-500">Matrícula {analysis.registrationNumber}</span>
              )}
            </div>

            {/* Semáforo */}
            <div
              className={`rounded-xl border p-3 flex items-start gap-2 ${
                clear ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
              }`}
            >
              {clear ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <div className="text-[13px]">
                <p className={`font-bold ${clear ? 'text-emerald-800' : 'text-red-700'}`}>
                  {clear
                    ? 'Nenhum impedimento identificado para a transferência'
                    : 'Atenção: há pontos que podem impedir a transferência'}
                </p>
                <ul className={`mt-1 space-y-0.5 ${clear ? 'text-emerald-700' : 'text-red-700'}`}>
                  {s.blockingCount > 0 && (
                    <li>• {s.blockingCount} ônus/processo ativo(s) que bloqueiam ou dificultam a transferência.</li>
                  )}
                  {s.fgtsRecent && (
                    <li>
                      • FGTS utilizado na aquisição há menos de 3 anos
                      {analysis.fgtsDate ? ` (${analysis.fgtsDate})` : ''}
                      {s.fgtsReleaseDate ? ` — carência até ${s.fgtsReleaseDate}` : ''}.
                    </li>
                  )}
                  {s.missingMunicipal && <li>• Inscrição municipal / IPU não localizada no documento.</li>}
                  {clear && s.missingMunicipal === false && <li>• Documento sem ônus ativos registrados.</li>}
                </ul>
              </div>
            </div>

            {/* 1 - Imóvel */}
            <Section n={1} title="Endereço e descrição do imóvel" icon={<Home className="w-3.5 h-3.5" />}>
              <div className="rounded-xl border border-slate-200 p-3 space-y-1">
                <CopyText
                  value={analysis.address}
                  label="Endereço"
                  emptyText="Endereço não identificado"
                  className="text-[13px] font-semibold text-slate-800"
                />
                {analysis.description && (
                  <CopyText value={analysis.description} label="Descrição" className="text-xs text-slate-600" />
                )}
              </div>

            </Section>

            {/* 2 - Ônus */}
            <Section n={2} title="Penhoras, alienações e cauções" icon={<ShieldAlert className="w-3.5 h-3.5" />}>
              {analysis.liens.length === 0 ? (
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  Nenhuma penhora, alienação, caução ou processo averbado na matrícula.
                </p>
              ) : (
                <div className="grid gap-2 md:grid-cols-2">
                  {[...s.activeLiens, ...s.clearedLiens].map((l, i) => (
                    <LienCard key={i} lien={l} />
                  ))}
                </div>
              )}
            </Section>

            {/* 3 - Endereços e construções */}
            <Section n={3} title="Endereços averbados e construções" icon={<MapPin className="w-3.5 h-3.5" />}>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Primeiro endereço</p>
                  <p className="text-[13px] text-slate-800">{analysis.firstAddress || '—'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Último endereço averbado</p>
                  <p className="text-[13px] text-slate-800">{analysis.lastAddress || analysis.address || '—'}</p>
                </div>
              </div>
              {analysis.addressEntries.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="text-left font-semibold px-3 py-2">Ato</th>
                        <th className="text-left font-semibold px-3 py-2">Data</th>
                        <th className="text-left font-semibold px-3 py-2">Tipo</th>
                        <th className="text-left font-semibold px-3 py-2">Endereço / descrição</th>
                        <th className="text-left font-semibold px-3 py-2">CEP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.addressEntries.map((e, i) => (
                        <tr key={i} className="border-t border-slate-100 align-top">
                          <td className="px-3 py-2 font-semibold text-slate-700">{e.act || '—'}</td>
                          <td className="px-3 py-2 text-slate-600">{e.date || '—'}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                e.kind === 'construcao' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {e.kind === 'construcao' ? <Building className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                              {e.kind === 'construcao' ? 'Construção' : 'Endereço'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-700">{e.address || e.description || '—'}</td>
                          <td className="px-3 py-2 text-slate-600">{e.cep || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>

            {/* 4 - Matrícula e cartório */}
            <Section n={4} title="Matrícula e cartório" icon={<FileSignature className="w-3.5 h-3.5" />}>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Nº da matrícula</p>
                  <p className="text-[13px] font-semibold text-slate-800">{analysis.registrationNumber || '—'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Cartório</p>
                  <p className="text-[13px] font-semibold text-slate-800">{analysis.notaryOffice || '—'}</p>
                </div>
              </div>
            </Section>

            {/* 5 - Proprietários */}
            <Section n={5} title="Últimos proprietários" icon={<Users className="w-3.5 h-3.5" />}>
              {analysis.owners.length === 0 ? (
                <p className="text-xs text-slate-500">Nenhum proprietário identificado.</p>
              ) : (
                <div className="space-y-2">
                  {analysis.owners.map((o, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-3 ${
                        o.current ? 'border-[#1a3a6b]/30 bg-blue-50/50' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13px] font-bold text-slate-900">{o.name}</p>
                        {o.cpf && <span className="text-xs text-slate-600">CPF {o.cpf}</span>}
                        {o.current && (
                          <span className="px-2 py-0.5 rounded-full bg-[#1a3a6b] text-white text-[10px] font-bold">
                            Proprietário atual
                          </span>
                        )}
                        {(o.acquisitionAct || o.acquisitionDate) && (
                          <span className="text-[11px] text-slate-500">
                            {o.acquisitionAct || ''} {o.acquisitionDate ? `· ${o.acquisitionDate}` : ''}
                          </span>
                        )}
                      </div>
                      {o.qualification && <p className="text-xs text-slate-600 mt-1">{o.qualification}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* 6 - Inscrição municipal */}
            <Section n={6} title="Matrícula municipal / IPU" icon={<Landmark className="w-3.5 h-3.5" />}>
              {analysis.municipalRegistration ? (
                <p className="text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-200 p-3">
                  {analysis.municipalRegistration}
                </p>
              ) : (
                <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  Inscrição municipal (IPTU/IPU) não encontrada no documento — solicitar ao cliente ou consultar a
                  prefeitura.
                </p>
              )}
            </Section>

            {/* 7 - FGTS */}
            <Section n={7} title="Uso de FGTS na aquisição" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              {analysis.fgtsUsed ? (
                <div
                  className={`rounded-xl border p-3 text-xs flex items-start gap-2 ${
                    s.fgtsRecent ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-800'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="font-bold">
                      {s.fgtsRecent
                        ? 'FGTS utilizado há menos de 3 anos — impedimento para nova operação com FGTS'
                        : 'FGTS utilizado na aquisição (há mais de 3 anos)'}
                    </p>
                    <p className="mt-0.5">
                      {analysis.fgtsDate ? `Data do ato: ${analysis.fgtsDate}. ` : ''}
                      {s.fgtsMonths != null ? `${s.fgtsMonths} meses decorridos. ` : ''}
                      {s.fgtsRecent && s.fgtsReleaseDate ? `Liberação a partir de ${s.fgtsReleaseDate}. ` : ''}
                      {analysis.fgtsNote || ''}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  Nenhuma menção a uso de FGTS na aquisição do imóvel.
                </p>
              )}
            </Section>
          </div>
        );
      })}
    </div>
  );
}
