import { useState, useRef } from 'react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CrmClientDocument, CLIENT_DOCUMENT_TYPES } from '@/types/client';
import { useCrmClientDocuments } from '@/hooks/useCrmClients';
import {
  Upload,
  File,
  FileImage,
  FileText,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientDocumentsSectionProps {
  clientId: string;
}

export function ClientDocumentsSection({ clientId }: ClientDocumentsSectionProps) {
  const { documents, isLoading, uploadDocument, deleteDocument } = useCrmClientDocuments(clientId);
  const [isUploading, setIsUploading] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('outro');
  const [deleteConfirm, setDeleteConfirm] = useState<CrmClientDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!documentName.trim()) {
      setDocumentName(file.name.split('.')[0]);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !documentName.trim()) return;

    setIsUploading(true);
    try {
      await uploadDocument(file, documentName.trim(), documentType);
      setDocumentName('');
      setDocumentType('outro');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await deleteDocument(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const getFileIcon = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <FileImage className="w-4 h-4 text-blue-500" />;
    }
    if (ext === 'pdf') {
      return <FileText className="w-4 h-4 text-red-500" />;
    }
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const getDocumentTypeLabel = (type: string) => {
    return CLIENT_DOCUMENT_TYPES.find(t => t.value === type)?.label || type;
  };

  return (
    <div className="space-y-4">
      {/* Upload Form */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Enviar Documento
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-600 text-xs">Nome do Documento</Label>
            <Input
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Ex: RG Frente"
              className="mt-1 bg-white border-gray-300 text-gray-900 text-sm"
            />
          </div>

          <div>
            <Label className="text-gray-600 text-xs">Tipo</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="mt-1 bg-white border-gray-300 text-gray-900 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLIENT_DOCUMENT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="flex-1 bg-white border-gray-300 text-gray-900 text-sm"
          />
          <Button
            onClick={handleUpload}
            disabled={isUploading || !fileInputRef.current?.files?.[0] || !documentName.trim()}
            className="bg-gray-900 text-white hover:bg-gray-800"
            size="sm"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Documents List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          Nenhum documento cadastrado
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {getFileIcon(doc.file_url)}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.name}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <span className="px-1.5 py-0.5 rounded bg-gray-100">
                      {getDocumentTypeLabel(doc.document_type)}
                    </span>
                    <span>
                      {format(new Date(doc.created_at), "dd/MM/yy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(doc.file_url, '_blank')}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(doc)}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Excluir documento?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Tem certeza que deseja excluir <strong className="text-gray-900">{deleteConfirm?.name}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
