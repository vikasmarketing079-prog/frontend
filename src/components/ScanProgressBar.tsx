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
    <div className="bg-[#0B132B] border border-blue-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {isFinished ? (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle className="w-6 h-6" />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{isFinished ? 'Audit Finished Successfully' : 'Deep Website Audit in Progress'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                {status.toUpperCase()}
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 font-mono">
              {stepMessage || 'Inspecting network headers, crawling internal pages, and running diagnostics...'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isFailed
              ? 'bg-rose-500'
              : isFinished
              ? 'bg-emerald-500'
              : 'bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400'
          }`}
          style={{ width: `${Math.max(5, progressPercent)}%` }}
        />
      </div>

      {/* Live metrics strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block">Pages Scanned</span>
          <span className="text-sm font-bold text-white font-mono mt-0.5 block">{pagesScanned}</span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block">Pages Discovered</span>
          <span className="text-sm font-bold text-white font-mono mt-0.5 block">{pagesDiscovered}</span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block">Diagnostics Engine</span>
          <span className="text-sm font-bold text-blue-400 font-mono mt-0.5 block flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> 7 Active Modules
          </span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block">Security Guard</span>
          <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
            SSRF Safe
          </span>
        </div>
      </div>
    </div>
  );
};
