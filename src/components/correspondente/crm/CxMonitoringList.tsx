import { useMemo } from 'react';
import { CxDeal, CX_REJECTION_CONFIG, CX_STAGE_CONFIG, cxCurrency, cxDaysUntil } from '@/types/cxCrm';
import { AlertTriangle, CalendarClock, CheckCircle2 } from 'lucide-react';

const BRAND = '#1a3a6b';

interface Props {
  deals: CxDeal[];
  clientName: (id: string) => string;
  onOpen: (deal: CxDeal) => void;
}

export function CxMonitoringList({ deals, clientName, onOpen }: Props) {
  const watched = useMemo(
    () =>
      deals
        .filter((d) => d.stage === 'reprovado' || d.stage === 'condicionado' || d.next_review_at)
        .sort((a, b) => (a.next_review_at || '9999').localeCompare(b.next_review_at || '9999')),
    [deals],
  );

  const late = watched.filter((d) => (cxDaysUntil(d.next_review_at) ?? 99) < 0);
  const today = watched.filter((d) => cxDaysUntil(d.next_review_at) === 0);
  const noDate = watched.filter((d) => !d.next_review_at);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Atrasados" value={late.length} icon={AlertTriangle} tone="text-red-600 bg-red-50" />
        <Stat label="Para hoje" value={today.length} icon={CalendarClock} tone="text-amber-600 bg-amber-50" />
        <Stat label="Sem data definida" value={noDate.length} icon={CheckCircle2} tone="text-slate-600 bg-slate-100" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-bold" style={{ color: BRAND }}>Monitoramento de rating e margem</h3>
          <p className="text-xs text-slate-500">Clientes reprovados ou condicionados aguardando nova liberação.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {watched.map((d) => {
            const days = cxDaysUntil(d.next_review_at);
            const cfg = CX_STAGE_CONFIG[d.stage];
            return (
              <button
                key={d.id}
                onClick={() => onOpen(d)}
                className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex flex-wrap items-center gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{clientName(d.client_id)}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {d.title || 'Caso de financiamento'} · {cxCurrency(d.financing_value)}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  {cfg.short}
                </span>
                {d.rejection_reason && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                    {CX_REJECTION_CONFIG[d.rejection_reason].short}
                  </span>
                )}
                <span className="text-xs text-slate-500 w-32 text-right">Rating: {d.rating || '—'}</span>
                <span
                  className={`text-xs font-semibold w-40 text-right ${
                    days === null ? 'text-slate-400' : days < 0 ? 'text-red-600' : days <= 3 ? 'text-amber-600' : 'text-slate-500'
                  }`}
                >
                  {days === null
                    ? 'Sem data'
                    : days < 0
                    ? `Atrasado ${Math.abs(days)}d`
                    : days === 0
                    ? 'Reavaliar hoje'
                    : `Em ${days} dia(s)`}
                </span>
              </button>
            );
          })}
          {watched.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-slate-400">Nenhum caso em monitoramento.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone }: { label: string; value: number; icon: any; tone: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${tone}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}
