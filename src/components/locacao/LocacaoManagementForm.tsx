import { useState } from 'react';
import { LocacaoManagementData, managementBenefitOptions } from '@/types/locacao';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, MessageSquare, Award, Image, Phone } from 'lucide-react';

interface LocacaoManagementFormProps {
  data: LocacaoManagementData;
  onChange: (data: LocacaoManagementData) => void;
}

export const LocacaoManagementForm = ({ data, onChange }: LocacaoManagementFormProps) => {
  const [openSections, setOpenSections] = useState({
    messaging: true,
    benefits: false,
    trust: false,
    background: false,
    contact: false,
  });

  const updateField = (field: keyof LocacaoManagementData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleBenefit = (benefit: string) => {
    const benefits = data.benefits.includes(benefit)
      ? data.benefits.filter(b => b !== benefit)
      : data.benefits.length < 6 
        ? [...data.benefits, benefit]
        : data.benefits;
    updateField('benefits', benefits);
  };

  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    section, 
    number 
  }: { 
    icon: any; 
    title: string; 
    section: keyof typeof openSections;
    number: number;
  }) => (
    <CollapsibleTrigger 
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
          style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
        >
          {number}
        </div>
        <Icon className="w-4 h-4" style={{ color: '#6b7280' }} />
        <span className="font-medium text-sm" style={{ color: '#111827' }}>{title}</span>
      </div>
      <ChevronDown 
        className={`w-4 h-4 transition-transform ${openSections[section] ? 'rotate-180' : ''}`}
        style={{ color: '#9ca3af' }}
      />
    </CollapsibleTrigger>
  );

  return (
    <div className="space-y-2">
      {/* Messaging */}
      <Collapsible open={openSections.messaging}>
        <SectionHeader icon={MessageSquare} title="Mensagem Principal" section="messaging" number={1} />
        <CollapsibleContent className="pt-3 pb-4 px-1 space-y-4">
          <div>
            <Label className="text-xs" style={{ color: '#6b7280' }}>Título Principal</Label>
            <Input
              placeholder="Gestão Profissional de Locação"
              value={data.headline}
              onChange={(e) => updateField('headline', e.target.value)}
              className="mt-1"
              style={{ borderColor: '#e5e7eb' }}
            />
          </div>
          <div>
            <Label className="text-xs" style={{ color: '#6b7280' }}>Subtítulo</Label>
            <Textarea
              placeholder="Você recebe o aluguel. Nós cuidamos do resto."
              value={data.subheadline}
              onChange={(e) => updateField('subheadline', e.target.value)}
              className="mt-1 min-h-[60px]"
              style={{ borderColor: '#e5e7eb' }}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Benefits */}
      <Collapsible open={openSections.benefits}>
        <SectionHeader icon={Award} title="Benefícios do Serviço" section="benefits" number={2} />
        <CollapsibleContent className="pt-3 pb-4 px-1">
          <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>
            Selecione até 6 benefícios ({data.benefits.length}/6)
          </p>
          <div className="grid grid-cols-1 gap-2">
            {managementBenefitOptions.map((benefit) => (
              <label 
                key={benefit}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  data.benefits.includes(benefit) ? 'bg-gray-100' : 'hover:bg-gray-50'
                } ${data.benefits.length >= 6 && !data.benefits.includes(benefit) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Checkbox
                  checked={data.benefits.includes(benefit)}
                  onCheckedChange={() => toggleBenefit(benefit)}
                  disabled={data.benefits.length >= 6 && !data.benefits.includes(benefit)}
                />
                <span className="text-sm" style={{ color: '#374151' }}>{benefit}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Trust Signals */}
      <Collapsible open={openSections.trust}>
        <SectionHeader icon={Award} title="Credibilidade" section="trust" number={3} />
        <CollapsibleContent className="pt-3 pb-4 px-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Anos de Experiência</Label>
              <Input
                placeholder="10+"
                value={data.yearsExperience}
                onChange={(e) => updateField('yearsExperience', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Imóveis Administrados</Label>
              <Input
                placeholder="200+"
                value={data.propertiesManaged}
                onChange={(e) => updateField('propertiesManaged', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Background Image */}
      <Collapsible open={openSections.background}>
        <SectionHeader icon={Image} title="Imagem de Fundo" section="background" number={4} />
        <CollapsibleContent className="pt-3 pb-4 px-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: '#374151' }}>Usar foto de fundo</p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>Adiciona contexto visual sutil</p>
            </div>
            <Switch
              checked={data.useBackgroundPhoto}
              onCheckedChange={(checked) => updateField('useBackgroundPhoto', checked)}
            />
          </div>
          {data.useBackgroundPhoto && (
            <p className="text-xs" style={{ color: '#6b7280' }}>
              A foto será adicionada na área de upload de fotos
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Contact */}
      <Collapsible open={openSections.contact}>
        <SectionHeader icon={Phone} title="Contato" section="contact" number={5} />
        <CollapsibleContent className="pt-3 pb-4 px-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Nome</Label>
              <Input
                value={data.contactName}
                onChange={(e) => updateField('contactName', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Telefone</Label>
              <Input
                value={data.contactPhone}
                onChange={(e) => updateField('contactPhone', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs" style={{ color: '#6b7280' }}>CRECI</Label>
            <Input
              value={data.creci}
              onChange={(e) => updateField('creci', e.target.value)}
              className="mt-1"
              style={{ borderColor: '#e5e7eb' }}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
