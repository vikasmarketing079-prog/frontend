import React from 'react';
import { Loader2, Globe, Cpu, CheckCircle } from 'lucide-react';

interface ScanProgressBarProps {
  progressPercent: number;
  status: string;
  stepMessage?: string;
  pagesDiscovered?: number;
  pagesScanned?: number;
}

export const ScanProgressBar: React.FC<ScanProgressBarProps> = ({
  progressPercent,
  status,
  stepMessage,
  pagesDiscovered = 0,
  pagesScanned = 0,
}) => {
  const isFinished = status === 'completed';
  const isFailed = status === 'failed';

  return (
    <div className="bg-white border border-blue-200/80 rounded-2xl p-6 shadow-xl shadow-blue-900/5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {isFinished ? (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}

          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{isFinished ? 'Audit Finished Successfully' : 'Deep Website Audit in Progress'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-mono font-bold uppercase border border-blue-200">
                {status}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              {stepMessage || 'Inspecting network headers, crawling pages, and diagnosing web health...'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-blue-600 font-mono">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 p-0.5 border border-slate-200 overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isFailed
              ? 'bg-rose-500'
              : isFinished
              ? 'bg-emerald-500'
              : 'bg-blue-600'
          }`}
          style={{ width: `${Math.max(5, progressPercent)}%` }}
        />
      </div>

      {/* Live metrics strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-400 block text-[11px]">Pages Scanned</span>
          <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{pagesScanned}</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-400 block text-[11px]">Pages Discovered</span>
          <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{pagesDiscovered}</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-400 block text-[11px]">Diagnostics</span>
          <span className="text-sm font-bold text-blue-600 font-mono mt-0.5 block flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> 7 Active Modules
          </span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-400 block text-[11px]">Security Guard</span>
          <span className="text-sm font-bold text-emerald-600 font-mono mt-0.5 block">
            SSRF Safe
          </span>
        </div>
      </div>
    </div>
  );
};
