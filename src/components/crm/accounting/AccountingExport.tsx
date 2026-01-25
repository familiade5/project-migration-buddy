import { useState } from 'react';
import { CrmProperty } from '@/types/crm';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AccountingExportProps {
  properties: CrmProperty[];
  periodLabel: string;
}

interface CommissionRecord {
  id: string;
  property_id: string;
  user_name: string;
  percentage: number;
  value: number | null;
  is_paid: boolean;
  paid_at: string | null;
  payment_method: string | null;
}

const STAGE_LABELS: Record<string, string> = {
  novo_imovel: 'Novo Imóvel',
  em_anuncio: 'Em Anúncio',
  proposta_recebida: 'Proposta Recebida',
  proposta_aceita: 'Proposta Aceita',
  documentacao_enviada: 'Documentação Enviada',
  registro_em_andamento: 'Registro em Andamento',
  registro_concluido: 'Registro Concluído',
  aguardando_pagamento: 'Aguardando Pagamento',
  pago: 'Pago',
  comissao_liberada: 'Comissão Liberada',
};

const TYPE_LABELS: Record<string, string> = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  terreno: 'Terreno',
  comercial: 'Comercial',
  rural: 'Rural',
  outro: 'Outro',
};

export function AccountingExport({ properties, periodLabel }: AccountingExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const fetchCommissions = async () => {
    const { data } = await supabase
      .from('crm_property_commissions')
      .select('*');
    return (data || []) as CommissionRecord[];
  };

  const generateCSV = (data: string[][], filename: string) => {
    const csvContent = data.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(cell).replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('\n') 
          ? `"${escaped}"` 
          : escaped;
      }).join(',')
    ).join('\n');

    // Add BOM for Excel UTF-8 compatibility
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportFullReport = async () => {
    setIsExporting(true);
    try {
      const commissions = await fetchCommissions();
      
      const headers = [
        'Código',
        'Tipo',
        'Cidade',
        'Bairro',
        'Estado',
        'Endereço',
        'Etapa',
        'Valor de Venda (R$)',
        'Comissão Imobiliária (R$)',
        '% Comissão',
        'Data Entrada na Etapa',
        'Data Prevista Pagamento',
        'Corretor Responsável',
        'Comissão Corretor (R$)',
        'Corretor Pago',
        'Data Pagamento Corretor',
        'Método Pagamento',
        'Observações',
      ];

      const rows = properties.map(p => {
        const propertyCommissions = commissions.filter(c => c.property_id === p.id);
        const brokerCommission = propertyCommissions.reduce((sum, c) => sum + (c.value || 0), 0);
        const brokerPaid = propertyCommissions.every(c => c.is_paid);
        const brokerNames = propertyCommissions.map(c => c.user_name).join(', ');
        const paidDates = propertyCommissions
          .filter(c => c.paid_at)
          .map(c => format(new Date(c.paid_at!), 'dd/MM/yyyy'))
          .join(', ');
        const paymentMethods = [...new Set(propertyCommissions.map(c => c.payment_method).filter(Boolean))].join(', ');

        return [
          p.code,
          TYPE_LABELS[p.property_type] || p.property_type,
          p.city,
          p.neighborhood || '',
          p.state,
          p.address || '',
          STAGE_LABELS[p.current_stage] || p.current_stage,
          (p.sale_value || 0).toFixed(2).replace('.', ','),
          (p.commission_value || 0).toFixed(2).replace('.', ','),
          ((p.commission_percentage || 0) * 100).toFixed(2).replace('.', ',') + '%',
          format(new Date(p.stage_entered_at), 'dd/MM/yyyy'),
          p.expected_payment_date ? format(new Date(p.expected_payment_date), 'dd/MM/yyyy') : '',
          brokerNames,
          brokerCommission.toFixed(2).replace('.', ','),
          brokerPaid ? 'Sim' : 'Não',
          paidDates,
          paymentMethods,
          p.notes || '',
        ];
      });

      const filename = `relatorio-completo-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      generateCSV([headers, ...rows], filename);

      toast({
        title: 'Exportação concluída',
        description: `Relatório exportado: ${filename}`,
      });
    } catch (error) {
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível gerar o relatório',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportTaxReport = async () => {
    setIsExporting(true);
    try {
      const commissions = await fetchCommissions();
      
      // Filter only completed transactions
      const completedProperties = properties.filter(
        p => p.current_stage === 'pago' || p.current_stage === 'comissao_liberada'
      );

      const headers = [
        'Ref. Transação',
        'Data Operação',
        'Tipo Imóvel',
        'Localização',
        'UF',
        'Valor Venda (R$)',
        'Base Cálculo Comissão (R$)',
        '% Comissão',
        'Receita Bruta (R$)',
        'Pagamentos a Terceiros (R$)',
        'Receita Líquida (R$)',
        'Situação Fiscal',
        'Observações Contábeis',
      ];

      const rows = completedProperties.map(p => {
        const propertyCommissions = commissions.filter(c => c.property_id === p.id);
        const thirdPartyPayments = propertyCommissions.reduce((sum, c) => sum + (c.value || 0), 0);
        const grossRevenue = p.commission_value || 0;
        const netRevenue = grossRevenue - thirdPartyPayments;

        return [
          p.code,
          format(new Date(p.stage_entered_at), 'dd/MM/yyyy'),
          TYPE_LABELS[p.property_type] || p.property_type,
          `${p.city}${p.neighborhood ? ` - ${p.neighborhood}` : ''}`,
          p.state,
          (p.sale_value || 0).toFixed(2).replace('.', ','),
          (p.sale_value || 0).toFixed(2).replace('.', ','),
          ((p.commission_percentage || 0) * 100).toFixed(2).replace('.', ',') + '%',
          grossRevenue.toFixed(2).replace('.', ','),
          thirdPartyPayments.toFixed(2).replace('.', ','),
          netRevenue.toFixed(2).replace('.', ','),
          p.current_stage === 'comissao_liberada' ? 'Recebido' : 'Aguardando',
          `Transação imobiliária - ${TYPE_LABELS[p.property_type] || p.property_type}`,
        ];
      });

      // Add summary row
      const totalSales = completedProperties.reduce((sum, p) => sum + (p.sale_value || 0), 0);
      const totalGross = completedProperties.reduce((sum, p) => sum + (p.commission_value || 0), 0);
      const totalThirdParty = commissions
        .filter(c => completedProperties.some(p => p.id === c.property_id))
        .reduce((sum, c) => sum + (c.value || 0), 0);
      const totalNet = totalGross - totalThirdParty;

      rows.push([]);
      rows.push([
        'TOTAIS',
        '',
        '',
        '',
        '',
        totalSales.toFixed(2).replace('.', ','),
        '',
        '',
        totalGross.toFixed(2).replace('.', ','),
        totalThirdParty.toFixed(2).replace('.', ','),
        totalNet.toFixed(2).replace('.', ','),
        '',
        `Período: ${periodLabel}`,
      ]);

      const filename = `relatorio-fiscal-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      generateCSV([headers, ...rows], filename);

      toast({
        title: 'Relatório fiscal exportado',
        description: `Arquivo pronto para contador: ${filename}`,
      });
    } catch (error) {
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível gerar o relatório fiscal',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportBrokerPayments = async () => {
    setIsExporting(true);
    try {
      const commissions = await fetchCommissions();
      
      const headers = [
        'Corretor',
        'Código Imóvel',
        'Valor Comissão (R$)',
        '% Participação',
        'Status Pagamento',
        'Data Pagamento',
        'Método',
        'CPF/CNPJ (preencher)',
        'Banco (preencher)',
        'Agência (preencher)',
        'Conta (preencher)',
        'Observações',
      ];

      const rows = commissions.map(c => {
        const property = properties.find(p => p.id === c.property_id);
        return [
          c.user_name,
          property?.code || c.property_id,
          (c.value || 0).toFixed(2).replace('.', ','),
          (c.percentage * 100).toFixed(2).replace('.', ',') + '%',
          c.is_paid ? 'Pago' : 'Pendente',
          c.paid_at ? format(new Date(c.paid_at), 'dd/MM/yyyy') : '',
          c.payment_method || '',
          '',
          '',
          '',
          '',
          '',
        ];
      });

      // Add totals
      const totalPaid = commissions.filter(c => c.is_paid).reduce((sum, c) => sum + (c.value || 0), 0);
      const totalPending = commissions.filter(c => !c.is_paid).reduce((sum, c) => sum + (c.value || 0), 0);

      rows.push([]);
      rows.push(['TOTAL PAGO', '', totalPaid.toFixed(2).replace('.', ','), '', '', '', '', '', '', '', '', '']);
      rows.push(['TOTAL PENDENTE', '', totalPending.toFixed(2).replace('.', ','), '', '', '', '', '', '', '', '', '']);

      const filename = `pagamentos-corretores-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      generateCSV([headers, ...rows], filename);

      toast({
        title: 'Relatório de pagamentos exportado',
        description: `Planilha de comissões: ${filename}`,
      });
    } catch (error) {
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível gerar o relatório',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white border-gray-200">
        <DropdownMenuLabel className="text-xs text-gray-500">
          Relatórios para Download
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={exportFullReport}
          className="cursor-pointer hover:bg-gray-50"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
          <div>
            <p className="text-sm font-medium">Relatório Completo</p>
            <p className="text-[10px] text-gray-500">Todos os imóveis e detalhes</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={exportTaxReport}
          className="cursor-pointer hover:bg-gray-50"
        >
          <FileText className="w-4 h-4 mr-2 text-blue-600" />
          <div>
            <p className="text-sm font-medium">Relatório Fiscal</p>
            <p className="text-[10px] text-gray-500">Para declaração de impostos</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={exportBrokerPayments}
          className="cursor-pointer hover:bg-gray-50"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 text-purple-600" />
          <div>
            <p className="text-sm font-medium">Pagamentos a Corretores</p>
            <p className="text-[10px] text-gray-500">Comissões e status de pagamento</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
