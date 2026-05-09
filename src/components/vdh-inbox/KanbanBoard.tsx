import { useMemo, useState } from "react";
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors,
  useDraggable, useDroppable,
} from "@dnd-kit/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { KanbanColumn } from "./KanbanColumnsManager";

type ConvCard = {
  id: string;
  ig_full_name: string | null;
  ig_username: string | null;
  ig_profile_pic: string | null;
  last_message_text: string | null;
  last_message_at: string | null;
  unread_count: number;
  kanban_column_id: string | null;
};

function Card({ conv, onClick }: { conv: ConvCard; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: conv.id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="bg-white rounded-lg border p-2.5 mb-2 shadow-sm cursor-grab active:cursor-grabbing hover:border-gray-400 transition"
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <div className="flex gap-2 items-start">
        <Avatar className="w-8 h-8 flex-shrink-0">
          {conv.ig_profile_pic && <AvatarImage src={conv.ig_profile_pic} />}
          <AvatarFallback style={{ backgroundColor: "#006633", color: "white", fontSize: 10 }}>
            {(conv.ig_full_name ?? conv.ig_username ?? "?").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <p className="text-xs font-semibold truncate text-gray-900">
              {conv.ig_full_name ?? conv.ig_username ?? "Usuário"}
            </p>
            {conv.unread_count > 0 && (
              <Badge style={{ backgroundColor: "#006633" }} className="h-4 min-w-4 px-1 text-[9px]">
                {conv.unread_count}
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-gray-500 truncate mt-0.5">
            {conv.last_message_text ?? "—"}
          </p>
          {conv.last_message_at && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              {formatDistanceToNow(new Date(conv.last_message_at), { locale: ptBR, addSuffix: true })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Column({ col, convs, onCardClick }: {
  col: KanbanColumn; convs: ConvCard[]; onCardClick: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      <div
        className="flex items-center justify-between px-3 py-2 rounded-t-lg"
        style={{ backgroundColor: col.color, color: "white" }}
      >
        <h3 className="font-semibold text-sm">{col.name}</h3>
        <Badge variant="secondary" className="bg-white/20 text-white border-0 text-[10px] h-5">
          {convs.length}
        </Badge>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 bg-gray-50 rounded-b-lg p-2 overflow-y-auto min-h-[200px] transition-colors"
        style={{ backgroundColor: isOver ? "#ecfdf5" : undefined }}
      >
        {convs.length === 0 && (
          <p className="text-center text-[11px] text-gray-400 py-6">Vazio</p>
        )}
        {convs.map((c) => <Card key={c.id} conv={c} onClick={() => onCardClick(c.id)} />)}
      </div>
    </div>
  );
}

export function KanbanBoard({
  columns, conversations, onMove, onCardClick, onManageColumns,
}: {
  columns: KanbanColumn[];
  conversations: ConvCard[];
  onMove: (convId: string, columnId: string) => void;
  onCardClick: (convId: string) => void;
  onManageColumns: () => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const grouped = useMemo(() => {
    const map = new Map<string, ConvCard[]>();
    columns.forEach((c) => map.set(c.id, []));
    conversations.forEach((conv) => {
      const colId = conv.kanban_column_id;
      if (colId && map.has(colId)) map.get(colId)!.push(conv);
    });
    return map;
  }, [columns, conversations]);

  const activeCard = activeId ? conversations.find((c) => c.id === activeId) ?? null : null;

  const handleStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const handleEnd = (e: DragEndEvent) => {
    setActiveId(null);
    if (!e.over) return;
    const convId = String(e.active.id);
    const colId = String(e.over.id);
    const conv = conversations.find((c) => c.id === convId);
    if (conv && conv.kanban_column_id !== colId) onMove(convId, colId);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white flex-shrink-0">
        <p className="text-xs text-gray-500">Arraste os cards entre as colunas para mover os leads.</p>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onManageColumns}>
          <Settings2 className="w-3 h-3 mr-1" />
          Gerenciar colunas
        </Button>
      </div>
      <DndContext sensors={sensors} onDragStart={handleStart} onDragEnd={handleEnd}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 bg-gray-100">
          <div className="flex gap-3 h-full">
            {columns.map((col) => (
              <Column key={col.id} col={col} convs={grouped.get(col.id) ?? []} onCardClick={onCardClick} />
            ))}
          </div>
        </div>
        <DragOverlay>
          {activeCard && (
            <div className="bg-white rounded-lg border-2 border-emerald-500 p-2.5 shadow-lg w-72">
              <p className="text-xs font-semibold truncate">
                {activeCard.ig_full_name ?? activeCard.ig_username ?? "Usuário"}
              </p>
              <p className="text-[11px] text-gray-500 truncate">{activeCard.last_message_text ?? "—"}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}