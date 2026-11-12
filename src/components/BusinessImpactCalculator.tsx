import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface BusinessImpactCalculatorProps {
  healthScore: number;
  criticalIssuesCount: number;
  averageResponseTimeMs: number;
}

export const BusinessImpactCalculator: React.FC<BusinessImpactCalculatorProps> = ({
  healthScore,
  criticalIssuesCount,
  averageResponseTimeMs,
}) => {
  const [monthlyTraffic, setMonthlyTraffic] = useState<number>(15000);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(50);

  // Conversion drop rule of thumb: Every 1 second of delay reduces conversions by ~7%
  const loadSeconds = averageResponseTimeMs / 1000;
  const estimatedConversionLossPercent = Math.min(25, Math.max(4, Math.round(loadSeconds * 4.5 + criticalIssuesCount * 1.5)));

  // Estimated visitors lost due to poor SEO tags / missing meta descriptions
  const estimatedTrafficLoss = Math.round(monthlyTraffic * (estimatedConversionLossPercent / 100));

  // Potential revenue recovered
  const potentialRecoveredMonthly = Math.round(
    monthlyTraffic * 0.02 * (estimatedConversionLossPercent / 100) * avgOrderValue
  );

  return (
    <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-blue-50/70 border border-emerald-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            <span>ROI & Revenue Impact Engine</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Estimated Traffic & Revenue Impact of Unfixed Issues
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Based on Google research showing page speed delays and missing on-page tags directly depress conversion rates.
          </p>
        </div>
      </div>

      {/* 3 Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block mb-1">Conversion Loss Rate</span>
          <div className="text-3xl font-black text-rose-600 font-mono">
            -{estimatedConversionLossPercent}%
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Driven by {loadSeconds.toFixed(1)}s load delay & {criticalIssuesCount} critical flaws
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block mb-1">Monthly Visitors at Risk</span>
          <div className="text-3xl font-black text-amber-600 font-mono">
            ~{estimatedTrafficLoss.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Potential bounces from slow render & missing snippets
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block mb-1">Potential Monthly Recovery</span>
          <div className="text-3xl font-black text-emerald-600 font-mono">
            +${potentialRecoveredMonthly.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Estimated revenue uplift after applying prioritized action plan
          </span>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Customize Your Traffic & Order Size to Calculate Exact Business ROI
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span>Estimated Monthly Visitors</span>
              <span className="font-bold font-mono text-slate-900">{monthlyTraffic.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={monthlyTraffic}
              onChange={(e) => setMonthlyTraffic(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span>Average Order / Customer Value ($)</span>
              <span className="font-bold font-mono text-slate-900">${avgOrderValue}</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessImpactCalculator;

