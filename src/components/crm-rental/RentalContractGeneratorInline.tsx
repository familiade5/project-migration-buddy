import { useState } from 'react';
import { RentalContract } from '@/types/rental';
import { generateContractPDF, downloadContractPDF } from '@/lib/rentalContract/generateContractPDF';
import { generateContractHTML, generateContractData } from '@/lib/rentalContract/contractTemplate';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Printer, 
  Send,
  Loader2,
  CheckCircle,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

interface RentalContractGeneratorInlineProps {
  contract: RentalContract;
}

export function RentalContractGeneratorInline({ contract }: RentalContractGeneratorInlineProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [signatureLinks, setSignatureLinks] = useState<{ name: string; email: string; link: string }[]>([]);
  const { toast } = useToast();

  // Agency data (could come from settings)
  const agencyData = {
    name: 'Venda Direta Hoje',
    cnpj: 'CNPJ: XX.XXX.XXX/0001-XX',
  };

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

      // Create signers list
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
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Imóvel:</span>
            <p className="font-medium">{contract.property_code}</p>
          </div>
          <div>
            <span className="text-gray-500">Locatário:</span>
            <p className="font-medium">{contract.tenant?.full_name || 'Não definido'}</p>
          </div>
          <div>
            <span className="text-gray-500">Locador:</span>
            <p className="font-medium">{contract.owner_name}</p>
          </div>
          <div>
            <span className="text-gray-500">Vigência:</span>
            <p className="font-medium">
              {new Date(contract.start_date).toLocaleDateString('pt-BR')} - {new Date(contract.end_date).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="bg-gray-900 hover:bg-gray-800 text-white"
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
          className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
        >
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
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
        
        <Button
          onClick={handleSendForSignature}
          disabled={isSending || !contract.tenant?.email}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300 disabled:text-white"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Enviar para Assinatura Online
        </Button>
        
        <p className="text-xs text-gray-500 mt-2">
          O contrato será enviado para assinatura via Autentique com validade jurídica.
          Após assinado, o documento será arquivado automaticamente no contrato.
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
                    <p className="font-medium text-sm">{signer.name}</p>
                    <p className="text-xs text-gray-500">{signer.email}</p>
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
