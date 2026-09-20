import { useDroppable } from '@dnd-kit/core';
import { CxDeal, CxDealStage, CX_STAGE_CONFIG, cxCurrency } from '@/types/cxCrm';
import { CxDealCard } from './CxDealCard';

interface Props {
  stage: CxDealStage;
  deals: CxDeal[];
  clientName: (id: string) => string;
  onCardClick: (deal: CxDeal) => void;
}

export function CxDealColumn({ stage, deals, clientName, onCardClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const cfg = CX_STAGE_CONFIG[stage];
  const total = deals.reduce((sum, d) => sum + (d.financing_value || 0), 0);

  return (
    <div className="flex-shrink-0 w-[272px] flex flex-col">
      <div
        className="rounded-t-2xl px-3 py-2.5 border border-b-0"
        style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wide truncate" style={{ color: cfg.color }}>
            {cfg.label}
          </p>
          <span
            className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-white/80"
            style={{ color: cfg.color }}
          >
            {deals.length}
          </span>
        </div>
        <p className="text-[11px] mt-0.5 text-slate-500">{total > 0 ? cxCurrency(total) : '—'}</p>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[380px] rounded-b-2xl border p-2 space-y-2 overflow-y-auto transition-colors ${
          isOver ? 'bg-blue-50/60' : 'bg-slate-50/70'
        }`}
        style={{ borderColor: cfg.border }}
      >
        {deals.map((deal) => (
          <CxDealCard key={deal.id} deal={deal} clientName={clientName(deal.client_id)} onClick={() => onCardClick(deal)} />
        ))}
        {deals.length === 0 && (
          <p className="text-[11px] text-slate-400 text-center py-8">Arraste casos para cá</p>
        )}
      </div>
    </div>
  );
}
