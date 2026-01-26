import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FileText,
  Upload,
  Trash2,
  Download,
  Loader2,
  File,
  Image as ImageIcon,
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  file_url: string;
  uploaded_by_user_id: string | null;
  created_at: string;
}

interface DocumentsSectionProps {
  propertyId: string;
  documents: Document[];
  onDocumentsChange: () => void;
  canEdit: boolean;
}

export function DocumentsSection({
  propertyId,
  documents,
  onDocumentsChange,
  canEdit,
}: DocumentsSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { profile } = useAuth();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!documentName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Digite um nome para o documento antes de enviar',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${propertyId}/${Date.now()}.${fileExt}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('crm-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('crm-documents')
        .getPublicUrl(fileName);

      // Create document record
      const { error: insertError } = await supabase.from('crm_property_documents').insert({
        property_id: propertyId,
        name: documentName.trim(),
        file_url: urlData.publicUrl,
        uploaded_by_user_id: profile?.id,
      });

      if (insertError) throw insertError;

      toast({ title: 'Documento enviado com sucesso' });
      setDocumentName('');
      onDocumentsChange();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Erro ao enviar documento',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (docId: string, fileUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/');
      const filePath = urlParts.slice(-2).join('/');

      // Delete from storage
      await supabase.storage.from('crm-documents').remove([filePath]);

      // Delete record
      const { error } = await supabase
        .from('crm_property_documents')
        .delete()
        .eq('id', docId);

      if (error) throw error;

      toast({ title: 'Documento removido' });
      onDocumentsChange();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Erro ao remover documento',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      {canEdit && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Adicionar documento
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Nome do documento (ex: Proposta assinada)"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="flex-1 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
            />
            <Button
              variant="outline"
              size="sm"
              disabled={isUploading || !documentName.trim()}
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 gap-2"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Enviar
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          />
          <p className="text-[11px] text-gray-500 mt-2">
            PDF, DOC, DOCX ou imagens (máx. 10MB)
          </p>
        </div>
      )}

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhum documento anexado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                  {getFileIcon(doc.file_url)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <p className="text-[11px] text-gray-500">
                    {format(new Date(doc.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(doc.file_url, '_blank')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Download className="w-4 h-4" />
                </Button>
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc.id, doc.file_url)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
