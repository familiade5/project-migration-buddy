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
const categories = ['Padrão', 'Cobertura', 'Duplex', 'Triplex', 'Kitnet', 'Loft', 'Flat', 'Studio'];
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

function CheckGrid({
  items,
  data,
  onToggle,
}: {
  items: { label: string; field: keyof AMPropertyData }[];
  data: AMPropertyData;
  onToggle: (field: keyof AMPropertyData, value: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
      {items.map(({ label, field }) => (
        <label key={field as string} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(data[field])}
            onChange={(e) => onToggle(field, e.target.checked)}
            className="w-4 h-4 accent-[#1B5EA6] cursor-pointer"
          />
          <span className="text-sm text-gray-700">{label}</span>
        </label>
      ))}
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
            <Label className={labelClass}>CEP <span className="text-gray-400 normal-case font-normal">(obrigatório p/ OLX)</span></Label>
            <Input className={inputClass} placeholder="Ex: 69050-000"
              value={data.zipCode} onChange={(e) => set('zipCode', e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>Ponto de Referência</Label>
            <Input className={inputClass} placeholder="Ex: Em frente a Volvo"
              value={data.referencePoint} onChange={(e) => set('referencePoint', e.target.value)} />
          </div>
        </div>
      </Section>

      {/* Mídia e Código do Anúncio */}
      <Section title="Mídia e Código do Anúncio" color="#F47920">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className={labelClass}>Código do anúncio</Label>
            <div className="flex gap-2">
              <Input className={inputClass} placeholder="Ex: VILFLW"
                value={data.listingCode || ''} onChange={(e) => set('listingCode', e.target.value.toUpperCase())} />
              <button
                type="button"
                onClick={() => {
                  const id = Math.floor(1000 + Math.random() * 9000);
                  set('listingCode', `APM${id}`);
                }}
                className="px-3 h-10 rounded-md text-xs font-semibold text-white whitespace-nowrap"
                style={{ backgroundColor: '#1B5EA6' }}
              >
                Gerar
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>URL do vídeo YouTube</Label>
            <Input className={inputClass} placeholder="https://www.youtube.com/watch?v=..."
              value={data.youtubeUrl || ''} onChange={(e) => set('youtubeUrl', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>URL do Tour Virtual</Label>
            <Input className={inputClass} placeholder="Cole aqui o link do Tour Virtual"
              value={data.virtualTourUrl || ''} onChange={(e) => set('virtualTourUrl', e.target.value)} />
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
              <div className="mt-2 p-3 rounded-xl border border-orange-200 bg-orange-50/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    className={switchClass}
                    checked={!!data.priceReduced}
                    onCheckedChange={(v) => set('priceReduced', v)}
                  />
                  <Label className="text-sm font-semibold text-orange-700">
                    Baixou o preço
                  </Label>
                </div>
                {data.priceReduced && (
                  <div className="space-y-1">
                    <Label className={labelClass}>Preço antigo (R$)</Label>
                    <Input
                      className={inputClass}
                      type="number"
                      placeholder="0"
                      value={data.oldPrice || ''}
                      onChange={(e) => set('oldPrice', Number(e.target.value))}
                    />
                    <p className="text-[11px] text-gray-500">
                      Aparece riscado na capa, e a legenda se adapta automaticamente.
                    </p>
                  </div>
                )}
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
            <Input className={inputClass} placeholder="Ex: CRECI 3968 AM PF"
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

      {/* ============ Canal Pro — campos extras para publicação multi-portal ============ */}
      <div className="pt-4 mt-2 border-t-2 border-dashed border-gray-200">
        <div className="mb-4 px-3 py-2 rounded-lg bg-[#1B5EA6]/5 border border-[#1B5EA6]/20">
          <p className="text-xs font-semibold text-[#1B5EA6] uppercase tracking-wide">Canal Pro / OLX / ZAP</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Campos extras para publicação automática nos portais. Opcionais — preencha o que tiver.</p>
        </div>
      </div>

      <Section title="Classificação do Anúncio" color="#1B5EA6">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className={labelClass}>Categoria</Label>
            <Select value={data.category || 'Padrão'} onValueChange={(v) => set('category', v)}>
              <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Área Total (m²)</Label>
            <Input className={inputClass} type="number" min={0} placeholder="0"
              value={data.totalArea || ''} onChange={(e) => set('totalArea', Number(e.target.value))} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>Mostrar endereço no portal</Label>
            <Select value={data.addressDisplay || 'completo'} onValueChange={(v) => set('addressDisplay', v)}>
              <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="completo">Completo</SelectItem>
                <SelectItem value="rua">Somente rua</SelectItem>
                <SelectItem value="bairro">Somente bairro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Switch className={switchClass} checked={Boolean(data.isCommercial)} onCheckedChange={(v) => set('isCommercial', v)} />
            <Label className="text-sm text-gray-600">Imóvel comercial (desmarcado = residencial)</Label>
          </div>
        </div>
      </Section>

      <Section title="Diferenciais do Imóvel" color="#1B5EA6">
        <CheckGrid
          data={data}
          onToggle={(f, v) => set(f, v)}
          items={[
            { label: 'Aceita animais', field: 'hasPets' },
            { label: 'Ar-condicionado', field: 'hasAirConditioning' },
            { label: 'Closet', field: 'hasCloset' },
            { label: 'Cozinha americana', field: 'hasAmericanKitchen' },
            { label: 'Lareira', field: 'hasFireplace' },
            { label: 'Varanda gourmet', field: 'hasGourmetBalcony' },
          ]}
        />
      </Section>

      <Section title="Sobre o Condomínio" color="#1B5EA6">
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
              value={data.condoBuildYear || ''} onChange={(e) => set('condoBuildYear', e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Lazer e Esporte" color="#1B5EA6">
        <CheckGrid
          data={data}
          onToggle={(f, v) => set(f, v)}
          items={[
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
          ]}
        />
      </Section>

      <Section title="Comodidades e Serviços" color="#1B5EA6">
        <CheckGrid
          data={data}
          onToggle={(f, v) => set(f, v)}
          items={[
            { label: 'Acesso para deficientes', field: 'amenityAccessibility' },
            { label: 'Bicicletário', field: 'amenityBikeRack' },
            { label: 'Coworking', field: 'amenityCoworking' },
            { label: 'Elevador', field: 'amenityElevator' },
            { label: 'Lavanderia', field: 'amenityLaundry' },
            { label: 'Sauna', field: 'amenitySauna' },
            { label: 'Spa', field: 'amenitySpa' },
          ]}
        />
      </Section>

      <Section title="Segurança" color="#1B5EA6">
        <CheckGrid
          data={data}
          onToggle={(f, v) => set(f, v)}
          items={[
            { label: 'Condomínio fechado', field: 'amenityGatedCommunity' },
            { label: 'Portão eletrônico', field: 'amenityElectronicGate' },
            { label: 'Portaria 24h', field: 'amenity24hConcierge' },
          ]}
        />
      </Section>

      <Section title="Negociação Avançada" color="#F47920">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex items-center gap-2">
            <Switch className={switchClass} checked={Boolean(data.saleAndRental)} onCheckedChange={(v) => set('saleAndRental', v)} />
            <Label className="text-sm text-gray-600">Disponível para Venda E Aluguel</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch className={switchClass} checked={Boolean(data.condoExempt)} onCheckedChange={(v) => set('condoExempt', v)} />
            <Label className="text-sm text-gray-600">Condomínio isento</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch className={switchClass} checked={Boolean(data.iptuExempt)} onCheckedChange={(v) => set('iptuExempt', v)} />
            <Label className="text-sm text-gray-600">IPTU isento</Label>
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={labelClass}>Período do IPTU</Label>
            <Select value={data.iptuPeriod || 'Anual'} onValueChange={(v) => set('iptuPeriod', v)}>
              <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Anual">Anual</SelectItem>
                <SelectItem value="Mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

    </div>
  );
}
