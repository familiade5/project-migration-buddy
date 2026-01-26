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
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      case 'partial': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <DollarSign className="w-5 h-5" />
            Pagamento - {monthNames[payment.reference_month - 1]} {payment.reference_year}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Property & Tenant Info */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-900 font-medium">{propertyCode || 'Imóvel'}</p>
            <p className="text-sm text-gray-500">{tenantName || 'Inquilino'}</p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status:</span>
            <Badge className={cn("border", getStatusColor(payment.status))}>
              {payment.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {payment.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
              {payment.status === 'paid' && <Check className="w-3 h-3 mr-1" />}
              {paymentStatusLabels[payment.status]}
            </Badge>
          </div>

          {/* Due Date */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Vencimento:</span>
            <span className="text-gray-900">
              {new Date(payment.due_date).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {/* Values Breakdown */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Aluguel:</span>
              <span className="text-gray-900">{formatCurrency(payment.rent_value)}</span>
            </div>
            {payment.condominium_fee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Condomínio:</span>
                <span className="text-gray-900">{formatCurrency(payment.condominium_fee)}</span>
              </div>
            )}
            {payment.iptu_value > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">IPTU:</span>
                <span className="text-gray-900">{formatCurrency(payment.iptu_value)}</span>
              </div>
            )}
            {payment.other_fees > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Outras taxas:</span>
                <span className="text-gray-900">{formatCurrency(payment.other_fees)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
              <span className="text-gray-700">Subtotal:</span>
              <span className="text-gray-900">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Adjustments */}
          {(payment.status === 'pending' || payment.status === 'overdue') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-700">Multa/Juros</Label>
                <Input
                  type="number"
                  value={lateFee}
                  onChange={(e) => setLateFee(parseFloat(e.target.value) || 0)}
                  className="bg-white border-gray-200"
                />
              </div>
              <div>
                <Label className="text-gray-700">Desconto</Label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="bg-white border-gray-200"
                />
              </div>
            </div>
          )}

          {/* Total */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-emerald-700 font-medium">Total a Pagar:</span>
              <span className="text-2xl font-bold text-emerald-600">
                {formatCurrency(adjustedTotal)}
              </span>
            </div>
          </div>

          {/* Payment form for pending/overdue */}
          {(payment.status === 'pending' || payment.status === 'overdue') && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-700">Valor Pago</Label>
                  <Input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Método</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
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
                <Label className="text-gray-700">Comprovante</Label>
                <div className="mt-1">
                  {proofUrl ? (
                    <div className="flex items-center gap-2">
                      <a 
                        href={proofUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm underline"
                      >
                        Ver comprovante
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProofUrl('')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleUploadProof}
                        disabled={isUploading}
                      />
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
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
            <Label className="text-gray-700">Observações</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-white border-gray-200 min-h-[80px]"
              placeholder="Observações sobre este pagamento..."
            />
          </div>

          {/* Paid info */}
          {payment.status === 'paid' && payment.paid_at && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Pago em:</span>
                <span className="text-gray-900">
                  {new Date(payment.paid_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {payment.payment_method && (
                <div className="flex justify-between mt-1">
                  <span className="text-gray-500">Método:</span>
                  <span className="text-gray-900">
                    {paymentMethods.find(m => m.value === payment.payment_method)?.label || payment.payment_method}
                  </span>
                </div>
              )}
              {payment.paid_amount && (
                <div className="flex justify-between mt-1">
                  <span className="text-gray-500">Valor pago:</span>
                  <span className="text-gray-900">{formatCurrency(payment.paid_amount)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-900"
          >
            Fechar
          </Button>
          
          {(payment.status === 'pending' || payment.status === 'overdue') && (
            <>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isLoading}
                className="border-gray-200 text-gray-700 hover:bg-gray-100"
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
