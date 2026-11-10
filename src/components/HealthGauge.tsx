import React from 'react';

interface HealthGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  score,
  size = 180,
  strokeWidth = 14,
  showLabel = true,
}) => {
  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (boundedScore / 100) * circumference;

  let color = '#DC2626'; // Critical Red
  let statusText = 'Critical Attention Needed';
  let badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';

  if (boundedScore >= 80) {
    color = '#16A34A'; // Success Green
    statusText = 'Optimal Health & Ready';
    badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (boundedScore >= 60) {
    color = '#F59E0B'; // Warning Amber
    statusText = 'Optimization Required';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {boundedScore}
          </span>
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
            Out of 100
          </span>
        </div>
      </div>

      {showLabel && (
        <div className={`mt-3 px-3.5 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
          {statusText}
        </div>
      )}
    </div>
  );
};
