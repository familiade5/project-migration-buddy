/**
 * SELO "OPORTUNIDADE" — balão de explosão (starburst)
 * Usado no Slide 1 do Feed e no Slide 1 do Story do AM.
 */

const golos = "'Golos Text', Arial, sans-serif";

export const AMOpportunityBurst = ({
  downPayment = 0,
  size = 108,
  style,
}: {
  downPayment?: number;
  size?: number;
  style?: React.CSSProperties;
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const spikes = 16;
  const rOut = size / 2 - 2;
  const rIn = rOut * 0.845;
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? rOut : rIn;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  const burst = pts.join(' ');

  // escala das fontes/raios proporcional ao tamanho base (108)
  const k = size / 108;
  const s = (n: number) => Math.round(n * k * 100) / 100;

  const mil = downPayment > 0 && downPayment % 1000 === 0;
  const valueMain = downPayment > 0
    ? (mil ? String(downPayment / 1000) : downPayment.toLocaleString('pt-BR'))
    : '';

  const textShadow = '0 2px 0 #A63C00, 0 3px 0 #8C3200, 0 4px 6px rgba(0,0,0,0.35)';

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: 'rotate(-7deg)',
        fontFamily: golos,
        position: 'relative',
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', top: 0, left: 0, display: 'block' }}>
        <defs>
          <linearGradient id="amOppBurstGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFA23F" />
            <stop offset="55%" stopColor="#F97A12" />
            <stop offset="100%" stopColor="#D45E05" />
          </linearGradient>
        </defs>
        {/* contorno branco do adesivo */}
        <polygon points={burst} fill="#ffffff" transform={`translate(${cx} ${cy}) scale(1.035) translate(${-cx} ${-cy})`} />
        <polygon points={burst} fill="url(#amOppBurstGrad)" />
        {/* brilho superior */}
        <ellipse cx={cx} cy={cy * 0.62} rx={rIn * 0.72} ry={rIn * 0.34} fill="#ffffff" opacity="0.12" />
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: `0 ${s(10)}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* raios decorativos superiores */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginBottom: 2 }}>
          <div style={{ width: 2, height: s(6), background: '#FFE14D', borderRadius: 2, transform: 'rotate(-22deg)' }} />
          <div style={{ width: 2, height: s(8), background: '#FFE14D', borderRadius: 2 }} />
          <div style={{ width: 2, height: s(6), background: '#FFE14D', borderRadius: 2, transform: 'rotate(22deg)' }} />
        </div>

        {downPayment > 0 ? (
          <>
            <span style={{ color: '#FFE14D', fontSize: s(14), fontWeight: 900, lineHeight: 1, letterSpacing: '-0.01em', textShadow }}>
              ENTRADA
            </span>
            <span style={{ color: '#FFE14D', fontSize: s(7), fontWeight: 800, lineHeight: 1.1, letterSpacing: '0.02em', textShadow: '0 1.5px 0 #A63C00' }}>
              A PARTIR DE
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 1, marginTop: 1 }}>
              <span style={{ color: '#ffffff', fontSize: s(11), fontWeight: 900, lineHeight: 1, textShadow }}>R$</span>
              <span style={{ color: '#ffffff', fontSize: mil ? s(25) : s(18), fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', textShadow }}>
                {valueMain}
              </span>
              {mil && (
                <span style={{ color: '#ffffff', fontSize: s(13), fontWeight: 900, lineHeight: 1, textShadow }}>MIL</span>
              )}
            </div>
          </>
        ) : (
          <>
            <span style={{ color: '#FFE14D', fontSize: s(16), fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', textShadow }}>
              ENTRADA
            </span>
            <span style={{ color: '#ffffff', fontSize: s(25), fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', textShadow }}>
              ZERO
            </span>
          </>
        )}

        {/* raios decorativos inferiores */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2, marginTop: 3 }}>
          <div style={{ width: 2, height: s(6), background: '#FFE14D', borderRadius: 2, transform: 'rotate(22deg)' }} />
          <div style={{ width: 2, height: s(8), background: '#FFE14D', borderRadius: 2 }} />
          <div style={{ width: 2, height: s(6), background: '#FFE14D', borderRadius: 2, transform: 'rotate(-22deg)' }} />
        </div>
      </div>
    </div>
  );
};

export default AMOpportunityBurst;
