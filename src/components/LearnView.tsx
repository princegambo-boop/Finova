import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Clock, 
  Award, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  RotateCcw,
  Sparkles,
  Layers,
  TrendingUp,
  ShieldCheck,
  Percent
} from 'lucide-react';

interface LessonSection {
  stepNumber: number;
  title: string;
  subtitle: string;
  body: string[];
  callout?: {
    label: string;
    text: string;
  };
  metrics?: { label: string; value: string; desc: string }[];
}

interface Lesson {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  image: string;
  sections: LessonSection[];
}

const LESSONS: Lesson[] = [
  {
    id: 'les-1',
    title: 'The 50/30/20 Rule: Modern Cash Flow Partitioning',
    category: 'Budgeting & Foundations',
    duration: '8 mins',
    level: 'Beginner',
    summary: 'Master the fundamental ratio of Needs, Wants, and Wealth Accumulation with practical banking setups.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    sections: [
      {
        stepNumber: 1,
        title: 'Core Philosophy & Partitioning',
        subtitle: 'Understanding the 50/30/20 allocation framework',
        body: [
          'The 50/30/20 rule is an intuitive cash flow architecture popularised to eliminate budgeting anxiety without tedious line-item tracking.',
          'Instead of tracking every coffee purchase, you partition your total net (after-tax) income into three distinct functional pools:',
          '1. 50% Essential Needs: Non-negotiable survival expenses (housing, utilities, groceries, healthcare, minimum debt obligations).',
          '2. 30% Discretionary Wants: Lifestyle expenses that enrich your daily life (dining out, streaming services, travel, hobbies).',
          '3. 20% Financial Freedom & Savings: High-yield emergency funds, index fund investments, and accelerated debt payoff.',
        ],
        callout: {
          label: 'Rule of Thumb',
          text: 'If your essential needs exceed 50% due to high local rent, reduce wants to 20% to keep your 20% savings target intact.',
        },
        metrics: [
          { label: '50% Needs', value: 'Essentials Only', desc: 'Rent, groceries, utilities' },
          { label: '30% Wants', value: 'Lifestyle Pool', desc: 'Dining, travel, hobbies' },
          { label: '20% Savings', value: 'Future Wealth', desc: 'Investments & emergency fund' },
        ],
      },
      {
        stepNumber: 2,
        title: 'Real-World Numbers: A $4,000 Net Income Case',
        subtitle: 'Putting the formula into practical dollar amounts',
        body: [
          'Let us inspect a concrete example with an individual earning $4,000 net monthly income:',
          '• Needs ($2,000 / month): $1,400 rent/mortgage + $350 groceries + $150 basic utilities + $100 transit.',
          '• Wants ($1,200 / month): $400 weekend dining + $200 recreation + $300 personal shopping + $300 travel savings reserve.',
          '• Savings ($800 / month): $500 automated monthly transfer into low-cost index funds + $300 into high-yield emergency cash.',
          'Over a single decade, that $800/mo invested at a moderate 7% average return compounds into over $140,000 in liquid net worth.',
        ],
        callout: {
          label: 'The Pay Yourself First Habit',
          text: 'Schedule your 20% savings transfer to execute automatically the morning your paycheck deposits, before discretionary spending occurs.',
        },
      },
      {
        stepNumber: 3,
        title: 'Actionable Implementation in Finova',
        subtitle: 'Setting up sub-accounts to enforce discipline automatically',
        body: [
          'Modern fintech eliminates manual discipline by physically segregating funds into dedicated buckets:',
          'Step 1: In the Finova Accounts tab, configure your primary Checking account as the Central Hub.',
          'Step 2: Create a separate High-Yield Savings Account titled "Emergency Buffer" and an "Investing Account".',
          'Step 3: Keep your debit card linked only to your "Wants" checking pool so you cannot accidentally overspend on survival funds.',
          'By separating where money lives, you never have to guess whether an expense is safe for your budget.',
        ],
        callout: {
          label: 'Completion Milestone',
          text: 'You now understand how to structure your cash flow to guarantee steady wealth accumulation without deprivation.',
        },
      },
    ],
  },
  {
    id: 'les-2',
    title: 'Index Funds & ETFs: Demystifying Passive Wealth',
    category: 'Investing Essentials',
    duration: '12 mins',
    level: 'Beginner',
    summary: 'Learn why low-cost broad market indices outperform 90% of actively picked stocks over 10-year horizons.',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
    sections: [
      {
        stepNumber: 1,
        title: 'The Math Against Stock Picking',
        subtitle: 'Why index funds consistently beat active managers',
        body: [
          'Wall Street marketing often encourages retail investors to pick individual hot stocks, trade options, or follow social media trends.',
          'However, the definitive S&P Dow Jones Indices (SPIVA) research reveals that over a 15-year window, more than 92% of professional fund managers fail to beat the broad S&P 500 benchmark after fees.',
          'When you buy an individual stock, you bear unsystematic risk: executive fraud, product obsolescence, or sector shifts can wipe out your capital.',
          'An index fund owns hundreds or thousands of leading companies simultaneously, turning the growth of global capitalism into your personal compound return.',
        ],
        callout: {
          label: 'The Boglehead Principle',
          text: '"Don\'t look for the needle in the haystack. Just buy the haystack." — John C. Bogle, Founder of Vanguard.',
        },
        metrics: [
          { label: '92%', value: 'Pro Underperformance', desc: 'Active funds failing benchmark' },
          { label: '0.03%', value: 'Ultra-Low Expense', desc: 'Typical broad index fund cost' },
          { label: '500+', value: 'Instant Holdings', desc: 'Diversified corporate exposure' },
        ],
      },
      {
        stepNumber: 2,
        title: 'Understanding Exchange-Traded Funds (ETFs)',
        subtitle: 'Low management fees and instant liquidity',
        body: [
          'An Exchange-Traded Fund (ETF) trades on stock exchanges exactly like a share of stock, but holds a basket of underlying securities.',
          'Key benefits of modern ETF investing:',
          '• Low Expense Ratios: While mutual funds often charge 1.0% to 2.0% annual management fees, index ETFs like VOO or VTI charge as little as 0.03%.',
          '• Instant Liquidity: You can purchase or sell units during standard market trading hours.',
          '• Tax Efficiency: Most ETFs avoid triggering capital gains distributions until you choose to liquidate shares.',
        ],
        callout: {
          label: 'Fee Drag Reality',
          text: 'A 1.5% advisor fee eats over 30% of your total lifetime portfolio gains over a 30-year horizon due to lost compounding power.',
        },
      },
      {
        stepNumber: 3,
        title: 'Dollar-Cost Averaging (DCA)',
        subtitle: 'Eliminating the stress of market timing',
        body: [
          'Market timing is a losing game. Missing just the 10 best trading days in the stock market across two decades cuts your total return in half.',
          'Dollar-Cost Averaging (DCA) is the systematic process of investing a fixed dollar amount at regular intervals (e.g. $250 every 1st and 15th of the month), regardless of whether stock prices are climbing or dropping.',
          'When markets drop, your fixed dollar allocation buys more shares on discount. When markets rally, your accumulated shares appreciate.',
          'Finova\'s Invest tab lets you model your DCA contributions and project your 10, 20, and 30-year wealth horizon.',
        ],
        callout: {
          label: 'Next Action',
          text: 'Navigate to the Invest tab after completing this lesson to adjust your monthly index contribution target.',
        },
      },
    ],
  },
  {
    id: 'les-3',
    title: 'Exchange Rates & Cross-Border Money Transfers',
    category: 'Global Currencies',
    duration: '10 mins',
    level: 'Intermediate',
    summary: 'Uncover how traditional banks hide 3-4% margins inside retail foreign exchange rates and how to avoid them.',
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=600&q=80',
    sections: [
      {
        stepNumber: 1,
        title: 'The Hidden Margins of Retail FX',
        subtitle: 'Mid-market rate vs the advertised retail markup',
        body: [
          'When you view exchange rates on Google or Bloomberg, you are looking at the Mid-Market Rate — the real midpoint between global institutional buy and sell prices.',
          'However, when retail banks or airport kiosks claim "0% Commission", they almost always widen the spread by 3.5% to 8.0% against your favor.',
          'If 1 USD is really worth 0.92 EUR, an airport booth might give you only 0.85 EUR per dollar, secretly skimming $70 off a $1,000 exchange.',
          'Finova provides pure mid-market exchange pricing with an upfront, transparent 0.1% processing fee.',
        ],
        callout: {
          label: 'The "Zero Fee" Myth',
          text: 'Any currency provider claiming "Zero Commission" is virtually guaranteed to hide their profit inside an inflated exchange spread.',
        },
        metrics: [
          { label: '3.5% - 5%', value: 'Typical Bank Spread', desc: 'Hidden retail FX markups' },
          { label: '0.10%', value: 'Finova Flat Rate', desc: 'Fair, transparent pricing' },
          { label: '$35+', value: 'Average Savings', desc: 'Saved per $1,000 converted' },
        ],
      },
      {
        stepNumber: 2,
        title: 'Avoiding Dynamic Currency Conversion (DCC)',
        subtitle: 'The #1 trap for international travelers and cardholders',
        body: [
          'When using your credit or debit card at a restaurant, hotel, or ATM in Europe, Asia, or South America, the card terminal often asks:',
          '"Would you like to pay in USD or in EUR / JPY / Local Currency?"',
          'ALWAYS SELECT THE LOCAL CURRENCY.',
          'If you select USD, the merchant\'s card terminal processor performs "Dynamic Currency Conversion" (DCC), applying an exchange rate that adds a 4.5% to 8% penalty fee on top of your bill.',
          'By choosing local currency, your home bank converts the transaction at standard interbank network rates.',
        ],
        callout: {
          label: 'Crucial Travel Tip',
          text: 'Always reject terminal currency conversion and never exchange cash at airport arrival terminal booths.',
        },
      },
      {
        stepNumber: 3,
        title: 'Local Banking Settlement Networks',
        subtitle: 'Why modern transfers bypass SWIFT correspondent cuts',
        body: [
          'Traditional cross-border bank wires utilize the legacy SWIFT network, hopping between correspondent intermediary banks that each subtract $15 to $35 in mystery processing fees.',
          'Modern fintech platforms use connected domestic payment rails (such as SEPA in Europe, FedNow in the US, and Pix in Latin America).',
          'This guarantees that the exact amount sent arrives without intermediate deductions, settling in minutes rather than days.',
        ],
        callout: {
          label: 'Practice Mode',
          text: 'Use the Finova Convert tab to calculate real-time savings across 12 major currency pairs before your next international journey.',
        },
      },
    ],
  },
  {
    id: 'les-4',
    title: 'Compound Interest Math: The Exponential Engine',
    category: 'Wealth Strategy',
    duration: '15 mins',
    level: 'Intermediate',
    summary: 'Understand the mathematical mechanics of dividend reinvestment, dollar-cost averaging, and time horizon.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    sections: [
      {
        stepNumber: 1,
        title: 'Linear vs. Exponential Growth',
        subtitle: 'How money makes money that makes more money',
        body: [
          'Simple interest grows linearly: if you invest $10,000 at 5% simple interest, you earn $500 every year indefinitely.',
          'Compound interest grows exponentially: each year, your interest is added to the principal balance, so future interest is calculated on a larger base.',
          'In year one you earn $500, in year two you earn interest on $10,500, in year ten your annual yield is higher than your original return rate.',
          'Albert Einstein famously called compound interest "the eighth wonder of the world: he who understands it, earns it; he who doesn\'t, pays it."',
        ],
        callout: {
          label: 'The Snowball Effect',
          text: 'The early years of compound interest feel slow. The real exponential curve becomes visually obvious after year 10.',
        },
        metrics: [
          { label: 'Rule of 72', value: 'Double Your Money', desc: '72 / Interest Rate = Years' },
          { label: '8% Return', value: '9-Year Doubling', desc: 'Balance doubles every 9 yrs' },
          { label: '3x Growth', value: 'Interest vs Principal', desc: 'In 30-year horizon models' },
        ],
      },
      {
        stepNumber: 2,
        title: 'The 30-Year Compounding Simulation',
        subtitle: 'Comparing out-of-pocket savings against compounding returns',
        body: [
          'Let us observe the power of $300 invested monthly with an initial $5,000 principal at an average 8% return:',
          '• Year 10: Total Value = $69,200 (You deposited $41,000; Interest earned = $28,200).',
          '• Year 20: Total Value = $207,800 (You deposited $77,000; Interest earned = $130,800).',
          '• Year 30: Total Value = $507,000+ (You deposited $113,000; Interest earned = $394,000+).',
          'By year 30, interest generated is nearly four times your total out-of-pocket deposits. Time in the market is your greatest asset.',
        ],
        callout: {
          label: 'The Cost of Waiting',
          text: 'Starting at age 25 with $300/month produces more retirement wealth than starting at age 35 with $600/month.',
        },
      },
      {
        stepNumber: 3,
        title: 'The Mental Shortcut: The Rule of 72',
        subtitle: 'Calculate your wealth doubling period in seconds',
        body: [
          'The Rule of 72 is an indispensable mental math formula used by wealth managers:',
          'Divide 72 by your expected annual interest rate to discover how many years it will take for your investment to double:',
          '• At 6% return: 72 ÷ 6 = 12 years to double.',
          '• At 8% return: 72 ÷ 8 = 9 years to double.',
          '• At 10% return: 72 ÷ 10 = 7.2 years to double.',
          'Conversely, in high-interest credit card debt at 24%, the balance you owe doubles every 3 years if unpaid!',
        ],
        callout: {
          label: 'Next Step in Finova',
          text: 'Use the Calculate tab to run custom compound interest scenarios with your personalized savings numbers.',
        },
      },
    ],
  },
];

const GLOSSARY = [
  { term: 'Compound Interest', def: 'Interest calculated on the initial principal and accumulated interest from previous periods, creating exponential wealth expansion over time.' },
  { term: 'ETF (Exchange-Traded Fund)', def: 'A diversified basket of securities that trades on open exchanges like an individual equity, providing low management fees and instant broad market exposure.' },
  { term: 'Interbank Rate (Mid-Market)', def: 'The wholesale reference exchange rate at which institutional banks trade currencies among themselves with zero retail markup.' },
  { term: 'Dollar-Cost Averaging (DCA)', def: 'The disciplined practice of investing a fixed dollar amount at regular scheduled intervals, smoothing out short-term price volatility.' },
  { term: 'Dynamic Currency Conversion (DCC)', def: 'An overseas point-of-sale card terminal feature that converts foreign purchases to home currency at steep 4–8% markup fees.' },
  { term: 'Emergency Runway', def: 'The duration in months a household can comfortably sustain essential living expenses using liquid savings in the event of income loss.' },
  { term: 'Expense Ratio', def: 'The annual percentage fee deducted by fund administrators to cover operating costs; broad index ETFs typically charge under 0.05%.' },
];

interface LearnViewProps {
  completedLessonIds?: string[];
  onToggleLessonCompleted?: (lessonId: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  completedLessonIds: propCompletedLessonIds,
  onToggleLessonCompleted,
}) => {
  const [searchGlossary, setSearchGlossary] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'glossary' | 'quiz'>('courses');
  const [internalCompletedLessonIds, setInternalCompletedLessonIds] = useState<string[]>([]);
  
  // Interactive Lesson Modal / Reader State
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [justCompletedToast, setJustCompletedToast] = useState<string | null>(null);

  const completedLessonIds = propCompletedLessonIds !== undefined 
    ? propCompletedLessonIds 
    : internalCompletedLessonIds;

  // Mini quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Opens the selected lesson in reader mode at step 0
  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentStepIndex(0);
  };

  // Closes the active lesson modal
  const handleCloseLesson = () => {
    setActiveLesson(null);
    setCurrentStepIndex(0);
  };

  // Mark completion only after user finishes the final step
  const handleFinishLesson = () => {
    if (!activeLesson) return;
    const lessonId = activeLesson.id;

    if (!completedLessonIds.includes(lessonId)) {
      if (onToggleLessonCompleted) {
        onToggleLessonCompleted(lessonId);
      } else {
        setInternalCompletedLessonIds((prev) => [...prev, lessonId]);
      }
    }

    setJustCompletedToast(activeLesson.title);
    setActiveLesson(null);
    setCurrentStepIndex(0);
    setTimeout(() => {
      setJustCompletedToast(null);
    }, 4500);
  };

  // Reset or re-toggle a completed lesson if requested
  const handleResetLessonProgress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleLessonCompleted) {
      onToggleLessonCompleted(id);
    } else {
      setInternalCompletedLessonIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const progressPercent = Math.round((completedLessonIds.length / LESSONS.length) * 100);

  const filteredGlossary = GLOSSARY.filter(
    (item) =>
      item.term.toLowerCase().includes(searchGlossary.toLowerCase()) ||
      item.def.toLowerCase().includes(searchGlossary.toLowerCase())
  );

  return (
    <div id="learn-view-container" className="space-y-8">
      
      {/* Toast Notification when lesson finishes */}
      {justCompletedToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#133320] text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-[#659B5E]/40 animate-in fade-in slide-in-from-top-3 max-w-md">
          <div className="w-8 h-8 rounded-full bg-[#659B5E] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Lesson Completed!</div>
            <div className="text-[11px] text-emerald-100 line-clamp-1">{justCompletedToast}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0EA] text-[#41603B] text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-[#659B5E]" />
            <span>Financial Education Academy</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl text-[#1E293B]">
            Bite-Sized Financial Masterclasses
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Build unshakeable financial literacy with interactive step-by-step masterclasses, real-world numbers, and terminology guides.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'courses'
                ? 'bg-[#E8F0EA] text-[#41603B]'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Masterclasses ({LESSONS.length})
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'glossary'
                ? 'bg-[#E8F0EA] text-[#41603B]'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Glossary ({GLOSSARY.length})
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'quiz'
                ? 'bg-[#E8F0EA] text-[#41603B]'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Knowledge Check
          </button>
        </div>
      </div>

      {/* 1. COURSES TAB */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Progress Banner */}
          <div className="bg-[#E8F0EA] rounded-2xl p-6 border border-[#659B5E]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#659B5E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-lg text-[#41603B]">
                  Your Academy Progress: {progressPercent}% Completed
                </h3>
                <p className="text-xs text-[#41603B]/85">
                  {completedLessonIds.length === 0
                    ? 'Begin with module 1. Each lesson contains actionable steps and real-world numbers.'
                    : `You have completed ${completedLessonIds.length} of ${LESSONS.length} masterclasses. Keep up the momentum!`}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-48 bg-white rounded-full h-3 overflow-hidden border border-[#659B5E]/30">
              <div 
                className="bg-[#659B5E] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Masterclass Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LESSONS.map((lesson) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              return (
                <div 
                  key={lesson.id}
                  className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                    isCompleted ? 'border-[#659B5E]/40' : 'border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5 aspect-4/3 sm:aspect-auto overflow-hidden bg-slate-100 relative">
                      <img 
                        src={lesson.image} 
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {isCompleted && (
                        <div className="absolute top-3 left-3 bg-[#16A34A] text-white px-2.5 py-1 rounded-md shadow-xs text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>

                    <div className="sm:w-3/5 p-5 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#64748B]">
                          <span className="text-[#659B5E] font-bold">{lesson.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#64748B]" />
                            {lesson.duration}
                          </span>
                        </div>
                        <h4 className="font-heading text-lg text-[#1E293B] mt-1 line-clamp-2">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-[#64748B] mt-1 leading-relaxed line-clamp-2">
                          {lesson.summary}
                        </p>
                      </div>

                      <div className="pt-3 flex items-center justify-between border-t border-[#E2E8F0]">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#F8F9FA] text-[#64748B] font-medium border border-[#E2E8F0]">
                          {lesson.level}
                        </span>

                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <button
                              type="button"
                              onClick={(e) => handleResetLessonProgress(lesson.id, e)}
                              className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                              title="Reset completion to retake"
                            >
                              Reset
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => handleStartLesson(lesson)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                              isCompleted
                                ? 'bg-[#E8F0EA] text-[#41603B] hover:bg-[#659B5E] hover:text-white'
                                : 'bg-[#659B5E] text-white hover:bg-[#52824c] active:scale-95'
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Review Lesson</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Start Lesson</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. GLOSSARY TAB */}
      {activeTab === 'glossary' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-xl text-[#1E293B]">
                Financial Terms Glossary
              </h3>
              <p className="text-xs text-[#64748B]">
                Clear, jargon-free explanations of core wealth and banking concepts.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchGlossary}
                onChange={(e) => setSearchGlossary(e.target.value)}
                placeholder="Search term..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-hidden focus:ring-2 focus:ring-[#659B5E]/20"
              />
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className="py-4 space-y-1">
                <div className="font-heading text-base text-[#1E293B] font-bold">{item.term}</div>
                <div className="text-xs text-[#64748B] leading-relaxed">{item.def}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. QUICK KNOWLEDGE CHECK / QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#659B5E]">
              Module 1 Knowledge Check
            </span>
            <h3 className="font-heading text-2xl text-[#1E293B]">
              What is the primary advantage of Dollar-Cost Averaging (DCA)?
            </h3>
            <p className="text-xs text-[#64748B]">
              Select the best answer based on the lesson principles.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { id: 0, text: 'It guarantees you will always buy at the absolute lowest market bottom.' },
              { id: 1, text: 'It mitigates market timing risk by systematically purchasing more shares when prices are low and fewer when high.' },
              { id: 2, text: 'It exempts all of your capital gains from federal and state taxes.' },
              { id: 3, text: 'It forces you to trade equities multiple times a day.' },
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => { if (!quizSubmitted) setQuizAnswer(option.id); }}
                className={`p-4 rounded-xl border text-xs transition-all cursor-pointer ${
                  quizAnswer === option.id
                    ? 'border-[#659B5E] bg-[#E8F0EA] text-[#41603B] font-semibold'
                    : 'border-[#E2E8F0] hover:bg-[#F8F9FA] text-[#1E293B]'
                }`}
              >
                {option.text}
              </div>
            ))}
          </div>

          {quizSubmitted ? (
            <div className={`p-4 rounded-xl text-xs flex items-center gap-3 ${
              quizAnswer === 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <CheckCircle2 className="w-5 h-5 text-[#659B5E] shrink-0" />
              <div>
                <strong>{quizAnswer === 1 ? 'Correct! ' : 'Incorrect. '}</strong>
                DCA lowers emotional volatility by making steady, recurring contributions without attempting to time market peaks or valleys.
              </div>
            </div>
          ) : (
            <button
              onClick={() => { if (quizAnswer !== null) setQuizSubmitted(true); }}
              disabled={quizAnswer === null}
              className="px-6 py-2.5 rounded-lg bg-[#659B5E] disabled:opacity-50 text-white text-xs font-semibold shadow-xs hover:bg-[#52824c]"
            >
              Submit Answer
            </button>
          )}
        </div>
      )}

      {/* 4. INTERACTIVE LESSON READER MODAL (Flow: Start Lesson -> View Content -> Progress Steps -> Complete Finish) */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-3xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Top Bar */}
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8F9FA]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8F0EA] text-[#41603B] flex items-center justify-center font-bold text-xs">
                  {currentStepIndex + 1}/{activeLesson.sections.length}
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#659B5E] uppercase tracking-wider">
                    {activeLesson.category}
                  </div>
                  <h3 className="font-heading text-base sm:text-lg text-[#1E293B] line-clamp-1">
                    {activeLesson.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseLesson}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors"
                title="Exit lesson"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-[#E2E8F0] h-1.5">
              <div 
                className="bg-[#659B5E] h-1.5 transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / activeLesson.sections.length) * 100}%` }}
              />
            </div>

            {/* Scrollable Lesson Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              {(() => {
                const currentSection = activeLesson.sections[currentStepIndex];
                return (
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-bold text-[#659B5E] uppercase tracking-wider block mb-1">
                        Step {currentSection.stepNumber} of {activeLesson.sections.length}
                      </span>
                      <h2 className="font-heading text-2xl text-[#1E293B]">
                        {currentSection.title}
                      </h2>
                      <p className="text-xs text-[#64748B] mt-0.5 font-medium">
                        {currentSection.subtitle}
                      </p>
                    </div>

                    {/* Paragraphs */}
                    <div className="space-y-3 text-sm text-[#334155] leading-relaxed">
                      {currentSection.body.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    {/* Metric Cards if present */}
                    {currentSection.metrics && currentSection.metrics.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        {currentSection.metrics.map((m, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
                            <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                              {m.label}
                            </span>
                            <div className="font-heading text-base font-bold text-[#1E293B]">
                              {m.value}
                            </div>
                            <p className="text-[11px] text-[#64748B]">{m.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Callout Box */}
                    {currentSection.callout && (
                      <div className="p-4 rounded-xl bg-[#E8F0EA] border border-[#659B5E]/30 space-y-1">
                        <div className="text-xs font-bold text-[#41603B] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#659B5E]" />
                          <span>{currentSection.callout.label}</span>
                        </div>
                        <p className="text-xs text-[#41603B] leading-relaxed">
                          {currentSection.callout.text}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Modal Navigation Footer */}
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8F9FA] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className="px-4 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#1E293B] hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <div className="text-xs text-[#64748B] font-medium hidden sm:block">
                Section {currentStepIndex + 1} of {activeLesson.sections.length}
              </div>

              {currentStepIndex < activeLesson.sections.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(prev => prev + 1)}
                  className="px-5 py-2 rounded-lg bg-[#659B5E] hover:bg-[#52824c] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Next Section</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishLesson}
                  className="px-5 py-2.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Complete Lesson & Finish</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
