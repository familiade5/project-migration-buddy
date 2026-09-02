import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useCxDocuments } from '@/hooks/useCxClients';
import {
  CX_CHECKLIST,
  CX_DOC_LABEL,
  CX_DOC_TYPES,
  CX_STATUS_INFO,
  CxClient,
} from '@/types/correspondente';
import { toast } from 'sonner';
import {
  Camera,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Landmark,
  Loader2,
  LogOut,
  Plus,
  Send,
  Trash2,
  Upload,
  UserRound,
  Users,
} from 'lucide-react';

const BRAND = '#1a3a6b';

const TIPS = [
  'Envie fotos ou PDF nítidos, com os quatro cantos do documento visíveis.',
  'Não cubra o documento com os dedos ou com a mão.',
  'Evite sombras, reflexos e flash direto sobre o papel.',
  'Coloque o documento sobre uma superfície plana e de cor contrastante.',
  'Se o documento tiver frente e verso, envie os dois lados.',
];

export default function PortalDashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState<CxClient[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // onboarding
  const [form, setForm] = useState({ full_name: '', phone: '', whatsapp: '' });
  const [saving, setSaving] = useState(false);

  // add person
  const [personOpen, setPersonOpen] = useState(false);
  const [personForm, setPersonForm] = useState({ full_name: '', relationship: 'Cônjuge' });

  const [docType, setDocType] = useState('rg');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const holder = people.find((p) => !p.parent_client_id) ?? null;
  const selected = people.find((p) => p.id === selectedId) ?? holder;

  const { documents, uploadDocument, deleteDocument, openDocument, isLoading: docsLoading } =
    useCxDocuments(selected?.id ?? null);

  const loadPeople = useCallback(async (uid: string) => {
    const { data: mine } = await supabase
      .from('cx_clients')
      .select('*')
      .eq('portal_user_id', uid)
      .maybeSingle();

    if (!mine) {
      setPeople([]);
      return null;
    }
    const { data: deps } = await supabase
      .from('cx_clients')
      .select('*')
      .eq('parent_client_id', (mine as { id: string }).id)
      .order('created_at', { ascending: true });

    const list = [mine as unknown as CxClient, ...((deps || []) as unknown as CxClient[])];
    setPeople(list);
    setSelectedId((cur) => cur ?? list[0].id);
    return list[0];
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const session = data.session;
      // Exige sessão de cliente do portal: sessões da equipe não veem dados aqui.
      if (!session || session.user.user_metadata?.portal_client !== true) {
        navigate('/portal/auth', { replace: true });
        return;
      }
      setUserId(session.user.id);
      setUserEmail(session.user.email || '');
      setForm((f) => ({
        ...f,
        full_name: (session.user.user_metadata?.full_name as string) || '',
      }));
      await loadPeople(session.user.id);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [navigate, loadPeople]);

  const handleCreateProfile = async () => {
    if (!userId || !form.full_name.trim()) {
      toast.error('Informe seu nome completo');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('cx_clients').insert({
      full_name: form.full_name.trim(),
      email: userEmail || null,
      phone: form.phone.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      portal_user_id: userId,
      submission_status: 'rascunho',
    });
    setSaving(false);
    if (error) {
      toast.error('Erro ao criar cadastro', { description: error.message });
      return;
    }
    toast.success('Cadastro criado! Agora envie seus documentos.');
    await loadPeople(userId);
  };

  const handleAddPerson = async () => {
    if (!holder || !personForm.full_name.trim()) return;
    const { error } = await supabase.from('cx_clients').insert({
      full_name: personForm.full_name.trim(),
      parent_client_id: holder.id,
      relationship: personForm.relationship,
      submission_status: 'rascunho',
    });
    if (error) {
      toast.error('Erro ao adicionar pessoa', { description: error.message });
      return;
    }
    setPersonOpen(false);
    setPersonForm({ full_name: '', relationship: 'Cônjuge' });
    if (userId) await loadPeople(userId);
    toast.success('Pessoa adicionada');
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      await uploadDocument(file, docType);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmitForReview = async () => {
    if (!holder) return;
    const ids = people.map((p) => p.id);
    const { error } = await supabase
      .from('cx_clients')
      .update({ submission_status: 'enviado', submitted_at: new Date().toISOString() })
      .in('id', ids);
    if (error) {
      toast.error('Erro ao enviar', { description: error.message });
      return;
    }
    toast.success('Documentação enviada para análise!');
    if (userId) await loadPeople(userId);
  };

  const status = CX_STATUS_INFO(holder?.submission_status);
  const receivedTypes = useMemo(() => new Set(documents.map((d) => d.doc_type)), [documents]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/portal/auth', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: BRAND }}>
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-tight">Portal do Cliente</p>
              <p className="text-xs text-slate-500">{userEmail}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-500" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {!holder ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-lg mx-auto space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Vamos começar</h2>
              <p className="text-sm text-slate-500">Confirme seus dados para abrir seu processo.</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-600">Nome completo</Label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="mt-1 bg-white border-slate-200 text-slate-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-600">Telefone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="mt-1 bg-white border-slate-200 text-slate-900"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-600">WhatsApp</Label>
                <Input
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="mt-1 bg-white border-slate-200 text-slate-900"
                />
              </div>
            </div>
            <Button
              className="w-full text-white hover:opacity-90"
              style={{ backgroundColor: BRAND }}
              disabled={saving}
              onClick={handleCreateProfile}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Continuar
            </Button>
          </div>
        ) : (
          <>
            {/* Status */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center ${status.bg}`}>
                    {holder.submission_status === 'aprovado' ? (
                      <CheckCircle2 className={`w-5 h-5 ${status.color}`} />
                    ) : (
                      <Clock className={`w-5 h-5 ${status.color}`} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Situação do seu processo</p>
                    <p className={`text-lg font-bold ${status.color}`}>{status.label}</p>
                  </div>
                </div>
                <Button
                  className="text-white hover:opacity-90"
                  style={{ backgroundColor: BRAND }}
                  onClick={handleSubmitForReview}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar para análise
                </Button>
              </div>
              {holder.review_notes && (
                <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-1">
                    Retorno da nossa equipe
                  </p>
                  <p className="text-sm text-amber-900 whitespace-pre-wrap">{holder.review_notes}</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4" style={{ color: BRAND }} />
                Como enviar seus documentos
              </h3>
              <ul className="space-y-2">
                {TIPS.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* People */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: BRAND }} />
                  Pessoas do processo
                </h3>
                <Button size="sm" variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900" onClick={() => setPersonOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Adicionar pessoa
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {people.map((p) => {
                  const active = p.id === selected?.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={`px-3 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
                        active
                          ? 'text-white border-transparent'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                      style={active ? { backgroundColor: BRAND } : undefined}
                    >
                      <UserRound className="w-4 h-4" />
                      {p.full_name}
                      {p.relationship && (
                        <span className={`text-[10px] ${active ? 'text-white/70' : 'text-slate-400'}`}>
                          {p.relationship}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400">
                Casado(a)? Adicione seu cônjuge para enviar também a documentação dele(a).
              </p>
            </div>

            {/* Upload */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: BRAND }} />
                  Documentos de {selected?.full_name}
                </h3>
                <span className="text-xs text-slate-500">
                  {receivedTypes.size}/{CX_CHECKLIST.length} enviados
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CX_CHECKLIST.map((t) => {
                  const ok = receivedTypes.has(t);
                  return (
                    <span
                      key={t}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1 ${
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

              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                <div className="flex-1">
                  <Label className="text-xs font-semibold text-slate-600">Tipo do documento</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger className="mt-1 bg-white border-slate-200 text-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                      {CX_DOC_TYPES.map((t) => (
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

              {docsLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                </div>
              ) : documents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                  <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Nenhum documento enviado ainda</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {CX_DOC_LABEL(doc.doc_type)}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{doc.file_name}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                          Recebido
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white h-8 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          onClick={() => openDocument(doc)}
                        >
                          Visualizar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-slate-400 hover:text-red-600"
                          onClick={() => deleteDocument(doc)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Dialog open={personOpen} onOpenChange={setPersonOpen}>
        <DialogContent className="bg-white border-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Adicionar pessoa</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold text-slate-600">Nome completo</Label>
              <Input
                value={personForm.full_name}
                onChange={(e) => setPersonForm({ ...personForm, full_name: e.target.value })}
                className="mt-1 bg-white border-slate-200 text-slate-900"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-600">Parentesco</Label>
              <Select
                value={personForm.relationship}
                onValueChange={(v) => setPersonForm({ ...personForm, relationship: v })}
              >
                <SelectTrigger className="mt-1 bg-white border-slate-200 text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-900">
                  {['Cônjuge', 'Companheiro(a)', 'Composição de renda', 'Outro'].map((r) => (
                    <SelectItem key={r} value={r} className="text-slate-900">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900" onClick={() => setPersonOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="text-white hover:opacity-90"
              style={{ backgroundColor: BRAND }}
              onClick={handleAddPerson}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
