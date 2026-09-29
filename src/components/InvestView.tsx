import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  DollarSign, 
  Sliders, 
  CheckCircle2, 
  PieChart as PieIcon,
  RefreshCw,
  Plus
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface InvestViewProps {
  investSettings?: {
    riskLevel?: 'conservative' | 'balanced' | 'growth' | 'aggressive';
    initialPrincipal?: number;
    monthlyContribution?: number;
    selectedPortfolio?: string;
    isAutoInvestActive?: boolean;
  };
  onSaveSettings?: (settings: {
    riskLevel: 'conservative' | 'balanced' | 'growth' | 'aggressive';
    initialPrincipal: number;
    monthlyContribution: number;
    selectedPortfolio: string;
    isAutoInvestActive: boolean;
  }) => void;
}

export const InvestView: React.FC<InvestViewProps> = ({
  investSettings,
  onSaveSettings,
}) => {
  const [riskLevel, setRiskLevel] = useState<'conservative' | 'balanced' | 'growth' | 'aggressive'>(
    investSettings?.riskLevel || 'growth'
  );
  const [initialPrincipal, setInitialPrincipal] = useState<number>(
    investSettings?.initialPrincipal !== undefined ? investSettings.initialPrincipal : 500
  );
  const [monthlyContribution, setMonthlyContribution] = useState<number>(
    investSettings?.monthlyContribution !== undefined ? investSettings.monthlyContribution : 250
  );
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>(
    investSettings?.selectedPortfolio || 'growth-etf'
  );
  const [isAutoInvestActive, setIsAutoInvestActive] = useState<boolean>(
    investSettings?.isAutoInvestActive !== undefined ? investSettings.isAutoInvestActive : true
  );
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Sync if prop updates
  React.useEffect(() => {
    if (investSettings) {
      if (investSettings.riskLevel) setRiskLevel(investSettings.riskLevel);
      if (investSettings.initialPrincipal !== undefined) setInitialPrincipal(investSettings.initialPrincipal);
      if (investSettings.monthlyContribution !== undefined) setMonthlyContribution(investSettings.monthlyContribution);
      if (investSettings.selectedPortfolio) setSelectedPortfolio(investSettings.selectedPortfolio);
      if (investSettings.isAutoInvestActive !== undefined) setIsAutoInvestActive(investSettings.isAutoInvestActive);
    }
  }, [investSettings]);

  // Projected compound growth data based on user inputs
  const years = [0, 1, 2, 3, 5, 7, 10, 15, 20];
  const returnRate = riskLevel === 'conservative' ? 0.05 : riskLevel === 'balanced' ? 0.075 : riskLevel === 'growth' ? 0.095 : 0.115;
  const effectiveMonthly = isAutoInvestActive ? monthlyContribution : 0;

  const projectionData = years.map(year => {
    const totalMonths = year * 12;
    const monthlyRate = returnRate / 12;
    let futureValue = initialPrincipal;

    if (totalMonths > 0) {
      const compoundPrincipal = initialPrincipal * Math.pow(1 + monthlyRate, totalMonths);
      const compoundMonthly = effectiveMonthly > 0 && monthlyRate > 0
        ? effectiveMonthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
        : effectiveMonthly * totalMonths;
      futureValue = compoundPrincipal + compoundMonthly;
    }

    const totalDeposited = initialPrincipal + (effectiveMonthly * totalMonths);
    const earnings = futureValue - totalDeposited;

    return {
      year: `Yr ${year}`,
      totalValue: Math.round(futureValue),
      deposits: Math.round(totalDeposited),
      returns: Math.max(0, Math.round(earnings)),
    };
  });

  const portfolios = [
    {
      id: 'conservative-etf',
      title: 'Capital Preservation & Yield',
      risk: 'Conservative',
      expectedYield: '5.2% p.a.',
      description: 'Weighted towards short-term US Treasury Bills, sovereign debt, and investment-grade corporate bonds.',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      allocation: [
        { asset: 'US Treasury Bonds (SHY/TLT)', share: '60%' },
        { asset: 'Global Investment Grade Debt', share: '25%' },
        { asset: 'Dividend Aristocrat Equities', share: '15%' },
      ],
    },
    {
      id: 'growth-etf',
      title: 'Global All-Cap & Tech Growth',
      risk: 'Growth',
      expectedYield: '9.8% p.a.',
      description: 'Our flagship guided portfolio with broad global equities, high-efficiency index funds, and innovation leaders.',
      badgeColor: 'bg-[#DCFCE7] text-[#41603B] border-[#659B5E]/30',
      allocation: [
        { asset: 'Total US Stock Market (VTI)', share: '45%' },
        { asset: 'International Developed (VEA)', share: '25%' },
        { asset: 'Emerging Markets & Tech (QQQ)', share: '20%' },
        { asset: 'Inflation Protected TIPS', share: '10%' },
      ],
    },
    {
      id: 'esg-etf',
      title: 'Clean Energy & ESG Leaders',
      risk: 'Balanced',
      expectedYield: '8.4% p.a.',
      description: 'Curated for sustainable impact, zero-carbon transit, renewable power producers, and green technology.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      allocation: [
        { asset: 'Global Clean Energy (ICLN)', share: '35%' },
        { asset: 'ESG Screened Leaders (ESGU)', share: '40%' },
        { asset: 'Green Infrastructure Bonds', share: '25%' },
      ],
    },
  ];

  const handleApplyAllocation = () => {
    if (onSaveSettings) {
      onSaveSettings({
        riskLevel,
        initialPrincipal,
        monthlyContribution,
        selectedPortfolio,
        isAutoInvestActive,
      });
    }
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  return (
    <div id="invest-view-container" className="space-y-8">
      
      {/* Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1E293B] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <div className="w-7 h-7 rounded-full bg-[#659B5E] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-semibold">Portfolio Settings Updated</div>
            <div className="text-[11px] text-slate-300">Auto-invest set to ${monthlyContribution}/mo into selected ETF basket.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0EA] text-[#41603B] text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#659B5E]" />
            <span>Automated Portfolios</span>
          </div>
          <h1 className="font-young-serif text-3xl sm:text-4xl text-[#1E293B]">
            Automated Portfolios & Wealth Accumulation
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Put your savings to work with low-fee, globally diversified index baskets and disciplined dollar-cost averaging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoInvestActive(!isAutoInvestActive)}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
              isAutoInvestActive
                ? 'bg-[#E8F0EA] border-[#659B5E] text-[#41603B]'
                : 'bg-white border-[#E2E8F0] text-[#64748B]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoInvestActive ? 'text-[#659B5E]' : 'text-[#64748B]'}`} />
            <span>Auto-Deposit: {isAutoInvestActive ? `Active ($${monthlyContribution}/mo)` : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* 3 Featured Guided Portfolios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portfolios.map((item) => {
          const isSelected = selectedPortfolio === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedPortfolio(item.id)}
              className={`bg-white rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#659B5E] ring-2 ring-[#659B5E]/20 shadow-md'
                  : 'border-[#E2E8F0] hover:border-[#659B5E]/40 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${item.badgeColor}`}>
                    {item.risk}
                  </span>
                  <span className="font-young-serif text-base text-[#41603B] font-bold">
                    {item.expectedYield}
                  </span>
                </div>

                <h3 className="font-young-serif text-xl text-[#1E293B]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {item.description}
                </p>

                {/* Allocation breakdown */}
                <div className="pt-2 space-y-1.5 border-t border-[#E2E8F0]">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Basket Composition
                  </div>
                  {item.allocation.map((alloc, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-[#1E293B] truncate">{alloc.asset}</span>
                      <span className="font-semibold text-[#41603B]">{alloc.share}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4">
                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#659B5E] text-white shadow-xs'
                      : 'bg-[#F8F9FA] text-[#1E293B] hover:bg-[#E8F0EA]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selected Portfolio</span>
                    </>
                  ) : (
                    <span>Choose This Portfolio</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projection & Calculator Section */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls on Left (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="font-young-serif text-2xl text-[#1E293B]">
                Compound Growth Projection
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Adjust your monthly micro-deposit and risk tolerance to simulate 20-year portfolio accumulation.
              </p>
            </div>

            {/* Initial Principal Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1E293B] uppercase tracking-wider">
                  Initial Principal
                </label>
                <span className="font-young-serif text-lg font-bold text-[#1E293B]">
                  ${initialPrincipal.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10000}
                step={100}
                value={initialPrincipal}
                onChange={(e) => setInitialPrincipal(Number(e.target.value))}
                className="w-full accent-[#659B5E] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#64748B]">
                <span>$0</span>
                <span>$2,500</span>
                <span>$5,000</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Monthly Deposit Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1E293B] uppercase tracking-wider">
                  Monthly Contribution
                </label>
                <span className="font-young-serif text-lg font-bold text-[#659B5E]">
                  ${monthlyContribution} / mo
                </span>
              </div>
              <input
                type="range"
                min={25}
                max={2500}
                step={25}
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full accent-[#659B5E] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#64748B]">
                <span>$25/mo</span>
                <span>$500/mo</span>
                <span>$1,000/mo</span>
                <span>$2,500/mo</span>
              </div>
            </div>

            {/* Risk tolerance selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1E293B] uppercase tracking-wider">
                Risk Horizon
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'conservative', label: 'Conservative' },
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'growth', label: 'Growth' },
                  { id: 'aggressive', label: 'Aggressive' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setRiskLevel(tier.id as any)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                      riskLevel === tier.id
                        ? 'bg-[#E8F0EA] border-[#659B5E] text-[#41603B] shadow-2xs'
                        : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Stat Box */}
            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Projected 10-Year Value:</span>
                <span className="font-bold text-[#1E293B]">
                  ${projectionData[6].totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Projected 20-Year Value:</span>
                <span className="font-young-serif text-base text-[#659B5E] font-bold">
                  ${projectionData[8].totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 border-t border-[#E2E8F0]">
                <span>Estimated Returns portion:</span>
                <span className="text-[#41603B] font-semibold">
                  +${(projectionData[8].totalValue - projectionData[8].deposits).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleApplyAllocation}
              className="w-full py-3 px-4 rounded-lg bg-[#659B5E] hover:bg-[#52824c] text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Investment Plan</span>
            </button>
          </div>

          {/* Chart on Right (Col 7) */}
          <div className="lg:col-span-7">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="investTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#659B5E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#659B5E" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="investDeposits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="year" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#64748B" 
                    fontSize={11} 
                    tickLine={false}
                    tickFormatter={(val) => `$${val > 999 ? (val / 1000).toFixed(0) + 'k' : val}`}
                  />
                  <Tooltip 
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                    contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalValue" 
                    name="Total Portfolio Value" 
                    stroke="#41603B" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#investTotal)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="deposits" 
                    name="Cumulative Deposits" 
                    stroke="#64748B" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#investDeposits)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs text-[#64748B] pt-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#41603B]"></span>
                <span>Total Portfolio Value (Capital + Growth)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-[#64748B]"></span>
                <span>Principal Out-of-Pocket Deposits</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
