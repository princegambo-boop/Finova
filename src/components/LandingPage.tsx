import React from 'react';
import { 
  ArrowRight, 
  Wallet, 
  TrendingUp, 
  RefreshCw, 
  GraduationCap, 
  Star,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Footer } from './Footer';
import { FinovaLogo } from './FinovaLogo';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onNavigateTab,
}) => {
  const scrollToTools = () => {
    const el = document.getElementById('smart-tools-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-inter">
      
      {/* 1. HERO SECTION (White Background, Two-Column Layout) */}
      <section className="bg-white py-12 md:py-20 lg:py-24 border-b border-[#E2E8F0]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Pill, Serif Title, Body Text, Buttons */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Light-green pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0EA] border border-[#659B5E]/30 text-xs font-semibold tracking-wide text-[#41603B] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#659B5E]"></span>
                FINANCIAL FREEDOM BEGINS HERE
              </div>

              {/* Large dark navy heading */}
              <h1 
                id="landing-hero-heading" 
                className="font-heading font-extrabold text-[#1E293B] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.12]"
              >
                Master Your Money,<br />
                Shape Your Future
              </h1>

              {/* Supporting text underneath */}
              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl font-normal">
                Finova provides budgeting, micro-investing and currency tools designed to help you 
                take complete control of your personal and business wealth with intuitive precision.
              </p>

              {/* Two buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="hero-get-started-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="px-7 py-3.5 rounded-lg bg-[#659B5E] hover:bg-[#52824c] text-white font-semibold text-sm shadow-sm transition-all duration-150 flex items-center gap-2 active:scale-95"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-how-it-works-btn"
                  onClick={scrollToTools}
                  className="px-6 py-3.5 rounded-lg bg-white hover:bg-[#F8F9FA] text-[#1E293B] border border-[#CBD5E1] font-semibold text-sm transition-colors shadow-2xs"
                >
                  How it Works
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#64748B]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#659B5E]" />
                  <span>Free 30-day trial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#659B5E]" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#659B5E]" />
                  <span>Bank-grade 256-bit encryption</span>
                </div>
              </div>

            </div>

            {/* Right Column: Large rounded-corner REAL photographic image of woman using laptop */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Decorative subtle background blur */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#E8F0EA] to-transparent -z-10 opacity-70"></div>
                
                <div className="overflow-hidden rounded-2xl shadow-xl border border-[#E2E8F0] bg-slate-100 aspect-4/3 sm:aspect-16/11">
                  <img
                    id="hero-photographic-image"
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
                    alt="Professional woman using a laptop in a bright office"
                    className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Floating Metric Badge */}
                <div className="absolute -bottom-5 -left-4 sm:left-6 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-[#E2E8F0] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F0EA] flex items-center justify-center text-[#41603B]">
                    <TrendingUp className="w-5 h-5 text-[#659B5E]" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold">Average User Savings</div>
                    <div className="text-base font-bold text-[#1E293B]">+$420 / month</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SMART TOOLS SECTION (Very light gray/off-white background, 2x2 Grid) */}
      <section id="smart-tools-section" className="bg-[#F8F9FA] py-16 md:py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Centered Heading & Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#1E293B] tracking-tight">
              Smart tools tailored for you
            </h2>
            <p className="text-base sm:text-lg text-[#64748B]">
              Engineered with modern intelligence to automate tedious tasks, eliminate banking friction, 
              and accelerate your financial growth.
            </p>
          </div>

          {/* 4 Large Rounded Cards in a 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Smart Budgeting */}
            <div 
              id="tool-card-budgeting"
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-[#659B5E]/50 transition-all flex flex-col justify-between group"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Text & Icon Left */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] flex items-center justify-center text-[#41603B]">
                    <Wallet className="w-5 h-5 text-[#659B5E]" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-[#1E293B]">
                    Smart Budgeting
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Securely connect your bank accounts and monitor real-time income, recurring subscriptions, 
                    and categorization without spreadsheet upkeep.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigateTab('dashboard')}
                      className="text-xs font-semibold text-[#659B5E] group-hover:text-[#41603B] flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Dashboard</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
                {/* Image on Right */}
                <div className="sm:col-span-5">
                  <div className="rounded-xl overflow-hidden shadow-xs border border-[#E2E8F0] aspect-4/3 bg-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80" 
                      alt="Smart Budgeting on Mobile and Tablet"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Guided Investing */}
            <div 
              id="tool-card-investing"
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-[#659B5E]/50 transition-all flex flex-col justify-between group"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Text & Icon Left */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] flex items-center justify-center text-[#41603B]">
                    <TrendingUp className="w-5 h-5 text-[#659B5E]" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-[#1E293B]">
                    Guided Investing
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Start with micro-investing in globally diversified, low-cost ETF portfolios designed 
                    around your risk tolerance and long-term milestones.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigateTab('invest')}
                      className="text-xs font-semibold text-[#659B5E] group-hover:text-[#41603B] flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Guided Portfolios</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
                {/* Image on Right */}
                <div className="sm:col-span-5">
                  <div className="rounded-xl overflow-hidden shadow-xs border border-[#E2E8F0] aspect-4/3 bg-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80" 
                      alt="Guided Investing Market Analytics"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Real-Time Conversion */}
            <div 
              id="tool-card-conversion"
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-[#659B5E]/50 transition-all flex flex-col justify-between group"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Text & Icon Left */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] flex items-center justify-center text-[#41603B]">
                    <RefreshCw className="w-5 h-5 text-[#659B5E]" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-[#1E293B]">
                    Real-Time Conversion
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Convert 15+ major global currencies with true live interbank rates, transparent 
                    exchange breakdowns, and zero hidden markups.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigateTab('convert')}
                      className="text-xs font-semibold text-[#659B5E] group-hover:text-[#41603B] flex items-center gap-1 transition-colors"
                    >
                      <span>Open Currency Converter</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
                {/* Image on Right */}
                <div className="sm:col-span-5">
                  <div className="rounded-xl overflow-hidden shadow-xs border border-[#E2E8F0] aspect-4/3 bg-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=600&q=80" 
                      alt="Real-Time Global Currency Exchange"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Financial Education */}
            <div 
              id="tool-card-education"
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-[#659B5E]/50 transition-all flex flex-col justify-between group"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Text & Icon Left */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] flex items-center justify-center text-[#41603B]">
                    <GraduationCap className="w-5 h-5 text-[#659B5E]" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-[#1E293B]">
                    Financial Education
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Master personal finance with bite-sized masterclasses, personalized lessons, 
                    plain-English financial glossaries, and interactive guides.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigateTab('learn')}
                      className="text-xs font-semibold text-[#659B5E] group-hover:text-[#41603B] flex items-center gap-1 transition-colors"
                    >
                      <span>Start Learning Academy</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
                {/* Image on Right */}
                <div className="sm:col-span-5">
                  <div className="rounded-xl overflow-hidden shadow-xs border border-[#E2E8F0] aspect-4/3 bg-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" 
                      alt="Financial Education Masterclasses and Learning"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2.5 BRAND IDENTITY & DESIGN SYSTEM SPOTLIGHT */}
      <section className="bg-white py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0EA] border border-[#659B5E]/30 text-xs font-semibold tracking-wide text-[#41603B] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#659B5E]"></span>
              BRAND ARCHITECTURE & PRINCIPLES
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#1E293B] tracking-tight">
              Crafted for Trust, Solvency & Growth
            </h2>
            <p className="text-base text-[#64748B] font-normal max-w-2xl mx-auto">
              The FINOVA brandmark combines the letter <span className="font-semibold text-[#1E293B]">&ldquo;F&rdquo;</span> with parallel 45° upward growth vectors—symbolizing institutional solvency, smart capital allocation, and long-term compounding.
            </p>
          </div>

          {/* 3 Interactive Brand Context Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Card 1: Standard Brandmark on Light Background */}
            <div className="bg-[#F8F9FA] rounded-2xl p-7 border border-[#E2E8F0] flex flex-col items-center justify-between text-center transition-all hover:shadow-md">
              <div className="h-32 flex items-center justify-center w-full">
                <FinovaLogo theme="light-bg" size="lg" variant="standard" />
              </div>
              <div className="space-y-1.5 pt-4 border-t border-[#E2E8F0] w-full">
                <div className="text-xs font-bold uppercase tracking-wider text-[#41603B]">Primary Brandmark</div>
                <p className="text-xs text-[#64748B]">
                  Deep Navy (#1E293B) wordmark paired with Forest Pillar (#41603B) and Growth Green (#659B5E) vectors.
                </p>
              </div>
            </div>

            {/* Card 2: High-Contrast Dark Interface */}
            <div className="bg-[#133320] rounded-2xl p-7 border border-[#1A422B] flex flex-col items-center justify-between text-center transition-all hover:shadow-md text-white">
              <div className="h-32 flex items-center justify-center w-full">
                <FinovaLogo theme="dark-bg" size="lg" variant="standard" />
              </div>
              <div className="space-y-1.5 pt-4 border-t border-white/10 w-full">
                <div className="text-xs font-bold uppercase tracking-wider text-[#86EFAC]">Command Dark Theme</div>
                <p className="text-xs text-slate-300">
                  Crisp White pillar with Primary Green and luminous Mint highlight (#86EFAC) on deep forest green.
                </p>
              </div>
            </div>

            {/* Card 3: Mobile App Icon Squircle */}
            <div className="bg-[#0F172A] rounded-2xl p-7 border border-[#334155] flex flex-col items-center justify-between text-center transition-all hover:shadow-md text-white">
              <div className="h-32 flex items-center justify-center w-full">
                <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-white/15 shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
                  <FinovaLogo theme="dark-bg" size="md" variant="symbol-only" />
                </div>
              </div>
              <div className="space-y-1.5 pt-4 border-t border-white/10 w-full">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-200">Mobile App Icon</div>
                <p className="text-xs text-slate-400">
                  Engineered on a 48×48 grid with 45° parallel vectors, delivering instant recognition on iOS and Android.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMMUNITY / TESTIMONIAL SECTION (Very light green background) */}
      <section className="bg-[#EBF4EC] py-16 md:py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Centered dark/green heading & subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#41603B] tracking-tight">
              Real stories from our community
            </h2>
            <p className="text-base sm:text-lg text-[#1E293B]/80 font-normal">
              Hear how everyday savers, creators, and business builders gained clarity and confidence with Finova.
            </p>
          </div>

          {/* Two large white rounded testimonial cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Card 1 */}
            <div 
              id="testimonial-card-1"
              className="bg-white rounded-2xl p-7 sm:p-9 shadow-sm border border-[#659B5E]/20 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {/* Testimonial text */}
                <p className="text-base sm:text-lg text-[#1E293B] leading-relaxed italic font-normal">
                  &ldquo;Finova transformed how I look at my monthly spending. The automated categorizations 
                  and guided ETF portfolios helped me save my first $25,000 without feeling restricted. 
                  It feels like having a private wealth planner right in my pocket.&rdquo;
                </p>
              </div>

              {/* Author details */}
              <div className="pt-6 mt-6 border-t border-[#E2E8F0] flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Sarah Jenkins"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#659B5E]/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-semibold text-sm text-[#1E293B]">Sarah Jenkins</h4>
                  <p className="text-xs text-[#64748B]">Senior UX Designer & Freelancer, Age 29</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              id="testimonial-card-2"
              className="bg-white rounded-2xl p-7 sm:p-9 shadow-sm border border-[#659B5E]/20 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {/* Testimonial text */}
                <p className="text-base sm:text-lg text-[#1E293B] leading-relaxed italic font-normal">
                  &ldquo;Managing multi-currency contractor payouts used to be our biggest monthly headache. 
                  With Finova&apos;s real-time conversion and transparent fees, our team saved thousands in wire 
                  spreads, and the financial masterclasses helped our whole team become smarter with equity.&rdquo;
                </p>
              </div>

              {/* Author details */}
              <div className="pt-6 mt-6 border-t border-[#E2E8F0] flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  alt="David Kim"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#659B5E]/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-semibold text-sm text-[#1E293B]">David Kim</h4>
                  <p className="text-xs text-[#64748B]">Digital Agency Founder, Age 35</p>
                </div>
              </div>
            </div>

          </div>

          {/* Call to action bar in testimonial section */}
          <div className="mt-14 max-w-4xl mx-auto text-center bg-white/95 backdrop-blur-xs rounded-3xl p-8 sm:p-12 border border-[#659B5E]/30 shadow-md flex flex-col items-center">
            <div className="mb-4">
              <FinovaLogo 
                variant="stacked" 
                size="lg" 
                theme="light-bg" 
                showTagline={true} 
              />
            </div>
            <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#1E293B] mb-3">
              Ready to start your financial journey?
            </h3>
            <p className="text-sm text-[#64748B] max-w-xl mx-auto mb-6">
              Create your account in under two minutes and access smart budgeting, guided portfolios, and real-time conversion today.
            </p>
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-8 py-3.5 rounded-lg bg-[#659B5E] hover:bg-[#52824c] text-white font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              Create Free Account
            </button>
          </div>

        </div>
      </section>

      {/* 4. DARK NAVY FOOTER */}
      <Footer onNavigateTab={onNavigateTab} />

    </div>
  );
};
