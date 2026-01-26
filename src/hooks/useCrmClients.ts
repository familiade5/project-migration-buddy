import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CrmClient, CrmClientDocument } from '@/types/client';
import { useToast } from '@/hooks/use-toast';

export function useCrmClients() {
  const [clients, setClients] = useState<CrmClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('crm_clients')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setClients((data as CrmClient[]) || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Erro ao carregar clientes',
        description: 'Não foi possível carregar a lista de clientes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (data: Partial<CrmClient>): Promise<CrmClient | null> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const insertData = {
        full_name: data.full_name || '',
        cpf: data.cpf || null,
        rg: data.rg || null,
        birth_date: data.birth_date || null,
        email: data.email || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        address: data.address || null,
        neighborhood: data.neighborhood || null,
        city: data.city || null,
        state: data.state || 'MS',
        zip_code: data.zip_code || null,
        notes: data.notes || null,
        created_by_user_id: userData.user?.id || null,
      };
      
      const { data: newClient, error } = await supabase
        .from('crm_clients')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      setClients(prev => [...prev, newClient as CrmClient].sort((a, b) => 
        a.full_name.localeCompare(b.full_name)
      ));
      
      toast({
        title: 'Cliente cadastrado',
        description: 'O cliente foi cadastrado com sucesso.',
      });
      
      return newClient as CrmClient;
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: 'Erro ao cadastrar cliente',
        description: 'Não foi possível cadastrar o cliente.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateClient = async (id: string, data: Partial<CrmClient>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('crm_clients')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      
      toast({
        title: 'Cliente atualizado',
        description: 'Os dados do cliente foram atualizados.',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: 'Erro ao atualizar cliente',
        description: 'Não foi possível atualizar o cliente.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('crm_clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setClients(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: 'Cliente excluído',
        description: 'O cliente foi excluído com sucesso.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: 'Erro ao excluir cliente',
        description: 'Não foi possível excluir o cliente.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    clients,
    isLoading,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
}

export function useCrmClientDocuments(clientId: string | null) {
  const [documents, setDocuments] = useState<CrmClientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!clientId) {
      setDocuments([]);
      return;
    }

    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('crm_client_documents')
          .select('*')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDocuments((data as CrmClientDocument[]) || []);
      } catch (error) {
        console.error('Error fetching client documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [clientId]);

  const uploadDocument = async (
    file: File,
    name: string,
    documentType: string
  ): Promise<boolean> => {
    if (!clientId) return false;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('client-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('client-documents')
        .getPublicUrl(fileName);

      const { data: userData } = await supabase.auth.getUser();

      const { data: newDoc, error: insertError } = await supabase
        .from('crm_client_documents')
        .insert({
          client_id: clientId,
          name,
          document_type: documentType,
          file_url: urlData.publicUrl,
          uploaded_by_user_id: userData.user?.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setDocuments(prev => [newDoc as CrmClientDocument, ...prev]);
      
      toast({
        title: 'Documento enviado',
        description: 'O documento foi salvo com sucesso.',
      });
      
      return true;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Erro ao enviar documento',
        description: 'Não foi possível enviar o documento.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteDocument = async (doc: CrmClientDocument): Promise<boolean> => {
    try {
      // Extract path from URL
      const urlParts = doc.file_url.split('/client-documents/');
      if (urlParts[1]) {
        await supabase.storage
          .from('client-documents')
          .remove([urlParts[1]]);
      }

      const { error } = await supabase
        .from('crm_client_documents')
        .delete()
        .eq('id', doc.id);

      if (error) throw error;
      
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      
      toast({
        title: 'Documento excluído',
        description: 'O documento foi excluído com sucesso.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Erro ao excluir documento',
        description: 'Não foi possível excluir o documento.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    documents,
    isLoading,
    uploadDocument,
    deleteDocument,
  };
}
