import { AlertTriangle, Building2, Home, ShieldCheck, ShieldAlert } from 'lucide-react';
import { CxDocument } from '@/types/correspondente';
import { cxFormatBRL } from '@/lib/cxIncome';
import { cxGetIrpfAnalysis, cxSummarizeIrpf, CX_IRPF_EXEMPT_LIMIT } from '@/lib/cxIrpf';

export function CxIrpfSummary({ documents }: { documents: CxDocument[] }) {
  const analyses = documents
    .filter((d) => d.doc_type === 'imposto_renda')
    .map((d) => ({ doc: d, analysis: cxGetIrpfAnalysis(d) }))
    .filter((x) => x.analysis) as { doc: CxDocument; analysis: NonNullable<ReturnType<typeof cxGetIrpfAnalysis>> }[];

  if (analyses.length === 0) return null;

  return (
    <div className="space-y-4">
      {analyses.map(({ doc, analysis }) => {
        const s = cxSummarizeIrpf(analysis);
        return (
          <div key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                Análise do Imposto de Renda{analysis.year ? ` — ${analysis.year}` : ''}
              </h3>
              {analysis.holder && (
                <span className="text-xs text-slate-500">
                  {analysis.holder}
                  {analysis.cpf ? ` · ${analysis.cpf}` : ''}
                </span>
              )}
            </div>

            {/* 1 - Rendimentos de PJ */}
            <section className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                1. Rendimentos recebidos de pessoa jurídica
              </p>
              {s.analysis.pjIncomes.length === 0 ? (
                <p className="text-xs text-slate-500">Nenhum rendimento de PJ declarado.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="text-left font-semibold px-3 py-2">CNPJ / Fonte pagadora</th>
                        <th className="text-right font-semibold px-3 py-2">Rendimento anual</th>
                        <th className="text-right font-semibold px-3 py-2">Média mensal</th>
                        <th className="text-right font-semibold px-3 py-2">13º salário</th>
                        <th className="text-left font-semibold px-3 py-2">INSS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.analysis.pjIncomes.map((r, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-2">
                            <CopyText
                              value={r.cnpj || '—'}
                              label="CNPJ"
                              className="block font-semibold text-slate-800"
                            />
                            {r.sourceName && (
                              <CopyText
                                value={r.sourceName}
                                label="Empresa"
                                className="block text-slate-500"
                              />
                            )}
                          </td>

                          <td className="px-3 py-2 text-right font-semibold text-slate-800">
                            {cxFormatBRL(r.taxableIncome)}
                          </td>
                          <td className="px-3 py-2 text-right text-slate-600">
                            {cxFormatBRL((r.taxableIncome || 0) / 12)}
                          </td>
                          <td className="px-3 py-2 text-right text-slate-600">
                            {r.thirteenthSalary ? cxFormatBRL(r.thirteenthSalary) : '—'}
                          </td>
                          <td className="px-3 py-2">
                            {r.inssWithheld ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Recolhido{r.inssAmount ? ` · ${cxFormatBRL(r.inssAmount)}` : ''}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                Sem recolhimento
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t border-slate-200 bg-slate-50">
                        <td className="px-3 py-2 font-bold text-slate-700">Total</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">{cxFormatBRL(s.totalPj)}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-700">{cxFormatBRL(s.totalPj / 12)}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-700">
                          {s.total13 > 0 ? cxFormatBRL(s.total13) : '—'}
                        </td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {s.pjWithoutInss > 0 && (
                <p className="text-[11px] text-amber-700 font-semibold">
                  ⚠️ {s.pjWithoutInss} fonte(s) pagadora(s) sem recolhimento de INSS — confirmar vínculo e contribuição.
                </p>
              )}
            </section>

            {/* 2 - Isentos */}
            <section className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                2. Rendimentos isentos e não tributáveis
              </p>
              {s.profitLines.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Sem rendimento de sócio / retirada de lucro declarado.
                  {s.otherExemptTotal > 0 && ` Outros isentos: ${cxFormatBRL(s.otherExemptTotal)}.`}
                </p>
              ) : (
                <div className="space-y-2">
                  {s.profitLines.map((p, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-3 ${
                        p.belowLimit ? 'border-red-300 bg-red-50' : 'border-emerald-200 bg-emerald-50/60'
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900">{p.cnpj || p.sourceName || 'Sócio / lucro'}</p>
                          <p className="text-[11px] text-slate-600">{p.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-600">Anual: {cxFormatBRL(p.annual)}</p>
                          <p className="text-sm font-extrabold text-slate-900">
                            {cxFormatBRL(p.monthly)} <span className="text-[10px] font-semibold text-slate-500">/mês</span>
                          </p>
                        </div>
                      </div>
                      {p.belowLimit && (
                        <p className="mt-2 flex items-start gap-1.5 text-[11px] font-semibold text-red-700">
                          <AlertTriangle className="w-3.5 h-3.5 mt-[1px] flex-shrink-0" />
                          Valor anual abaixo de {cxFormatBRL(CX_IRPF_EXEMPT_LIMIT)} — o lucro não deveria estar isento no
                          IRPF. Verificar a apuração da empresa e pedir o balanço/contabilidade antes de usar essa renda.
                        </p>
                      )}
                    </div>
                  ))}
                  <p className="text-[11px] text-slate-600">
                    Total de lucros/dividendos: <strong>{cxFormatBRL(s.totalProfitAnnual)}</strong> ao ano ·{' '}
                    <strong>{cxFormatBRL(s.totalProfitMonthly)}</strong> por mês (÷ 12).
                  </p>
                </div>
              )}
            </section>

            {/* 3 - Bens e direitos */}
            <section className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">3. Bens e direitos</p>
              {s.mcmvWarning ? (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4" />
                    Atenção MCMV — verificar restrições
                  </p>
                  {s.companyAssets.length > 0 && (
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
                        <Building2 className="w-3.5 h-3.5" /> Empresa declarada ({s.companyAssets.length})
                      </p>
                      {s.companyAssets.map((a, i) => (
                        <p key={i} className="text-[11px] text-slate-700 pl-5">
                          {a.description}
                          {a.value ? ` — ${cxFormatBRL(a.value)}` : ''}
                        </p>
                      ))}
                    </div>
                  )}
                  {s.realEstateAssets.length > 0 && (
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
                        <Home className="w-3.5 h-3.5" /> Imóvel em nome do declarante ({s.realEstateAssets.length})
                      </p>
                      {s.realEstateAssets.map((a, i) => (
                        <p key={i} className="text-[11px] text-slate-700 pl-5">
                          {a.description}
                          {a.value ? ` — ${cxFormatBRL(a.value)}` : ''}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-amber-800">
                    Confirmar se o cliente pode usar o Minha Casa Minha Vida: imóvel residencial em nome do proponente
                    e/ou participação em empresa podem impedir o enquadramento.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Nenhuma empresa ou imóvel identificado nos bens e direitos declarados.
                </p>
              )}
            </section>
          </div>
        );
      })}
    </div>
  );
}
