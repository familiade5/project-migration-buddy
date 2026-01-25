import { useState, useEffect, useRef } from 'react';
import { CrmProperty } from '@/types/crm';
import { formatCurrency } from '@/lib/formatCurrency';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
  DollarSign,
  Building2,
  User,
  Upload,
  FileCheck,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CommissionsTabProps {
  property: CrmProperty;
}

interface Commission {
  id: string;
  property_id: string;
  user_id: string | null;
  user_name: string;
  percentage: number;
  value: number | null;
  is_paid: boolean;
  paid_at: string | null;
  payment_method: string | null;
  payment_proof_url: string | null;
  created_at: string;
}

const PAYMENT_METHODS = [
  { value: 'pix', label: 'PIX' },
  { value: 'transferencia', label: 'Transferência Bancária' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'cheque', label: 'Cheque' },
];

export function CommissionsTab({ property }: CommissionsTabProps) {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('pix');
  const [isUploading, setIsUploading] = useState(false);
  const [brokerCommissionRate, setBrokerCommissionRate] = useState<number>(3); // Default 3%
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  // Fetch broker commission rate if broker is assigned
  useEffect(() => {
    const fetchBrokerRate = async () => {
      if (property.responsible_user_id) {
        const { data: brokerProfile } = await supabase
          .from('broker_profiles')
          .select('commission_percentage')
          .eq('user_id', property.responsible_user_id)
          .maybeSingle();
        
        if (brokerProfile?.commission_percentage) {
          setBrokerCommissionRate(brokerProfile.commission_percentage);
        }
      }
    };
    fetchBrokerRate();
  }, [property.responsible_user_id]);

  // Calculate commissions based on 5% agency and broker's configured rate
  const saleValue = property.sale_value || 0;
  const agencyCommission = saleValue * 0.05; // 5% of sale value
  const brokerCommission = saleValue * (brokerCommissionRate / 100); // Broker's configured rate
  const agencyNet = agencyCommission - brokerCommission; // Agency keeps the difference

  useEffect(() => {
    fetchCommissions();
  }, [property.id]);

  const fetchCommissions = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_property_commissions')
        .select('*')
        .eq('property_id', property.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommissions((data as Commission[]) || []);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsPaid = async (commission: Commission) => {
    if (!isAdmin) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('crm_property_commissions')
        .update({
          is_paid: true,
          paid_at: new Date().toISOString(),
          payment_method: selectedMethod,
        })
        .eq('id', commission.id);

      if (error) throw error;

      toast({
        title: 'Comissão atualizada',
        description: 'Pagamento registrado com sucesso',
      });

      fetchCommissions();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadProof = async (commission: Commission, file: File) => {
    if (!isAdmin) return;
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${property.id}/${commission.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('crm-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('crm-documents')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('crm_property_commissions')
        .update({ payment_proof_url: urlData.publicUrl })
        .eq('id', commission.id);

      if (updateError) throw updateError;

      toast({
        title: 'Comprovante enviado',
        description: 'Arquivo salvo com sucesso',
      });

      fetchCommissions();
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateBrokerCommission = async () => {
    if (!isAdmin || !property.responsible_user_id) return;
    setIsSaving(true);

    try {
      const { error } = await supabase.from('crm_property_commissions').insert({
        property_id: property.id,
        user_id: property.responsible_user_id,
        user_name: property.responsible_user_name || 'Corretor',
        percentage: 3,
        value: brokerCommission,
      });

      if (error) throw error;

      toast({
        title: 'Comissão criada',
        description: 'Comissão do corretor registrada',
      });

      fetchCommissions();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">Carregando...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Commission Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Resumo de Comissões
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Comissão Caixa (5%)</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(agencyCommission)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-1 mb-1">
              <User className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-500">Corretor ({brokerCommissionRate}%)</p>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(brokerCommission)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-1 mb-1">
              <Building2 className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-500">Imobiliária ({(5 - brokerCommissionRate).toFixed(1)}%)</p>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(agencyNet)}
            </p>
          </div>
        </div>
      </div>

      {/* Broker Commission Records */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">
            Pagamentos ao Corretor
          </h4>
          {isAdmin && commissions.length === 0 && property.responsible_user_id && (
            <Button
              size="sm"
              onClick={handleCreateBrokerCommission}
              disabled={isSaving}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              Registrar Comissão
            </Button>
          )}
        </div>

        {commissions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {property.responsible_user_id
                ? 'Nenhuma comissão registrada'
                : 'Atribua um corretor primeiro'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {commissions.map((commission) => (
              <div
                key={commission.id}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {commission.user_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {commission.percentage}% = {formatCurrency(commission.value || 0)}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                      commission.is_paid
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    {commission.is_paid ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Pago
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Pendente
                      </>
                    )}
                  </div>
                </div>

                {commission.is_paid && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>Método:</span>
                      <span className="font-medium">
                        {PAYMENT_METHODS.find(m => m.value === commission.payment_method)?.label || commission.payment_method || '-'}
                      </span>
                    </div>
                    {commission.paid_at && (
                      <div className="text-xs text-gray-500">
                        Pago em {format(new Date(commission.paid_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                    )}
                    {commission.payment_proof_url && (
                      <a
                        href={commission.payment_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-3 h-3" />
                        Ver comprovante
                      </a>
                    )}
                  </div>
                )}

                {isAdmin && !commission.is_paid && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Método de pagamento</Label>
                      <Select
                        value={selectedMethod}
                        onValueChange={setSelectedMethod}
                      >
                        <SelectTrigger className="bg-white border-gray-200 text-gray-900 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem
                              key={method.value}
                              value={method.value}
                              className="text-gray-900"
                            >
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsPaid(commission)}
                      disabled={isSaving}
                      className="w-full bg-green-600 text-white hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Pago
                    </Button>
                  </div>
                )}

                {isAdmin && commission.is_paid && !commission.payment_proof_url && (
                  <div className="mt-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadProof(commission, file);
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Enviando...' : 'Anexar Comprovante'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
