import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toolsApi } from '../../services/api.js';
import {
  Search,
  Zap,
  Lock,
  Link2,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
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
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        apiCall: toolsApi.checkSpeed,
      };
    }
    if (path.includes('/broken-links')) {
      return {
        id: 'broken-links',
        title: 'Broken Link & Image 404 Checker',
        subtitle: 'Detect broken internal links, dead outbound links, and missing images on any webpage.',
        icon: Link2,
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        apiCall: toolsApi.checkBrokenLinks,
      };
    }
    if (path.includes('/ssl')) {
      return {
        id: 'ssl',
        title: 'SSL Certificate & Expiry Checker',
        subtitle: 'Verify TLS handshake validity, Certificate Authority issuer, and expiration countdown.',
        icon: Lock,
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        apiCall: toolsApi.checkSsl,
      };
    }
    if (path.includes('/mobile')) {
      return {
        id: 'mobile',
        title: 'Mobile-Friendly & Viewport Checker',
        subtitle: 'Check mobile viewport tag configuration, media queries, and layout overflow readiness.',
        icon: Smartphone,
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        apiCall: toolsApi.checkMobile,
      };
    }
    if (path.includes('/security-headers')) {
      return {
        id: 'security-headers',
        title: 'Security Headers Configuration Checker',
        subtitle: 'Audit critical HTTP defense headers: HSTS, CSP, X-Frame-Options, and Referrer-Policy.',
        icon: ShieldCheck,
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        apiCall: toolsApi.checkSecurityHeaders,
      };
    }
    // Default: SEO
    return {
      id: 'seo',
      title: 'Free On-Page Website SEO Checker',
      subtitle: 'Analyze title tags, meta descriptions, H1 headings, canonical tags, and image alt attributes.',
      icon: Search,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${tool.color}`}>
          <Icon className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{tool.title}</h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400">{tool.subtitle}</p>
      </div>

      {/* URL Input Form */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-10">
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to analyze (e.g., example.com)"
            className="flex-1 px-4 py-3.5 bg-[#060B18] border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="py-3.5 px-7 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
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
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase font-mono text-slate-400">Diagnostic Complete</span>
              <h3 className="text-xl font-bold text-white mt-1">Inspection Findings</h3>
            </div>
            {result.score !== undefined && (
              <div className="text-right">
                <span className="text-3xl font-black text-white">{result.score}</span>
                <span className="text-xs text-slate-400 font-mono">/100</span>
              </div>
            )}
          </div>

          {/* Render specific tool details */}
          {tool.id === 'ssl' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800">
                <span className="text-slate-400 block mb-1">Status</span>
                <span className={`text-sm font-bold ${result.valid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.valid ? 'VALID & TRUSTED' : 'INVALID / UNTRUSTED'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800">
                <span className="text-slate-400 block mb-1">Issuer</span>
                <span className="text-sm font-bold text-white">{result.issuer || 'N/A'}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800">
                <span className="text-slate-400 block mb-1">Days Remaining</span>
                <span className="text-sm font-bold text-blue-400">
                  {result.daysRemaining !== undefined ? `${result.daysRemaining} days` : 'N/A'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800">
                <span className="text-slate-400 block mb-1">Expiration Date</span>
                <span className="text-sm font-bold text-slate-200">
                  {result.validTo ? new Date(result.validTo).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          )}

          {tool.id === 'speed' && result.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800">
                <span className="text-slate-400 block mb-1">TTFB Response</span>
                <span className="text-base font-bold text-emerald-400">{result.metrics.ttfbMs}ms</span>
              </div>
              <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800">
                <span className="text-slate-400 block mb-1">Page Payload</span>
                <span className="text-base font-bold text-blue-400">{result.metrics.pageSizeKb} KB</span>
              </div>
              <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800">
                <span className="text-slate-400 block mb-1">Text Compression</span>
                <span className="text-base font-bold text-white">
                  {result.metrics.isCompressed ? (result.metrics.compressionType || 'Enabled') : 'None'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800">
                <span className="text-slate-400 block mb-1">Browser Caching</span>
                <span className="text-base font-bold text-white">
                  {result.metrics.hasBrowserCaching ? 'Configured' : 'Missing'}
                </span>
              </div>
            </div>
          )}

          {/* Issues List from diagnostic */}
          {result.issues && result.issues.length > 0 && (
            <div className="space-y-3 pt-4">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Detected Recommendations
              </h4>
              {result.issues.map((iss: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#060B18] border border-slate-800 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        iss.severity === 'critical'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : iss.severity === 'high'
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                          : iss.severity === 'passed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {iss.severity}
                    </span>
                    <span className="font-bold text-white">{iss.title}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{iss.evidence}</p>
                  <p className="text-emerald-400 font-medium text-xs mt-2">Fix: {iss.recommendation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Full Audit CTA */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Want to audit the entire website?</h4>
              <p className="text-xs text-slate-400">Run our full 7-module BFS crawler on up to 10 pages for free.</p>
            </div>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition whitespace-nowrap"
            >
              Start Full Website Audit
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

