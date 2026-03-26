import logo1 from '@/assets/logo-af-option1.png';
import logo2 from '@/assets/logo-af-option2.png';
import logo3 from '@/assets/logo-af-option3.png';

const options = [
  { src: logo1, label: 'Opção 1', desc: 'Badge Moderno — quadrado teal com linha coral' },
  { src: logo2, label: 'Opção 2', desc: 'Emblema Clássico — selo circular com serif elegante' },
  { src: logo3, label: 'Opção 3', desc: 'Coastal Dinâmica — onda coral com AF bold' },
];

export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Escolha a Logo — Apartamentos Fortaleza</h1>
      <p className="text-gray-500 text-sm mb-10">Selecione a opção preferida e me diga qual deseja usar</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {options.map((opt) => (
          <div key={opt.label} className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden flex flex-col items-center p-8 gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0C7B8E] bg-[#EDF7F9] px-3 py-1 rounded-full">{opt.label}</span>
            <img src={opt.src} alt={opt.label} className="w-full max-w-[260px] h-auto object-contain" />
            <p className="text-center text-sm text-gray-500 mt-2">{opt.desc}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-gray-400 text-xs">Esta página é temporária — após escolher, basta me dizer qual número você quer!</p>
    </div>
  );
}
