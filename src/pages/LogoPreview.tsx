import logo3 from '@/assets/logo-af-option3.png';
import logo4 from '@/assets/logo-af-v4.png';
import logo5 from '@/assets/logo-af-v5.png';
import logo6 from '@/assets/logo-af-v6.png';
import logo7 from '@/assets/logo-af-v7.png';
import logo8 from '@/assets/logo-af-v8.png';

const options = [
  { src: logo3, label: 'Opção 3', desc: 'Coastal Dinâmica — onda coral com AF bold', badge: 'Favorita anterior' },
  { src: logo4, label: 'Opção 4', desc: 'Slash Diagonal — traço coral cortando o AF geométrico' },
  { src: logo5, label: 'Opção 5', desc: 'Bloco Coral — retângulo coral de fundo no F, dois tons' },
  { src: logo6, label: 'Opção 6', desc: 'Prédio Integrado — ícone de apartamento saindo do AF' },
  { src: logo7, label: 'Opção 7', desc: 'Ligatura AF — letras interligadas com degradê teal' },
  { src: logo8, label: 'Opção 8', desc: 'Sol de Fortaleza — sol coral nascendo acima do AF' },
];

export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Escolha a Logo — Apartamentos Fortaleza</h1>
          <p className="text-gray-500 text-sm">Opção 3 mantida como referência + 5 novas variações</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((opt) => (
            <div
              key={opt.label}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col items-center p-7 gap-4 ${opt.badge ? 'border-[#0C7B8E] ring-2 ring-[#0C7B8E]/20' : 'border-gray-200'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#0C7B8E] bg-[#EDF7F9] px-3 py-1 rounded-full">
                  {opt.label}
                </span>
                {opt.badge && (
                  <span className="text-xs font-medium text-white bg-[#E8562A] px-2 py-0.5 rounded-full">
                    {opt.badge}
                  </span>
                )}
              </div>
              <div className="w-full flex items-center justify-center bg-gray-50 rounded-xl p-4" style={{ minHeight: 140 }}>
                <img
                  src={opt.src}
                  alt={opt.label}
                  loading="lazy"
                  className="w-full max-w-[280px] h-auto object-contain"
                />
              </div>
              <p className="text-center text-sm text-gray-500">{opt.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-gray-400 text-xs">
          Me diga o número da que você escolheu e aplicarei como logo oficial do sistema!
        </p>
      </div>
    </div>
  );
}
