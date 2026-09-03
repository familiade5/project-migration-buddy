import { useEffect, useMemo, useRef, useState } from 'react';
import { CxShell } from '@/components/correspondente/CxShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCxClients, useCxDocuments } from '@/hooks/useCxClients';
import { CX_DOC_TYPES, CX_CHECKLIST, CX_DOC_LABEL, CX_SUBMISSION_STATUS, CxClient, CxDocument } from '@/types/correspondente';
import { CxDocumentWorkspace } from '@/components/correspondente/CxDocumentWorkspace';
import { cxConsolidateBankStatements, cxCoverageWarning, cxFormatBRL } from '@/lib/cxIncome';
import { CopyField } from '@/components/correspondente/CopyField';
import {
  Plus,
  Search,
  Upload,
  Loader2,
  UserRound,
  Trash2,
  Check,
  Landmark,
  Calendar,
  FileText,
  AlertCircle,
  Inbox,
  Users,
  Clock,
  Link2,
  Copy,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { toast } from 'sonner';

const BRAND = '#1a3a6b';

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

type ClientStatus = { label: string; color: string; bg: string };

function getClientStatus(client: CxClient, docs: CxDocument[]): ClientStatus {
  if (docs.length === 0) {
    return { label: 'Pendente', color: 'text-amber-600', bg: 'bg-amber-50' };
  }
  const hasError = docs.some((d) => d.status === 'error');
  const hasProcessing = docs.some((d) => d.status === 'processing');
  const received = new Set(docs.map((d) => d.doc_type));
  const complete = CX_CHECKLIST.every((t) => received.has(t));
  if (hasError) return { label: 'Atenção', color: 'text-red-600', bg: 'bg-red-50' };
  if (hasProcessing) return { label: 'Em análise', color: 'text-blue-600', bg: 'bg-blue-50' };
  if (complete) return { label: 'Concluído', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  return { label: 'Pendente', color: 'text-amber-600', bg: 'bg-amber-50' };
}

export default function CorrespondenteCaixaPage() {
  const { clients, isLoading, createClient, updateClient, deleteClient } = useCxClients();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', whatsapp: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const [docType, setDocType] = useState<string>('rg');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  const [listOpen, setListOpen] = useState(true);
  const PORTAL_BASE_URL = 'https://postgen.fixaapp.com.br';

  const selected: CxClient | null = useMemo(
    () => clients.find((c) => c.id === selectedId) ?? null,
    [clients, selectedId],
  );

  const portalUrl = selected?.portal_token
    ? `${PORTAL_BASE_URL}/portal/convite/${selected.portal_token}`
    : '';

  const copyPortalLink = () => {
    if (!portalUrl) {
      toast.error('Selecione um cliente para gerar o link exclusivo.');
      return;
    }
    navigator.clipboard.writeText(portalUrl);
    toast.success('Link exclusivo copiado! Envie para este cliente.');
  };


  const { documents, uploadDocument, deleteDocument, openDocument, downloadDocument, retryExtraction, updateExtraction } =
    useCxDocuments(selected?.id ?? null);
  const income = cxConsolidateBankStatements(documents);
  const incomeWarning = cxCoverageWarning(income);

  useEffect(() => {
    setReviewNotes(selected?.review_notes || '');
  }, [selected?.id, selected?.review_notes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.email || '').toLowerCase().includes(q),
    );
  }, [clients, search]);

  const stats = useMemo(() => {
    const active = clients.length;
    const pending = clients.filter((c) => {
      const docs = documents.filter((d) => d.client_id === c.id);
      const status = getClientStatus(c, docs);
      return status.label === 'Pendente' || status.label === 'Atenção';
    }).length;
    return { active, pending };
  }, [clients, documents]);

  const selectedStatus = useMemo(
    () => (selected ? getClientStatus(selected, documents) : null),
    [selected, documents],
  );

  const handleCreate = async () => {
    if (!form.full_name.trim()) return;
    setSaving(true);
    const created = await createClient({
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      notes: form.notes.trim() || null,
    });
    setSaving(false);
    if (created) {
      setSelectedId(created.id);
      setDialogOpen(false);
      setForm({ full_name: '', email: '', phone: '', whatsapp: '', notes: '' });
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selected) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      await uploadDocument(file, docType);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const receivedTypes = new Set(documents.map((d) => d.doc_type));

  return (
    <CxShell
      right={
        <>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">{stats.active}</span> clientes
          </div>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-amber-600">{stats.pending}</span> pendentes
          </div>
          <Button
            variant="outline"
            className="bg-white border-slate-200 text-slate-700 hover:text-slate-900"
            onClick={() => setLinkOpen(true)}
          >
            <Link2 className="w-4 h-4 mr-2" style={{ color: BRAND }} />
            <span className="hidden sm:inline">Link para o cliente</span>
          </Button>
        </>
      }
    >
      <div className="h-[calc(100vh-108px)]">
        <div
          className={`grid grid-cols-1 gap-5 h-full transition-all ${
            listOpen ? 'lg:grid-cols-[340px_minmax(0,1fr)]' : 'lg:grid-cols-[64px_minmax(0,1fr)]'
          }`}
        >
          {/* Clients list */}
          {!listOpen ? (
            <aside className="hidden lg:flex bg-white rounded-2xl border border-slate-200 shadow-sm flex-col items-center py-4 gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-slate-500 hover:text-slate-900"
                title="Mostrar lista de clientes"
                onClick={() => setListOpen(true)}
              >
                <PanelLeftOpen className="w-5 h-5" />
              </Button>
              <div className="h-px w-8 bg-slate-200" />
              {filtered.slice(0, 12).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  title={c.full_name}
                  className={`w-10 h-10 rounded-full text-xs font-semibold transition-colors ${
                    c.id === selectedId ? 'bg-[#1a3a6b] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {getInitials(c.full_name)}
                </button>
              ))}
            </aside>
          ) : (
          <aside className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">

            <div className="p-5 border-b border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: BRAND }}>Clientes</h2>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden lg:flex h-8 w-8 p-0 text-slate-400 hover:text-slate-900"
                    title="Recolher lista"
                    onClick={() => setListOpen(false)}
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:opacity-90"
                    style={{ backgroundColor: BRAND }}
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>


              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome ou telefone…"
                  className="pl-9 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b]"
                />
              </div>

              <Button
                className="w-full text-white hover:opacity-90"
                style={{ backgroundColor: BRAND }}
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" /> Novo cliente
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {isLoading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center px-4">
                  <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-medium">
                    {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {search ? 'Tente outro termo de busca' : 'Crie um novo cliente para começar'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((c) => {
                    const clientDocs = documents.filter((d) => d.client_id === c.id);
                    const status = getClientStatus(c, clientDocs);
                    const isSelected = c.id === selectedId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={`w-full text-left p-3 rounded-xl border-l-4 transition-all group ${
                          isSelected
                            ? 'bg-blue-50 border-l-[#1a3a6b] shadow-sm'
                            : 'bg-white border-l-transparent hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-[#1a3a6b] text-white'
                                : 'bg-slate-200 text-slate-600 group-hover:bg-[#1a3a6b] group-hover:text-white'
                            }`}
                          >
                            {getInitials(c.full_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <p className={`text-sm font-semibold truncate ${isSelected ? 'text-[#1a3a6b]' : 'text-slate-900 group-hover:text-[#1a3a6b]'}`}>
                                {c.full_name}
                              </p>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${status.color} ${status.bg}`}>
                                {status.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                              {c.phone || c.whatsapp || c.email || 'Sem contato'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                <Calendar className="w-3 h-3" />
                                {formatDate(c.created_at) || '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
          )}


          {/* Detail */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/50">
                <div className="w-64 h-64 mb-8 relative">
                  <div className="absolute inset-0 bg-blue-100/50 rounded-full animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-32 h-32 text-[#1a3a6b]/15"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#1a3a6b] mb-2">Nenhum cliente selecionado</h2>
                <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                  Selecione um cliente na lista lateral para visualizar detalhes do perfil, contratos ativos e status de operações.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 shadow-sm">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-slate-900">{stats.active}</span> clientes ativos
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 shadow-sm">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-amber-600">{stats.pending}</span> pendentes
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {/* Contact header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#1a3a6b] flex items-center justify-center text-white text-lg font-semibold">
                        {getInitials(selected.full_name)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-xl font-bold text-slate-900">{selected.full_name}</h2>
                          {selectedStatus && (
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedStatus.color} ${selectedStatus.bg}`}>
                              {selectedStatus.label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Cadastrado em {formatDate(selected.created_at) || '—'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-red-600"
                      onClick={async () => {
                        if (confirm(`Excluir ${selected.full_name} e todos os documentos?`)) {
                          await deleteClient(selected.id);
                          setSelectedId(null);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mt-6">
                    <CopyField label="Nome" value={selected.full_name} />
                    {selected.email && <CopyField label="E-mail" value={selected.email} />}
                    {selected.phone && <CopyField label="Telefone" value={selected.phone} />}
                    {selected.whatsapp && <CopyField label="WhatsApp" value={selected.whatsapp} />}
                  </div>
                  {selected.notes && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Observações</p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{selected.notes}</p>
                    </div>
                  )}

                  {/* Retorno para o cliente */}
                  <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status do envio do cliente
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white h-8 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        onClick={copyPortalLink}
                      >
                        Copiar link do portal
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Select
                        value={selected.submission_status || 'rascunho'}
                        onValueChange={(v) =>
                          updateClient(selected.id, {
                            submission_status: v,
                            reviewed_at: new Date().toISOString(),
                          })
                        }
                      >
                        <SelectTrigger className="sm:w-56 bg-white border-slate-200 text-slate-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          {CX_SUBMISSION_STATUS.map((s) => (
                            <SelectItem key={s.value} value={s.value} className="text-slate-900">
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex-1 flex gap-2">
                        <Textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Mensagem para o cliente (ex.: falta o extrato do FGTS)"
                          className="bg-white border-slate-200 text-slate-900 min-h-[42px]"
                        />
                        <Button
                          className="text-white hover:opacity-90 self-start"
                          style={{ backgroundColor: BRAND }}
                          onClick={() =>
                            updateClient(selected.id, {
                              review_notes: reviewNotes || null,
                              reviewed_at: new Date().toISOString(),
                            })
                          }
                        >
                          Salvar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="p-6 space-y-6">
                  {/* Checklist + upload */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#1a3a6b]" />
                        Documentação solicitada
                      </h3>
                      <span className="text-xs text-slate-500">
                        {receivedTypes.size}/{CX_CHECKLIST.length} recebidos
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {CX_CHECKLIST.map((t) => {
                        const ok = receivedTypes.has(t);
                        return (
                          <span
                            key={t}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1 transition-colors ${
                              ok
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-white text-slate-500 border-slate-200'
                            }`}
                          >
                            {ok && <Check className="w-3 h-3" />}
                            {CX_DOC_LABEL(t)}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-end pt-2">
                      <div className="flex-1">
                        <Label className="text-xs font-semibold text-slate-600">Tipo do documento</Label>
                        <Select value={docType} onValueChange={setDocType}>
                          <SelectTrigger className="mt-1 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-200 text-slate-900">
                            {CX_DOC_TYPES.map((t) => (
                              <SelectItem key={t.value} value={t.value} className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        className="text-white hover:opacity-90"
                        style={{ backgroundColor: BRAND }}
                        disabled={uploading}
                        onClick={() => fileRef.current?.click()}
                      >
                        {uploading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        Enviar arquivos
                      </Button>
                      <input
                        ref={fileRef}
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      Imagens ou PDF (até 25MB). Vários arquivos do mesmo tipo podem ser enviados juntos — ex.: os 3 últimos contracheques.
                    </p>
                  </div>

                  {income.bankDocs.length > 0 && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-3">
                      <h3 className="text-sm font-bold text-emerald-900">
                        Renda por extrato bancário — {income.bankDocs.length} extrato(s)
                      </h3>
                      <p className="text-3xl font-extrabold text-emerald-900">{cxFormatBRL(income.monthlyAverage)}</p>
                      <p className="text-xs text-emerald-700">
                        Média mensal consolidada em {income.months.length} mês(es), já descontando PIX/transferências do
                        próprio titular, estornos e resgates ({income.excludedCount} lançamento(s) descartado(s)).
                      </p>
                      {incomeWarning && (
                        <div className="rounded-xl border border-red-300 bg-red-50 p-3">
                          <p className="text-xs font-bold text-red-700">⚠️ Extrato com mês incompleto</p>
                          <p className="text-xs text-red-700 mt-1">{incomeWarning}</p>
                          <p className="text-xs text-red-800 font-semibold mt-1">
                            Média proporcional (por dias cobertos): {cxFormatBRL(income.proRataAverage)}
                          </p>
                        </div>
                      )}
                      <div className="grid gap-2 sm:grid-cols-3">
                        {income.months.map((m) => (
                          <div key={m.key} className="rounded-xl border border-emerald-200 bg-white px-3 py-2">
                            <p className="text-[11px] font-semibold text-slate-500">{m.key}</p>
                            <p className="text-sm font-bold text-slate-900">{cxFormatBRL(m.total)}</p>
                            <p className={`text-[10px] mt-0.5 ${m.complete ? 'text-slate-500' : 'text-red-600 font-semibold'}`}>
                              {m.complete ? 'Mês completo' : `Parcial: dias ${m.firstDay}–${m.lastDay} de ${m.totalDays}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extracted documents */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#1a3a6b]" />
                      Documentos enviados
                    </h3>
                    {documents.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                        <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-600">Nenhum documento enviado ainda</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Envie RG, CPF, contracheques ou outros documentos para extrair os dados
                        </p>
                      </div>
                    ) : (
                      <CxDocumentWorkspace
                        documents={documents}
                        onOpen={openDocument}
                        onDownload={downloadDocument}
                        onDelete={deleteDocument}
                        onRetry={retryExtraction}
                        onUpdateExtraction={updateExtraction}
                      />
                    )}

                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-slate-900 flex items-center gap-2">
              <Link2 className="w-5 h-5" style={{ color: BRAND }} />
              Link do Portal do Cliente
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4 p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Link geral — Área do Cliente
            </p>
            <p className="text-xs text-slate-500">
              Qualquer cliente pode criar o próprio acesso e enviar documentos por este link.
            </p>
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${PORTAL_BASE_URL}/portal/auth`}
                className="bg-white border-slate-200 !text-slate-900 h-9"
                style={{ color: '#0f172a' }}
              />
              <Button
                size="sm"
                className="text-white hover:opacity-90 flex-shrink-0 h-9"
                style={{ backgroundColor: BRAND }}
                onClick={() => {
                  navigator.clipboard.writeText(`${PORTAL_BASE_URL}/portal/auth`);
                  toast.success('Link da área do cliente copiado!');
                }}
              >
                <Copy className="w-4 h-4 mr-2" /> Copiar
              </Button>
            </div>
          </div>
          {!selected ? (

            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Selecione o cliente para gerar o link exclusivo dele.
              </p>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {clients.filter((c) => !c.parent_client_id).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium"
                  >
                    {c.full_name}
                  </button>
                ))}
                {clients.length === 0 && (
                  <p className="text-sm text-slate-500">Nenhum cliente cadastrado ainda.</p>
                )}
              </div>
            </div>
          ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Este link é exclusivo de {selected.full_name} e não deve ser
              repassado a outras pessoas. Com ele o cliente cria o próprio acesso, envia os documentos
              (podendo incluir o cônjuge) e acompanha o status da análise.
            </p>

            <div className="flex gap-2">
              <Input
                readOnly
                value={portalUrl}
                className="bg-slate-50 border-slate-200 !text-slate-900"
                style={{ color: '#0f172a' }}
              />
              <Button
                className="text-white hover:opacity-90 flex-shrink-0"
                style={{ backgroundColor: BRAND }}
                onClick={copyPortalLink}
              >
                <Copy className="w-4 h-4 mr-2" /> Copiar
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full bg-white border-slate-200 text-slate-700 hover:text-slate-900"
              onClick={() => {
                const phone = (selected?.whatsapp || selected?.phone || '').replace(/\D/g, '');
                const text = encodeURIComponent(
                  `Olá${selected ? ` ${selected.full_name.split(' ')[0]}` : ''}! Para dar andamento na sua análise de crédito, acesse o portal e envie seus documentos: ${portalUrl}`,
                );
                const target = phone
                  ? `https://wa.me/55${phone}?text=${text}`
                  : `https://wa.me/?text=${text}`;
                window.open(target, '_blank');
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2 text-emerald-600" />
              {selected?.whatsapp || selected?.phone
                ? `Enviar no WhatsApp para ${selected.full_name.split(' ')[0]}`
                : 'Enviar no WhatsApp'}
            </Button>
          </div>
          )}

        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-slate-200 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-slate-900 flex items-center gap-2">
              <UserRound className="w-5 h-5 text-[#1a3a6b]" />
              Novo cliente
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold text-slate-600">Nome *</Label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Nome completo"
                className="mt-1 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-600">Telefone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="mt-1 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b]"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-600">WhatsApp</Label>
                <Input
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="mt-1 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b]"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-600">E-mail</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="cliente@email.com"
                className="mt-1 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b]"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-600">Observações</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="mt-1 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b]"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="text-white hover:opacity-90"
              style={{ backgroundColor: BRAND }}
              disabled={saving || !form.full_name.trim()}
              onClick={handleCreate}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CxShell>
  );
}
