import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Percent, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Info,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';

export const CalculateView: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<'compound' | 'mortgage' | 'runway'>('compound');
  const [compoundChartType, setCompoundChartType] = useState<'area' | 'bar'>('area');

  // ==========================================
  // 1. COMPOUND INTEREST STATE
  // ==========================================
  const [initialPrincipal, setInitialPrincipal] = useState<number>(5000);
  const [monthlyAddition, setMonthlyAddition] = useState<number>(300);
  const [interestRate, setInterestRate] = useState<number>(8);
  const [investmentYears, setInvestmentYears] = useState<number>(10);

  // ==========================================
  // 2. MORTGAGE & LOAN STATE
  // ==========================================
  const [homePrice, setHomePrice] = useState<number>(350000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [mortgageRate, setMortgageRate] = useState<number>(6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);

  // ==========================================
  // 3. EMERGENCY RUNWAY STATE
  // ==========================================
  const [liquidSavings, setLiquidSavings] = useState<number>(25000);
  const [monthlyBurn, setMonthlyBurn] = useState<number>(3800);

  // Trigger flash or calculation state
  const [isCalculated, setIsCalculated] = useState<boolean>(true);

  const handleRecalculate = () => {
    setIsCalculated(false);
    setTimeout(() => setIsCalculated(true), 150);
  };

  // ------------------------------------------
  // Compound Calculation Logic
  // ------------------------------------------
  const compoundData = useMemo(() => {
    const data = [];
    const monthlyRate = interestRate / 100 / 12;
    let balance = initialPrincipal;
    let totalDeposited = initialPrincipal;

    for (let yr = 1; yr <= investmentYears; yr++) {
      for (let m = 1; m <= 12; m++) {
        balance = balance * (1 + monthlyRate) + monthlyAddition;
        totalDeposited += monthlyAddition;
      }
      data.push({
        year: `Yr ${yr}`,
        Deposits: Math.round(totalDeposited),
        Interest: Math.max(0, Math.round(balance - totalDeposited)),
        Total: Math.round(balance),
      });
    }
    return data;
  }, [initialPrincipal, monthlyAddition, interestRate, investmentYears]);

  const finalCompoundTotal = compoundData.length > 0 ? compoundData[compoundData.length - 1].Total : initialPrincipal;
  const finalDepositedTotal = compoundData.length > 0 ? compoundData[compoundData.length - 1].Deposits : initialPrincipal;
  const finalInterestEarned = Math.max(0, finalCompoundTotal - finalDepositedTotal);
  const growthMultiplier = finalDepositedTotal > 0 ? (finalCompoundTotal / finalDepositedTotal).toFixed(2) : '1.00';

  // ------------------------------------------
  // Mortgage Calculation Logic
  // ------------------------------------------
  const loanAmount = homePrice * (1 - downPaymentPercent / 100);
  const downPaymentAmount = homePrice * (downPaymentPercent / 100);
  const monthlyMortgageRate = mortgageRate / 100 / 12;
  const totalPayments = loanTermYears * 12;
  const monthlyPayment = loanAmount > 0 && monthlyMortgageRate > 0
    ? (loanAmount * (monthlyMortgageRate * Math.pow(1 + monthlyMortgageRate, totalPayments))) / 
      (Math.pow(1 + monthlyMortgageRate, totalPayments) - 1)
    : 0;
  const totalLifetimePayment = monthlyPayment * totalPayments;
  const totalLifetimeInterest = Math.max(0, totalLifetimePayment - loanAmount);

  // ------------------------------------------
  // Runway Calculation Logic
  // ------------------------------------------
  const runwayMonths = monthlyBurn > 0 ? (liquidSavings / monthlyBurn).toFixed(1) : '0';

  // ------------------------------------------
  // Mortgage Amortization Trajectory Data
  // ------------------------------------------
  const mortgageAmortizationData = useMemo(() => {
    const data = [];
    const monthlyRate = mortgageRate / 100 / 12;
    let balance = loanAmount;
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;

    for (let yr = 1; yr <= loanTermYears; yr++) {
      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const interestPmt = balance * monthlyRate;
        const principalPmt = Math.min(balance, monthlyPayment - interestPmt);
        balance = Math.max(0, balance - principalPmt);
        cumulativePrincipal += principalPmt;
        cumulativeInterest += interestPmt;
      }
      data.push({
        year: `Yr ${yr}`,
        remainingLoan: Math.round(balance),
        homeEquity: Math.round(downPaymentAmount + cumulativePrincipal),
        interestPaid: Math.round(cumulativeInterest),
      });
    }
    return data;
  }, [loanAmount, downPaymentAmount, monthlyPayment, mortgageRate, loanTermYears]);

  // ------------------------------------------
  // Runway Projection Trajectory Data
  // ------------------------------------------
  const runwayChartData = useMemo(() => {
    const totalMonths = Math.min(24, Math.max(6, Math.ceil(Number(runwayMonths)) + 2));
    const data = [];
    let currentCash = liquidSavings;
    for (let m = 0; m <= totalMonths; m++) {
      data.push({
        month: `M${m}`,
        cash: Math.max(0, Math.round(currentCash)),
        baseline: monthlyBurn * 3,
        fortress: monthlyBurn * 6,
      });
      currentCash -= monthlyBurn;
    }
    return data;
  }, [liquidSavings, monthlyBurn, runwayMonths]);

  return (
    <div id="calculate-view-container" className="space-y-10 max-w-7xl mx-auto pb-12 font-inter">
      
      {/* 1. Refined Hero Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E2E8F0] pb-8">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#659B5E] block">
            Financial Decision Models
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#1E293B] tracking-tight">
            Make every number count.
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Institutional-grade models for compounding wealth projections, debt amortization, and liquidity stress-testing.
          </p>
        </div>

        {/* Tab Switcher - Clean, minimal, modern typography */}
        <div className="inline-flex p-1 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] self-start md:self-auto">
          <button
            id="calc-tab-compound"
            onClick={() => { setActiveCalculator('compound'); handleRecalculate(); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeCalculator === 'compound'
                ? 'bg-white text-[#1E293B] shadow-2xs'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Compound Growth
          </button>
          <button
            id="calc-tab-mortgage"
            onClick={() => { setActiveCalculator('mortgage'); handleRecalculate(); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeCalculator === 'mortgage'
                ? 'bg-white text-[#1E293B] shadow-2xs'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Loan & Mortgage
          </button>
          <button
            id="calc-tab-runway"
            onClick={() => { setActiveCalculator('runway'); handleRecalculate(); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeCalculator === 'runway'
                ? 'bg-white text-[#1E293B] shadow-2xs'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Emergency Runway
          </button>
        </div>
      </div>

      {/* 2. Main Focus: Large, Elegant Calculator Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        
        {/* ========================================================= */}
        {/* TAB 1: COMPOUND INTEREST */}
        {/* ========================================================= */}
        {activeCalculator === 'compound' && (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column (Inputs) - 5 Cols */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:border-r border-[#E2E8F0] space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <h2 className="font-heading font-bold text-xl text-[#1E293B]">
                    Compound Interest Inputs
                  </h2>
                  <p className="text-xs text-[#64748B] mt-1">
                    Calculate regular monthly dollar-cost averaging and expected annual returns.
                  </p>
                </div>

                {/* Input: Initial Investment */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                    Initial Investment
                  </label>
                  <div className="relative rounded-xl border border-[#CBD5E1] focus-within:border-[#659B5E] focus-within:ring-2 focus-within:ring-[#659B5E]/20 transition-all bg-white overflow-hidden">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64748B]">$</span>
                    <input
                      id="compound-initial-input"
                      type="number"
                      min={0}
                      step={500}
                      value={initialPrincipal}
                      onChange={(e) => setInitialPrincipal(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 text-sm font-bold text-[#1E293B] focus:outline-hidden"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    {[1000, 5000, 10000, 25000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInitialPrincipal(preset)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                          initialPrincipal === preset 
                            ? 'bg-[#E8F0EA] text-[#41603B] font-bold' 
                            : 'text-[#64748B] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        ${preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input: Monthly Addition */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                    Monthly Contribution
                  </label>
                  <div className="relative rounded-xl border border-[#CBD5E1] focus-within:border-[#659B5E] focus-within:ring-2 focus-within:ring-[#659B5E]/20 transition-all bg-white overflow-hidden">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64748B]">$</span>
                    <input
                      id="compound-monthly-input"
                      type="number"
                      min={0}
                      step={50}
                      value={monthlyAddition}
                      onChange={(e) => setMonthlyAddition(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 text-sm font-bold text-[#1E293B] focus:outline-hidden"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#64748B]">/ month</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    {[100, 300, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setMonthlyAddition(preset)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                          monthlyAddition === preset 
                            ? 'bg-[#E8F0EA] text-[#41603B] font-bold' 
                            : 'text-[#64748B] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        ${preset}/mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dual Inputs: Annual Rate & Investment Years */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                      Annual Rate (%)
                    </label>
                    <div className="relative rounded-xl border border-[#CBD5E1] focus-within:border-[#659B5E] focus-within:ring-2 focus-within:ring-[#659B5E]/20 transition-all bg-white overflow-hidden">
                      <input
                        id="compound-rate-input"
                        type="number"
                        min={0.1}
                        max={30}
                        step={0.5}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                        className="w-full px-3.5 py-2.5 text-sm font-bold text-[#1E293B] focus:outline-hidden"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B]">%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                      Time Horizon
                    </label>
                    <div className="relative rounded-xl border border-[#CBD5E1] focus-within:border-[#659B5E] focus-within:ring-2 focus-within:ring-[#659B5E]/20 transition-all bg-white overflow-hidden">
                      <input
                        id="compound-years-input"
                        type="number"
                        min={1}
                        max={50}
                        value={investmentYears}
                        onChange={(e) => setInvestmentYears(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3.5 py-2.5 text-sm font-bold text-[#1E293B] focus:outline-hidden"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B]">Yrs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prominent Sophisticated Green Calculate Button */}
              <div className="pt-4 border-t border-[#F1F5F9]">
                <button
                  id="compound-calculate-btn"
                  type="button"
                  onClick={handleRecalculate}
                  className="w-full py-3 px-4 rounded-xl bg-[#659B5E] hover:bg-[#52824c] active:scale-[0.99] text-white text-sm font-semibold tracking-wide shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calculate Projection</span>
                </button>
              </div>
            </div>

            {/* Right Column (Results Panel with strong visual hierarchy) - 7 Cols */}
            <div className="lg:col-span-7 p-6 sm:p-8 bg-[#F8F9FA] space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Primary Result Headline */}
                <div className="space-y-1 pb-4 border-b border-[#E2E8F0]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Projected Portfolio Balance (Year {investmentYears})
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1E293B] tracking-tight">
                      ${finalCompoundTotal.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
                      {growthMultiplier}x Growth
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] pt-1">
                    Your compound interest represents <strong className="text-[#1E293B]">{Math.round((finalInterestEarned / (finalCompoundTotal || 1)) * 100)}%</strong> of your ultimate wealth, surpassing out-of-pocket savings.
                  </p>
                </div>

                {/* Granular Breakdown Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block">
                      Total Deposits
                    </span>
                    <div className="font-heading font-bold text-lg text-[#1E293B]">
                      ${finalDepositedTotal.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#64748B]">Your principal capital</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#16A34A] block">
                      Compound Return
                    </span>
                    <div className="font-heading font-bold text-lg text-[#16A34A]">
                      +${finalInterestEarned.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#64748B]">Accumulated yield</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block">
                      Average Annual Return
                    </span>
                    <div className="font-heading font-bold text-lg text-[#1E293B]">
                      {interestRate}%
                    </div>
                    <span className="text-[10px] text-[#64748B]">Monthly compounding</span>
                  </div>
                </div>

                {/* Visual Chart in Finova Signature Color Scheme */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#659B5E] ring-2 ring-[#E8F0EA]" />
                        <span className="font-semibold text-[#1E293B]">Total Wealth</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
                        <span className="text-[#64748B]">Principal</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#16A34A]" />
                        <span className="font-semibold text-[#16A34A]">Compound Gain</span>
                      </div>
                    </div>

                    {/* Chart Type Toggle */}
                    <div className="inline-flex p-0.5 rounded-lg bg-[#E2E8F0]/70 border border-[#CBD5E1]/60 self-start sm:self-auto">
                      <button
                        id="compound-view-area-toggle"
                        type="button"
                        onClick={() => setCompoundChartType('area')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                          compoundChartType === 'area'
                            ? 'bg-white text-[#41603B] shadow-2xs font-bold'
                            : 'text-[#64748B] hover:text-[#1E293B]'
                        }`}
                      >
                        Growth Curve
                      </button>
                      <button
                        id="compound-view-bar-toggle"
                        type="button"
                        onClick={() => setCompoundChartType('bar')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                          compoundChartType === 'bar'
                            ? 'bg-white text-[#41603B] shadow-2xs font-bold'
                            : 'text-[#64748B] hover:text-[#1E293B]'
                        }`}
                      >
                        Annual Bars
                      </button>
                    </div>
                  </div>

                  {/* Chart Container */}
                  <div className="h-72 w-full bg-white p-3 sm:p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
                    <ResponsiveContainer width="100%" height="100%">
                      {compoundChartType === 'area' ? (
                        <AreaChart data={compoundData} margin={{ top: 12, right: 10, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="finovaCompoundEmerald" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#659B5E" stopOpacity={0.38} />
                              <stop offset="95%" stopColor="#659B5E" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="finovaPrincipalSlate" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.22} />
                              <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis 
                            dataKey="year" 
                            stroke="#94A3B8" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={{ stroke: '#E2E8F0' }}
                          />
                          <YAxis 
                            stroke="#94A3B8" 
                            fontSize={11} 
                            tickLine={false}
                            axisLine={{ stroke: '#E2E8F0' }}
                            tickFormatter={(val) => `$${val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                          />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                  <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-lg text-xs space-y-2 min-w-[210px]">
                                    <div className="font-bold text-[#1E293B] border-b border-[#F1F5F9] pb-1.5 flex items-center justify-between">
                                      <span>Compound Timeline</span>
                                      <span className="text-[#41603B] font-extrabold">{label}</span>
                                    </div>
                                    <div className="space-y-1.5 pt-0.5">
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="flex items-center gap-1.5 text-[#1E293B] font-semibold">
                                          <span className="w-2.5 h-2.5 rounded-full bg-[#659B5E]" />
                                          Total Wealth:
                                        </span>
                                        <span className="font-bold text-[#1E293B]">
                                          ${d.Total.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="flex items-center gap-1.5 text-[#64748B]">
                                          <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
                                          Principal Deposits:
                                        </span>
                                        <span className="font-semibold text-[#64748B]">
                                          ${d.Deposits.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
                                          <span className="w-2.5 h-2.5 rounded-xs bg-[#16A34A]" />
                                          Compound Yield:
                                        </span>
                                        <span className="font-bold text-[#16A34A]">
                                          +${d.Interest.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="Total" 
                            name="Total Projected Wealth" 
                            stroke="#41603B" 
                            strokeWidth={2.5} 
                            fillOpacity={1} 
                            fill="url(#finovaCompoundEmerald)" 
                            dot={{ fill: '#659B5E', r: 3, stroke: '#FFFFFF', strokeWidth: 2 }}
                            activeDot={{ fill: '#41603B', r: 5, stroke: '#FFFFFF', strokeWidth: 2 }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="Deposits" 
                            name="Principal Out-of-Pocket" 
                            stroke="#94A3B8" 
                            strokeWidth={1.8} 
                            strokeDasharray="4 4"
                            fillOpacity={1} 
                            fill="url(#finovaPrincipalSlate)" 
                          />
                        </AreaChart>
                      ) : (
                        <BarChart data={compoundData} margin={{ top: 12, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis 
                            dataKey="year" 
                            stroke="#94A3B8" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={{ stroke: '#E2E8F0' }}
                          />
                          <YAxis 
                            stroke="#94A3B8" 
                            fontSize={11} 
                            tickLine={false}
                            axisLine={{ stroke: '#E2E8F0' }}
                            tickFormatter={(val) => `$${val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                          />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                  <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-lg text-xs space-y-2 min-w-[210px]">
                                    <div className="font-bold text-[#1E293B] border-b border-[#F1F5F9] pb-1.5 flex items-center justify-between">
                                      <span>Compound Timeline</span>
                                      <span className="text-[#41603B] font-extrabold">{label}</span>
                                    </div>
                                    <div className="space-y-1.5 pt-0.5">
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="flex items-center gap-1.5 text-[#1E293B] font-semibold">
                                          <span className="w-2.5 h-2.5 rounded-full bg-[#659B5E]" />
                                          Total Wealth:
                                        </span>
                                        <span className="font-bold text-[#1E293B]">
                                          ${d.Total.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="flex items-center gap-1.5 text-[#64748B]">
                                          <span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
                                          Principal Deposits:
                                        </span>
                                        <span className="font-semibold text-[#64748B]">
                                          ${d.Deposits.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
                                          <span className="w-2.5 h-2.5 rounded-xs bg-[#16A34A]" />
                                          Compound Yield:
                                        </span>
                                        <span className="font-bold text-[#16A34A]">
                                          +${d.Interest.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="Deposits" stackId="a" fill="#CBD5E1" name="Principal Deposits" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="Interest" stackId="a" fill="#659B5E" name="Compound Growth" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Explanatory text underneath result */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex items-start gap-2.5 text-xs text-[#64748B]">
                <Info className="w-4 h-4 text-[#659B5E] shrink-0 mt-0.5" />
                <p>
                  <strong>What this means:</strong> By investing consistently, your interest earns interest of its own. Over {investmentYears} years at {interestRate}%, compounding generates ${(finalInterestEarned).toLocaleString()} on top of your ${(finalDepositedTotal).toLocaleString()} out-of-pocket deposits.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: LOAN & MORTGAGE AMORTIZATION */}
        {/* ========================================================= */}
        {activeCalculator === 'mortgage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column (Inputs) - 5 Cols */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:border-r border-[#E2E8F0] space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <h2 className="font-heading font-bold text-xl text-[#1E293B]">
                    Mortgage & Loan Inputs
                  </h2>
                  <p className="text-xs text-[#64748B] mt-1">
                    Calculate fixed-rate monthly debt service, principal amortization, and lifetime borrowing expense.
                  </p>
                </div>

                {/* Asset Value */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                    Property / Loan Purchase Price
                  </label>
                  <div className="relative rounded-xl border border-[#CBD5E1] focus-within:border-[#659B5E] focus-within:ring-2 focus-within:ring-[#659B5E]/20 transition-all bg-white overflow-hidden">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64748B]">$</span>
                    <input
                      id="mortgage-price-input"
                      type="number"
                      min={10000}
                      step={5000}
                      value={homePrice}
                      onChange={(e) => setHomePrice(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 text-sm font-bold text-[#1E293B] focus:outline-hidden"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    {[250000, 350000, 500000, 750000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setHomePrice(preset)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                          homePrice === preset 
                            ? 'bg-[#E8F0EA] text-[#41603B] font-bold' 
                            : 'text-[#64748B] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        ${(preset / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* Down Payment Percent & Mortgage Rate */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                      Down Payment (%)
                    </label>
                    <div className="relative rounded-xl border border-[#CBD5E1] focus-within:border-[#659B5E] focus-within:ring-2 focus-within:ring-[#659B5E]/20 transition-all bg-white overflow-hidden">
                      <input
                        id="mortgage-downpayment-input"
                        type="number"
                        min={0}
                        max={90}
                        step={5}
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Math.max(0, Number(e.target.value)))}
                        className="w-full px-3.5 py-2.5 text-sm font-bold text-[#1E293B] focus:outline-hidden"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B]">%</span>
                    </div>
                    <span className="text-[11px] text-[#64748B] block">
                      = ${(downPaymentAmount).toLocaleString()} down
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                      Interest Rate (%)
                    </label>
                    <div className="relative rounded-xl border border-[#CBD5E1] focus-within:border-[#659B5E] focus-within:ring-2 focus-within:ring-[#659B5E]/20 transition-all bg-white overflow-hidden">
                      <input
                        id="mortgage-rate-input"
                        type="number"
                        min={0.5}
                        max={25}
                        step={0.125}
                        value={mortgageRate}
                        onChange={(e) => setMortgageRate(Math.max(0, Number(e.target.value)))}
                        className="w-full px-3.5 py-2.5 text-sm font-bold text-[#1E293B] focus:outline-hidden"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B]">%</span>
                    </div>
                    <span className="text-[11px] text-[#64748B] block">Annual fixed rate</span>
                  </div>
                </div>

                {/* Loan Term Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                    Loan Amortization Term
                  </label>
                  <select
                    id="mortgage-term-select"
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-bold text-[#1E293B] focus:outline-hidden bg-white cursor-pointer"
                  >
                    <option value={15}>15-Year Fixed Mortgage</option>
                    <option value={20}>20-Year Fixed Mortgage</option>
                    <option value={30}>30-Year Fixed Mortgage</option>
                  </select>
                </div>
              </div>

              {/* Prominent Sophisticated Green Calculate Button */}
              <div className="pt-4 border-t border-[#F1F5F9]">
                <button
                  id="mortgage-calculate-btn"
                  type="button"
                  onClick={handleRecalculate}
                  className="w-full py-3 px-4 rounded-xl bg-[#659B5E] hover:bg-[#52824c] active:scale-[0.99] text-white text-sm font-semibold tracking-wide shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calculate Amortization</span>
                </button>
              </div>
            </div>

            {/* Right Column (Results Panel) - 7 Cols */}
            <div className="lg:col-span-7 p-6 sm:p-8 bg-[#F8F9FA] space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Monthly Payment Headline */}
                <div className="space-y-1 pb-4 border-b border-[#E2E8F0]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Estimated Monthly Principal & Interest Payment
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1E293B] tracking-tight">
                      ${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm font-semibold text-[#64748B]">/ month</span>
                  </div>
                  <p className="text-xs text-[#64748B] pt-1">
                    Based on a ${loanAmount.toLocaleString()} financed principal over {loanTermYears} years at {mortgageRate}% fixed APR.
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block">
                      Total Borrowed
                    </span>
                    <div className="font-heading font-bold text-lg text-[#1E293B]">
                      ${loanAmount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#64748B]">{100 - downPaymentPercent}% loan-to-value</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block">
                      Upfront Down Payment
                    </span>
                    <div className="font-heading font-bold text-lg text-[#1E293B]">
                      ${downPaymentAmount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#64748B]">{downPaymentPercent}% equity deposit</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#DC2626] block">
                      Total Lifetime Interest
                    </span>
                    <div className="font-heading font-bold text-lg text-[#DC2626]">
                      ${Math.round(totalLifetimeInterest).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#64748B]">Cost of borrowing</span>
                  </div>
                </div>

                {/* Lifetime Payment Summary Bar */}
                <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[#1E293B]">Lifetime Repayment Composition</span>
                    <span className="text-[#64748B]">Total: ${Math.round(totalLifetimePayment).toLocaleString()}</span>
                  </div>
                  
                  {/* Segmented bar */}
                  <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-100">
                    <div 
                      className="bg-[#659B5E] h-full"
                      style={{ width: `${(loanAmount / (totalLifetimePayment || 1)) * 100}%` }}
                      title={`Principal: $${loanAmount.toLocaleString()}`}
                    />
                    <div 
                      className="bg-amber-500 h-full"
                      style={{ width: `${(totalLifetimeInterest / (totalLifetimePayment || 1)) * 100}%` }}
                      title={`Interest: $${Math.round(totalLifetimeInterest).toLocaleString()}`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#659B5E]" />
                      <span>Principal: ${loanAmount.toLocaleString()} ({Math.round((loanAmount / (totalLifetimePayment || 1)) * 100)}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Interest: ${Math.round(totalLifetimeInterest).toLocaleString()} ({Math.round((totalLifetimeInterest / (totalLifetimePayment || 1)) * 100)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Amortization Trajectory Chart in App Color Scheme */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1E293B]">Equity vs. Debt Paydown Curve</span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#659B5E]" />
                        <span className="text-[#41603B] font-medium">Home Equity</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
                        <span className="text-[#64748B]">Remaining Loan</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-52 w-full bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mortgageAmortizationData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="equityFinovaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#659B5E" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#659B5E" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="remainingDebtGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.20} />
                            <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                        <YAxis 
                          stroke="#94A3B8" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={{ stroke: '#E2E8F0' }}
                          tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-lg text-xs space-y-1.5 min-w-[190px]">
                                  <div className="font-bold text-[#1E293B] border-b border-[#F1F5F9] pb-1 flex justify-between">
                                    <span>Amortization</span>
                                    <span className="text-[#41603B]">{label}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-[#41603B] font-semibold flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-[#659B5E]" />
                                      Home Equity:
                                    </span>
                                    <span className="font-bold text-[#1E293B]">${d.homeEquity.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-[#64748B] flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                                      Loan Balance:
                                    </span>
                                    <span className="font-semibold text-[#64748B]">${d.remainingLoan.toLocaleString()}</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="homeEquity" 
                          name="Home Equity" 
                          stroke="#41603B" 
                          strokeWidth={2.2} 
                          fillOpacity={1} 
                          fill="url(#equityFinovaGradient)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="remainingLoan" 
                          name="Remaining Loan" 
                          stroke="#94A3B8" 
                          strokeWidth={1.8} 
                          strokeDasharray="4 4" 
                          fillOpacity={1} 
                          fill="url(#remainingDebtGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Explanatory Advice */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex items-start gap-2.5 text-xs text-[#64748B]">
                <Info className="w-4 h-4 text-[#659B5E] shrink-0 mt-0.5" />
                <p>
                  <strong>What this means:</strong> Over {loanTermYears} years, your debt will cost ${(Math.round(totalLifetimeInterest)).toLocaleString()} in finance interest charges alone. Increasing your down payment or choosing a 15-year term drastically cuts the lifetime interest paid to the lender.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: EMERGENCY RUNWAY & BUFFER */}
        {/* ========================================================= */}
        {activeCalculator === 'runway' && (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column (Inputs) - 5 Cols */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:border-r border-[#E2E8F0] space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <h2 className="font-heading font-bold text-xl text-[#1E293B]">
                    Liquidity Runway Inputs
                  </h2>
                  <p className="text-xs text-[#64748B] mt-1">
                    Calculate how many months of non-negotiable living expenses your liquid capital can sustain without incoming income.
                  </p>
                </div>

                {/* Liquid Cash */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                    Current Liquid Savings ($)
                  </label>
                  <div className="relative rounded-xl border border-[#CBD5E1] focus-within:border-[#659B5E] focus-within:ring-2 focus-within:ring-[#659B5E]/20 transition-all bg-white overflow-hidden">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64748B]">$</span>
                    <input
                      id="runway-savings-input"
                      type="number"
                      min={0}
                      step={1000}
                      value={liquidSavings}
                      onChange={(e) => setLiquidSavings(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 text-sm font-bold text-[#1E293B] focus:outline-hidden"
                    />
                  </div>
                  <span className="text-[11px] text-[#64748B] block">Checking, savings, cash and money market balances</span>
                </div>

                {/* Monthly Expenses */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                    Essential Monthly Expenditures ($)
                  </label>
                  <div className="relative rounded-xl border border-[#CBD5E1] focus-within:border-[#659B5E] focus-within:ring-2 focus-within:ring-[#659B5E]/20 transition-all bg-white overflow-hidden">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64748B]">$</span>
                    <input
                      id="runway-expenses-input"
                      type="number"
                      min={100}
                      step={100}
                      value={monthlyBurn}
                      onChange={(e) => setMonthlyBurn(Math.max(1, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 text-sm font-bold text-[#1E293B] focus:outline-hidden"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#64748B]">/ month</span>
                  </div>
                  <span className="text-[11px] text-[#64748B] block">Rent/mortgage, utilities, food, healthcare & debt service</span>
                </div>
              </div>

              {/* Prominent Sophisticated Green Calculate Button */}
              <div className="pt-4 border-t border-[#F1F5F9]">
                <button
                  id="runway-calculate-btn"
                  type="button"
                  onClick={handleRecalculate}
                  className="w-full py-3 px-4 rounded-xl bg-[#659B5E] hover:bg-[#52824c] active:scale-[0.99] text-white text-sm font-semibold tracking-wide shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calculate Runway</span>
                </button>
              </div>
            </div>

            {/* Right Column (Results Panel) - 7 Cols */}
            <div className="lg:col-span-7 p-6 sm:p-8 bg-[#F8F9FA] space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Headline Runway Duration */}
                <div className="space-y-1 pb-4 border-b border-[#E2E8F0]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Total Survival Liquidity Runway
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1E293B] tracking-tight">
                      {runwayMonths}
                    </span>
                    <span className="text-xl font-bold text-[#64748B]">Months</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      Number(runwayMonths) >= 6
                        ? 'bg-[#DCFCE7] text-[#16A34A]'
                        : Number(runwayMonths) >= 3
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {Number(runwayMonths) >= 6 ? 'Robust Cushion' : Number(runwayMonths) >= 3 ? 'Moderate Buffer' : 'At-Risk Cushion'}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] pt-1">
                    At a monthly burn rate of ${monthlyBurn.toLocaleString()}, your ${liquidSavings.toLocaleString()} in liquid capital will support your household for {runwayMonths} full months.
                  </p>
                </div>

                {/* Runway Comparison Guidance */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block">
                      3-Month Baseline
                    </span>
                    <div className="font-heading font-bold text-base text-[#1E293B]">
                      ${(monthlyBurn * 3).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#64748B]">Minimum security threshold</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#41603B] block">
                      6-Month Target
                    </span>
                    <div className="font-heading font-bold text-base text-[#41603B]">
                      ${(monthlyBurn * 6).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#64748B]">Recommended resilience</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block">
                      12-Month Fortress
                    </span>
                    <div className="font-heading font-bold text-base text-[#1E293B]">
                      ${(monthlyBurn * 12).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#64748B]">Self-employed safety</span>
                  </div>
                </div>

                {/* Runway Buffer Trajectory Chart in App Color Scheme */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1E293B]">Liquidity Depletion & Safety Buffers</span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#659B5E]" />
                        <span className="text-[#41603B] font-medium">Available Cash</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-[#64748B]">3-Mo Buffer</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-52 w-full bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={runwayChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="runwayCashGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#659B5E" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#659B5E" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                        <YAxis 
                          stroke="#94A3B8" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={{ stroke: '#E2E8F0' }}
                          tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-lg text-xs space-y-1.5 min-w-[180px]">
                                  <div className="font-bold text-[#1E293B] border-b border-[#F1F5F9] pb-1 flex justify-between">
                                    <span>Runway Timeline</span>
                                    <span className="text-[#41603B]">{label}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-[#41603B] font-semibold flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-[#659B5E]" />
                                      Liquid Cash:
                                    </span>
                                    <span className="font-bold text-[#1E293B]">${d.cash.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between gap-4 text-amber-600">
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                                      3-Mo Safety:
                                    </span>
                                    <span className="font-semibold">${d.baseline.toLocaleString()}</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <ReferenceLine y={monthlyBurn * 3} stroke="#F59E0B" strokeDasharray="3 3" />
                        <Area 
                          type="monotone" 
                          dataKey="cash" 
                          name="Liquid Capital" 
                          stroke="#41603B" 
                          strokeWidth={2.2} 
                          fillOpacity={1} 
                          fill="url(#runwayCashGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Explanatory Guidance */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex items-start gap-2.5 text-xs text-[#64748B]">
                <ShieldCheck className="w-4 h-4 text-[#659B5E] shrink-0 mt-0.5" />
                <p>
                  <strong>Financial Resilience Rule:</strong> CERTIFIED FINANCIAL PLANNER™ standards advise maintaining 3 to 6 months of living expenses in an accessible high-yield savings account before aggressively allocating surplus cash into equities.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 3. Subtle Supporting Information & Editorial Finance Imagery Below Calculator */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Text Column (Col 7) */}
          <div className="p-6 sm:p-10 lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-wider uppercase text-[#659B5E] block">
                Educational Principles
              </span>
              <h3 className="font-heading font-bold text-2xl text-[#1E293B] tracking-tight">
                The Mathematics of Compounding and Capital Preservation
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Sound wealth accumulation is built on continuous regular contributions, minimizing expense ratios, and avoiding the mathematical penalty of high-interest debt.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <h4 className="font-heading font-bold text-sm text-[#1E293B]">
                  The Exponential Snowflake
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  In year five, compound interest feels modest. By year twenty, the annual investment returns routinely eclipse your original annual salary contributions.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-heading font-bold text-sm text-[#1E293B]">
                  Real vs. Nominal Returns
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Idle cash in standard checking accounts loses purchasing power to inflation annually. Broad market indexing historically maintains positive real purchasing power.
                </p>
              </div>
            </div>
          </div>

          {/* Right Editorial Photography Asset (Col 5) - Classy, institutional finance visual */}
          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
              alt="Modern architectural lines of an established institutional financial building"
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-xs font-medium tracking-wide">
                Institutional Financial Planning Standards
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
