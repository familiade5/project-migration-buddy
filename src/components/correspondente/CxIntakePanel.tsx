import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CX_DOC_LABEL, CX_DOC_TYPES } from '@/types/correspondente';
import { CxIntakeItem } from '@/hooks/useCxIntake';
import { CheckCircle2, Loader2, Sparkles, Upload, UserPlus, XCircle } from 'lucide-react';

const BRAND = '#1a3a6b';

interface Props {
  items: CxIntakeItem[];
  running: boolean;
  onProcess: (files: File[], docType: string) => void;
  onOpenClient: (clientId: string) => void;
  onClear: () => void;
}

export function CxIntakePanel({ items, running, onProcess, onOpenClient, onClear }: Props) {
  const [docType, setDocType] = useState('auto');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onProcess(Array.from(list), docType);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5" style={{ color: BRAND }} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900">Recepção inteligente de documentos</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Solte aqui os documentos. A leitura identifica a pessoa, cria a ficha do cliente com os dados
            pessoais e guarda cada arquivo no lugar certo.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <Label className="text-xs font-semibold text-slate-600">Tipo do documento</Label>
          <Select value={docType} onValueChange={setDocType}>
            <SelectTrigger className="mt-1 bg-white border-slate-200 text-slate-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-900">
              <SelectItem value="auto" className="text-slate-900">Identificar automaticamente</SelectItem>
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
          disabled={running}
          onClick={() => fileRef.current?.click()}
        >
          {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          Enviar documentos
        </Button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handle(e.dataTransfer.files);
        }}
        onClick={() => !running && fileRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragging ? 'border-[#1a3a6b] bg-blue-50/60' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p className="text-sm font-medium text-slate-700">Arraste os arquivos ou clique para escolher</p>
        <p className="text-xs text-slate-400 mt-1">Imagens ou PDF. Vários arquivos e várias pessoas de uma vez.</p>
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />

      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Processamento</p>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500" onClick={onClear}>
              Limpar
            </Button>
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white"
            >
              <div className="flex-shrink-0">
                {item.status === 'ok' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : item.status === 'erro' ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{item.fileName}</p>
                <p className="text-xs text-slate-500 truncate">
                  {item.status === 'lendo'
                    ? 'Lendo o documento…'
                    : item.status === 'vinculando'
                      ? 'Organizando na ficha do cliente…'
                      : item.status === 'aguardando'
                        ? 'Na fila'
                        : item.status === 'erro'
                          ? item.message
                          : `${CX_DOC_LABEL(item.docType)} • ${item.message}`}
                </p>
              </div>
              {item.status === 'ok' && item.clientId && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white border-slate-200 text-slate-700 hover:text-slate-900 flex-shrink-0"
                  onClick={() => onOpenClient(item.clientId!)}
                >
                  {item.created && <UserPlus className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />}
                  {item.clientName}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
