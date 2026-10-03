import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FileSearch, FileText, History, Loader2, Plus, Sparkles } from 'lucide-react';
import { CxCreditAnalysis, CxCreditAnalysisResult, CxDeal, CX_ANALYSIS_RESULT, cxCurrency } from '@/types/cxCrm';
import { extractCreditAnalysisFile, openCxFile, saveCxFile } from '@/lib/cxDocFiles';
import { useCxCreditAnalyses } from '@/hooks/useCxCreditAnalyses';
import { supabase } from '@/integrations/supabase/client';

const FIELD = 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400';
type Form = Record<string, string> & { result: CxCreditAnalysisResult };
const EMPTY: Form = {
  result: 'aprovado', proposal_code: '', appraisal_code: '', correspondent_code: '', analyzed_cpf: '', analyzed_name: '',
  registration_protocol: '', relationship_agency: '', funding_source: '', modality: '', product: '', credit_line: '', mcmv_tier: '',
  property_value: '', financing_value: '', approved_value: '', installment_value: '', possible_installment: '', indexer: '',
  amortization_system: '', term_months: '', originating_system: '', response_at: '', validity_start: '', validity_end: '', rating: '', margin_value: '',
  condition_category: '', condition_reason: '', rejection_category: '', rejection_reason: '', error_message: '', error_reference: '',
  operator_name: '', notes: '',
};

interface Props {
  deal: CxDeal;
  onUpdate: (id: string, patch: Partial<CxDeal>) => Promise<boolean>;
  onMove: (to: string, extra: Partial<CxDeal>, note: string) => void;
}

const value = (v: unknown) => v === null || v === undefined ? '' : String(v);
const number = (v: string) => {
  const normalized = v.replace(/\s|R\$/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return v.trim() && Number.isFinite(parsed) ? parsed : null;
};
const date = (v: string) => {
  if (!v) return null;
  const match = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : v;
};

export function CxCreditAnalysisWorkspace({ deal, onUpdate, onMove }: Props) {
  const { analyses, loading, createAnalysis } = useCxCreditAnalyses(deal.id);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [reading, setReading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extracted, setExtracted] = useState<Record<string, unknown> | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const set = (key: string, next: string) => setForm((old) => ({ ...old, [key]: next }));

  useEffect(() => { setEditing(false); setForm(EMPTY); setFile(null); setExtracted(null); }, [deal.id]);

  const read = async (selected: File) => {
    setFile(selected); setReading(true);
    try {
      const data = await extractCreditAnalysisFile(selected);
      setExtracted(data);
      setForm((old) => {
        const next = { ...old };
        Object.keys(EMPTY).forEach((key) => { if (data[key] !== null && data[key] !== undefined) next[key] = value(data[key]); });
        return next;
      });
      setEditing(true);
      toast.success('Leitura concluída', { description: 'Confira os campos antes de salvar.' });
    } catch (error) {
      toast.error('Não foi possível ler a análise', { description: error instanceof Error ? error.message : undefined });
    } finally { setReading(false); }
  };

  const save = async () => {
    if (!file) { toast.error('Anexe o documento original da análise'); return; }
    if (form.credit_line === 'mcmv' && !form.mcmv_tier) { toast.error('Informe a faixa do MCMV'); return; }
    setSaving(true);
    try {
      const doc = await saveCxFile({ clientId: deal.client_id, file, docType: 'resultado_analise', extracted, dealId: deal.id, stage: 'analise_credito' });
      const payload: Record<string, unknown> = { client_id: deal.client_id, result: form.result, source_document_id: doc.id, source: extracted ? 'extracao_conferida' : 'manual', extracted_snapshot: extracted || {} };
      const numeric = ['property_value','financing_value','approved_value','installment_value','possible_installment','margin_value','term_months'];
      const dates = ['validity_start','validity_end','response_at'];
      Object.keys(EMPTY).forEach((key) => {
        if (key === 'result') return;
        payload[key] = numeric.includes(key) ? number(form[key]) : dates.includes(key) ? date(form[key]) : form[key].trim() || null;
      });
      const saved = await createAnalysis(payload);
      if (!saved) return;
      await supabase.from('cx_documents').update({ credit_analysis_id: saved.id, category: 'credito' } as never).eq('id', doc.id);
      const isApproved = form.result === 'aprovado';
      await onUpdate(deal.id, {
        credit_status: form.result,
        property_value: number(form.property_value), financing_value: number(form.financing_value),
        approved_value: number(form.approved_value), installment_value: number(form.installment_value),
        rating: form.rating || null, margin_value: number(form.margin_value),
        next_review_at: isApproved ? null : deal.next_review_at,
        next_action: isApproved ? 'Vincular imóvel' : 'Acompanhar pendência e preparar reanálise',
      });
      const inCreditFlow = ['cadastro', 'tipo_compra', 'analise_credito', 'credito_aprovado', 'pendencia'].includes(deal.stage);
      if (inCreditFlow) onMove(isApproved ? 'credito_aprovado' : 'pendencia', {}, `Análise #${saved.sequence_number}: ${CX_ANALYSIS_RESULT[form.result].label}`);
      setEditing(false); setForm(EMPTY); setFile(null); setExtracted(null);
      toast.success('Nova análise salva no histórico');
    } catch (error) { toast.error('Não foi possível salvar a análise', { description: error instanceof Error ? error.message : undefined }); }
    finally { setSaving(false); }
  };

  const input = (key: string, label: string, type = 'text') => <div><Label className="text-xs text-muted-foreground">{label}</Label><Input type={type} value={form[key]} onChange={(e) => set(key, e.target.value)} className={FIELD} /></div>;
  const latest = analyses[0];

  return <section className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="font-semibold text-foreground">Análises de crédito</h3><p className="text-xs text-muted-foreground">Cada envio cria um registro permanente; análises anteriores nunca são substituídas.</p></div>
      <Button onClick={() => setEditing(true)}><Plus className="mr-2 h-4 w-4" />Nova análise</Button>
    </div>

    {editing && <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4 overflow-hidden">
      <input ref={ref} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { const selected=e.target.files?.[0]; e.target.value=''; if(selected) read(selected); }} />
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-100" onClick={() => ref.current?.click()} disabled={reading || saving}>{reading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}{reading ? 'Lendo documento…' : 'Anexar e preencher automaticamente'}</Button>
        {file && <span className="text-xs text-muted-foreground"><FileText className="inline h-4 w-4 mr-1" />{file.name}</span>}
      </div>
      <div><Label className="text-xs text-muted-foreground">Resultado *</Label><Select value={form.result} onValueChange={(v) => set('result', v)}><SelectTrigger className={FIELD}><SelectValue /></SelectTrigger><SelectContent>{Object.entries(CX_ANALYSIS_RESULT).map(([key,cfg]) => <SelectItem key={key} value={key}>{cfg.label}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{input('proposal_code','Código da proposta')}{input('appraisal_code','Código da avaliação')}{input('correspondent_code','Código do correspondente')}{input('analyzed_name','Nome analisado')}{input('analyzed_cpf','CPF analisado')}{input('relationship_agency','Agência de relacionamento')}{input('registration_protocol','Protocolo')}{input('operator_name','Operador solicitante')}{input('funding_source','Origem do recurso')}</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{input('modality','Modalidade')}{input('product','Produto')}<div><Label className="text-xs text-muted-foreground">Linha de crédito</Label><Select value={form.credit_line} onValueChange={(v) => set('credit_line',v)}><SelectTrigger className={FIELD}><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="mcmv">MCMV</SelectItem><SelectItem value="sbpe">SBPE</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent></Select></div>{form.credit_line==='mcmv' && <div><Label className="text-xs text-muted-foreground">Faixa MCMV *</Label><Select value={form.mcmv_tier} onValueChange={(v)=>set('mcmv_tier',v)}><SelectTrigger className={FIELD}><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{[1,2,3,4].map(n=><SelectItem key={n} value={`faixa_${n}`}>Faixa {n}</SelectItem>)}</SelectContent></Select></div>}</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{input('property_value','Valor do imóvel')}{input('financing_value','Financiamento')}{input('approved_value','Valor aprovado')}{input('installment_value','Prestação')}{input('possible_installment','Prestação possível')}{input('term_months','Prazo (meses)','number')}{input('indexer','Indexador')}{input('amortization_system','Amortização')}{input('originating_system','Sistema originador')}{input('response_at','Resposta SIRIC')}{input('validity_start','Validade inicial')}{input('validity_end','Validade final')}{input('rating','Rating')}{input('margin_value','Margem')}</div>
      {form.result==='condicionado' && <div className="space-y-2">{input('condition_category','Categoria da condição')}<Label className="text-xs text-muted-foreground">Condição de aprovação</Label><Textarea value={form.condition_reason} onChange={(e)=>set('condition_reason',e.target.value)} className={FIELD} /></div>}
      {form.result==='reprovado' && <div className="space-y-2"><Label className="text-xs text-muted-foreground">Motivo</Label><Select value={form.rejection_category} onValueChange={(v)=>set('rejection_category',v)}><SelectTrigger className={FIELD}><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="rating">Rating</SelectItem><SelectItem value="capacidade">Capacidade de pagamento</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent></Select><Textarea value={form.rejection_reason} onChange={(e)=>set('rejection_reason',e.target.value)} placeholder="Mensagem exata da reprovação" className={FIELD} /></div>}
      {form.result==='erro' && <div className="space-y-2"><Textarea value={form.error_message} onChange={(e)=>set('error_message',e.target.value)} placeholder="Mensagem do erro de validação" className={FIELD} />{input('error_reference','Pergunta ou referência')}</div>}
      <Textarea value={form.notes} onChange={(e)=>set('notes',e.target.value)} placeholder="Observações da análise" className={FIELD} />
      <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" className="bg-white border-slate-200 text-slate-700" onClick={()=>setEditing(false)} disabled={saving}>Cancelar</Button><Button onClick={save} disabled={saving || reading || !file}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Confirmar e salvar nova análise</Button></div>
    </div>}

    {loading ? <p className="text-sm text-muted-foreground">Carregando histórico…</p> : analyses.length===0 ? <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground"><FileSearch className="mx-auto mb-2 h-6 w-6" />Nenhuma análise registrada.</div> : <div className="space-y-2">{analyses.map((a) => <AnalysisCard key={a.id} analysis={a} latest={a.id===latest?.id} />)}</div>}
  </section>;
}

function AnalysisCard({ analysis:a, latest }: { analysis:CxCreditAnalysis; latest:boolean }) {
  const cfg=CX_ANALYSIS_RESULT[a.result];
  return <div className="rounded-lg border border-border bg-background p-3"><div className="flex flex-wrap items-center gap-2"><History className="h-4 w-4 text-muted-foreground"/><strong className="text-sm">Análise #{a.sequence_number}</strong><span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${cfg.tone}`}>{cfg.label}</span>{latest&&<span className="text-xs text-muted-foreground">Mais recente</span>}<span className="ml-auto text-xs text-muted-foreground">{new Date(a.analysis_date).toLocaleString('pt-BR')}</span></div><div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"><span>Proposta: <b>{a.proposal_code||'—'}</b></span><span>Avaliação: <b>{a.appraisal_code||'—'}</b></span><span>Produto: <b>{a.product||'—'}</b></span><span>Financiamento: <b>{cxCurrency(a.financing_value)}</b></span></div>{(a.condition_reason||a.rejection_reason||a.error_message)&&<p className="mt-2 rounded bg-muted p-2 text-xs text-foreground">{a.condition_reason||a.rejection_reason||a.error_message}</p>}{a.source_document_id&&<Button size="sm" variant="ghost" className="mt-1 h-7 px-1 text-xs" onClick={async()=>{ const {data}=await supabase.from('cx_documents').select('file_path').eq('id',a.source_document_id).maybeSingle(); const path=(data as {file_path?:string}|null)?.file_path; if(path) openCxFile(path); }}>Abrir documento original</Button>}</div>;
}