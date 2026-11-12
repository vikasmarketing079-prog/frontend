import React, { useState } from 'react';
import { getCodeFixForIssue } from '../services/codeFixService.js';
import { Copy, Check, X, Code2, Terminal, Sparkles, FileCode } from 'lucide-react';

interface CodeFixModalProps {
  issueCode: string;
  url?: string;
  onClose: () => void;
}

export const CodeFixModal: React.FC<CodeFixModalProps> = ({ issueCode, url, onClose }) => {
  const fix = getCodeFixForIssue(issueCode, url);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const currentTab = fix.tabs[activeTab] || fix.tabs[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider mb-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>1-Click Ready Code Fix</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{fix.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{fix.summary}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Framework Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {fix.tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                setCopied(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === idx
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Snippet Box */}
        <div className="rounded-2xl bg-slate-900 text-slate-100 overflow-hidden border border-slate-800 font-mono text-xs">
          {/* Filename & Copy Action Bar */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentTab.filename}</span>
            </div>
            <button
              onClick={handleCopy}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Actual Code View */}
          <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono whitespace-pre text-emerald-400">
            {currentTab.code}
          </pre>
        </div>

        {/* Help footer */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <span>Copy this snippet directly into your codebase or forward to your developer.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
