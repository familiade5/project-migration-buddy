import { CrmLead, CLASSIFICACAO_CONFIG, SDR_STAGE_CONFIG, SALES_STAGE_CONFIG } from '@/types/leads';
import { Phone, MapPin, Clock, Flame, Thermometer, Snowflake } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDraggable } from '@dnd-kit/core';

interface LeadCardProps {
  lead: CrmLead;
  onClick: (lead: CrmLead) => void;
  pipeline: 'sdr' | 'sales';
}

const ClassIcon = ({ c }: { c: CrmLead['classificacao'] }) => {
  if (c === 'quente') return <Flame className="w-3.5 h-3.5" style={{ color: CLASSIFICACAO_CONFIG.quente.color }} />;
  if (c === 'morno') return <Thermometer className="w-3.5 h-3.5" style={{ color: CLASSIFICACAO_CONFIG.morno.color }} />;
  return <Snowflake className="w-3.5 h-3.5" style={{ color: CLASSIFICACAO_CONFIG.frio.color }} />;
};

export function LeadCard({ lead, onClick, pipeline }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });

  const stageConfig = pipeline === 'sdr'
    ? SDR_STAGE_CONFIG[lead.sdr_stage]
    : lead.sales_stage ? SALES_STAGE_CONFIG[lead.sales_stage] : null;

  const daysSinceInteraction = lead.ultima_interacao_at
    ? Math.floor((Date.now() - new Date(lead.ultima_interacao_at).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const isStale = daysSinceInteraction !== null && daysSinceInteraction >= 3;

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : undefined,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderLeftColor: stageConfig?.color }}
      {...attributes}
      {...listeners}
      onClick={() => onClick(lead)}
      className={`bg-white rounded-xl border border-gray-100 border-l-4 p-3 cursor-pointer hover:shadow-md transition-all select-none ${isStale ? 'ring-1 ring-amber-300' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <ClassIcon c={lead.classificacao} />
          <span className="font-semibold text-gray-900 text-sm truncate">{lead.nome}</span>
        </div>
        {isStale && (
          <span className="shrink-0 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full font-medium">
            ⚠️ {daysSinceInteraction}d
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Phone className="w-3 h-3 shrink-0" />
          <span>{lead.telefone}</span>
        </div>
        {lead.cidade && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{lead.cidade}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-50">
        {lead.origem_lead && (
          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
            {lead.origem_lead}
          </span>
        )}
        <div className="flex items-center gap-1 text-[10px] text-gray-400 ml-auto">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(lead.data_entrada), { addSuffix: true, locale: ptBR })}
        </div>
      </div>

      {/* SDR: Responsible */}
      {lead.sdr_responsavel_nome && (
        <div className="mt-1.5 flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-600">
            {lead.sdr_responsavel_nome.charAt(0)}
          </div>
          <span className="text-[10px] text-gray-500">{lead.sdr_responsavel_nome}</span>
        </div>
      )}
    </div>
  );
}
