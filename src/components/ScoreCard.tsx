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

  let colorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  let barColor = 'bg-rose-500';
  if (boundedScore >= 80) {
    colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    barColor = 'bg-emerald-500';
  } else if (boundedScore >= 60) {
    colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    barColor = 'bg-amber-500';
  }

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
        active
          ? 'bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
          : 'bg-[#0B132B]/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2.5 rounded-xl border ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
            <span className="text-[11px] text-slate-400">Weight: {weight}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white">{boundedScore}</span>
          <span className="text-xs text-slate-400 font-medium">/100</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3 line-clamp-1">{description}</p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${boundedScore}%` }}
        />
      </div>
    </div>
  );
};

