import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  weight: string;
  score: number;
  icon: LucideIcon;
  description: string;
  onClick?: () => void;
  active?: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  weight,
  score,
  icon: Icon,
  description,
  onClick,
  active = false,
}) => {
  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));

  let colorClass = 'text-rose-600 bg-rose-50 border-rose-200';
  let barColor = 'bg-rose-500';
  if (boundedScore >= 80) {
    colorClass = 'text-emerald-600 bg-emerald-50 border-emerald-200';
    barColor = 'bg-emerald-500';
  } else if (boundedScore >= 60) {
    colorClass = 'text-amber-600 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
  }

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
        active
          ? 'bg-blue-50/50 border-blue-500 shadow-md ring-1 ring-blue-500'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${colorClass}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
            <span className="text-[11px] text-slate-500 font-medium">Weight: {weight}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-slate-900">{boundedScore}</span>
          <span className="text-xs text-slate-400 font-semibold">/100</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-3 line-clamp-1">{description}</p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${boundedScore}%` }}
        />
      </div>
    </div>
  );
};
