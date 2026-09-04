/**
 * SELO "OPORTUNIDADE" — balão de explosão 3D (starburst)
 * Usado no Slide 1 do Feed e no Slide 1 do Story do AM.
 */

import { useId } from 'react';

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
  const uid = useId();
  const gradId = `amOppBurstGrad-${uid}`;

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
          {/* gradiente radial 3D: centro iluminado, bordas escuras */}
          <radialGradient id={gradId} cx="35%" cy="30%" r="75%" fx="30%" fy="25%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="35%" stopColor="#ef4444" />
            <stop offset="70%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
        </defs>

        {/* contorno branco do adesivo (mais grosso) */}
        <polygon
          points={burst}
          fill="#ffffff"
          transform={`translate(${cx} ${cy}) scale(1.075) translate(${-cx} ${-cy})`}
        />
        {/* corpo vermelho 3D */}
        <polygon points={burst} fill={`url(#${gradId})`} />
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
        padding: `${s(2)}px ${s(4)}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* raios decorativos superiores */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginBottom: 1 }}>
          <div style={{ width: 2, height: s(5), background: '#FFF200', borderRadius: 2, transform: 'rotate(-22deg)' }} />
          <div style={{ width: 2, height: s(7), background: '#FFF200', borderRadius: 2 }} />
          <div style={{ width: 2, height: s(5), background: '#FFF200', borderRadius: 2, transform: 'rotate(22deg)' }} />
        </div>

        {downPayment > 0 ? (
          <>
            <span style={{ color: '#FFF200', fontSize: s(15), fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em' }}>
              ENTRADA
            </span>
            <span style={{ color: '#FFF200', fontSize: s(6), fontWeight: 800, lineHeight: 1.05, letterSpacing: '0.02em' }}>
              A PARTIR DE
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 1, marginTop: 0 }}>
              <span style={{ color: '#FFF200', fontSize: s(11), fontWeight: 900, lineHeight: 1 }}>R$</span>
              <span style={{ color: '#FFF200', fontSize: mil ? s(28) : s(21), fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em' }}>
                {valueMain}
              </span>
              {mil && (
                <span style={{ color: '#FFF200', fontSize: s(12), fontWeight: 900, lineHeight: 1 }}>MIL</span>
              )}
            </div>
          </>
        ) : (
          <>
            <span style={{ color: '#FFF200', fontSize: s(19), fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em' }}>
              ENTRADA
            </span>
            <span style={{ color: '#FFF200', fontSize: s(32), fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em' }}>
              ZERO
            </span>
          </>
        )}

        {/* raios decorativos inferiores */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2, marginTop: 2 }}>
          <div style={{ width: 2, height: s(5), background: '#FFF200', borderRadius: 2, transform: 'rotate(22deg)' }} />
          <div style={{ width: 2, height: s(7), background: '#FFF200', borderRadius: 2 }} />
          <div style={{ width: 2, height: s(5), background: '#FFF200', borderRadius: 2, transform: 'rotate(-22deg)' }} />
        </div>
      </div>
    </div>
  );
};

export default AMOpportunityBurst;
