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
  onToggleResolved?: (id: string) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onToggleResolved }) => {
  const [expanded, setExpanded] = useState(issue.severity === 'critical' || issue.severity === 'high');

  const severityConfig = {
    critical: {
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
      label: 'Critical Priority',
    },
    high: {
      badge: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      label: 'High Priority',
    },
    medium: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Info,
      iconColor: 'text-amber-600',
      label: 'Medium Priority',
    },
    low: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      label: 'Low Priority',
    },
    passed: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      label: 'Passed',
    },
  };

  const conf = severityConfig[issue.severity] || severityConfig.medium;
  const Icon = conf.icon;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 shadow-sm transition">
      {/* Header bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 mt-0.5 sm:mt-0 flex-shrink-0">
            <Icon className={`w-4 h-4 ${conf.iconColor}`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${conf.badge}`}>
                {conf.label}
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                {issue.category.replace('_', ' ')}
              </span>
              {issue.resolved && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Resolved
                </span>
              )}
            </div>
            <h4 className={`text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate ${issue.resolved ? 'line-through text-slate-400' : ''}`}>
              {issue.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleResolved && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleResolved(issue._id);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                issue.resolved
                  ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {issue.resolved ? 'Mark Open' : 'Mark Resolved'}
            </button>
          )}
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180 text-blue-600' : ''}`}
          />
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-100 space-y-3.5 text-xs sm:text-sm bg-slate-50/40">
          {/* Affected URL */}
          <div className="flex items-center gap-2 text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-xs overflow-x-auto">
            <span className="text-slate-400 font-bold uppercase text-[10px]">URL:</span>
            <a
              href={issue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 truncate font-medium"
            >
              <span>{issue.url}</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
          </div>

          {/* Actual detected evidence */}
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Detected Evidence
            </span>
            <p className="text-slate-600 font-mono text-xs leading-relaxed">{issue.evidence}</p>
          </div>

          {/* Why it matters */}
          <div className="flex items-start gap-2.5 bg-blue-50/60 border border-blue-200/60 p-3 rounded-xl">
            <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-0.5">
                Why It Matters
              </span>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{issue.whyItMatters}</p>
            </div>
          </div>

          {/* Recommended fix */}
          <div className="flex items-start gap-2.5 bg-emerald-50/60 border border-emerald-200/60 p-3 rounded-xl">
            <Wrench className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-0.5">
                Recommended Fix
              </span>
              <p className="text-slate-700 leading-relaxed font-medium text-xs sm:text-sm">{issue.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
