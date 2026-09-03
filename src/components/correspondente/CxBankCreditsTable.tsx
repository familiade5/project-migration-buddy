import { CxBankAnalysis, CxBankCredit } from '@/types/correspondente';
import { cxCoverageWarning, cxFormatBRL, cxIsGambling, cxSummarizeAnalysis } from '@/lib/cxIncome';
import { Button } from '@/components/ui/button';
import { Check, X, TrendingUp, AlertTriangle, Ban } from 'lucide-react';

interface Props {
  analysis: CxBankAnalysis;
  onToggle?: (index: number, included: boolean) => void;
  disabled?: boolean;
}

export function CxBankCreditsTable({ analysis, onToggle, disabled }: Props) {
  const summary = cxSummarizeAnalysis(analysis);
  const warning = cxCoverageWarning(summary);
  const gamblingCredits = analysis.credits.filter((c) => cxIsGambling(c));
  const gamblingTotal = gamblingCredits.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="space-y-4 text-slate-800">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 text-emerald-800">
          <TrendingUp className="w-4 h-4" />
          <p className="text-xs font-bold uppercase tracking-wide">Renda média mensal deste extrato</p>
        </div>
        <p className="text-2xl font-extrabold text-emerald-900 mt-1">{cxFormatBRL(summary.monthlyAverage)}</p>
        <p className="text-[11px] text-emerald-700 mt-1">
          {summary.months.length} mês(es) considerado(s) · {cxFormatBRL(summary.includedTotal)} em entradas válidas ·{' '}
          {summary.excludedCount} lançamento(s) descartado(s) ({cxFormatBRL(summary.excludedTotal)})
        </p>
      </div>

      {warning && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Extrato com mês incompleto</p>
            <p className="text-xs text-red-700 mt-1">{warning}</p>
            <p className="text-xs text-red-800 font-semibold mt-2">
              Média proporcional (por dias cobertos): {cxFormatBRL(summary.proRataAverage)}
            </p>
          </div>
        </div>
      )}

      {gamblingCredits.length > 0 && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 flex gap-3">
          <Ban className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-red-700 uppercase tracking-wide">
              Depósitos de casas de apostas / jogos detectados
            </p>
            <p className="text-xs text-red-700 mt-1">
              {gamblingCredits.length} lançamento(s) somando {cxFormatBRL(gamblingTotal)} vindos de bets, cassinos ou jogos.
              Bancos não aceitam esses valores como renda, então eles foram retirados do cálculo e estão marcados em
              vermelho na tabela. O analista pode contabilizá-los manualmente se julgar necessário.
            </p>
          </div>
        </div>
      )}



      {summary.months.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-3">
          {summary.months.map((m) => (
            <div key={m.key} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-600">{m.key}</p>
              <p className="text-sm font-bold text-slate-900">{cxFormatBRL(m.total)}</p>
              <p className={`text-[10px] mt-0.5 ${m.complete ? 'text-slate-500' : 'text-red-600 font-semibold'}`}>
                {m.complete
                  ? 'Mês completo'
                  : `Parcial: dias ${m.firstDay}–${m.lastDay} de ${m.totalDays}`}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2 font-semibold">Data</th>
              <th className="px-3 py-2 font-semibold">Descrição</th>
              <th className="px-3 py-2 font-semibold">Origem</th>
              <th className="px-3 py-2 font-semibold text-right">Valor</th>
              <th className="px-3 py-2 font-semibold">Situação</th>
            </tr>
          </thead>
          <tbody>
            {analysis.credits.map((c: CxBankCredit, i: number) => {
              const gambling = cxIsGambling(c);
              return (
              <tr
                key={`${c.date}-${c.description}-${i}`}
                className={`border-t border-slate-100 ${
                  gambling
                    ? 'bg-red-50 text-red-700 font-semibold'
                    : c.included
                      ? 'bg-white text-slate-800'
                      : 'bg-slate-100 text-slate-600'
                }`}
              >
                <td className="px-3 py-2 whitespace-nowrap">{c.date}</td>
                <td className="px-3 py-2 max-w-[220px] truncate" title={c.description}>
                  {c.description}
                </td>
                <td className="px-3 py-2 max-w-[160px] truncate" title={c.counterparty || ''}>
                  {c.counterparty || '—'}
                </td>
                <td
                  className={`px-3 py-2 text-right font-semibold ${
                    gambling ? 'text-red-700 line-through' : c.included ? 'text-emerald-700' : 'line-through'
                  }`}
                >
                  {cxFormatBRL(c.amount)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        gambling
                          ? 'bg-red-100 text-red-700'
                          : c.included
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {gambling ? <Ban className="w-3 h-3" /> : c.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {gambling
                        ? c.included
                          ? 'Apostas/jogos — mantido pelo analista'
                          : 'Apostas/jogos — não conta como renda'
                        : c.included
                          ? 'Conta como renda'
                          : c.reason || 'Descartado'}
                    </span>
                    {onToggle && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={disabled}
                        className="h-6 px-2 text-[10px] text-slate-500 hover:text-[#1a3a6b] hover:bg-blue-50"
                        onClick={() => onToggle(i, !c.included)}
                      >
                        {c.included ? 'Descartar' : 'Contar'}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
