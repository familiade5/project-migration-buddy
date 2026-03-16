import { PropertyData } from '@/types/property';
import { Sparkles, TrendingDown, Zap } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

interface PostCoverStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostCoverStory = ({ data, photo }: PostCoverStoryProps) => {
  const logoBase64 = useLogoBase64(logoVDH);

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

  const propertySource = data.propertySource || 'Imóvel Caixa';

  return (
    <div className="post-template-story relative overflow-hidden" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Foto do imóvel como fundo completo */}
      {photo ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photo})`, backgroundPosition: 'center 20%' }}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a3f4a] via-[#2a2f38] to-[#1a1f28]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
        </>
      )}

      {/* Marca d'água VDH central */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 5 }}>
        <p className="font-bold tracking-wider" style={{ fontSize: '260px', color: 'rgba(255,255,255,0.10)' }}>VDH</p>
      </div>

      {/* Header - Entrada ou Texto Chamativo */}
      <div className="absolute z-10" style={{ top: '28px', left: '28px', right: '28px' }}>
        {data.hasEasyEntry && data.entryValue ? (
          <div style={{ background: '#1e3a2f', borderRadius: '16px 16px 0 0', padding: '16px 48px' }}>
            <p className="text-white font-medium leading-tight" style={{ fontSize: '36px' }}>Entrada a partir de</p>
            <p className="text-white font-bold tracking-tight leading-none" style={{ fontSize: '96px' }}>
              {data.entryValue}
            </p>
          </div>
        ) : (
          <div style={{ background: 'linear-gradient(to right, #1e3a2f, #2d5a4f)', borderRadius: '16px 16px 0 0', padding: '16px 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <NoEntryIcon color="#f5d485" style={{ width: '36px', height: '36px' }} />
              <p style={{ color: '#f5d485', fontWeight: 500, fontSize: '36px', lineHeight: '1.1' }}>{noEntryContent.title}</p>
            </div>
            <p className="text-white font-bold tracking-tight leading-none" style={{ fontSize: '96px' }}>
              {noEntryContent.subtitle}
            </p>
          </div>
        )}

        {/* Subtítulo com tipo e cidade */}
        <div style={{ background: '#2d4a3f', display: 'flex', alignItems: 'center', borderRadius: '0 0 16px 16px', padding: '10px 48px', gap: '24px' }}>
          <span className="text-white font-medium" style={{ fontSize: '34px' }}>
            {data.bedrooms && data.bedrooms !== '' && data.bedrooms !== '0'
              ? `${data.type} de ${data.bedrooms} quarto${Number(data.bedrooms) > 1 ? 's' : ''}`
              : data.type}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '34px' }}>|</span>
          <span className="text-white font-semibold" style={{ fontSize: '38px' }}>
            {[data.city, (data.state || '').trim().length > 2 ? (data.state || '').trim().slice(0, 2).toUpperCase() : data.state].filter(Boolean).join(' - ')}
          </span>
        </div>
      </div>

      {/* Logo VDH no topo direito — sem fundo */}
      <div className="absolute z-20" style={{ top: '28px', right: '28px' }}>
        <img
          src={logoBase64}
          alt="VDH"
          className="object-contain drop-shadow-2xl"
          style={{ height: '90px' }}
        />
      </div>

      {/* Rodapé */}
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{ background: '#2a3142' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', minHeight: '380px' }}>

          {/* Badge financiamento */}
          <div
            style={{
              flexShrink: 0,
              minWidth: '280px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: data.acceptsFinancing
                  ? 'linear-gradient(160deg, #15803d 0%, #22c55e 40%, #16a34a 100%)'
                  : 'linear-gradient(160deg, #c2410c 0%, #f97316 40%, #ea580c 100%)'
              }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.20) 0%, transparent 100%)' }} />
            <div
              className="absolute inset-0"
              style={{
                boxShadow: data.acceptsFinancing
                  ? 'inset 0 0 20px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.25)'
                  : 'inset 0 0 20px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.2)'
              }}
            />
            <div className="relative" style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              {/* Fonte do imóvel */}
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#fff', letterSpacing: '0.01em', lineHeight: 1.2, textAlign: 'center', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
                {propertySource}
              </span>
              <div style={{ width: '75%', height: '2px', background: 'rgba(255,255,255,0.4)', margin: '6px 0' }} />
              <span style={{ fontSize: '38px', fontWeight: 900, color: '#fff', letterSpacing: '0.03em', lineHeight: 1.15, textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                {data.acceptsFinancing
                  ? <><span style={{ display: 'block' }}>ACEITA</span><span style={{ display: 'block' }}>FINANCIAMENTO</span><span style={{ display: 'block', fontSize: '32px', fontWeight: 700 }}>BANCÁRIO</span></>
                  : <><span style={{ display: 'block' }}>SOMENTE</span><span style={{ display: 'block' }}>À VISTA</span></>
                }
              </span>
            </div>
          </div>

          {/* Separador vertical */}
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', alignSelf: 'stretch', margin: '16px 0', flexShrink: 0 }} />

          {/* Informações do imóvel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 28px', gap: '6px' }}>
            {/* Nome do condomínio — ocupa linha inteira */}
            <p style={{ fontSize: '46px', fontWeight: 900, color: '#f5d485', lineHeight: 1.1, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {(data.propertyName && data.propertyName.trim()) || `${data.type || 'Casa'}`}
            </p>
            {/* Tipo do imóvel */}
            <p style={{ fontSize: '30px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
              {propertySummary}
            </p>
            {/* Endereço completo automático */}
            {displayAddress && (
              <p style={{ fontSize: '24px', color: '#fff', lineHeight: 1.3 }}>
                {displayAddress}
              </p>
            )}
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.70)', marginTop: '4px' }}>
              VENDA DIRETA {data.creci}
            </p>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.20)', margin: '8px 0' }} />

            {/* Preço de venda — DESTAQUE */}
            <p style={{ fontSize: '52px', fontWeight: 900, color: '#f5d485', letterSpacing: '-0.01em', lineHeight: 1 }}>
              {data.minimumValue}
            </p>

            {/* Valor de avaliação — label em cima, valor riscado abaixo */}
            {data.evaluationValue && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Valor de Avaliação
                </span>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{ fontSize: '28px', fontWeight: 500, color: '#fff', lineHeight: 1 }}>
                    {data.evaluationValue}
                  </span>
                  <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: '#fff', transform: 'translateY(-50%)', display: 'block', pointerEvents: 'none' }} />
                </div>
              </div>
            )}

            {/* Entrada a partir de */}
            {data.acceptsFinancing && data.entryValue && (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '20px', color: '#fff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
                  Entrada a partir de
                </span>
                <span style={{ fontSize: '32px', fontWeight: 800, color: '#fff', lineHeight: 1, whiteSpace: 'nowrap' }}>
                  {data.entryValue}
                </span>
              </div>
            )}

            {/* FGTS */}
            {data.acceptsFGTS && (
              <p style={{ fontSize: '26px', color: '#fff', fontWeight: 600 }}>✓ Aceita FGTS</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
