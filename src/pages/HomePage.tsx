import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auditApi } from '../services/api.js';
import { ScanProgressBar } from '../components/ScanProgressBar.js';
import {
  Search,
  Zap,
  Smartphone,
  ShieldCheck,
  Link2,
  FileCode2,
  FileText,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Sparkles,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeScan, setActiveScan] = useState<any>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }

      const res = await auditApi.start({ url: formattedUrl, maxPages: 10 });
      if (res.data.success && res.data.data) {
        const auditId = res.data.data.auditId;
        setActiveScan(res.data.data);

        // Poll progress until complete or redirect
        const interval = setInterval(async () => {
          try {
            const progRes = await auditApi.getProgress(auditId);
            if (progRes.data.success && progRes.data.data) {
              const audit = progRes.data.data;
              setActiveScan(audit);
              if (audit.status === 'completed') {
                clearInterval(interval);
                navigate(`/report/${auditId}`);
              } else if (audit.status === 'failed') {
                clearInterval(interval);
                setError(audit.errorMessage || 'Audit failed');
                setLoading(false);
              }
            }
          } catch {
            clearInterval(interval);
            navigate(`/report/${auditId}`);
          }
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to start audit.');
      setLoading(false);
    }
  };

  const categories = [
    {
      icon: Search,
      title: 'SEO Audit',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Find missing/duplicate titles, bad H1s, canonical mismatches, missing image alt tags, OG metadata, and schema JSON-LD.',
    },
    {
      icon: Zap,
      title: 'Performance & Web Vitals',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Measure TTFB, LCP, FCP, CLS, uncompressed assets, missing gzip/brotli, render-blocking JS, and oversized images.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsiveness',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      description: 'Inspect 375px mobile & 768px tablet viewports for horizontal overflow, clipped text, and undersized tap targets.',
    },
    {
      icon: ShieldCheck,
      title: 'Security Configuration',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      description: 'Non-invasive TLS cert inspection, HSTS, CSP, X-Frame clickjacking defense, mixed content, and cookie flags.',
    },
    {
      icon: Link2,
      title: 'Broken Links Audit',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      description: 'Discover internal 404s, dead outbound links, redirect chains, and broken images with exact source pages.',
    },
    {
      icon: FileText,
      title: 'Content & Technical Health',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      description: 'Detect thin content indicators, missing HTML lang tags, robots.txt blocks, XML sitemaps, and HTTP status errors.',
    },
  ];

  const faqs = [
    {
      q: 'How does SiteAudit Pro differ from basic SEO tools?',
      a: 'Unlike simple single-page checkers that only look at meta tags, SiteAudit Pro runs a full multi-page crawler with native DNS inspection, SSL certificate validation, mobile viewport overflow detection across multiple breakpoints, and server-side Core Web Vitals diagnostics.',
    },
    {
      q: 'Will running an audit slow down or harm my website?',
      a: 'Never. SiteAudit Pro uses safe, non-invasive HTTP inspection and Playwright headless rendering with respectful rate limiting (polite 150ms delays) and SSRF safety protection. It never performs exploit testing or brute-force requests.',
    },
    {
      q: 'Can I download and share white-label PDF reports with clients?',
      a: 'Yes! Agency tier subscribers can customize PDF reports with their own agency logo, custom brand color, and personalized footer notes, making it ready to present directly to clients.',
    },
    {
      q: 'How is the Website Health Score calculated?',
      a: 'Health Scores are calculated from actual diagnostic test results across 6 weighted categories: SEO (25%), Performance (25%), Mobile Readiness (20%), Security (15%), Technical Setup (10%), and Content (5%).',
    },
    {
      q: 'Is the free website audit really free?',
      a: 'Yes! You can enter any accessible website URL and receive a free comprehensive audit of up to 10 discovered pages with an interactive prioritized action plan and downloadable PDF.',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/15 via-blue-900/10 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-8 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Next-Gen Full Website Audit & Crawler Engine</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Know What’s Wrong With Your Website.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500">
            Fix It Before Your Customers Notice.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Comprehensive SEO, speed performance, mobile layout, broken links, and security configuration diagnostics in one actionable audit report.
        </p>

        {/* Audit URL Input Form */}
        <div className="mt-10 max-w-2xl mx-auto">
          <form onSubmit={handleStartAudit} className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., example.com)"
                disabled={loading}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#0B132B] border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition shadow-xl shadow-black/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition flex items-center justify-center gap-2 group whitespace-nowrap disabled:opacity-50"
            >
              <span>{loading ? 'Auditing...' : 'Start Free Audit'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm text-left flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo link */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span>Free crawl limit: 10 pages</span>
            <span>•</span>
            <Link to="/demo" className="text-blue-400 hover:underline flex items-center gap-1 font-medium">
              <span>View live sample report</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Live scanning progress display */}
        {loading && activeScan && (
          <div className="mt-10 max-w-3xl mx-auto text-left animate-in fade-in">
            <ScanProgressBar
              progressPercent={activeScan.progressPercent || 25}
              status={activeScan.status || 'crawling'}
              stepMessage={activeScan.currentStepMessage}
              pagesDiscovered={activeScan.pagesDiscovered}
              pagesScanned={activeScan.pagesScanned}
            />
          </div>
        )}
      </section>

      {/* How Auditing Works (Live-style transparent explanation) */}
      <section className="py-16 bg-[#0B132B]/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-bold tracking-widest text-blue-400 mb-2">
              Engine Mechanics
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              How the SiteAudit Pro Analysis Pipeline Operates
            </h3>
            <p className="mt-3 text-slate-400 text-sm">
              We never fabricate dummy scores or simulated statistics. Here is the verified 4-stage pipeline that audits every accessible page:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#060B18] border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold font-mono text-base mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-white mb-2">SSRF & Network Check</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We resolve target DNS records, verify SSL certificate expiry dates, check HTTP to HTTPS redirection, and protect private network ranges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#060B18] border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold font-mono text-base mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-white mb-2">BFS Page Crawling</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The crawler reads robots.txt and XML sitemaps, traverses internal hyperlinks, normalizes URL structures, and deduplicates canonical paths.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#060B18] border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold font-mono text-base mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-white mb-2">7 Diagnostic Modules</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Each page is audited for on-page SEO, Core Web Vitals, mobile horizontal overflow at 375px/768px, security headers, dead links, and content quality.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#060B18] border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold font-mono text-base mb-4">
                04
              </div>
              <h4 className="text-base font-bold text-white mb-2">Prioritized Action Plan</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Issues are ranked by severity (Critical, High, Medium, Low) with exact evidence, technical rationale, and copy-paste recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Categories Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-blue-400 mb-2">
            Coverage
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Every Critical Aspect of Your Website, Diagnosed
          </h3>
          <p className="mt-4 text-slate-400 text-base">
            SiteAudit Pro investigates 40+ vital signals across 7 specialized audit modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0B132B]/80 border border-slate-800 hover:border-slate-700 transition hover:bg-slate-800/40"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{cat.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{cat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Clearly-Labeled Demonstration Report Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-950/40 via-slate-900 to-blue-950/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Demonstration</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Explore a Full Interactive Audit Report
            </h3>
            <p className="mt-2 text-slate-400 text-sm leading-relaxed">
              Want to see what an audit looks like before scanning your site? Browse our comprehensive sample report complete with health scoring, Web Vitals, mobile viewport findings, and prioritized action plan.
            </p>
          </div>
          <div>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition whitespace-nowrap"
            >
              <span>Open Sample Audit Report</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose SiteAudit Pro */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-blue-400 mb-2">
              Why SiteAudit Pro
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Don’t Just Guess If Your Website Is Healthy. Know It.
            </h3>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Most online checkers only test the single URL you entered. SiteAudit Pro crawls deeply through your internal pages, uncovering hidden 404s, uncompressed banners, missing canonicals, and mobile layout overflow.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Full Multi-Page Crawler</h4>
                  <p className="text-xs text-slate-400">
                    Discovers reachable pages through internal links and XML sitemaps up to configured tier limits.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Zero Non-Functional Placeholders</h4>
                  <p className="text-xs text-slate-400">
                    Every score, issue, and recommendation is calculated from actual network and DOM inspection.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">White-Label PDF Reports for Agencies</h4>
                  <p className="text-xs text-slate-400">
                    Export polished vector PDF reports styled with your agency’s branding and custom colors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B132B] border border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
              <span className="font-mono text-slate-400">Health Breakdown Preview</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                Live Engine
              </span>
            </div>
            <div className="py-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>SEO Score (25%)</span>
                  <span className="text-emerald-400">88/100</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[88%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Performance & Speed (25%)</span>
                  <span className="text-amber-400">72/100</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[72%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Mobile Readiness (20%)</span>
                  <span className="text-emerald-400">92/100</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Security Configuration (15%)</span>
                  <span className="text-emerald-400">85/100</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[85%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-20 bg-[#0B132B]/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs uppercase font-bold tracking-widest text-blue-400 mb-2">
            Plans
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Transparent Pricing for Growing Websites & Agencies
          </h3>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-12">
            Start with our generous free tier or upgrade for multi-page crawling, white-label PDF reports, and automated monitoring.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Free */}
            <div className="p-8 rounded-3xl bg-[#0B132B] border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Free Starter</h4>
                <p className="text-xs text-slate-400 mb-4">For single-site audits</p>
                <div className="text-3xl font-extrabold text-white mb-6">
                  $0 <span className="text-sm font-normal text-slate-400">/ forever</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> 10 pages per scan
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Full 7-module audit
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Prioritized action plan
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Web dashboard results
                  </li>
                </ul>
              </div>
              <Link
                to="/"
                className="w-full text-center py-3 rounded-xl border border-slate-700 hover:border-slate-600 text-white font-semibold text-sm transition"
              >
                Scan Free Now
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl bg-[#0B132B] border-2 border-blue-500 relative flex flex-col justify-between shadow-2xl shadow-blue-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Pro Consultant</h4>
                <p className="text-xs text-slate-400 mb-4">For developers & businesses</p>
                <div className="text-3xl font-extrabold text-white mb-6">
                  $29 <span className="text-sm font-normal text-slate-400">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" /> 100 pages crawled per scan
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" /> Downloadable PDF reports
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" /> Scheduled weekly monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" /> Audit comparison & diffs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" /> Email alert notifications
                  </li>
                </ul>
              </div>
              <Link
                to="/pricing"
                className="w-full text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/30"
              >
                Get Started with Pro
              </Link>
            </div>

            {/* Agency */}
            <div className="p-8 rounded-3xl bg-[#0B132B] border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Agency Enterprise</h4>
                <p className="text-xs text-slate-400 mb-4">For agencies managing clients</p>
                <div className="text-3xl font-extrabold text-white mb-6">
                  $99 <span className="text-sm font-normal text-slate-400">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> 500 pages crawled per scan
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> White-Label PDF reports
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Unlimited saved websites
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Team workspaces & API access
                  </li>
                </ul>
              </div>
              <Link
                to="/pricing"
                className="w-full text-center py-3 rounded-xl border border-slate-700 hover:border-slate-600 text-white font-semibold text-sm transition"
              >
                View Agency Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-blue-400 mb-2">
            Answers
          </h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0B132B] border border-slate-800 overflow-hidden transition"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <span className="text-sm sm:text-base font-bold text-white">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${faqOpen === idx ? 'rotate-180 text-blue-400' : ''}`}
                />
              </button>
              {faqOpen === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
