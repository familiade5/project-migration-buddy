import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, ChevronUp, ChevronDown, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type KanbanColumn = {
  id: string;
  name: string;
  color: string;
  position: number;
  is_default_for_new: boolean;
};

const COLOR_PRESETS = ["#6b7280", "#3b82f6", "#f97316", "#8b5cf6", "#22c55e", "#ef4444", "#eab308", "#ec4899", "#06b6d4"];

export function KanbanColumnsManager({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { toast } = useToast();
  const [cols, setCols] = useState<KanbanColumn[]>([]);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLOR_PRESETS[0]);

  const load = async () => {
    const { data } = await supabase
      .from("vdh_kanban_columns")
      .select("*")
      .order("position");
    setCols((data ?? []) as KanbanColumn[]);
  };

  useEffect(() => { if (open) load(); }, [open]);

  const add = async () => {
    if (!newName.trim()) return;
    const maxPos = Math.max(0, ...cols.map((c) => c.position));
    const { error } = await supabase.from("vdh_kanban_columns").insert({
      name: newName.trim(), color: newColor, position: maxPos + 1,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setNewName("");
    load();
  };

  const update = async (id: string, patch: Partial<KanbanColumn>) => {
    await supabase.from("vdh_kanban_columns").update(patch).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir esta coluna? Os leads serão movidos para a coluna padrão.")) return;
    const { data: def } = await supabase
      .from("vdh_kanban_columns")
      .select("id")
      .eq("is_default_for_new", true)
      .maybeSingle();
    if (def?.id && def.id !== id) {
      await supabase.from("vdh_conversations").update({ kanban_column_id: def.id }).eq("kanban_column_id", id);
    }
    await supabase.from("vdh_kanban_columns").delete().eq("id", id);
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = cols.findIndex((c) => c.id === id);
    const swap = cols[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("vdh_kanban_columns").update({ position: swap.position }).eq("id", id),
      supabase.from("vdh_kanban_columns").update({ position: cols[idx].position }).eq("id", swap.id),
    ]);
    load();
  };

  const setDefault = async (id: string) => {
    // Limpa todos e seta o novo
    await supabase.from("vdh_kanban_columns").update({ is_default_for_new: false }).neq("id", id);
    await supabase.from("vdh_kanban_columns").update({ is_default_for_new: true }).eq("id", id);
    load();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader><DialogTitle>Colunas do Kanban</DialogTitle></DialogHeader>

        <div className="space-y-2 flex-1 overflow-y-auto">
          {cols.map((c, i) => (
            <div key={c.id} className="flex items-center gap-2 border rounded-lg p-2">
              <div className="flex flex-col">
                <button disabled={i === 0} onClick={() => move(c.id, -1)} className="text-gray-400 disabled:opacity-30 hover:text-gray-700">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button disabled={i === cols.length - 1} onClick={() => move(c.id, 1)} className="text-gray-400 disabled:opacity-30 hover:text-gray-700">
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <input
                type="color"
                value={c.color}
                onChange={(e) => update(c.id, { color: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border"
              />
              <Input
                value={c.name}
                onChange={(e) => setCols((prev) => prev.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x))}
                onBlur={(e) => update(c.id, { name: e.target.value })}
                className="flex-1 h-8"
              />
              <Button
                size="icon" variant="ghost" className="h-7 w-7"
                title={c.is_default_for_new ? "Padrão para novos leads" : "Tornar padrão"}
                onClick={() => setDefault(c.id)}
              >
                <Star className={`w-4 h-4 ${c.is_default_for_new ? "fill-yellow-400 text-yellow-500" : "text-gray-300"}`} />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => remove(c.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 space-y-2">
          <p className="text-xs font-medium text-gray-600">Adicionar nova coluna</p>
          <div className="flex gap-2">
            <input
              type="color" value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border flex-shrink-0"
            />
            <Input
              placeholder="Nome da coluna"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <Button onClick={add} style={{ backgroundColor: "#006633" }}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}