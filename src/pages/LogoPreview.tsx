import logo1 from '@/assets/logo-af-new1.png';
import logo2 from '@/assets/logo-af-new2.png';
import logo3 from '@/assets/logo-af-new3.png';
import logo4 from '@/assets/logo-af-new4.png';
import logo5 from '@/assets/logo-af-new5.png';

const options = [
  { src: logo1, label: 'A', desc: 'Tipográfico Editorial — contraste extremo de peso entre as duas linhas' },
  { src: logo2, label: 'B', desc: 'Diamante Geométrico — símbolo abstrato de planta de apartamento' },
  { src: logo3, label: 'C', desc: 'Monograma Luxo — AF em serif com ícone de janela coral acima' },
  { src: logo4, label: 'D', desc: 'Wordmark Itálico — FORTALEZA bold italic com APARTAMENTOS em coral' },
  { src: logo5, label: 'E', desc: 'A Arquitetônico — letra A como telhado com linha horizonte teal' },
];

export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Novas Opções de Logo — Apartamentos Fortaleza</h1>
          <p className="text-gray-500 text-sm">5 conceitos completamente diferentes e profissionais</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((opt) => (
            <div key={opt.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center p-7 gap-4">
              <span className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
                style={{ backgroundColor: '#EDF7F9', color: '#0C7B8E' }}>
                Opção {opt.label}
              </span>
              <div className="w-full flex items-center justify-center rounded-xl p-4 bg-gray-50" style={{ minHeight: 160 }}>
                <img src={opt.src} alt={`Opção ${opt.label}`} loading="lazy" className="w-full max-w-[300px] h-auto object-contain" />
              </div>
              <p className="text-center text-sm text-gray-500">{opt.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-gray-400 text-xs">
          Me diga qual letra (A, B, C, D ou E) você escolheu para aplicar como logo oficial!
        </p>
      </div>
    </div>
  );
}
