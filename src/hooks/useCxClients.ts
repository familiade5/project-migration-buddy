import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CxClient, CxDocument, CxExtraction } from '@/types/correspondente';

type ClientInput = {
  full_name: string;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  notes?: string | null;
};

export function useCxClients() {
  const [clients, setClients] = useState<CxClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('cx_clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Erro ao carregar clientes', { description: error.message });
    } else {
      setClients((data || []) as unknown as CxClient[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = useCallback(async (input: ClientInput) => {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('cx_clients')
      .insert({ ...input, created_by_user_id: userData.user?.id ?? null })
      .select()
      .single();
    if (error) {
      toast.error('Erro ao criar cliente', { description: error.message });
      return null;
    }
    toast.success('Cliente criado');
    await fetchClients();
    return data as unknown as CxClient;
  }, [fetchClients]);

  const updateClient = useCallback(async (id: string, input: Partial<ClientInput>) => {
    const { error } = await supabase.from('cx_clients').update(input).eq('id', id);
    if (error) {
      toast.error('Erro ao salvar', { description: error.message });
      return false;
    }
    await fetchClients();
    return true;
  }, [fetchClients]);

  const deleteClient = useCallback(async (id: string) => {
    const { error } = await supabase.from('cx_clients').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao excluir', { description: error.message });
      return false;
    }
    toast.success('Cliente excluído');
    await fetchClients();
    return true;
  }, [fetchClients]);

  return { clients, isLoading, fetchClients, createClient, updateClient, deleteClient };
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });

export function useCxDocuments(clientId: string | null) {
  const [documents, setDocuments] = useState<CxDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!clientId) {
      setDocuments([]);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from('cx_documents')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Erro ao carregar documentos', { description: error.message });
    } else {
      setDocuments((data || []) as unknown as CxDocument[]);
    }
    setIsLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const extractDocument = useCallback(async (doc: CxDocument, file: File) => {
    await supabase.from('cx_documents').update({ status: 'processing', error_message: null }).eq('id', doc.id);
    await fetchDocuments();
    try {
      const base64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke('extract-client-document', {
        body: {
          fileBase64: base64,
          mimeType: file.type,
          fileName: file.name,
          docType: doc.doc_type,
        },
      });
      if (error) throw new Error(error.message);
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);

      const extraction = (data as { data: CxExtraction }).data;
      await supabase
        .from('cx_documents')
        .update({ status: 'done', extracted: extraction as never, error_message: null })
        .eq('id', doc.id);
      toast.success('Documento lido com sucesso');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro na leitura';
      await supabase.from('cx_documents').update({ status: 'error', error_message: message }).eq('id', doc.id);
      toast.error('Erro ao ler documento', { description: message });
    }
    await fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = useCallback(async (file: File, docType: string) => {
    if (!clientId) return;
    const { data: userData } = await supabase.auth.getUser();
    const ext = file.name.split('.').pop() || 'bin';
    const path = `${clientId}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('correspondente-docs')
      .upload(path, file, { contentType: file.type || undefined });
    if (upErr) {
      toast.error('Erro ao enviar arquivo', { description: upErr.message });
      return;
    }

    const { data, error } = await supabase
      .from('cx_documents')
      .insert({
        client_id: clientId,
        doc_type: docType,
        file_name: file.name,
        file_path: path,
        mime_type: file.type || null,
        status: 'processing',
        uploaded_by_user_id: userData.user?.id ?? null,
      })
      .select()
      .single();

    if (error) {
      toast.error('Erro ao registrar documento', { description: error.message });
      return;
    }

    await fetchDocuments();
    await extractDocument(data as unknown as CxDocument, file);
  }, [clientId, fetchDocuments, extractDocument]);

  const deleteDocument = useCallback(async (doc: CxDocument) => {
    await supabase.storage.from('correspondente-docs').remove([doc.file_path]);
    const { error } = await supabase.from('cx_documents').delete().eq('id', doc.id);
    if (error) {
      toast.error('Erro ao excluir documento', { description: error.message });
      return;
    }
    toast.success('Documento excluído');
    await fetchDocuments();
  }, [fetchDocuments]);

  const openDocument = useCallback(async (doc: CxDocument) => {
    const { data, error } = await supabase.storage
      .from('correspondente-docs')
      .createSignedUrl(doc.file_path, 3600);
    if (error || !data?.signedUrl) {
      toast.error('Não foi possível abrir o arquivo');
      return;
    }
    window.open(data.signedUrl, '_blank');
  }, []);

  const downloadDocument = useCallback(async (doc: CxDocument) => {
    const { data, error } = await supabase.storage
      .from('correspondente-docs')
      .download(doc.file_path);
    if (error || !data) {
      toast.error('Não foi possível baixar o arquivo');
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.file_name || 'documento';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, []);

  const retryExtraction = useCallback(async (doc: CxDocument) => {
    const { data, error } = await supabase.storage
      .from('correspondente-docs')
      .download(doc.file_path);
    if (error || !data) {
      toast.error('Não foi possível baixar o arquivo para reprocessar');
      return;
    }
    const file = new File([data], doc.file_name, { type: doc.mime_type || data.type });
    await extractDocument(doc, file);
  }, [extractDocument]);

  return {
    documents,
    isLoading,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    openDocument,
    downloadDocument,
    retryExtraction,
  };
}
