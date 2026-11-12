import React, { useState } from 'react';
import { PageAuditItem } from '../types/index.js';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  Globe,
  Heading1,
  Link2,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PageMetadataInspectorProps {
  pages: PageAuditItem[];
  targetUrl: string;
}

export const PageMetadataInspector: React.FC<PageMetadataInspectorProps> = ({
  pages,
  targetUrl,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');

  if (!pages || pages.length === 0) {
    return null;
  }

  const currentPage = pages[selectedIndex] || pages[0];
  const title = currentPage.title?.trim() || '';
  const titleLength = title.length;

  const metaDesc = currentPage.metaDescription?.trim() || '';
  const metaDescLength = metaDesc.length;

  const h1 = currentPage.h1Text?.trim() || '';
  const h1Length = h1.length;
  const h1Count = currentPage.h1Count || (h1 ? 1 : 0);

  const canonical = currentPage.canonicalUrl?.trim() || '';

  // Title status helper
  const getTitleStatus = () => {
    if (!title) {
      return {
        label: 'Missing Title Tag',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        barColor: 'bg-rose-500',
        icon: AlertCircle,
        advice: 'Every page must have a descriptive <title> tag for search engines.',
      };
    }
    if (titleLength >= 50 && titleLength <= 60) {
      return {
        label: `Optimal Length (${titleLength} chars)`,
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        barColor: 'bg-emerald-500',
        icon: CheckCircle2,
        advice: 'Fits perfectly within standard Google search result display boundaries (50-60 chars).',
      };
    }
    if (titleLength < 50) {
      return {
        label: `Too Short (${titleLength}/60 chars)`,
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        barColor: 'bg-amber-500',
        icon: AlertTriangle,
        advice: 'Under 50 characters. Consider adding brand or secondary target keywords.',
      };
    }
    return {
      label: `Too Long (${titleLength}/60 chars)`,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      barColor: 'bg-orange-500',
      icon: AlertTriangle,
      advice: 'Exceeds 60 characters. Google will likely truncate this title with an ellipsis (...) in SERP.',
    };
  };

  // Meta description status helper
  const getDescStatus = () => {
    if (!metaDesc) {
      return {
        label: 'Missing Meta Description',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        barColor: 'bg-rose-500',
        icon: AlertCircle,
        advice: 'Missing meta description. Search engines will generate an arbitrary snippet.',
      };
    }
    if (metaDescLength >= 140 && metaDescLength <= 160) {
      return {
        label: `Optimal Length (${metaDescLength} chars)`,
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        barColor: 'bg-emerald-500',
        icon: CheckCircle2,
        advice: 'Ideal snippet length (140-160 chars). Generates maximum click-through without truncation.',
      };
    }
    if (metaDescLength < 140) {
      return {
        label: `Short (${metaDescLength}/160 chars)`,
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        barColor: 'bg-amber-500',
        icon: AlertTriangle,
        advice: 'Under 140 characters. You can expand the description to provide more context and incentives.',
      };
    }
    return {
      label: `Too Long (${metaDescLength}/160 chars)`,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      barColor: 'bg-orange-500',
      icon: AlertTriangle,
      advice: 'Exceeds 160 characters. Text beyond ~160 characters will be cut off in search snippets.',
    };
  };

  // H1 status helper
  const getH1Status = () => {
    if (h1Count === 0) {
      return {
        label: 'Missing H1 Tag',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: AlertCircle,
        advice: 'Pages should have exactly one <h1> tag representing the primary page subject.',
      };
    }
    if (h1Count === 1) {
      return {
        label: `1 H1 Tag (${h1Length} chars)`,
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
        advice: 'Single H1 tag detected. Proper document outline and heading hierarchy.',
      };
    }
    return {
      label: `Multiple H1 Tags (${h1Count} found)`,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
      advice: 'Multiple H1 tags dilute top-level keyword focus. Use H2-H6 for subheadings.',
    };
  };

  const titleStatus = getTitleStatus();
  const descStatus = getDescStatus();
  const h1Status = getH1Status();

  // Progress bar percentages capped at 100%
  const titleBarPercent = Math.min(100, Math.round((titleLength / 60) * 100));
  const descBarPercent = Math.min(100, Math.round((metaDescLength / 160) * 100));

  // Domain for SERP snippet
  let displayDomain = 'example.com';
  try {
    displayDomain = new URL(currentPage.url || targetUrl).hostname;
  } catch {
    displayDomain = targetUrl;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Header & Page Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-semibold uppercase tracking-wider mb-1.5">
            On-Page SEO & Metadata Inspector
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Titles, Descriptions & Character Count Diagnostics
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyze exact title tag lengths, meta description characters, SERP previews, and H1 heading structure.
          </p>
        </div>

        {/* Page selector dropdown if multi-page */}
        {pages.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Audited Page:</span>
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 max-w-xs truncate"
            >
              {pages.map((p, idx) => (
                <option key={p._id || idx} value={idx}>
                  {p.path === '/' ? `Homepage (/)` : p.path} — {p.title ? `${p.title.slice(0, 30)}...` : 'Untitled'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Page URL bar */}
      <div className="mt-4 mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 truncate max-w-2xl font-mono">
          <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-slate-400">Inspecting URL:</span>
          <a
            href={currentPage.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 font-semibold hover:underline truncate"
          >
            {currentPage.url}
          </a>
        </div>
        <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
          <span>Status: <strong className="text-emerald-600">{currentPage.statusCode || 200} OK</strong></span>
          <span>Response: <strong>{currentPage.responseTimeMs || 0}ms</strong></span>
          <span>Words: <strong>{currentPage.wordCount || 0}</strong></span>
        </div>
      </div>

      {/* Grid of Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Title & Meta Description with Character Counters */}
        <div className="lg:col-span-7 space-y-6">
          {/* Title Tag Inspector */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Page Title Tag (<code className="text-xs">&lt;title&gt;</code>)</h4>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${titleStatus.color}`}>
                <titleStatus.icon className="w-3.5 h-3.5" />
                <span>{titleStatus.label}</span>
              </span>
            </div>

            {/* Title Text Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed break-words">
              {title || <span className="text-rose-500 italic">No &lt;title&gt; tag found on this webpage</span>}
            </div>

            {/* Character Length Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  Length: <span className="font-bold text-slate-900">{titleLength}</span> characters
                </span>
                <span>Ideal: <strong className="text-slate-800">50 - 60 chars</strong></span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${titleStatus.barColor}`}
                  style={{ width: `${titleBarPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{titleStatus.advice}</p>
            </div>
          </div>

          {/* Meta Description Inspector */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-bold text-slate-900">Meta Description (<code className="text-xs">&lt;meta name="description"&gt;</code>)</h4>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${descStatus.color}`}>
                <descStatus.icon className="w-3.5 h-3.5" />
                <span>{descStatus.label}</span>
              </span>
            </div>

            {/* Meta Description Text Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed break-words">
              {metaDesc || <span className="text-rose-500 italic">No meta description found on this webpage</span>}
            </div>

            {/* Character Length Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  Length: <span className="font-bold text-slate-900">{metaDescLength}</span> characters
                </span>
                <span>Ideal: <strong className="text-slate-800">140 - 160 chars</strong></span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${descStatus.barColor}`}
                  style={{ width: `${descBarPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{descStatus.advice}</p>
            </div>
          </div>

          {/* Primary Heading H1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Heading1 className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">Primary Heading (<code className="text-xs">&lt;h1&gt;</code>)</h4>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${h1Status.color}`}>
                <h1Status.icon className="w-3.5 h-3.5" />
                <span>{h1Status.label}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed break-words">
              {h1 ? (
                <div>
                  <span>{h1}</span>
                  <span className="text-[11px] font-mono text-slate-500 block mt-1">
                    Length: <strong className="text-slate-700">{h1Length}</strong> characters
                  </span>
                </div>
              ) : (
                <span className="text-rose-500 italic">
                  {h1Count > 0 ? `${h1Count} H1 tags detected on page` : 'No <h1> tag detected on this webpage'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">{h1Status.advice}</p>
          </div>
        </div>

        {/* Right Column: Google SERP Live Snippet Preview & Key Indexing Signals */}
        <div className="lg:col-span-5 space-y-6">
          {/* SERP Preview Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Google SERP Snippet Preview</h4>
              </div>
              <div className="inline-flex p-0.5 rounded-lg bg-slate-100 text-[11px] font-medium">
                <button
                  onClick={() => setDevicePreview('desktop')}
                  className={`px-2 py-0.5 rounded-md transition ${
                    devicePreview === 'desktop' ? 'bg-white shadow-sm text-slate-900 font-semibold' : 'text-slate-500'
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setDevicePreview('mobile')}
                  className={`px-2 py-0.5 rounded-md transition ${
                    devicePreview === 'mobile' ? 'bg-white shadow-sm text-slate-900 font-semibold' : 'text-slate-500'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Google Search Result Simulation */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1.5 font-sans">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                  {displayDomain[0]?.toUpperCase() || 'W'}
                </div>
                <div className="truncate text-[12px] text-[#202124]">
                  <span>https://{displayDomain}</span>
                  {currentPage.path && currentPage.path !== '/' && (
                    <span className="text-slate-400"> › {currentPage.path.replace(/^\//, '').replace(/\//g, ' › ')}</span>
                  )}
                </div>
              </div>

              {/* Title link */}
              <div className="text-[#1a0dab] hover:underline text-[16px] leading-[22px] font-normal cursor-pointer line-clamp-1">
                {title ? (
                  title.length > 60 ? `${title.slice(0, 58)}...` : title
                ) : (
                  <span className="text-rose-500">Untitled Webpage</span>
                )}
              </div>

              {/* Snippet text */}
              <p className="text-[#4d5156] text-[13px] leading-[19px] line-clamp-2">
                {metaDesc ? (
                  metaDesc.length > 160 ? `${metaDesc.slice(0, 157)}...` : metaDesc
                ) : (
                  <span className="text-slate-400 italic">
                    No meta description specified. Search engine will display excerpted body text here.
                  </span>
                )}
              </p>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              * Simulated Google Search Result representation based on current title and meta description tag lengths.
            </p>
          </div>

          {/* Canonical & On-Page Indexing Signals */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-emerald-600" />
              <span>Indexing & Link Signals</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-600">Canonical Tag</span>
                  {canonical ? (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Configured
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Missing
                    </span>
                  )}
                </div>
                <div className="font-mono text-slate-800 text-[11px] break-all truncate">
                  {canonical || 'No rel="canonical" found'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Word Count</span>
                  <span className="text-sm font-bold text-slate-900">{currentPage.wordCount || 0}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {(currentPage.wordCount || 0) >= 300 ? 'Healthy content depth' : 'Thin content warning'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Image Alt Tags</span>
                  <span className={`text-sm font-bold ${currentPage.missingAltCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {currentPage.missingAltCount > 0 ? `${currentPage.missingAltCount} missing` : 'All Alt OK'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {currentPage.imagesCount || 0} total images
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Internal Links</span>
                  <span className="text-sm font-bold text-slate-900">{currentPage.internalLinksCount || 0}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">External Links</span>
                  <span className="text-sm font-bold text-slate-900">{currentPage.externalLinksCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
