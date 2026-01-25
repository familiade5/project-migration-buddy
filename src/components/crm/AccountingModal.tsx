import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CrmProperty } from '@/types/crm';
import { AccountingDashboard } from './accounting/AccountingDashboard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Lock, TrendingUp, X } from 'lucide-react';

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
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-300 transition-all"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Contabilidade
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-50 border-gray-200 max-w-[95vw] w-[1400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Contabilidade
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-full hover:bg-gray-200"
          >
            <X className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Fechar</span>
          </Button>
        </DialogHeader>

        {isAdmin ? (
          <AccountingDashboard properties={properties} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 shadow-inner">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Acesso Restrito
            </h3>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              O dashboard de contabilidade contém informações financeiras sensíveis 
              e está disponível apenas para administradores do sistema.
              <br /><br />
              Entre em contato com um administrador caso precise de acesso 
              a relatórios ou informações específicas.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
