import { CxDocument } from '@/types/correspondente';
import { cxConsolidateBankStatements, cxCoverageWarning, cxFormatBRL } from '@/lib/cxIncome';

export function CxBankIncomeSummary({ documents }: { documents: CxDocument[] }) {
  const income = cxConsolidateBankStatements(documents);
  const incomeWarning = cxCoverageWarning(income);

  if (income.bankDocs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-3">
      <h3 className="text-sm font-bold text-emerald-900">
        Renda por extrato bancário — {income.bankDocs.length} extrato(s)
      </h3>
      <p className="text-3xl font-extrabold text-emerald-900">{cxFormatBRL(income.monthlyAverage)}</p>
      <p className="text-xs text-emerald-700">
        Média mensal consolidada em {income.months.length} mês(es), já descontando PIX/transferências do
        próprio titular, estornos e resgates ({income.excludedCount} lançamento(s) descartado(s)).
      </p>
      {incomeWarning && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3">
          <p className="text-xs font-bold text-red-700">⚠️ Extrato com mês incompleto</p>
          <p className="text-xs text-red-700 mt-1">{incomeWarning}</p>
          <p className="text-xs text-red-800 font-semibold mt-1">
            Média proporcional (por dias cobertos): {cxFormatBRL(income.proRataAverage)}
          </p>
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-3">
        {income.months.map((m) => (
          <div key={m.key} className="rounded-xl border border-emerald-200 bg-white px-3 py-2">
            <p className="text-[11px] font-semibold text-slate-500">{m.key}</p>
            <p className="text-sm font-bold text-slate-900">{cxFormatBRL(m.total)}</p>
            <p className={`text-[10px] mt-0.5 ${m.complete ? 'text-slate-500' : 'text-red-600 font-semibold'}`}>
              {m.complete ? 'Mês completo' : `Parcial: dias ${m.firstDay}–${m.lastDay} de ${m.totalDays}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
