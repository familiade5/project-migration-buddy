import { AMPropertyData } from '@/types/apartamentosManaus';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AMPropertyFormProps {
  data: AMPropertyData;
  onChange: (data: AMPropertyData) => void;
}

const propertyTypes = ['Apartamento', 'Casa', 'Casa em Condomínio', 'Cobertura', 'Terreno', 'Sala Comercial'];
const inputClass = 'h-10 border-gray-300 focus:border-[#1B5EA6] bg-white text-gray-900 placeholder:text-gray-400 text-sm';
const textareaClass = 'border-gray-300 focus:border-[#1B5EA6] bg-white text-gray-900 placeholder:text-gray-400 text-sm resize-none';
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

export function AMPropertyForm({ data, onChange }: AMPropertyFormProps) {
  const set = (field: keyof AMPropertyData, value: unknown) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-6">
      {/* Identificação */}
      <Section title="Identificação" color="#1B5EA6">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>Nome do imóvel / condomínio *</Label>
            <Input className={inputClass} placeholder="Ex: Villa Jardim Azaleia"
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
            <Label className={labelClass}>Bairro <span className="text-gray-400 normal-case font-normal">(aparece na capa)</span></Label>
            <Input className={inputClass} placeholder="Ex: Tarumã"
              value={data.neighborhood} onChange={(e) => set('neighborhood', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Cidade</Label>
            <Input className={inputClass} placeholder="Ex: Manaus"
              value={data.city} onChange={(e) => set('city', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Estado</Label>
            <Input className={inputClass} placeholder="Ex: AM"
              value={data.state} onChange={(e) => set('state', e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>Endereço (Rua)</Label>
            <Input className={inputClass} placeholder="Ex: Rua Peixe Cavalo"
              value={data.address} onChange={(e) => set('address', e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>Ponto de Referência</Label>
            <Input className={inputClass} placeholder="Ex: Em frente a Volvo"
              value={data.referencePoint} onChange={(e) => set('referencePoint', e.target.value)} />
          </div>
        </div>
      </Section>

      {/* Especificações */}
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
          <div className="space-y-1">
            <Label className={labelClass}>Andar</Label>
            <Input className={inputClass} placeholder="Ex: 4"
              value={data.floor} onChange={(e) => set('floor', e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <Label className={labelClass}>Cômodos (um por linha)</Label>
          <Textarea className={textareaClass} rows={3}
            placeholder={"Salas estar e jantar\nCozinha americana\nÁrea de serviço"}
            value={data.rooms} onChange={(e) => set('rooms', e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Switch className={switchClass} checked={data.furnished} onCheckedChange={(v) => set('furnished', v)} />
          <Label className="text-sm text-gray-600">Imóvel mobiliado</Label>
        </div>
      </Section>

      {/* Lazer */}
      <Section title="Itens de Lazer" color="#1B5EA6">
        <div className="space-y-1">
          <Label className={labelClass}>Itens (um por linha ou separados por vírgula)</Label>
          <Textarea className={textareaClass} rows={2}
            placeholder={"Piscina\nChurrasqueira\nSalão de festas"}
            value={data.leisureItems} onChange={(e) => set('leisureItems', e.target.value)} />
        </div>
      </Section>

      {/* Valores */}
      <Section title="Valores" color="#F47920">
        {/* Toggle Venda / Locação */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-full">
          <button
            type="button"
            onClick={() => set('isRental', false)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={!data.isRental
              ? { backgroundColor: '#F47920', color: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }
              : { color: '#6B7280', backgroundColor: 'transparent' }}
          >
            Venda
          </button>
          <button
            type="button"
            onClick={() => set('isRental', true)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={data.isRental
              ? { backgroundColor: '#1B5EA6', color: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }
              : { color: '#6B7280', backgroundColor: 'transparent' }}
          >
            Locação
          </button>
        </div>

        <div className="space-y-3">
          {!data.isRental ? (
            <>
              <div className="space-y-1">
                <Label className={labelClass}>Preço de Venda (R$)</Label>
                <Input className={inputClass} type="number" placeholder="0"
                  value={data.salePrice || ''} onChange={(e) => set('salePrice', Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-2">
                <Switch className={switchClass} checked={data.acceptsFinancing} onCheckedChange={(v) => set('acceptsFinancing', v)} />
                <Label className="text-sm text-gray-600">Aceita financiamento</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch className={switchClass} checked={data.acceptsFGTS} onCheckedChange={(v) => set('acceptsFGTS', v)} />
                <Label className="text-sm text-gray-600">Aceita FGTS</Label>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <Label className={labelClass}>Valor do Aluguel (R$)</Label>
              <Input className={inputClass} type="number" placeholder="0"
                value={data.rentalPrice || ''} onChange={(e) => set('rentalPrice', Number(e.target.value))} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <Label className={labelClass}>Condomínio (R$)</Label>
            <Input className={inputClass} type="number" placeholder="0"
              value={data.condominiumFee || ''} onChange={(e) => set('condominiumFee', Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>IPTU (R$)</Label>
            <Input className={inputClass} type="number" placeholder="0"
              value={data.iptu || ''} onChange={(e) => set('iptu', Number(e.target.value))} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>O condomínio inclui</Label>
            <Input className={inputClass} placeholder="Ex: água, gás e segurança 24h"
              value={data.condoIncludes} onChange={(e) => set('condoIncludes', e.target.value)} />
          </div>
        </div>
      </Section>

      {/* Contato */}
      <Section title="Corretor / Contato" color="#1B5EA6">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className={labelClass}>Nome do Corretor</Label>
            <Input className={inputClass} placeholder="Nome completo"
              value={data.brokerName} onChange={(e) => set('brokerName', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Telefone / WhatsApp</Label>
            <Input className={inputClass} placeholder="(92) 99999-9999"
              value={data.brokerPhone} onChange={(e) => set('brokerPhone', e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>CRECI <span className="text-gray-400 normal-case font-normal">(editável)</span></Label>
            <Input className={inputClass} placeholder="Ex: CRECI 14851 MS PJ"
              value={data.creci} onChange={(e) => set('creci', e.target.value)} />
          </div>
        </div>
      </Section>

      {/* Mensagem extra */}
      <Section title="Mensagem Informativa Extra" color="#F47920">
        <Textarea className={textareaClass} rows={2}
          placeholder="Ex: Unidades limitadas, consulte disponibilidade!"
          value={data.infoMessage} onChange={(e) => set('infoMessage', e.target.value)} />
      </Section>
    </div>
  );
}
