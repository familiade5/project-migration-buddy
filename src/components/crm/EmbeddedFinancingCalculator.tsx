import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Calculator, 
  AlertCircle, 
  DollarSign, 
  Percent, 
  CalendarDays, 
  Lightbulb,
  ChevronRight,
  PiggyBank,
  Info,
  CheckCircle2,
  ArrowDown,
  Minus,
  Home,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import { useActionLogger } from '@/hooks/useModuleActivity';

type FinancingTable = 'PRICE' | 'SAC';

interface SimulationResult {
  monthlyInstallment: number;
  firstInstallment: number;
  lastInstallment: number;
  totalAmount: number;
  totalInterest: number;
  financedAmount: number;
  downPayment: number;
  propertyValue: number;
  interestRate: number;
  termMonths: number;
  table: FinancingTable;
  monthlyAmortization: number;
  schedule: Array<{
    month: number;
    installment: number;
    amortization: number;
    interest: number;
    balance: number;
  }>;
}

interface EmbeddedFinancingCalculatorProps {
  propertyValue?: number;
  propertyCode?: string;
}

const SUGGESTED_RATES = {
  min: 10.49,
  max: 11.49,
  default: 10.99,
};

export function EmbeddedFinancingCalculator({ 
  propertyValue: initialPropertyValue, 
  propertyCode 
}: EmbeddedFinancingCalculatorProps) {
  const { logAction } = useActionLogger();

  const [activeView, setActiveView] = useState<'form' | 'result'>('form');

  // Pre-fill with property value if available
  const formatInitialValue = (value?: number) => {
    if (!value) return '';
    return Math.round(value).toLocaleString('pt-BR');
  };

  const calculateDefaultDownPayment = (value?: number) => {
    if (!value) return '';
    return Math.round(value * 0.2).toLocaleString('pt-BR');
  };

  const [propertyValue, setPropertyValue] = useState(formatInitialValue(initialPropertyValue));
  const [downPayment, setDownPayment] = useState(calculateDefaultDownPayment(initialPropertyValue));
  const [interestRate, setInterestRate] = useState(SUGGESTED_RATES.default.toString().replace('.', ','));
  const [termMonths, setTermMonths] = useState('360');
  const [financingTable, setFinancingTable] = useState<FinancingTable>('SAC');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const parseCurrency = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
  };

  const handleCurrencyInput = (value: string, setter: (v: string) => void) => {
    let cleaned = value.replace(/\D/g, '');
    if (cleaned) {
      const number = parseInt(cleaned, 10);
      const formatted = number.toLocaleString('pt-BR');
      setter(formatted);
    } else {
      setter('');
    }
  };

  const generateSchedule = (
    principal: number, 
    monthlyRate: number, 
    months: number, 
    table: FinancingTable
  ) => {
    const schedule: SimulationResult['schedule'] = [];
    let balance = principal;

    if (table === 'PRICE') {
      const installment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      
      for (let i = 1; i <= Math.min(months, 12); i++) {
        const interest = balance * monthlyRate;
        const amortization = installment - interest;
        balance -= amortization;
        schedule.push({
          month: i,
          installment,
          amortization,
          interest,
          balance: Math.max(0, balance)
        });
      }
    } else {
      const amortization = principal / months;
      
      for (let i = 1; i <= Math.min(months, 12); i++) {
        const interest = balance * monthlyRate;
        const installment = amortization + interest;
        balance -= amortization;
        schedule.push({
          month: i,
          installment,
          amortization,
          interest,
          balance: Math.max(0, balance)
        });
      }
    }

    return schedule;
  };

  const calculatePrice = (principal: number, monthlyRate: number, months: number): SimulationResult => {
    const installment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = installment * months;
    const schedule = generateSchedule(principal, monthlyRate, months, 'PRICE');
    
    return {
      monthlyInstallment: installment,
      firstInstallment: installment,
      lastInstallment: installment,
      totalAmount,
      totalInterest: totalAmount - principal,
      financedAmount: principal,
      downPayment: parseCurrency(downPayment),
      propertyValue: parseCurrency(propertyValue),
      interestRate: parseFloat(interestRate.replace(',', '.')),
      termMonths: months,
      table: 'PRICE',
      monthlyAmortization: principal / months,
      schedule
    };
  };

  const calculateSAC = (principal: number, monthlyRate: number, months: number): SimulationResult => {
    const amortization = principal / months;
    const firstInstallment = amortization + (principal * monthlyRate);
    const lastInstallment = amortization + (amortization * monthlyRate);
    
    let totalAmount = 0;
    let remainingBalance = principal;
    for (let i = 0; i < months; i++) {
      const interest = remainingBalance * monthlyRate;
      totalAmount += amortization + interest;
      remainingBalance -= amortization;
    }
    
    const schedule = generateSchedule(principal, monthlyRate, months, 'SAC');
    
    return {
      monthlyInstallment: (firstInstallment + lastInstallment) / 2,
      firstInstallment,
      lastInstallment,
      totalAmount,
      totalInterest: totalAmount - principal,
      financedAmount: principal,
      downPayment: parseCurrency(downPayment),
      propertyValue: parseCurrency(propertyValue),
      interestRate: parseFloat(interestRate.replace(',', '.')),
      termMonths: months,
      table: 'SAC',
      monthlyAmortization: amortization,
      schedule
    };
  };

  const runSimulation = () => {
    const property = parseCurrency(propertyValue);
    const down = parseCurrency(downPayment);
    const rate = parseFloat(interestRate.replace(',', '.')) / 100;
    const months = parseInt(termMonths) || 0;

    if (property <= 0 || months <= 0 || rate <= 0) return;

    const principal = property - down;
    if (principal <= 0) return;

    const monthlyRate = rate / 12;

    const result = financingTable === 'PRICE' 
      ? calculatePrice(principal, monthlyRate, months)
      : calculateSAC(principal, monthlyRate, months);

    setSimulationResult(result);
    setActiveView('result');
    
    logAction('financing_simulation_crm', 'CRM Imóveis', {
      property_code: propertyCode,
      property_value: property,
      down_payment: down,
      financed_amount: principal,
      interest_rate: rate * 100,
      term_months: months,
      table: financingTable,
      monthly_installment: result.monthlyInstallment,
    });
  };

  const handleNewSimulation = () => {
    setActiveView('form');
    setSimulationResult(null);
  };

  if (activeView === 'result' && simulationResult) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-300">
        {/* Main Result Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="font-medium text-sm">
                {propertyCode ? `Simulação - ${propertyCode}` : 'Resultado da Simulação'}
              </span>
            </div>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
              {simulationResult.table}
            </span>
          </div>
          
          <div className="text-center">
            <p className="text-blue-100 text-xs mb-1">
              {simulationResult.table === 'SAC' ? 'Primeira Parcela' : 'Parcela Mensal'}
            </p>
            <p className="text-3xl font-bold">
              {formatCurrency(simulationResult.firstInstallment)}
            </p>
            {simulationResult.table === 'SAC' && (
              <p className="text-blue-100 text-xs mt-1">
                Última: {formatCurrency(simulationResult.lastInstallment)}
              </p>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[10px] text-gray-500 mb-0.5">Valor Financiado</p>
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(simulationResult.financedAmount)}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[10px] text-gray-500 mb-0.5">Entrada</p>
            <p className="text-sm font-bold text-green-600">
              {formatCurrency(simulationResult.downPayment)}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[10px] text-gray-500 mb-0.5">Total a Pagar</p>
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(simulationResult.totalAmount)}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-[10px] text-amber-600 mb-0.5">Total de Juros</p>
            <p className="text-sm font-bold text-amber-600">
              {formatCurrency(simulationResult.totalInterest)}
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 text-blue-600" />
            Como funciona o {simulationResult.table}?
          </h4>
          
          {simulationResult.table === 'SAC' ? (
            <div className="space-y-3">
              <p className="text-xs text-gray-600">
                No <strong>SAC</strong>, a amortização é constante e os juros diminuem todo mês, 
                fazendo a parcela cair progressivamente.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-[10px] text-gray-500">Amortização/mês</p>
                  <p className="text-xs font-bold text-blue-700">
                    {formatCurrency(simulationResult.monthlyAmortization)}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="text-[10px] text-gray-500">1ª Parcela</p>
                  <p className="text-xs font-bold text-green-700">
                    {formatCurrency(simulationResult.firstInstallment)}
                  </p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <p className="text-[10px] text-gray-500">Última</p>
                  <p className="text-xs font-bold text-emerald-700">
                    {formatCurrency(simulationResult.lastInstallment)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded-lg">
                <CheckCircle2 className="w-3 h-3" />
                <span>Economia de até 20% em juros!</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-600">
                Na <strong>Price</strong>, todas as parcelas têm o mesmo valor. 
                Maior previsibilidade no orçamento.
              </p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-[10px] text-gray-500">Parcela Fixa</p>
                  <p className="text-xs font-bold text-blue-700">
                    {formatCurrency(simulationResult.monthlyInstallment)}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500">Nº Parcelas</p>
                  <p className="text-xs font-bold text-gray-700">
                    {simulationResult.termMonths}x
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 p-2 rounded-lg">
                <CheckCircle2 className="w-3 h-3" />
                <span>Previsibilidade total no orçamento.</span>
              </div>
            </div>
          )}
        </div>

        {/* First 6 Months Schedule */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h4 className="font-medium text-gray-900 mb-3 text-sm">
            📊 Primeiras 6 Parcelas
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-white">
                  <th className="text-left p-2 text-gray-600 font-medium">Mês</th>
                  <th className="text-right p-2 text-gray-600 font-medium">Parcela</th>
                  <th className="text-right p-2 text-gray-600 font-medium">Juros</th>
                  <th className="text-right p-2 text-gray-600 font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {simulationResult.schedule.slice(0, 6).map((row) => (
                  <tr key={row.month} className="border-b border-gray-200">
                    <td className="p-2 text-gray-900">{row.month}º</td>
                    <td className="p-2 text-right font-medium text-gray-900">
                      {formatCurrency(row.installment)}
                    </td>
                    <td className="p-2 text-right text-amber-600">
                      {formatCurrency(row.interest)}
                    </td>
                    <td className="p-2 text-right text-gray-600">
                      {formatCurrency(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700">
            Estimativa para apoio comercial. Valores finais dependem de análise de crédito e seguros (MIP/DFI).
          </p>
        </div>

        {/* New Simulation Button */}
        <Button 
          onClick={handleNewSimulation}
          variant="outline"
          className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nova Simulação
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-5 duration-300">
      {propertyCode && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <Home className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700">
            Simulando financiamento para <strong>{propertyCode}</strong>
          </span>
        </div>
      )}

      {/* Property Value */}
      <div className="space-y-1.5">
        <Label htmlFor="propertyValueEmbed" className="text-xs text-gray-700 flex items-center gap-1.5">
          <DollarSign className="w-3 h-3 text-gray-400" />
          Valor do Imóvel
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium">R$</span>
          <Input
            id="propertyValueEmbed"
            type="text"
            inputMode="numeric"
            placeholder="500.000"
            value={propertyValue}
            onChange={(e) => handleCurrencyInput(e.target.value, setPropertyValue)}
            className="pl-8 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm"
          />
        </div>
      </div>

      {/* Down Payment */}
      <div className="space-y-1.5">
        <Label htmlFor="downPaymentEmbed" className="text-xs text-gray-700 flex items-center gap-1.5">
          <PiggyBank className="w-3 h-3 text-gray-400" />
          Entrada (mín. 20%)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium">R$</span>
          <Input
            id="downPaymentEmbed"
            type="text"
            inputMode="numeric"
            placeholder="100.000"
            value={downPayment}
            onChange={(e) => handleCurrencyInput(e.target.value, setDownPayment)}
            className="pl-8 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm"
          />
        </div>
        {propertyValue && downPayment && (
          <p className="text-[10px] text-gray-500">
            {((parseCurrency(downPayment) / parseCurrency(propertyValue)) * 100).toFixed(1)}% do valor
          </p>
        )}
      </div>

      {/* Interest Rate & Term Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="interestRateEmbed" className="text-xs text-gray-700 flex items-center gap-1.5">
            <Percent className="w-3 h-3 text-gray-400" />
            Taxa (a.a.)
          </Label>
          <Input
            id="interestRateEmbed"
            type="text"
            inputMode="decimal"
            placeholder="10,99"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value.replace(/[^\d,]/g, ''))}
            className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="termMonthsEmbed" className="text-xs text-gray-700 flex items-center gap-1.5">
            <CalendarDays className="w-3 h-3 text-gray-400" />
            Prazo (meses)
          </Label>
          <Input
            id="termMonthsEmbed"
            type="number"
            inputMode="numeric"
            placeholder="360"
            value={termMonths}
            onChange={(e) => setTermMonths(e.target.value)}
            className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] bg-amber-50 text-amber-700 p-2 rounded-lg">
        <Lightbulb className="w-3 h-3 text-amber-500 flex-shrink-0" />
        <span>
          Taxa Caixa: <strong>{SUGGESTED_RATES.min}% - {SUGGESTED_RATES.max}%</strong> a.a.
        </span>
      </div>

      {/* Table Selection */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-700 font-medium">Sistema de Amortização</Label>
        <RadioGroup 
          value={financingTable} 
          onValueChange={(v) => setFinancingTable(v as FinancingTable)}
          className="grid grid-cols-2 gap-2"
        >
          <div 
            className={`
              flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all bg-white
              ${financingTable === 'SAC' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'}
            `}
            onClick={() => setFinancingTable('SAC')}
          >
            <RadioGroupItem value="SAC" id="sacEmbed" className="border-gray-400 text-blue-600" />
            <div>
              <Label htmlFor="sacEmbed" className="cursor-pointer font-medium text-gray-900 text-sm">
                SAC
              </Label>
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <ArrowDown className="w-2.5 h-2.5" />
                Parcelas decrescem
              </p>
            </div>
          </div>
          
          <div 
            className={`
              flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all bg-white
              ${financingTable === 'PRICE' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'}
            `}
            onClick={() => setFinancingTable('PRICE')}
          >
            <RadioGroupItem value="PRICE" id="priceEmbed" className="border-gray-400 text-blue-600" />
            <div>
              <Label htmlFor="priceEmbed" className="cursor-pointer font-medium text-gray-900 text-sm">
                PRICE
              </Label>
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <Minus className="w-2.5 h-2.5" />
                Parcelas fixas
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Calculate Button */}
      <Button 
        onClick={runSimulation}
        className="w-full h-11 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Calculator className="w-4 h-4 mr-2" />
        Calcular
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
