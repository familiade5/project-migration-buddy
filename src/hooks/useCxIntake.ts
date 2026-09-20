import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CxClient, CxExtraction } from '@/types/correspondente';
import { consolidateProfile, CxProfileData, formatCpf, matchClient, profileFromExtraction } from '@/lib/cxProfile';
import { logCxClientEvent } from './useCxClientEvents';

export type CxIntakeStatus = 'aguardando' | 'lendo' | 'vinculando' | 'ok' | 'erro';

export interface CxIntakeItem {
  id: string;
  fileName: string;
  docType: string;
  status: CxIntakeStatus;
  clientId?: string;
  clientName?: string;
  created?: boolean;
  message?: string;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });

/** Descobre o tipo do documento a partir do que a IA identificou. */
const guessDocType = (extraction: CxExtraction | null, fallback: string) => {
  const raw = (extraction?.documentType || '').toLowerCase();
  if (!raw) return fallback;
  if (raw.includes('cnh') || raw.includes('identidade') || raw.includes('rg')) return 'rg';
  if (raw.includes('certid')) return 'certidao';
  if (raw.includes('contrachequ') || raw.includes('holerite')) return 'contracheque';
  if (raw.includes('recibo')) return 'recibo_ir';
  if (raw.includes('imposto') || raw.includes('irpf')) return 'imposto_renda';
  if (raw.includes('ctps') || raw.includes('carteira de trabalho')) return 'ctps';
  if (raw.includes('fgts')) return 'extrato_fgts';
  if (raw.includes('extrato')) return 'extrato_bancario';
  if (raw.includes('matr')) return 'matricula_imovel';
  if (raw.includes('resid') || raw.includes('energia') || raw.includes('água') || raw.includes('agua')) {
    return 'comprovante_residencia';
  }
  if (raw.includes('cpf')) return 'cpf';
  return fallback;
};

const PROFILE_KEYS: (keyof CxProfileData)[] = [
  'cpf',
  'rg',
  'birth_date',
  'mother_name',
  'marital_status',
  'profession',
  'employer',
  'address',
  'neighborhood',
  'city',
  'state',
  'zip_code',
  'monthly_income',
];

/** Preenche na ficha do cliente apenas o que ainda está em branco. */
async function applyProfile(client: CxClient, profile: CxProfileData) {
  const patch: Record<string, unknown> = {};
  for (const key of PROFILE_KEYS) {
    const current = (client as unknown as Record<string, unknown>)[key];
    const next = profile[key];
    if ((current == null || current === '') && next != null && next !== '') {
      patch[key] = key === 'cpf' ? formatCpf(String(next)) : next;
    }
  }
  if (Object.keys(patch).length === 0) return [];
  patch.profile = { ...(client.profile || {}), ...patch } as never;
  patch.profile_updated_at = new Date().toISOString();
  await supabase.from('cx_clients').update(patch).eq('id', client.id);
  return Object.keys(patch).filter((k) => k !== 'profile' && k !== 'profile_updated_at');
}

interface IntakeArgs {
  clients: CxClient[];
  refreshClients: () => Promise<void> | void;
}

export function useCxIntake({ clients, refreshClients }: IntakeArgs) {
  const [items, setItems] = useState<CxIntakeItem[]>([]);
  const [running, setRunning] = useState(false);

  const patchItem = (id: string, patch: Partial<CxIntakeItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const clear = useCallback(() => setItems([]), []);

  const processFiles = useCallback(
    async (files: File[], docTypeHint: string): Promise<{ clientId: string; created: boolean }[]> => {
      const results: { clientId: string; created: boolean }[] = [];
      if (files.length === 0) return results;
      const queued: CxIntakeItem[] = files.map((f) => ({
        id: crypto.randomUUID(),
        fileName: f.name,
        docType: docTypeHint,
        status: 'aguardando',
      }));
      setItems((prev) => [...queued, ...prev]);
      setRunning(true);

      // Lista local para que dois arquivos da mesma pessoa caiam no mesmo cliente.
      let pool = [...clients];

      for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx];
        const item = queued[idx];
        try {
          patchItem(item.id, { status: 'lendo' });
          const base64 = await fileToBase64(file);
          const { data, error } = await supabase.functions.invoke('extract-client-document', {
            body: {
              fileBase64: base64,
              mimeType: file.type,
              fileName: file.name,
              docType: docTypeHint === 'auto' ? 'outro' : docTypeHint,
            },
          });
          if (error) throw new Error(error.message);
          if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);

          const extraction = (data as { data: CxExtraction }).data;
          const profile = profileFromExtraction(extraction);
          const docType = guessDocType(extraction, docTypeHint === 'auto' ? 'outro' : docTypeHint);

          patchItem(item.id, { status: 'vinculando', docType });

          let client = matchClient(pool, profile);
          let created = false;

          if (!client) {
            if (!profile.full_name) {
              throw new Error('Não foi possível identificar o nome do cliente neste documento.');
            }
            const { data: userData } = await supabase.auth.getUser();
            const { data: newClient, error: cErr } = await supabase
              .from('cx_clients')
              .insert({
                full_name: profile.full_name,
                cpf: profile.cpf ? formatCpf(profile.cpf) : null,
                created_by_user_id: userData.user?.id ?? null,
              })
              .select()
              .single();
            if (cErr) throw new Error(cErr.message);
            client = newClient as unknown as CxClient;
            created = true;
            pool = [client, ...pool];
            await logCxClientEvent(client.id, {
              kind: 'cliente',
              title: 'Cliente criado automaticamente',
              description: `Identificado pela leitura de ${file.name}.`,
            });
          }

          const ext = file.name.split('.').pop() || 'bin';
          const path = `${client.id}/${crypto.randomUUID()}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from('correspondente-docs')
            .upload(path, file, { contentType: file.type || undefined });
          if (upErr) throw new Error(upErr.message);

          const { data: userData2 } = await supabase.auth.getUser();
          const { error: dErr } = await supabase.from('cx_documents').insert({
            client_id: client.id,
            doc_type: docType,
            file_name: file.name,
            file_path: path,
            mime_type: file.type || null,
            status: 'done',
            extracted: extraction as never,
            uploaded_by_user_id: userData2.user?.id ?? null,
          });
          if (dErr) throw new Error(dErr.message);

          const filled = await applyProfile(client, profile);
          await logCxClientEvent(client.id, {
            kind: 'documento',
            title: 'Documento anexado e lido',
            description: filled.length
              ? `${file.name} — dados preenchidos automaticamente: ${filled.length} campo(s).`
              : file.name,
            metadata: { docType, fileName: file.name },
          });

          patchItem(item.id, {
            status: 'ok',
            clientId: client.id,
            clientName: client.full_name,
            created,
            message: created ? 'Novo cliente criado' : 'Anexado ao cliente existente',
          });
        } catch (e) {
          patchItem(item.id, {
            status: 'erro',
            message: e instanceof Error ? e.message : 'Falha ao processar o arquivo',
          });
        }
      }

      setRunning(false);
      await refreshClients();
      toast.success('Leitura concluída', { description: 'Os documentos foram organizados por cliente.' });
    },
    [clients, refreshClients],
  );

  return { items, running, processFiles, clear };
}

export { consolidateProfile };
