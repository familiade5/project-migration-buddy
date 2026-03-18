import { PropertyData } from '@/types/property';
import { Sparkles, TrendingDown, Zap } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';
import { useLogoBase64 } from '@/hooks/useLogoBase64';
import { useCrecis } from '@/hooks/useCrecis';

interface PostCoverProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

// Map of full state names to UF abbreviations
const STATE_UF_MAP: Record<string, string> = {
  'acre': 'AC', 'alagoas': 'AL', 'amapá': 'AP', 'amapa': 'AP',
  'amazonas': 'AM', 'bahia': 'BA', 'ceará': 'CE', 'ceara': 'CE',
  'distrito federal': 'DF', 'espírito santo': 'ES', 'espirito santo': 'ES',
  'goiás': 'GO', 'goias': 'GO', 'maranhão': 'MA', 'maranhao': 'MA',
  'mato grosso do sul': 'MS', 'mato grosso': 'MT',
  'minas gerais': 'MG', 'pará': 'PA', 'para': 'PA',
  'paraíba': 'PB', 'paraiba': 'PB', 'paraná': 'PR', 'parana': 'PR',
  'pernambuco': 'PE', 'piauí': 'PI', 'piaui': 'PI',
  'rio de janeiro': 'RJ', 'rio grande do norte': 'RN',
  'rio grande do sul': 'RS', 'rondônia': 'RO', 'rondonia': 'RO',
  'roraima': 'RR', 'santa catarina': 'SC', 'são paulo': 'SP', 'sao paulo': 'SP',
  'sergipe': 'SE', 'tocantins': 'TO',
};

const resolveUF = (stateInput: string): string => {
  const clean = stateInput.trim().toLowerCase();
  if (clean.length === 2) return clean.toUpperCase();
  return STATE_UF_MAP[clean] || stateInput.trim().slice(0, 2).toUpperCase();
};

export const PostCover = ({ data, photo }: PostCoverProps) => {
  const logoBase64 = useLogoBase64(logoVDH);
  const { crecis, formatCreci } = useCrecis();

  // CRECI da capa: sempre o PJ do estado do imóvel, nunca o do corretor
  const getCoverCreci = () => {
    if (!data.state || crecis.length === 0) return data.creci;
    const uf = resolveUF(data.state);
    const pjCreci = crecis.find(c => c.state.toUpperCase() === uf && c.name === 'PJ');
    if (pjCreci) return formatCreci(pjCreci);
    // fallback: qualquer creci do estado
    const stateCreci = crecis.find(c => c.state.toUpperCase() === uf);
    if (stateCreci) return formatCreci(stateCreci);
    // fallback final: PJ de qualquer estado
    const anyPj = crecis.find(c => c.name === 'PJ');
    return anyPj ? formatCreci(anyPj) : data.creci;
  };
  const coverCreci = getCoverCreci();

  // Endereço completo automático
  const displayAddress = data.fullAddress ||
    (data.street
      ? `${data.street}${data.number ? `, ${data.number}` : ''}${data.complement ? ` ${data.complement}` : ''} - ${data.neighborhood}, ${data.city}/${(data.state || '').trim().slice(0, 2).toUpperCase()}`
      : [data.neighborhood, data.city, (data.state || '').trim().slice(0, 2).toUpperCase()].filter(Boolean).join(' - '));

  // Resumo do imóvel
  const getPropertySummary = () => {
    let summary = data.type;
    if (data.bedrooms) {
      summary += ` de ${data.bedrooms} quarto${Number(data.bedrooms) > 1 ? 's' : ''}`;
    }
    if (data.garageSpaces) {
      summary += ` e ${data.garageSpaces} vaga${Number(data.garageSpaces) > 1 ? 's' : ''} de garagem`;
    }
    return summary;
  };
  const propertySummary = getPropertySummary();

  // Textos chamativos para quando não há entrada
  const noEntryTexts = [
    { title: 'Oportunidade Única', subtitle: 'Abaixo do Mercado', icon: Sparkles },
    { title: 'Desconto Imperdível', subtitle: `${data.discount}% OFF`, icon: TrendingDown },
    { title: 'Preço Exclusivo', subtitle: 'Venda Direta', icon: Zap },
  ];

  const getNoEntryContent = () => {
    if (data.discount && parseFloat(data.discount) >= 30) {
      return noEntryTexts[1];
    }
    return noEntryTexts[0];
  };

  const noEntryContent = getNoEntryContent();
  const NoEntryIcon = noEntryContent.icon;

  const rawSource = data.propertySource || 'Imóvel Caixa';
  const propertySource = rawSource.toLowerCase().includes('caixa') ? 'Imóvel Caixa' : rawSource;

  return (
    <div className="post-template relative overflow-hidden">
      {/* Foto do imóvel como fundo completo */}
      {photo ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photo})` }}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a3f4a] via-[#2a2f38] to-[#1a1f28]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
        </>
      )}

      {/* Marca d'água VDH central */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
        <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '180px' }}>VDH</p>
      </div>

      {/* Header - Entrada ou Texto Chamativo */}
      <div className="absolute z-10" style={{ top: '20px', left: '20px' }}>
        {data.hasEasyEntry && data.entryValue ? (
          <div className="bg-[#1e3a2f] rounded-t-lg" style={{ padding: '12px 40px' }}>
            <p className="text-white font-medium leading-tight" style={{ fontSize: '28px' }}>Entrada a partir de</p>
            <p className="text-white font-bold tracking-tight leading-none" style={{ fontSize: '72px' }}>
              {data.entryValue}
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-[#1e3a2f] to-[#2d5a4f] rounded-t-lg" style={{ padding: '12px 40px' }}>
            <div className="flex items-center gap-3">
              <NoEntryIcon className="text-[#f5d485]" style={{ width: '28px', height: '28px' }} />
              <p className="text-[#f5d485] font-medium leading-tight" style={{ fontSize: '28px' }}>{noEntryContent.title}</p>
            </div>
            <p className="text-white font-bold tracking-tight leading-none" style={{ fontSize: '72px' }}>
              {noEntryContent.subtitle}
            </p>
          </div>
        )}

        {/* Subtítulo com tipo e cidade */}
        <div className="bg-[#2d4a3f] flex items-center rounded-b-lg" style={{ padding: '8px 40px', gap: '20px' }}>
          <span className="text-white font-medium" style={{ fontSize: '28px' }}>
            {data.bedrooms && data.bedrooms !== '' && data.bedrooms !== '0'
              ? `${data.type} de ${data.bedrooms} quarto${Number(data.bedrooms) > 1 ? 's' : ''}`
              : data.type}
          </span>
          <span className="text-white/50">|</span>
          <span className="text-white font-semibold" style={{ fontSize: '32px' }}>
            {[data.city, (data.state || '').trim().length > 2 ? (data.state || '').trim().slice(0, 2).toUpperCase() : data.state].filter(Boolean).join(' - ')}
          </span>
        </div>
      </div>

      {/* Logo VDH no topo direito — sem fundo */}
      <div className="absolute z-20" style={{ top: '20px', right: '20px' }}>
        <img
          src={logoBase64}
          alt="VDH"
          className="object-contain drop-shadow-2xl"
          style={{ height: '72px' }}
        />
      </div>

      {/* Rodapé */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2a3142] z-10">
        <div className="flex items-stretch" style={{ minHeight: '270px' }}>

          {/* Badge financiamento */}
          <div
            className="flex-shrink-0 relative overflow-hidden flex flex-col items-center justify-center text-center"
            style={{ minWidth: '230px' }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: data.acceptsFinancing
                  ? 'linear-gradient(160deg, #15803d 0%, #22c55e 40%, #16a34a 100%)'
                  : 'linear-gradient(160deg, #c2410c 0%, #f97316 40%, #ea580c 100%)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            <div
              className="absolute inset-0"
              style={{
                boxShadow: data.acceptsFinancing
                  ? 'inset 0 0 20px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.25)'
                  : 'inset 0 0 20px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.2)'
              }}
            />
            <div className="relative flex flex-col items-center" style={{ padding: '14px 20px', gap: '4px' }}>
              {/* Fonte do imóvel */}
              <span style={{ fontSize: '26px', fontWeight: 800, color: '#fff', letterSpacing: '0.01em', lineHeight: 1.2, textAlign: 'center', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
                {propertySource}
              </span>
              <div style={{ width: '75%', height: '1px', background: 'rgba(255,255,255,0.4)', margin: '5px 0' }} />
              <span style={{ fontSize: '30px', fontWeight: 900, color: '#fff', letterSpacing: '0.03em', lineHeight: 1.15, textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                {data.acceptsFinancing
                  ? <><span style={{ display: 'block' }}>ACEITA</span><span style={{ display: 'block' }}>FINANCIAMENTO</span><span style={{ display: 'block', fontSize: '26px', fontWeight: 700 }}>BANCÁRIO</span></>
                  : <><span style={{ display: 'block' }}>SOMENTE</span><span style={{ display: 'block' }}>À VISTA</span></>
                }
              </span>
            </div>
          </div>

          {/* Separador vertical */}
          <div className="self-stretch w-px bg-white/20 flex-shrink-0 my-3" />

          {/* Informações do imóvel */}
          <div className="flex-1 flex flex-col justify-center" style={{ padding: '16px 20px', gap: '4px' }}>
            {/* Nome do condomínio — DESTAQUE, primeira linha */}
            <p style={{ fontSize: '34px', fontWeight: 900, color: '#f5d485', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              {(data.propertyName && data.propertyName.trim()) || `${data.type || 'Casa'}`}
            </p>
            {/* Tipo do imóvel */}
            <p style={{ fontSize: '22px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
              {propertySummary}
            </p>
            {/* Endereço completo automático */}
            {displayAddress && (
              <p style={{ fontSize: '18px', color: '#fff', lineHeight: 1.3 }}>
                {displayAddress}
              </p>
            )}
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.70)', marginTop: '2px' }}>
                VENDA DIRETA {coverCreci}
              </p>
          </div>

          {/* Separador vertical */}
          <div className="self-stretch w-px bg-white/20 flex-shrink-0 my-3" />

          {/* Valores */}
          <div className="flex-shrink-0 text-right flex flex-col justify-center" style={{ padding: '16px 22px', gap: '5px' }}>
            {/* Preço de venda — DESTAQUE */}
            <p style={{ fontSize: '38px', fontWeight: 900, color: '#f5d485', letterSpacing: '-0.01em', lineHeight: 1 }}>
              {data.minimumValue}
            </p>
            {/* Valor de avaliação — label + valor riscado */}
            {data.evaluationValue && (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '15px', color: '#fff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                  Valor de Avaliação
                </span>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{ fontSize: '24px', fontWeight: 500, color: '#fff', lineHeight: 1 }}>
                    {data.evaluationValue}
                  </span>
                  <span style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#fff',
                    transform: 'translateY(-50%)',
                    display: 'block',
                  }} />
                </div>
              </div>
            )}
            {/* Entrada a partir de — quando aceita financiamento */}
            {data.acceptsFinancing && data.entryValue && (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '2px' }}>
                <span style={{ fontSize: '16px', color: '#fff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
                  Entrada a partir de
                </span>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#fff', lineHeight: 1, whiteSpace: 'nowrap' }}>
                  {data.entryValue}
                </span>
              </div>
            )}
            {data.acceptsFGTS && (
              <p style={{ fontSize: '19px', color: '#fff', fontWeight: 600 }}>✓ Aceita FGTS</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
