import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  ChevronRight, 
  PieChart as PieIcon,
  Globe2,
  Building2,
  Home,
  Coins,
  ShieldCheck,
  ArrowRightLeft,
  ArrowDownRight,
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Account, Transaction, CashFlowPoint, CategorySpend, User } from '../types';
import { FinovaAvatar } from './FinovaAvatar';

interface DashboardViewProps {
  accounts: Account[];
  transactions: Transaction[];
  cashFlowHistory: CashFlowPoint[];
  categorySpends: CategorySpend[];
  currentUser?: User | null;
  onNavigateTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenTransferModal?: () => void;
  onOpenAddAccountModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  accounts,
  transactions,
  cashFlowHistory,
  categorySpends,
  currentUser,
  onNavigateTab,
  onOpenAddModal,
  onOpenAddAccountModal,
}) => {
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '3M' | '1Y' | 'ALL'>('1Y');

  // Real accounts balance from Firestore
  const userLiquidTotal = useMemo(() => {
    return accounts.reduce((acc, a) => acc + (a.type !== 'credit' ? a.balance : 0), 0);
  }, [accounts]);

  // If user has accounts, use user's real balance, otherwise show the reference default baseline
  const displayPortfolioValue = accounts.length > 0 ? userLiquidTotal : 12450.00;
  const isRealData = accounts.length > 0;

  // 12-month historical performance data matching reference curve
  const performanceChartData = useMemo(() => {
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    // Scale curve to the actual portfolio value or benchmark
    const baseMultiplier = displayPortfolioValue / 12450;
    const rawCurve = [
      5800, 6200, 6400, 7100, 6900, 7600, 7400, 8300, 8700, 9900, 10800, 12450
    ];

    return months.map((month, idx) => ({
      month,
      value: Math.round(rawCurve[idx] * (baseMultiplier > 0 ? baseMultiplier : 1)),
    }));
  }, [displayPortfolioValue]);

  // Asset allocation matching reference design percentages: Stocks 45%, Bonds 25%, ETFs 20%, Crypto 10%
  const assetAllocationData = [
    { name: 'Stocks', value: 45, color: '#22C55E' },
    { name: 'Bonds', value: 25, color: '#3B82F6' },
    { name: 'ETFs', value: 20, color: '#8B5CF6' },
    { name: 'Crypto', value: 10, color: '#F59E0B' },
  ];

  // Benchmark market highlights as shown in reference image
  const marketHighlights = [
    { symbol: 'S&P 500', code: 'SPY', price: '$564.20', change: '+1.2%', positive: true, icon: TrendingUp, color: '#3B82F6' },
    { symbol: 'Nasdaq 100', code: 'NSDQ', price: '$19,420.50', change: '+2.4%', positive: true, icon: TrendingUp, color: '#6366F1' },
    { symbol: 'Gold', code: 'GLD', price: '$240.80', change: '-0.4%', positive: false, icon: ArrowDownRight, color: '#F59E0B' },
    { symbol: 'Bitcoin', code: 'BTC', price: '$64,280.00', change: '+5.8%', positive: true, icon: Coins, color: '#F97316' },
  ];

  // Dynamic values for segments
  const equityValue = (displayPortfolioValue * 0.45).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const bondValue = (displayPortfolioValue * 0.25).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const etfValue = (displayPortfolioValue * 0.20).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cryptoValue = (displayPortfolioValue * 0.10).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div id="dashboard-view-container" className="space-y-8">
      
      {/* 
        ========================================================================
        1. HERO BANNER (Directly matched to reference image)
        ========================================================================
      */}
      <div 
        id="dashboard-hero-banner"
        className="relative overflow-hidden rounded-3xl bg-[#0F2819] shadow-md border border-[#1C462C]"
      >
        {/* Panoramic Landscape Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
            alt="Scenic Mountain Valley and City Horizon"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-65 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C2416]/95 via-[#0E2C1B]/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Text & CTA */}
          <div className="max-w-xl space-y-3.5">
            <div className="flex flex-wrap items-center gap-3">
              {currentUser && (
                <button
                  type="button"
                  id="dashboard-hero-profile-pill"
                  onClick={() => onNavigateTab('profile')}
                  className="inline-flex items-center gap-2 p-1 pr-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-left cursor-pointer group backdrop-blur-xs"
                  title="Manage your profile & avatar"
                >
                  <FinovaAvatar user={currentUser} size="xs" />
                  <span className="text-xs font-semibold text-white">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#86EFAC] group-hover:translate-x-0.5 transition-transform font-bold">
                    Edit Profile →
                  </span>
                </button>
              )}
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#86EFAC] uppercase">
                {currentUser ? 'Financial Intelligence Dashboard' : 'Good morning,'}
              </span>
            </div>

            <h1 className="font-young-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Build your financial future
            </h1>
            <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-lg">
              Make smarter decisions with the right tools, insights and strategies — all in one place.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-start-investing-btn"
                onClick={() => onNavigateTab('invest')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#659B5E] hover:bg-[#53854d] text-white text-sm font-semibold shadow-md transition-all hover:scale-102 active:scale-95 cursor-pointer"
              >
                <span>Start Investing</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {onOpenAddAccountModal && (
                <button
                  id="hero-connect-account-btn"
                  onClick={onOpenAddAccountModal}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm font-medium backdrop-blur-xs border border-white/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{accounts.length > 0 ? 'Link Another Account' : 'Link Account'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Floating Card: Your Total Portfolio Value */}
          <div 
            id="hero-portfolio-floating-card"
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl border border-white/60 max-w-sm w-full self-start lg:self-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Your Total Portfolio Value
              </div>
            </div>

            <div className="mt-3">
              <div className="font-young-serif text-3xl sm:text-4xl text-[#1E293B]">
                ${displayPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              
              <div className="mt-2.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>12.4% YTD</span>
                </span>
                {isRealData ? (
                  <span className="text-xs text-[#64748B] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>{accounts.length} Accounts Synced</span>
                  </span>
                ) : (
                  <span className="text-xs text-[#64748B]">Baseline Portfolio Model</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        2. MAIN TWO-COLUMN LAYOUT (Left 8 cols, Right 4 cols)
        ========================================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ======================= LEFT COLUMN (8 Cols) ======================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Card 1: Portfolio Value Chart Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#E8F0EA] flex items-center justify-center text-[#41603B]">
                  <TrendingUp className="w-4 h-4 text-[#659B5E]" />
                </div>
                <h3 className="font-young-serif text-xl text-[#1E293B]">
                  Portfolio Value
                </h3>
              </div>

              {/* Timeframe Buttons */}
              <div className="flex items-center gap-1 bg-[#F8F9FA] p-1 rounded-xl border border-[#E2E8F0] text-xs self-start sm:self-auto">
                {(['1W', '1M', '3M', '1Y', 'ALL'] as const).map((t) => {
                  const isActive = timeframe === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        isActive
                          ? 'bg-[#DCFCE7] text-[#15803D] font-bold shadow-2xs'
                          : 'text-[#64748B] hover:text-[#1E293B]'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Balance Headline */}
            <div className="flex items-baseline gap-3">
              <span className="font-young-serif text-3xl sm:text-4xl text-[#1E293B]">
                ${displayPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>12.4% YTD</span>
              </span>
            </div>

            {/* Line / Area Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="finovaGreenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#659B5E" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#659B5E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis 
                    dataKey="month" 
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
                    tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip 
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Value']}
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderColor: '#E2E8F0', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#659B5E" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#finovaGreenGradient)" 
                    dot={{ fill: '#659B5E', r: 3.5, stroke: '#FFFFFF', strokeWidth: 2 }}
                    activeDot={{ fill: '#41603B', r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2: Portfolio Segments 2x2 Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8F0EA] flex items-center justify-center text-[#659B5E]">
                  <Globe2 className="w-4 h-4" />
                </div>
                <h3 className="font-young-serif text-xl text-[#1E293B]">
                  Portfolio Segments
                </h3>
              </div>
              <button 
                onClick={() => onNavigateTab('invest')}
                className="text-xs font-semibold text-[#659B5E] hover:text-[#41603B] flex items-center gap-1"
              >
                <span>Customize Allocation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Segment 1: Global Equities */}
              <div 
                onClick={() => onNavigateTab('invest')}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md hover:border-[#659B5E]/40 transition-all cursor-pointer flex items-center justify-between overflow-hidden group"
              >
                <div className="space-y-1.5 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E8F0EA] flex items-center justify-center text-[#41603B] group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-4 h-4 text-[#659B5E]" />
                    </div>
                    <span className="text-xs font-semibold text-[#64748B]">Global Equities</span>
                  </div>
                  <div className="font-young-serif text-2xl text-[#1E293B] pt-1">
                    ${equityValue}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs text-[#16A34A] font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>14.8%</span>
                  </div>
                </div>

                {/* Real Metropolitan Skyline Photo */}
                <div className="w-28 h-20 rounded-xl overflow-hidden shadow-2xs shrink-0 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80"
                    alt="Global Equities Skyscrapers"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Segment 2: Government Bonds */}
              <div 
                onClick={() => onNavigateTab('invest')}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md hover:border-[#659B5E]/40 transition-all cursor-pointer flex items-center justify-between overflow-hidden group"
              >
                <div className="space-y-1.5 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E8F0EA] flex items-center justify-center text-[#41603B] group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-4 h-4 text-[#659B5E]" />
                    </div>
                    <span className="text-xs font-semibold text-[#64748B]">Government Bonds</span>
                  </div>
                  <div className="font-young-serif text-2xl text-[#1E293B] pt-1">
                    ${bondValue}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs text-[#16A34A] font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>3.2%</span>
                  </div>
                </div>

                {/* Classical Treasury Neoclassical Columns Photo */}
                <div className="w-28 h-20 rounded-xl overflow-hidden shadow-2xs shrink-0 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80"
                    alt="Government Treasury Building"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Segment 3: Real Estate ETFs */}
              <div 
                onClick={() => onNavigateTab('invest')}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md hover:border-[#659B5E]/40 transition-all cursor-pointer flex items-center justify-between overflow-hidden group"
              >
                <div className="space-y-1.5 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E8F0EA] flex items-center justify-center text-[#41603B] group-hover:scale-105 transition-transform">
                      <Home className="w-4 h-4 text-[#659B5E]" />
                    </div>
                    <span className="text-xs font-semibold text-[#64748B]">Real Estate ETFs</span>
                  </div>
                  <div className="font-young-serif text-2xl text-[#1E293B] pt-1">
                    ${etfValue}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs text-[#16A34A] font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>8.4%</span>
                  </div>
                </div>

                {/* Modern Architectural Real Estate Photo */}
                <div className="w-28 h-20 rounded-xl overflow-hidden shadow-2xs shrink-0 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80"
                    alt="Modern Real Estate Architecture"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Segment 4: Cryptocurrencies */}
              <div 
                onClick={() => onNavigateTab('invest')}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md hover:border-[#659B5E]/40 transition-all cursor-pointer flex items-center justify-between overflow-hidden group"
              >
                <div className="space-y-1.5 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E8F0EA] flex items-center justify-center text-[#41603B] group-hover:scale-105 transition-transform">
                      <Coins className="w-4 h-4 text-[#659B5E]" />
                    </div>
                    <span className="text-xs font-semibold text-[#64748B]">Cryptocurrencies</span>
                  </div>
                  <div className="font-young-serif text-2xl text-[#1E293B] pt-1">
                    ${cryptoValue}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs text-[#16A34A] font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>32.1%</span>
                  </div>
                </div>

                {/* Real Golden Bitcoin / Crypto Photo */}
                <div className="w-28 h-20 rounded-xl overflow-hidden shadow-2xs shrink-0 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"
                    alt="Digital Currency Assets"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Card 3: Financial Knowledge Banner */}
          <div className="rounded-2xl bg-[#0F2819] p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-[#1A422B] shadow-sm">
            <div className="flex items-center gap-4">
              {/* Botanical Leaves Thumbnail Photo */}
              <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden shadow-2xs shrink-0 border border-white/15">
                <img
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=300&q=80"
                  alt="Fresh Green Leaves"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <h4 className="font-young-serif text-base sm:text-lg text-white">
                  Financial knowledge builds freedom
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                  Explore our learning resources, guides and tutorials to make better financial decisions.
                </p>
              </div>
            </div>

            <button
              id="dash-visit-learn-btn"
              onClick={() => onNavigateTab('learn')}
              className="px-5 py-2.5 rounded-full bg-[#659B5E] hover:bg-[#52824c] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all shrink-0 self-start sm:self-center flex items-center gap-1.5"
            >
              <span>Visit Learn</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Connected User Accounts & Ledger Quick Access (Preserves User's Real Firebase Data) */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="font-young-serif text-lg text-[#1E293B]">
                  Your Connected Accounts
                </h3>
                <p className="text-xs text-[#64748B]">
                  Manage institutions, liquid balances, and view your real recorded entries.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {onOpenAddAccountModal && (
                  <button
                    onClick={onOpenAddAccountModal}
                    className="px-3 py-1.5 text-xs font-semibold text-[#1E293B] bg-white border border-[#E2E8F0] hover:bg-[#F8F9FA] rounded-lg transition-colors flex items-center gap-1"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#659B5E]" />
                    <span>Manage Accounts</span>
                  </button>
                )}
                <button
                  onClick={onOpenAddModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#659B5E] hover:bg-[#41603B] rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Entry</span>
                </button>
              </div>
            </div>

            {accounts.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-[#64748B]">
                  You have not connected any custom bank accounts or cards yet.
                </p>
                {onOpenAddAccountModal && (
                  <button
                    onClick={onOpenAddAccountModal}
                    className="text-xs font-semibold text-[#659B5E] hover:underline"
                  >
                    + Link your first account to sync real balances
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {accounts.map((acc) => (
                  <div key={acc.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8F9FA] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-8 rounded-full" style={{ backgroundColor: acc.color }} />
                      <div>
                        <div className="text-xs font-semibold text-[#1E293B]">{acc.name}</div>
                        <div className="text-[10px] text-[#64748B]">{acc.institution} • {acc.accountNumberMask}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-[#1E293B]">
                        ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-[#16A34A] font-medium">Synced</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ======================= RIGHT COLUMN (4 Cols) ======================= */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* 1. Asset Allocation Donut Chart */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8F0EA] flex items-center justify-center text-[#659B5E]">
                  <PieIcon className="w-4 h-4" />
                </div>
                <h3 className="font-young-serif text-lg text-[#1E293B]">
                  Asset Allocation
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('invest')}
                className="text-xs font-semibold text-[#659B5E] hover:text-[#41603B] flex items-center gap-0.5"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Donut Chart with Centered Hole */}
            <div className="relative h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocationData}
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {assetAllocationData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-young-serif text-2xl text-[#1E293B]">100%</span>
                <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">Allocated</span>
              </div>
            </div>

            {/* Clean Legend Breakdown */}
            <div className="space-y-2.5 pt-1">
              {assetAllocationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-[#1E293B]">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#1E293B]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. "Grow your wealth with smart decisions" Promo Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0F291B] via-[#163824] to-[#1C462C] p-6 text-white relative overflow-hidden shadow-sm border border-[#1A422B]">
            <div className="relative z-10 max-w-[200px] space-y-2">
              <h4 className="font-young-serif text-lg text-white leading-snug">
                Grow your wealth with smart decisions
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Access real-time insights, expert tools and personalized strategies.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigateTab('invest')}
                  className="px-4 py-2 rounded-full bg-[#659B5E] hover:bg-[#52824c] text-xs font-semibold text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Explore Investments</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Real Smartphone Financial Graphic Asset */}
            <div className="absolute -right-4 -bottom-4 w-36 h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform rotate-[-4deg]">
              <img
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80"
                alt="Fintech App on Mobile Phone"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 3. Market Highlights Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8F0EA] flex items-center justify-center text-[#659B5E]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-young-serif text-lg text-[#1E293B]">
                  Market Highlights
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('convert')}
                className="text-xs font-semibold text-[#659B5E] hover:text-[#41603B] flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {marketHighlights.map((item) => (
                <div key={item.symbol} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-[10px] shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.code.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1E293B]">{item.symbol}</div>
                      <div className="text-[10px] text-[#64748B] font-mono">({item.code})</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-[#1E293B] font-mono">{item.price}</div>
                    <div className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                      item.positive ? 'text-[#16A34A]' : 'text-[#DC2626]'
                    }`}>
                      {item.positive ? '↑' : '↓'} {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
