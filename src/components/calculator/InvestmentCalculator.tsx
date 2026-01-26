import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  AlertCircle, 
  DollarSign, 
  Percent, 
  CalendarDays,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Info,
  CheckCircle2,
  ArrowDown,
  Minus,
  Building2,
  ArrowLeft,
  BarChart3,
  Target,
  Clock,
  FileText,
  Wallet,
  Home,
  Hammer,
  Receipt
} from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import { useActionLogger } from '@/hooks/useModuleActivity';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart
} from 'recharts';

type FinancingTable = 'PRICE' | 'SAC';
type EntryType = 'percentage' | 'fixed';

interface InvestmentResult {
  // Basic data
  purchasePrice: number;
  marketValue: number;
  discount: number;
  discountPercentage: number;
  entryValue: number;
  financedAmount: number;
  
  // Financing
  table: FinancingTable;
  interestRate: number;
  termMonths: number;
  holdingPeriod: number;
  monthlyInstallment: number;
  firstInstallment: number;
  lastInstallment: number;
  
  // Additional costs
  itbi: number;
  documentation: number;
  brokerage: number;
  renovation: number;
  monthlyExpenses: number;
  
  // Calculations
  totalPaidUntilResale: number;
  totalInterestPaid: number;
  remainingDebtAtResale: number;
  totalInvestment: number;
  estimatedProfit: number;
  totalROI: number;
  monthlyROI: number;
  
  // Timeline comparison
  timelineComparison: Array<{
    month: number;
    profit: number;
    roi: number;
    remainingDebt: number;
    totalPaid: number;
  }>;
  
  // Chart data
  debtEvolution: Array<{
    month: number;
    debt: number;
    paid: number;
  }>;
  
  paymentBreakdown: Array<{
    month: number;
    amortization: number;
    interest: number;
    installment: number;
  }>;
}

interface InvestmentCalculatorProps {
  onBack?: () => void;
}

const SUGGESTED_RATES = {
  min: 10.49,
  max: 11.49,
  default: 10.99,
};

export function InvestmentCalculator({ onBack }: InvestmentCalculatorProps) {
  const { logAction } = useActionLogger();

  const [activeView, setActiveView] = useState<'form' | 'result'>('form');
  const [result, setResult] = useState<InvestmentResult | null>(null);

  // Form state
  const [purchasePrice, setPurchasePrice] = useState('');
  const [marketValue, setMarketValue] = useState('');
  const [entryType, setEntryType] = useState<EntryType>('percentage');
  const [entryPercentage, setEntryPercentage] = useState('20');
  const [entryFixed, setEntryFixed] = useState('');
  const [interestRate, setInterestRate] = useState(SUGGESTED_RATES.default.toString().replace('.', ','));
  const [termMonths, setTermMonths] = useState('360');
  const [holdingPeriod, setHoldingPeriod] = useState('24');
  const [financingTable, setFinancingTable] = useState<FinancingTable>('SAC');
  
  // Additional costs
  const [itbi, setItbi] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [brokerage, setBrokerage] = useState('');
  const [renovation, setRenovation] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');

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

  const calculateInvestment = () => {
    const purchase = parseCurrency(purchasePrice);
    const market = parseCurrency(marketValue);
    const rate = parseFloat(interestRate.replace(',', '.')) / 100;
    const months = parseInt(termMonths) || 0;
    const holding = parseInt(holdingPeriod) || 0;
    
    if (purchase <= 0 || market <= 0 || months <= 0 || rate <= 0 || holding <= 0) {
      return;
    }

    // Calculate entry
    const entry = entryType === 'percentage' 
      ? purchase * (parseFloat(entryPercentage) / 100)
      : parseCurrency(entryFixed);
    
    const financedAmount = purchase - entry;
    if (financedAmount <= 0) return;

    const monthlyRate = rate / 12;
    
    // Calculate monthly installment based on table
    let firstInstallment: number;
    let lastInstallmentAtHolding: number;
    
    if (financingTable === 'PRICE') {
      const installment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      firstInstallment = installment;
      lastInstallmentAtHolding = installment;
    } else {
      const amortization = financedAmount / months;
      firstInstallment = amortization + (financedAmount * monthlyRate);
      const balanceAtHolding = financedAmount - (amortization * holding);
      lastInstallmentAtHolding = amortization + (Math.max(0, balanceAtHolding + amortization) * monthlyRate);
    }

    // Calculate totals until resale
    let totalPaid = 0;
    let totalInterest = 0;
    let remainingDebt = financedAmount;
    const debtEvolution: InvestmentResult['debtEvolution'] = [];
    const paymentBreakdown: InvestmentResult['paymentBreakdown'] = [];
    
    for (let i = 1; i <= Math.min(holding, months); i++) {
      const interest = remainingDebt * monthlyRate;
      let amortization: number;
      let installment: number;
      
      if (financingTable === 'PRICE') {
        installment = firstInstallment;
        amortization = installment - interest;
      } else {
        amortization = financedAmount / months;
        installment = amortization + interest;
      }
      
      totalPaid += installment;
      totalInterest += interest;
      remainingDebt -= amortization;
      
      debtEvolution.push({
        month: i,
        debt: Math.max(0, remainingDebt),
        paid: totalPaid
      });
      
      paymentBreakdown.push({
        month: i,
        amortization,
        interest,
        installment
      });
    }

    // Additional costs
    const itbiValue = parseCurrency(itbi);
    const docValue = parseCurrency(documentation);
    const brokerValue = parseCurrency(brokerage);
    const renovValue = parseCurrency(renovation);
    const monthlyExp = parseCurrency(monthlyExpenses);
    
    const totalMonthlyExpenses = monthlyExp * holding;
    const totalAdditionalCosts = itbiValue + docValue + brokerValue + renovValue + totalMonthlyExpenses;
    
    // Total investment
    const totalInvestment = entry + totalPaid + totalAdditionalCosts;
    
    // Profit calculation
    const netResaleValue = market - brokerValue; // Deduct brokerage from resale
    const estimatedProfit = netResaleValue - remainingDebt - totalInvestment + entry; // Add back entry since it's part of equity
    
    // ROI
    const cashOutlay = entry + totalAdditionalCosts + totalPaid; // What you actually spent
    const totalROI = (estimatedProfit / cashOutlay) * 100;
    const monthlyROI = totalROI / holding;
    
    // Timeline comparison
    const timelineComparison: InvestmentResult['timelineComparison'] = [];
    let runningDebt = financedAmount;
    let runningPaid = 0;
    
    for (let m = 6; m <= Math.min(60, months); m += 6) {
      // Recalculate for this holding period
      let debtAtM = financedAmount;
      let paidAtM = 0;
      
      for (let i = 1; i <= m; i++) {
        const int = debtAtM * monthlyRate;
        let amort: number;
        let inst: number;
        
        if (financingTable === 'PRICE') {
          inst = firstInstallment;
          amort = inst - int;
        } else {
          amort = financedAmount / months;
          inst = amort + int;
        }
        
        paidAtM += inst;
        debtAtM -= amort;
      }
      
      const expAtM = monthlyExp * m;
      const totalAtM = entry + paidAtM + itbiValue + docValue + brokerValue + renovValue + expAtM;
      const profitAtM = market - brokerValue - Math.max(0, debtAtM) - totalAtM + entry;
      const roiAtM = (profitAtM / (entry + paidAtM + itbiValue + docValue + brokerValue + renovValue + expAtM)) * 100;
      
      timelineComparison.push({
        month: m,
        profit: profitAtM,
        roi: roiAtM,
        remainingDebt: Math.max(0, debtAtM),
        totalPaid: paidAtM
      });
    }

    const investmentResult: InvestmentResult = {
      purchasePrice: purchase,
      marketValue: market,
      discount: market - purchase,
      discountPercentage: ((market - purchase) / market) * 100,
      entryValue: entry,
      financedAmount,
      table: financingTable,
      interestRate: rate * 100,
      termMonths: months,
      holdingPeriod: holding,
      monthlyInstallment: firstInstallment,
      firstInstallment,
      lastInstallment: lastInstallmentAtHolding,
      itbi: itbiValue,
      documentation: docValue,
      brokerage: brokerValue,
      renovation: renovValue,
      monthlyExpenses: monthlyExp,
      totalPaidUntilResale: totalPaid,
      totalInterestPaid: totalInterest,
      remainingDebtAtResale: Math.max(0, remainingDebt),
      totalInvestment,
      estimatedProfit,
      totalROI,
      monthlyROI,
      timelineComparison,
      debtEvolution,
      paymentBreakdown
    };

    setResult(investmentResult);
    setActiveView('result');
    
    logAction('investment_analysis', 'Calculadora de Investimento', {
      purchase_price: purchase,
      market_value: market,
      discount_percentage: investmentResult.discountPercentage,
      holding_period: holding,
      estimated_profit: estimatedProfit,
      total_roi: totalROI,
      table: financingTable
    });
  };

  const generateAnalysisText = (r: InvestmentResult): string => {
    const isGoodDeal = r.totalROI > 20;
    const isExcellentDeal = r.totalROI > 50;
    const isRiskyDeal = r.totalROI < 10;
    
    let analysis = '';
    
    // Opening assessment
    if (isExcellentDeal) {
      analysis += `Este investimento apresenta um potencial de retorno expressivo de ${r.totalROI.toFixed(1)}% em ${r.holdingPeriod} meses (${r.monthlyROI.toFixed(2)}% ao mês). `;
    } else if (isGoodDeal) {
      analysis += `Este investimento apresenta um potencial de retorno atrativo de ${r.totalROI.toFixed(1)}% em ${r.holdingPeriod} meses. `;
    } else if (isRiskyDeal) {
      analysis += `Este investimento apresenta um retorno modesto de ${r.totalROI.toFixed(1)}% em ${r.holdingPeriod} meses, o que pode não compensar os riscos envolvidos. `;
    } else {
      analysis += `Este investimento apresenta um retorno de ${r.totalROI.toFixed(1)}% em ${r.holdingPeriod} meses (${r.monthlyROI.toFixed(2)}% ao mês). `;
    }
    
    // Discount analysis
    if (r.discountPercentage > 30) {
      analysis += `O desconto de ${r.discountPercentage.toFixed(1)}% sobre o valor de mercado é um diferencial significativo que aumenta a margem de segurança do investimento. `;
    } else if (r.discountPercentage > 15) {
      analysis += `O desconto de ${r.discountPercentage.toFixed(1)}% proporciona uma margem razoável para absorver custos transacionais e eventuais variações de mercado. `;
    } else {
      analysis += `O desconto de ${r.discountPercentage.toFixed(1)}% é relativamente pequeno, exigindo atenção especial aos custos envolvidos. `;
    }
    
    // Financing structure
    if (r.table === 'SAC') {
      analysis += `A tabela SAC reduz progressivamente as parcelas, aliviando o fluxo de caixa ao longo do tempo e diminuindo o custo total de juros. `;
    } else {
      analysis += `A tabela PRICE oferece previsibilidade com parcelas fixas, facilitando o planejamento financeiro mensal. `;
    }
    
    // Debt at resale
    const debtToMarketRatio = (r.remainingDebtAtResale / r.marketValue) * 100;
    if (debtToMarketRatio < 50) {
      analysis += `No momento da revenda, a dívida remanescente representa apenas ${debtToMarketRatio.toFixed(1)}% do valor de mercado, oferecendo boa liquidez. `;
    } else {
      analysis += `A dívida remanescente de ${formatCurrency(r.remainingDebtAtResale)} no momento da revenda deve ser considerada no planejamento de saída. `;
    }
    
    // Considerations
    analysis += `\n\nConsiderações importantes: `;
    analysis += `• O lucro estimado de ${formatCurrency(r.estimatedProfit)} considera a quitação do saldo devedor no momento da venda. `;
    analysis += `• Custos adicionais como laudêmio, ITBI sobre revenda, ou correção do financiamento podem impactar o resultado final. `;
    analysis += `• A análise assume que o imóvel será vendido pelo valor de mercado informado.`;
    
    return analysis;
  };

  const handleNewAnalysis = () => {
    setActiveView('form');
    setResult(null);
  };

  if (activeView === 'result' && result) {
    const isPositiveROI = result.totalROI > 0;
    const analysisText = generateAnalysisText(result);
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleNewAnalysis}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Nova Análise
          </Button>
          {onBack && (
            <Button variant="outline" onClick={onBack} className="text-gray-600 border-gray-300">
              Voltar às Calculadoras
            </Button>
          )}
        </div>

        {/* Main Result Card */}
        <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <CardContent className="p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Análise de Investimento</h2>
                  <p className="text-white/80 text-sm">Período: {result.holdingPeriod} meses | {result.table}</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full ${isPositiveROI ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                {isPositiveROI ? (
                  <span className="flex items-center gap-1 font-medium text-green-300">
                    <TrendingUp className="w-4 h-4" />
                    Potencial Positivo
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-medium text-red-300">
                    <TrendingDown className="w-4 h-4" />
                    Retorno Negativo
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-white/70 text-sm mb-1">Lucro Estimado</p>
                <p className="text-3xl font-bold">{formatCurrency(result.estimatedProfit)}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">ROI Total</p>
                <p className="text-3xl font-bold">{result.totalROI.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">ROI Mensal</p>
                <p className="text-3xl font-bold">{result.monthlyROI.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Desconto</p>
                <p className="text-3xl font-bold">{result.discountPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Investment Breakdown */}
          <Card className="border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-gray-100 bg-white">
              <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                <Wallet className="w-5 h-5 text-gray-700" />
                Resumo do Investimento
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 bg-white">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Valor de Compra</span>
                <span className="font-semibold text-gray-900">{formatCurrency(result.purchasePrice)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Valor de Mercado</span>
                <span className="font-semibold text-gray-900">{formatCurrency(result.marketValue)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Entrada</span>
                <span className="font-semibold text-gray-900">{formatCurrency(result.entryValue)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Valor Financiado</span>
                <span className="font-semibold text-gray-900">{formatCurrency(result.financedAmount)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">Total Investido</span>
                <span className="font-bold text-gray-900">{formatCurrency(result.totalInvestment)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Costs Breakdown */}
          <Card className="border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-gray-100 bg-white">
              <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                <Receipt className="w-5 h-5 text-gray-700" />
                Custos Detalhados
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 bg-white">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Parcelas Pagas ({result.holdingPeriod}x)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(result.totalPaidUntilResale)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Juros Pagos</span>
                <span className="font-semibold text-gray-700">{formatCurrency(result.totalInterestPaid)}</span>
              </div>
              {result.itbi > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">ITBI</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(result.itbi)}</span>
                </div>
              )}
              {result.documentation > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Documentação</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(result.documentation)}</span>
                </div>
              )}
              {result.renovation > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Reforma</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(result.renovation)}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">Saldo Devedor na Revenda</span>
                <span className="font-bold text-gray-900">{formatCurrency(result.remainingDebtAtResale)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="debt" className="w-full">
          <TabsList className="bg-gray-100 border-gray-200">
            <TabsTrigger value="debt" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white text-gray-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Evolução da Dívida
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white text-gray-600">
              <TrendingDown className="w-4 h-4 mr-2" />
              Amortização x Juros
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Comparativo de Prazos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="debt" className="mt-4">
            <Card className="border-gray-200 bg-white">
              <CardContent className="pt-6 bg-white">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={result.debtEvolution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(v) => `${v}m`}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Mês ${label}`}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="debt" 
                      name="Saldo Devedor" 
                      stroke="#374151" 
                      fill="#d1d5db" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="paid" 
                      name="Total Pago" 
                      stroke="#6b7280" 
                      fill="#e5e7eb" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <Card className="border-gray-200 bg-white">
              <CardContent className="pt-6 bg-white">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={result.paymentBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(v) => `${v}m`}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Mês ${label}`}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Bar dataKey="amortization" name="Amortização" fill="#374151" stackId="a" />
                    <Bar dataKey="interest" name="Juros" fill="#9ca3af" stackId="a" />
                    <Line 
                      type="monotone" 
                      dataKey="installment" 
                      name="Parcela" 
                      stroke="#111827" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <Card className="border-gray-200 bg-white">
              <CardHeader className="pb-2 bg-white">
                <CardDescription className="text-gray-600">
                  Compare o retorno em diferentes cenários de prazo de revenda
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 text-gray-600 font-medium">Prazo</th>
                        <th className="text-right p-3 text-gray-600 font-medium">Lucro</th>
                        <th className="text-right p-3 text-gray-600 font-medium">ROI</th>
                        <th className="text-right p-3 text-gray-600 font-medium">Saldo Devedor</th>
                        <th className="text-right p-3 text-gray-600 font-medium">Total Pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.timelineComparison.map((row) => (
                        <tr 
                          key={row.month} 
                          className={`border-b border-gray-100 ${row.month === result.holdingPeriod ? 'bg-gray-100' : ''}`}
                        >
                          <td className="p-3 text-gray-900 font-medium">
                            {row.month} meses
                            {row.month === result.holdingPeriod && (
                              <span className="ml-2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">
                                Selecionado
                              </span>
                            )}
                          </td>
                          <td className={`p-3 text-right font-semibold ${row.profit >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            {formatCurrency(row.profit)}
                          </td>
                          <td className={`p-3 text-right font-semibold ${row.roi >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            {row.roi.toFixed(1)}%
                          </td>
                          <td className="p-3 text-right text-gray-600">
                            {formatCurrency(row.remainingDebt)}
                          </td>
                          <td className="p-3 text-right text-gray-600">
                            {formatCurrency(row.totalPaid)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Analysis Text */}
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-gray-100 bg-white">
            <CardTitle className="text-base flex items-center gap-2 text-gray-900">
              <FileText className="w-5 h-5 text-gray-700" />
              Análise do Investimento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 bg-white">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {analysisText}
            </p>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <AlertCircle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-2 text-gray-900">Aviso Legal</p>
            <p>
              Esta análise é uma estimativa baseada nos dados fornecidos e não substitui 
              orientação financeira, jurídica ou contábil profissional. Os valores reais 
              podem variar conforme condições de mercado, taxas, impostos e outros fatores 
              não considerados nesta simulação. Recomendamos consultar especialistas antes 
              de tomar decisões de investimento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-5 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        )}
      </div>

      {/* Property Values */}
      <Card className="border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Dados do Imóvel</CardTitle>
              <CardDescription className="text-gray-500">
                Valores de aquisição e mercado
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-5 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                Valor de Compra (Leilão/Direto)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="300.000"
                  value={purchasePrice}
                  onChange={(e) => handleCurrencyInput(e.target.value, setPurchasePrice)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 h-12 text-lg focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                Valor de Mercado (Revenda)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="450.000"
                  value={marketValue}
                  onChange={(e) => handleCurrencyInput(e.target.value, setMarketValue)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 h-12 text-lg focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
            </div>
          </div>
          
          {purchasePrice && marketValue && parseCurrency(marketValue) > parseCurrency(purchasePrice) && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle2 className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">
                Desconto de {(((parseCurrency(marketValue) - parseCurrency(purchasePrice)) / parseCurrency(marketValue)) * 100).toFixed(1)}% 
                ({formatCurrency(parseCurrency(marketValue) - parseCurrency(purchasePrice))})
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entry & Financing */}
      <Card className="border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Entrada e Financiamento</CardTitle>
              <CardDescription className="text-gray-500">
                Condições do financiamento Caixa
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-5 bg-white">
          {/* Entry Type */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Definir Entrada por</Label>
            <RadioGroup 
              value={entryType} 
              onValueChange={(v) => setEntryType(v as EntryType)}
              className="grid grid-cols-2 gap-3"
            >
              <div 
                className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all bg-white
                  ${entryType === 'percentage' ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => setEntryType('percentage')}
              >
                <RadioGroupItem value="percentage" id="entryPct" className="border-gray-500 text-gray-900" />
                <Label htmlFor="entryPct" className="cursor-pointer font-medium text-gray-900">
                  Percentual (%)
                </Label>
              </div>
              <div 
                className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all bg-white
                  ${entryType === 'fixed' ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => setEntryType('fixed')}
              >
                <RadioGroupItem value="fixed" id="entryFix" className="border-gray-500 text-gray-900" />
                <Label htmlFor="entryFix" className="cursor-pointer font-medium text-gray-900">
                  Valor Fixo (R$)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {entryType === 'percentage' ? (
            <div className="space-y-2">
              <Label className="text-gray-700">Entrada (%)</Label>
              <div className="relative">
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="20"
                  value={entryPercentage}
                  onChange={(e) => setEntryPercentage(e.target.value)}
                  className="pr-10 bg-white border-gray-300 text-gray-900 h-12 text-lg focus:border-gray-400 focus:ring-gray-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">%</span>
              </div>
              {purchasePrice && entryPercentage && (
                <p className="text-sm text-gray-500">
                  Entrada: {formatCurrency(parseCurrency(purchasePrice) * (parseFloat(entryPercentage) / 100))}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-gray-700">Valor da Entrada</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="60.000"
                  value={entryFixed}
                  onChange={(e) => handleCurrencyInput(e.target.value, setEntryFixed)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 h-12 text-lg focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <Percent className="w-4 h-4 text-gray-500" />
                Taxa de Juros (a.a.)
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="10,99"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value.replace(/[^\d,]/g, ''))}
                  className="pr-14 bg-white border-gray-300 text-gray-900 h-12 text-lg focus:border-gray-400 focus:ring-gray-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">% a.a.</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                Prazo (meses)
              </Label>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="360"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 h-12 text-lg focus:border-gray-400 focus:ring-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                Tempo até Revenda (meses)
              </Label>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="24"
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 h-12 text-lg focus:border-gray-400 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* Table Selection */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Sistema de Amortização</Label>
            <RadioGroup 
              value={financingTable} 
              onValueChange={(v) => setFinancingTable(v as FinancingTable)}
              className="grid grid-cols-2 gap-3"
            >
              <div 
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all bg-white
                  ${financingTable === 'SAC' ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => setFinancingTable('SAC')}
              >
                <RadioGroupItem value="SAC" id="sacInv" className="border-gray-500 text-gray-900" />
                <div>
                  <Label htmlFor="sacInv" className="cursor-pointer font-semibold text-gray-900">SAC</Label>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <ArrowDown className="w-3 h-3" />
                    Parcelas decrescentes
                  </p>
                </div>
              </div>
              <div 
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all bg-white
                  ${financingTable === 'PRICE' ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => setFinancingTable('PRICE')}
              >
                <RadioGroupItem value="PRICE" id="priceInv" className="border-gray-500 text-gray-900" />
                <div>
                  <Label htmlFor="priceInv" className="cursor-pointer font-semibold text-gray-900">PRICE</Label>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Minus className="w-3 h-3" />
                    Parcelas fixas
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Additional Costs */}
      <Card className="border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Custos Adicionais</CardTitle>
              <CardDescription className="text-gray-500">
                Impostos, taxas e despesas
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-5 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-gray-700">ITBI</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="9.000"
                  value={itbi}
                  onChange={(e) => handleCurrencyInput(e.target.value, setItbi)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 h-12 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Documentação / Cartório</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="5.000"
                  value={documentation}
                  onChange={(e) => handleCurrencyInput(e.target.value, setDocumentation)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 h-12 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Corretagem (na Revenda)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="27.000"
                  value={brokerage}
                  onChange={(e) => handleCurrencyInput(e.target.value, setBrokerage)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 h-12 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <Hammer className="w-4 h-4 text-gray-500" />
                Reforma (opcional)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="30.000"
                  value={renovation}
                  onChange={(e) => handleCurrencyInput(e.target.value, setRenovation)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 h-12 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Despesas Mensais (IPTU + Condomínio + Outros)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="800"
                value={monthlyExpenses}
                onChange={(e) => handleCurrencyInput(e.target.value, setMonthlyExpenses)}
                className="pl-10 bg-white border-gray-300 text-gray-900 h-12 focus:border-gray-400 focus:ring-gray-400"
              />
            </div>
            {holdingPeriod && monthlyExpenses && (
              <p className="text-sm text-gray-500">
                Total em {holdingPeriod} meses: {formatCurrency(parseCurrency(monthlyExpenses) * parseInt(holdingPeriod))}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <Button 
        onClick={calculateInvestment}
        className="w-full h-14 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white"
      >
        <Target className="w-5 h-5 mr-2" />
        Analisar Investimento
      </Button>
    </div>
  );
}
