import jsPDF from 'jspdf';
import { RentalContract } from '@/types/rental';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ContractTemplateData, 
  generateContractHTML as generateAdvancedContractHTML,
  formatCurrencyForContract 
} from './advancedContractTemplates';
import {
  AnnexData,
  generateInspectionTermHTML,
  generateInternalRegulationsHTML,
  generateLGPDConsentHTML,
  createAnnexDataFromContract,
} from './contractAnnexes';
import { RentalContractType, RentalGuaranteeType } from '@/types/rentalProperty';

interface AnnexOptions {
  includeInspection?: boolean;
  includeRegulations?: boolean;
  includeLGPD?: boolean;
}

// Convert RentalContract to ContractTemplateData for the advanced templates
function convertContractToTemplateData(
  contract: RentalContract,
  agencyData?: { name: string; cnpj: string }
): ContractTemplateData {
  const startDate = new Date(contract.start_date);
  const endDate = new Date(contract.end_date);
  
  // Calculate months between dates
  const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
    (endDate.getMonth() - startDate.getMonth());
  
  const depositValue = contract.deposit_value || (contract.rent_value * (contract.deposit_months || 2));

  // Get owner CPF from linked owner or fallback
  const ownerCpf = contract.owner?.cpf || '___________________';
  
  // Map guarantee type
  let guaranteeType: RentalGuaranteeType = 'caucao';
  const gtEnum = contract.guarantee_type_enum;
  if (gtEnum) {
    guaranteeType = gtEnum;
  } else if (contract.guarantee_type) {
    if (contract.guarantee_type.toLowerCase().includes('fiador')) {
      guaranteeType = 'fiador';
    } else if (contract.guarantee_type.toLowerCase().includes('seguro')) {
      guaranteeType = 'seguro_fiador';
    }
  }

  // Map contract type
  const contractType: RentalContractType = contract.contract_type || 'residencial';

  return {
    contractType,
    guaranteeType,
    
    // Landlord
    landlordName: contract.owner_name,
    landlordCpfCnpj: ownerCpf,
    landlordEmail: contract.owner_email || undefined,
    landlordPhone: contract.owner_phone || undefined,
    
    // Tenant
    tenantName: contract.tenant?.full_name || '___________________',
    tenantCpf: contract.tenant?.cpf || '___________________',
    tenantRg: contract.tenant?.rg || undefined,
    tenantProfession: contract.tenant?.profession || undefined,
    tenantAddress: contract.tenant?.address || undefined,
    tenantEmail: contract.tenant?.email || undefined,
    tenantPhone: contract.tenant?.phone || undefined,
    
    // Guarantor (if applicable)
    guarantorName: contract.guarantor?.full_name,
    guarantorCpf: contract.guarantor?.cpf || undefined,
    guarantorRg: contract.guarantor?.rg || undefined,
    guarantorAddress: contract.guarantor?.address || undefined,
    guarantorPropertyAddress: contract.guarantor?.property_address || undefined,
    guarantorPropertyRegistration: contract.guarantor?.property_registration || undefined,
    guarantorPhone: contract.guarantor?.phone || undefined,
    
    // Insurance
    insuranceCompany: contract.insurance_company || undefined,
    insurancePolicyNumber: contract.insurance_policy_number || undefined,
    insuranceValue: contract.insurance_value || undefined,
    
    // Property
    propertyAddress: `${contract.property_address}, ${contract.property_neighborhood || ''}, ${contract.property_city} - ${contract.property_state}`.replace(/, ,/g, ','),
    propertyType: contract.property_type,
    
    // Agency
    agencyName: agencyData?.name || 'Venda Direta Hoje',
    agencyCnpj: agencyData?.cnpj || 'CNPJ: 00.000.000/0001-00',
    
    // Contract terms
    durationMonths: monthsDiff,
    startDate,
    endDate,
    
    // Values
    rentValue: contract.rent_value,
    condominiumFee: contract.condominium_fee || undefined,
    iptuValue: contract.iptu_value || undefined,
    depositMonths: contract.deposit_months || 2,
    depositValue,
    
    // Commercial specific
    allowedActivity: contract.allowed_activity || undefined,
    renovationTerms: contract.renovation_terms || undefined,
    commercialPointClause: contract.commercial_point_clause || false,
    
    // Location
    city: contract.property_city,
  };
}

// Generate HTML for full contract with annexes
export function generateFullContractHTML(
  contract: RentalContract,
  agencyData?: { name: string; cnpj: string },
  annexOptions?: AnnexOptions
): string {
  const templateData = convertContractToTemplateData(contract, agencyData);
  let fullHTML = generateAdvancedContractHTML(templateData);
  
  // Include annexes if requested
  if (annexOptions) {
    const annexData = createAnnexDataFromContract(contract, agencyData || { name: 'Venda Direta Hoje', cnpj: 'CNPJ: 00.000.000/0001-00' });
    const annexes: string[] = [];
    
    if (annexOptions.includeInspection) {
      annexes.push(generateInspectionTermHTML(annexData));
    }
    if (annexOptions.includeRegulations) {
      annexes.push(generateInternalRegulationsHTML(annexData));
    }
    if (annexOptions.includeLGPD) {
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
  }
  
  return fullHTML;
}

// Generate PDF using jsPDF with the new templates
export async function generateContractPDF(
  contract: RentalContract,
  agencyData?: { name: string; cnpj: string },
  annexOptions?: AnnexOptions
): Promise<Blob> {
  const templateData = convertContractToTemplateData(contract, agencyData);
  
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

  const addNewPage = () => {
    pdf.addPage();
    y = 20;
  };

  // Determine contract type
  const isCommercial = templateData.contractType === 'comercial';
  const guaranteeLabel = templateData.guaranteeType === 'fiador' ? 'FIANÇA' : 
                         templateData.guaranteeType === 'caucao' ? 'CAUÇÃO' : 
                         'SEGURO-FIANÇA';
  
  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  const title = isCommercial ? 'CONTRATO DE LOCAÇÃO COMERCIAL' : 'CONTRATO DE LOCAÇÃO RESIDENCIAL';
  pdf.text(title, pageWidth / 2, y, { align: 'center' });
  y += 6;
  pdf.text('COM ADMINISTRAÇÃO IMOBILIÁRIA E ASSINATURA ELETRÔNICA', pageWidth / 2, y, { align: 'center' });
  y += 12;
  
  // Identification
  addText('IDENTIFICAÇÃO DAS PARTES', 11, true);
  addSpace(3);
  
  addText(`LOCADOR: ${templateData.landlordName}, inscrito no CPF/CNPJ nº ${templateData.landlordCpfCnpj}.`);
  addSpace(2);
  addText(`LOCATÁRIO: ${templateData.tenantName}, inscrito no CPF nº ${templateData.tenantCpf}.`);
  addSpace(2);
  addText(`IMOBILIÁRIA ADMINISTRADORA: ${templateData.agencyName}, pessoa jurídica de direito privado, inscrita no ${templateData.agencyCnpj}, doravante denominada ADMINISTRADORA.`);
  addSpace(5);
  
  // CLÁUSULA 1 - DO OBJETO
  addText('CLÁUSULA 1ª – DO OBJETO' + (isCommercial ? ' E DESTINAÇÃO' : ''), 11, true);
  if (isCommercial) {
    addText(`O LOCADOR dá em locação ao LOCATÁRIO o imóvel situado à: ${templateData.propertyAddress}, destinado exclusivamente ao exercício de atividade comercial: ${templateData.allowedActivity || 'Atividade comercial a definir'}. É expressamente vedada a alteração da atividade sem autorização prévia e por escrito do LOCADOR e da ADMINISTRADORA.`);
  } else {
    addText(`O LOCADOR dá em locação ao LOCATÁRIO o imóvel situado à: ${templateData.propertyAddress}, destinado exclusivamente para fins residenciais, sendo expressamente vedada qualquer utilização comercial, profissional, industrial ou diversa da aqui prevista.`);
  }
  addSpace(5);
  
  // CLÁUSULA 2 - DO PRAZO
  addText('CLÁUSULA 2ª – DO PRAZO DA LOCAÇÃO', 11, true);
  const startDateStr = format(templateData.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const endDateStr = format(templateData.endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  addText(`O prazo da locação é de ${templateData.durationMonths} meses, iniciando-se em ${startDateStr} e encerrando-se em ${endDateStr}, podendo ser ${isCommercial ? 'renovado mediante novo ajuste entre as partes' : 'prorrogado nos termos da legislação vigente'}.`);
  addSpace(5);
  
  // CLÁUSULA 3 - DO VALOR DO ALUGUEL
  addText('CLÁUSULA 3ª – DO VALOR DO ALUGUEL', 11, true);
  addText(`O aluguel mensal é de ${formatCurrencyForContract(templateData.rentValue)}, com vencimento todo dia 10, pago por boleto, Pix ou meio indicado pela ADMINISTRADORA. O não recebimento do aviso de cobrança não isenta o pagamento.`);
  addSpace(5);
  
  // CLÁUSULA 4 - DO REAJUSTE
  addText('CLÁUSULA 4ª – DO REAJUSTE', 11, true);
  addText('O aluguel será reajustado anualmente, ou no menor período legal permitido, pelo índice IGP-M/FGV, ou outro que venha a substituí-lo.');
  addSpace(5);
  
  // CLÁUSULA 5 - DA GARANTIA
  addText('CLÁUSULA 5ª – DA GARANTIA LOCATÍCIA', 11, true);
  const depositValue = templateData.depositValue || (templateData.rentValue * (templateData.depositMonths || 2));
  addText(`A locação é garantida por ${guaranteeLabel}, nos termos da Lei nº 8.245/91.`);
  addText(`§1º Caução: O LOCATÁRIO entrega o valor de ${formatCurrencyForContract(depositValue)}, equivalente a até ${isCommercial ? '03 (três)' : '02 (dois)'} meses de aluguel, a ser restituída ao final, descontados débitos e danos.`);
  addText(`§2º Fiador: O FIADOR assume responsabilidade solidária e ilimitada, renunciando aos benefícios legais.`);
  addText(`§3º Seguro-fiança: O LOCATÁRIO obriga-se a manter seguro-fiança vigente, sob pena de rescisão.`);
  addSpace(5);
  
  // CLÁUSULA 6 - DOS ENCARGOS
  addText('CLÁUSULA 6ª – DOS ENCARGOS E ' + (isCommercial ? 'OBRIGAÇÕES' : 'DESPESAS'), 11, true);
  addText('São de responsabilidade exclusiva do LOCATÁRIO: Aluguel, Condomínio, IPTU, Água, Energia, Gás, Taxas ordinárias e multas decorrentes do uso do imóvel.');
  if (isCommercial) {
    addText('Também: Licenças, alvarás, adequações legais do negócio e manutenção necessária à atividade.');
  }
  addSpace(5);
  
  // CLÁUSULA 7 - DA ADMINISTRAÇÃO ou BENFEITORIAS (comercial)
  if (isCommercial) {
    addText('CLÁUSULA 7ª – DAS BENFEITORIAS', 11, true);
    addText('Quaisquer benfeitorias somente poderão ser realizadas com autorização prévia e escrita do LOCADOR. As benfeitorias não serão indenizadas, salvo acordo expresso em contrário.');
    addSpace(5);
    
    addText('CLÁUSULA 8ª – DA ADMINISTRAÇÃO IMOBILIÁRIA', 11, true);
  } else {
    addText('CLÁUSULA 7ª – DA ADMINISTRAÇÃO IMOBILIÁRIA', 11, true);
  }
  addText('A ADMINISTRADORA fica autorizada a: Administrar o contrato, cobrar valores, receber pagamentos, notificar o LOCATÁRIO, promover cobrança extrajudicial e judicial, propor ação de despejo e representar o LOCADOR judicialmente. O LOCATÁRIO reconhece e aceita essa representação.');
  addSpace(5);
  
  // CLÁUSULA 8/9 - DA INADIMPLÊNCIA
  const clauseNum = isCommercial ? '9ª' : '8ª';
  addText(`CLÁUSULA ${clauseNum} – DA INADIMPLÊNCIA`, 11, true);
  addText('O atraso no pagamento implicará: Multa de 2%, Juros de 1% ao mês e Correção monetária.');
  addSpace(5);
  
  // CLÁUSULA 9/10 - NEGATIVAÇÃO E PROTESTO
  const clauseNum2 = isCommercial ? '10ª' : '9ª';
  addText(`CLÁUSULA ${clauseNum2} – DA NEGATIVAÇÃO E PROTESTO`, 11, true);
  addText('O LOCATÁRIO autoriza expressamente: Inclusão em SPC, Serasa e similares, Protesto do débito em cartório e Compartilhamento de dados para cobrança, conforme a legislação vigente.');
  addSpace(5);
  
  // CLÁUSULA 10/11 - RESCISÃO E DESPEJO
  const clauseNum3 = isCommercial ? '11ª' : '10ª';
  addText(`CLÁUSULA ${clauseNum3} – ${isCommercial ? 'DA RESCISÃO E DESPEJO' : 'DO DESPEJO'}`, 11, true);
  addText('O descumprimento contratual autoriza: Rescisão imediata, Cobrança judicial e Ação de despejo, observado o devido processo legal.');
  addSpace(5);
  
  if (!isCommercial) {
    // CLÁUSULA 11 - DA RESCISÃO (residencial)
    addText('CLÁUSULA 11ª – DA RESCISÃO', 11, true);
    addText('O contrato poderá ser rescindido: Por infração legal ou contratual, Por falta de pagamento ou Por uso indevido do imóvel, aplicando-se as penalidades previstas em lei.');
    addSpace(5);
    
    // CLÁUSULA 12 - DA VISTORIA (residencial)
    addText('CLÁUSULA 12ª – DA VISTORIA E CONSERVAÇÃO', 11, true);
    addText('O LOCATÁRIO declara receber o imóvel em perfeito estado, obrigando-se a devolvê-lo nas mesmas condições, ressalvado o desgaste natural.');
    addSpace(5);
    
    // CLÁUSULA 13 - DA DEVOLUÇÃO (residencial)
    addText('CLÁUSULA 13ª – DA DEVOLUÇÃO DO IMÓVEL', 11, true);
    addText('A entrega das chaves somente será considerada válida após: Quitação integral de débitos, Vistoria final aprovada e Entrega formal à ADMINISTRADORA.');
    addSpace(5);
  }
  
  // CLÁUSULA 12/14 - ASSINATURA ELETRÔNICA
  const clauseNum4 = isCommercial ? '12ª' : '14ª';
  addText(`CLÁUSULA ${clauseNum4} – DA ASSINATURA ELETRÔNICA`, 11, true);
  addText('As partes reconhecem como válida a assinatura eletrônica deste contrato, nos termos da legislação vigente, conferindo-lhe plena validade jurídica.');
  addSpace(5);
  
  if (isCommercial) {
    // CLÁUSULA 13 - CONFIDENCIALIDADE (comercial)
    addText('CLÁUSULA 13ª – DA CONFIDENCIALIDADE', 11, true);
    addText('As condições comerciais deste contrato são confidenciais, não podendo ser divulgadas sem autorização.');
    addSpace(5);
    
    // CLÁUSULA 14 - DO FORO (comercial)
    addText('CLÁUSULA 14ª – DO FORO', 11, true);
  } else {
    // Adicionar cláusula de foro com número correto
  }
  addText(`Fica eleito o foro da comarca de ${templateData.city}, renunciando a qualquer outro.`);
  addSpace(8);
  
  addText('E por estarem de pleno acordo, assinam eletronicamente o presente instrumento.');
  addSpace(5);
  
  // Date
  const todayStr = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(`${templateData.city}, ${todayStr}`, pageWidth - margin, y, { align: 'right' });
  y += 20;
  
  // Check if we need a new page for signatures
  if (y > 220) {
    addNewPage();
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
  pdf.text(templateData.landlordName, margin + lineWidth / 2, signatureY + 10, { align: 'center' });
  
  // Right signature - LOCATÁRIO
  pdf.line(pageWidth - margin - lineWidth, signatureY, pageWidth - margin, signatureY);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LOCATÁRIO', pageWidth - margin - lineWidth / 2, signatureY + 5, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.text(templateData.tenantName, pageWidth - margin - lineWidth / 2, signatureY + 10, { align: 'center' });
  
  // Second row signatures
  const signatureY2 = signatureY + 30;
  
  // ADMINISTRADORA
  pdf.line(margin, signatureY2, margin + lineWidth, signatureY2);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ADMINISTRADORA', margin + lineWidth / 2, signatureY2 + 5, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.text(templateData.agencyName, margin + lineWidth / 2, signatureY2 + 10, { align: 'center' });
  
  // TESTEMUNHA
  pdf.line(pageWidth - margin - lineWidth, signatureY2, pageWidth - margin, signatureY2);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TESTEMUNHA', pageWidth - margin - lineWidth / 2, signatureY2 + 5, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.text('Nome: ________________', pageWidth - margin - lineWidth / 2, signatureY2 + 10, { align: 'center' });
  pdf.text('CPF: _________________', pageWidth - margin - lineWidth / 2, signatureY2 + 15, { align: 'center' });

  // Add annexes if requested
  if (annexOptions) {
    const annexData = createAnnexDataFromContract(
      contract, 
      agencyData || { name: 'Venda Direta Hoje', cnpj: 'CNPJ: 00.000.000/0001-00' }
    );

    if (annexOptions.includeInspection) {
      addNewPage();
      addAnnexToPDF(pdf, 'ANEXO I – TERMO DE VISTORIA DO IMÓVEL', annexData, 'inspection', margin, pageWidth, contentWidth);
    }

    if (annexOptions.includeRegulations) {
      addNewPage();
      addAnnexToPDF(pdf, 'ANEXO II – REGULAMENTO INTERNO E NORMAS DE USO', annexData, 'regulations', margin, pageWidth, contentWidth);
    }

    if (annexOptions.includeLGPD) {
      addNewPage();
      addAnnexToPDF(pdf, 'ANEXO III – TERMO DE CONSENTIMENTO LGPD', annexData, 'lgpd', margin, pageWidth, contentWidth);
    }
  }
  
  return pdf.output('blob');
}

// Helper function to add annexes to PDF
function addAnnexToPDF(
  pdf: jsPDF,
  title: string,
  annexData: AnnexData,
  type: 'inspection' | 'regulations' | 'lgpd',
  margin: number,
  pageWidth: number,
  contentWidth: number
) {
  let y = 20;
  
  const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, margin, y);
      y += fontSize * 0.4;
    });
    y += 2;
  };

  const addSpace = (space: number = 5) => { y += space; };

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text(title, pageWidth / 2, y, { align: 'center' });
  y += 6;
  pdf.setFontSize(10);
  pdf.text(`(Integrante do Contrato de Locação nº ${annexData.contractNumber})`, pageWidth / 2, y, { align: 'center' });
  y += 12;

  if (type === 'inspection') {
    addText(`Imóvel: ${annexData.propertyAddress}`, 11, true);
    addSpace(5);
    addText('1. ESTADO GERAL DO IMÓVEL', 11, true);
    addText('O imóvel encontra-se nas seguintes condições: [ ] Excelente  [ ] Bom  [ ] Regular');
    addSpace(3);
    addText('Observações gerais: _______________________________________________');
    addSpace(5);
    addText('2. AMBIENTES', 11, true);
    addText('Sala: _________________ | Quartos: _________________ | Cozinha: _________________');
    addText('Banheiros: _________________ | Área externa: _________________');
    addSpace(5);
    addText('3. INSTALAÇÕES', 11, true);
    addText('Elétrica: [ ] OK [ ] Observações: _________________');
    addText('Hidráulica: [ ] OK [ ] Observações: _________________');
    addText('Pintura: [ ] OK [ ] Observações: _________________');
    addSpace(5);
    addText('4. REGISTRO FOTOGRÁFICO', 11, true);
    addText('As fotos anexadas ao sistema fazem parte integrante deste termo.');
    addSpace(5);
    addText('5. RESPONSABILIDADE', 11, true);
    addText('O LOCATÁRIO compromete-se a devolver o imóvel no mesmo estado, ressalvado desgaste natural.');
  } else if (type === 'regulations') {
    addText('Este regulamento integra o contrato de locação e deve ser rigorosamente cumprido.');
    addSpace(5);
    addText('1. USO DO IMÓVEL', 11, true);
    addText('• Utilização exclusivamente conforme o contrato');
    addText('• Proibido sublocar, ceder ou emprestar sem autorização escrita');
    addText('• Proibidas atividades ilegais ou que causem incômodo');
    addSpace(5);
    addText('2. CONDOMÍNIO E VIZINHANÇA', 11, true);
    addText('• Cumprir normas do condomínio e respeitar horários de silêncio');
    addText('• Manter boa convivência com vizinhos');
    addSpace(5);
    addText('3. OBRAS E ALTERAÇÕES', 11, true);
    addText('• Proibidas alterações estruturais sem autorização prévia');
    addText('• Benfeitorias não serão indenizadas, salvo acordo escrito');
    addSpace(5);
    addText('4. RESPONSABILIDADE POR DANOS', 11, true);
    addText('O LOCATÁRIO responde por danos ao imóvel, áreas comuns e multas.');
    addSpace(5);
    addText('5. PENALIDADES', 11, true);
    addText('O descumprimento pode resultar em multas, notificações, rescisão ou ação judicial.');
  } else if (type === 'lgpd') {
    addText(`Em conformidade com a Lei nº 13.709/2018 (LGPD), o LOCATÁRIO autoriza o tratamento de seus dados pessoais pela ${annexData.agencyName}.`);
    addSpace(5);
    addText('1. FINALIDADES DO TRATAMENTO', 11, true);
    addText('• Administração do contrato e cobrança de valores');
    addText('• Comunicação contratual e cumprimento de obrigações legais');
    addText('• Inclusão em cadastros de proteção ao crédito, se aplicável');
    addSpace(5);
    addText('2. DADOS TRATADOS', 11, true);
    addText('Nome, CPF/RG, endereço, contatos e informações financeiras do contrato.');
    addSpace(5);
    addText('3. COMPARTILHAMENTO', 11, true);
    addText('Os dados poderão ser compartilhados para execução do contrato, cumprimento legal e proteção do crédito.');
    addSpace(5);
    addText('4. DIREITOS DO TITULAR', 11, true);
    addText('O titular pode acessar, corrigir, eliminar dados e revogar consentimento.');
    addSpace(5);
    addText('5. PRAZO DE ARMAZENAMENTO', 11, true);
    addText('Os dados serão mantidos pelo período necessário ao cumprimento das finalidades legais.');
  }

  // Signatures for annexes
  y = Math.max(y + 30, 240);
  if (y > 250) {
    pdf.addPage();
    y = 60;
  }
  
  const todayStr = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`${annexData.city}, ${todayStr}`, pageWidth - margin, y, { align: 'right' });
  y += 5;
  pdf.text('Assinatura eletrônica válida nos termos legais.', pageWidth / 2, y, { align: 'center' });
  y += 15;
  
  const lineWidth = 70;
  pdf.line(margin, y, margin + lineWidth, y);
  pdf.line(pageWidth - margin - lineWidth, y, pageWidth - margin, y);
  y += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.text('LOCADOR', margin + lineWidth / 2, y, { align: 'center' });
  pdf.text('LOCATÁRIO', pageWidth - margin - lineWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.setFont('helvetica', 'normal');
  pdf.text(annexData.landlordName, margin + lineWidth / 2, y, { align: 'center' });
  pdf.text(annexData.tenantName, pageWidth - margin - lineWidth / 2, y, { align: 'center' });
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
