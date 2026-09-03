import { CxBankAnalysis, CxBankCredit } from '@/types/correspondente';
import { cxFormatBRL, cxSummarizeCredits } from '@/lib/cxIncome';
import { Button } from '@/components/ui/button';
import { Check, X, TrendingUp } from 'lucide-react';

interface Props {
  analysis: CxBankAnalysis;
  onToggle?: (index: number, included: boolean) => void;
  disabled?: boolean;
}

export function CxBankCreditsTable({ analysis, onToggle, disabled }: Props) {
  const summary = cxSummarizeCredits(analysis.credits);

  return (
    <div className="space-y-4">
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

      {summary.months.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-3">
          {summary.months.map((m) => (
            <div key={m.key} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-500">{m.key}</p>
              <p className="text-sm font-bold text-slate-900">{cxFormatBRL(m.total)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-semibold">Data</th>
              <th className="px-3 py-2 font-semibold">Descrição</th>
              <th className="px-3 py-2 font-semibold">Origem</th>
              <th className="px-3 py-2 font-semibold text-right">Valor</th>
              <th className="px-3 py-2 font-semibold">Situação</th>
            </tr>
          </thead>
          <tbody>
            {analysis.credits.map((c: CxBankCredit, i: number) => (
              <tr
                key={`${c.date}-${c.description}-${i}`}
                className={`border-t border-slate-100 ${c.included ? 'bg-white' : 'bg-slate-50/70 text-slate-400'}`}
              >
                <td className="px-3 py-2 whitespace-nowrap">{c.date}</td>
                <td className="px-3 py-2 max-w-[220px] truncate" title={c.description}>
                  {c.description}
                </td>
                <td className="px-3 py-2 max-w-[160px] truncate" title={c.counterparty || ''}>
                  {c.counterparty || '—'}
                </td>
                <td className={`px-3 py-2 text-right font-semibold ${c.included ? 'text-emerald-700' : 'line-through'}`}>
                  {cxFormatBRL(c.amount)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.included ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {c.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {c.included ? 'Conta como renda' : c.reason || 'Descartado'}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
