import logo1 from '@/assets/logo-af-final1.png';
import logo2 from '@/assets/logo-af-final2.png';
import logo3 from '@/assets/logo-af-final3.png';
import logo4 from '@/assets/logo-af-final4.png';
import logo5 from '@/assets/logo-af-final5.png';

const options = [
  { src: logo1, label: 'A', desc: 'Tipografia pura — "apartamentos" leve em cima, FORTALEZA bold embaixo com linha coral' },
  { src: logo2, label: 'B', desc: 'Ícone planta + wordmark — dois quadrados sobrepostos em coral com texto ao lado' },
  { src: logo3, label: 'C', desc: 'Wordmark com ponto coral — APARTAMENTOS pequeno + Fortaleza bold + linha teal' },
  { src: logo4, label: 'D', desc: 'Barra vertical coral — âncora lateral com APARTAMENTOS / FORTALEZA bold' },
  { src: logo5, label: 'E', desc: 'Círculo AF + wordmark — monograma em anel teal com texto e linha coral' },
];

export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Novas Logos — Apartamentos Fortaleza</h1>
          <p className="text-gray-500 text-sm">5 conceitos profissionais no estilo wordmark, sem códigos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((opt) => (
            <div key={opt.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center p-7 gap-4">
              <span className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-gray-100 text-gray-600">
                Opção {opt.label}
              </span>
              <div className="w-full flex items-center justify-center rounded-xl p-4 bg-gray-50" style={{ minHeight: 160 }}>
                <img src={opt.src} alt={`Opção ${opt.label}`} loading="lazy" className="w-full max-w-[320px] h-auto object-contain" />
              </div>
              <p className="text-center text-sm text-gray-500">{opt.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-gray-400 text-xs">
          Me diga qual letra (A, B, C, D ou E) você quer usar como logo oficial!
        </p>
      </div>
    </div>
  );
}
