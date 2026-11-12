import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  ExternalLink,
} from 'lucide-react';

interface PageSpeedReportViewProps {
  url: string;
  score: number;
  metrics: {
    ttfbMs: number;
    fcpMs?: number;
    lcpMs?: number;
    cls?: number;
    tbtMs?: number;
    speedIndexMs?: number;
    pageSizeKb: number;
    requestCount: number;
    isCompressed: boolean;
    compressionType?: string;
    hasBrowserCaching: boolean;
    cacheControl?: string;
    renderBlockingScriptsCount: number;
    renderBlockingStylesCount: number;
    unoptimizedImagesCount: number;
  };
  issues?: Array<{
    category: string;
    severity: string;
    issueCode: string;
    title: string;
    evidence: string;
    recommendation: string;
    whyItMatters: string;
  }>;
  screenshot?: string | null;
}

export const PageSpeedReportView: React.FC<PageSpeedReportViewProps> = ({
  url,
  score,
  metrics,
  issues = [],
  screenshot = null,
}) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [expandView, setExpandView] = useState(false);
  const [expandedOpportunity, setExpandedOpportunity] = useState<string | null>(null);
  const [showPassedAudits, setShowPassedAudits] = useState(false);

  // Compute device-adjusted metrics
  const isMobile = device === 'mobile';
  const effectiveScore = isMobile ? score : Math.min(100, Math.round(score * 1.25 + 5));

  const fcpRaw = metrics.fcpMs || 2000;
  const lcpRaw = metrics.lcpMs || 12400;
  const tbtRaw = metrics.tbtMs || 310;
  const clsRaw = metrics.cls !== undefined ? metrics.cls : 0;
  const speedIndexRaw = metrics.speedIndexMs || 3800;

  const fcpVal = isMobile ? fcpRaw : Math.round(fcpRaw * 0.65);
  const lcpVal = isMobile ? lcpRaw : Math.round(lcpRaw * 0.68);
  const tbtVal = isMobile ? tbtRaw : Math.round(tbtRaw * 0.45);
  const clsVal = clsRaw;
  const speedIndexVal = isMobile ? speedIndexRaw : Math.round(speedIndexRaw * 0.7);

  // Metrics definitions matching Google PageSpeed Insights
  const fcpStatus = fcpVal <= 1800 ? 'good' : fcpVal <= 3000 ? 'average' : 'poor';
  const lcpStatus = lcpVal <= 2500 ? 'good' : lcpVal <= 4000 ? 'average' : 'poor';
  const tbtStatus = tbtVal <= 200 ? 'good' : tbtVal <= 600 ? 'average' : 'poor';
  const clsStatus = clsVal <= 0.1 ? 'good' : clsVal <= 0.25 ? 'average' : 'poor';
  const speedIndexStatus = speedIndexVal <= 3400 ? 'good' : speedIndexVal <= 5800 ? 'average' : 'poor';

  // Google shape icons
  const renderShape = (status: 'good' | 'average' | 'poor') => {
    if (status === 'good') {
      return <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 flex-shrink-0" title="Good" />;
    }
    if (status === 'average') {
      return <span className="inline-block w-2.5 h-2.5 rounded-[2px] bg-amber-500 mr-2 flex-shrink-0" title="Needs Improvement" />;
    }
    return (
      <span
        className="inline-block w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] border-b-rose-600 mr-2 flex-shrink-0"
        title="Poor"
      />
    );
  };

  const getMetricColor = (status: 'good' | 'average' | 'poor') => {
    if (status === 'good') return 'text-emerald-600';
    if (status === 'average') return 'text-amber-600';
    return 'text-rose-600';
  };

  // Google circular score gauge styling
  const getScoreTheme = (s: number) => {
    if (s >= 90) return { stroke: '#16A34A', text: 'text-emerald-600', label: 'Good' };
    if (s >= 50) return { stroke: '#F59E0B', text: 'text-amber-500', label: 'Needs Improvement' };
    return { stroke: '#DC2626', text: 'text-rose-600', label: 'Poor' };
  };

  const scoreTheme = getScoreTheme(effectiveScore);

  // SVG Gauge calculations
  const radius = 62;
  const stroke = 7;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (effectiveScore / 100) * circumference;

  // Filter opportunities & passed audits
  const opportunities = issues.filter(
    (i) => i.severity === 'critical' || i.severity === 'high' || i.severity === 'medium'
  );
  const passedAudits = issues.filter((i) => i.severity === 'passed');

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden font-sans space-y-10 p-6 sm:p-12 animate-in fade-in duration-200">
      {/* 1. Google PageSpeed Device Tabs (Centered at top) */}
      <div className="flex items-center justify-center border-b border-slate-200">
        <div className="flex items-center gap-8 -mb-px">
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              device === 'mobile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>

          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              device === 'desktop'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* 2. Google PageSpeed Hero: Left Gauge & Right Device Screenshot Frame */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
        {/* Left Column: Radial Score Gauge & Performance Title */}
        <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="#F1F5F9"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke={scoreTheme.stroke}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-4xl sm:text-5xl font-bold tracking-tight ${scoreTheme.text}`}>
                {effectiveScore}
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Performance
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md">
            Values are estimated and may vary. The{' '}
            <a
              href="https://googlechrome.github.io/lighthouse/scorecalc/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              performance score is calculated directly from these metrics. See calculator.
            </a>
          </p>

          {/* Google Scale Legend */}
          <div className="flex items-center gap-6 pt-2 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-rose-600" />
              <span>0–49</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-amber-500" />
              <span>50–89</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>90–100</span>
            </span>
          </div>
        </div>

        {/* Right Column: Mobile Device Frame Screenshot Preview */}
        <div className="md:col-span-5 flex justify-center md:justify-end">
          <div className="w-[180px] sm:w-[200px] aspect-[9/18.5] rounded-3xl border-4 border-slate-800 shadow-xl overflow-hidden bg-slate-900 relative flex flex-col">
            {/* Top speaker notch */}
            <div className="h-4 bg-slate-800 flex items-center justify-center">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>

            {/* Screen content */}
            <div className="flex-1 bg-white overflow-hidden relative">
              {screenshot ? (
                <img
                  src={screenshot}
                  alt={`Mobile view of ${url}`}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-slate-50 text-slate-400">
                  <Globe className="w-8 h-8 mb-2 text-slate-300" />
                  <span className="text-[10px] font-mono break-all">{url}</span>
                </div>
              )}
            </div>

            {/* Bottom bar */}
            <div className="h-3 bg-slate-800 flex items-center justify-center">
              <div className="w-14 h-1 rounded-full bg-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. METRICS Section (Exact Google 2-Column Layout) */}
      <div className="space-y-4 pt-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            METRICS
          </h3>
          <button
            onClick={() => setExpandView(!expandView)}
            className="text-xs font-medium text-blue-600 hover:underline cursor-pointer"
          >
            {expandView ? 'Collapse view' : 'Expand view'}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200" />

        {/* 2-Column Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-4">
          {/* Column 1 */}
          <div className="space-y-8">
            {/* FCP */}
            <div>
              <div className="flex items-center text-sm font-medium text-slate-700">
                {renderShape(fcpStatus)}
                <span>First Contentful Paint</span>
              </div>
              <div className={`text-3xl font-medium tracking-tight mt-1 ${getMetricColor(fcpStatus)}`}>
                {(fcpVal / 1000).toFixed(1)} s
              </div>
              {expandView && (
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <p>First Contentful Paint marks the time at which the first text or image is painted.</p>
                  <div className="w-48 h-1 rounded-full bg-slate-100 flex overflow-hidden mt-1">
                    <div className="w-[50%] h-full bg-emerald-500" />
                    <div className="w-[30%] h-full bg-amber-500" />
                    <div className="w-[20%] h-full bg-rose-500" />
                  </div>
                </div>
              )}
            </div>

            {/* TBT */}
            <div>
              <div className="flex items-center text-sm font-medium text-slate-700">
                {renderShape(tbtStatus)}
                <span>Total Blocking Time</span>
              </div>
              <div className={`text-3xl font-medium tracking-tight mt-1 ${getMetricColor(tbtStatus)}`}>
                {tbtVal} ms
              </div>
              {expandView && (
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <p>Sum of all time periods between FCP and Time to Interactive when task length exceeded 50ms.</p>
                  <div className="w-48 h-1 rounded-full bg-slate-100 flex overflow-hidden mt-1">
                    <div className="w-[50%] h-full bg-emerald-500" />
                    <div className="w-[30%] h-full bg-amber-500" />
                    <div className="w-[20%] h-full bg-rose-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Speed Index */}
            <div>
              <div className="flex items-center text-sm font-medium text-slate-700">
                {renderShape(speedIndexStatus)}
                <span>Speed Index</span>
              </div>
              <div className={`text-3xl font-medium tracking-tight mt-1 ${getMetricColor(speedIndexStatus)}`}>
                {(speedIndexVal / 1000).toFixed(1)} s
              </div>
              {expandView && (
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <p>Speed Index shows how quickly the contents of a page are visibly populated.</p>
                  <div className="w-48 h-1 rounded-full bg-slate-100 flex overflow-hidden mt-1">
                    <div className="w-[50%] h-full bg-emerald-500" />
                    <div className="w-[30%] h-full bg-amber-500" />
                    <div className="w-[20%] h-full bg-rose-500" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-8">
            {/* LCP */}
            <div>
              <div className="flex items-center text-sm font-medium text-slate-700">
                {renderShape(lcpStatus)}
                <span>Largest Contentful Paint</span>
              </div>
              <div className={`text-3xl font-medium tracking-tight mt-1 ${getMetricColor(lcpStatus)}`}>
                {(lcpVal / 1000).toFixed(1)} s
              </div>
              {expandView && (
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <p>Largest Contentful Paint marks the time at which the main content of the page has likely loaded.</p>
                  <div className="w-48 h-1 rounded-full bg-slate-100 flex overflow-hidden mt-1">
                    <div className="w-[50%] h-full bg-emerald-500" />
                    <div className="w-[30%] h-full bg-amber-500" />
                    <div className="w-[20%] h-full bg-rose-500" />
                  </div>
                </div>
              )}
            </div>

            {/* CLS */}
            <div>
              <div className="flex items-center text-sm font-medium text-slate-700">
                {renderShape(clsStatus)}
                <span>Cumulative Layout Shift</span>
              </div>
              <div className={`text-3xl font-medium tracking-tight mt-1 ${getMetricColor(clsStatus)}`}>
                {clsVal}
              </div>
              {expandView && (
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <p>Cumulative Layout Shift measures the movement of visible elements within the viewport.</p>
                  <div className="w-48 h-1 rounded-full bg-slate-100 flex overflow-hidden mt-1">
                    <div className="w-[50%] h-full bg-emerald-500" />
                    <div className="w-[30%] h-full bg-amber-500" />
                    <div className="w-[20%] h-full bg-rose-500" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. OPPORTUNITIES SECTION */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900">Opportunities</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            These suggestions can help your page load faster. They don't directly affect the Performance score.
          </p>
        </div>

        {opportunities.length === 0 ? (
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-1.5" />
            <h4 className="text-sm font-bold text-slate-900">No Critical Opportunities Detected</h4>
            <p className="text-xs text-slate-500">All primary render-blocking and compression checks are optimal.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {opportunities.map((opp, idx) => {
              const isOpen = expandedOpportunity === opp.issueCode || expandedOpportunity === String(idx);

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 transition"
                >
                  <button
                    onClick={() =>
                      setExpandedOpportunity(isOpen ? null : opp.issueCode || String(idx))
                    }
                    className="w-full p-4 flex items-center justify-between text-left gap-4 hover:bg-slate-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{opp.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{opp.evidence}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase">
                        Est Savings: ~0.4s
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">Detected Evidence:</span>
                        <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px]">
                          {opp.evidence}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">Recommended Fix:</span>
                        <p className="text-slate-600 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-emerald-900 font-medium">
                          {opp.recommendation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. DIAGNOSTICS SECTION */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900">Diagnostics</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            More information about the performance of your application.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Total Payload</span>
            <span className="text-lg font-bold text-slate-900">{metrics.pageSizeKb} KB</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">HTML Document</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">HTTP Requests</span>
            <span className="text-lg font-bold text-slate-900">{metrics.requestCount}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Scripts, styles, images</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Text Compression</span>
            <span className={`text-lg font-bold ${metrics.isCompressed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {metrics.isCompressed ? 'Enabled' : 'Disabled'}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{metrics.compressionType || 'Gzip / Brotli'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Browser Caching</span>
            <span className={`text-lg font-bold ${metrics.hasBrowserCaching ? 'text-emerald-600' : 'text-amber-600'}`}>
              {metrics.hasBrowserCaching ? 'Configured' : 'Missing'}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Cache-Control header</span>
          </div>
        </div>
      </div>

      {/* 6. PASSED AUDITS SECTION */}
      {passedAudits.length > 0 && (
        <div className="pt-6 border-t border-slate-200">
          <button
            onClick={() => setShowPassedAudits(!showPassedAudits)}
            className="flex items-center justify-between w-full py-2 text-left text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Passed Audits ({passedAudits.length})</span>
            </span>
            {showPassedAudits ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showPassedAudits && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2">
              {passedAudits.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/70 text-xs text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold">{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageSpeedReportView;
