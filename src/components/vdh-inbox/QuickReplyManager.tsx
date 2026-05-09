import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type QuickReply = {
  id: string;
  title: string;
  keywords: string;
  content: string;
  is_active: boolean;
};

export function QuickReplyManager({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { toast } = useToast();
  const [replies, setReplies] = useState<QuickReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Partial<QuickReply> | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("vdh_quick_replies")
      .select("*")
      .order("created_at", { ascending: false });
    setReplies((data ?? []) as QuickReply[]);
    setLoading(false);
  };

  useEffect(() => { if (open) load(); }, [open]);

  const save = async () => {
    if (!editing?.title?.trim() || !editing?.content?.trim()) {
      toast({ title: "Preencha título e conteúdo", variant: "destructive" });
      return;
    }
    const payload = {
      title: editing.title.trim(),
      keywords: editing.keywords?.trim() ?? "",
      content: editing.content.trim(),
      is_active: editing.is_active ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("vdh_quick_replies").update(payload).eq("id", editing.id)
      : await supabase.from("vdh_quick_replies").insert(payload);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir esta resposta?")) return;
    await supabase.from("vdh_quick_replies").delete().eq("id", id);
    load();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Respostas Rápidas</DialogTitle>
        </DialogHeader>

        {!editing ? (
          <>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setEditing({ is_active: true })} style={{ backgroundColor: "#006633" }}>
                <Plus className="w-4 h-4 mr-1" /> Nova resposta
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 mt-2">
              {loading ? (
                <div className="py-10 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
              ) : replies.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-10">Nenhuma resposta cadastrada ainda.</p>
              ) : (
                replies.map((r) => (
                  <div key={r.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{r.title}</h4>
                          {!r.is_active && <span className="text-[10px] bg-gray-200 px-1.5 rounded">inativa</span>}
                        </div>
                        {r.keywords && <p className="text-[11px] text-gray-500 mt-0.5">🔑 {r.keywords}</p>}
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2 whitespace-pre-wrap">{r.content}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(r)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => remove(r.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3 flex-1 overflow-y-auto">
              <div>
                <Label>Título</Label>
                <Input
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Ex: Tabela de preços"
                />
              </div>
              <div>
                <Label>Palavras-chave / intenção</Label>
                <Input
                  value={editing.keywords ?? ""}
                  onChange={(e) => setEditing({ ...editing, keywords: e.target.value })}
                  placeholder="preço, valor, quanto custa, tabela"
                />
                <p className="text-[11px] text-gray-500 mt-1">A IA usa isso para sugerir esta resposta automaticamente.</p>
              </div>
              <div>
                <Label>Conteúdo da resposta</Label>
                <Textarea
                  value={editing.content ?? ""}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={6}
                  placeholder="Olá! Segue nossa tabela atualizada..."
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editing.is_active ?? true}
                  onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                />
                <Label className="!mt-0">Ativa</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button onClick={save} style={{ backgroundColor: "#006633" }}>Salvar</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}