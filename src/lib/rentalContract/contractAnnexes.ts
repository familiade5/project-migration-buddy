// Contract Annexes Templates
// ANEXO I - Termo de Vistoria
// ANEXO II - Regulamento Interno
// ANEXO III - Termo LGPD

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface InspectionData {
  contractNumber: string;
  propertyAddress: string;
  generalCondition: 'excelente' | 'bom' | 'regular';
  generalObservations?: string;
  
  // Room states
  livingRoomState?: string;
  bedroomsState?: string;
  kitchenState?: string;
  bathroomsState?: string;
  externalAreaState?: string;
  
  // Installations
  electricalOk: boolean;
  electricalObs?: string;
  plumbingOk: boolean;
  plumbingObs?: string;
  paintingOk: boolean;
  paintingObs?: string;
  
  // Photos (URLs)
  photos?: string[];
  
  // Location and date
  city: string;
  date: Date;
}

export interface AnnexData {
  contractNumber: string;
  propertyAddress: string;
  landlordName: string;
  tenantName: string;
  agencyName: string;
  agencyCnpj: string;
  city: string;
  date: Date;
  
  // Inspection data (optional, for pre-filled forms)
  inspection?: InspectionData;
}

function getCommonStyles(): string {
  return `
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
    }
    .section-title {
      font-weight: bold;
      font-size: 11pt;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    .paragraph {
      margin-bottom: 15px;
      text-align: justify;
    }
    .list-item {
      margin-left: 20px;
      margin-bottom: 8px;
    }
    .checkbox-item {
      margin-bottom: 10px;
    }
    .checkbox {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 1px solid #333;
      margin-right: 8px;
      vertical-align: middle;
    }
    .checkbox.checked::after {
      content: "✓";
      font-size: 14px;
      margin-left: 2px;
    }
    .field-line {
      border-bottom: 1px solid #666;
      min-height: 24px;
      margin: 5px 0;
      padding: 2px;
    }
    .signature-block {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
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
    .page-break {
      page-break-before: always;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    td, th {
      border: 1px solid #333;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
    }
    @media print {
      body { padding: 20px; }
      .page-break { page-break-before: always; }
    }
  `;
}

// ANEXO I - TERMO DE VISTORIA DO IMÓVEL
export function generateInspectionTermHTML(data: AnnexData): string {
  const formattedDate = format(data.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const inspection = data.inspection;
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Anexo I - Termo de Vistoria</title>
  <style>${getCommonStyles()}</style>
</head>
<body>
  <h1>ANEXO I – TERMO DE VISTORIA DO IMÓVEL</h1>
  <h2>(Integrante do Contrato de Locação nº ${data.contractNumber})</h2>
  
  <p class="paragraph">Pelo presente termo, as partes declaram que realizaram vistoria no imóvel objeto do Contrato de Locação, localizado à:</p>
  <p class="paragraph"><strong>${data.propertyAddress}</strong></p>
  
  <p class="section-title">1. ESTADO GERAL DO IMÓVEL</p>
  <p class="paragraph">O imóvel encontra-se, no ato da entrega das chaves, nas seguintes condições:</p>
  
  <div class="checkbox-item">
    <span class="checkbox ${inspection?.generalCondition === 'excelente' ? 'checked' : ''}"></span> Excelente
  </div>
  <div class="checkbox-item">
    <span class="checkbox ${inspection?.generalCondition === 'bom' ? 'checked' : ''}"></span> Bom
  </div>
  <div class="checkbox-item">
    <span class="checkbox ${inspection?.generalCondition === 'regular' ? 'checked' : ''}"></span> Regular
  </div>
  
  <p class="paragraph"><strong>Observações gerais:</strong></p>
  <div class="field-line">${inspection?.generalObservations || ''}</div>
  <div class="field-line"></div>
  
  <p class="section-title">2. AMBIENTES</p>
  <table>
    <tr>
      <th>Ambiente</th>
      <th>Estado de Conservação</th>
    </tr>
    <tr>
      <td>Sala</td>
      <td>${inspection?.livingRoomState || ''}</td>
    </tr>
    <tr>
      <td>Quartos</td>
      <td>${inspection?.bedroomsState || ''}</td>
    </tr>
    <tr>
      <td>Cozinha</td>
      <td>${inspection?.kitchenState || ''}</td>
    </tr>
    <tr>
      <td>Banheiros</td>
      <td>${inspection?.bathroomsState || ''}</td>
    </tr>
    <tr>
      <td>Área externa/serviço</td>
      <td>${inspection?.externalAreaState || ''}</td>
    </tr>
  </table>
  
  <p class="section-title">3. INSTALAÇÕES</p>
  <table>
    <tr>
      <th>Item</th>
      <th>Status</th>
      <th>Observações</th>
    </tr>
    <tr>
      <td>Elétrica</td>
      <td>
        <span class="checkbox ${inspection?.electricalOk ? 'checked' : ''}"></span> OK
        <span class="checkbox ${!inspection?.electricalOk ? 'checked' : ''}"></span> Observações
      </td>
      <td>${inspection?.electricalObs || ''}</td>
    </tr>
    <tr>
      <td>Hidráulica</td>
      <td>
        <span class="checkbox ${inspection?.plumbingOk ? 'checked' : ''}"></span> OK
        <span class="checkbox ${!inspection?.plumbingOk ? 'checked' : ''}"></span> Observações
      </td>
      <td>${inspection?.plumbingObs || ''}</td>
    </tr>
    <tr>
      <td>Pintura</td>
      <td>
        <span class="checkbox ${inspection?.paintingOk ? 'checked' : ''}"></span> OK
        <span class="checkbox ${!inspection?.paintingOk ? 'checked' : ''}"></span> Observações
      </td>
      <td>${inspection?.paintingObs || ''}</td>
    </tr>
  </table>
  
  <p class="section-title">4. REGISTRO FOTOGRÁFICO</p>
  <p class="paragraph">As partes reconhecem que as fotos anexadas a este termo fazem parte integrante do contrato, servindo como referência obrigatória para a vistoria final.</p>
  ${inspection?.photos && inspection.photos.length > 0 ? `
    <p class="paragraph"><em>(${inspection.photos.length} foto(s) anexada(s) ao sistema)</em></p>
  ` : `
    <p class="paragraph"><em>(Fotos a serem anexadas no sistema)</em></p>
  `}
  
  <p class="section-title">5. RESPONSABILIDADE</p>
  <p class="paragraph">O LOCATÁRIO compromete-se a devolver o imóvel no mesmo estado de conservação, ressalvado o desgaste natural pelo uso regular.</p>
  
  <p class="date-location">${data.city}, ${formattedDate}</p>
  <p class="paragraph" style="text-align: center; font-style: italic;">Assinatura eletrônica válida nos termos legais.</p>
  
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
  
  <div class="signature-block" style="margin-top: 40px;">
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

// ANEXO II - REGULAMENTO INTERNO E USO DO IMÓVEL
export function generateInternalRegulationsHTML(data: AnnexData): string {
  const formattedDate = format(data.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Anexo II - Regulamento Interno</title>
  <style>${getCommonStyles()}</style>
</head>
<body>
  <h1>ANEXO II – REGULAMENTO INTERNO E NORMAS DE USO</h1>
  <h2>(Integrante do Contrato de Locação nº ${data.contractNumber})</h2>
  
  <p class="paragraph">Este regulamento integra o contrato de locação e deve ser rigorosamente cumprido pelo LOCATÁRIO, seus familiares, funcionários, clientes ou visitantes.</p>
  
  <p class="section-title">1. USO DO IMÓVEL</p>
  <p class="list-item">• Utilização exclusivamente conforme o contrato (residencial ou comercial)</p>
  <p class="list-item">• Proibido sublocar, ceder ou emprestar sem autorização escrita</p>
  <p class="list-item">• Proibidas atividades ilegais ou que causem incômodo</p>
  <p class="list-item">• Manter o imóvel em condições adequadas de higiene e conservação</p>
  
  <p class="section-title">2. CONDOMÍNIO E VIZINHANÇA</p>
  <p class="list-item">• Cumprir integralmente as normas do condomínio</p>
  <p class="list-item">• Respeitar horários de silêncio (geralmente das 22h às 7h)</p>
  <p class="list-item">• Manter boa convivência com vizinhos</p>
  <p class="list-item">• Não obstruir áreas comuns</p>
  <p class="list-item">• Comunicar imediatamente qualquer irregularidade</p>
  
  <p class="section-title">3. OBRAS E ALTERAÇÕES</p>
  <p class="list-item">• Proibidas alterações estruturais sem autorização prévia e por escrito</p>
  <p class="list-item">• Qualquer modificação deve ser previamente aprovada pelo LOCADOR e ADMINISTRADORA</p>
  <p class="list-item">• Benfeitorias não serão indenizadas, salvo acordo escrito</p>
  <p class="list-item">• O LOCATÁRIO é responsável por obter licenças e alvarás necessários</p>
  
  <p class="section-title">4. RESPONSABILIDADE POR DANOS</p>
  <p class="paragraph">O LOCATÁRIO responde por:</p>
  <p class="list-item">• Danos ao imóvel, inclusive causados por terceiros sob sua responsabilidade</p>
  <p class="list-item">• Danos às áreas comuns do condomínio</p>
  <p class="list-item">• Multas aplicadas pelo condomínio ou órgãos públicos</p>
  <p class="list-item">• Vazamentos, infiltrações e problemas causados por mau uso</p>
  <p class="list-item">• Reparos de itens danificados além do desgaste natural</p>
  
  <p class="section-title">5. MANUTENÇÃO</p>
  <p class="list-item">• O LOCATÁRIO deve zelar pela conservação do imóvel</p>
  <p class="list-item">• Comunicar imediatamente vícios ou defeitos que surgirem</p>
  <p class="list-item">• Realizar pequenos reparos e manutenções de rotina</p>
  <p class="list-item">• Manter desentupidos ralos, pias e vasos sanitários</p>
  
  <p class="section-title">6. PENALIDADES</p>
  <p class="paragraph">O descumprimento deste regulamento poderá resultar em:</p>
  <p class="list-item">• Notificação formal</p>
  <p class="list-item">• Multas contratuais</p>
  <p class="list-item">• Rescisão contratual por infração</p>
  <p class="list-item">• Ação judicial para reparação de danos</p>
  <p class="list-item">• Ação de despejo, se cabível</p>
  
  <p class="paragraph" style="margin-top: 30px;">Declaro ter lido, compreendido e aceito integralmente as normas acima.</p>
  
  <p class="date-location">${data.city}, ${formattedDate}</p>
  <p class="paragraph" style="text-align: center; font-style: italic;">Assinatura eletrônica válida nos termos legais.</p>
  
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
</body>
</html>
`;
}

// ANEXO III - TERMO DE CONSENTIMENTO LGPD
export function generateLGPDConsentHTML(data: AnnexData): string {
  const formattedDate = format(data.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Anexo III - Termo LGPD</title>
  <style>${getCommonStyles()}</style>
</head>
<body>
  <h1>ANEXO III – TERMO DE CONSENTIMENTO E CIÊNCIA</h1>
  <h2>Lei Geral de Proteção de Dados (LGPD)</h2>
  <p style="text-align: center; margin-bottom: 30px;">(Integrante do Contrato de Locação nº ${data.contractNumber})</p>
  
  <p class="paragraph">Em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD), o LOCATÁRIO declara estar ciente e autoriza o tratamento de seus dados pessoais pela IMOBILIÁRIA ADMINISTRADORA <strong>${data.agencyName}</strong>, inscrita no CNPJ nº ${data.agencyCnpj}, para as seguintes finalidades:</p>
  
  <p class="section-title">1. FINALIDADES DO TRATAMENTO</p>
  <p class="list-item">• Administração do contrato de locação</p>
  <p class="list-item">• Cobrança de valores (aluguéis, encargos, taxas)</p>
  <p class="list-item">• Comunicação contratual (avisos, notificações, lembretes)</p>
  <p class="list-item">• Cumprimento de obrigações legais e regulatórias</p>
  <p class="list-item">• Inclusão em cadastros de proteção ao crédito (SPC, Serasa), se aplicável</p>
  <p class="list-item">• Compartilhamento com prestadores de serviço (bancos, cartórios, plataformas de assinatura eletrônica)</p>
  <p class="list-item">• Defesa de direitos em processos administrativos ou judiciais</p>
  
  <p class="section-title">2. DADOS TRATADOS</p>
  <p class="paragraph">Os dados pessoais que poderão ser tratados incluem:</p>
  <p class="list-item">• Nome completo</p>
  <p class="list-item">• CPF e RG</p>
  <p class="list-item">• Endereço residencial e comercial</p>
  <p class="list-item">• Telefone, WhatsApp e e-mail</p>
  <p class="list-item">• Informações financeiras relacionadas ao contrato</p>
  <p class="list-item">• Dados profissionais e comprovantes de renda</p>
  <p class="list-item">• Imagens do imóvel e documentos contratuais</p>
  
  <p class="section-title">3. COMPARTILHAMENTO</p>
  <p class="paragraph">Os dados poderão ser compartilhados somente quando necessário para:</p>
  <p class="list-item">• Execução do contrato de locação</p>
  <p class="list-item">• Cumprimento de obrigação legal ou regulatória</p>
  <p class="list-item">• Defesa de direitos em processos administrativos ou judiciais</p>
  <p class="list-item">• Proteção do crédito, nos termos do art. 7º, X da LGPD</p>
  
  <p class="section-title">4. DIREITOS DO TITULAR</p>
  <p class="paragraph">O titular dos dados poderá, a qualquer tempo, mediante requisição:</p>
  <p class="list-item">• Confirmar a existência de tratamento</p>
  <p class="list-item">• Acessar seus dados</p>
  <p class="list-item">• Corrigir dados incompletos, inexatos ou desatualizados</p>
  <p class="list-item">• Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</p>
  <p class="list-item">• Obter informações sobre compartilhamento de dados</p>
  <p class="list-item">• Revogar o consentimento, quando aplicável</p>
  
  <p class="section-title">5. PRAZO DE ARMAZENAMENTO</p>
  <p class="paragraph">Os dados serão mantidos pelo período necessário ao cumprimento das finalidades contratuais e legais, observando-se:</p>
  <p class="list-item">• Durante a vigência do contrato de locação</p>
  <p class="list-item">• Por até 5 (cinco) anos após o término, para fins de guarda legal</p>
  <p class="list-item">• Pelo período necessário para defesa em processos judiciais ou administrativos</p>
  
  <p class="section-title">6. SEGURANÇA DOS DADOS</p>
  <p class="paragraph">A ADMINISTRADORA compromete-se a adotar medidas técnicas e organizacionais adequadas para proteger os dados pessoais contra acessos não autorizados, perda, destruição ou vazamento.</p>
  
  <p class="paragraph" style="margin-top: 30px; font-weight: bold;">Declaro que li, compreendi e concordo integralmente com os termos acima, autorizando o tratamento de meus dados pessoais conforme descrito.</p>
  
  <p class="date-location">${data.city}, ${formattedDate}</p>
  <p class="paragraph" style="text-align: center; font-style: italic;">Assinatura eletrônica válida nos termos legais.</p>
  
  <div class="signature-block">
    <div class="signature-line">
      <hr>
      <p class="signature-label">LOCATÁRIO (TITULAR DOS DADOS)</p>
      <p>${data.tenantName}</p>
    </div>
    <div class="signature-line">
      <hr>
      <p class="signature-label">ADMINISTRADORA (CONTROLADORA)</p>
      <p>${data.agencyName}</p>
    </div>
  </div>
</body>
</html>
`;
}

// Generate all annexes combined
export function generateAllAnnexesHTML(data: AnnexData): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Anexos do Contrato de Locação</title>
  <style>${getCommonStyles()}</style>
</head>
<body>
  ${generateInspectionTermHTML(data).replace(/<\/?html[^>]*>|<\/?head[^>]*>|<\/?body[^>]*>|<meta[^>]*>|<title[^>]*>.*?<\/title>|<style[^>]*>.*?<\/style>/gs, '')}
  
  <div class="page-break"></div>
  
  ${generateInternalRegulationsHTML(data).replace(/<\/?html[^>]*>|<\/?head[^>]*>|<\/?body[^>]*>|<meta[^>]*>|<title[^>]*>.*?<\/title>|<style[^>]*>.*?<\/style>/gs, '')}
  
  <div class="page-break"></div>
  
  ${generateLGPDConsentHTML(data).replace(/<\/?html[^>]*>|<\/?head[^>]*>|<\/?body[^>]*>|<meta[^>]*>|<title[^>]*>.*?<\/title>|<style[^>]*>.*?<\/style>/gs, '')}
</body>
</html>
`;
}

// Helper to create annex data from contract
// All inspection fields are pre-filled as "OK/Conforme" by default
export function createAnnexDataFromContract(
  contract: {
    property_code: string;
    property_address: string;
    property_neighborhood?: string | null;
    property_city: string;
    property_state: string;
    owner_name: string;
    tenant?: { full_name: string } | null;
  },
  agencyData: { name: string; cnpj: string }
): AnnexData {
  const fullAddress = `${contract.property_address}${contract.property_neighborhood ? `, ${contract.property_neighborhood}` : ''}, ${contract.property_city} - ${contract.property_state}`;
  
  // Pre-filled inspection data with all fields as "OK/Conforme"
  const defaultInspection: InspectionData = {
    contractNumber: contract.property_code,
    propertyAddress: fullAddress,
    generalCondition: 'bom',
    generalObservations: 'Imóvel em perfeitas condições de uso.',
    
    // Room states - all pre-filled as "Conforme"
    livingRoomState: 'Conforme - Bom estado de conservação',
    bedroomsState: 'Conforme - Bom estado de conservação',
    kitchenState: 'Conforme - Bom estado de conservação',
    bathroomsState: 'Conforme - Bom estado de conservação',
    externalAreaState: 'Conforme - Bom estado de conservação',
    
    // Installations - all pre-filled as OK
    electricalOk: true,
    electricalObs: '',
    plumbingOk: true,
    plumbingObs: '',
    paintingOk: true,
    paintingObs: '',
    
    // Photos
    photos: [],
    
    // Location and date
    city: contract.property_city,
    date: new Date(),
  };
  
  return {
    contractNumber: contract.property_code,
    propertyAddress: fullAddress,
    landlordName: contract.owner_name,
    tenantName: contract.tenant?.full_name || '___________________',
    agencyName: agencyData.name,
    agencyCnpj: agencyData.cnpj,
    city: contract.property_city,
    date: new Date(),
    inspection: defaultInspection,
  };
}
