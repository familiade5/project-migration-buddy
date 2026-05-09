import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DAYS = [
  { v: 0, label: "Dom" }, { v: 1, label: "Seg" }, { v: 2, label: "Ter" },
  { v: 3, label: "Qua" }, { v: 4, label: "Qui" }, { v: 5, label: "Sex" }, { v: 6, label: "Sáb" },
];

type Cfg = {
  id: string;
  is_enabled: boolean;
  business_days: number[];
  business_hour_start: number;
  business_hour_end: number;
  timezone: string;
  system_prompt: string;
};

export function AutoReplySettings({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { toast } = useToast();
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase.from("vdh_auto_reply_config").select("*").limit(1).maybeSingle()
      .then(({ data }) => { if (data) setCfg(data as Cfg); setLoading(false); });
  }, [open]);

  const save = async () => {
    if (!cfg) return;
    const { error } = await supabase.from("vdh_auto_reply_config").update({
      is_enabled: cfg.is_enabled,
      business_days: cfg.business_days,
      business_hour_start: cfg.business_hour_start,
      business_hour_end: cfg.business_hour_end,
      system_prompt: cfg.system_prompt,
    }).eq("id", cfg.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Configuração salva" });
    onOpenChange(false);
  };

  const toggleDay = (d: number) => {
    if (!cfg) return;
    const days = cfg.business_days.includes(d)
      ? cfg.business_days.filter((x) => x !== d)
      : [...cfg.business_days, d].sort();
    setCfg({ ...cfg, business_days: days });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Auto-resposta com IA
          </DialogTitle>
        </DialogHeader>

        {loading || !cfg ? (
          <div className="py-10 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">Ativar auto-resposta</p>
                <p className="text-xs text-gray-500">Responde automaticamente fora do horário comercial</p>
              </div>
              <Switch
                checked={cfg.is_enabled}
                onCheckedChange={(v) => setCfg({ ...cfg, is_enabled: v })}
              />
            </div>

            <div>
              <Label>Dias de atendimento (humano)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {DAYS.map((d) => (
                  <button
                    key={d.v}
                    type="button"
                    onClick={() => toggleDay(d.v)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition"
                    style={cfg.business_days.includes(d.v)
                      ? { backgroundColor: "#006633", color: "white", borderColor: "#006633" }
                      : { backgroundColor: "white", color: "#374151" }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Início</Label>
                <Input
                  type="number" min={0} max={23}
                  value={cfg.business_hour_start}
                  onChange={(e) => setCfg({ ...cfg, business_hour_start: Number(e.target.value) })}
                />
                <p className="text-[11px] text-gray-500 mt-1">Hora (0-23)</p>
              </div>
              <div>
                <Label>Fim</Label>
                <Input
                  type="number" min={1} max={24}
                  value={cfg.business_hour_end}
                  onChange={(e) => setCfg({ ...cfg, business_hour_end: Number(e.target.value) })}
                />
                <p className="text-[11px] text-gray-500 mt-1">Hora (1-24)</p>
              </div>
            </div>

            <div>
              <Label>Instruções para a IA</Label>
              <Textarea
                rows={6}
                value={cfg.system_prompt}
                onChange={(e) => setCfg({ ...cfg, system_prompt: e.target.value })}
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Defina personalidade, tom e o que a IA pode/não pode falar. Suas respostas rápidas cadastradas são usadas como referência automaticamente.
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              ⏰ Fuso: <strong>{cfg.timezone}</strong>. A IA só responde quando o lead enviar mensagem fora do horário e dia configurados.
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={save} style={{ backgroundColor: "#006633" }}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}