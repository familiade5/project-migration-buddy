import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CrmProperty } from '@/types/crm';
import { AccountingSection } from './AccountingSection';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calculator, Lock } from 'lucide-react';

interface AccountingModalProps {
  properties: CrmProperty[];
}

export function AccountingModal({ properties }: AccountingModalProps) {
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Contabilidade
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-gray-200 max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Contabilidade
          </DialogTitle>
        </DialogHeader>

        {isAdmin ? (
          <div className="mt-2">
            <AccountingSection properties={properties} isEmbedded />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Acesso Restrito
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Somente administradores podem acessar as informações de contabilidade.
              Entre em contato com um administrador caso precise de acesso.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
