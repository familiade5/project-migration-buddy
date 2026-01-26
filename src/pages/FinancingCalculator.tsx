import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Calculator, 
  TrendingDown, 
  AlertCircle, 
  DollarSign, 
  Percent, 
  CalendarDays, 
  Lightbulb,
  ChevronRight,
  TrendingUp,
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
import { useModuleActivity, useActionLogger } from '@/hooks/useModuleActivity';
import { CalculatorSelector, CalculatorType } from '@/components/calculator/CalculatorSelector';
import { InvestmentCalculator } from '@/components/calculator/InvestmentCalculator';

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

interface BalanceResult {
  remainingBalance: number;
  totalRemaining: number;
  remainingInstallments: number;
  table: FinancingTable;
  potentialSavings: number;
}

// Current market reference rates for Caixa (Jan 2026)
const SUGGESTED_RATES = {
  min: 10.49,
  max: 11.49,
  default: 10.99,
};

export default function FinancingCalculator() {
  // Log module access
  useModuleActivity('Calculadora de Financiamento');
  const { logAction } = useActionLogger();

  // Calculator selection state
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorType | null>(null);

  // Active view: 'form' or 'result'
  const [activeView, setActiveView] = useState<'form' | 'result'>('form');
  const [balanceActiveView, setBalanceActiveView] = useState<'form' | 'result'>('form');

  // Simulation Mode State
  const [propertyValue, setPropertyValue] = useState('500.000');
  const [downPayment, setDownPayment] = useState('100.000');
  const [interestRate, setInterestRate] = useState(SUGGESTED_RATES.default.toString().replace('.', ','));
  const [termMonths, setTermMonths] = useState('360');
  const [financingTable, setFinancingTable] = useState<FinancingTable>('SAC');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Balance Mode State
  const [financedAmount, setFinancedAmount] = useState('');
  const [currentInstallment, setCurrentInstallment] = useState('');
  const [paidInstallments, setPaidInstallments] = useState('');
  const [balanceInterestRate, setBalanceInterestRate] = useState(SUGGESTED_RATES.default.toString().replace('.', ','));
  const [balanceTable, setBalanceTable] = useState<FinancingTable>('SAC');
  const [balanceResult, setBalanceResult] = useState<BalanceResult | null>(null);

  // Helper to parse currency input
  const parseCurrency = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
  };

  // Format input as currency
  const handleCurrencyInput = (value: string, setter: (v: string) => void) => {
    // Remove non-numeric characters
    let cleaned = value.replace(/\D/g, '');
    
    // Convert to number and format
    if (cleaned) {
      const number = parseInt(cleaned, 10);
      const formatted = number.toLocaleString('pt-BR');
      setter(formatted);
    } else {
      setter('');
    }
  };

  // Generate amortization schedule
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

  // Calculate PRICE table (fixed installments)
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

  // Calculate SAC table (decreasing installments)
  const calculateSAC = (principal: number, monthlyRate: number, months: number): SimulationResult => {
    const amortization = principal / months;
    const firstInstallment = amortization + (principal * monthlyRate);
    const lastInstallment = amortization + (amortization * monthlyRate);
    
    // Calculate total with SAC
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

  // Run financing simulation
  const runSimulation = () => {
    const property = parseCurrency(propertyValue);
    const down = parseCurrency(downPayment);
    const rate = parseFloat(interestRate.replace(',', '.')) / 100;
    const months = parseInt(termMonths) || 0;

    if (property <= 0 || months <= 0 || rate <= 0) {
      return;
    }

    const principal = property - down;
    if (principal <= 0) {
      return;
    }

    const monthlyRate = rate / 12;

    const result = financingTable === 'PRICE' 
      ? calculatePrice(principal, monthlyRate, months)
      : calculateSAC(principal, monthlyRate, months);

    setSimulationResult(result);
    setActiveView('result');
    
    // Log the simulation action
    logAction('financing_simulation', 'Calculadora de Financiamento', {
      property_value: property,
      down_payment: down,
      financed_amount: principal,
      interest_rate: rate * 100,
      term_months: months,
      table: financingTable,
      monthly_installment: result.monthlyInstallment,
    });
  };

  // Calculate remaining balance
  const calculateBalance = () => {
    const principal = parseCurrency(financedAmount);
    const installment = parseCurrency(currentInstallment);
    const paid = parseInt(paidInstallments) || 0;
    const rate = parseFloat(balanceInterestRate.replace(',', '.')) / 100;

    if (principal <= 0 || installment <= 0 || rate <= 0) return;

    const monthlyRate = rate / 12;
    
    let remainingBalance: number;
    let totalRemaining: number;
    let remainingInstallments: number;
    let potentialSavings: number = 0;

    if (balanceTable === 'PRICE') {
      const totalMonths = Math.log(installment / (installment - principal * monthlyRate)) / Math.log(1 + monthlyRate);
      remainingInstallments = Math.max(0, Math.round(totalMonths) - paid);
      
      if (remainingInstallments > 0 && monthlyRate > 0) {
        remainingBalance = installment * (1 - Math.pow(1 + monthlyRate, -remainingInstallments)) / monthlyRate;
      } else {
        remainingBalance = 0;
      }
      totalRemaining = installment * remainingInstallments;
      potentialSavings = totalRemaining - remainingBalance;
    } else {
      const amortization = principal / Math.round(principal / (installment - principal * monthlyRate / 2));
      const estimatedTerm = Math.round(principal / amortization);
      remainingInstallments = Math.max(0, estimatedTerm - paid);
      
      remainingBalance = Math.max(0, principal - (amortization * paid));
      
      totalRemaining = 0;
      let balance = remainingBalance;
      for (let i = 0; i < remainingInstallments; i++) {
        totalRemaining += amortization + (balance * monthlyRate);
        balance -= amortization;
      }
      potentialSavings = totalRemaining - remainingBalance;
    }

    const result = {
      remainingBalance: Math.max(0, remainingBalance),
      totalRemaining: Math.max(0, totalRemaining),
      remainingInstallments,
      table: balanceTable,
      potentialSavings: Math.max(0, potentialSavings)
    };

    setBalanceResult(result);
    setBalanceActiveView('result');

    logAction('balance_simulation', 'Calculadora de Financiamento', {
      financed_amount: principal,
      current_installment: installment,
      paid_installments: paid,
      interest_rate: rate * 100,
      table: balanceTable,
      remaining_balance: result.remainingBalance,
    });
  };

  const handleNewSimulation = () => {
    setActiveView('form');
    setSimulationResult(null);
  };

  const handleNewBalanceCalc = () => {
    setBalanceActiveView('form');
    setBalanceResult(null);
  };

  const handleBackToSelector = () => {
    setSelectedCalculator(null);
    setActiveView('form');
    setSimulationResult(null);
  };

  // Render simulation form
  const renderSimulationForm = () => (
    <Card className="border-gray-200 shadow-sm bg-white">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Home className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900">Simular Financiamento</CardTitle>
            <CardDescription className="text-gray-500">
              Calcule as parcelas do seu financiamento Caixa
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        {/* Property Value */}
        <div className="space-y-2">
          <Label htmlFor="propertyValue" className="text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            Valor do Imóvel
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
            <Input
              id="propertyValue"
              type="text"
              inputMode="numeric"
              placeholder="500.000"
              value={propertyValue}
              onChange={(e) => handleCurrencyInput(e.target.value, setPropertyValue)}
              className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 h-12 text-lg"
            />
          </div>
        </div>

        {/* Down Payment */}
        <div className="space-y-2">
          <Label htmlFor="downPayment" className="text-gray-700 flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-gray-400" />
            Entrada (mín. 20%)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
            <Input
              id="downPayment"
              type="text"
              inputMode="numeric"
              placeholder="100.000"
              value={downPayment}
              onChange={(e) => handleCurrencyInput(e.target.value, setDownPayment)}
              className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 h-12 text-lg"
            />
          </div>
          {propertyValue && downPayment && (
            <p className="text-xs text-gray-500">
              {((parseCurrency(downPayment) / parseCurrency(propertyValue)) * 100).toFixed(1)}% do valor do imóvel
            </p>
          )}
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label htmlFor="interestRate" className="text-gray-700 flex items-center gap-2">
            <Percent className="w-4 h-4 text-gray-400" />
            Taxa de Juros (ao ano)
          </Label>
          <div className="relative">
            <Input
              id="interestRate"
              type="text"
              inputMode="decimal"
              placeholder="10,99"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value.replace(/[^\d,]/g, ''))}
              className="pr-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 h-12 text-lg"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">% a.a.</span>
          </div>
          <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-700 p-2 rounded-lg">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              Taxa Caixa atual: <strong>{SUGGESTED_RATES.min}% - {SUGGESTED_RATES.max}%</strong> a.a. (jan/2026)
            </span>
          </div>
        </div>

        {/* Term */}
        <div className="space-y-2">
          <Label htmlFor="termMonths" className="text-gray-700 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            Prazo do Financiamento
          </Label>
          <Input
            id="termMonths"
            type="number"
            inputMode="numeric"
            placeholder="360"
            value={termMonths}
            onChange={(e) => setTermMonths(e.target.value)}
            className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 h-12 text-lg"
          />
          {termMonths && parseInt(termMonths) > 0 && (
            <p className="text-xs text-gray-500">
              {Math.floor(parseInt(termMonths) / 12)} anos e {parseInt(termMonths) % 12} meses
            </p>
          )}
        </div>

        {/* Table Selection */}
        <div className="space-y-3">
          <Label className="text-gray-700 font-medium">Sistema de Amortização</Label>
          <RadioGroup 
            value={financingTable} 
            onValueChange={(v) => setFinancingTable(v as FinancingTable)}
            className="grid grid-cols-1 gap-3"
          >
            <div 
              className={`
                flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all bg-white
                ${financingTable === 'SAC' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}
              onClick={() => setFinancingTable('SAC')}
            >
              <RadioGroupItem value="SAC" id="sac" className="mt-1 border-gray-400 text-blue-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sac" className="cursor-pointer font-semibold text-gray-900">
                    SAC
                  </Label>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    Recomendado
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Parcelas decrescentes</strong> — Começa mais alta e diminui todo mês. 
                  Paga menos juros no total.
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <ArrowDown className="w-3 h-3" />
                  <span>Economia de até 20% em juros</span>
                </div>
              </div>
            </div>
            
            <div 
              className={`
                flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all bg-white
                ${financingTable === 'PRICE' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}
              onClick={() => setFinancingTable('PRICE')}
            >
              <RadioGroupItem value="PRICE" id="price" className="mt-1 border-gray-400 text-blue-600" />
              <div className="flex-1">
                <Label htmlFor="price" className="cursor-pointer font-semibold text-gray-900">
                  PRICE (Tabela Price)
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Parcelas fixas</strong> — Mesmo valor do início ao fim. 
                  Mais previsibilidade no orçamento.
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Minus className="w-3 h-3" />
                  <span>Parcela constante durante todo prazo</span>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={runSimulation}
          className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calcular Financiamento
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  // Render simulation result
  const renderSimulationResult = () => {
    if (!simulationResult) return null;

    return (
      <div className="space-y-4">
        {/* Main Result Card */}
        <Card className="border-gray-200 shadow-lg bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span className="font-medium">Resultado da Simulação</span>
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {simulationResult.table}
              </span>
            </div>
            
            <div className="text-center">
              <p className="text-blue-100 text-sm mb-1">
                {simulationResult.table === 'SAC' ? 'Primeira Parcela' : 'Parcela Mensal'}
              </p>
              <p className="text-4xl md:text-5xl font-bold">
                {formatCurrency(simulationResult.firstInstallment)}
              </p>
              {simulationResult.table === 'SAC' && (
                <p className="text-blue-100 text-sm mt-2">
                  Última parcela: {formatCurrency(simulationResult.lastInstallment)}
                </p>
              )}
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Valor Financiado</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(simulationResult.financedAmount)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Entrada</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(simulationResult.downPayment)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Total a Pagar</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(simulationResult.totalAmount)}
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-600 mb-1">Total de Juros</p>
                <p className="text-lg font-bold text-amber-600">
                  {formatCurrency(simulationResult.totalInterest)}
                </p>
              </div>
            </div>

            {/* How It Works Explanation */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Como funciona o {simulationResult.table}?
              </h3>
              
              {simulationResult.table === 'SAC' ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    No <strong>Sistema de Amortização Constante (SAC)</strong>, a amortização 
                    (parte que reduz a dívida) é sempre igual. Como os juros são calculados 
                    sobre o saldo devedor, a parcela diminui todo mês.
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-500">Amortização/mês</p>
                      <p className="font-bold text-blue-700">
                        {formatCurrency(simulationResult.monthlyAmortization)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-500">1ª Parcela</p>
                      <p className="font-bold text-green-700">
                        {formatCurrency(simulationResult.firstInstallment)}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <p className="text-xs text-gray-500">Última</p>
                      <p className="font-bold text-emerald-700">
                        {formatCurrency(simulationResult.lastInstallment)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Você economiza mais em juros ao longo do financiamento!</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Na <strong>Tabela Price</strong>, todas as parcelas têm o mesmo valor. 
                    No início, você paga mais juros e menos amortização. Com o tempo, 
                    essa proporção se inverte.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-500">Parcela Fixa</p>
                      <p className="font-bold text-blue-700">
                        {formatCurrency(simulationResult.monthlyInstallment)}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Nº de Parcelas</p>
                      <p className="font-bold text-gray-700">
                        {simulationResult.termMonths}x
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Previsibilidade: você sabe exatamente quanto vai pagar todo mês.</span>
                  </div>
                </div>
              )}
            </div>

            {/* First 12 Months Schedule */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                📊 Evolução das Primeiras 12 Parcelas
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2 text-gray-600 font-medium">Mês</th>
                      <th className="text-right p-2 text-gray-600 font-medium">Parcela</th>
                      <th className="text-right p-2 text-gray-600 font-medium">Amortização</th>
                      <th className="text-right p-2 text-gray-600 font-medium">Juros</th>
                      <th className="text-right p-2 text-gray-600 font-medium">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulationResult.schedule.map((row) => (
                      <tr key={row.month} className="border-b border-gray-100">
                        <td className="p-2 text-gray-900">{row.month}º</td>
                        <td className="p-2 text-right font-medium text-gray-900">
                          {formatCurrency(row.installment)}
                        </td>
                        <td className="p-2 text-right text-blue-600">
                          {formatCurrency(row.amortization)}
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
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">Importante</p>
                <p>
                  Esta é uma estimativa para apoio comercial. Valores reais podem variar 
                  conforme análise de crédito, seguros obrigatórios (MIP e DFI) e taxas 
                  administrativas da Caixa.
                </p>
              </div>
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
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render balance form
  const renderBalanceForm = () => (
    <Card className="border-gray-200 shadow-sm bg-white">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900">Saldo Devedor</CardTitle>
            <CardDescription className="text-gray-500">
              Calcule o saldo e economia com quitação antecipada
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        {/* Financed Amount */}
        <div className="space-y-2">
          <Label htmlFor="financedAmount" className="text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            Valor Financiado Original
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
            <Input
              id="financedAmount"
              type="text"
              inputMode="numeric"
              placeholder="400.000"
              value={financedAmount}
              onChange={(e) => handleCurrencyInput(e.target.value, setFinancedAmount)}
              className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-12 text-lg"
            />
          </div>
        </div>

        {/* Current Installment */}
        <div className="space-y-2">
          <Label htmlFor="currentInstallment" className="text-gray-700 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            Parcela Atual
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
            <Input
              id="currentInstallment"
              type="text"
              inputMode="numeric"
              placeholder="4.500"
              value={currentInstallment}
              onChange={(e) => handleCurrencyInput(e.target.value, setCurrentInstallment)}
              className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-12 text-lg"
            />
          </div>
        </div>

        {/* Paid Installments */}
        <div className="space-y-2">
          <Label htmlFor="paidInstallments" className="text-gray-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gray-400" />
            Parcelas Já Pagas
          </Label>
          <Input
            id="paidInstallments"
            type="number"
            inputMode="numeric"
            placeholder="60"
            value={paidInstallments}
            onChange={(e) => setPaidInstallments(e.target.value)}
            className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-12 text-lg"
          />
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label htmlFor="balanceInterestRate" className="text-gray-700 flex items-center gap-2">
            <Percent className="w-4 h-4 text-gray-400" />
            Taxa de Juros (ao ano)
          </Label>
          <div className="relative">
            <Input
              id="balanceInterestRate"
              type="text"
              inputMode="decimal"
              placeholder="10,99"
              value={balanceInterestRate}
              onChange={(e) => setBalanceInterestRate(e.target.value.replace(/[^\d,]/g, ''))}
              className="pr-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-12 text-lg"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">% a.a.</span>
          </div>
        </div>

        {/* Table Selection */}
        <div className="space-y-3">
          <Label className="text-gray-700 font-medium">Sistema de Amortização</Label>
          <RadioGroup 
            value={balanceTable} 
            onValueChange={(v) => setBalanceTable(v as FinancingTable)}
            className="grid grid-cols-2 gap-3"
          >
            <div 
              className={`
                flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all bg-white
                ${balanceTable === 'SAC' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}
              onClick={() => setBalanceTable('SAC')}
            >
              <RadioGroupItem value="SAC" id="balanceSac" className="border-gray-400 text-purple-600" />
              <Label htmlFor="balanceSac" className="cursor-pointer font-medium text-gray-900">
                SAC
              </Label>
            </div>
            <div 
              className={`
                flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all bg-white
                ${balanceTable === 'PRICE' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}
              onClick={() => setBalanceTable('PRICE')}
            >
              <RadioGroupItem value="PRICE" id="balancePrice" className="border-gray-400 text-purple-600" />
              <Label htmlFor="balancePrice" className="cursor-pointer font-medium text-gray-900">
                PRICE
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={calculateBalance}
          className="w-full h-14 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calcular Saldo
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  // Render balance result
  const renderBalanceResult = () => {
    if (!balanceResult) return null;

    return (
      <div className="space-y-4">
        <Card className="border-gray-200 shadow-lg bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                <span className="font-medium">Saldo Devedor Atual</span>
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {balanceResult.table}
              </span>
            </div>
            
            <div className="text-center">
              <p className="text-purple-100 text-sm mb-1">Para Quitação Hoje</p>
              <p className="text-4xl md:text-5xl font-bold">
                {formatCurrency(balanceResult.remainingBalance)}
              </p>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Parcelas Restantes</p>
                <p className="text-lg font-bold text-gray-900">
                  {balanceResult.remainingInstallments}x
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Total se Continuar</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(balanceResult.totalRemaining)}
                </p>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">Economia com Quitação</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(balanceResult.potentialSavings)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Economize quitando agora ao invés de pagar todas as parcelas restantes
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p>
                  Esta é uma estimativa. O saldo real deve ser consultado 
                  diretamente com a Caixa para valores precisos.
                </p>
              </div>
            </div>

            <Button 
              onClick={handleNewBalanceCalc}
              variant="outline"
              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Client Calculator Content
  const renderClientCalculator = () => (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBackToSelector}
        className="text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar às Calculadoras
      </Button>

      <Tabs defaultValue="simulation" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger 
            value="simulation"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Financiamento
          </TabsTrigger>
          <TabsTrigger 
            value="balance"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Saldo / Quitação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simulation" className="mt-6">
          {activeView === 'form' ? renderSimulationForm() : renderSimulationResult()}
        </TabsContent>

        <TabsContent value="balance" className="mt-6">
          {balanceActiveView === 'form' ? renderBalanceForm() : renderBalanceResult()}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white min-h-screen">
        {selectedCalculator === null && (
          <CalculatorSelector onSelect={setSelectedCalculator} />
        )}
        
        {selectedCalculator === 'client' && renderClientCalculator()}
        
        {selectedCalculator === 'investor' && (
          <InvestmentCalculator onBack={handleBackToSelector} />
        )}
      </div>
    </AppLayout>
  );
}
