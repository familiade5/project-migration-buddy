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

export function generateContractHTML(data: ContractTemplateData): string {
  const contractTypeLabel = data.contractType === 'residencial' ? 'RESIDENCIAL' : 'COMERCIAL';
  const guaranteeLabel = data.guaranteeType === 'fiador' ? 'COM FIANÇA' : 
                         data.guaranteeType === 'caucao' ? 'COM CAUÇÃO' : 
                         'COM SEGURO-FIANÇA';
  const purposeLabel = data.contractType === 'residencial' ? 'uso residencial' : 'uso comercial';
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Contrato de Locação ${contractTypeLabel}</title>
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
      margin-bottom: 30px;
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
      padding: 10px;
      background: #f9f9f9;
      border-left: 3px solid #333;
    }
    .clause {
      margin-bottom: 20px;
      text-align: justify;
    }
    .clause-title {
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
      font-size: 11pt;
    }
    .list-item {
      margin-left: 20px;
      margin-bottom: 5px;
    }
    .mt-2 {
      margin-top: 10px;
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
      font-size: 10pt;
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
  <h1>CONTRATO DE LOCAÇÃO ${contractTypeLabel} ${guaranteeLabel}<br>COM ADMINISTRAÇÃO IMOBILIÁRIA</h1>
  
  <p class="intro">Pelo presente instrumento particular, as partes abaixo qualificadas:</p>
  
  <div class="parties">
    <div class="party">
      <p><strong>LOCADOR(A):</strong> ${data.landlordName}</p>
      <p>CPF/CNPJ: ${data.landlordCpfCnpj}</p>
      ${data.landlordAddress ? `<p>Endereço: ${data.landlordAddress}</p>` : ''}
      ${data.landlordEmail ? `<p>E-mail: ${data.landlordEmail}</p>` : ''}
      ${data.landlordPhone ? `<p>Telefone: ${data.landlordPhone}</p>` : ''}
    </div>
    
    <div class="party">
      <p><strong>LOCATÁRIO(A):</strong> ${data.tenantName}</p>
      <p>CPF: ${data.tenantCpf}</p>
      ${data.tenantRg ? `<p>RG: ${data.tenantRg}</p>` : ''}
      ${data.tenantProfession ? `<p>Profissão: ${data.tenantProfession}</p>` : ''}
      ${data.tenantAddress ? `<p>Endereço: ${data.tenantAddress}</p>` : ''}
      ${data.tenantEmail ? `<p>E-mail: ${data.tenantEmail}</p>` : ''}
      ${data.tenantPhone ? `<p>Telefone: ${data.tenantPhone}</p>` : ''}
    </div>
    
    <div class="party">
      <p><strong>ADMINISTRADORA:</strong> ${data.agencyName}</p>
      <p>CNPJ: ${data.agencyCnpj}</p>
    </div>
  </div>
  
  <p class="intro">têm entre si justo e contratado o seguinte:</p>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 1ª – DO OBJETO</p>
    <p>O LOCADOR dá em locação ao LOCATÁRIO o imóvel ${data.propertyType.toLowerCase()} situado à:</p>
    <p><strong>${data.propertyAddress}</strong></p>
    ${data.propertyRegistration ? `<p>Matrícula nº ${data.propertyRegistration}</p>` : ''}
    <p class="mt-2">O imóvel destina-se exclusivamente para ${purposeLabel}, não podendo ter outra finalidade sem prévia autorização escrita do LOCADOR.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 2ª – DO PRAZO</p>
    <p>O prazo da locação é de <strong>${data.durationMonths} (${data.durationMonths === 12 ? 'doze' : data.durationMonths === 30 ? 'trinta' : data.durationMonths}) meses</strong>, iniciando-se em <strong>${formatDateForContract(data.startDate)}</strong> e terminando em <strong>${formatDateForContract(data.endDate)}</strong>.</p>
    <p class="mt-2">Findo o prazo e permanecendo o LOCATÁRIO no imóvel por mais de 30 (trinta) dias sem oposição do LOCADOR, a locação prorroga-se automaticamente por prazo indeterminado, mantidas as demais cláusulas e condições deste contrato.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 3ª – DO ALUGUEL E ENCARGOS</p>
    <p>O aluguel mensal é de <strong>${formatCurrencyForContract(data.rentValue)}</strong>, com vencimento todo dia <strong>10 (dez)</strong> de cada mês.</p>
    ${data.condominiumFee ? `<p>Condomínio: ${formatCurrencyForContract(data.condominiumFee)}</p>` : ''}
    ${data.iptuValue ? `<p>IPTU mensal: ${formatCurrencyForContract(data.iptuValue)}</p>` : ''}
    <p class="mt-2">O pagamento será realizado mediante boleto bancário, PIX ou outro meio indicado pela ADMINISTRADORA.</p>
    <p class="mt-2">O aluguel será reajustado anualmente pelo índice IGP-M/FGV ou, na sua falta, pelo IPCA/IBGE, aplicando-se o acumulado dos últimos 12 meses.</p>
    <p class="mt-2">São de responsabilidade do LOCATÁRIO:</p>
    <p class="list-item">a) Aluguel mensal e encargos</p>
    <p class="list-item">b) Água, luz, gás e telefone</p>
    <p class="list-item">c) Taxa de condomínio</p>
    <p class="list-item">d) IPTU proporcional ao período de locação</p>
    <p class="list-item">e) Multas e taxas incidentes sobre o imóvel durante a locação</p>
  </div>
  
  ${generateGuarantorClause(data)}
  ${generateDepositClause(data)}
  ${generateInsuranceClause(data)}
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 5ª – DA ADMINISTRAÇÃO</p>
    <p>A ADMINISTRADORA é responsável pela gestão integral da locação, incluindo:</p>
    <p class="list-item">a) Emissão e cobrança de boletos</p>
    <p class="list-item">b) Recebimento de aluguéis e encargos</p>
    <p class="list-item">c) Repasse mensal ao LOCADOR</p>
    <p class="list-item">d) Intermediação entre as partes</p>
    <p class="list-item">e) Vistorias de entrada e saída</p>
    <p class="list-item">f) Medidas administrativas e judiciais de cobrança</p>
    <p class="mt-2">O LOCATÁRIO declara ciência e concordância com a atuação da ADMINISTRADORA.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 6ª – DA INADIMPLÊNCIA</p>
    <p>O atraso no pagamento do aluguel ou encargos implicará:</p>
    <p class="list-item">a) Multa de 2% (dois por cento) sobre o valor devido</p>
    <p class="list-item">b) Juros de mora de 1% (um por cento) ao mês</p>
    <p class="list-item">c) Correção monetária pelo IGP-M/FGV</p>
    <p class="list-item">d) Honorários advocatícios de 10% (dez por cento) em caso de cobrança judicial</p>
    <p class="mt-2">Após 15 (quinze) dias de atraso, o nome do LOCATÁRIO poderá ser inscrito nos órgãos de proteção ao crédito (SPC/Serasa).</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 7ª – DAS OBRIGAÇÕES DO LOCATÁRIO</p>
    <p>O LOCATÁRIO obriga-se a:</p>
    <p class="list-item">a) Servir-se do imóvel exclusivamente para a finalidade contratada;</p>
    <p class="list-item">b) Tratar o imóvel com zelo, mantendo-o em perfeitas condições;</p>
    <p class="list-item">c) Restituir o imóvel nas mesmas condições em que o recebeu;</p>
    <p class="list-item">d) Levar ao conhecimento do LOCADOR qualquer dano ou irregularidade;</p>
    <p class="list-item">e) Não modificar a estrutura do imóvel sem autorização escrita;</p>
    <p class="list-item">f) Realizar às suas expensas os reparos de pequeno porte;</p>
    <p class="list-item">g) Permitir vistorias periódicas, mediante aviso prévio de 24 horas;</p>
    <p class="list-item">h) Cumprir as normas do condomínio, quando aplicável;</p>
    <p class="list-item">i) Não sublocar ou ceder o imóvel sem autorização expressa.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 8ª – DAS OBRIGAÇÕES DO LOCADOR</p>
    <p>O LOCADOR obriga-se a:</p>
    <p class="list-item">a) Entregar o imóvel em condições de uso;</p>
    <p class="list-item">b) Manter a forma e o destino do imóvel durante a locação;</p>
    <p class="list-item">c) Responder pelos vícios anteriores à locação;</p>
    <p class="list-item">d) Realizar os reparos estruturais e de grande porte;</p>
    <p class="list-item">e) Fornecer recibo detalhado dos valores recebidos;</p>
    <p class="list-item">f) Pagar as taxas de administração imobiliária.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 9ª – DA RESCISÃO</p>
    <p>O contrato poderá ser rescindido:</p>
    <p class="list-item">a) Por mútuo acordo entre as partes;</p>
    <p class="list-item">b) Por descumprimento de qualquer cláusula contratual;</p>
    <p class="list-item">c) Por falta de pagamento de aluguel ou encargos;</p>
    <p class="list-item">d) Por uso indevido do imóvel;</p>
    <p class="list-item">e) Por infração legal ou contratual.</p>
    <p class="mt-2">A multa por rescisão antecipada será de 03 (três) aluguéis vigentes, proporcional ao tempo restante do contrato.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 10ª – DA VISTORIA</p>
    <p>No ato da assinatura deste contrato, será realizada vistoria detalhada do imóvel, com descrição de seu estado de conservação, que passa a fazer parte integrante deste instrumento.</p>
    <p class="mt-2">Na desocupação do imóvel, nova vistoria será realizada, devendo o LOCATÁRIO devolver o imóvel nas mesmas condições em que o recebeu, sob pena de responder pelos danos constatados.</p>
  </div>
  
  ${generateCommercialClauses(data)}
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA ${data.contractType === 'comercial' ? '14' : '11'}ª – DO FORO</p>
    <p>Fica eleito o foro da comarca de <strong>${data.city}</strong> para dirimir quaisquer questões oriundas deste contrato, renunciando as partes a qualquer outro, por mais privilegiado que seja.</p>
  </div>
  
  <p class="intro">E por estarem assim justas e contratadas, as partes assinam o presente instrumento em 03 (três) vias de igual teor e forma, na presença de duas testemunhas.</p>
  
  <p class="date-location">${data.city}, ${formatDateForContract(new Date())}</p>
  
  <div class="signature-block">
    <div class="signature-line">
      <hr>
      <p class="signature-label">LOCADOR(A)</p>
      <p>${data.landlordName}</p>
    </div>
    <div class="signature-line">
      <hr>
      <p class="signature-label">LOCATÁRIO(A)</p>
      <p>${data.tenantName}</p>
    </div>
  </div>
  
  ${data.guaranteeType === 'fiador' ? `
  <div class="signature-block">
    <div class="signature-line">
      <hr>
      <p class="signature-label">FIADOR(A)</p>
      <p>${data.guarantorName || '___________________'}</p>
    </div>
    <div class="signature-line">
      <hr>
      <p class="signature-label">ADMINISTRADORA</p>
      <p>${data.agencyName}</p>
    </div>
  </div>
  ` : `
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
  `}
  
  <div class="signature-block">
    <div class="signature-line">
      <hr>
      <p class="signature-label">TESTEMUNHA 1</p>
      <p>Nome: _______________________</p>
      <p>CPF: ________________________</p>
    </div>
    <div class="signature-line">
      <hr>
      <p class="signature-label">TESTEMUNHA 2</p>
      <p>Nome: _______________________</p>
      <p>CPF: ________________________</p>
    </div>
  </div>
</body>
</html>
`;
}
