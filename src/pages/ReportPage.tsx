import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { auditApi, API } from '../services/api.js';
import { AuditRecord, AuditIssueItem, PrioritizedRecommendation, PageAuditItem } from '../types/index.js';
import { HealthGauge } from '../components/HealthGauge.js';
import { ScoreCard } from '../components/ScoreCard.js';
import { IssueCard } from '../components/IssueCard.js';
import { ScanProgressBar } from '../components/ScanProgressBar.js';
import { PageMetadataInspector } from '../components/PageMetadataInspector.js';
import { CategoryDetailInspector } from '../components/CategoryDetailInspector.js';
import { BusinessImpactCalculator } from '../components/BusinessImpactCalculator.js';
import { DeveloperBriefModal } from '../components/DeveloperBriefModal.js';
import {
  Download,
  Mail,
  RefreshCw,
  GitCompare,
  Search,
  Zap,
  Smartphone,
  ShieldCheck,
  Link2,
  FileText,
  Settings2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Globe,
  Clock,
  Layers,
  FileDown,
  FileSpreadsheet,
  Swords,
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [audit, setAudit] = useState<AuditRecord | null>(null);
  const [actionPlan, setActionPlan] = useState<PrioritizedRecommendation[]>([]);
  const [issues, setIssues] = useState<AuditIssueItem[]>([]);
  const [pages, setPages] = useState<PageAuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active tab state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'seo' | 'performance' | 'mobile' | 'security' | 'broken_links' | 'content' | 'technical' | 'pages'
  >('overview');

  // Issue filter state
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [issueSearch, setIssueSearch] = useState<string>('');

  // Page table filter state
  const [pageSearch, setPageSearch] = useState<string>('');
  const [pageStatusFilter, setPageStatusFilter] = useState<'all' | '200' | 'error' | 'missing_meta'>('all');

  // Developer Brief modal state
  const [showDevBriefModal, setShowDevBriefModal] = useState(false);

  // Email modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');

  const fetchAuditData = async () => {
    if (!id) return;
    try {
      let res;
      if (id === 'demo') {
        res = await auditApi.getDemo();
      } else {
        res = await auditApi.getById(id);
      }

      if (res.data.success && res.data.data) {
        const auditData = res.data.data.audit;
        setAudit(auditData);
        setActionPlan(res.data.data.actionPlan || []);

        const [issuesRes, pagesRes] = await Promise.all([
          auditApi.getIssues(auditData._id),
          auditApi.getPages(auditData._id),
        ]);

        if (issuesRes.data.success) {
          setIssues(issuesRes.data.data || []);
        }
        if (pagesRes.data.success) {
          setPages(pagesRes.data.data || []);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load audit report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, [id]);

  useEffect(() => {
    if (!audit || audit.status === 'completed' || audit.status === 'failed') return;

    const interval = setInterval(async () => {
      try {
        const progRes = await auditApi.getProgress(audit._id);
        if (progRes.data.success && progRes.data.data) {
          const updated = progRes.data.data;
          setAudit((prev) => (prev ? { ...prev, ...updated } : prev));
          if (updated.status === 'completed') {
            clearInterval(interval);
            fetchAuditData();
          }
        }
      } catch {
        // ignore
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [audit?.status]);

  const handleRescan = async () => {
    if (!audit) return;
    setLoading(true);
    try {
      const res = await auditApi.rescan(audit._id);
      if (res.data.success && res.data.data) {
        navigate(`/report/${res.data.data.auditId}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to trigger rescan');
      setLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audit || !emailInput) return;
    setEmailSending(true);
    setEmailSuccess('');
    try {
      const res = await auditApi.emailReport(audit._id, emailInput);
      setEmailSuccess(res.data.message || 'Report sent successfully!');
      setTimeout(() => {
        setEmailModalOpen(false);
        setEmailSuccess('');
      }, 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to email report');
    } finally {
      setEmailSending(false);
    }
  };

  const handleToggleResolved = async (issueId: string) => {
    try {
      const res = await API.patch(`/audits/issues/${issueId}/toggle-resolved`);
      if (res.data.success) {
        setIssues((prev) =>
          prev.map((iss) => (iss._id === issueId ? { ...iss, resolved: !iss.resolved } : iss))
        );
      }
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center animate-spin mb-4">
          <RefreshCw className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Loading Diagnostic Report...</h3>
        <p className="text-xs text-slate-500 mt-1">Retrieving multi-page crawl data and category scores</p>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Audit Report Unavailable</h3>
        <p className="text-sm text-slate-500 mb-6">{error || 'Could not locate audit record.'}</p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
        >
          Return to Scanner
        </Link>
      </div>
    );
  }

  const filteredIssues = issues.filter((item) => {
    if (activeTab === 'seo' && item.category !== 'seo') return false;
    if (activeTab === 'performance' && item.category !== 'performance') return false;
    if (activeTab === 'mobile' && item.category !== 'mobile') return false;
    if (activeTab === 'security' && item.category !== 'security') return false;
    if (activeTab === 'broken_links' && item.category !== 'broken_link') return false;
    if (activeTab === 'content' && item.category !== 'content') return false;
    if (activeTab === 'technical' && item.category !== 'technical') return false;

    if (selectedSeverity !== 'all' && item.severity !== selectedSeverity) return false;

    if (issueSearch.trim()) {
      const q = issueSearch.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.evidence.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        item.issueCode.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const filteredPages = pages.filter((p) => {
    if (pageStatusFilter === '200' && p.statusCode !== 200) return false;
    if (pageStatusFilter === 'error' && p.statusCode < 400) return false;
    if (pageStatusFilter === 'missing_meta' && p.title && p.metaDescription) return false;

    if (pageSearch.trim()) {
      const q = pageSearch.toLowerCase();
      return (
        p.url.toLowerCase().includes(q) ||
        p.path.toLowerCase().includes(q) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.metaDescription && p.metaDescription.toLowerCase().includes(q)) ||
        (p.h1Text && p.h1Text.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Demo Notice Banner */}
        {audit.isDemo && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-blue-900 font-medium">
              <Info className="w-5 h-5 flex-shrink-0 text-blue-600" />
              <span>
                This is a clearly-labeled <strong>interactive demonstration report</strong> showcasing full diagnostic results.
              </span>
            </div>
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold whitespace-nowrap shadow-sm text-xs transition"
            >
              Audit Your Own URL
            </Link>
          </div>
        )}

        {/* Real-time Progress Bar if running */}
        {audit.status !== 'completed' && audit.status !== 'failed' && (
          <div className="mb-8">
            <ScanProgressBar
              progressPercent={audit.progressPercent || 25}
              status={audit.status}
              stepMessage={audit.currentStepMessage}
              pagesDiscovered={audit.pagesDiscovered}
              pagesScanned={audit.pagesScanned}
            />
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">
                  Website Audit Report
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(audit.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3 flex-wrap">
                <span>{new URL(audit.targetUrl).hostname}</span>
                <a
                  href={audit.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-600 transition"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </h1>
              <p className="text-xs font-mono text-slate-500 mt-1 truncate max-w-xl">{audit.targetUrl}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to={`/battle?urlA=${encodeURIComponent(audit.targetUrl)}`}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center gap-1.5"
                title="Launch head-to-head battle against a competitor"
              >
                <Swords className="w-4 h-4" />
                <span>Battle Competitor</span>
              </Link>

              <button
                onClick={() => setShowDevBriefModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center gap-1.5"
                title="Generate Markdown task brief for developers (GitHub/Jira/Upwork)"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Developer Brief</span>
              </button>

              <a
                href={auditApi.getPdfUrl(audit._id)}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                <span>Download PDF</span>
              </a>

              <a
                href={auditApi.getCsvUrl(audit._id)}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export CSV</span>
              </a>

              <button
                onClick={() => setEmailModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Email</span>
              </button>

              <button
                onClick={handleRescan}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-4 h-4 text-slate-600" />
                <span>Re-scan</span>
              </button>
            </div>
          </div>

          {/* Executive Highlights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
            {/* Health Score Gauge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50/60 rounded-2xl border border-slate-100">
              <HealthGauge score={audit.healthScore} size={170} strokeWidth={14} />
            </div>

            {/* Summary Badges & Stats */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium block mb-1">Pages Crawled</span>
                <span className="text-2xl font-black text-slate-900 font-mono">{audit.pagesScanned}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  of {audit.pagesDiscovered} discovered
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-xs text-rose-700 font-bold block mb-1">Critical Issues</span>
                <span className="text-2xl font-black text-rose-700 font-mono">
                  {audit.issuesSummary.critical}
                </span>
                <span className="text-[11px] text-rose-500 block mt-0.5">Fix immediately</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-700 font-bold block mb-1">High Priority</span>
                <span className="text-2xl font-black text-amber-700 font-mono">
                  {audit.issuesSummary.high}
                </span>
                <span className="text-[11px] text-amber-600 block mt-0.5">Needs attention</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-700 font-bold block mb-1">Passed Checks</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">
                  {audit.issuesSummary.passed}
                </span>
                <span className="text-[11px] text-emerald-600 block mt-0.5">Verified healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <ScoreCard
            title="SEO Health"
            weight="25%"
            score={audit.categoryScores.seo}
            icon={Search}
            description="Meta tags, headings, canonicals, alt attributes & schema"
            active={activeTab === 'seo'}
            onClick={() => setActiveTab('seo')}
            isLoading={audit.status !== 'completed' && audit.status !== 'failed'}
          />
          <ScoreCard
            title="Performance & Speed"
            weight="25%"
            score={audit.categoryScores.performance}
            icon={Zap}
            description="TTFB, FCP, LCP, CLS, payload weight, compression & caching"
            active={activeTab === 'performance'}
            onClick={() => setActiveTab('performance')}
            isLoading={audit.status !== 'completed' && audit.status !== 'failed'}
          />
          <ScoreCard
            title="Mobile Readiness"
            weight="20%"
            score={audit.categoryScores.mobile}
            icon={Smartphone}
            description="375px & 768px viewports, horizontal overflow & touch targets"
            active={activeTab === 'mobile'}
            onClick={() => setActiveTab('mobile')}
            isLoading={audit.status !== 'completed' && audit.status !== 'failed'}
          />
          <ScoreCard
            title="Security Setup"
            weight="15%"
            score={audit.categoryScores.security}
            icon={ShieldCheck}
            description="TLS certificate validity, HSTS, CSP, X-Frame & mixed content"
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
            isLoading={audit.status !== 'completed' && audit.status !== 'failed'}
          />
          <ScoreCard
            title="Technical Health"
            weight="10%"
            score={audit.categoryScores.technical}
            icon={Settings2}
            description="Robots.txt, XML sitemaps, clean URLs, favicon & HTTP codes"
            active={activeTab === 'technical'}
            onClick={() => setActiveTab('technical')}
            isLoading={audit.status !== 'completed' && audit.status !== 'failed'}
          />
          <ScoreCard
            title="Content Structure"
            weight="5%"
            score={audit.categoryScores.content}
            icon={FileText}
            description="Thin text indicator, HTML language attributes & link equity"
            active={activeTab === 'content'}
            onClick={() => setActiveTab('content')}
            isLoading={audit.status !== 'completed' && audit.status !== 'failed'}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 border-b border-slate-200">
          {[
            { id: 'overview', label: 'Action Plan & Overview' },
            { id: 'seo', label: 'SEO Issues' },
            { id: 'performance', label: 'Performance & Speed' },
            { id: 'mobile', label: 'Mobile Responsive' },
            { id: 'security', label: 'Security & Headers' },
            { id: 'broken_links', label: 'Broken Links' },
            { id: 'content', label: 'Content Structure' },
            { id: 'technical', label: 'Technical Infrastructure' },
            { id: 'pages', label: `Audited Pages (${pages.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Overview (Prioritized Action Plan & Revenue ROI Calculator) */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <BusinessImpactCalculator
              healthScore={audit.healthScore}
              criticalIssuesCount={audit.issuesSummary.critical}
              averageResponseTimeMs={pages[0]?.responseTimeMs || 450}
            />

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span>Prioritized Action Plan</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-semibold border border-blue-200">
                      Ranked by Business Impact
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Resolve highest impact defects first to accelerate Core Web Vitals and organic visibility.
                  </p>
                </div>
              </div>

              {actionPlan.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-900">No Critical Action Items Found!</h4>
                  <p className="text-xs text-slate-500 mt-1">Your website demonstrates outstanding health across all audit categories.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {actionPlan.map((item) => (
                    <div
                      key={item.priority}
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                            #{item.priority}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h4>
                        </div>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                            item.severity === 'critical'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : item.severity === 'high'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.severity}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                        <strong className="text-slate-800">Why it matters:</strong> {item.whyItMatters}
                      </p>

                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium leading-relaxed">
                        <strong>Fix:</strong> {item.recommendation}
                      </div>

                      {item.affectedUrls.length > 0 && (
                        <div className="mt-3 text-[11px] font-mono text-slate-500 flex flex-wrap gap-2 items-center">
                          <span>Sample URL:</span>
                          <span className="text-blue-600 font-medium truncate max-w-md">{item.affectedUrls[0]}</span>
                          {item.affectedUrls.length > 1 && (
                            <span className="text-slate-400">+{item.affectedUrls.length - 1} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* On-Page SEO & Metadata Inspector (Titles, Descriptions, Character Counts) */}
            {pages.length > 0 && (
              <PageMetadataInspector pages={pages} targetUrl={audit.targetUrl} />
            )}
          </div>
        )}

        {/* Tab: Audited Pages Explorer */}
        {activeTab === 'pages' && (
          <div className="space-y-8">
            {pages.length > 0 && (
              <PageMetadataInspector pages={pages} targetUrl={audit.targetUrl} />
            )}

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Crawled Pages & Metadata Table</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Individual page titles, meta descriptions, character lengths, headings, and HTTP response stats.
                  </p>
                </div>
              </div>

              {/* Pages Search and Filter Bar */}
              <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={pageSearch}
                    onChange={(e) => setPageSearch(e.target.value)}
                    placeholder="Search pages by URL, Title, or Meta Description..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {[
                    { id: 'all', label: 'All Pages' },
                    { id: '200', label: '200 OK' },
                    { id: 'error', label: 'Errors (4xx/5xx)' },
                    { id: 'missing_meta', label: 'Missing Meta Tags' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setPageStatusFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                        pageStatusFilter === f.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">Path / URL</th>
                      <th className="p-3.5">Page Title & Length</th>
                      <th className="p-3.5">Meta Description & Length</th>
                      <th className="p-3.5">H1 Heading</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Word Count</th>
                      <th className="p-3.5 rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPages.map((p) => {
                      const tLen = p.title?.trim().length || 0;
                      const dLen = p.metaDescription?.trim().length || 0;
                      const hLen = p.h1Text?.trim().length || 0;

                      return (
                        <tr key={p._id} className="hover:bg-slate-50/80 transition align-top">
                          <td className="p-3.5 font-mono text-slate-800 max-w-[200px]">
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 font-semibold hover:underline block truncate"
                            >
                              {p.path}
                            </a>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {p.responseTimeMs}ms • {(p.pageSizeBytes / 1024).toFixed(1)} KB
                            </span>
                          </td>

                          {/* Page Title + Character Count */}
                          <td className="p-3.5 max-w-[240px]">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                                  tLen === 0
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : tLen >= 50 && tLen <= 60
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {tLen === 0 ? 'Missing Title' : `${tLen} chars`}
                              </span>
                            </div>
                            <p className="text-slate-800 font-medium text-xs line-clamp-2" title={p.title}>
                              {p.title || <span className="text-rose-500 italic">No &lt;title&gt;</span>}
                            </p>
                          </td>

                          {/* Meta Description + Character Count */}
                          <td className="p-3.5 max-w-[280px]">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                                  dLen === 0
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : dLen >= 140 && dLen <= 160
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {dLen === 0 ? 'Missing Description' : `${dLen} chars`}
                              </span>
                            </div>
                            <p className="text-slate-600 text-xs line-clamp-2" title={p.metaDescription}>
                              {p.metaDescription || <span className="text-rose-500 italic">No description tag</span>}
                            </p>
                          </td>

                          {/* H1 Heading */}
                          <td className="p-3.5 max-w-[180px]">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                                  p.h1Count === 1
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : p.h1Count === 0
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {p.h1Count === 1 ? '1 H1' : p.h1Count === 0 ? '0 H1' : `${p.h1Count} H1s`}
                                {hLen > 0 ? ` (${hLen}c)` : ''}
                              </span>
                            </div>
                            <p className="text-slate-700 text-xs line-clamp-2 font-medium" title={p.h1Text || ''}>
                              {p.h1Text || (p.h1Count > 0 ? `${p.h1Count} heading(s)` : <span className="text-slate-400 italic">None</span>)}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                                p.statusCode === 200
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {p.statusCode}
                            </span>
                          </td>

                          {/* Word Count & Alt */}
                          <td className="p-3.5 font-mono text-slate-700">
                            <div>{p.wordCount || 0} w</div>
                            <span className="text-[10px] text-slate-400">
                              {p.missingAltCount > 0 ? `${p.missingAltCount} no-alt` : 'Alt OK'}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="p-3.5">
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-blue-600 p-1 inline-block"
                              title="Open live URL"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Category Specific Tab: Issues List with Filtering */}
        {activeTab !== 'overview' && activeTab !== 'pages' && (
          <div className="space-y-6">
            {/* Show Page Metadata Inspector on SEO Tab */}
            {activeTab === 'seo' && pages.length > 0 && (
              <PageMetadataInspector pages={pages} targetUrl={audit.targetUrl} />
            )}

            {/* Show Category Detail Inspector for Performance, Security, Mobile, Broken Links */}
            {(activeTab === 'performance' || activeTab === 'security' || activeTab === 'mobile' || activeTab === 'broken_links') && (
              <CategoryDetailInspector category={activeTab} audit={audit} pages={pages} />
            )}

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={issueSearch}
                  onChange={(e) => setIssueSearch(e.target.value)}
                  placeholder="Search issues, evidence, or URLs..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {['all', 'critical', 'high', 'medium', 'low', 'passed'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-3 py-1.5 rounded-lg capitalize font-bold transition whitespace-nowrap ${
                      selectedSeverity === sev
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Issues Count */}
            <div className="text-xs text-slate-500 flex items-center justify-between px-1">
              <span>Showing {filteredIssues.length} issue(s)</span>
              <span className="font-mono uppercase text-[10px] text-blue-600 font-bold">{activeTab.replace('_', ' ')} MODULE</span>
            </div>

            {/* Issue Cards */}
            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                No matching issues found for the selected filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredIssues.map((issue) => (
                  <IssueCard
                    key={issue._id}
                    issue={issue}
                    onToggleResolved={handleToggleResolved}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Email Report Modal */}
        {emailModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Email Website Audit Report</h3>
              <p className="text-xs text-slate-500 mb-4">
                Send the full executive findings and PDF report link for <strong>{new URL(audit.targetUrl).hostname}</strong>.
              </p>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Recipient Email</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="colleague@agency.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                {emailSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    {emailSuccess}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEmailModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={emailSending}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition disabled:opacity-50"
                  >
                    {emailSending ? 'Sending...' : 'Send Audit Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Developer Brief Modal */}
        {showDevBriefModal && (
          <DeveloperBriefModal
            audit={audit}
            actionPlan={actionPlan}
            onClose={() => setShowDevBriefModal(false)}
          />
        )}
      </div>
    </div>
  );
};
