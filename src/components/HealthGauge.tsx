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

  let color = '#EF4444'; // Red
  let statusText = 'Critical Attention Needed';
  let badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

  if (boundedScore >= 80) {
    color = '#10B981'; // Emerald Green
    statusText = 'Optimal Health & Ready';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (boundedScore >= 60) {
    color = '#F59E0B'; // Amber Orange
    statusText = 'Fair / Optimization Required';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
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
            stroke="#1E293B"
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
          <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {boundedScore}
          </span>
          <span className="text-xs uppercase font-medium text-slate-400 tracking-wider mt-0.5">
            Out of 100
          </span>
        </div>
      </div>

      {showLabel && (
        <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
          {statusText}
        </div>
      )}
    </div>
  );
};

