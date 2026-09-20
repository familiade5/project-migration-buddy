import { useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CxDeal, CxDealStage, CxStage, CX_STAGE_PALETTE } from '@/types/cxCrm';
import { CxDealColumn } from './CxDealColumn';
import { CxDealCard } from './CxDealCard';
import { Plus, X } from 'lucide-react';

interface Props {
  deals: CxDeal[];
  stages: CxStage[];
  clientName: (id: string) => string;
  onMove: (id: string, from: CxDealStage, to: CxDealStage) => void;
  onCardClick: (deal: CxDeal) => void;
  onCreateStage: (input: { label: string; color: string; bg: string; border: string }) => void;
  onDeleteStage: (stage: CxStage) => void;
  onReorderStage: (id: string, direction: -1 | 1) => void;
}

export function CxDealKanban({
  deals,
  stages,
  clientName,
  onMove,
  onCardClick,
  onCreateStage,
  onDeleteStage,
  onReorderStage,
}: Props) {
  const [active, setActive] = useState<CxDeal | null>(null);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [paletteIndex, setPaletteIndex] = useState(0);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const byStage = useMemo(() => {
    const grouped: Record<string, CxDeal[]> = {};
    stages.forEach((s) => {
      grouped[s.key] = [];
    });
    const fallback = stages[0]?.key;
    deals.forEach((d) => {
      if (grouped[d.stage]) grouped[d.stage].push(d);
      else if (fallback) grouped[fallback].push(d);
    });
    return grouped;
  }, [deals, stages]);

  const handleStart = (e: DragStartEvent) => {
    setActive(deals.find((d) => d.id === e.active.id) ?? null);
  };

  const handleEnd = (e: DragEndEvent) => {
    setActive(null);
    if (!e.over) return;
    const deal = deals.find((d) => d.id === e.active.id);
    if (!deal) return;
    const to = String(e.over.id);
    if (deal.stage !== to) onMove(deal.id, deal.stage, to);
  };

  const submitStage = () => {
    if (!newLabel.trim()) return;
    const p = CX_STAGE_PALETTE[paletteIndex];
    onCreateStage({ label: newLabel.trim(), color: p.color, bg: p.bg, border: p.border });
    setNewLabel('');
    setPaletteIndex(0);
    setAdding(false);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleStart} onDragEnd={handleEnd}>
      <div className="flex gap-3 pb-4 overflow-x-auto">
        {stages.map((stage, i) => (
          <CxDealColumn
            key={stage.key}
            stage={stage}
            stages={stages}
            deals={byStage[stage.key] || []}
            clientName={clientName}
            onCardClick={onCardClick}
            onMoveTo={(deal, to) => onMove(deal.id, deal.stage, to)}
            onDeleteStage={onDeleteStage}
            onReorderStage={onReorderStage}
            isFirst={i === 0}
            isLast={i === stages.length - 1}
          />
        ))}

        <div className="flex-shrink-0 w-[240px]">
          {adding ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-3 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Nova etapa</p>
                <button onClick={() => setAdding(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                autoFocus
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitStage()}
                placeholder="Nome da etapa"
                className="w-full text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a3a6b]/30"
              />
              <div className="flex flex-wrap gap-1.5">
                {CX_STAGE_PALETTE.map((p, i) => (
                  <button
                    key={p.color}
                    onClick={() => setPaletteIndex(i)}
                    title={p.label}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      paletteIndex === i ? 'scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: p.color, borderColor: paletteIndex === i ? '#0f172a' : 'transparent' }}
                  />
                ))}
              </div>
              <button
                onClick={submitStage}
                disabled={!newLabel.trim()}
                className="w-full text-xs font-semibold text-white rounded-lg py-2 disabled:opacity-40"
                style={{ backgroundColor: '#1a3a6b' }}
              >
                Criar etapa
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="w-full h-[68px] rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-[#1a3a6b]/40 hover:text-[#1a3a6b] transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
            >
              <Plus className="w-4 h-4" /> Nova etapa
            </button>
          )}
        </div>
      </div>
      <DragOverlay>
        {active ? (
          <div className="rotate-2 scale-105 w-[256px]">
            <CxDealCard deal={active} clientName={clientName(active.client_id)} onClick={() => {}} dragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
