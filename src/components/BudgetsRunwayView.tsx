import React, { useState } from 'react';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';
import { CategorySpend } from '../types';

interface BudgetsRunwayViewProps {
  categorySpends: CategorySpend[];
  totalCash: number;
}

export const BudgetsRunwayView: React.FC<BudgetsRunwayViewProps> = ({
  categorySpends,
  totalCash,
}) => {
  const [revenueGrowth, setRevenueGrowth] = useState<number>(8); // 8% monthly growth
  const [expenseGrowth, setExpenseGrowth] = useState<number>(3); // 3% opex growth
  const [reserveBuffer, setReserveBuffer] = useState<number>(500000); // 500k minimum reserve target

  // Base numbers from current month
  const baseMonthlyInflow = 196500;
  const baseMonthlyOutflow = 119280;

  // Simulator math
  const projectedNet = baseMonthlyInflow * (1 + revenueGrowth / 100) - baseMonthlyOutflow * (1 + expenseGrowth / 100);
  const isNetPositive = projectedNet >= 0;
  
  // Calculate runway months
  let runwayMonths = 0;
  let simulatedCash = totalCash - reserveBuffer;
  if (isNetPositive) {
    runwayMonths = 99; // Infinite / cash flow positive
  } else {
    runwayMonths = Math.max(1, Math.round(simulatedCash / Math.abs(projectedNet)));
  }

  const criticalFloorDate = new Date();
  criticalFloorDate.setMonth(criticalFloorDate.getMonth() + (isNetPositive ? 36 : runwayMonths));
  const formattedFloorDate = criticalFloorDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div id="budgets-view-container" className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-young-serif text-2xl sm:text-3xl text-[#1E293B]">
            Cash Runway Modeler & Department Budgets
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Simulate future cash burn curves under variable headcount scaling, ARR expansion, and reserve floors.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E8F0EA] border border-[#659B5E]/30 text-xs font-semibold text-[#41603B]">
          <Sparkles className="w-3.5 h-3.5 text-[#659B5E]" />
          <span>Real-time Monte Carlo Engine Active</span>
        </div>
      </div>

      {/* Interactive Simulator Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
        <div className="border-b border-[#E2E8F0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-young-serif text-lg text-[#1E293B]">
              Predictive Runway Simulator
            </h3>
            <p className="text-xs text-[#64748B]">
              Adjust variables to test scenario resilience against market shocks or hiring ramp-ups
            </p>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#F8F9FA] border border-[#E2E8F0] text-[#1E293B]">
            Current Liquid Base: ${totalCash.toLocaleString()}
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Revenue Growth */}
          <div className="space-y-2 bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1E293B]">MoM Revenue Growth</span>
              <span className="font-mono font-bold text-[#22C55E]">+{revenueGrowth}%</span>
            </div>
            <input
              type="range"
              min="-15"
              max="25"
              value={revenueGrowth}
              onChange={(e) => setRevenueGrowth(Number(e.target.value))}
              className="w-full accent-[#659B5E] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B]">
              <span>-15% (Churn)</span>
              <span>Baseline (0%)</span>
              <span>+25% (Hypergrowth)</span>
            </div>
          </div>

          {/* Slider 2: OpEx / Hiring Ramp */}
          <div className="space-y-2 bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1E293B]">MoM OpEx & Hiring Ramp</span>
              <span className="font-mono font-bold text-[#8B5CF6]">+{expenseGrowth}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={expenseGrowth}
              onChange={(e) => setExpenseGrowth(Number(e.target.value))}
              className="w-full accent-[#8B5CF6] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B]">
              <span>0% (Flat)</span>
              <span>+10% (Moderate)</span>
              <span>+20% (Aggressive)</span>
            </div>
          </div>

          {/* Slider 3: Safety Floor */}
          <div className="space-y-2 bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1E293B]">Minimum Reserve Floor</span>
              <span className="font-mono font-bold text-[#F59E0B]">${(reserveBuffer / 1000).toFixed(0)}k</span>
            </div>
            <input
              type="range"
              min="100000"
              max="1500000"
              step="50000"
              value={reserveBuffer}
              onChange={(e) => setReserveBuffer(Number(e.target.value))}
              className="w-full accent-[#F59E0B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B]">
              <span>$100k</span>
              <span>$750k</span>
              <span>$1.5M</span>
            </div>
          </div>
        </div>

        {/* Dynamic Simulation Results Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#E8F0EA] border border-[#659B5E]/30 rounded-xl p-4">
            <div className="text-[11px] uppercase font-bold text-[#41603B]">Simulated Operating Runway</div>
            <div className="font-young-serif text-3xl text-[#41603B] mt-1">
              {isNetPositive ? 'Infinite / Self-Sustaining' : `${runwayMonths} Months`}
            </div>
            <div className="text-xs text-[#64748B] mt-1">
              {isNetPositive ? 'Profitable cash generation' : `Runway exhausted by ${formattedFloorDate}`}
            </div>
          </div>

          <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl p-4">
            <div className="text-[11px] uppercase font-bold text-[#64748B]">Simulated Monthly Net Flow</div>
            <div className={`font-young-serif text-3xl mt-1 ${isNetPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {isNetPositive ? '+' : '-'}${Math.abs(projectedNet).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-[#64748B] mt-1">
              Projected forward monthly rate
            </div>
          </div>

          <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl p-4">
            <div className="text-[11px] uppercase font-bold text-[#64748B]">Reserve Threshold Date</div>
            <div className="font-young-serif text-3xl text-[#1E293B] mt-1">
              {formattedFloorDate}
            </div>
            <div className="text-xs text-[#64748B] mt-1">
              Target floor (${(reserveBuffer / 1000).toFixed(0)}k) preserved
            </div>
          </div>
        </div>
      </div>

      {/* Department Allocations Detail */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="border-b border-[#E2E8F0] pb-3">
          <h3 className="font-young-serif text-lg text-[#1E293B]">
            Monthly Department Allocations vs Actuals
          </h3>
          <p className="text-xs text-[#64748B]">
            Enforcing Chart-of-Accounts expenditure caps and budget variances
          </p>
        </div>

        <div className="space-y-4 pt-1">
          {categorySpends.map((cat) => {
            const spentPct = Math.round((cat.amount / cat.budget) * 100);
            const remaining = cat.budget - cat.amount;

            return (
              <div key={cat.name} className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#659B5E]/50 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cat.color }} 
                    />
                    <span className="font-young-serif text-base text-[#1E293B]">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span>
                      Spent: <strong className="font-mono text-[#1E293B]">${cat.amount.toLocaleString()}</strong>
                    </span>
                    <span>/</span>
                    <span>
                      Budget: <strong className="font-mono text-[#64748B]">${cat.budget.toLocaleString()}</strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      spentPct <= 90 ? 'bg-[#DCFCE7] text-[#22C55E]' : 'bg-[#FEE2E2] text-[#EF4444]'
                    }`}>
                      {spentPct}% utilized
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${Math.min(spentPct, 100)}%`,
                      backgroundColor: cat.color 
                    }} 
                  />
                </div>

                <div className="flex justify-between text-[11px] text-[#64748B]">
                  <span>${remaining.toLocaleString()} headroom remaining</span>
                  <span>Target cap resets in 19 days</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
