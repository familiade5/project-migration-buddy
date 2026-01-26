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
  ScrollText,
  Gavel,
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  file_url: string;
  uploaded_by_user_id: string | null;
  created_at: string;
}

type QuickUploadType = 'matricula' | 'edital' | null;

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
  const [quickUploadType, setQuickUploadType] = useState<QuickUploadType>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);
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

    await uploadFile(file, documentName.trim());
    setDocumentName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !quickUploadType) return;

    const docName = quickUploadType === 'matricula' 
      ? 'Matrícula do Imóvel' 
      : 'Edital do Leilão';

    await uploadFile(file, docName);
    setQuickUploadType(null);
    if (quickFileInputRef.current) {
      quickFileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File, name: string) => {
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
        name: name,
        file_url: urlData.publicUrl,
        uploaded_by_user_id: profile?.id,
      });

      if (insertError) throw insertError;

      toast({ title: 'Documento enviado com sucesso' });
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

  const getFileIcon = (fileName: string, docName?: string) => {
    // Check for special document types
    if (docName) {
      if (docName.toLowerCase().includes('matrícula')) {
        return <ScrollText className="w-4 h-4" />;
      }
      if (docName.toLowerCase().includes('edital')) {
        return <Gavel className="w-4 h-4" />;
      }
    }
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const triggerQuickUpload = (type: QuickUploadType) => {
    setQuickUploadType(type);
    setTimeout(() => {
      quickFileInputRef.current?.click();
    }, 100);
  };

  // Check if documents already exist
  const hasMatricula = documents.some(d => d.name.toLowerCase().includes('matrícula'));
  const hasEdital = documents.some(d => d.name.toLowerCase().includes('edital'));

  return (
    <div className="space-y-4">
      {/* Quick Upload Buttons - Matrícula e Edital */}
      {canEdit && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => triggerQuickUpload('matricula')}
            className={`flex-1 gap-2 transition-all ${
              hasMatricula 
                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isUploading && quickUploadType === 'matricula' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ScrollText className="w-4 h-4" />
            )}
            {hasMatricula ? 'Atualizar Matrícula' : 'Anexar Matrícula'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => triggerQuickUpload('edital')}
            className={`flex-1 gap-2 transition-all ${
              hasEdital 
                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isUploading && quickUploadType === 'edital' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Gavel className="w-4 h-4" />
            )}
            {hasEdital ? 'Atualizar Edital' : 'Anexar Edital'}
          </Button>
          <input
            ref={quickFileInputRef}
            type="file"
            className="hidden"
            onChange={handleQuickUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          />
        </div>
      )}

      {/* Regular Upload Section */}
      {canEdit && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Adicionar outro documento
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
              {isUploading && !quickUploadType ? (
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
          {documents.map((doc) => {
            const isMatricula = doc.name.toLowerCase().includes('matrícula');
            const isEdital = doc.name.toLowerCase().includes('edital');
            const isSpecial = isMatricula || isEdital;
            
            return (
              <div
                key={doc.id}
                className={`flex items-center justify-between rounded-lg p-3 border transition-colors ${
                  isSpecial 
                    ? 'bg-gray-900 border-gray-800 hover:border-gray-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${
                    isSpecial ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {getFileIcon(doc.file_url, doc.name)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isSpecial ? 'text-white' : 'text-gray-900'
                    }`}>
                      {doc.name}
                    </p>
                    <p className={`text-[11px] ${isSpecial ? 'text-gray-400' : 'text-gray-500'}`}>
                      {format(new Date(doc.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.file_url, '_blank')}
                    className={isSpecial ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700'}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc.id, doc.file_url)}
                      className={isSpecial ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800' : 'text-gray-500 hover:text-red-600'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
