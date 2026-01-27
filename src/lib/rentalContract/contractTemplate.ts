import { RentalContract } from '@/types/rental';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface ContractData {
  // Locador
  NOME_LOCADOR: string;
  CPF_CNPJ_LOCADOR: string;
  
  // Locatário
  NOME_LOCATARIO: string;
  CPF_LOCATARIO: string;
  
  // Imobiliária
  NOME_IMOBILIARIA: string;
  CNPJ_IMOBILIARIA: string;
  
  // Imóvel
  ENDERECO_IMOVEL: string;
  
  // Contrato
  PRAZO_LOCACAO: string;
  DATA_INICIO: string;
  DATA_FIM: string;
  
  // Valores
  VALOR_ALUGUEL: string;
  DIA_VENCIMENTO: string;
  VALOR_CALCAO: string;
  
  // Multas
  PERCENTUAL_MULTA: string;
  JUROS_MENSAL: string;
  
  // Foro
  CIDADE_FORO: string;
  
  // Assinaturas
  DATA_ASSINATURA: string;
}

export function formatCurrencyForContract(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function generateContractData(
  contract: RentalContract & { owner?: { cpf?: string; full_name?: string } },
  agencyData?: { name: string; cnpj: string }
): ContractData {
  const startDate = new Date(contract.start_date);
  const endDate = new Date(contract.end_date);
  
  // Calculate months between dates
  const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
    (endDate.getMonth() - startDate.getMonth());
  
  const depositValue = contract.deposit_value || (contract.rent_value * (contract.deposit_months || 2));

  // Get owner CPF from linked owner or fallback
  const ownerCpf = (contract as any).owner?.cpf || '___________________';

  return {
    NOME_LOCADOR: contract.owner_name,
    CPF_CNPJ_LOCADOR: `CPF/CNPJ: ${ownerCpf}`,
    
    NOME_LOCATARIO: contract.tenant?.full_name || '___________________',
    CPF_LOCATARIO: contract.tenant?.cpf || '___________________',
    
    NOME_IMOBILIARIA: agencyData?.name || 'Venda Direta Hoje',
    CNPJ_IMOBILIARIA: agencyData?.cnpj || 'CNPJ: 00.000.000/0001-00',
    
    ENDERECO_IMOVEL: `${contract.property_address}, ${contract.property_neighborhood || ''}, ${contract.property_city} - ${contract.property_state}`.replace(/, ,/g, ','),
    
    PRAZO_LOCACAO: monthsDiff.toString(),
    DATA_INICIO: format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    DATA_FIM: format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    
    VALOR_ALUGUEL: formatCurrencyForContract(contract.rent_value),
    DIA_VENCIMENTO: contract.payment_due_day.toString(),
    VALOR_CALCAO: formatCurrencyForContract(depositValue),
    
    PERCENTUAL_MULTA: '2',
    JUROS_MENSAL: '1',
    
    CIDADE_FORO: contract.property_city,
    
    DATA_ASSINATURA: format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
  };
}

export function generateContractHTML(data: ContractData): string {
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
    <p class="party"><strong>LOCADOR:</strong> ${data.NOME_LOCADOR}, portador do ${data.CPF_CNPJ_LOCADOR}, doravante denominado simplesmente LOCADOR.</p>
    
    <p class="party"><strong>LOCATÁRIO:</strong> ${data.NOME_LOCATARIO}, portador do CPF nº ${data.CPF_LOCATARIO}, doravante denominado simplesmente LOCATÁRIO.</p>
    
    <p class="party"><strong>IMOBILIÁRIA ADMINISTRADORA:</strong> ${data.NOME_IMOBILIARIA}, pessoa jurídica de direito privado, inscrita no ${data.CNPJ_IMOBILIARIA}, doravante denominada simplesmente ADMINISTRADORA.</p>
  </div>
  
  <p class="intro">As partes acima identificadas têm entre si justo e contratado o que segue.</p>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 1ª – DO OBJETO</p>
    <p>O LOCADOR dá em locação ao LOCATÁRIO o imóvel de sua propriedade, situado à:</p>
    <p><strong>${data.ENDERECO_IMOVEL}</strong>, doravante denominado simplesmente IMÓVEL, destinado exclusivamente para fins residenciais, sendo expressamente vedada qualquer utilização comercial, profissional, industrial ou diversa da aqui prevista.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 2ª – DO PRAZO DA LOCAÇÃO</p>
    <p>O prazo da locação é de <strong>${data.PRAZO_LOCACAO} meses</strong>, iniciando-se em <strong>${data.DATA_INICIO}</strong> e encerrando-se em <strong>${data.DATA_FIM}</strong>, podendo ser prorrogado nos termos da legislação vigente.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 3ª – DO VALOR DO ALUGUEL</p>
    <p>O aluguel mensal ajustado é de <strong>${data.VALOR_ALUGUEL}</strong>, com vencimento todo dia <strong>${data.DIA_VENCIMENTO}</strong> de cada mês, a ser pago por meio de boleto bancário, Pix ou outro meio indicado pela ADMINISTRADORA.</p>
    <p>O não recebimento do boleto não exime o LOCATÁRIO da obrigação de pagamento.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 4ª – DO REAJUSTE</p>
    <p>O valor do aluguel será reajustado anualmente, ou no menor período permitido em lei, com base no índice IGP-M/FGV, ou outro que venha a substituí-lo.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 5ª – DA GARANTIA LOCATÍCIA</p>
    <p>A presente locação é garantida por CAUÇÃO, conforme opção escolhida pelo LOCATÁRIO, nos termos da Lei nº 8.245/91.</p>
    
    <p class="paragraph"><strong>§1º – Caução (quando aplicável)</strong></p>
    <p>O LOCATÁRIO entrega à ADMINISTRADORA o valor correspondente a <strong>${data.VALOR_CALCAO}</strong>, equivalente a até 02 (dois) meses de aluguel, como garantia, a ser devolvida ao final da locação, descontados eventuais débitos, danos ou encargos.</p>
    
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
    <p class="list-item">• Multa de ${data.PERCENTUAL_MULTA}%</p>
    <p class="list-item">• Juros de ${data.JUROS_MENSAL}% ao mês</p>
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
    <p>Fica eleito o foro da comarca de <strong>${data.CIDADE_FORO}</strong>, com renúncia a qualquer outro.</p>
  </div>
  
  <p class="intro">E por estarem justas e contratadas, firmam o presente instrumento.</p>
  
  <p class="date-location">${data.CIDADE_FORO}, ${data.DATA_ASSINATURA}</p>
  
  <div class="signature-block">
    <div class="signature-line">
      <hr>
      <p class="signature-label">LOCADOR</p>
      <p>${data.NOME_LOCADOR}</p>
    </div>
    <div class="signature-line">
      <hr>
      <p class="signature-label">LOCATÁRIO</p>
      <p>${data.NOME_LOCATARIO}</p>
    </div>
  </div>
  
  <div class="signature-block">
    <div class="signature-line">
      <hr>
      <p class="signature-label">ADMINISTRADORA</p>
      <p>${data.NOME_IMOBILIARIA}</p>
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
