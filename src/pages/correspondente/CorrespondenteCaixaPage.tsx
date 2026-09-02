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
import { CX_DOC_TYPES, CX_CHECKLIST, CX_DOC_LABEL, CxClient } from '@/types/correspondente';
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
} from 'lucide-react';

const BRAND = '#1a3a6b';

export default function CorrespondenteCaixaPage() {
  const { clients, isLoading, createClient, deleteClient } = useCxClients();
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

  const { documents, uploadDocument, deleteDocument, openDocument, retryExtraction } =
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
      <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl" style={{ backgroundColor: '#EEF2FF' }}>
            <Landmark className="w-6 h-6" style={{ color: BRAND }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Correspondente Caixa</h1>
            <p className="text-sm text-gray-500">
              Envie a documentação do cliente e copie os dados prontos para o SICAQ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Clients list */}
          <aside className="bg-white rounded-2xl border border-gray-200 p-4 h-fit">
            <Button
              className="w-full text-white mb-3"
              style={{ backgroundColor: BRAND }}
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Novo cliente
            </Button>

            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cliente…"
                className="pl-9 bg-white border-gray-200"
              />
            </div>

            {isLoading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Nenhum cliente cadastrado</p>
            ) : (
              <div className="space-y-1.5 max-h-[70vh] overflow-y-auto">
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl border transition-colors"
                    style={
                      c.id === selectedId
                        ? { backgroundColor: '#EEF2FF', borderColor: '#C7D4F0' }
                        : { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }
                    }
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">{c.full_name}</p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {c.phone || c.whatsapp || c.email || 'Sem contato'}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </aside>

          {/* Detail */}
          <section className="space-y-5">
            {!selected ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <UserRound className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Selecione um cliente</p>
                <p className="text-sm text-gray-400">
                  ou crie um novo para começar a enviar os documentos
                </p>
              </div>
            ) : (
              <>
                {/* Contact */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selected.full_name}</h2>
                      <p className="text-xs text-gray-500">Informações de contato</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-red-600"
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
                  <div className="grid gap-2 sm:grid-cols-2">
                    <CopyField label="Nome" value={selected.full_name} />
                    {selected.email && <CopyField label="E-mail" value={selected.email} />}
                    {selected.phone && <CopyField label="Telefone" value={selected.phone} />}
                    {selected.whatsapp && <CopyField label="WhatsApp" value={selected.whatsapp} />}
                  </div>
                  {selected.notes && (
                    <p className="mt-3 text-sm text-gray-600 whitespace-pre-wrap">{selected.notes}</p>
                  )}
                </div>

                {/* Checklist + upload */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Documentação</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {CX_CHECKLIST.map((t) => {
                        const ok = receivedTypes.has(t);
                        return (
                          <span
                            key={t}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1 ${
                              ok
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}
                          >
                            {ok && <Check className="w-3 h-3" />}
                            {CX_DOC_LABEL(t)}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                    <div className="flex-1">
                      <Label className="text-xs text-gray-600">Tipo do documento</Label>
                      <Select value={docType} onValueChange={setDocType}>
                        <SelectTrigger className="mt-1 bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {CX_DOC_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="text-white"
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
                  <p className="text-xs text-gray-400">
                    Imagens ou PDF (até 25MB). Vários arquivos do mesmo tipo podem ser enviados juntos —
                    ex.: os 3 últimos contracheques.
                  </p>
                </div>

                {/* Extracted documents */}
                <div className="space-y-4">
                  {documents.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-500">
                      Nenhum documento enviado ainda.
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <CxDocumentCard
                        key={doc.id}
                        doc={doc}
                        onOpen={openDocument}
                        onDelete={deleteDocument}
                        onRetry={retryExtraction}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Novo cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600">Nome *</Label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Nome completo"
                className="mt-1 bg-white border-gray-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600">Telefone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="mt-1 bg-white border-gray-200"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">WhatsApp</Label>
                <Input
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="mt-1 bg-white border-gray-200"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-600">E-mail</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="cliente@email.com"
                className="mt-1 bg-white border-gray-200"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Observações</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="mt-1 bg-white border-gray-200"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="text-white"
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
