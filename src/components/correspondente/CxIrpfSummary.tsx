import { AlertTriangle, Building2, Home, ShieldCheck, ShieldAlert } from 'lucide-react';
import { CxDocument } from '@/types/correspondente';
import { cxFormatBRL } from '@/lib/cxIncome';
import { cxGetIrpfAnalysis, cxSummarizeIrpf, CX_IRPF_EXEMPT_LIMIT } from '@/lib/cxIrpf';
import { CopyText } from '@/components/correspondente/CopyText';


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
                            <CopyText
                              value={cxFormatBRL(r.taxableIncome)}
                              label="Rendimento anual"
                              className="justify-end"
                            />
                          </td>
                          <td className="px-3 py-2 text-right text-slate-600">
                            <CopyText
                              value={cxFormatBRL((r.taxableIncome || 0) / 12)}
                              label="Média mensal"
                              className="justify-end"
                            />
                          </td>
                          <td className="px-3 py-2 text-right text-slate-600">
                            {r.thirteenthSalary ? (
                              <CopyText
                                value={cxFormatBRL(r.thirteenthSalary)}
                                label="13º salário"
                                className="justify-end"
                              />
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {r.inssWithheld ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Recolhido
                                {r.inssAmount ? (
                                  <>
                                    {' · '}
                                    <CopyText
                                      value={cxFormatBRL(r.inssAmount)}
                                      label="INSS"
                                      className="text-emerald-700"
                                    />
                                  </>
                                ) : null}
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
                    <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <CopyText
                              value={p.cnpj || p.sourceName || 'Sócio / lucro'}
                              label="CNPJ"
                              className="text-xs font-bold text-slate-900"
                            />
                            {p.cnpj && p.sourceName && (
                              <CopyText value={p.sourceName} label="Empresa" className="text-[11px] text-slate-600" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600">{p.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-600">Anual: {cxFormatBRL(p.annual)}</p>
                          <p className="text-sm font-extrabold text-slate-900">
                            {cxFormatBRL(p.monthly)} <span className="text-[10px] font-semibold text-slate-500">/mês</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-slate-600">
                    Total de lucros/dividendos: <strong>{cxFormatBRL(s.totalProfitAnnual)}</strong> ao ano ·{' '}
                    <strong>{cxFormatBRL(s.totalProfitMonthly)}</strong> por mês (÷ 12).
                  </p>
                  <div
                    className={`rounded-xl border p-3 text-[11px] ${
                      s.belowLimit ? 'border-red-300 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50/60 text-emerald-800'
                    }`}
                  >
                    <p className="font-semibold text-slate-800">
                      Soma de todos os rendimentos do ano: <strong>{cxFormatBRL(s.totalAnnualIncome)}</strong>{' '}
                      <span className="font-normal text-slate-500">
                        (tributáveis {cxFormatBRL(s.totalPj)}
                        {s.total13 > 0 ? ` + 13º ${cxFormatBRL(s.total13)}` : ''} + lucros{' '}
                        {cxFormatBRL(s.totalProfitAnnual)}
                        {s.otherExemptTotal > 0 ? ` + outros isentos ${cxFormatBRL(s.otherExemptTotal)}` : ''})
                      </span>
                    </p>
                    {s.belowLimit ? (
                      <p className="mt-1.5 flex items-start gap-1.5 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 mt-[1px] flex-shrink-0" />
                        Total abaixo de {cxFormatBRL(CX_IRPF_EXEMPT_LIMIT)} — o lucro pode não estar corretamente isento
                        no IRPF. Pedir o balanço/contabilidade da empresa antes de usar essa renda.
                      </p>
                    ) : (
                      <p className="mt-1.5 font-semibold">
                        Total acima de {cxFormatBRL(CX_IRPF_EXEMPT_LIMIT)} — isenção do lucro distribuído consistente.
                      </p>
                    )}
                  </div>
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
