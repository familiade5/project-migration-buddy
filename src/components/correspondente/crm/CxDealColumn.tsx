import { useDroppable } from '@dnd-kit/core';
import { CxDeal, CxStage, cxCurrency } from '@/types/cxCrm';
import { CxDealCard } from './CxDealCard';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface Props {
  stage: CxStage;
  stages: CxStage[];
  deals: CxDeal[];
  clientName: (id: string) => string;
  onCardClick: (deal: CxDeal) => void;
  onMoveTo: (deal: CxDeal, to: string) => void;
  onDeleteStage?: (stage: CxStage) => void;
  onReorderStage?: (id: string, direction: -1 | 1) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function CxDealColumn({
  stage,
  stages,
  deals,
  clientName,
  onCardClick,
  onMoveTo,
  onDeleteStage,
  onReorderStage,
  isFirst,
  isLast,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });
  const total = deals.reduce((sum, d) => sum + (d.financing_value || 0), 0);

  return (
    <div className="flex-shrink-0 w-[272px] flex flex-col">
      <div
        className="rounded-t-2xl px-3 py-2.5 border border-b-0 group"
        style={{ backgroundColor: stage.bg, borderColor: stage.border }}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wide truncate" style={{ color: stage.color }}>
            {stage.label}
          </p>
          <div className="flex items-center gap-1">
            {onReorderStage && (
              <>
                <button
                  disabled={isFirst}
                  onClick={() => onReorderStage(stage.id, -1)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700 disabled:opacity-0"
                  title="Mover etapa para a esquerda"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={isLast}
                  onClick={() => onReorderStage(stage.id, 1)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700 disabled:opacity-0"
                  title="Mover etapa para a direita"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            {onDeleteStage && !stage.is_system && (
              <button
                onClick={() => onDeleteStage(stage)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600"
                title="Excluir etapa"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <span
              className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-white/80"
              style={{ color: stage.color }}
            >
              {deals.length}
            </span>
          </div>
        </div>
        <p className="text-[11px] mt-0.5 text-slate-500">{total > 0 ? cxCurrency(total) : '—'}</p>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[380px] rounded-b-2xl border p-2 space-y-2 overflow-y-auto transition-colors ${
          isOver ? 'bg-blue-50/60' : 'bg-slate-50/70'
        }`}
        style={{ borderColor: stage.border }}
      >
        {deals.map((deal) => (
          <CxDealCard
            key={deal.id}
            deal={deal}
            clientName={clientName(deal.client_id)}
            onClick={() => onCardClick(deal)}
            stages={stages}
            onMoveTo={(to) => onMoveTo(deal, to)}
          />
        ))}
        {deals.length === 0 && (
          <p className="text-[11px] text-slate-400 text-center py-8">Arraste casos para cá</p>
        )}
      </div>
    </div>
  );
}
