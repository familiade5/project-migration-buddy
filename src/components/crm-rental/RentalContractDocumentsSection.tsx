import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RentalContract } from '@/types/rental';
import { useToast } from '@/hooks/use-toast';
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
  Upload, 
  FileText, 
  Trash2, 
  Download, 
  Eye,
  Loader2,
  FileCheck,
  ClipboardCheck,
  User,
  Home,
  Shield,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface RentalContractDocument {
  id: string;
  contract_id: string;
  name: string;
  file_url: string;
  document_type: string;
  created_at: string;
  uploaded_by_user_id?: string;
}

interface RentalContractDocumentsSectionProps {
  contract: RentalContract;
}

const documentTypeLabels: Record<string, { label: string; icon: typeof FileText }> = {
  contrato_assinado: { label: 'Contrato Assinado', icon: FileCheck },
  vistoria_entrada: { label: 'Vistoria de Entrada', icon: ClipboardCheck },
  vistoria_saida: { label: 'Vistoria de Saída', icon: ClipboardCheck },
  documento_locatario: { label: 'Documento do Locatário', icon: User },
  documento_fiador: { label: 'Documento do Fiador', icon: Shield },
  comprovante_renda: { label: 'Comprovante de Renda', icon: FileText },
  comprovante_residencia: { label: 'Comprovante de Residência', icon: Home },
  outro: { label: 'Outro Documento', icon: FileText },
};

export function RentalContractDocumentsSection({ contract }: RentalContractDocumentsSectionProps) {
  const [documents, setDocuments] = useState<RentalContractDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('outro');
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [contract.id]);

  const loadDocuments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('rental_contract_documents')
      .select('*')
      .eq('contract_id', contract.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading documents:', error);
    } else {
      setDocuments(data || []);
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${contract.id}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('crm-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('crm-documents')
        .getPublicUrl(fileName);

      // Create document record
      const { error: insertError } = await supabase
        .from('rental_contract_documents')
        .insert({
          contract_id: contract.id,
          name: file.name,
          file_url: urlData.publicUrl,
          document_type: selectedType,
          uploaded_by_user_id: user?.id,
        });

      if (insertError) throw insertError;

      toast({
        title: 'Documento enviado',
        description: 'O documento foi anexado ao contrato.',
      });

      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Erro ao enviar',
        description: 'Não foi possível enviar o documento.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDownload = async (doc: RentalContractDocument) => {
    try {
      // Fetch the file as blob to avoid cross-origin issues
      const response = await fetch(doc.file_url);
      if (!response.ok) throw new Error('Failed to fetch file');
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback: open in new tab
      window.open(doc.file_url, '_blank');
    }
  };

  const handleView = (url: string) => {
    // Use Google Docs viewer as fallback for PDFs to avoid blocking issues
    const isPdf = url.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`, '_blank');
    } else {
      window.open(url, '_blank');
    }
  };

  const handleDelete = async (doc: RentalContractDocument) => {
    try {
      // Extract file path from URL
      const urlParts = doc.file_url.split('/');
      const filePath = urlParts.slice(-2).join('/');

      // Delete from storage
      await supabase.storage
        .from('crm-documents')
        .remove([filePath]);

      // Delete record
      const { error } = await supabase
        .from('rental_contract_documents')
        .delete()
        .eq('id', doc.id);

      if (error) throw error;

      toast({
        title: 'Documento excluído',
        description: 'O documento foi removido do contrato.',
      });

      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o documento.',
        variant: 'destructive',
      });
    }
  };

  const getTypeInfo = (type: string) => {
    return documentTypeLabels[type] || documentTypeLabels.outro;
  };

  // Group documents by type
  const groupedDocuments = documents.reduce((acc, doc) => {
    const type = doc.document_type || 'outro';
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {} as Record<string, RentalContractDocument[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">Anexar Documento</h4>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
          <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder="Tipo de documento" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                {Object.entries(documentTypeLabels).map(([value, { label }]) => (
                  <SelectItem key={value} value={value} className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Label
            htmlFor="doc-upload"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors",
              isUploading 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800"
            )}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isUploading ? 'Enviando...' : 'Escolher arquivo'}
          </Label>
          <Input
            id="doc-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Formatos aceitos: PDF, JPG, PNG, DOC, DOCX
        </p>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Nenhum documento anexado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedDocuments).map(([type, docs]) => {
            const typeInfo = getTypeInfo(type);
            const TypeIcon = typeInfo.icon;
            
            return (
              <div key={type} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <TypeIcon className="w-4 h-4" />
                  <span>{typeInfo.label}</span>
                  <span className="text-gray-400">({docs.length})</span>
                </div>
                <div className="grid gap-2">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(doc.created_at), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(doc.file_url)}
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          title="Baixar"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
