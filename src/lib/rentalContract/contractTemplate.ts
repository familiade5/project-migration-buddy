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
      font-size: 16pt;
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
      margin-bottom: 10px;
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
  <h1>CONTRATO DE LOCAÇÃO RESIDENCIAL COM ADMINISTRAÇÃO IMOBILIÁRIA</h1>
  
  <p class="intro">Pelo presente instrumento particular, as partes abaixo identificadas:</p>
  
  <div class="parties">
    <p class="party"><strong>LOCADOR:</strong> ${data.NOME_LOCADOR}, ${data.CPF_CNPJ_LOCADOR}</p>
    <p class="party"><strong>LOCATÁRIO:</strong> ${data.NOME_LOCATARIO}, CPF: ${data.CPF_LOCATARIO}</p>
    <p class="party"><strong>IMOBILIÁRIA ADMINISTRADORA:</strong> ${data.NOME_IMOBILIARIA}, ${data.CNPJ_IMOBILIARIA}, doravante denominada apenas ADMINISTRADORA</p>
  </div>
  
  <p class="intro">têm entre si justo e contratado o seguinte:</p>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 1ª – DO IMÓVEL</p>
    <p>O LOCADOR dá em locação ao LOCATÁRIO o imóvel situado à:<br>
    <strong>${data.ENDERECO_IMOVEL}</strong>, destinado exclusivamente para uso residencial, não podendo ter outra finalidade.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 2ª – DO PRAZO</p>
    <p>O prazo da locação é de <strong>${data.PRAZO_LOCACAO} meses</strong>, iniciando-se em <strong>${data.DATA_INICIO}</strong> e encerrando-se em <strong>${data.DATA_FIM}</strong>.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 3ª – DO VALOR DO ALUGUEL</p>
    <p>O aluguel mensal é de <strong>${data.VALOR_ALUGUEL}</strong>, com vencimento todo dia <strong>${data.DIA_VENCIMENTO}</strong>, mediante boleto bancário ou outro meio indicado pela ADMINISTRADORA.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 4ª – DA GARANTIA (CAUÇÃO)</p>
    <p>Como garantia, o LOCATÁRIO entrega o valor correspondente a 02 (dois) meses de aluguel, totalizando <strong>${data.VALOR_CALCAO}</strong>, nos termos do art. 38 da Lei 8.245/91.</p>
    <p>O valor será devolvido ao final da locação, descontados débitos, danos ou encargos pendentes.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 5ª – DOS ENCARGOS</p>
    <p>São de responsabilidade do LOCATÁRIO:</p>
    <p class="list-item">• Aluguel</p>
    <p class="list-item">• Água</p>
    <p class="list-item">• Energia</p>
    <p class="list-item">• Condomínio</p>
    <p class="list-item">• IPTU</p>
    <p class="list-item">• Multas e taxas incidentes sobre o imóvel durante a locação</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 6ª – DA ADMINISTRAÇÃO IMOBILIÁRIA</p>
    <p>A ADMINISTRADORA é responsável pela:</p>
    <p class="list-item">• Gestão da locação</p>
    <p class="list-item">• Emissão de cobranças</p>
    <p class="list-item">• Recebimento de valores</p>
    <p class="list-item">• Intermediação entre as partes</p>
    <p class="list-item">• Medidas administrativas e judiciais de cobrança</p>
    <p>O LOCATÁRIO declara ciência e concordância com a atuação da ADMINISTRADORA.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 7ª – DA INADIMPLÊNCIA</p>
    <p>O não pagamento do aluguel ou encargos implicará:</p>
    <p class="list-item">a) Multa de ${data.PERCENTUAL_MULTA}%</p>
    <p class="list-item">b) Juros de ${data.JUROS_MENSAL}% ao mês</p>
    <p class="list-item">c) Correção monetária</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 8ª – DA NEGATIVAÇÃO E PROTESTO</p>
    <p>O LOCATÁRIO autoriza expressamente que, em caso de inadimplência:</p>
    <p class="list-item">• Seu nome seja incluído nos cadastros de proteção ao crédito (SPC/Serasa)</p>
    <p class="list-item">• O débito seja protestado em cartório</p>
    <p class="list-item">• As informações sejam compartilhadas para fins de cobrança</p>
    <p>Tudo conforme a legislação vigente.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 9ª – DO DESPEJO</p>
    <p>O inadimplemento autoriza a ADMINISTRADORA e o LOCADOR a ingressarem com:</p>
    <p class="list-item">• Ação de despejo</p>
    <p class="list-item">• Cobrança judicial ou extrajudicial</p>
    <p>Nos termos da Lei do Inquilinato, respeitado o devido processo legal.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 10ª – DA RESCISÃO</p>
    <p>O contrato poderá ser rescindido:</p>
    <p class="list-item">• Por descumprimento contratual</p>
    <p class="list-item">• Por falta de pagamento</p>
    <p class="list-item">• Por uso indevido do imóvel</p>
    <p>Aplicando-se as penalidades legais.</p>
  </div>
  
  <div class="clause">
    <p class="clause-title">CLÁUSULA 11ª – DO FORO</p>
    <p>Fica eleito o foro da comarca de <strong>${data.CIDADE_FORO}</strong>, renunciando a qualquer outro.</p>
  </div>
  
  <p class="intro">E por estarem justas e contratadas, assinam o presente instrumento.</p>
  
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
