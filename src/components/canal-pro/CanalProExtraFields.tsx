import { CanalProExtraData } from '@/types/canalProExtra';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = ['Padrão', 'Cobertura', 'Duplex', 'Triplex', 'Kitnet', 'Loft', 'Flat', 'Studio'];

interface Props {
  data: CanalProExtraData;
  onChange: (data: CanalProExtraData) => void;
  accentColor?: string;
  defaultPrefix?: string; // ex: 'VDH', 'AF' — usado para gerar listingCode
}

const labelClass = 'text-xs font-semibold text-gray-600 uppercase tracking-wide';

export function CanalProExtraFields({ data, onChange, accentColor = '#1B5EA6', defaultPrefix = 'IM' }: Props) {
  const inputClass = 'h-10 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 text-sm';
  const switchClass = 'data-[state=unchecked]:bg-gray-300 border-transparent';

  const set = <K extends keyof CanalProExtraData>(field: K, value: CanalProExtraData[K]) =>
    onChange({ ...data, [field]: value });

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      </div>
      {children}
    </div>
  );

  type BoolKey = { [K in keyof CanalProExtraData]: CanalProExtraData[K] extends boolean ? K : never }[keyof CanalProExtraData];

  const CheckGrid = ({ items }: { items: { label: string; field: BoolKey }[] }) => (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
      {items.map(({ label, field }) => (
        <label key={field as string} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(data[field])}
            onChange={(e) => set(field, e.target.checked as CanalProExtraData[typeof field])}
            className="w-4 h-4 cursor-pointer"
            style={{ accentColor }}
          />
          <span className="text-sm text-gray-700">{label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="px-3 py-2 rounded-lg border" style={{ backgroundColor: `${accentColor}0d`, borderColor: `${accentColor}33` }}>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: accentColor }}>Canal Pro / OLX / ZAP</p>
        <p className="text-[11px] text-gray-500 mt-0.5">Campos extras para publicação automática nos portais. Opcionais — preencha o que tiver.</p>
      </div>

      <Section title="Identificação OLX">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className={labelClass}>CEP <span className="text-red-500 normal-case font-normal">(obrigatório)</span></Label>
            <Input className={inputClass} placeholder="Ex: 60160-000"
              value={data.zipCode} onChange={(e) => set('zipCode', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Nº do endereço</Label>
            <Input className={inputClass} placeholder="Ex: 1234"
              value={data.addressNumber} onChange={(e) => set('addressNumber', e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>Código do anúncio</Label>
            <div className="flex gap-2">
              <Input className={inputClass} placeholder={`${defaultPrefix}1234`}
                value={data.listingCode} onChange={(e) => set('listingCode', e.target.value.toUpperCase())} />
              <button type="button"
                onClick={() => {
                  const id = Math.floor(1000 + Math.random() * 9000);
                  set('listingCode', `${defaultPrefix}${id}`);
                }}
                className="px-3 h-10 rounded-md text-xs font-semibold text-white whitespace-nowrap"
                style={{ backgroundColor: accentColor }}>
                Gerar
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Categoria</Label>
            <Select value={data.category} onValueChange={(v) => set('category', v)}>
              <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Área Total (m²)</Label>
            <Input className={inputClass} type="number" min={0} placeholder="0"
              value={data.totalArea || ''} onChange={(e) => set('totalArea', Number(e.target.value))} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>Mostrar endereço no portal</Label>
            <Select value={data.addressDisplay} onValueChange={(v) => set('addressDisplay', v as CanalProExtraData['addressDisplay'])}>
              <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="completo">Completo</SelectItem>
                <SelectItem value="rua">Somente rua</SelectItem>
                <SelectItem value="bairro">Somente bairro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Switch className={switchClass} style={{ backgroundColor: data.isCommercial ? accentColor : undefined }}
              checked={data.isCommercial} onCheckedChange={(v) => set('isCommercial', v)} />
            <Label className="text-sm text-gray-600">Imóvel comercial (desmarcado = residencial)</Label>
          </div>
        </div>
      </Section>

      <Section title="Diferenciais do Imóvel">
        <CheckGrid items={[
          { label: 'Aceita animais', field: 'hasPets' },
          { label: 'Ar-condicionado', field: 'hasAirConditioning' },
          { label: 'Closet', field: 'hasCloset' },
          { label: 'Cozinha americana', field: 'hasAmericanKitchen' },
          { label: 'Lareira', field: 'hasFireplace' },
          { label: 'Varanda gourmet', field: 'hasGourmetBalcony' },
        ]} />
      </Section>

      <Section title="Sobre o Condomínio">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className={labelClass}>Nº de andares</Label>
            <Input className={inputClass} type="number" min={0} placeholder="0"
              value={data.condoFloors || ''} onChange={(e) => set('condoFloors', Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Unidades por andar</Label>
            <Input className={inputClass} type="number" min={0} placeholder="0"
              value={data.condoUnitsPerFloor || ''} onChange={(e) => set('condoUnitsPerFloor', Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Nº de torres</Label>
            <Input className={inputClass} type="number" min={0} placeholder="0"
              value={data.condoTowers || ''} onChange={(e) => set('condoTowers', Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Ano de construção</Label>
            <Input className={inputClass} placeholder="Ex: 2020"
              value={data.condoBuildYear} onChange={(e) => set('condoBuildYear', e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Lazer e Esporte">
        <CheckGrid items={[
          { label: 'Academia', field: 'amenityGym' },
          { label: 'Churrasqueira', field: 'amenityBBQ' },
          { label: 'Cinema', field: 'amenityCinema' },
          { label: 'Espaço gourmet', field: 'amenityGourmetSpace' },
          { label: 'Jardim', field: 'amenityGarden' },
          { label: 'Piscina', field: 'amenityPool' },
          { label: 'Playground', field: 'amenityPlayground' },
          { label: 'Quadra de squash', field: 'amenitySquashCourt' },
          { label: 'Quadra de tênis', field: 'amenityTennisCourt' },
          { label: 'Quadra poliesportiva', field: 'amenityMultisportCourt' },
          { label: 'Salão de festas', field: 'amenityPartyHall' },
          { label: 'Salão de jogos', field: 'amenityGameRoom' },
        ]} />
      </Section>

      <Section title="Comodidades e Serviços">
        <CheckGrid items={[
          { label: 'Acesso para deficientes', field: 'amenityAccessibility' },
          { label: 'Bicicletário', field: 'amenityBikeRack' },
          { label: 'Coworking', field: 'amenityCoworking' },
          { label: 'Elevador', field: 'amenityElevator' },
          { label: 'Lavanderia', field: 'amenityLaundry' },
          { label: 'Sauna', field: 'amenitySauna' },
          { label: 'Spa', field: 'amenitySpa' },
        ]} />
      </Section>

      <Section title="Segurança">
        <CheckGrid items={[
          { label: 'Condomínio fechado', field: 'amenityGatedCommunity' },
          { label: 'Portão eletrônico', field: 'amenityElectronicGate' },
          { label: 'Portaria 24h', field: 'amenity24hConcierge' },
        ]} />
      </Section>

      <Section title="Negociação Avançada">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Switch className={switchClass} style={{ backgroundColor: data.condoExempt ? accentColor : undefined }}
              checked={data.condoExempt} onCheckedChange={(v) => set('condoExempt', v)} />
            <Label className="text-sm text-gray-600">Condomínio isento</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch className={switchClass} style={{ backgroundColor: data.iptuExempt ? accentColor : undefined }}
              checked={data.iptuExempt} onCheckedChange={(v) => set('iptuExempt', v)} />
            <Label className="text-sm text-gray-600">IPTU isento</Label>
          </div>
        </div>
      </Section>
    </div>
  );
}