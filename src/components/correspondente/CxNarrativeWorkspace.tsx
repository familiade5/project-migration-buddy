import { useMemo, useRef, useState } from 'react';
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
import { useCxProperties } from '@/hooks/useCxProperties';
import { useCxClients, useCxDocuments } from '@/hooks/useCxClients';
import {
  CX_PROPERTY_DOC_TYPES,
  CX_PROPERTY_STATUS,
  CX_PROPERTY_STATUS_INFO,
  CxProperty,
} from '@/types/correspondente';
import { CxDocumentWorkspace } from './CxDocumentWorkspace';
import { CopyText, cxCopyToClipboard } from './CopyText';
import { CopyField } from './CopyField';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Upload,
  Loader2,
  Trash2,
  Building2,
  FileText,
  Inbox,
  Calendar,
  Copy,
  UserRound,
} from 'lucide-react';


const BRAND = '#1a3a6b';

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

interface Props {
  header?: React.ReactNode;
}

export function CxNarrativeWorkspace({ header }: Props) {
  const { properties, isLoading, createProperty, updateProperty, deleteProperty } = useCxProperties();
  const { clients } = useCxClients();
  const [selectedId, setSelectedIdState] = useState<string | null>(
    () => localStorage.getItem('cx_narrative_selected') || null,
  );
  const setSelectedId = (id: string | null) => {
    setSelectedIdState(id);
    if (id) localStorage.setItem('cx_narrative_selected', id);
    else localStorage.removeItem('cx_narrative_selected');
  };

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    notes: '',
  });


  const [docType, setDocType] = useState<string>('matricula_imovel');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selected: CxProperty | null = useMemo(
    () => properties.find((p) => p.id === selectedId) ?? null,
    [properties, selectedId],
  );

  const { documents, uploadDocument, deleteDocument, openDocument, downloadDocument, retryExtraction, updateExtraction } =
    useCxDocuments(null, selected?.id ?? null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.address || '').toLowerCase().includes(q) ||
        (p.registration_number || '').toLowerCase().includes(q),
    );
  }, [properties, search]);

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const created = await createProperty({
      name: form.name.trim(),
      notes: form.notes.trim() || null,
    });
    setSaving(false);
    if (created) {
      setSelectedId(created.id);
      setDialogOpen(false);
      setForm({ name: '', notes: '' });
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

  return (
    <div className="grid grid-cols-1 gap-5 h-full lg:grid-cols-[340px_minmax(0,1fr)]">
      {/* Lista de imóveis */}
      <aside className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        {header}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color: BRAND }}>
              Imóveis
            </h2>
            <span className="text-xs text-slate-400 font-medium">{properties.length}</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, endereço ou matrícula…"
              className="pl-9 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1a3a6b]"
            />
          </div>

          <Button
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: BRAND }}
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Adicionar imóvel
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
                {search ? 'Nenhum imóvel encontrado' : 'Nenhum imóvel cadastrado'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {search ? 'Tente outro termo' : 'Adicione um imóvel para iniciar a checagem'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((p) => {
                const st = CX_PROPERTY_STATUS_INFO(p.status);
                const isSelected = p.id === selectedId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left p-3 rounded-xl border-l-4 transition-all group ${
                      isSelected
                        ? 'bg-blue-50 border-l-[#1a3a6b] shadow-sm'
                        : 'bg-white border-l-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#1a3a6b] text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-[#1a3a6b] group-hover:text-white'
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p
                            className={`text-sm font-semibold truncate ${
                              isSelected ? 'text-[#1a3a6b]' : 'text-slate-900 group-hover:text-[#1a3a6b]'
                            }`}
                          >
                            {p.name}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${st.color} ${st.bg}`}
                          >
                            {st.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {p.address || p.registration_number || 'Sem endereço informado'}
                        </p>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-2">
                          <Calendar className="w-3 h-3" />
                          {formatDate(p.created_at) || '—'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Detalhe do imóvel */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/50">
            <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center mb-6">
              <Building2 className="w-12 h-12 text-[#1a3a6b]/40" />
            </div>
            <h2 className="text-2xl font-bold text-[#1a3a6b] mb-2">Checagem de Narrativas</h2>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
              Adicione um imóvel, envie a matrícula (narrativa) e a leitura automática mostra ônus,
              proprietários, averbações, inscrição municipal e uso de FGTS.
            </p>
            <Button
              className="text-white hover:opacity-90"
              style={{ backgroundColor: BRAND }}
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar imóvel
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#1a3a6b] flex items-center justify-center text-white">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                    <CopyText
                      value={selected.name}
                      label="Nome do imóvel"
                      className="text-xl font-bold text-slate-900"
                    />
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selected.address || 'Endereço não informado'}
                    </p>
                  </div>

                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={selected.status || 'em_analise'}
                    onValueChange={(v) => updateProperty(selected.id, { status: v })}
                  >
                    <SelectTrigger className="w-44 bg-white border-slate-200 text-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                      {CX_PROPERTY_STATUS.map((s) => (
                        <SelectItem key={s.value} value={s.value} className="text-slate-900">
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-red-600"
                    onClick={async () => {
                      if (confirm(`Excluir ${selected.name} e os documentos da checagem?`)) {
                        await deleteProperty(selected.id);
                        setSelectedId(null);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 mt-6">
                <div className="sm:col-span-2">
                  <Label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <UserRound className="w-3.5 h-3.5" /> Cliente vinculado
                  </Label>
                  <Select
                    value={selected.client_id || 'none'}
                    onValueChange={(v) =>
                      updateProperty(selected.id, { client_id: v === 'none' ? null : v })
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white border-slate-200 text-slate-900">
                      <SelectValue placeholder="Selecionar cliente" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-900 max-h-72">
                      <SelectItem value="none" className="text-slate-900">
                        Sem cliente vinculado
                      </SelectItem>
                      {clients
                        .filter((c) => !c.parent_client_id)
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id} className="text-slate-900">
                            {c.full_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    O imóvel e a narrativa aparecem na ficha deste cliente.
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-600">Matrícula</Label>
                  <Input
                    defaultValue={selected.registration_number || ''}
                    onBlur={(e) =>
                      updateProperty(selected.id, { registration_number: e.target.value || null })
                    }
                    placeholder="Nº da matrícula"
                    className="mt-1 bg-white border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-600">Cartório</Label>
                  <Input
                    defaultValue={selected.notary_office || ''}
                    onBlur={(e) => updateProperty(selected.id, { notary_office: e.target.value || null })}
                    placeholder="Cartório de registro"
                    className="mt-1 bg-white border-slate-200 text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs font-semibold text-slate-600">Observações</Label>
                  <Textarea
                    defaultValue={selected.notes || ''}
                    onBlur={(e) => updateProperty(selected.id, { notes: e.target.value || null })}
                    placeholder="Anotações da checagem"
                    className="mt-1 bg-white border-slate-200 text-slate-900"
                    rows={2}
                  />
                </div>
              </div>

              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Dados do imóvel — clique para copiar
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-slate-200 text-slate-700 hover:text-slate-900"
                    onClick={async () => {
                      const lines = [
                        `Imóvel: ${selected.name}`,
                        selected.address ? `Endereço: ${selected.address}` : '',
                        selected.registration_number ? `Matrícula: ${selected.registration_number}` : '',
                        selected.notary_office ? `Cartório: ${selected.notary_office}` : '',
                        selected.notes ? `Observações: ${selected.notes}` : '',
                      ].filter(Boolean);
                      await cxCopyToClipboard(lines.join('\n'));
                      toast.success('Dados do imóvel copiados');
                    }}
                  >
                    <Copy className="w-3.5 h-3.5 mr-2" /> Copiar tudo
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <CopyField label="Nome do imóvel" value={selected.name} />
                  {selected.registration_number && (
                    <CopyField label="Matrícula" value={selected.registration_number} />
                  )}
                  {selected.notary_office && <CopyField label="Cartório" value={selected.notary_office} />}
                  {selected.address && <CopyField label="Endereço" value={selected.address} />}
                </div>
              </div>
            </div>


            <div className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1a3a6b]" />
                  Enviar documentos para checagem
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <div className="flex-1">
                    <Label className="text-xs font-semibold text-slate-600">Tipo do documento</Label>
                    <Select value={docType} onValueChange={setDocType}>
                      <SelectTrigger className="mt-1 bg-white border-slate-200 text-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-900">
                        {CX_PROPERTY_DOC_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value} className="text-slate-900">
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
                  Imagens ou PDF (até 25MB). A matrícula pode ter várias páginas — envie todas juntas.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1a3a6b]" />
                  Resultado da checagem
                </h3>
                {documents.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                    <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-600">Nenhum documento enviado ainda</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Envie a matrícula/narrativa para gerar a checagem automática
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-slate-200 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#1a3a6b]" />
              Adicionar imóvel
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold text-slate-600">Nome do imóvel *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex.: Apto 302 – Ed. Vila Real"
                className="mt-1 bg-white border-slate-200 text-slate-900"
              />
            </div>


            <div>
              <Label className="text-xs font-semibold text-slate-600">Observações</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="mt-1 bg-white border-slate-200 text-slate-900"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-white border-slate-200 text-slate-700"
              onClick={() => setDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="text-white hover:opacity-90"
              style={{ backgroundColor: BRAND }}
              disabled={!form.name.trim() || saving}
              onClick={handleCreate}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Criar e enviar documentos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
