import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { auditApi } from '../services/api.js';
import { AuditRecord, AuditIssueItem, PrioritizedRecommendation, PageAuditItem } from '../types/index.js';
import { HealthGauge } from '../components/HealthGauge.js';
import { ScoreCard } from '../components/ScoreCard.js';
import { IssueCard } from '../components/IssueCard.js';
import { ScanProgressBar } from '../components/ScanProgressBar.js';
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

  // Email modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');

  const fetchAuditData = async () => {
    if (!id) return;
    try {
      // If demo route or 'demo' id
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

        // Fetch issues and pages in parallel
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

  // If scan is still running, poll every 2s
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center animate-spin mb-4">
          <RefreshCw className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Loading Audit Diagnostic Report...</h3>
        <p className="text-xs text-slate-400 mt-1">Inspecting multi-page crawl and category scores</p>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Audit Report Unavailable</h3>
        <p className="text-sm text-slate-400 mb-6">{error || 'Could not locate audit record.'}</p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition"
        >
          Return to Scanner
        </Link>
      </div>
    );
  }

  // Filter issues based on active category tab, severity, and search term
  const filteredIssues = issues.filter((item) => {
    // Tab filter
    if (activeTab === 'seo' && item.category !== 'seo') return false;
    if (activeTab === 'performance' && item.category !== 'performance') return false;
    if (activeTab === 'mobile' && item.category !== 'mobile') return false;
    if (activeTab === 'security' && item.category !== 'security') return false;
    if (activeTab === 'broken_links' && item.category !== 'broken_link') return false;
    if (activeTab === 'content' && item.category !== 'content') return false;
    if (activeTab === 'technical' && item.category !== 'technical') return false;

    // Severity filter
    if (selectedSeverity !== 'all' && item.severity !== selectedSeverity) return false;

    // Search filter
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Demo Notice Banner (if demonstration data) */}
      {audit.isDemo && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-blue-300 font-medium">
            <Info className="w-5 h-5 flex-shrink-0 text-blue-400" />
            <span>
              This is a clearly-labeled <strong>interactive demonstration report</strong> showcasing full SiteAudit Pro diagnostic capabilities.
            </span>
          </div>
          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold whitespace-nowrap shadow-md text-xs transition"
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
      <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">
                Website Audit Report
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
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

            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 flex-wrap">
              <span>{new URL(audit.targetUrl).hostname}</span>
              <a
                href={audit.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1 truncate max-w-xl">{audit.targetUrl}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`/api/audits/${audit._id}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF Report</span>
            </a>

            <button
              onClick={() => setEmailModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Email</span>
            </button>

            <button
              onClick={handleRescan}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Re-scan</span>
            </button>
          </div>
        </div>

        {/* Executive Highlights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
          {/* Health Score Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-[#060B18]/60 rounded-2xl border border-slate-800/80">
            <HealthGauge score={audit.healthScore} size={170} strokeWidth={14} />
          </div>

          {/* Summary Badges & Stats */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#060B18]/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Pages Crawled</span>
              <span className="text-2xl font-black text-white font-mono">{audit.pagesScanned}</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                of {audit.pagesDiscovered} discovered
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
              <span className="text-xs text-rose-400 font-bold block mb-1">Critical Issues</span>
              <span className="text-2xl font-black text-rose-400 font-mono">
                {audit.issuesSummary.critical}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Fix immediately</span>
            </div>

            <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20">
              <span className="text-xs text-orange-400 font-bold block mb-1">High Priority</span>
              <span className="text-2xl font-black text-orange-400 font-mono">
                {audit.issuesSummary.high}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Urgent attention</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <span className="text-xs text-emerald-400 font-bold block mb-1">Passed Checks</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {audit.issuesSummary.passed}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Verified healthy</span>
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
        />
        <ScoreCard
          title="Performance & Speed"
          weight="25%"
          score={audit.categoryScores.performance}
          icon={Zap}
          description="TTFB, FCP, LCP, CLS, payload weight, compression & caching"
          active={activeTab === 'performance'}
          onClick={() => setActiveTab('performance')}
        />
        <ScoreCard
          title="Mobile Readiness"
          weight="20%"
          score={audit.categoryScores.mobile}
          icon={Smartphone}
          description="375px & 768px viewports, horizontal overflow & touch targets"
          active={activeTab === 'mobile'}
          onClick={() => setActiveTab('mobile')}
        />
        <ScoreCard
          title="Security Setup"
          weight="15%"
          score={audit.categoryScores.security}
          icon={ShieldCheck}
          description="TLS certificate validity, HSTS, CSP, X-Frame & mixed content"
          active={activeTab === 'security'}
          onClick={() => setActiveTab('security')}
        />
        <ScoreCard
          title="Technical Health"
          weight="10%"
          score={audit.categoryScores.technical}
          icon={Settings2}
          description="Robots.txt, XML sitemaps, clean URLs, favicon & HTTP codes"
          active={activeTab === 'technical'}
          onClick={() => setActiveTab('technical')}
        />
        <ScoreCard
          title="Content Structure"
          weight="5%"
          score={audit.categoryScores.content}
          icon={FileText}
          description="Thin text indicator, HTML language attributes & link equity"
          active={activeTab === 'content'}
          onClick={() => setActiveTab('content')}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'overview', label: 'Action Plan & Overview' },
          { id: 'seo', label: 'SEO Issues' },
          { id: 'performance', label: 'Performance & Speed' },
          { id: 'mobile', label: 'Mobile Responsive' },
          { id: 'security', label: 'Security Headers & SSL' },
          { id: 'broken_links', label: 'Broken Links' },
          { id: 'content', label: 'Content Structure' },
          { id: 'technical', label: 'Technical Infrastructure' },
          { id: 'pages', label: `Audited Pages (${pages.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview (Prioritized Action Plan) */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Prioritized Action Plan Section */}
          <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>Prioritized Action Plan</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
                    Ranked by Business Impact
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fix the highest impact issues first to rapidly boost search rankings, Core Web Vitals, and security.
                </p>
              </div>
            </div>

            {actionPlan.length === 0 ? (
              <div className="p-8 text-center bg-[#060B18] rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white">No Critical Action Items Found!</h4>
                <p className="text-xs text-slate-400 mt-1">Your website demonstrates outstanding health across all audit modules.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {actionPlan.map((item) => (
                  <div
                    key={item.priority}
                    className="p-5 rounded-2xl bg-[#060B18] border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                          #{item.priority}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white">{item.title}</h4>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                          item.severity === 'critical'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : item.severity === 'high'
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                      <strong className="text-slate-200">Why it matters:</strong> {item.whyItMatters}
                    </p>

                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-300 font-medium leading-relaxed">
                      <strong>Fix:</strong> {item.recommendation}
                    </div>

                    {item.affectedUrls.length > 0 && (
                      <div className="mt-3 text-[11px] font-mono text-slate-500 flex flex-wrap gap-2 items-center">
                        <span>Sample URL:</span>
                        <span className="text-blue-400 truncate max-w-md">{item.affectedUrls[0]}</span>
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
        </div>
      )}

      {/* Tab: Audited Pages Explorer */}
      {activeTab === 'pages' && (
        <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-white">Crawled Pages Explorer</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Individual page performance, response times, and status codes discovered during BFS crawl.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060B18] text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Path / URL</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Response Time</th>
                  <th className="p-3.5">Page Size</th>
                  <th className="p-3.5">H1s</th>
                  <th className="p-3.5">Images (No Alt)</th>
                  <th className="p-3.5 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pages.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono text-slate-300 max-w-xs truncate">
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                        {p.path}
                      </a>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          p.statusCode === 200
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {p.statusCode}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">{p.responseTimeMs}ms</td>
                    <td className="p-3.5 font-mono text-slate-300">{(p.pageSizeBytes / 1024).toFixed(1)} KB</td>
                    <td className="p-3.5 font-mono text-slate-300">{p.h1Count}</td>
                    <td className="p-3.5 font-mono">
                      {p.missingAltCount > 0 ? (
                        <span className="text-rose-400 font-bold">{p.missingAltCount} missing</span>
                      ) : (
                        <span className="text-emerald-400">All OK</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white p-1 inline-block"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Specific Tab: Issues List with Filtering */}
      {activeTab !== 'overview' && activeTab !== 'pages' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={issueSearch}
                onChange={(e) => setIssueSearch(e.target.value)}
                placeholder="Search issues, evidence, or URLs..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['all', 'critical', 'high', 'medium', 'low', 'passed'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-bold transition whitespace-nowrap ${
                    selectedSeverity === sev
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Issues Count */}
          <div className="text-xs text-slate-400 flex items-center justify-between px-1">
            <span>Showing {filteredIssues.length} issue(s)</span>
            <span className="font-mono uppercase text-[10px] text-blue-400">{activeTab.replace('_', ' ')} MODULE</span>
          </div>

          {/* Issue Cards */}
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center bg-[#0B132B] rounded-2xl border border-slate-800 text-slate-400 text-sm">
              No matching issues found for the selected filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <IssueCard key={issue._id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Email Report Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">Email Website Audit Report</h3>
            <p className="text-xs text-slate-400 mb-4">
              Send the full executive findings and PDF link for <strong>{new URL(audit.targetUrl).hostname}</strong>.
            </p>

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Recipient Email</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="colleague@agency.com"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {emailSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                  {emailSuccess}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailSending}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
                >
                  {emailSending ? 'Sending...' : 'Send Audit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

