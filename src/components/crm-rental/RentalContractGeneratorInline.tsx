import { useState, useEffect } from 'react';
import { RentalContract } from '@/types/rental';
import { generateContractPDF, downloadContractPDF, generateFullContractHTML } from '@/lib/rentalContract/generateContractPDF';
import { 
  createAnnexDataFromContract,
  generateInspectionTermHTML,
  generateInternalRegulationsHTML,
  generateLGPDConsentHTML,
} from '@/lib/rentalContract/contractAnnexes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Download, 
  Printer, 
  Send,
  Loader2,
  CheckCircle,
  ExternalLink,
  AlertCircle,
  FileCheck,
  ScrollText,
  Shield,
} from 'lucide-react';

interface RentalContractGeneratorInlineProps {
  contract: RentalContract;
}

export function RentalContractGeneratorInline({ contract }: RentalContractGeneratorInlineProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [signatureLinks, setSignatureLinks] = useState<{ name: string; email: string; link: string }[]>([]);
  const { toast } = useToast();

  // Annex selection state
  const [includeInspection, setIncludeInspection] = useState(true);
  const [includeRegulations, setIncludeRegulations] = useState(true);
  const [includeLGPD, setIncludeLGPD] = useState(true);

  // Agency data from database
  const [agencyData, setAgencyData] = useState({
    name: 'Venda Direta Hoje',
    cnpj: 'CNPJ: XX.XXX.XXX/0001-XX',
    email: '',
  });

  // Fetch agency data from database
  useEffect(() => {
    const fetchAgencyData = async () => {
      const { data, error } = await supabase
        .from('real_estate_agency')
        .select('name, email')
        .limit(1)
        .single();

      if (!error && data) {
        setAgencyData({
          name: data.name || 'Venda Direta Hoje',
          cnpj: 'CNPJ: XX.XXX.XXX/0001-XX',
          email: data.email || '',
        });
      }
    };

    fetchAgencyData();
  }, []);

  const annexData = createAnnexDataFromContract(contract, agencyData);

  const annexOptions = {
    includeInspection,
    includeRegulations,
    includeLGPD,
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateContractPDF(contract, agencyData, annexOptions);
      downloadContractPDF(blob, `Contrato_${contract.property_code}.pdf`);
      
      toast({
        title: 'PDF gerado',
        description: 'O contrato foi baixado com sucesso.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Erro ao gerar PDF',
        description: 'Não foi possível gerar o contrato.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = async () => {
    const html = generateFullContractHTML(contract, agencyData);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handlePrintWithAnnexes = () => {
    const html = generateFullContractHTML(contract, agencyData, annexOptions);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handlePrintAnnexOnly = (type: 'inspection' | 'regulations' | 'lgpd') => {
    let html = '';
    switch (type) {
      case 'inspection':
        html = generateInspectionTermHTML(annexData);
        break;
      case 'regulations':
        html = generateInternalRegulationsHTML(annexData);
        break;
      case 'lgpd':
        html = generateLGPDConsentHTML(annexData);
        break;
    }
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleSendForSignature = async () => {
    if (!contract.tenant?.email) {
      toast({
        title: 'E-mail não cadastrado',
        description: 'O locatário precisa ter um e-mail cadastrado para receber o link de assinatura.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      // Generate PDF with annexes as base64
      const blob = await generateContractPDF(contract, agencyData, annexOptions);
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      // Create signers list - Tenant, Owner, and Agency
      const signers = [
        {
          email: contract.tenant.email,
          name: contract.tenant.full_name,
          action: 'SIGN' as const,
        },
        {
          email: contract.owner_email || contract.owner?.email || 'proprietario@email.com',
          name: contract.owner_name,
          action: 'SIGN' as const,
        },
        {
          email: agencyData.email || 'contato@vendadiretahoje.com.br',
          name: agencyData.name,
          action: 'SIGN' as const,
        },
      ];

      // Call edge function
      const response = await supabase.functions.invoke('autentique-integration/create-document', {
        body: {
          name: `Contrato de Locação - ${contract.property_code}`,
          content_base64: base64,
          signers,
          sandbox: false,
        },
      });

      if (response.error) {
        throw response.error;
      }

      const { document } = response.data;

      // Extract signature links
      const links = document.signatures.map((sig: any) => ({
        name: sig.name,
        email: sig.email,
        link: sig.link?.short_link || '',
      }));

      setSignatureLinks(links);

      toast({
        title: 'Contrato enviado para assinatura',
        description: 'Os links de assinatura foram gerados para Locador, Locatário e Imobiliária. Após assinado, o documento será arquivado automaticamente.',
      });
    } catch (error) {
      console.error('Error sending for signature:', error);
      toast({
        title: 'Erro ao enviar',
        description: 'Não foi possível enviar o contrato para assinatura. Verifique se a API Autentique está configurada.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copiado',
      description: 'O link de assinatura foi copiado para a área de transferência.',
    });
  };

  const contractTypeLabel = contract.contract_type === 'comercial' ? 'Comercial' : 'Residencial';

  return (
    <div className="space-y-6">
      {/* Contract Info */}
      <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Imóvel:</span>
            <p className="font-medium text-gray-900">{contract.property_code}</p>
          </div>
          <div>
            <span className="text-gray-500">Tipo:</span>
            <p className="font-medium text-gray-900">{contractTypeLabel}</p>
          </div>
          <div>
            <span className="text-gray-500">Locatário:</span>
            <p className="font-medium text-gray-900">{contract.tenant?.full_name || 'Não definido'}</p>
          </div>
          <div>
            <span className="text-gray-500">Locador:</span>
            <p className="font-medium text-gray-900">{contract.owner_name}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Vigência:</span>
            <p className="font-medium text-gray-900">
              {new Date(contract.start_date).toLocaleDateString('pt-BR')} - {new Date(contract.end_date).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Contract Actions */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center gap-2 text-gray-900">
          <FileText className="w-4 h-4" />
          Contrato Principal ({contractTypeLabel} - 14 Cláusulas)
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
            ) : (
              <Download className="w-4 h-4 mr-2 text-white" />
            )}
            Baixar PDF
          </Button>
          
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
          >
            <Printer className="w-4 h-4 mr-2 text-gray-900" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Annexes Section */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-900">
          <ScrollText className="w-4 h-4" />
          Anexos do Contrato
        </h4>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Checkbox
              id="inspection"
              checked={includeInspection}
              onCheckedChange={(checked) => setIncludeInspection(checked as boolean)}
              className="border-gray-400 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
            />
            <div className="flex-1">
              <Label htmlFor="inspection" className="font-medium cursor-pointer text-gray-900">
                Anexo I - Termo de Vistoria
              </Label>
              <p className="text-xs text-gray-500">Checklist de ambientes, instalações e fotos</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePrintAnnexOnly('inspection')}
              title="Imprimir apenas este anexo"
              className="bg-white text-gray-900 hover:bg-gray-100 border-gray-300"
            >
              <Printer className="w-4 h-4 text-gray-900" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Checkbox
              id="regulations"
              checked={includeRegulations}
              onCheckedChange={(checked) => setIncludeRegulations(checked as boolean)}
              className="border-gray-400 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
            />
            <div className="flex-1">
              <Label htmlFor="regulations" className="font-medium cursor-pointer text-gray-900">
                Anexo II - Regulamento Interno
              </Label>
              <p className="text-xs text-gray-500">Normas de uso e convivência</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePrintAnnexOnly('regulations')}
              title="Imprimir apenas este anexo"
              className="bg-white text-gray-900 hover:bg-gray-100 border-gray-300"
            >
              <Printer className="w-4 h-4 text-gray-900" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Checkbox
              id="lgpd"
              checked={includeLGPD}
              onCheckedChange={(checked) => setIncludeLGPD(checked as boolean)}
              className="border-gray-400 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
            />
            <div className="flex-1">
              <Label htmlFor="lgpd" className="font-medium cursor-pointer flex items-center gap-1 text-gray-900">
                <Shield className="w-3 h-3" />
                Anexo III - Termo LGPD
              </Label>
              <p className="text-xs text-gray-500">Consentimento de tratamento de dados</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePrintAnnexOnly('lgpd')}
              title="Imprimir apenas este anexo"
              className="bg-white text-gray-900 hover:bg-gray-100 border-gray-300"
            >
              <Printer className="w-4 h-4 text-gray-900" />
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handlePrintWithAnnexes}
          variant="outline"
          className="w-full border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
          disabled={!includeInspection && !includeRegulations && !includeLGPD}
        >
          <FileCheck className="w-4 h-4 mr-2 text-gray-900" />
          Imprimir Contrato + Anexos Selecionados
        </Button>
      </div>

      {/* Digital Signature */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-900">
          <Send className="w-4 h-4" />
          Assinatura Digital (Autentique)
        </h4>
        
        {!contract.tenant?.email && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              O locatário não possui e-mail cadastrado. Cadastre o e-mail na aba Clientes para enviar para assinatura.
            </p>
          </div>
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
          <p className="text-sm text-blue-700">
            <strong>Signatários:</strong> O contrato será enviado para assinatura do <strong>Locador</strong>, <strong>Locatário</strong> e <strong>Imobiliária</strong>.
            {(includeInspection || includeRegulations || includeLGPD) && (
              <span> Os anexos selecionados serão incluídos no documento.</span>
            )}
          </p>
        </div>
        
        <Button
          onClick={handleSendForSignature}
          disabled={isSending || !contract.tenant?.email}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4 mr-2 text-white" />
          )}
          Enviar para Assinatura Online
        </Button>
        
        <p className="text-xs text-gray-500 mt-2">
          O contrato será enviado para assinatura via Autentique com validade jurídica.
          Após assinado por todos, o documento será arquivado automaticamente no contrato.
        </p>
      </div>

      {/* Signature Links */}
      {signatureLinks.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium mb-3 flex items-center gap-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            Links de Assinatura Gerados
          </h4>
          <div className="space-y-2">
            {signatureLinks.map((signer, index) => (
              <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{signer.name}</p>
                    <p className="text-xs text-gray-500">{signer.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyLink(signer.link)}
                      className="bg-white text-gray-900 hover:bg-gray-100 border-gray-300"
                    >
                      Copiar Link
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(signer.link, '_blank')}
                      className="bg-white text-gray-900 hover:bg-gray-100 border-gray-300"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-900" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
