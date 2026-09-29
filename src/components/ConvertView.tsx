import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Clock, 
  Copy, 
  Check,
  TrendingUp,
  Globe2,
  Plane,
  Building2,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Account } from '../types';

interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateAgainstUSD: number;
  flag: string;
}

interface ConvertViewProps {
  accounts?: Account[];
}

const SUPPORTED_CURRENCIES: CurrencyRate[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateAgainstUSD: 1.0, flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', rateAgainstUSD: 0.92, flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateAgainstUSD: 0.79, flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateAgainstUSD: 148.5, flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateAgainstUSD: 1.36, flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateAgainstUSD: 1.52, flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rateAgainstUSD: 0.88, flag: '🇨🇭' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rateAgainstUSD: 129.4, flag: '🇰🇪' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rateAgainstUSD: 1540.0, flag: '🇳🇬' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rateAgainstUSD: 18.2, flag: '🇿🇦' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateAgainstUSD: 83.9, flag: '🇮🇳' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rateAgainstUSD: 1.34, flag: '🇸🇬' },
];

export const ConvertView: React.FC<ConvertViewProps> = ({ accounts = [] }) => {
  const [amount, setAmount] = useState<number>(1000);
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('EUR');
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedTipId, setSelectedTipId] = useState<string | null>(null);

  const liquidAccounts = accounts.filter(a => a.type !== 'credit');
  const availableBalance = liquidAccounts.reduce((acc, a) => acc + a.availableBalance, 0);
  const hasAccounts = liquidAccounts.length > 0;

  const fromCurrency = SUPPORTED_CURRENCIES.find(c => c.code === fromCode) || SUPPORTED_CURRENCIES[0];
  const toCurrency = SUPPORTED_CURRENCIES.find(c => c.code === toCode) || SUPPORTED_CURRENCIES[1];

  // Calculate conversion rate: (toRate / fromRate)
  const exchangeRate = toCurrency.rateAgainstUSD / fromCurrency.rateAgainstUSD;
  const convertedAmount = amount * exchangeRate;

  // Comparison savings calculation
  const finovaFee = amount * 0.001; // 0.1%
  const bankFee = amount * 0.035; // 3.5%
  const estimatedSavings = bankFee - finovaFee;

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(`${convertedAmount.toFixed(2)} ${toCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectPair = (from: string, to: string) => {
    setFromCode(from);
    setToCode(to);
    const container = document.getElementById('converter-main-card');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 14-day historical trend for selected pair
  const trendDays = Array.from({ length: 14 }).map((_, i) => {
    const day = 14 - i;
    const variance = (Math.sin(i * 0.8) * 0.015) + (Math.cos(i * 0.4) * 0.01);
    const dayRate = exchangeRate * (1 - variance);
    return {
      date: `Sep ${day}`,
      rate: Number(dayRate.toFixed(4)),
    };
  });

  const popularCorridors = [
    {
      from: 'USD',
      to: 'EUR',
      title: 'Transatlantic & European Travel',
      subtitle: 'Eurozone commerce, student tuition & vacation exchanges',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
      flagA: '🇺🇸',
      flagB: '🇪🇺',
      rate: (SUPPORTED_CURRENCIES.find(c => c.code === 'EUR')!.rateAgainstUSD / SUPPORTED_CURRENCIES.find(c => c.code === 'USD')!.rateAgainstUSD).toFixed(4),
    },
    {
      from: 'USD',
      to: 'JPY',
      title: 'Tokyo & East Asian Tourism',
      subtitle: 'Favorable yen tourist purchasing power & business trade',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
      flagA: '🇺🇸',
      flagB: '🇯🇵',
      rate: (SUPPORTED_CURRENCIES.find(c => c.code === 'JPY')!.rateAgainstUSD / SUPPORTED_CURRENCIES.find(c => c.code === 'USD')!.rateAgainstUSD).toFixed(2),
    },
    {
      from: 'USD',
      to: 'GBP',
      title: 'London & UK Financial Hub',
      subtitle: 'British sterling cross-border settlements & travel booking',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
      flagA: '🇺🇸',
      flagB: '🇬🇧',
      rate: (SUPPORTED_CURRENCIES.find(c => c.code === 'GBP')!.rateAgainstUSD / SUPPORTED_CURRENCIES.find(c => c.code === 'USD')!.rateAgainstUSD).toFixed(4),
    },
    {
      from: 'USD',
      to: 'CAD',
      title: 'North American Cross-Border',
      subtitle: 'Seamless bilateral personal remittances and commerce',
      image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&q=80',
      flagA: '🇺🇸',
      flagB: '🇨🇦',
      rate: (SUPPORTED_CURRENCIES.find(c => c.code === 'CAD')!.rateAgainstUSD / SUPPORTED_CURRENCIES.find(c => c.code === 'USD')!.rateAgainstUSD).toFixed(4),
    },
  ];

  return (
    <div id="convert-view-container" className="space-y-8">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0EA] text-[#41603B] text-xs font-semibold mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#659B5E]" />
            <span>Global Currency Exchange</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl text-[#1E293B]">
            Real-Time Currency Conversion
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Convert between 12 major international currencies with live exchange rate estimates, 0.1% flat transparency, and zero hidden retail bank markups.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#64748B] bg-white px-3.5 py-2 rounded-xl border border-[#E2E8F0] shadow-2xs self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>Rates updated: <strong className="text-[#1E293B]">Live Mid-Market</strong></span>
        </div>
      </div>

      {/* Main Hero Visual Card with Real International Travel/Currency Photography */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="p-6 sm:p-8 lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F0EA] text-[#41603B] text-xs font-semibold">
              <Globe2 className="w-3.5 h-3.5 text-[#659B5E]" />
              <span>International Banking Standard</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#1E293B] leading-tight">
              Fair, Transparent Exchange for Global Living
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed max-w-xl">
              Whether you are funding international travel, paying overseas contractors, or managing multi-currency savings, Finova provides true mid-market exchange rates without predatory retail bank spreads.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#64748B]">
              <div className="flex items-center gap-1.5 font-medium text-[#1E293B]">
                <ShieldCheck className="w-4 h-4 text-[#659B5E]" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-[#1E293B]">
                <Plane className="w-4 h-4 text-[#659B5E]" />
                <span>Traveler Protected</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-[#1E293B]">
                <Building2 className="w-4 h-4 text-[#659B5E]" />
                <span>12 Major Currencies</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 h-52 sm:h-64 lg:h-full relative overflow-hidden bg-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1000&q=80" 
              alt="International currencies, passports, and global banking travel assets"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-4 text-white text-xs font-medium lg:hidden">
              Live mid-market conversion feed
            </div>
          </div>
        </div>
      </div>

      {/* Main Conversion Interactive Card */}
      <div id="converter-main-card" className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Quick Amount Preset Chips */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#F1F5F9]">
          <span className="text-xs font-semibold text-[#64748B]">Quick Amount Presets:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {[250, 500, 1000, 2500, 5000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  amount === preset
                    ? 'bg-[#659B5E] text-white shadow-2xs'
                    : 'bg-[#F8F9FA] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1E293B]'
                }`}
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Amount & From Currency (Col 5) */}
          <div className="lg:col-span-5 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
              You Convert
            </label>
            <div className="flex rounded-xl border border-[#CBD5E1] focus-within:ring-2 focus-within:ring-[#659B5E]/20 focus-within:border-[#659B5E] bg-white overflow-hidden transition-all">
              <input
                id="convert-amount-input"
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 text-lg font-semibold text-[#1E293B] focus:outline-hidden"
              />
              <select
                id="convert-from-select"
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                className="bg-[#F8F9FA] px-4 py-3 font-semibold text-sm border-l border-[#CBD5E1] text-[#1E293B] focus:outline-hidden cursor-pointer"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-[#64748B] flex items-center justify-between">
              <span>{fromCurrency.name}</span>
              <span>
                {hasAccounts
                  ? `Linked Balance: $${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : 'Balance: $0.00 (No linked accounts)'}
              </span>
            </div>
          </div>

          {/* Swap Button Center (Col 2) */}
          <div className="lg:col-span-2 flex justify-center py-2">
            <button
              id="convert-swap-btn"
              type="button"
              onClick={handleSwap}
              aria-label="Swap currencies"
              className="w-12 h-12 rounded-full bg-[#E8F0EA] hover:bg-[#659B5E] text-[#41603B] hover:text-white transition-colors flex items-center justify-center shadow-xs border border-[#659B5E]/20 group active:scale-95"
            >
              <ArrowRightLeft className="w-5 h-5 transition-transform group-hover:rotate-180 duration-300" />
            </button>
          </div>

          {/* Result & To Currency (Col 5) */}
          <div className="lg:col-span-5 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
              You Receive (Estimated)
            </label>
            <div className="flex rounded-xl border border-[#CBD5E1] bg-[#F8F9FA] overflow-hidden">
              <div className="w-full px-4 py-3 text-lg font-bold text-[#1E293B] flex items-center justify-between">
                <span>{convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <button
                  onClick={handleCopyResult}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                  title="Copy amount"
                >
                  {copied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <select
                id="convert-to-select"
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                className="bg-[#F8F9FA] px-4 py-3 font-semibold text-sm border-l border-[#CBD5E1] text-[#1E293B] focus:outline-hidden cursor-pointer"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-[#64748B] flex items-center justify-between">
              <span>{toCurrency.name}</span>
              <span className="font-semibold text-[#41603B]">
                1 {fromCode} = {exchangeRate.toFixed(4)} {toCode}
              </span>
            </div>
          </div>

        </div>

        {/* Rate Transparency Bar */}
        <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B]">
              Market Exchange Rate
            </span>
            <div className="text-base font-bold text-[#1E293B]">
              1 {fromCode} = {exchangeRate.toFixed(4)} {toCode}
            </div>
            <p className="text-[11px] text-[#64748B]">Mid-market interbank benchmark without markup.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#E8F0EA] border border-[#659B5E]/30 space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#41603B]">
              Finova Fee (0.1%)
            </span>
            <div className="text-base font-bold text-[#41603B]">
              ${finovaFee.toFixed(2)} USD
            </div>
            <p className="text-[11px] text-[#41603B]">Guaranteed transparent flat rate with zero surprise deductions.</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#16A34A]">
              Estimated Savings vs Traditional Banks
            </span>
            <div className="text-base font-bold text-[#16A34A]">
              +${estimatedSavings.toFixed(2)} USD
            </div>
            <p className="text-[11px] text-[#64748B]">High-street banks charge an average 3.0% – 4.5% foreign exchange spread.</p>
          </div>
        </div>

      </div>

      {/* Historical Trend Chart for Selected Pair */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-heading text-xl text-[#1E293B]">
              14-Day Rate Trend ({fromCode} / {toCode})
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Daily closing interbank rates over the past two weeks.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0EA] text-[#41603B] text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-[#659B5E]" />
            <span>Market Analysis</span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendDays} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={11} 
                tickLine={false} 
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val: any) => [`${val} ${toCode}`, 'Rate']}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#659B5E" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#41603B' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* VISUAL SECTION 1: Major Global Travel & Commerce Corridors (4 Photographic Cards) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading text-xl text-[#1E293B]">
              Popular Travel & Cross-Border Corridors
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Key international destinations with one-click pair loading into your conversion calculator.
            </p>
          </div>
          <span className="text-xs text-[#41603B] font-semibold bg-[#E8F0EA] px-3 py-1 rounded-full self-start sm:self-auto">
            High-Volume Corridors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCorridors.map((item) => (
            <div
              key={`${item.from}-${item.to}`}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="h-36 relative overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
                  <span>{item.flagA} {item.from}</span>
                  <span>→</span>
                  <span>{item.flagB} {item.to}</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-heading text-sm text-[#1E293B] font-semibold">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1 leading-snug">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#64748B] block">Current Rate</span>
                    <span className="text-xs font-bold text-[#1E293B]">
                      1 {item.from} = {item.rate} {item.to}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSelectPair(item.from, item.to)}
                    className="px-3 py-1.5 rounded-lg bg-[#E8F0EA] hover:bg-[#659B5E] text-[#41603B] hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Convert</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VISUAL SECTION 2: Realistic Finance & International Travel Advice (2 Photography Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card A: Travel Card & Overseas Spending */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
          <div className="h-44 relative overflow-hidden bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=700&q=80"
              alt="Person paying abroad using modern contactless debit card"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 bg-[#133320]/80 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-[#659B5E]" />
              <span>International Travel Tip</span>
            </div>
          </div>

          <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-heading text-lg text-[#1E293B]">
                Always Pay in the Local Foreign Currency
              </h4>
              <p className="text-xs text-[#64748B] leading-relaxed mt-1">
                When swiping your card or using ATMs abroad, merchant payment terminals often prompt: <em>&quot;Charge in your home currency?&quot;</em> Always select the <strong>local currency</strong>. Accepting terminal conversion (DCC) introduces hidden 4.5% to 8.0% foreign exchange markups.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Terminal DCC Markup: <strong className="text-red-600">~6.5%</strong></span>
              <span className="text-[#41603B] font-semibold">Finova Rate: <strong>0.1%</strong></span>
            </div>
          </div>
        </div>

        {/* Card B: Remote Work & Global Business Banking */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
          <div className="h-44 relative overflow-hidden bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=700&q=80"
              alt="Professional banking and managing international wire transfers"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 bg-[#133320]/80 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#659B5E]" />
              <span>Cross-Border Business</span>
            </div>
          </div>

          <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-heading text-lg text-[#1E293B]">
                Eliminate Intermediary SWIFT Wire Deductions
              </h4>
              <p className="text-xs text-[#64748B] leading-relaxed mt-1">
                Traditional retail banking wires pass through correspondent institutions that each take a $15–$30 processing cut on top of wide exchange spreads. Finova settles transfers via local banking networks at direct mid-market parity.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Avg Wire Deductions: <strong className="text-red-600">-$45 USD</strong></span>
              <span className="text-[#41603B] font-semibold">Direct Routing: <strong>$0 deduction</strong></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
