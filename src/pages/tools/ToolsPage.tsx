import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toolsApi } from '../../services/api.js';
import { PageSpeedReportView } from '../../components/PageSpeedReportView.js';
import {
  Search,
  Zap,
  Lock,
  Link2,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  Globe,
  Sparkles,
} from 'lucide-react';

export const ToolsPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Detect which tool from path
  const getToolMeta = () => {
    if (path.includes('/speed')) {
      return {
        id: 'speed',
        title: 'Website Speed & Core Web Vitals Checker',
        subtitle: 'Test server response time (TTFB), text compression, cache headers, and payload weight.',
        icon: Zap,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        apiCall: toolsApi.checkSpeed,
      };
    }
    if (path.includes('/broken-links')) {
      return {
        id: 'broken-links',
        title: 'Broken Link & Image 404 Checker',
        subtitle: 'Detect broken internal links, dead outbound links, and missing images on any webpage.',
        icon: Link2,
        color: 'text-rose-600 bg-rose-50 border-rose-200',
        apiCall: toolsApi.checkBrokenLinks,
      };
    }
    if (path.includes('/ssl')) {
      return {
        id: 'ssl',
        title: 'SSL Certificate & Expiry Checker',
        subtitle: 'Verify TLS handshake validity, Certificate Authority issuer, and expiration countdown.',
        icon: Lock,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        apiCall: toolsApi.checkSsl,
      };
    }
    if (path.includes('/mobile')) {
      return {
        id: 'mobile',
        title: 'Mobile-Friendly & Viewport Checker',
        subtitle: 'Check mobile viewport tag configuration, media queries, and layout overflow readiness.',
        icon: Smartphone,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        apiCall: toolsApi.checkMobile,
      };
    }
    if (path.includes('/security-headers')) {
      return {
        id: 'security-headers',
        title: 'Security Headers Configuration Checker',
        subtitle: 'Audit critical HTTP defense headers: HSTS, CSP, X-Frame-Options, and Referrer-Policy.',
        icon: ShieldCheck,
        color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
        apiCall: toolsApi.checkSecurityHeaders,
      };
    }
    // Default: SEO
    return {
      id: 'seo',
      title: 'Free On-Page Website SEO Checker',
      subtitle: 'Analyze title tags, meta descriptions, H1 headings, canonical tags, and image alt attributes.',
      icon: Search,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      apiCall: toolsApi.checkSeo,
    };
  };

  const tool = getToolMeta();
  const Icon = tool.icon;

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }

      const res = await tool.apiCall(formattedUrl);
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Diagnostic inspection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 sm:py-14 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 pt-2">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4 shadow-sm ${tool.color}`}>
            <Icon className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{tool.title}</h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">{tool.subtitle}</p>
        </div>

        {/* URL Input Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to inspect (e.g., example.com)"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 text-[15px] font-medium transition shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Core Web Vitals...</span>
                </>
              ) : (
                <>
                  <span>Run Diagnostic</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results View */}
        {result && (
          <>
            {tool.id === 'speed' ? (
              <PageSpeedReportView
                url={url.startsWith('http') ? url : `https://${url}`}
                score={result.score}
                metrics={result.metrics}
                issues={result.issues}
                screenshot={result.screenshot}
              />
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-blue-600">
                      Diagnostic Complete
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">Inspection Findings</h3>
                  </div>
                  {result.score !== undefined && (
                    <div className="text-right">
                      <span className="text-4xl font-black text-slate-900">{result.score}</span>
                      <span className="text-xs text-slate-400 font-bold">/100</span>
                    </div>
                  )}
                </div>

                {/* Render specific tool details */}
                {tool.id === 'ssl' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block mb-1">Status</span>
                      <span className={`text-sm font-extrabold ${result.valid ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {result.valid ? 'VALID & TRUSTED' : 'INVALID / UNTRUSTED'}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block mb-1">Issuer</span>
                      <span className="text-sm font-extrabold text-slate-900">{result.issuer || 'N/A'}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block mb-1">Days Remaining</span>
                      <span className="text-sm font-extrabold text-blue-600">
                        {result.daysRemaining !== undefined ? `${result.daysRemaining} days` : 'N/A'}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block mb-1">Expiration Date</span>
                      <span className="text-sm font-extrabold text-slate-700">
                        {result.validTo ? new Date(result.validTo).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Issues List from diagnostic */}
                {result.issues && result.issues.length > 0 && (
                  <div className="space-y-3 pt-4">
                    <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">
                      Diagnostic Breakdown & Recommendations
                    </h4>
                    {result.issues.map((iss: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                              iss.severity === 'critical'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : iss.severity === 'high'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : iss.severity === 'passed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {iss.severity}
                          </span>
                          <span className="font-bold text-slate-900">{iss.title}</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">{iss.evidence}</p>
                        <p className="text-emerald-700 font-semibold text-xs mt-2">Recommended Fix: {iss.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Full Audit CTA */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Want to audit your entire website?</h4>
                    <p className="text-xs text-slate-500">Run our full 7-module BFS crawler on up to 10 pages for free.</p>
                  </div>
                  <Link
                    to="/"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition whitespace-nowrap"
                  >
                    Start Full Website Audit
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
