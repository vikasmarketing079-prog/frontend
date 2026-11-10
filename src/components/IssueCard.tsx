import React, { useState } from 'react';
import { AuditIssueItem } from '../types/index.js';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Wrench,
  HelpCircle,
} from 'lucide-react';

interface IssueCardProps {
  issue: AuditIssueItem;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const [expanded, setExpanded] = useState(issue.severity === 'critical' || issue.severity === 'high');

  const severityConfig = {
    critical: {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
      label: 'Critical Priority',
    },
    high: {
      badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      icon: AlertTriangle,
      iconColor: 'text-orange-400',
      label: 'High Priority',
    },
    medium: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: Info,
      iconColor: 'text-amber-400',
      label: 'Medium Priority',
    },
    low: {
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      icon: Info,
      iconColor: 'text-blue-400',
      label: 'Low Priority',
    },
    passed: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      label: 'Passed',
    },
  };

  const conf = severityConfig[issue.severity] || severityConfig.medium;
  const Icon = conf.icon;

  return (
    <div className="bg-[#0B132B]/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition">
      {/* Header bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 mt-0.5 sm:mt-0 flex-shrink-0">
            <Icon className={`w-5 h-5 ${conf.iconColor}`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${conf.badge}`}>
                {conf.label}
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                {issue.category.replace('_', ' ')}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
              {issue.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180 text-blue-400' : ''}`}
          />
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm">
          {/* Affected URL */}
          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Affected URL:</span>
            <a
              href={issue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-1 truncate"
            >
              <span>{issue.url}</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
          </div>

          {/* Actual detected evidence */}
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Actual Detected Evidence
            </span>
            <p className="text-slate-300 font-mono text-xs leading-relaxed">{issue.evidence}</p>
          </div>

          {/* Why it matters */}
          <div className="flex items-start gap-2.5 bg-blue-950/20 border border-blue-900/30 p-3 rounded-xl">
            <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block mb-0.5">
                Why It Matters
              </span>
              <p className="text-slate-300 leading-relaxed">{issue.whyItMatters}</p>
            </div>
          </div>

          {/* Recommended fix */}
          <div className="flex items-start gap-2.5 bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-xl">
            <Wrench className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block mb-0.5">
                Recommended Fix
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">{issue.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

