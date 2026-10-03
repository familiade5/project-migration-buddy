import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CxDeal,
  CxRejectionReason,
  CxStage,
  CX_FLOW_AVISTA,
  CX_FLOW_FINANCIADA,
  CX_REJECTION_CONFIG,
  cxStageCfg,
} from '@/types/cxCrm';
import { CxProperty } from '@/types/correspondente';
import { CxStageDocSlot, useDealDocs } from './CxStageDocs';
import { Banknote, Building2, Check, CheckCircle2, Home, Landmark, RotateCcw } from 'lucide-react';

const FIELD = 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400';
const POPOVER = 'bg-white text-slate-900 border-slate-200';
const ITEM = 'text-slate-700 focus:bg-slate-100 focus:text-slate-900';

interface Props {
  deal: CxDeal;
  stages: CxStage[];
  properties: CxProperty[];
  onFlow: (to: string, extra: Partial<CxDeal>, note: string | null) => void;
  onUpdate: (id: string, patch: Partial<CxDeal>) => Promise<boolean>;
  onAddProperty: () => void;
}

function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function CxFlowStepper({ deal, stages, properties, onFlow, onUpdate, onAddProperty }: Props) {
  const flow = deal.purchase_type === 'avista' ? CX_FLOW_AVISTA : CX_FLOW_FINANCIADA;
  const stageForBar = deal.stage === 'pendencia' ? 'analise_credito' : deal.stage;
  const currentIdx = Math.max(0, flow.indexOf(stageForBar === 'cadastro' ? 'tipo_compra' : stageForBar));
  const inFlow = flow.includes(stageForBar) || deal.stage === 'pendencia';

  const [reason, setReason] = useState<CxRejectionReason | ''>('');
  const [rejectNote, setRejectNote] = useState('');
  const [reviewAt, setReviewAt] = useState(addDays(30));
  const [rejecting, setRejecting] = useState(false);
  const [pendNote, setPendNote] = useState(deal.pendencies || '');
  const [propId, setPropId] = useState(deal.property_id || '');
  const [stepNote, setStepNote] = useState('');
  const [stepDate, setStepDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    setRejecting(false);
    setReason('');
    setRejectNote('');
    setPendNote(deal.pendencies || '');
    setPropId(deal.property_id || '');
    setStepNote('');
  }, [deal.id, deal.stage]);

  const { docs, refetch: refetchDocs } = useDealDocs(deal.id);
  const hasDoc = (t: string) => docs.some((d) => d.doc_type === t);
  const slot = (stage: string, docType: string, label: string, hint?: string, autofill?: boolean) => (
    <CxStageDocSlot deal={deal} stage={stage} docType={docType} label={label} hint={hint} docs={docs} onSaved={refetchDocs} autofill={autofill} onUpdate={onUpdate} />
  );

  const clientProps = properties.filter((p) => p.client_id === deal.client_id);
  const otherProps = properties.filter((p) => p.client_id !== deal.client_id);

  return (
    <section className="space-y-4 rounded-lg border border-primary/25 bg-primary/5 p-4">
      {/* Barra de progresso */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-2">
          Fluxo {deal.purchase_type === 'avista' ? 'à vista' : deal.purchase_type === 'financiada' ? 'financiado' : 'do atendimento'}
        </p>
        <div className="flex items-center gap-1 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {flow.filter((k) => k !== 'cadastro').map((key, i) => {
            const idx = i + 1;
            const done = inFlow && idx < currentIdx;
            const current = inFlow && idx === currentIdx;
            const label = key === 'tipo_compra' ? 'Tipo de compra' : cxStageCfg(stages, key).label;
            return (
              <div key={key} className="flex items-center gap-1 shrink-0">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                    done
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : current
                      ? deal.stage === 'pendencia'
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'border-primary bg-primary text-primary-foreground'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {done && <Check className="w-3 h-3" />}
                  {current && deal.stage === 'pendencia' ? 'Pendência' : label}
                </div>
                {i < flow.length - 2 && <div className="w-3 h-px bg-slate-300" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ação da etapa atual */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3">
        {(deal.stage === 'cadastro' || deal.stage === 'tipo_compra' || (!deal.purchase_type && !['concluido'].includes(deal.stage))) ? (
          <>
            <h4 className="text-sm font-bold text-slate-900">Qual é o tipo de compra?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onFlow('vincular_imovel', { purchase_type: 'avista', credit_status: null }, 'Tipo de compra: À vista')}
                className="h-auto min-h-28 w-full items-start justify-start whitespace-normal border-orange-200 bg-orange-50 p-4 text-left text-orange-800 hover:bg-orange-100 hover:text-orange-900"
              >
                <Banknote className="mt-0.5 h-6 w-6 shrink-0 text-orange-600" />
                <span><span className="block font-bold">À vista</span><span className="mt-1 block text-xs font-normal">Vai direto para vincular o imóvel.</span></span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onFlow('analise_credito', { purchase_type: 'financiada', credit_status: null }, 'Tipo de compra: Financiada')}
                className="h-auto min-h-28 w-full items-start justify-start whitespace-normal border-emerald-200 bg-emerald-50 p-4 text-left text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900"
              >
                <Landmark className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
                <span><span className="block font-bold">Financiada</span><span className="mt-1 block text-xs font-normal">Segue para a análise de crédito.</span></span>
              </Button>
            </div>
          </>
        ) : deal.stage === 'analise_credito' ? (
          <>
            <h4 className="text-sm font-bold text-slate-900">Análise de crédito em andamento</h4>
            <p className="text-xs text-slate-500">Use “Nova análise” acima para anexar o resultado da CAIXA, conferir todos os dados e registrar o resultado. O processo será movimentado automaticamente sem apagar análises anteriores.</p>
          </>
        ) : deal.stage === 'pendencia' ? (
          <>
            <h4 className="text-sm font-bold text-red-700">Pendência / Acompanhamento</h4>
            {deal.rejection_reason && (
              <p className="text-xs text-slate-600">Motivo: <strong>{CX_REJECTION_CONFIG[deal.rejection_reason].label}</strong></p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
              <Textarea className={FIELD} rows={2} placeholder="Descreva a pendência" value={pendNote} onChange={(e) => setPendNote(e.target.value)} onBlur={() => pendNote !== (deal.pendencies || '') && onUpdate(deal.id, { pendencies: pendNote || null })} />
              <div className="space-y-1">
                <Label className="text-slate-600 text-xs">Prazo / reavaliação</Label>
                <Input type="date" className={FIELD} value={deal.next_review_at || ''} onChange={(e) => onUpdate(deal.id, { next_review_at: e.target.value || null })} />
              </div>
            </div>
            <Button onClick={() => onFlow('analise_credito', { pendencies: pendNote || null }, 'Pendência resolvida — nova análise')}>
              <RotateCcw className="w-4 h-4 mr-1.5" /> Pendência resolvida → Nova análise de crédito
            </Button>
          </>
        ) : deal.stage === 'credito_aprovado' ? (
          <>
            <h4 className="text-sm font-bold text-emerald-700">Crédito aprovado</h4>
            <p className="text-xs text-slate-500">Agora vincule o imóvel escolhido pelo cliente.</p>
            <Button onClick={() => onFlow('vincular_imovel', {}, null)}>
              <Home className="w-4 h-4 mr-1.5" /> Ir para Vincular imóvel
            </Button>
          </>
        ) : deal.stage === 'vincular_imovel' ? (
          <>
            <h4 className="text-sm font-bold text-slate-900">Vincular imóvel</h4>
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={propId} onValueChange={setPropId}>
                <SelectTrigger className={`${FIELD} w-full sm:w-80`}><SelectValue placeholder="Escolha o imóvel" /></SelectTrigger>
                <SelectContent className={POPOVER}>
                  {clientProps.map((p) => (
                    <SelectItem key={p.id} value={p.id} className={ITEM}>{p.name}{p.address ? ` — ${p.address}` : ''}</SelectItem>
                  ))}
                  {otherProps.map((p) => (
                    <SelectItem key={p.id} value={p.id} className={ITEM}>{p.name} (outro cliente)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-white border-slate-200 text-slate-700" onClick={onAddProperty}>
                <Building2 className="w-4 h-4 mr-1.5" /> Cadastrar imóvel
              </Button>
            </div>
            {properties.length === 0 && <p className="text-xs text-slate-500">Nenhum imóvel cadastrado ainda. Cadastre na ficha do cliente (aba Imóveis).</p>}
            <Button
              disabled={!propId}
              onClick={() => onFlow('documentacao', { property_id: propId }, `Imóvel vinculado: ${properties.find((p) => p.id === propId)?.name ?? ''}`)}
            >
              Vincular e iniciar Documentação
            </Button>
          </>
        ) : deal.stage === 'documentacao' ? (
          <>
            <h4 className="text-sm font-bold text-slate-900">Documentação do processo</h4>
            <p className="text-xs text-slate-500">Concentre os arquivos aqui e faça a conferência item a item no controle operacional abaixo.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {slot('documentacao', 'documentacao_cliente', 'Documentação do cliente *', 'Documentos conferidos para o processo')}
              {slot('documentacao', 'documentacao_imovel', 'Documentação do imóvel *', 'Matrícula e documentos do imóvel')}
            </div>
            <Button disabled={!hasDoc('documentacao_cliente') || !hasDoc('documentacao_imovel')} onClick={() => onFlow(deal.purchase_type === 'financiada' ? 'engenharia' : 'contrato', {}, 'Documentação conferida')}>
              <Check className="w-4 h-4 mr-1.5" /> Concluir documentação
            </Button>
          </>
        ) : deal.stage === 'engenharia' ? (
          <>
            <h4 className="text-sm font-bold text-slate-900">Engenharia / Vistoria</h4>
            <p className="text-xs text-slate-500">Anexe o laudo e registre situação, datas, responsável e pendências no controle operacional.</p>
            {slot('engenharia', 'laudo_engenharia', 'Laudo de engenharia / vistoria *', 'PDF ou imagem emitida pelo responsável')}
            <div className="flex flex-wrap gap-2">
              <Button disabled={!hasDoc('laudo_engenharia')} onClick={() => onFlow('contrato', {}, 'Engenharia aprovada')}><CheckCircle2 className="w-4 h-4 mr-1.5" /> Vistoria aprovada</Button>
              <Button variant="outline" className="bg-white border-red-200 text-red-600" onClick={() => onFlow('pendencia_engenharia', {}, 'Pendência identificada na engenharia')}>Registrar pendência</Button>
            </div>
          </>
        ) : deal.stage === 'pendencia_engenharia' ? (
          <>
            <h4 className="text-sm font-bold text-red-700">Pendência de engenharia</h4>
            <Textarea className={FIELD} rows={2} placeholder="Descreva o que precisa ser corrigido" value={pendNote} onChange={(e) => setPendNote(e.target.value)} onBlur={() => onUpdate(deal.id, { pendencies: pendNote || null })} />
            <Button onClick={() => onFlow('engenharia', { pendencies: pendNote || null }, 'Correção enviada — nova conferência da engenharia')}><RotateCcw className="w-4 h-4 mr-1.5" /> Voltar para Engenharia</Button>
          </>
        ) : ['contrato', 'itbi_registro', 'entrega_chaves'].includes(deal.stage) ? (
          (() => {
            const order = ['contrato', 'itbi_registro', 'entrega_chaves', 'concluido'];
            const next = order[order.indexOf(deal.stage) + 1];
            const label = cxStageCfg(stages, deal.stage).label;
            const req = {
              contrato: { type: 'contrato', label: 'Contrato assinado *', hint: 'PDF ou foto do contrato assinado' },
              itbi_registro: { type: 'itbi', label: 'Guia/comprovante do ITBI e registro *', hint: 'ITBI pago e/ou matrícula registrada' },
              entrega_chaves: { type: 'termo_entrega', label: 'Termo de entrega das chaves *', hint: 'Termo assinado ou foto da entrega' },
            }[deal.stage as 'contrato' | 'itbi_registro' | 'entrega_chaves'];
            return (
              <>
                <h4 className="text-sm font-bold text-slate-900">{label}</h4>
                <p className="text-xs text-slate-500">O documento comprova a etapa; datas, situação e pendências ficam registradas no controle operacional abaixo.</p>
                {slot(deal.stage, req.type, req.label, req.hint)}
                {!hasDoc(req.type) && <p className="text-[11px] font-semibold text-amber-600">Anexe o documento para concluir esta etapa.</p>}
                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
                  <div className="space-y-1">
                    <Label className="text-slate-600 text-xs">Data de conclusão</Label>
                    <Input type="date" className={FIELD} value={stepDate} onChange={(e) => setStepDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-600 text-xs">Observação (opcional)</Label>
                    <Input className={FIELD} placeholder="Ex.: contrato assinado no cartório X" value={stepNote} onChange={(e) => setStepNote(e.target.value)} />
                  </div>
                </div>
                <Button
                  disabled={!hasDoc(req.type)}
                  onClick={() =>
                    onFlow(next, {}, `${label} concluído em ${stepDate.split('-').reverse().join('/')}${stepNote ? ` — ${stepNote}` : ''}`)
                  }
                >
                  <Check className="w-4 h-4 mr-1.5" /> Concluir etapa → {cxStageCfg(stages, next).label}
                </Button>
              </>
            );
          })()
        ) : deal.stage === 'concluido' ? (
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-bold">Atendimento concluído. Veja o histórico completo abaixo.</p>
          </div>
        ) : (
          <p className="text-xs text-slate-500">Este caso está em uma etapa personalizada. Use o seletor de etapa abaixo para movê-lo.</p>
        )}
      </div>
    </section>
  );
}
