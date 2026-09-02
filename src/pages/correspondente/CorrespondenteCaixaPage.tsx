import { useMemo, useRef, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
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
import { CX_DOC_TYPES, CX_CHECKLIST, CX_DOC_LABEL, CxClient, CxDocument } from '@/types/correspondente';
import { CxDocumentCard } from '@/components/correspondente/CxDocumentCard';
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
} from 'lucide-react';

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

  const selected: CxClient | null = useMemo(
    () => clients.find((c) => c.id === selectedId) ?? null,
    [clients, selectedId],
  );

  const { documents, uploadDocument, deleteDocument, openDocument, downloadDocument, retryExtraction } =
    useCxDocuments(selected?.id ?? null);

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
    <AppLayout>
      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto h-[calc(100vh-64px)]">
        {/* Page header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50">
              <Landmark className="w-6 h-6" style={{ color: BRAND }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Correspondente Caixa</h1>
              <p className="text-sm text-slate-500">
                Envie a documentação do cliente e copie os dados prontos para o SICAQ
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-900">{stats.active}</span> clientes
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-amber-600">{stats.pending}</span> pendentes
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 h-[calc(100%-88px)]">
          {/* Clients list */}
          <aside className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: BRAND }}>Clientes</h2>
                <Button
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:opacity-90"
                  style={{ backgroundColor: BRAND }}
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
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
                        className="bg-white h-8"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/portal/auth`);
                        }}
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
                          } as Partial<CxClient>)
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
                            } as Partial<CxClient>)
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
                      <div className="space-y-4">
                        {documents.map((doc) => (
                          <CxDocumentCard
                            key={doc.id}
                            doc={doc}
                            onOpen={openDocument}
                            onDownload={downloadDocument}
                            onDelete={deleteDocument}
                            onRetry={retryExtraction}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

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
    </AppLayout>
  );
}
