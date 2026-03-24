import { useDroppable } from '@dnd-kit/core';
import { CrmLead } from '@/types/leads';
import { LeadCard } from './LeadCard';

interface LeadColumnProps {
  stageKey: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  leads: CrmLead[];
  onCardClick: (lead: CrmLead) => void;
  pipeline: 'sdr' | 'sales';
}

export function LeadColumn({ stageKey, label, color, bgColor, borderColor, leads, onCardClick, pipeline }: LeadColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stageKey });

  return (
    <div className="flex-shrink-0 w-64">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 rounded-t-xl border-t-4 mb-1"
        style={{ borderTopColor: color, backgroundColor: bgColor, borderLeft: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
      >
        <span className="text-xs font-bold" style={{ color }}>{label}</span>
        <span
          className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`min-h-[400px] rounded-b-xl border p-2 space-y-2 transition-colors ${isOver ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
      >
        {leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} onClick={onCardClick} pipeline={pipeline} />
        ))}
        {leads.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-gray-400">
            Nenhum lead
          </div>
        )}
      </div>
    </div>
  );
}
