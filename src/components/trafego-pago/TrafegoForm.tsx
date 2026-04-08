import { TrafegoPropertyData } from '@/types/trafegoPago';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  data: TrafegoPropertyData;
  onChange: (data: TrafegoPropertyData) => void;
}

const propertyTypes = ['Apartamento', 'Casa', 'Casa em Condomínio', 'Cobertura', 'Terreno'];
const inputClass = 'h-10 border-gray-300 focus:border-[#1B5EA6] bg-white text-gray-900 placeholder:text-gray-400 text-sm';
const labelClass = 'text-xs font-semibold text-gray-600 uppercase tracking-wide';
const switchClass = 'data-[state=checked]:bg-[#1B5EA6] data-[state=unchecked]:bg-gray-300 border-transparent';

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function TrafegoForm({ data, onChange }: Props) {
  const set = (field: keyof TrafegoPropertyData, value: unknown) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-6">
      <Section title="Imóvel" color="#1B5EA6">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>Nome / Condomínio</Label>
            <Input className={inputClass} placeholder="Ex: Residencial Parque das Flores"
              value={data.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Tipo</Label>
            <Select value={data.propertyType} onValueChange={(v) => set('propertyType', v)}>
              <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
              <SelectContent>{propertyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Bairro</Label>
            <Input className={inputClass} placeholder="Ex: Tarumã"
              value={data.neighborhood} onChange={(e) => set('neighborhood', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Cidade</Label>
            <Input className={inputClass} value={data.city} onChange={(e) => set('city', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Estado</Label>
            <Input className={inputClass} value={data.state} onChange={(e) => set('state', e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Especificações" color="#1B5EA6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Quartos', field: 'bedrooms' as const },
            { label: 'Suítes', field: 'suites' as const },
            { label: 'Banheiros', field: 'bathrooms' as const },
            { label: 'Área (m²)', field: 'area' as const },
            { label: 'Vagas', field: 'garageSpaces' as const },
          ].map(({ label, field }) => (
            <div key={field} className="space-y-1">
              <Label className={labelClass}>{label}</Label>
              <Input className={inputClass} type="number" min={0}
                value={data[field] || ''}
                onChange={(e) => set(field, Number(e.target.value))} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Valores & Condições" color="#F47920">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className={labelClass}>Preço de Venda (R$)</Label>
            <Input className={inputClass} type="number" placeholder="0"
              value={data.salePrice || ''} onChange={(e) => set('salePrice', Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Parcelas (texto livre)</Label>
            <Input className={inputClass} placeholder="Ex: Parcelas a partir de R$ 499"
              value={data.parcelas} onChange={(e) => set('parcelas', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Subsídio (texto livre)</Label>
            <Input className={inputClass} placeholder="Ex: Subsídio até R$ 55.000"
              value={data.subsidio} onChange={(e) => set('subsidio', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Entrada (texto livre)</Label>
            <Input className={inputClass} placeholder="Ex: Sem entrada / Entrada R$ 5.000"
              value={data.entrada} onChange={(e) => set('entrada', e.target.value)} />
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Switch className={switchClass} checked={data.isMCMV} onCheckedChange={(v) => set('isMCMV', v)} />
              <Label className="text-sm text-gray-600">Minha Casa Minha Vida</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch className={switchClass} checked={data.acceptsFinancing} onCheckedChange={(v) => set('acceptsFinancing', v)} />
              <Label className="text-sm text-gray-600">Financiamento</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch className={switchClass} checked={data.acceptsFGTS} onCheckedChange={(v) => set('acceptsFGTS', v)} />
              <Label className="text-sm text-gray-600">FGTS</Label>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Textos Personalizados" color="#1B5EA6">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className={labelClass}>Headline (opcional)</Label>
            <Input className={inputClass} placeholder="Ex: Seu novo lar te espera!"
              value={data.headline} onChange={(e) => set('headline', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Sub-headline (opcional)</Label>
            <Input className={inputClass} placeholder="Ex: Condições imperdíveis"
              value={data.subheadline} onChange={(e) => set('subheadline', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Texto do CTA</Label>
            <Input className={inputClass} placeholder="Ex: Saiba Mais"
              value={data.ctaText} onChange={(e) => set('ctaText', e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Destaques" color="#F47920">
        <div className="space-y-1">
          <Label className={labelClass}>Diferenciais (um por linha, máx 6)</Label>
          <Textarea
            className="border-gray-300 focus:border-[#1B5EA6] bg-white text-gray-900 placeholder:text-gray-400 text-sm resize-none"
            rows={4}
            placeholder={"Piscina\nÁrea gourmet\nPlayground\nSalão de festas\nAcademia\nPortaria 24h"}
            value={data.highlights.join('\n')}
            onChange={(e) => set('highlights', e.target.value.split('\n').filter(Boolean).slice(0, 6))}
          />
        </div>
      </Section>

      <Section title="Contato" color="#1B5EA6">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className={labelClass}>Nome do Corretor</Label>
            <Input className={inputClass} value={data.brokerName} onChange={(e) => set('brokerName', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>WhatsApp</Label>
            <Input className={inputClass} placeholder="(92) 99999-9999"
              value={data.brokerPhone} onChange={(e) => set('brokerPhone', e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>CRECI</Label>
            <Input className={inputClass} value={data.creci} onChange={(e) => set('creci', e.target.value)} />
          </div>
        </div>
      </Section>
    </div>
  );
}
