import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Phone, Home, AlertTriangle, ExternalLink, RefreshCw, Copy } from 'lucide-react';
import noPhoto from '@/assets/imagem-nao-fornecida.jpg';

const BRAND = '#006633';
const STAGES: { key: string; label: string; color: string }[] = [
  { key: 'novo', label: 'Novo pedido', color: '#64748b' },
  { key: 'documentacao', label: 'Documentação', color: '#0ea5e9' },
  { key: 'em_analise', label: 'Em análise', color: '#8b5cf6' },
  { key: 'condicionado', label: 'Condicionado', color: '#f59e0b' },
  { key: 'aprovado', label: 'Aprovado', color: '#22c55e' },
  { key: 'reprovado', label: 'Reprovado', color: '#ef4444' },
  { key: 'vendas', label: 'Enviado para vendas', color: '#006633' },
  { key: 'fechado', label: 'Fechado', color: '#c9a84c' },
];
const stageOf = (k: string) => STAGES.find((s) => s.key === k) || STAGES[0];
const brl = (n?: number | null) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const DOC_LABEL: Record<string, string> = { identidade: 'RG/CNH', renda: 'Renda', residencia: 'Residência', compositor: 'Compositor', outros: 'Outros' };

type Lead = any;

export default function CCVdh() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sold, setSold] = useState<Set<string>>(new Set());
  const [brokers, setBrokers] = useState<{ id: string; full_name: string }[]>([]);
  const [open, setOpen] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const db = supabase as any;

  const load = async () => {
    setLoading(true);
    const { data } = await db.from('vdh_cc_leads').select('*').order('created_at', { ascending: false });
    setLeads(data || []);
    const codes = [...new Set((data || []).map((l: Lead) => l.property_code).filter(Boolean))];
    if (codes.length) {
      const { data: props } = await db.from('vdh_site_properties').select('code, status').in('code', codes);
      const active = new Set((props || []).filter((p: any) => p.status === 'active').map((p: any) => p.code));
      setSold(new Set(codes.filter((c) => !active.has(c)) as string[]));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    supabase.from('profiles').select('id, full_name').eq('approval_status', 'approved').order('full_name')
      .then(({ data }) => setBrokers((data || []) as any));
  }, []);

  const byStage = useMemo(() => {
    const m: Record<string, Lead[]> = {};
    STAGES.forEach((s) => (m[s.key] = []));
    leads.forEach((l) => (m[l.stage] || m.novo).push(l));
    return m;
  }, [leads]);

  const update = async (lead: Lead, patch: Record<string, any>, note?: string) => {
    const { error } = await db.from('vdh_cc_leads').update(patch).eq('id', lead.id);
    if (error) { toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' }); return; }
    if (patch.stage && patch.stage !== lead.stage || note) {
      await db.from('vdh_cc_lead_history').insert({
        lead_id: lead.id, from_stage: lead.stage, to_stage: patch.stage || lead.stage, note: note || null,
        user_id: user?.id, user_name: profile?.full_name || profile?.email,
      });
    }
    const updated = { ...lead, ...patch };
    setLeads((o) => o.map((l) => (l.id === lead.id ? updated : l)));
    setOpen((o: Lead) => (o?.id === lead.id ? updated : o));
    toast({ title: 'Salvo' });
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BRAND }}>CC VDH</h1>
            <p className="text-xs text-slate-500">Pedidos de pré-análise vindos do site · separado do CC do AM</p>
          </div>
          <div className="flex gap-2">
            <a href="/imoveis" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-700"><ExternalLink className="w-4 h-4" />Abrir site</a>
            <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: BRAND }}><RefreshCw className="w-4 h-4" />Atualizar</button>
          </div>
        </div>

        {loading ? <p className="text-slate-500 text-center py-16">Carregando…</p> : (
          <div className="flex gap-3 overflow-x-auto pb-4">
            {STAGES.map((s) => (
              <div key={s.key} className="w-72 shrink-0 bg-white rounded-xl border border-slate-200">
                <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />{s.label}</span>
                  <span className="text-xs font-bold text-slate-500">{byStage[s.key].length}</span>
                </div>
                <div className="p-2 space-y-2 min-h-[120px]">
                  {byStage[s.key].map((l) => (
                    <button key={l.id} onClick={() => setOpen(l)} className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-400 transition-colors">
                      <p className="font-semibold text-sm text-slate-900 truncate">{l.full_name}</p>
                      <p className="text-xs text-slate-500">{brl(Number(l.monthly_income) + Number(l.coborrower_income || 0))}/mês · {(l.documents || []).length} doc(s)</p>
                      {l.property_snapshot && <p className="text-xs text-slate-600 mt-1 truncate"><Home className="w-3 h-3 inline mr-1" />{l.property_snapshot.neighborhood} · {l.property_snapshot.city}</p>}
                      {l.property_code && sold.has(l.property_code) && <p className="text-[11px] mt-1 font-semibold text-red-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Imóvel saiu da Caixa</p>}
                      {l.assigned_broker_name && <p className="text-[11px] mt-1 font-medium" style={{ color: BRAND }}>Corretor: {l.assigned_broker_name}</p>}
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(l.created_at).toLocaleString('pt-BR')}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && <LeadDialog lead={open} sold={!!open.property_code && sold.has(open.property_code)} brokers={brokers} onClose={() => setOpen(null)} onUpdate={update} />}
    </AppLayout>
  );
}

function LeadDialog({ lead, sold, brokers, onClose, onUpdate }: { lead: Lead; sold: boolean; brokers: { id: string; full_name: string }[]; onClose: () => void; onUpdate: (l: Lead, p: any, note?: string) => Promise<void> }) {
  const [notes, setNotes] = useState(lead.analyst_notes || '');
  const [approved, setApproved] = useState(lead.approved_value ? String(lead.approved_value) : '');
  const [reason, setReason] = useState(lead.rejection_reason || '');
  const [broker, setBroker] = useState(lead.assigned_broker_id || '');
  const [history, setHistory] = useState<any[]>([]);
  const p = lead.property_snapshot;
  const { toast } = useToast();

  useEffect(() => {
    (supabase as any).from('vdh_cc_lead_history').select('*').eq('lead_id', lead.id).order('created_at', { ascending: false }).then(({ data }: any) => setHistory(data || []));
  }, [lead.id, lead.stage]);

  const openDoc = async (path: string) => {
    const { data } = await supabase.storage.from('vdh-site-docs').createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };
  const copy = (v: string) => { navigator.clipboard.writeText(v); toast({ title: 'Copiado' }); };

  const sendToSales = () => {
    const b = brokers.find((x) => x.id === broker);
    if (!b) { toast({ title: 'Escolha o corretor', variant: 'destructive' }); return; }
    onUpdate(lead, { stage: 'vendas', assigned_broker_id: b.id, assigned_broker_name: b.full_name }, `Enviado para ${b.full_name}`);
  };

  const row = (label: string, value?: string | null) => value ? (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-100 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="flex items-center gap-1.5 text-slate-900 font-medium">{value}<button onClick={() => copy(value)} aria-label="Copiar"><Copy className="w-3.5 h-3.5 text-slate-400" /></button></span>
    </div>
  ) : null;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-white text-slate-900">
        <DialogHeader>
          <DialogTitle className="text-slate-900">{lead.full_name}</DialogTitle>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ backgroundColor: stageOf(lead.stage).color }}>{stageOf(lead.stage).label}</span>
            <select value={lead.stage} onChange={(e) => onUpdate(lead, { stage: e.target.value })} className="h-8 px-2 rounded-md border border-slate-200 bg-white text-slate-700 text-sm">
              {STAGES.map((s) => <option key={s.key} value={s.key}>Mover para: {s.label}</option>)}
            </select>
            <a href={`https://wa.me/55${String(lead.phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="h-8 px-3 rounded-md text-sm font-medium flex items-center gap-1 text-white" style={{ backgroundColor: '#25D366' }}><Phone className="w-3.5 h-3.5" />WhatsApp</a>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Cliente</h3>
            {row('Telefone', lead.phone)}{row('CPF', lead.cpf)}{row('E-mail', lead.email)}
            {row('Nascimento', lead.birth_date ? new Date(lead.birth_date + 'T12:00').toLocaleDateString('pt-BR') : null)}
            {row('Estado civil', lead.marital_status)}{row('Renda', brl(lead.monthly_income))}{row('Tipo de renda', lead.income_type)}
            {row('FGTS', lead.uses_fgts ? 'Sim' : 'Não')}
            {lead.has_coborrower && <>{row('Compositor', lead.coborrower_name)}{row('Renda compositor', brl(lead.coborrower_income))}</>}

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Documentos</h3>
            {(lead.documents || []).length === 0 ? <p className="text-xs text-slate-500">Nenhum documento enviado.</p> : (
              <div className="space-y-1.5">
                {lead.documents.map((d: any) => (
                  <button key={d.path} onClick={() => openDoc(d.path)} className="w-full flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white text-left text-sm hover:border-slate-400">
                    <FileText className="w-4 h-4" style={{ color: BRAND }} /><span className="font-medium text-slate-700">{DOC_LABEL[d.kind] || d.kind}</span><span className="text-xs text-slate-400 truncate">{d.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Imóvel de interesse</h3>
            {p ? (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <img src={p.photo_url || noPhoto} onError={(e) => { (e.currentTarget as HTMLImageElement).src = noPhoto; }} className="w-full h-36 object-cover" alt="" />
                <div className="p-3 text-sm">
                  {sold && <p className="mb-2 text-xs font-semibold text-red-600 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />Este imóvel saiu da lista da Caixa — ofereça outro.</p>}
                  <p className="font-semibold text-slate-900">{p.property_type} · {p.neighborhood}</p>
                  <p className="text-xs text-slate-500">{p.address} – {p.city}/{p.uf}</p>
                  <p className="font-bold mt-1" style={{ color: BRAND }}>{brl(p.price)} <span className="text-xs font-normal text-slate-500">aval. {brl(p.evaluation)}</span></p>
                  <p className="text-xs mt-1">{p.accepts_financing ? 'Aceita financiamento' : 'Somente à vista'} · Código {p.code}</p>
                  <div className="flex gap-2 mt-2">
                    <a href={`/imoveis/imovel/${p.code}`} target="_blank" rel="noreferrer" className="text-xs font-medium underline" style={{ color: BRAND }}>Ver no site</a>
                    {p.caixa_link && <a href={p.caixa_link} target="_blank" rel="noreferrer" className="text-xs font-medium underline text-slate-600">Ver na Caixa</a>}
                  </div>
                </div>
              </div>
            ) : <p className="text-xs text-slate-500">Sem imóvel definido.</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <label className="block text-sm"><span className="text-slate-600 text-xs">Valor aprovado</span>
            <input value={approved} onChange={(e) => setApproved(e.target.value.replace(/[^\d.,]/g, ''))} placeholder="Ex.: 150000" className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900" />
          </label>
          <label className="block text-sm"><span className="text-slate-600 text-xs">Motivo de reprovação</span>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900">
              <option value="">—</option><option value="rating">Rating</option><option value="capacidade">Capacidade de pagamento</option><option value="outro">Outro</option>
            </select>
          </label>
        </div>
        <label className="block text-sm mt-3"><span className="text-slate-600 text-xs">Anotações da análise</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-900" />
        </label>
        <button
          onClick={() => onUpdate(lead, { analyst_notes: notes, rejection_reason: reason || null, approved_value: approved ? Number(approved.replace(/\./g, '').replace(',', '.')) : null })}
          className="mt-2 h-10 px-4 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: BRAND }}
        >Salvar análise</button>

        <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: '#f2f8f4', border: '1px solid #cfe5d7' }}>
          <p className="text-sm font-bold text-slate-900">Enviar para o time de vendas</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <select value={broker} onChange={(e) => setBroker(e.target.value)} className="flex-1 min-w-[200px] h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm">
              <option value="">Escolha o corretor</option>{brokers.map((b) => <option key={b.id} value={b.id}>{b.full_name}</option>)}
            </select>
            <button onClick={sendToSales} className="h-10 px-4 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: BRAND }}>Enviar</button>
          </div>
          {lead.assigned_broker_name && <p className="text-xs text-slate-600 mt-2">Atual: {lead.assigned_broker_name}</p>}
        </div>

        <h3 className="text-sm font-bold text-slate-800 mt-5 mb-2">Histórico</h3>
        <ul className="space-y-1.5 text-xs text-slate-600">
          {history.map((h) => (
            <li key={h.id}>{new Date(h.created_at).toLocaleString('pt-BR')} · <b>{h.user_name || '—'}</b>: {h.from_stage ? `${stageOf(h.from_stage).label} → ` : ''}{stageOf(h.to_stage).label}{h.note ? ` — ${h.note}` : ''}</li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
