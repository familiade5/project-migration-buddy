import { DetailLevel } from '@/types/revenda';
import { Sun, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RevendaDetailLevelSelectorProps {
  value: DetailLevel;
  onChange: (level: DetailLevel) => void;
}

export const RevendaDetailLevelSelector = ({ value, onChange }: RevendaDetailLevelSelectorProps) => {
  const options: { level: DetailLevel; title: string; description: string; icon: typeof Sun; features: string[] }[] = [
    {
      level: 'conforto',
      title: 'Detalhes de Conforto',
      description: 'Ideal para a maioria dos imóveis',
      icon: Sun,
      features: [
        'Iluminação natural',
        'Varanda',
        'Vista privilegiada',
        'Layout bem distribuído',
      ],
    },
    {
      level: 'premium',
      title: 'Completo Premium',
      description: 'Para imóveis de alto padrão',
      icon: Sparkles,
      features: [
        'Tudo do Conforto +',
        'Qualidade dos acabamentos',
        'Descrição livre',
        'Diferenciais exclusivos',
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800">Nível de Detalhamento</h3>
        <p className="text-sm text-slate-500 mt-1">Escolha quanto detalhe você quer incluir no post</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = value === option.level;
          const Icon = option.icon;
          
          return (
            <button
              key={option.level}
              onClick={() => onChange(option.level)}
              className={cn(
                "relative p-5 rounded-xl border-2 text-left transition-all hover:shadow-md",
                isSelected 
                  ? "border-sky-500 bg-sky-50/50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  isSelected ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={cn(
                    "font-semibold",
                    isSelected ? "text-sky-700" : "text-slate-700"
                  )}>
                    {option.title}
                  </h4>
                  <p className="text-xs text-slate-500">{option.description}</p>
                </div>
              </div>
              
              {/* Features */}
              <ul className="space-y-1.5">
                {option.features.map((feature, idx) => (
                  <li 
                    key={idx}
                    className={cn(
                      "text-sm flex items-center gap-2",
                      isSelected ? "text-slate-700" : "text-slate-500"
                    )}
                  >
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isSelected ? "bg-sky-500" : "bg-slate-300"
                    )} />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
};
