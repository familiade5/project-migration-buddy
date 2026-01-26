import jsPDF from 'jspdf';
import { RentalContract } from '@/types/rental';
import { generateContractData, formatCurrencyForContract } from './contractTemplate';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export async function generateContractPDF(
  contract: RentalContract,
  agencyData?: { name: string; cnpj: string }
): Promise<Blob> {
  const data = generateContractData(contract, agencyData);
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = 20;
  
  // Helper function to add text with line wrapping
  const addText = (text: string, fontSize: number = 11, isBold: boolean = false, align: 'left' | 'center' | 'justify' = 'left') => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = pdf.splitTextToSize(text, contentWidth);
    
    lines.forEach((line: string) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
      
      if (align === 'center') {
        pdf.text(line, pageWidth / 2, y, { align: 'center' });
      } else {
        pdf.text(line, margin, y);
      }
      y += fontSize * 0.4;
    });
    
    y += 2;
  };
  
  const addSpace = (space: number = 5) => {
    y += space;
  };
  
  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('CONTRATO DE LOCAÇÃO RESIDENCIAL', pageWidth / 2, y, { align: 'center' });
  y += 6;
  pdf.text('COM ADMINISTRAÇÃO IMOBILIÁRIA', pageWidth / 2, y, { align: 'center' });
  y += 12;
  
  // Intro
  addText('Pelo presente instrumento particular, as partes abaixo identificadas:');
  addSpace(3);
  
  // Parties
  addText(`LOCADOR: ${data.NOME_LOCADOR}, ${data.CPF_CNPJ_LOCADOR}`, 11, true);
  addText(`LOCATÁRIO: ${data.NOME_LOCATARIO}, CPF: ${data.CPF_LOCATARIO}`, 11, true);
  addText(`IMOBILIÁRIA ADMINISTRADORA: ${data.NOME_IMOBILIARIA}, ${data.CNPJ_IMOBILIARIA}`, 11, true);
  addSpace(3);
  
  addText('têm entre si justo e contratado o seguinte:');
  addSpace(5);
  
  // Clause 1
  addText('CLÁUSULA 1ª – DO IMÓVEL', 11, true);
  addText(`O LOCADOR dá em locação ao LOCATÁRIO o imóvel situado à: ${data.ENDERECO_IMOVEL}, destinado exclusivamente para uso residencial, não podendo ter outra finalidade.`);
  addSpace(5);
  
  // Clause 2
  addText('CLÁUSULA 2ª – DO PRAZO', 11, true);
  addText(`O prazo da locação é de ${data.PRAZO_LOCACAO} meses, iniciando-se em ${data.DATA_INICIO} e encerrando-se em ${data.DATA_FIM}.`);
  addSpace(5);
  
  // Clause 3
  addText('CLÁUSULA 3ª – DO VALOR DO ALUGUEL', 11, true);
  addText(`O aluguel mensal é de ${data.VALOR_ALUGUEL}, com vencimento todo dia ${data.DIA_VENCIMENTO}, mediante boleto bancário ou outro meio indicado pela ADMINISTRADORA.`);
  addSpace(5);
  
  // Clause 4
  addText('CLÁUSULA 4ª – DA GARANTIA (CAUÇÃO)', 11, true);
  addText(`Como garantia, o LOCATÁRIO entrega o valor correspondente a 02 (dois) meses de aluguel, totalizando ${data.VALOR_CALCAO}, nos termos do art. 38 da Lei 8.245/91.`);
  addText('O valor será devolvido ao final da locação, descontados débitos, danos ou encargos pendentes.');
  addSpace(5);
  
  // Clause 5
  addText('CLÁUSULA 5ª – DOS ENCARGOS', 11, true);
  addText('São de responsabilidade do LOCATÁRIO:');
  addText('• Aluguel, Água, Energia, Condomínio, IPTU');
  addText('• Multas e taxas incidentes sobre o imóvel durante a locação');
  addSpace(5);
  
  // Clause 6
  addText('CLÁUSULA 6ª – DA ADMINISTRAÇÃO IMOBILIÁRIA', 11, true);
  addText('A ADMINISTRADORA é responsável pela gestão da locação, emissão de cobranças, recebimento de valores, intermediação entre as partes e medidas administrativas e judiciais de cobrança.');
  addText('O LOCATÁRIO declara ciência e concordância com a atuação da ADMINISTRADORA.');
  addSpace(5);
  
  // Clause 7
  addText('CLÁUSULA 7ª – DA INADIMPLÊNCIA', 11, true);
  addText('O não pagamento do aluguel ou encargos implicará:');
  addText(`a) Multa de ${data.PERCENTUAL_MULTA}%  b) Juros de ${data.JUROS_MENSAL}% ao mês  c) Correção monetária`);
  addSpace(5);
  
  // Clause 8
  addText('CLÁUSULA 8ª – DA NEGATIVAÇÃO E PROTESTO', 11, true);
  addText('O LOCATÁRIO autoriza expressamente que, em caso de inadimplência, seu nome seja incluído nos cadastros de proteção ao crédito (SPC/Serasa), o débito seja protestado em cartório e as informações sejam compartilhadas para fins de cobrança.');
  addSpace(5);
  
  // Clause 9
  addText('CLÁUSULA 9ª – DO DESPEJO', 11, true);
  addText('O inadimplemento autoriza a ADMINISTRADORA e o LOCADOR a ingressarem com ação de despejo e cobrança judicial ou extrajudicial, nos termos da Lei do Inquilinato.');
  addSpace(5);
  
  // Clause 10
  addText('CLÁUSULA 10ª – DA RESCISÃO', 11, true);
  addText('O contrato poderá ser rescindido por descumprimento contratual, falta de pagamento ou uso indevido do imóvel, aplicando-se as penalidades legais.');
  addSpace(5);
  
  // Clause 11
  addText('CLÁUSULA 11ª – DO FORO', 11, true);
  addText(`Fica eleito o foro da comarca de ${data.CIDADE_FORO}, renunciando a qualquer outro.`);
  addSpace(8);
  
  addText('E por estarem justas e contratadas, assinam o presente instrumento.');
  addSpace(5);
  
  // Date
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(`${data.CIDADE_FORO}, ${data.DATA_ASSINATURA}`, pageWidth - margin, y, { align: 'right' });
  y += 20;
  
  // Check if we need a new page for signatures
  if (y > 220) {
    pdf.addPage();
    y = 40;
  }
  
  // Signatures
  const signatureY = y + 20;
  const lineWidth = 70;
  
  // Left signature - LOCADOR
  pdf.line(margin, signatureY, margin + lineWidth, signatureY);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LOCADOR', margin + lineWidth / 2, signatureY + 5, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.NOME_LOCADOR, margin + lineWidth / 2, signatureY + 10, { align: 'center' });
  
  // Right signature - LOCATÁRIO
  pdf.line(pageWidth - margin - lineWidth, signatureY, pageWidth - margin, signatureY);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LOCATÁRIO', pageWidth - margin - lineWidth / 2, signatureY + 5, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.NOME_LOCATARIO, pageWidth - margin - lineWidth / 2, signatureY + 10, { align: 'center' });
  
  // Second row signatures
  const signatureY2 = signatureY + 30;
  
  // ADMINISTRADORA
  pdf.line(margin, signatureY2, margin + lineWidth, signatureY2);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ADMINISTRADORA', margin + lineWidth / 2, signatureY2 + 5, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.NOME_IMOBILIARIA, margin + lineWidth / 2, signatureY2 + 10, { align: 'center' });
  
  // TESTEMUNHA
  pdf.line(pageWidth - margin - lineWidth, signatureY2, pageWidth - margin, signatureY2);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TESTEMUNHA', pageWidth - margin - lineWidth / 2, signatureY2 + 5, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.text('Nome: ________________', pageWidth - margin - lineWidth / 2, signatureY2 + 10, { align: 'center' });
  pdf.text('CPF: _________________', pageWidth - margin - lineWidth / 2, signatureY2 + 15, { align: 'center' });
  
  return pdf.output('blob');
}

export function downloadContractPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
