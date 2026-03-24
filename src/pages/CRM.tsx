import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLeads, useLeadDetail } from '@/hooks/useLeads';
import { useProposals } from '@/hooks/useProposals';
import { LeadKanban } from '@/components/crm/leads/LeadKanban';
import { LeadFormModal } from '@/components/crm/leads/LeadFormModal';
import { LeadDetailModal } from '@/components/crm/leads/LeadDetailModal';
import { CrmDashboard } from '@/components/crm/leads/CrmDashboard';
import { ProposalKanban } from '@/components/proposals/ProposalKanban';
import { ProposalDetailModal } from '@/components/proposals/ProposalDetailModal';
import { ProposalFormModal } from '@/components/proposals/ProposalFormModal';
import { CrmLead, LeadSdrStage, LeadSalesStage, CLASSIFICACAO_CONFIG, SDR_STAGE_CONFIG, SALES_STAGE_CONFIG } from '@/types/leads';
import { Proposal, STAGE_CONFIG } from '@/types/proposals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, LayoutDashboard, Kanban, Filter, Users, TrendingUp, FileText } from 'lucide-react';
import { useModuleActivity } from '@/hooks/useModuleActivity';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type ActiveTab = 'sdr' | 'sales' | 'posVenda' | 'dashboard';

const BRAND = '#1a3a6b';

export default function CRMPage() {
  useModuleActivity('CRM');

  const { leads, isLoading: leadsLoading, createLead, updateLead, moveSdrStage, moveSalesStage, deleteLead } = useLeads();
  const { proposals, isLoading: proposalsLoading, createProposal, updateProposal, moveProposal, deleteProposal } = useProposals();
  const { profile } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('sdr');
  const [view, setView] = useState<'kanban' | 'dashboard'>('kanban');

  // Lead state
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSearch, setLeadSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSdr, setFilterSdr] = useState('all');

  // Proposal state
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [propSearch, setPropSearch] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [checklistSummaries, setChecklistSummaries] = useState<Record<string, { total: number; conforme: number; pendente: number }>>({});

  const { history, interactions, addInteraction, refetch: refetchDetail } = useLeadDetail(selectedLead?.id || null);

  // Fetch checklist summaries
  useEffect(() => {
    if (proposals.length === 0) return;
    const fetchSummaries = async () => {
      const { data } = await supabase.from('proposal_checklist').select('proposal_id, status');
      if (!data) return;
      const summaries: Record<string, { total: number; conforme: number; pendente: number }> = {};
      data.forEach((item: any) => {
        if (!summaries[item.proposal_id]) summaries[item.proposal_id] = { total: 0, conforme: 0, pendente: 0 };
        summaries[item.proposal_id].total++;
        if (item.status === 'conforme') summaries[item.proposal_id].conforme++;
        if (item.status === 'pendente') summaries[item.proposal_id].pendente++;
      });
      setChecklistSummaries(summaries);
    };
    fetchSummaries();
  }, [proposals]);

  // Filtered leads
  const sdrLeads = useMemo(() => leads.filter(l => {
    if (filterClass !== 'all' && l.classificacao !== filterClass) return false;
    if (filterSdr !== 'all' && l.sdr_responsavel_nome !== filterSdr) return false;
    if (leadSearch) {
      const q = leadSearch.toLowerCase();
      return l.nome.toLowerCase().includes(q) || l.telefone.includes(q) || l.cidade?.toLowerCase().includes(q);
    }
    return true;
  }), [leads, filterClass, filterSdr, leadSearch]);

  const salesLeads = useMemo(() =>
    leads.filter(l => l.sales_stage !== null && l.sales_stage !== undefined).filter(l => {
      if (leadSearch) {
        const q = leadSearch.toLowerCase();
        return l.nome.toLowerCase().includes(q) || l.cidade?.toLowerCase().includes(q);
      }
      return true;
    }),
  [leads, leadSearch]);

  const filteredProposals = useMemo(() => proposals.filter(p => {
    if (filterStage !== 'all' && p.stage !== filterStage) return false;
    if (propSearch) {
      const q = propSearch.toLowerCase();
      return p.nome.toLowerCase().includes(q) || p.corretor?.toLowerCase().includes(q);
    }
    return true;
  }), [proposals, filterStage, propSearch]);

  const sdrOptions = useMemo(() => {
    const s = new Set(leads.map(l => l.sdr_responsavel_nome).filter(Boolean) as string[]);
    return Array.from(s).sort();
  }, [leads]);

  const handleLeadClick = (lead: CrmLead) => setSelectedLead(lead);
  const handleLeadUpdate = async (id: string, data: Partial<CrmLead>) => {
    const ok = await updateLead(id, data);
    if (ok && selectedLead?.id === id) setSelectedLead(prev => prev ? { ...prev, ...data } : null);
    return ok;
  };
  const handleLeadDelete = async (id: string) => {
    const ok = await deleteLead(id);
    if (ok) setSelectedLead(null);
    return ok;
  };
  const handleAssignSales = async (leadId: string, responsavel: string) => {
    await updateLead(leadId, { sales_responsavel_nome: responsavel });
    setSelectedLead(prev => prev ? { ...prev, sales_responsavel_nome: responsavel } : null);
    toast({ title: 'Corretor atribuído', description: `${responsavel} responsável por este lead` });
  };

  const handleProposalUpdate = async (id: string, data: Partial<Proposal>) => {
    const ok = await updateProposal(id, data);
    if (ok && selectedProposal?.id === id) setSelectedProposal(prev => prev ? { ...prev, ...data } : null);
    return ok;
  };

  const tabs: { key: ActiveTab; label: string; icon: any; count?: number }[] = [
    { key: 'sdr', label: 'SDR — Leads', icon: Users, count: leads.length },
    { key: 'sales', label: 'Corretores — Vendas', icon: TrendingUp, count: salesLeads.length },
    { key: 'posVenda', label: 'Pós-Venda', icon: FileText, count: proposals.length },
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BRAND }}>CRM Imobiliário</h1>
            <p className="text-xs text-gray-500 mt-0.5">Lead → Qualificação → Venda → Pós-Venda</p>
          </div>
          {activeTab === 'sdr' && (
            <Button onClick={() => setShowLeadForm(true)} className="flex items-center gap-2 text-white" style={{ backgroundColor: BRAND }}>
              <Plus className="w-4 h-4" /> Novo Lead
            </Button>
          )}
          {activeTab === 'posVenda' && (
            <Button onClick={() => setShowProposalForm(true)} className="flex items-center gap-2 text-white" style={{ backgroundColor: BRAND }}>
              <Plus className="w-4 h-4" /> Nova Proposta
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-5 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
              style={activeTab === t.key ? { backgroundColor: BRAND, color: 'white' } : { color: '#6B7280' }}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.count !== undefined && (
                <span
                  className="text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  style={activeTab === t.key ? { backgroundColor: 'rgba(255,255,255,0.25)', color: 'white' } : { backgroundColor: '#e5e7eb', color: '#374151' }}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* SDR Pipeline */}
        {activeTab === 'sdr' && (
          <>
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar lead…" value={leadSearch} onChange={e => setLeadSearch(e.target.value)} className="pl-9 h-9" />
              </div>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="h-9 w-36">
                  <SelectValue placeholder="Classificação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {Object.entries(CLASSIFICACAO_CONFIG).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.emoji} {v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {sdrOptions.length > 0 && (
                <Select value={filterSdr} onValueChange={setFilterSdr}>
                  <SelectTrigger className="h-9 w-36">
                    <SelectValue placeholder="SDR" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos SDRs</SelectItem>
                    {sdrOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
              {(filterClass !== 'all' || filterSdr !== 'all' || leadSearch) && (
                <button
                  onClick={() => { setFilterClass('all'); setFilterSdr('all'); setLeadSearch(''); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium"
                >
                  <Filter className="w-3.5 h-3.5" /> Limpar
                </button>
              )}
            </div>
            {leadsLoading ? (
              <div className="flex items-center justify-center h-48 text-gray-400">Carregando leads…</div>
            ) : (
              <LeadKanban
                leads={sdrLeads}
                pipeline="sdr"
                onMoveSdr={moveSdrStage}
                onMoveSales={moveSalesStage}
                onCardClick={handleLeadClick}
              />
            )}
          </>
        )}

        {/* Sales Pipeline */}
        {activeTab === 'sales' && (
          <>
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar lead…" value={leadSearch} onChange={e => setLeadSearch(e.target.value)} className="pl-9 h-9" />
              </div>
            </div>
            {salesLeads.length === 0 && !leadsLoading ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
                <TrendingUp className="w-8 h-8 text-gray-300" />
                <p className="text-sm">Nenhum lead qualificado ainda.</p>
                <p className="text-xs">Qualifique leads no pipeline SDR para que apareçam aqui.</p>
              </div>
            ) : (
              <LeadKanban
                leads={salesLeads}
                pipeline="sales"
                onMoveSdr={moveSdrStage}
                onMoveSales={moveSalesStage}
                onCardClick={handleLeadClick}
              />
            )}
          </>
        )}

        {/* Pós-Venda (Proposals) */}
        {activeTab === 'posVenda' && (
          <>
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar proposta…" value={propSearch} onChange={e => setPropSearch(e.target.value)} className="pl-9 h-9" />
              </div>
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="h-9 w-40">
                  <SelectValue placeholder="Etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas etapas</SelectItem>
                  {Object.entries(STAGE_CONFIG).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(filterStage !== 'all' || propSearch) && (
                <button
                  onClick={() => { setFilterStage('all'); setPropSearch(''); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium"
                >
                  <Filter className="w-3.5 h-3.5" /> Limpar
                </button>
              )}
            </div>
            {proposalsLoading ? (
              <div className="flex items-center justify-center h-48 text-gray-400">Carregando propostas…</div>
            ) : (
              <ProposalKanban
                proposals={filteredProposals}
                onMove={moveProposal}
                onCardClick={setSelectedProposal}
                checklistSummaries={checklistSummaries}
              />
            )}
          </>
        )}

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <CrmDashboard leads={leads} />
        )}
      </div>

      {/* Lead modals */}
      <LeadFormModal open={showLeadForm} onClose={() => setShowLeadForm(false)} onSubmit={createLead} />
      <LeadDetailModal
        lead={selectedLead}
        history={history}
        interactions={interactions}
        onClose={() => setSelectedLead(null)}
        onUpdate={handleLeadUpdate}
        onDelete={handleLeadDelete}
        onAddInteraction={addInteraction}
        onAssignSales={handleAssignSales}
      />

      {/* Proposal modals */}
      <ProposalFormModal open={showProposalForm} onClose={() => setShowProposalForm(false)} onSubmit={createProposal} />
      <ProposalDetailModal
        proposal={selectedProposal}
        onClose={() => setSelectedProposal(null)}
        onUpdate={handleProposalUpdate}
        onDelete={deleteProposal}
      />
    </AppLayout>
  );
}
