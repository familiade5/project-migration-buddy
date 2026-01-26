import { useState } from 'react';
import { RentalPayment, getPaymentTotal, paymentStatusLabels, paymentMethods, monthNames } from '@/types/rental';
import { formatCurrency } from '@/lib/formatCurrency';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Calendar,
  Check,
  Upload,
  Loader2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RentalPaymentModalProps {
  payment: RentalPayment | null;
  propertyCode?: string;
  tenantName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<RentalPayment>) => Promise<void>;
  onMarkAsPaid: (id: string, amount: number, method: string, proofUrl?: string) => Promise<void>;
}

export function RentalPaymentModal({
  payment,
  propertyCode,
  tenantName,
  isOpen,
  onClose,
  onSave,
  onMarkAsPaid,
}: RentalPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [lateFee, setLateFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [proofUrl, setProofUrl] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Update form when payment changes
  useState(() => {
    if (payment) {
      setPaidAmount(payment.paid_amount || getPaymentTotal(payment));
      setLateFee(payment.late_fee);
      setDiscount(payment.discount);
      setNotes(payment.notes || '');
      setProofUrl(payment.payment_proof_url || '');
      setPaymentMethod(payment.payment_method || 'pix');
    }
  });

  if (!payment) return null;

  const total = getPaymentTotal(payment);
  const adjustedTotal = total + lateFee - discount;

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${payment.id}-${Date.now()}.${ext}`;
      
      const { error: uploadError } = await supabase.storage
        .from('crm-documents')
        .upload(`rental-payments/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('crm-documents')
        .getPublicUrl(`rental-payments/${fileName}`);

      setProofUrl(urlData.publicUrl);
      
      toast({
        title: 'Comprovante enviado',
        description: 'O comprovante foi anexado ao pagamento.',
      });
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast({
        title: 'Erro ao enviar comprovante',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    setIsLoading(true);
    try {
      // First update late fee and discount if changed
      if (lateFee !== payment.late_fee || discount !== payment.discount || notes !== payment.notes) {
        await onSave(payment.id, {
          late_fee: lateFee,
          discount: discount,
          notes: notes,
        });
      }

      await onMarkAsPaid(payment.id, paidAmount, paymentMethod, proofUrl || undefined);
      onClose();
    } catch (error) {
      console.error('Error marking as paid:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(payment.id, {
        late_fee: lateFee,
        discount: discount,
        notes: notes,
        payment_proof_url: proofUrl || null,
      });
      onClose();
    } catch (error) {
      console.error('Error saving payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'partial': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pagamento - {monthNames[payment.reference_month - 1]} {payment.reference_year}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Property & Tenant Info */}
          <div className="p-3 bg-gray-800 rounded-lg">
            <p className="text-white font-medium">{propertyCode || 'Imóvel'}</p>
            <p className="text-sm text-gray-400">{tenantName || 'Inquilino'}</p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Status:</span>
            <Badge className={cn("border", getStatusColor(payment.status))}>
              {payment.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {payment.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
              {payment.status === 'paid' && <Check className="w-3 h-3 mr-1" />}
              {paymentStatusLabels[payment.status]}
            </Badge>
          </div>

          {/* Due Date */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Vencimento:</span>
            <span className="text-white">
              {new Date(payment.due_date).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {/* Values Breakdown */}
          <div className="p-3 bg-gray-800 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Aluguel:</span>
              <span className="text-white">{formatCurrency(payment.rent_value)}</span>
            </div>
            {payment.condominium_fee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Condomínio:</span>
                <span className="text-white">{formatCurrency(payment.condominium_fee)}</span>
              </div>
            )}
            {payment.iptu_value > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">IPTU:</span>
                <span className="text-white">{formatCurrency(payment.iptu_value)}</span>
              </div>
            )}
            {payment.other_fees > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Outras taxas:</span>
                <span className="text-white">{formatCurrency(payment.other_fees)}</span>
              </div>
            )}
            <div className="border-t border-gray-700 pt-2 flex justify-between font-medium">
              <span className="text-gray-300">Subtotal:</span>
              <span className="text-white">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Adjustments */}
          {(payment.status === 'pending' || payment.status === 'overdue') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-400">Multa/Juros</Label>
                <Input
                  type="number"
                  value={lateFee}
                  onChange={(e) => setLateFee(parseFloat(e.target.value) || 0)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <Label className="text-gray-400">Desconto</Label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
          )}

          {/* Total */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-emerald-400 font-medium">Total a Pagar:</span>
              <span className="text-2xl font-bold text-emerald-400">
                {formatCurrency(adjustedTotal)}
              </span>
            </div>
          </div>

          {/* Payment form for pending/overdue */}
          {(payment.status === 'pending' || payment.status === 'overdue') && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-400">Valor Pago</Label>
                  <Input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Método</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Proof upload */}
              <div>
                <Label className="text-gray-400">Comprovante</Label>
                <div className="mt-1">
                  {proofUrl ? (
                    <div className="flex items-center gap-2">
                      <a 
                        href={proofUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm underline"
                      >
                        Ver comprovante
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProofUrl('')}
                        className="text-gray-400 hover:text-white"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleUploadProof}
                        disabled={isUploading}
                      />
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Upload className="w-5 h-5" />
                          <span className="text-sm">Anexar comprovante</span>
                        </div>
                      )}
                    </label>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <Label className="text-gray-400">Observações</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-gray-800 border-gray-700 min-h-[80px]"
              placeholder="Observações sobre este pagamento..."
            />
          </div>

          {/* Paid info */}
          {payment.status === 'paid' && payment.paid_at && (
            <div className="p-3 bg-gray-800 rounded-lg text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Pago em:</span>
                <span className="text-white">
                  {new Date(payment.paid_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {payment.payment_method && (
                <div className="flex justify-between mt-1">
                  <span className="text-gray-400">Método:</span>
                  <span className="text-white">
                    {paymentMethods.find(m => m.value === payment.payment_method)?.label || payment.payment_method}
                  </span>
                </div>
              )}
              {payment.paid_amount && (
                <div className="flex justify-between mt-1">
                  <span className="text-gray-400">Valor pago:</span>
                  <span className="text-white">{formatCurrency(payment.paid_amount)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white"
          >
            Fechar
          </Button>
          
          {(payment.status === 'pending' || payment.status === 'overdue') && (
            <>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isLoading}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Salvar
              </Button>
              <Button
                onClick={handleMarkAsPaid}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Confirmar Pagamento
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
