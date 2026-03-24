import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useProposals } from '@/hooks/useProposals';
import { ProposalKanban } from '@/components/proposals/ProposalKanban';
import { ProposalDetailModal } from '@/components/proposals/ProposalDetailModal';
import { ProposalFormModal } from '@/components/proposals/ProposalFormModal';
import { ProposalDashboard } from '@/components/proposals/ProposalDashboard';
import { Proposal, STAGE_CONFIG } from '@/types/proposals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, LayoutDashboard, Kanban, Filter } from 'lucide-react';
import { useModuleActivity } from '@/hooks/useModuleActivity';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

const BRAND_BLUE = '#1a3a6b';

export default function CRMPage() {
  useModuleActivity('CRM');

  const { proposals, isLoading, createProposal, updateProposal, moveProposal, deleteProposal } = useProposals();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<'kanban' | 'dashboard'>('kanban');
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterCorretor, setFilterCorretor] = useState('all');
  const [filterCidade, setFilterCidade] = useState('all');
  const [checklistSummaries, setChecklistSummaries] = useState<Record<string, { total: number; conforme: number; pendente: number }>>({});

  // Fetch checklist summaries for all proposals
  useEffect(() => {
    if (proposals.length === 0) return;
    const fetchSummaries = async () => {
      const { data } = await supabase
        .from('proposal_checklist')
        .select('proposal_id, status');
      
      if (!data) return;
      
      const summaries: Record<string, { total: number; conforme: number; pendente: number }> = {};
      data.forEach((item: any) => {
        if (!summaries[item.proposal_id]) {
          summaries[item.proposal_id] = { total: 0, conforme: 0, pendente: 0 };
        }
        summaries[item.proposal_id].total++;
        if (item.status === 'conforme') summaries[item.proposal_id].conforme++;
        if (item.status === 'pendente') summaries[item.proposal_id].pendente++;
      });
      setChecklistSummaries(summaries);
    };
    fetchSummaries();
  }, [proposals]);

  // Derived filters
  const corretores = useMemo(() => {
    const set = new Set(proposals.map(p => p.corretor).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [proposals]);

  const cidades = useMemo(() => {
    const set = new Set(proposals.map(p => p.cidade).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [proposals]);

  const filteredProposals = useMemo(() => {
    return proposals.filter(p => {
      if (filterStage !== 'all' && p.stage !== filterStage) return false;
      if (filterCorretor !== 'all' && p.corretor !== filterCorretor) return false;
      if (filterCidade !== 'all' && p.cidade !== filterCidade) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.nome.toLowerCase().includes(q) ||
          p.corretor?.toLowerCase().includes(q) ||
          p.cidade?.toLowerCase().includes(q) ||
          p.produto?.toLowerCase().includes(q) ||
          p.imovel?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [proposals, filterStage, filterCorretor, filterCidade, search]);

  const handleCardClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
  };

  const handleUpdate = async (id: string, data: Partial<Proposal>) => {
    const ok = await updateProposal(id, data);
    if (ok && selectedProposal?.id === id) {
      setSelectedProposal(prev => prev ? { ...prev, ...data } : null);
    }
    return ok;
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BRAND_BLUE }}>CRM — Propostas</h1>
            <p className="text-xs text-gray-500 mt-0.5">Acompanhamento de propostas imobiliárias</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            <Plus className="w-4 h-4" />
            Nova Proposta
          </Button>
        </div>

        {/* View toggle + Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setView('kanban')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={view === 'kanban' ? { backgroundColor: BRAND_BLUE, color: 'white' } : { color: '#6B7280' }}
            >
              <Kanban className="w-4 h-4" />
              Kanban
            </button>
            <button
              onClick={() => setView('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={view === 'dashboard' ? { backgroundColor: BRAND_BLUE, color: 'white' } : { color: '#6B7280' }}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar proposta…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Filters */}
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

          {corretores.length > 0 && (
            <Select value={filterCorretor} onValueChange={setFilterCorretor}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="Corretor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos corretores</SelectItem>
                {corretores.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          {cidades.length > 0 && (
            <Select value={filterCidade} onValueChange={setFilterCidade}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas cidades</SelectItem>
                {cidades.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          {/* Active filters badge */}
          {(filterStage !== 'all' || filterCorretor !== 'all' || filterCidade !== 'all' || search) && (
            <button
              onClick={() => { setFilterStage('all'); setFilterCorretor('all'); setFilterCidade('all'); setSearch(''); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100"
            >
              <Filter className="w-3.5 h-3.5" />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            Carregando propostas…
          </div>
        ) : view === 'kanban' ? (
          <ProposalKanban
            proposals={filteredProposals}
            onMove={moveProposal}
            onCardClick={handleCardClick}
            checklistSummaries={checklistSummaries}
          />
        ) : (
          <ProposalDashboard proposals={filteredProposals} checklistSummaries={checklistSummaries} />
        )}
      </div>

      {/* Modals */}
      <ProposalFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={createProposal}
      />

      <ProposalDetailModal
        proposal={selectedProposal}
        onClose={() => setSelectedProposal(null)}
        onUpdate={handleUpdate}
        onDelete={deleteProposal}
      />
    </AppLayout>
  );
}
