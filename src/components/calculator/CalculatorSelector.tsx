import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Building2, 
  ArrowRight, 
  Target,
  PiggyBank,
  BarChart3
} from 'lucide-react';

export type CalculatorType = 'client' | 'investor';

interface CalculatorSelectorProps {
  onSelect: (type: CalculatorType) => void;
}

export function CalculatorSelector({ onSelect }: CalculatorSelectorProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Calculadoras Financeiras
        </h1>
        <p className="text-gray-600 text-lg">
          Escolha a calculadora ideal para sua necessidade
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Client Calculator */}
        <Card 
          className="group border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 cursor-pointer bg-white shadow-sm hover:shadow-lg"
          onClick={() => onSelect('client')}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
              Simulador de Financiamento
            </CardTitle>
            <CardDescription className="text-gray-500 text-base">
              Para apresentar ao cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Calcule as parcelas do financiamento Caixa de forma simples e visual, 
                ideal para apresentar ao cliente durante a negociação.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>Simulação SAC e PRICE</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PiggyBank className="w-4 h-4 text-blue-500" />
                  <span>Cálculo de entrada e parcelas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span>Tabela de amortização</span>
                </div>
              </div>

              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Acessar Simulador
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Investor Calculator */}
        <Card 
          className="group border-2 border-gray-200 hover:border-emerald-500 transition-all duration-300 cursor-pointer bg-white shadow-sm hover:shadow-lg"
          onClick={() => onSelect('investor')}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                  Novo
                </span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
            <CardTitle className="text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">
              Análise de Investimento
            </CardTitle>
            <CardDescription className="text-gray-500 text-base">
              Para investidores imobiliários
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Analise a viabilidade de investimentos em leilões e venda direta Caixa, 
                com cálculo de ROI, lucro estimado e comparativos de cenários.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="w-4 h-4 text-emerald-500" />
                  <span>Cálculo de ROI e lucro estimado</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  <span>Gráficos de evolução</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Comparativo de prazos de revenda</span>
                </div>
              </div>

              <Button 
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Target className="w-4 h-4 mr-2" />
                Analisar Investimento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-gray-500 text-sm">
          Ambas as calculadoras utilizam as taxas de referência da Caixa Econômica Federal 
          e permitem simulações com SAC e PRICE.
        </p>
      </div>
    </div>
  );
}
