import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, TrendingDown, AlertCircle, DollarSign, Percent, CalendarDays, Info, Lightbulb } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import { useModuleActivity, useActionLogger } from '@/hooks/useModuleActivity';

type FinancingTable = 'PRICE' | 'SAC';

interface SimulationResult {
  monthlyInstallment: number;
  firstInstallment?: number;
  lastInstallment?: number;
  totalAmount: number;
  totalInterest: number;
  table: FinancingTable;
}

interface BalanceResult {
  remainingBalance: number;
  totalRemaining: number;
  remainingInstallments: number;
  table: FinancingTable;
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

  // Simulation Mode State
  const [propertyValue, setPropertyValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState(SUGGESTED_RATES.default.toString().replace('.', ','));
  const [termMonths, setTermMonths] = useState('');
  const [financingTable, setFinancingTable] = useState<FinancingTable>('PRICE');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Balance Mode State
  const [financedAmount, setFinancedAmount] = useState('');
  const [currentInstallment, setCurrentInstallment] = useState('');
  const [paidInstallments, setPaidInstallments] = useState('');
  const [balanceInterestRate, setBalanceInterestRate] = useState(SUGGESTED_RATES.default.toString().replace('.', ','));
  const [balanceTable, setBalanceTable] = useState<FinancingTable>('PRICE');
  const [balanceResult, setBalanceResult] = useState<BalanceResult | null>(null);

  // Helper to parse currency input
  const parseCurrency = (value: string): number => {
    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
  };

  // Format input as currency
  const handleCurrencyInput = (value: string, setter: (v: string) => void) => {
    // Remove non-numeric characters except comma
    let cleaned = value.replace(/[^\d,]/g, '');
    
    // Ensure only one comma
    const parts = cleaned.split(',');
    if (parts.length > 2) {
      cleaned = parts[0] + ',' + parts.slice(1).join('');
    }
    
    // Format with thousand separators
    if (parts[0]) {
      const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      cleaned = intPart + (parts[1] !== undefined ? ',' + parts[1].slice(0, 2) : '');
    }
    
    setter(cleaned);
  };

  // Calculate PRICE table (fixed installments)
  const calculatePrice = (principal: number, monthlyRate: number, months: number): SimulationResult => {
    const installment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = installment * months;
    
    return {
      monthlyInstallment: installment,
      totalAmount,
      totalInterest: totalAmount - principal,
      table: 'PRICE'
    };
  };

  // Calculate SAC table (decreasing installments)
  const calculateSAC = (principal: number, monthlyRate: number, months: number): SimulationResult => {
    const amortization = principal / months;
    const firstInstallment = amortization + (principal * monthlyRate);
    const lastInstallment = amortization + (amortization * monthlyRate);
    
    // Calculate total with SAC (sum of arithmetic progression)
    let totalAmount = 0;
    let remainingBalance = principal;
    for (let i = 0; i < months; i++) {
      const interest = remainingBalance * monthlyRate;
      totalAmount += amortization + interest;
      remainingBalance -= amortization;
    }
    
    return {
      monthlyInstallment: (firstInstallment + lastInstallment) / 2, // Average for display
      firstInstallment,
      lastInstallment,
      totalAmount,
      totalInterest: totalAmount - principal,
      table: 'SAC'
    };
  };

  // Run financing simulation
  const runSimulation = () => {
    const property = parseCurrency(propertyValue);
    const down = parseCurrency(downPayment);
    const rate = parseFloat(interestRate.replace(',', '.')) / 100;
    const months = parseInt(termMonths) || 0;

    if (property <= 0 || months <= 0 || rate <= 0) return;

    const principal = property - down;
    const monthlyRate = rate / 12;

    const result = financingTable === 'PRICE' 
      ? calculatePrice(principal, monthlyRate, months)
      : calculateSAC(principal, monthlyRate, months);

    setSimulationResult(result);
    
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

    if (balanceTable === 'PRICE') {
      // For PRICE, calculate remaining balance using present value formula
      // Find total term from the installment amount
      const totalMonths = Math.log(installment / (installment - principal * monthlyRate)) / Math.log(1 + monthlyRate);
      remainingInstallments = Math.max(0, Math.round(totalMonths) - paid);
      
      // Present value of remaining installments
      if (remainingInstallments > 0 && monthlyRate > 0) {
        remainingBalance = installment * (1 - Math.pow(1 + monthlyRate, -remainingInstallments)) / monthlyRate;
      } else {
        remainingBalance = 0;
      }
      totalRemaining = installment * remainingInstallments;
    } else {
      // For SAC, calculate based on linear amortization
      const amortization = principal / Math.round(principal / (installment - principal * monthlyRate / 2));
      const estimatedTerm = Math.round(principal / amortization);
      remainingInstallments = Math.max(0, estimatedTerm - paid);
      
      remainingBalance = Math.max(0, principal - (amortization * paid));
      
      // Sum of remaining SAC installments
      totalRemaining = 0;
      let balance = remainingBalance;
      for (let i = 0; i < remainingInstallments; i++) {
        totalRemaining += amortization + (balance * monthlyRate);
        balance -= amortization;
      }
    }

    const result = {
      remainingBalance: Math.max(0, remainingBalance),
      totalRemaining: Math.max(0, totalRemaining),
      remainingInstallments,
      table: balanceTable
    };

    setBalanceResult(result);

    // Log the balance calculation action
    logAction('balance_simulation', 'Calculadora de Financiamento', {
      financed_amount: principal,
      current_installment: installment,
      paid_installments: paid,
      interest_rate: rate * 100,
      table: balanceTable,
      remaining_balance: result.remainingBalance,
    });
  };

  const clearSimulation = () => {
    setPropertyValue('');
    setDownPayment('');
    setInterestRate('');
    setTermMonths('');
    setSimulationResult(null);
  };

  const clearBalance = () => {
    setFinancedAmount('');
    setCurrentInstallment('');
    setPaidInstallments('');
    setBalanceInterestRate('');
    setBalanceResult(null);
  };

  return (
    <AppLayout>
      <div className="p-6 min-h-screen bg-white">
        {/* Header - Same style as CRM */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Calculator className="w-6 h-6 text-gray-700" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Calculadora de Financiamento
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              Simulador comercial para financiamentos Caixa
            </p>
          </div>
        </div>

        {/* Main Calculator */}
        <div className="max-w-4xl">
          <Tabs defaultValue="simulation" className="space-y-4">
            <TabsList className="bg-gray-100 border border-gray-200">
              <TabsTrigger 
                value="simulation" 
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 hover:bg-gray-200"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Simulação
              </TabsTrigger>
              <TabsTrigger 
                value="balance"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 hover:bg-gray-200"
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Saldo Devedor
              </TabsTrigger>
            </TabsList>

          {/* Simulation Tab */}
          <TabsContent value="simulation" className="space-y-4">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Simular Financiamento</CardTitle>
                <CardDescription className="text-gray-500">
                  Calcule a parcela estimada do financiamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Value */}
                <div className="space-y-2">
                  <Label htmlFor="propertyValue" className="text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    Valor do Imóvel
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                    <Input
                      id="propertyValue"
                      type="text"
                      inputMode="decimal"
                      placeholder="500.000,00"
                      value={propertyValue}
                      onChange={(e) => handleCurrencyInput(e.target.value, setPropertyValue)}
                      className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                    />
                  </div>
                </div>

                {/* Down Payment */}
                <div className="space-y-2">
                  <Label htmlFor="downPayment" className="text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    Entrada
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                    <Input
                      id="downPayment"
                      type="text"
                      inputMode="decimal"
                      placeholder="100.000,00"
                      value={downPayment}
                      onChange={(e) => handleCurrencyInput(e.target.value, setDownPayment)}
                      className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                    />
                  </div>
                </div>

                {/* Interest Rate with Suggestion */}
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
                      className="pr-8 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Lightbulb className="w-3 h-3 text-amber-500" />
                    <span className="text-gray-500">
                      Taxa referência Caixa: <span className="font-medium text-gray-700">{SUGGESTED_RATES.min}% - {SUGGESTED_RATES.max}%</span> a.a.
                    </span>
                  </div>
                </div>

                {/* Term */}
                <div className="space-y-2">
                  <Label htmlFor="termMonths" className="text-gray-700 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    Prazo (em meses)
                  </Label>
                  <Input
                    id="termMonths"
                    type="number"
                    inputMode="numeric"
                    placeholder="360"
                    value={termMonths}
                    onChange={(e) => setTermMonths(e.target.value)}
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  />
                  {termMonths && (
                    <p className="text-xs text-gray-400">
                      Equivalente a {Math.floor(parseInt(termMonths) / 12)} anos e {parseInt(termMonths) % 12} meses
                    </p>
                  )}
                </div>

                {/* Table Selection */}
                <div className="space-y-3">
                  <Label className="text-gray-700">Tabela de Amortização</Label>
                  <RadioGroup 
                    value={financingTable} 
                    onValueChange={(v) => setFinancingTable(v as FinancingTable)}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className={`
                      flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${financingTable === 'PRICE' 
                        ? 'border-gray-900 bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'}
                    `}>
                      <RadioGroupItem value="PRICE" id="price" className="border-gray-400" />
                      <div>
                        <Label htmlFor="price" className="cursor-pointer font-medium text-gray-900">
                          PRICE
                        </Label>
                        <p className="text-xs text-gray-500">Parcelas fixas</p>
                      </div>
                    </div>
                    <div className={`
                      flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${financingTable === 'SAC' 
                        ? 'border-gray-900 bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'}
                    `}>
                      <RadioGroupItem value="SAC" id="sac" className="border-gray-400" />
                      <div>
                        <Label htmlFor="sac" className="cursor-pointer font-medium text-gray-900">
                          SAC
                        </Label>
                        <p className="text-xs text-gray-500">Parcelas decrescentes</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={runSimulation}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcular
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearSimulation}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Simulation Result */}
            {simulationResult && (
              <Card className="border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    Resultado da Simulação
                    <span className="text-xs font-normal px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                      {simulationResult.table}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main Result */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
                    <p className="text-sm text-gray-500 mb-1">
                      {simulationResult.table === 'SAC' ? 'Parcela Média Estimada' : 'Parcela Mensal Estimada'}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(simulationResult.monthlyInstallment)}
                    </p>
                    {simulationResult.table === 'SAC' && simulationResult.firstInstallment && simulationResult.lastInstallment && (
                      <div className="mt-2 flex justify-center gap-4 text-sm">
                        <span className="text-gray-500">
                          1ª: <span className="font-medium text-gray-700">{formatCurrency(simulationResult.firstInstallment)}</span>
                        </span>
                        <span className="text-gray-500">
                          Última: <span className="font-medium text-gray-700">{formatCurrency(simulationResult.lastInstallment)}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500">Total Financiado</p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatCurrency(parseCurrency(propertyValue) - parseCurrency(downPayment))}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500">Total a Pagar</p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatCurrency(simulationResult.totalAmount)}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500">Total de Juros</p>
                      <p className="text-base font-semibold text-amber-600">
                        {formatCurrency(simulationResult.totalInterest)}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500">Entrada</p>
                      <p className="text-base font-semibold text-emerald-600">
                        {formatCurrency(parseCurrency(downPayment))}
                      </p>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      <strong>Importante:</strong> Esta é uma estimativa para referência comercial. 
                      Valores reais podem variar conforme análise de crédito e condições da Caixa.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Balance Tab */}
          <TabsContent value="balance" className="space-y-4">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Simular Saldo Devedor</CardTitle>
                <CardDescription className="text-gray-500">
                  Estime o saldo restante para quitação antecipada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Financed Amount */}
                <div className="space-y-2">
                  <Label htmlFor="financedAmount" className="text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    Valor Financiado Original
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                    <Input
                      id="financedAmount"
                      type="text"
                      inputMode="decimal"
                      placeholder="400.000,00"
                      value={financedAmount}
                      onChange={(e) => handleCurrencyInput(e.target.value, setFinancedAmount)}
                      className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                    />
                  </div>
                </div>

                {/* Current Installment */}
                <div className="space-y-2">
                  <Label htmlFor="currentInstallment" className="text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    Valor da Parcela Atual
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                    <Input
                      id="currentInstallment"
                      type="text"
                      inputMode="decimal"
                      placeholder="3.500,00"
                      value={currentInstallment}
                      onChange={(e) => handleCurrencyInput(e.target.value, setCurrentInstallment)}
                      className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                    />
                  </div>
                </div>

                {/* Paid Installments */}
                <div className="space-y-2">
                  <Label htmlFor="paidInstallments" className="text-gray-700 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    Parcelas Já Pagas
                  </Label>
                  <Input
                    id="paidInstallments"
                    type="number"
                    inputMode="numeric"
                    placeholder="24"
                    value={paidInstallments}
                    onChange={(e) => setPaidInstallments(e.target.value)}
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  />
                </div>

                {/* Interest Rate with Suggestion */}
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
                      className="pr-8 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Lightbulb className="w-3 h-3 text-amber-500" />
                    <span className="text-gray-500">
                      Taxa referência Caixa: <span className="font-medium text-gray-700">{SUGGESTED_RATES.min}% - {SUGGESTED_RATES.max}%</span> a.a.
                    </span>
                  </div>
                </div>

                {/* Table Selection */}
                <div className="space-y-3">
                  <Label className="text-gray-700">Tabela do Contrato</Label>
                  <RadioGroup 
                    value={balanceTable} 
                    onValueChange={(v) => setBalanceTable(v as FinancingTable)}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className={`
                      flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${balanceTable === 'PRICE' 
                        ? 'border-gray-900 bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'}
                    `}>
                      <RadioGroupItem value="PRICE" id="balance-price" className="border-gray-400" />
                      <div>
                        <Label htmlFor="balance-price" className="cursor-pointer font-medium text-gray-900">
                          PRICE
                        </Label>
                        <p className="text-xs text-gray-500">Parcelas fixas</p>
                      </div>
                    </div>
                    <div className={`
                      flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${balanceTable === 'SAC' 
                        ? 'border-gray-900 bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'}
                    `}>
                      <RadioGroupItem value="SAC" id="balance-sac" className="border-gray-400" />
                      <div>
                        <Label htmlFor="balance-sac" className="cursor-pointer font-medium text-gray-900">
                          SAC
                        </Label>
                        <p className="text-xs text-gray-500">Parcelas decrescentes</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={calculateBalance}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Calcular Saldo
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearBalance}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Balance Result */}
            {balanceResult && (
              <Card className="border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    Saldo Devedor Estimado
                    <span className="text-xs font-normal px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                      {balanceResult.table}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main Result */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
                    <p className="text-sm text-gray-500 mb-1">Saldo para Quitação</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(balanceResult.remainingBalance)}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500">Parcelas Restantes</p>
                      <p className="text-base font-semibold text-gray-900">
                        {balanceResult.remainingInstallments} meses
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500">Total a Pagar (sem quitação)</p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatCurrency(balanceResult.totalRemaining)}
                      </p>
                    </div>
                  </div>

                  {/* Savings */}
                  {balanceResult.totalRemaining > balanceResult.remainingBalance && (
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                      <p className="text-sm text-emerald-700">
                        Economia estimada com quitação antecipada:
                      </p>
                      <p className="text-lg font-bold text-emerald-600">
                        {formatCurrency(balanceResult.totalRemaining - balanceResult.remainingBalance)}
                      </p>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      <strong>Importante:</strong> Valores são aproximações. Para quitação, 
                      consulte o saldo atualizado diretamente com a Caixa.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          </Tabs>
        </div>

        {/* Info Footer */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Sobre esta calculadora</p>
              <p className="text-xs text-gray-500">
                Esta ferramenta é um simulador comercial para apoio em negociações. 
                Não substitui simulações oficiais da Caixa Econômica Federal. 
                Para valores exatos, realize a simulação oficial no site ou agência da Caixa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
