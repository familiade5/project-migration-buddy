import { RentalContractType, RentalGuaranteeType } from '@/types/rentalProperty';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface ContractTemplateData {
  // Contract type
  contractType: RentalContractType;
  guaranteeType: RentalGuaranteeType;
  
  // Landlord (Locador)
  landlordName: string;
  landlordCpfCnpj: string;
  landlordAddress?: string;
  landlordEmail?: string;
  landlordPhone?: string;
  
  // Tenant (Locatário)
  tenantName: string;
  tenantCpf: string;
  tenantRg?: string;
  tenantProfession?: string;
  tenantAddress?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  
  // Guarantor (Fiador) - only for fiador type
  guarantorName?: string;
  guarantorCpf?: string;
  guarantorRg?: string;
  guarantorAddress?: string;
  guarantorPropertyAddress?: string;
  guarantorPropertyRegistration?: string;
  guarantorPhone?: string;
  
  // Insurance (Seguro-Fiador) - only for seguro_fiador type
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insuranceValue?: number;
  
  // Property
  propertyAddress: string;
  propertyType: string;
  propertyRegistration?: string;
  
  // Agency
  agencyName: string;
  agencyCnpj: string;
  
  // Contract terms
  durationMonths: number;
  startDate: Date;
  endDate: Date;
  
  // Values
  rentValue: number;
  condominiumFee?: number;
  iptuValue?: number;
  depositMonths?: number;
  depositValue?: number;
  
  // Commercial specific
  allowedActivity?: string;
  renovationTerms?: string;
  commercialPointClause?: boolean;
  
  // Location
  city: string;
}

export function formatCurrencyForContract(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDateForContract(date: Date): string {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

function generateGuarantorClause(data: ContractTemplateData): string {
  if (data.guaranteeType !== 'fiador') return '';
  
  return `
  <div class="clause">
    <p class="clause-title">CLÁUSULA 4ª – DA GARANTIA (FIADOR)</p>
    <p>Como garantia das obrigações assumidas neste contrato, comparece como FIADOR(A) e principal pagador(a):</p>
    <p><strong>${data.guarantorName || '___________________'}</strong>, CPF: ${data.guarantorCpf || '___________________'}, RG: ${data.guarantorRg || '___________________'}, residente e domiciliado(a) à ${data.guarantorAddress || '___________________'}.</p>
    
    <p class="mt-2">O(A) FIADOR(A) é proprietário(a) do imóvel situado à ${data.guarantorPropertyAddress || '___________________'}, Matrícula nº ${data.guarantorPropertyRegistration || '___________________'}, livre e desembaraçado de quaisquer ônus.</p>
    
    <p class="mt-2">O(A) FIADOR(A) declara que:</p>
    <p class="list-item">a) Assume solidariamente todas as obrigações do LOCATÁRIO;</p>
    <p class="list-item">b) Renuncia expressamente ao benefício de ordem previsto no art. 827 do Código Civil;</p>
    <p class="list-item">c) Renuncia ao benefício de exoneração previsto no art. 835 do Código Civil;</p>
    <p class="list-item">d) Mantém a fiança até a efetiva desocupação do imóvel e quitação de todas as obrigações;</p>
    <p class="list-item">e) A fiança abrange o principal, juros, multas, correção monetária, custas processuais e honorários advocatícios.</p>
    
    <p class="mt-2">Havendo falecimento, incapacidade ou insolvência do(a) FIADOR(A), ou ainda alienação do imóvel dado em garantia, o LOCATÁRIO deverá apresentar novo fiador idôneo no prazo de 30 (trinta) dias, sob pena de rescisão contratual.</p>
  </div>`;
}

function generateDepositClause(data: ContractTemplateData): string {
  if (data.guaranteeType !== 'caucao') return '';
  
  const depositValue = data.depositValue || (data.rentValue * (data.depositMonths || 3));
  const months = data.depositMonths || 3;
  
  return `
  <div class="clause">
    <p class="clause-title">CLÁUSULA 4ª – DA GARANTIA (CAUÇÃO EM DINHEIRO)</p>
    <p>Como garantia das obrigações assumidas neste contrato, o LOCATÁRIO deposita a título de caução o valor correspondente a ${months.toString().padStart(2, '0')} (${months === 1 ? 'um' : months === 2 ? 'dois' : 'três'}) mês(es) de aluguel, totalizando <strong>${formatCurrencyForContract(depositValue)}</strong>, nos termos do art. 38, §2º da Lei 8.245/91.</p>
    
    <p class="mt-2">O valor da caução:</p>
    <p class="list-item">a) Será depositado em caderneta de poupança autorizada pelo Poder Público, em nome do LOCADOR;</p>
    <p class="list-item">b) Será devolvido ao LOCATÁRIO ao final da locação, acrescido dos rendimentos da poupança;</p>
    <p class="list-item">c) Poderá ser utilizado para cobrir eventuais débitos, danos ao imóvel ou encargos não pagos;</p>
    <p class="list-item">d) Caso insuficiente para cobrir os débitos, o LOCATÁRIO permanece responsável pelo saldo devedor;</p>
    <p class="list-item">e) Não poderá ser utilizado como pagamento dos últimos aluguéis.</p>
    
    <p class="mt-2">A devolução da caução ocorrerá em até 30 (trinta) dias após a entrega das chaves, mediante vistoria de saída aprovada e quitação de todos os encargos.</p>
  </div>`;
}

function generateInsuranceClause(data: ContractTemplateData): string {
  if (data.guaranteeType !== 'seguro_fiador') return '';
  
  return `
  <div class="clause">
    <p class="clause-title">CLÁUSULA 4ª – DA GARANTIA (SEGURO-FIANÇA)</p>
    <p>Como garantia das obrigações assumidas neste contrato, o LOCATÁRIO contratou seguro-fiança locatícia junto à <strong>${data.insuranceCompany || '___________________'}</strong>, Apólice nº ${data.insurancePolicyNumber || '___________________'}, no valor de <strong>${formatCurrencyForContract(data.insuranceValue || 0)}</strong>.</p>
    
    <p class="mt-2">O seguro-fiança:</p>
    <p class="list-item">a) Deverá cobrir todas as obrigações do LOCATÁRIO previstas neste contrato;</p>
    <p class="list-item">b) Deverá ser renovado anualmente pelo LOCATÁRIO, com antecedência mínima de 30 dias do vencimento;</p>
    <p class="list-item">c) A não renovação do seguro configura infração contratual grave;</p>
    <p class="list-item">d) O comprovante de renovação deve ser entregue à ADMINISTRADORA;</p>
    <p class="list-item">e) Cobre aluguéis, encargos, multas, danos ao imóvel e custas judiciais.</p>
    
    <p class="mt-2">A cobertura do seguro inclui:</p>
    <p class="list-item">• Aluguéis e encargos não pagos</p>
    <p class="list-item">• Multa por rescisão antecipada</p>
    <p class="list-item">• Danos ao imóvel</p>
    <p class="list-item">• Pintura interna e externa</p>
    <p class="list-item">• Custas processuais e honorários advocatícios</p>
  </div>`;
}

function generateCommercialClauses(data: ContractTemplateData): string {
  if (data.contractType !== 'comercial') return '';
  
  let clauses = '';
  
  // Activity clause
  clauses += `
  <div class="clause">
    <p class="clause-title">CLÁUSULA ADICIONAL I – DA ATIVIDADE PERMITIDA</p>
    <p>O imóvel destina-se exclusivamente ao exercício da seguinte atividade comercial:</p>
    <p><strong>${data.allowedActivity || '___________________'}</strong></p>
    <p class="mt-2">É vedado ao LOCATÁRIO:</p>
    <p class="list-item">a) Alterar a atividade sem prévia autorização escrita do LOCADOR;</p>
    <p class="list-item">b) Exercer atividade ilícita, perigosa, nociva ou que viole a legislação vigente;</p>
    <p class="list-item">c) Ceder, sublocar ou emprestar o imóvel para terceiros exercerem atividade diversa.</p>
  </div>`;
  
  // Renovations/Improvements clause
  clauses += `
  <div class="clause">
    <p class="clause-title">CLÁUSULA ADICIONAL II – DAS BENFEITORIAS E ADAPTAÇÕES</p>
    <p>Quanto às benfeitorias realizadas no imóvel:</p>
    <p class="list-item">a) As benfeitorias NECESSÁRIAS serão indenizáveis, mediante prévia autorização e comprovação de pagamento;</p>
    <p class="list-item">b) As benfeitorias ÚTEIS somente serão indenizáveis se previamente autorizadas por escrito;</p>
    <p class="list-item">c) As benfeitorias VOLUPTUÁRIAS não serão indenizadas em hipótese alguma;</p>
    <p class="list-item">d) Todas as adaptações realizadas incorporam-se ao imóvel, salvo disposição em contrário;</p>
    <p class="list-item">e) O LOCATÁRIO poderá remover as benfeitorias que não causem dano ao imóvel.</p>
    ${data.renovationTerms ? `<p class="mt-2"><strong>Termos específicos:</strong> ${data.renovationTerms}</p>` : ''}
  </div>`;
  
  // Commercial point clause (Lei 8.245, Art. 51)
  if (data.commercialPointClause) {
    clauses += `
    <div class="clause">
      <p class="clause-title">CLÁUSULA ADICIONAL III – DO DIREITO AO PONTO COMERCIAL</p>
      <p>Nos termos do art. 51 da Lei 8.245/91 (Lei do Inquilinato), o LOCATÁRIO terá direito à renovação compulsória do contrato desde que:</p>
      <p class="list-item">a) O contrato a renovar tenha sido celebrado por escrito e com prazo determinado;</p>
      <p class="list-item">b) O prazo mínimo do contrato seja de 5 (cinco) anos, podendo ser por soma de contratos sucessivos;</p>
      <p class="list-item">c) O LOCATÁRIO esteja explorando o mesmo ramo de comércio há pelo menos 3 (três) anos.</p>
      <p class="mt-2">A ação renovatória deverá ser proposta no interregno de 1 (um) ano a 6 (seis) meses anteriores ao término do contrato.</p>
      <p class="mt-2">O LOCADOR poderá opor-se à renovação nos casos previstos no art. 52 da Lei 8.245/91.</p>
    </div>`;
  }
  
  return clauses;
}

function generateCommercialContractHTML(data: ContractTemplateData): string {
  const guaranteeLabel = data.guaranteeType === 'fiador' ? 'FIANÇA' : 
                         data.guaranteeType === 'caucao' ? 'CAUÇÃO' : 
                         'SEGURO-FIANÇA';
  
  const depositValue = data.depositValue || (data.rentValue * (data.depositMonths || 3));

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Contrato de Locação Comercial</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      color: #333;
    }
    h1 {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    h2 {
      text-align: center;
      font-size: 12pt;
      font-weight: bold;
      margin-bottom: 30px;
      text-transform: uppercase;
    }
    .section-title {
      font-weight: bold;
      font-size: 11pt;
      margin-top: 25px;
      margin-bottom: 15px;
      text-transform: uppercase;
    }
    .intro {
      text-align: justify;
      margin-bottom: 20px;
    }
    .parties {
      margin-bottom: 30px;
    }
    .party {
      margin-bottom: 15px;
      text-align: justify;
    }
    .clause {
      margin-bottom: 20px;
      text-align: justify;
    }
    .clause-title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .list-item {
      margin-left: 20px;
      margin-bottom: 5px;
    }
    .paragraph {
      margin-bottom: 10px;
      text-align: justify;
    }
    .signatures {
      margin-top: 60px;
    }
    .signature-block {
      display: flex;
      justify-content: space-between;
      margin-top: 80px;
    }
    .signature-line {
      width: 45%;
      text-align: center;
    }
    .signature-line hr {
      border: none;
      border-top: 1px solid #333;
      margin-bottom: 10px;
    }
    .signature-label {
      font-weight: bold;
    }
    .date-location {
      text-align: right;
      margin-top: 40px;
    }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <h1>CONTRATO DE LOCAÇÃO COMERCIAL</h1>
  <h2>COM ADMINISTRAÇÃO IMOBILIÁRIA E ASSINATURA ELETRÔNICA</h2>
  
  <p class="section-title">IDENTIFICAÇÃO DAS PARTES</p>
  
  <div class="parties">
    <p class="party"><strong>LOCADOR:</strong> ${data.landlordName}, inscrito no CPF/CNPJ nº ${data.landlordCpfCnpj}${data.landlordAddress ? `, com endereço em ${data.landlordAddress}` : ''}.</p>
    
    <p class="party"><strong>LOCATÁRIO:</strong> ${data.tenantName}, inscrito no CPF/CNPJ nº ${data.tenantCpf}${data.tenantAddress ? `, com endereço em ${data.tenantAddress}` : ''}.</p>
    
    <p class="party"><strong>IMOBILIÁRIA ADMINISTRADORA:</strong> ${data.agencyName}, pessoa jurídica de direito privado, inscrita no CNPJ nº ${data.agencyCnpj}, doravante denominada ADMINISTRADORA.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 1ª – DO OBJETO E DESTINAÇÃO</p>
    <p>O LOCADOR dá em locação ao LOCATÁRIO o imóvel situado à:</p>
    <p><strong>${data.propertyAddress}</strong>, destinado exclusivamente ao exercício de atividade comercial, conforme descrita abaixo:</p>
    <p><strong>${data.allowedActivity || 'Atividade comercial a definir'}</strong></p>
    <p>É expressamente vedada a alteração da atividade sem autorização prévia e por escrito do LOCADOR e da ADMINISTRADORA.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 2ª – DO PRAZO DA LOCAÇÃO</p>
    <p>O prazo da locação é de <strong>${data.durationMonths} meses</strong>, iniciando-se em <strong>${formatDateForContract(data.startDate)}</strong> e encerrando-se em <strong>${formatDateForContract(data.endDate)}</strong>, podendo ser renovado mediante novo ajuste entre as partes.</p>
    <p>As partes reconhecem que não há garantia automática de renovação, nos termos da legislação vigente.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 3ª – DO VALOR DO ALUGUEL</p>
    <p>O aluguel mensal é de <strong>${formatCurrencyForContract(data.rentValue)}</strong>, com vencimento todo dia <strong>10</strong>, pago por boleto, Pix ou meio indicado pela ADMINISTRADORA.</p>
    <p>O não recebimento do aviso de cobrança não isenta o pagamento.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 4ª – DO REAJUSTE</p>
    <p>O aluguel será reajustado anualmente, ou no menor período legal permitido, pelo índice IGP-M/FGV, ou outro que venha a substituí-lo.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 5ª – DA GARANTIA LOCATÍCIA</p>
    <p>A locação será garantida por <strong>${guaranteeLabel}</strong>, conforme opção escolhida:</p>
    
    <p class="paragraph"><strong>§1º – Caução</strong></p>
    <p>O LOCATÁRIO entrega o valor de <strong>${formatCurrencyForContract(depositValue)}</strong>, equivalente a até 03 (três) meses de aluguel, a título de garantia, a ser restituída ao final da locação, descontados débitos e danos.</p>
    
    <p class="paragraph"><strong>§2º – Fiador</strong></p>
    <p>O FIADOR assume responsabilidade solidária e ilimitada por todas as obrigações, renunciando aos benefícios legais, inclusive o benefício de ordem.</p>
    
    <p class="paragraph"><strong>§3º – Seguro-fiança</strong></p>
    <p>O LOCATÁRIO obriga-se a manter seguro-fiança vigente durante toda a locação, sob pena de rescisão imediata.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 6ª – DOS ENCARGOS E OBRIGAÇÕES</p>
    <p>São de responsabilidade exclusiva do LOCATÁRIO:</p>
    <p class="list-item">• Aluguel</p>
    <p class="list-item">• Condomínio (integral, inclusive taxas extraordinárias, se aplicável)</p>
    <p class="list-item">• IPTU</p>
    <p class="list-item">• Taxas municipais</p>
    <p class="list-item">• Licenças e alvarás</p>
    <p class="list-item">• Adequações legais do negócio</p>
    <p class="list-item">• Manutenção interna e estrutural necessária à atividade</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 7ª – DAS BENFEITORIAS</p>
    <p>Quaisquer benfeitorias somente poderão ser realizadas com autorização prévia e escrita do LOCADOR.</p>
    <p>As benfeitorias não serão indenizadas, ainda que necessárias ou úteis, salvo acordo expresso em contrário.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 8ª – DA ADMINISTRAÇÃO IMOBILIÁRIA</p>
    <p>A ADMINISTRADORA fica autorizada a:</p>
    <p class="list-item">• Administrar o contrato</p>
    <p class="list-item">• Cobrar valores</p>
    <p class="list-item">• Receber pagamentos</p>
    <p class="list-item">• Notificar o LOCATÁRIO</p>
    <p class="list-item">• Promover cobrança extrajudicial e judicial</p>
    <p class="list-item">• Propor ação de despejo</p>
    <p class="list-item">• Representar o LOCADOR judicialmente</p>
    <p>O LOCATÁRIO reconhece e aceita essa representação.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 9ª – DA INADIMPLÊNCIA</p>
    <p>O atraso no pagamento implicará:</p>
    <p class="list-item">• Multa de 2%</p>
    <p class="list-item">• Juros de 1% ao mês</p>
    <p class="list-item">• Correção monetária</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 10ª – DA NEGATIVAÇÃO E PROTESTO</p>
    <p>O LOCATÁRIO autoriza expressamente:</p>
    <p class="list-item">• Inclusão em SPC, Serasa e similares</p>
    <p class="list-item">• Protesto do débito em cartório</p>
    <p class="list-item">• Compartilhamento de dados para cobrança</p>
    <p>Tudo conforme a legislação vigente.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 11ª – DA RESCISÃO E DESPEJO</p>
    <p>O descumprimento contratual autoriza:</p>
    <p class="list-item">• Rescisão imediata</p>
    <p class="list-item">• Cobrança judicial</p>
    <p class="list-item">• Ação de despejo</p>
    <p>Observado o devido processo legal.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 12ª – DA ASSINATURA ELETRÔNICA</p>
    <p>As partes reconhecem como válida a assinatura eletrônica deste contrato, nos termos da legislação vigente, conferindo-lhe plena validade jurídica.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 13ª – DA CONFIDENCIALIDADE</p>
    <p>As condições comerciais deste contrato são confidenciais, não podendo ser divulgadas sem autorização.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 14ª – DO FORO</p>
    <p>Fica eleito o foro da comarca de <strong>${data.city}</strong>, renunciando a qualquer outro.</p>
  </div>
  
  <p class="intro">E por estarem de pleno acordo, assinam eletronicamente o presente instrumento.</p>
  
  <p class="date-location">${data.city}, ${formatDateForContract(new Date())}</p>
  
  <div class="signature-block">
    <div class="signature-line">
      <hr>
      <p class="signature-label">LOCADOR</p>
      <p>${data.landlordName}</p>
    </div>
    <div class="signature-line">
      <hr>
      <p class="signature-label">LOCATÁRIO</p>
      <p>${data.tenantName}</p>
    </div>
  </div>
  
  <div class="signature-block">
    <div class="signature-line">
      <hr>
      <p class="signature-label">ADMINISTRADORA</p>
      <p>${data.agencyName}</p>
    </div>
    <div class="signature-line">
      <hr>
      <p class="signature-label">TESTEMUNHA</p>
      <p>Nome: _______________________</p>
      <p>CPF: ________________________</p>
    </div>
  </div>
</body>
</html>
`;
}

function generateResidentialContractHTML(data: ContractTemplateData): string {
  const guaranteeLabel = data.guaranteeType === 'fiador' ? 'FIANÇA' : 
                         data.guaranteeType === 'caucao' ? 'CAUÇÃO' : 
                         'SEGURO-FIANÇA';
  
  const depositValue = data.depositValue || (data.rentValue * (data.depositMonths || 2));

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Contrato de Locação Residencial</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      color: #333;
    }
    h1 {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    h2 {
      text-align: center;
      font-size: 12pt;
      font-weight: bold;
      margin-bottom: 30px;
      text-transform: uppercase;
    }
    .section-title {
      font-weight: bold;
      font-size: 11pt;
      margin-top: 25px;
      margin-bottom: 15px;
      text-transform: uppercase;
    }
    .intro {
      text-align: justify;
      margin-bottom: 20px;
    }
    .parties {
      margin-bottom: 30px;
    }
    .party {
      margin-bottom: 15px;
      text-align: justify;
    }
    .clause {
      margin-bottom: 20px;
      text-align: justify;
    }
    .clause-title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .list-item {
      margin-left: 20px;
      margin-bottom: 5px;
    }
    .paragraph {
      margin-bottom: 10px;
      text-align: justify;
    }
    .signatures {
      margin-top: 60px;
    }
    .signature-block {
      display: flex;
      justify-content: space-between;
      margin-top: 80px;
    }
    .signature-line {
      width: 45%;
      text-align: center;
    }
    .signature-line hr {
      border: none;
      border-top: 1px solid #333;
      margin-bottom: 10px;
    }
    .signature-label {
      font-weight: bold;
    }
    .date-location {
      text-align: right;
      margin-top: 40px;
    }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <h1>CONTRATO DE LOCAÇÃO RESIDENCIAL</h1>
  <h2>COM ADMINISTRAÇÃO IMOBILIÁRIA E GARANTIAS</h2>
  
  <p class="section-title">IDENTIFICAÇÃO DAS PARTES</p>
  
  <div class="parties">
    <p class="party"><strong>LOCADOR:</strong> ${data.landlordName}, portador do CPF/CNPJ nº ${data.landlordCpfCnpj}, doravante denominado simplesmente LOCADOR.</p>
    
    <p class="party"><strong>LOCATÁRIO:</strong> ${data.tenantName}, portador do CPF nº ${data.tenantCpf}, doravante denominado simplesmente LOCATÁRIO.</p>
    
    <p class="party"><strong>IMOBILIÁRIA ADMINISTRADORA:</strong> ${data.agencyName}, pessoa jurídica de direito privado, inscrita no CNPJ nº ${data.agencyCnpj}, doravante denominada simplesmente ADMINISTRADORA.</p>
  </div>
  
  <p class="intro">As partes acima identificadas têm entre si justo e contratado o que segue.</p>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 1ª – DO OBJETO</p>
    <p>O LOCADOR dá em locação ao LOCATÁRIO o imóvel de sua propriedade, situado à:</p>
    <p><strong>${data.propertyAddress}</strong>, doravante denominado simplesmente IMÓVEL, destinado exclusivamente para fins residenciais, sendo expressamente vedada qualquer utilização comercial, profissional, industrial ou diversa da aqui prevista.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 2ª – DO PRAZO DA LOCAÇÃO</p>
    <p>O prazo da locação é de <strong>${data.durationMonths} meses</strong>, iniciando-se em <strong>${formatDateForContract(data.startDate)}</strong> e encerrando-se em <strong>${formatDateForContract(data.endDate)}</strong>, podendo ser prorrogado nos termos da legislação vigente.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 3ª – DO VALOR DO ALUGUEL</p>
    <p>O aluguel mensal ajustado é de <strong>${formatCurrencyForContract(data.rentValue)}</strong>, com vencimento todo dia <strong>10</strong> de cada mês, a ser pago por meio de boleto bancário, Pix ou outro meio indicado pela ADMINISTRADORA.</p>
    <p>O não recebimento do boleto não exime o LOCATÁRIO da obrigação de pagamento.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 4ª – DO REAJUSTE</p>
    <p>O valor do aluguel será reajustado anualmente, ou no menor período permitido em lei, com base no índice IGP-M/FGV, ou outro que venha a substituí-lo.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 5ª – DA GARANTIA LOCATÍCIA</p>
    <p>A presente locação é garantida por <strong>${guaranteeLabel}</strong>, conforme opção escolhida pelo LOCATÁRIO, nos termos da Lei nº 8.245/91.</p>
    
    <p class="paragraph"><strong>§1º – Caução (quando aplicável)</strong></p>
    <p>O LOCATÁRIO entrega à ADMINISTRADORA o valor correspondente a <strong>${formatCurrencyForContract(depositValue)}</strong>, equivalente a até 02 (dois) meses de aluguel, como garantia, a ser devolvida ao final da locação, descontados eventuais débitos, danos ou encargos.</p>
    
    <p class="paragraph"><strong>§2º – Fiador (quando aplicável)</strong></p>
    <p>O FIADOR identificado no cadastro assume responsabilidade solidária por todas as obrigações do contrato, renunciando expressamente ao benefício de ordem, permanecendo responsável até a efetiva entrega das chaves.</p>
    
    <p class="paragraph"><strong>§3º – Seguro-fiança (quando aplicável)</strong></p>
    <p>O LOCATÁRIO obriga-se a manter o seguro-fiança vigente durante toda a locação, sob pena de rescisão contratual.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 6ª – DOS ENCARGOS E DESPESAS</p>
    <p>São de exclusiva responsabilidade do LOCATÁRIO:</p>
    <p class="list-item">• Aluguel</p>
    <p class="list-item">• Condomínio</p>
    <p class="list-item">• IPTU</p>
    <p class="list-item">• Água</p>
    <p class="list-item">• Energia elétrica</p>
    <p class="list-item">• Gás</p>
    <p class="list-item">• Taxas ordinárias</p>
    <p class="list-item">• Multas decorrentes do uso do imóvel</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 7ª – DA ADMINISTRAÇÃO IMOBILIÁRIA</p>
    <p>A ADMINISTRADORA fica expressamente autorizada a:</p>
    <p class="list-item">• Administrar a locação</p>
    <p class="list-item">• Emitir cobranças</p>
    <p class="list-item">• Receber valores</p>
    <p class="list-item">• Enviar notificações</p>
    <p class="list-item">• Representar o LOCADOR administrativa e judicialmente</p>
    <p class="list-item">• Promover cobrança extrajudicial e judicial</p>
    <p class="list-item">• Propor ação de despejo, quando necessário</p>
    <p>O LOCATÁRIO declara ciência e concordância com a atuação da ADMINISTRADORA, reconhecendo sua legitimidade.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 8ª – DA INADIMPLÊNCIA</p>
    <p>O atraso no pagamento de qualquer obrigação acarretará:</p>
    <p class="list-item">• Multa de 2%</p>
    <p class="list-item">• Juros de 1% ao mês</p>
    <p class="list-item">• Correção monetária</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 9ª – DA NEGATIVAÇÃO E PROTESTO</p>
    <p>O LOCATÁRIO autoriza expressamente que, em caso de inadimplência:</p>
    <p class="list-item">• Seus dados sejam incluídos nos cadastros de proteção ao crédito (SPC, Serasa ou similares)</p>
    <p class="list-item">• Os débitos sejam protestados em cartório</p>
    <p class="list-item">• As informações sejam compartilhadas para fins de cobrança</p>
    <p>Tudo em conformidade com a legislação vigente.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 10ª – DO DESPEJO</p>
    <p>A inadimplência ou descumprimento contratual autoriza o LOCADOR e/ou a ADMINISTRADORA a ingressar com ação de despejo, observados os prazos e procedimentos legais.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 11ª – DA RESCISÃO</p>
    <p>O contrato poderá ser rescindido:</p>
    <p class="list-item">• Por infração legal ou contratual</p>
    <p class="list-item">• Por falta de pagamento</p>
    <p class="list-item">• Por uso indevido do imóvel</p>
    <p>Aplicando-se as penalidades previstas em lei.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 12ª – DA VISTORIA E CONSERVAÇÃO</p>
    <p>O LOCATÁRIO declara receber o imóvel em perfeito estado, obrigando-se a devolvê-lo nas mesmas condições, ressalvado o desgaste natural.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 13ª – DA DEVOLUÇÃO DO IMÓVEL</p>
    <p>A entrega das chaves somente será considerada válida após:</p>
    <p class="list-item">• Quitação integral de débitos</p>
    <p class="list-item">• Vistoria final aprovada</p>
    <p class="list-item">• Entrega formal à ADMINISTRADORA</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 14ª – DO FORO</p>
    <p>Fica eleito o foro da comarca de <strong>${data.city}</strong>, com renúncia a qualquer outro.</p>
  </div>
  
  <p class="intro">E por estarem justas e contratadas, firmam o presente instrumento.</p>
  
  <p class="date-location">${data.city}, ${formatDateForContract(new Date())}</p>
  
  <div class="signature-block">
    <div class="signature-line">
      <hr>
      <p class="signature-label">LOCADOR</p>
      <p>${data.landlordName}</p>
    </div>
    <div class="signature-line">
      <hr>
      <p class="signature-label">LOCATÁRIO</p>
      <p>${data.tenantName}</p>
    </div>
  </div>
  
  <div class="signature-block">
    <div class="signature-line">
      <hr>
      <p class="signature-label">ADMINISTRADORA</p>
      <p>${data.agencyName}</p>
    </div>
    <div class="signature-line">
      <hr>
      <p class="signature-label">TESTEMUNHA</p>
      <p>Nome: _______________________</p>
      <p>CPF: ________________________</p>
    </div>
  </div>
</body>
</html>
`;
}

export function generateContractHTML(data: ContractTemplateData): string {
  if (data.contractType === 'comercial') {
    return generateCommercialContractHTML(data);
  }
  return generateResidentialContractHTML(data);
}
