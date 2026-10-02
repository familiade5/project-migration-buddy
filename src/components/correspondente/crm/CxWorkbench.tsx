import { useMemo } from 'react';
import { CxDeal, CxStage, cxNextAction, cxStageCfg, CX_PURCHASE_LABEL } from '@/types/cxCrm';
import { CxClient } from '@/types/correspondente';
import { ArrowRight, FileUp, PenLine, Sparkles, UserPlus } from 'lucide-react';
import { CxCrmDashboard } from './CxCrmDashboard';

const BRAND = '#1a3a6b';

interface Props {
  deals: CxDeal[];
  stages: CxStage[];
  clients: CxClient[];
  clientName: (id: string) => string;
  onNewWithDocument: () => void;
  onNewManual: () => void;
  onOpenDeal: (deal: CxDeal) => void;
  onOpenFunnel: () => void;
}

export function CxWorkbench({ deals, stages, clients, clientName, onNewWithDocument, onNewManual, onOpenDeal, onOpenFunnel }: Props) {
  const actions = useMemo(
    () =>
      deals
        .map((d) => ({ deal: d, action: cxNextAction(d) }))
        .filter((x) => x.action !== null)
        .sort((a, b) => Number(b.action!.urgent) - Number(a.action!.urgent) || a.deal.stage_entered_at.localeCompare(b.deal.stage_entered_at)),
    [deals],
  );

  return (
    <div className="space-y-5">
      {/* Novo atendimento */}
      <section className="rounded-2xl p-5 text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${BRAND}, #24508f)` }}>
        <div className="flex items-center gap-2 mb-1">
          <UserPlus className="w-5 h-5" />
          <h2 className="text-lg font-bold">Novo atendimento</h2>
        </div>
        <p className="text-sm text-white/80 mb-4">Cadastre o cliente e siga o passo a passo até o Concluído.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={onNewWithDocument} className="rounded-xl bg-white text-left p-4 hover:bg-blue-50 transition-colors">
            <div className="flex items-center gap-2 mb-1" style={{ color: BRAND }}>
              <FileUp className="w-5 h-5" />
              <span className="font-bold">Anexar documento</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xs text-slate-500">RG, CNH ou comprovante — os dados são lidos e preenchidos sozinhos.</p>
          </button>
          <button onClick={onNewManual} className="rounded-xl bg-white/10 border border-white/30 text-left p-4 hover:bg-white/20 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <PenLine className="w-5 h-5" />
              <span className="font-bold">Preencher manualmente</span>
            </div>
            <p className="text-xs text-white/75">Nome, CPF, telefone, e-mail e origem do lead.</p>
          </button>
        </div>
      </section>

      {/* Próximas ações */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold" style={{ color: BRAND }}>Próximas ações</h3>
            <p className="text-xs text-slate-500">O que precisa ser feito agora em cada atendimento.</p>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50" style={{ color: BRAND }}>{actions.length}</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
          {actions.map(({ deal, action }) => {
            const cfg = cxStageCfg(stages, deal.stage);
            return (
              <div key={deal.id} className="px-5 py-3 flex flex-wrap items-center gap-3 hover:bg-slate-50">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{clientName(deal.client_id)}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.short}</span>
                    {deal.purchase_type && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${deal.purchase_type === 'avista' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-700'}`}>
                        {CX_PURCHASE_LABEL[deal.purchase_type]}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onOpenDeal(deal)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg ${
                    action!.urgent ? 'bg-red-600 text-white hover:bg-red-700' : 'text-white hover:opacity-90'
                  }`}
                  style={action!.urgent ? undefined : { backgroundColor: BRAND }}
                >
                  {action!.label} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
          {actions.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-slate-400">Nenhuma ação pendente. Comece um novo atendimento acima.</p>
          )}
        </div>
      </section>

      <CxCrmDashboard deals={deals} stages={stages} clients={clients} onOpenStage={onOpenFunnel} />
    </div>
  );
}
