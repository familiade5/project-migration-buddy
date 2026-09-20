import { useDraggable } from '@dnd-kit/core';
import { CxDeal, CX_REJECTION_CONFIG, cxCurrency, cxDaysUntil } from '@/types/cxCrm';
import { Building2, CalendarClock, Landmark, UserRound } from 'lucide-react';

interface Props {
  deal: CxDeal;
  clientName: string;
  onClick: () => void;
  dragging?: boolean;
}

export function CxDealCard({ deal, clientName, onClick, dragging }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: deal.id });

  const days = cxDaysUntil(deal.next_review_at);
  const reviewTone =
    days === null
      ? null
      : days < 0
      ? 'bg-red-50 text-red-600'
      : days <= 3
      ? 'bg-amber-50 text-amber-600'
      : 'bg-slate-50 text-slate-500';

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
      className={`bg-white rounded-xl border border-slate-200 p-3 shadow-sm cursor-pointer hover:border-[#1a3a6b]/40 hover:shadow transition-all ${
        isDragging && !dragging ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-[#1a3a6b]/10 text-[#1a3a6b] flex items-center justify-center flex-shrink-0">
          <UserRound className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 truncate">{clientName}</p>
          {deal.title && <p className="text-[11px] text-slate-500 truncate">{deal.title}</p>}
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {deal.financing_value != null && (
          <p className="text-sm font-bold text-slate-900">{cxCurrency(deal.financing_value)}</p>
        )}
        <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
          {deal.bank && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
              <Landmark className="w-3 h-3" /> {deal.bank}
            </span>
          )}
          {deal.property_id && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
              <Building2 className="w-3 h-3" /> Imóvel
            </span>
          )}
          {deal.stage === 'reprovado' && deal.rejection_reason && (
            <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 uppercase tracking-wide">
              {CX_REJECTION_CONFIG[deal.rejection_reason].short}
            </span>
          )}
        </div>
        {reviewTone && (
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${reviewTone}`}>
            <CalendarClock className="w-3 h-3" />
            {days! < 0 ? `Reavaliar (atrasado ${Math.abs(days!)}d)` : days === 0 ? 'Reavaliar hoje' : `Reavaliar em ${days}d`}
          </span>
        )}
      </div>
    </div>
  );
}
