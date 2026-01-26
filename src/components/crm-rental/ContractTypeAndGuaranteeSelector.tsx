import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Home, Building2, UserCheck, Wallet, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RentalContractType, RentalGuaranteeType, CONTRACT_TYPE_LABELS, GUARANTEE_TYPE_LABELS } from '@/types/rentalProperty';

interface ContractTypeAndGuaranteeSelectorProps {
  contractType: RentalContractType;
  guaranteeType: RentalGuaranteeType;
  onContractTypeChange: (type: RentalContractType) => void;
  onGuaranteeTypeChange: (type: RentalGuaranteeType) => void;
}

export function ContractTypeAndGuaranteeSelector({
  contractType,
  guaranteeType,
  onContractTypeChange,
  onGuaranteeTypeChange,
}: ContractTypeAndGuaranteeSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Contract Type Selection */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Tipo de Contrato</Label>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              contractType === 'residencial' && 'ring-2 ring-primary border-primary'
            )}
            onClick={() => onContractTypeChange('residencial')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                contractType === 'residencial' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <Home className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">Residencial</p>
                <p className="text-xs text-muted-foreground">
                  Para moradia e uso habitacional
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              contractType === 'comercial' && 'ring-2 ring-primary border-primary'
            )}
            onClick={() => onContractTypeChange('comercial')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                contractType === 'comercial' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">Comercial</p>
                <p className="text-xs text-muted-foreground">
                  Para atividade empresarial
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Guarantee Type Selection */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Tipo de Garantia</Label>
        <div className="grid grid-cols-3 gap-4">
          <Card
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              guaranteeType === 'fiador' && 'ring-2 ring-primary border-primary'
            )}
            onClick={() => onGuaranteeTypeChange('fiador')}
          >
            <CardContent className="p-4 text-center">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2',
                guaranteeType === 'fiador' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <UserCheck className="w-6 h-6" />
              </div>
              <p className="font-medium text-sm">Fiador</p>
              <p className="text-xs text-muted-foreground mt-1">
                Pessoa física ou jurídica que garante o contrato
              </p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              guaranteeType === 'caucao' && 'ring-2 ring-primary border-primary'
            )}
            onClick={() => onGuaranteeTypeChange('caucao')}
          >
            <CardContent className="p-4 text-center">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2',
                guaranteeType === 'caucao' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <Wallet className="w-6 h-6" />
              </div>
              <p className="font-medium text-sm">Caução</p>
              <p className="text-xs text-muted-foreground mt-1">
                Depósito em dinheiro (até 3 meses)
              </p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              guaranteeType === 'seguro_fiador' && 'ring-2 ring-primary border-primary'
            )}
            onClick={() => onGuaranteeTypeChange('seguro_fiador')}
          >
            <CardContent className="p-4 text-center">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2',
                guaranteeType === 'seguro_fiador' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="font-medium text-sm">Seguro-Fiador</p>
              <p className="text-xs text-muted-foreground mt-1">
                Seguro contratado pelo inquilino
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Contrato selecionado:</span>{' '}
          {CONTRACT_TYPE_LABELS[contractType]} com {GUARANTEE_TYPE_LABELS[guaranteeType]}
        </p>
      </div>
    </div>
  );
}
