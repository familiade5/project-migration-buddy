import logoE from '@/assets/logo-af-final5.png';
import logoE1 from '@/assets/logo-af-e1.png';
import logoE2 from '@/assets/logo-af-e2.png';
import logoE3 from '@/assets/logo-af-e3.png';
import logoE4 from '@/assets/logo-af-e4.png';
import logoE5 from '@/assets/logo-af-e5.png';

const options = [
  { src: logoE,  label: 'E',  desc: 'Original — círculo teal outline + AF + linha coral' },
  { src: logoE1, label: 'E1', desc: 'Círculo preenchido teal com AF branco + linha coral embaixo' },
  { src: logoE2, label: 'E2', desc: 'Círculo outline coral com AF teal + Apartamentos / Fortaleza' },
  { src: logoE3, label: 'E3', desc: 'Círculo teal outline + ponto coral flutuante + AF serif' },
  { src: logoE4, label: 'E4', desc: 'Meia-lua teal com AF branco + linha coral vertical separadora' },
  { src: logoE5, label: 'E5', desc: 'Dois círculos concêntricos + AF com quadrado coral acento' },
];

export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Variações da Opção E</h1>
          <p className="text-gray-500 text-sm">Original + 5 variações no estilo círculo + wordmark</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((opt) => (
            <div key={opt.label}
              className={`bg-white rounded-2xl border shadow-sm flex flex-col items-center p-7 gap-4 ${opt.label === 'E' ? 'border-gray-400 ring-2 ring-gray-300' : 'border-gray-200'}`}>
              <span className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${opt.label === 'E' ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-500'}`}>
                Opção {opt.label} {opt.label === 'E' ? '· Original' : ''}
              </span>
              <div className="w-full flex items-center justify-center rounded-xl p-4 bg-gray-50" style={{ minHeight: 160 }}>
                <img src={opt.src} alt={`Opção ${opt.label}`} loading="lazy" className="w-full max-w-[320px] h-auto object-contain" />
              </div>
              <p className="text-center text-sm text-gray-500">{opt.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-gray-400 text-xs">
          Me diga qual opção (E, E1, E2, E3, E4 ou E5) você quer aplicar como logo oficial!
        </p>
      </div>
    </div>
  );
}
