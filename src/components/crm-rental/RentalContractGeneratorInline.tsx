import { useState } from 'react';
import { RentalContract } from '@/types/rental';
import { generateContractPDF, downloadContractPDF } from '@/lib/rentalContract/generateContractPDF';
import { generateContractHTML, generateContractData } from '@/lib/rentalContract/contractTemplate';
import { 
  generateAllAnnexesHTML, 
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

  // Agency data (could come from settings)
  const agencyData = {
    name: 'Venda Direta Hoje',
    cnpj: 'CNPJ: XX.XXX.XXX/0001-XX',
  };

  const annexData = createAnnexDataFromContract(contract, agencyData);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateContractPDF(contract, agencyData);
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
    const data = generateContractData(contract, agencyData);
    const html = generateContractHTML(data);
    
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
    const data = generateContractData(contract, agencyData);
    let fullHTML = generateContractHTML(data);
    
    // Add page break and annexes
    const annexes: string[] = [];
    
    if (includeInspection) {
      annexes.push(generateInspectionTermHTML(annexData));
    }
    if (includeRegulations) {
      annexes.push(generateInternalRegulationsHTML(annexData));
    }
    if (includeLGPD) {
      annexes.push(generateLGPDConsentHTML(annexData));
    }
    
    if (annexes.length > 0) {
      // Combine contract with annexes
      const contractBody = fullHTML.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || '';
      const annexBodies = annexes.map(annex => {
        const body = annex.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || '';
        return `<div style="page-break-before: always;"></div>${body}`;
      }).join('');
      
      fullHTML = fullHTML.replace(contractBody, contractBody + annexBodies);
    }
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(fullHTML);
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
      // Generate PDF as base64
      const blob = await generateContractPDF(contract, agencyData);
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      // Create signers list - tenant and owner only
      const signers = [
        {
          email: contract.tenant.email,
          name: contract.tenant.full_name,
          action: 'SIGN' as const,
        },
        {
          email: contract.owner_email || 'proprietario@email.com',
          name: contract.owner_name,
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
        description: 'Os links de assinatura foram gerados. Após assinado, o documento será arquivado automaticamente.',
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

  return (
    <div className="space-y-6">
      {/* Contract Info */}
      <div className="p-4 bg-muted rounded-lg border border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Imóvel:</span>
            <p className="font-medium">{contract.property_code}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Locatário:</span>
            <p className="font-medium">{contract.tenant?.full_name || 'Não definido'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Locador:</span>
            <p className="font-medium">{contract.owner_name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Vigência:</span>
            <p className="font-medium">
              {new Date(contract.start_date).toLocaleDateString('pt-BR')} - {new Date(contract.end_date).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Contract Actions */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Contrato Principal
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="bg-primary hover:bg-primary/90"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Baixar PDF
          </Button>
          
          <Button
            onClick={handlePrint}
            variant="outline"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Annexes Section */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <ScrollText className="w-4 h-4" />
          Anexos do Contrato
        </h4>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <Checkbox
              id="inspection"
              checked={includeInspection}
              onCheckedChange={(checked) => setIncludeInspection(checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="inspection" className="font-medium cursor-pointer">
                Anexo I - Termo de Vistoria
              </Label>
              <p className="text-xs text-muted-foreground">Checklist de ambientes, instalações e fotos</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handlePrintAnnexOnly('inspection')}
              title="Imprimir apenas este anexo"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <Checkbox
              id="regulations"
              checked={includeRegulations}
              onCheckedChange={(checked) => setIncludeRegulations(checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="regulations" className="font-medium cursor-pointer">
                Anexo II - Regulamento Interno
              </Label>
              <p className="text-xs text-muted-foreground">Normas de uso e convivência</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handlePrintAnnexOnly('regulations')}
              title="Imprimir apenas este anexo"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <Checkbox
              id="lgpd"
              checked={includeLGPD}
              onCheckedChange={(checked) => setIncludeLGPD(checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="lgpd" className="font-medium cursor-pointer flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Anexo III - Termo LGPD
              </Label>
              <p className="text-xs text-muted-foreground">Consentimento de tratamento de dados</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handlePrintAnnexOnly('lgpd')}
              title="Imprimir apenas este anexo"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handlePrintWithAnnexes}
          variant="outline"
          className="w-full"
          disabled={!includeInspection && !includeRegulations && !includeLGPD}
        >
          <FileCheck className="w-4 h-4 mr-2" />
          Imprimir Contrato + Anexos Selecionados
        </Button>
      </div>

      {/* Digital Signature */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Send className="w-4 h-4" />
          Assinatura Digital (Autentique)
        </h4>
        
        {!contract.tenant?.email && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              O locatário não possui e-mail cadastrado. Cadastre o e-mail na aba Clientes para enviar para assinatura.
            </p>
          </div>
        )}
        
        <Button
          onClick={handleSendForSignature}
          disabled={isSending || !contract.tenant?.email}
          className="w-full"
          variant="default"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Enviar para Assinatura Online
        </Button>
        
        <p className="text-xs text-muted-foreground mt-2">
          O contrato será enviado para assinatura via Autentique com validade jurídica.
          Após assinado, o documento será arquivado automaticamente no contrato.
        </p>
      </div>

      {/* Signature Links */}
      {signatureLinks.length > 0 && (
        <div className="border-t border-border pt-4">
          <h4 className="font-medium mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            Links de Assinatura Gerados
          </h4>
          <div className="space-y-2">
            {signatureLinks.map((signer, index) => (
              <div key={index} className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{signer.name}</p>
                    <p className="text-xs text-muted-foreground">{signer.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyLink(signer.link)}
                    >
                      Copiar Link
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(signer.link, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
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
