import React, { useState, useEffect } from 'react';
import { toolsApi } from '../services/api.js';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Swords,
  Trophy,
  Zap,
  Search,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Flame,
  Globe,
  Share2,
  Sparkles,
} from 'lucide-react';

export const CompetitorBattlePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [urlA, setUrlA] = useState('');
  const [urlB, setUrlB] = useState('');
  const [loading, setLoading] = useState(false);
  const [battleData, setBattleData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const paramA = searchParams.get('urlA');
    const paramB = searchParams.get('urlB');
    if (paramA) setUrlA(paramA);
    if (paramB) setUrlB(paramB);
    if (paramA && paramB) {
      handleStartBattle(undefined, paramA, paramB);
    }
  }, [searchParams]);

  const handleStartBattle = async (e?: React.FormEvent, customA?: string, customB?: string) => {
    if (e) e.preventDefault();
    const targetA = customA || urlA;
    const targetB = customB || urlB;

    if (!targetA.trim() || !targetB.trim()) {
      setError('Please enter both your website URL and competitor website URL');
      return;
    }

    setLoading(true);
    setError('');
    setBattleData(null);

    try {
      let formattedA = targetA.trim();
      if (!formattedA.startsWith('http://') && !formattedA.startsWith('https://')) {
        formattedA = 'https://' + formattedA;
      }
      let formattedB = targetB.trim();
      if (!formattedB.startsWith('http://') && !formattedB.startsWith('https://')) {
        formattedB = 'https://' + formattedB;
      }

      setUrlA(formattedA);
      setUrlB(formattedB);

      const res = await toolsApi.runBattle(formattedA, formattedB);
      if (res.data.success && res.data.data) {
        setBattleData(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Battle analysis failed. Ensure both URLs are accessible.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (presetA: string, presetB: string) => {
    setUrlA(presetA);
    setUrlB(presetB);
    handleStartBattle(undefined, presetA, presetB);
  };

  return (
    <div className="bg-white min-h-screen py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Swords className="w-3.5 h-3.5" />
            <span>Head-to-Head Competitor Battle</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Analyze Your Website vs Your Competitor
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
            Run a live, side-by-side diagnostic battle across Speed, Core Web Vitals, SEO tags, mobile experience, and security. Find the exact gaps to outrank them on Google.
          </p>

          {/* Quick presets */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <span className="text-slate-500 font-semibold">Try instant preset battles:</span>
            <button
              onClick={() => loadPreset('https://stripe.com', 'https://paypal.com')}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold shadow-xs transition"
            >
              Stripe vs PayPal
            </button>
            <button
              onClick={() => loadPreset('https://github.com', 'https://gitlab.com')}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold shadow-xs transition"
            >
              GitHub vs GitLab
            </button>
            <button
              onClick={() => loadPreset('https://nike.com', 'https://adidas.com')}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold shadow-xs transition"
            >
              Nike vs Adidas
            </button>
          </div>
        </div>

        {/* Dual URL Input Arena */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-12">
          <form onSubmit={handleStartBattle} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 sm:gap-6 items-center">
              {/* Site A Input */}
              <div className="md:col-span-5">
                <label className="text-[14px] font-bold text-slate-900 block mb-2 flex items-center justify-between">
                  <span>Your Website (Site A)</span>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    e.g. yourbrand.com
                  </span>
                </label>
                <div className="relative">
                  <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={urlA}
                    onChange={(e) => setUrlA(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50/60 focus:bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-[15px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition shadow-xs"
                  />
                </div>
              </div>

              {/* VS Center Badge */}
              <div className="md:col-span-1 flex items-center justify-center pt-2 md:pt-6">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/25">
                  VS
                </div>
              </div>

              {/* Site B Input */}
              <div className="md:col-span-5">
                <label className="text-[14px] font-bold text-slate-900 block mb-2 flex items-center justify-between">
                  <span>Competitor Website (Site B)</span>
                  <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    e.g. competitor.com
                  </span>
                </label>
                <div className="relative">
                  <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={urlB}
                    onChange={(e) => setUrlB(e.target.value)}
                    placeholder="https://competitor.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50/60 focus:bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-[15px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition shadow-xs"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={loading}
                className="py-3.5 px-9 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-[15px] shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Executing Live Head-to-Head Battle...</span>
                  </>
                ) : (
                  <>
                    <Swords className="w-5 h-5" />
                    <span>Launch Competitor Battle</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* BATTLE RESULTS ARENA */}
        {battleData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Winner Trophy Hero Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-500 shadow-sm">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                    Battle Result
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {battleData.winners.overall === 'A' ? (
                      <span className="text-blue-600">Your Website (Site A) Wins!</span>
                    ) : battleData.winners.overall === 'B' ? (
                      <span className="text-rose-600">Competitor (Site B) Wins!</span>
                    ) : (
                      <span className="text-slate-700">It's a Dead Tie!</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {battleData.winners.overall === 'A'
                      ? 'Your website outperforms the competitor on overall technical health and search engine readiness.'
                      : 'The competitor holds an advantage in speed or on-page tags. Use the cheat sheet below to overtake them.'}
                  </p>
                </div>
              </div>

              {/* Head-to-Head Score Pill */}
              <div className="flex items-center gap-4 bg-white px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-wider text-blue-600 font-extrabold block">Your Site</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">{battleData.siteA.score}</span>
                </div>
                <span className="text-slate-300 font-bold text-lg">vs</span>
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-wider text-orange-600 font-extrabold block">Competitor</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">{battleData.siteB.score}</span>
                </div>
              </div>
            </div>

            {/* 4 BATTLE ROUNDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Round 1: Speed & Loading */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <h4 className="text-base font-bold text-slate-900">Round 1: Speed & TTFB</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${battleData.winners.speed === 'A' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                    Winner: {battleData.winners.speed === 'A' ? 'Your Site' : battleData.winners.speed === 'B' ? 'Competitor' : 'Tie'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Your Speed</span>
                    <span className="text-xl font-extrabold text-slate-900">{battleData.siteA.responseTimeMs}ms</span>
                    <span className="text-xs font-medium text-slate-500 block mt-0.5">{battleData.siteA.pageSizeKb} KB HTML</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Competitor Speed</span>
                    <span className="text-xl font-extrabold text-slate-900">{battleData.siteB.responseTimeMs}ms</span>
                    <span className="text-xs font-medium text-slate-500 block mt-0.5">{battleData.siteB.pageSizeKb} KB HTML</span>
                  </div>
                </div>
              </div>

              {/* Round 2: On-Page SEO */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-500" />
                    <h4 className="text-base font-bold text-slate-900">Round 2: On-Page SEO</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${battleData.winners.seo === 'A' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                    Winner: {battleData.winners.seo === 'A' ? 'Your Site' : battleData.winners.seo === 'B' ? 'Competitor' : 'Tie'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Your Title & Meta</span>
                    <span className="text-base font-extrabold text-slate-900 block">{battleData.siteA.titleLength} chars Title</span>
                    <span className="text-xs font-medium text-slate-500 block mt-0.5">{battleData.siteA.descLength} chars Description</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Competitor Title & Meta</span>
                    <span className="text-base font-extrabold text-slate-900 block">{battleData.siteB.titleLength} chars Title</span>
                    <span className="text-xs font-medium text-slate-500 block mt-0.5">{battleData.siteB.descLength} chars Description</span>
                  </div>
                </div>
              </div>

              {/* Round 3: Mobile Experience */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-indigo-500" />
                    <h4 className="text-base font-bold text-slate-900">Round 3: Mobile Experience</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${battleData.winners.mobile === 'A' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                    Winner: {battleData.winners.mobile === 'A' ? 'Your Site' : battleData.winners.mobile === 'B' ? 'Competitor' : 'Tie'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Your Mobile Score</span>
                    <span className="text-xl font-extrabold text-emerald-600">{battleData.siteA.scores.mobile}/100</span>
                    <span className="text-xs font-medium text-slate-500 block mt-0.5">Responsive Viewport</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Competitor Mobile</span>
                    <span className="text-xl font-extrabold text-slate-900">{battleData.siteB.scores.mobile}/100</span>
                    <span className="text-xs font-medium text-slate-500 block mt-0.5">Responsive Viewport</span>
                  </div>
                </div>
              </div>

              {/* Round 4: Security & Trust */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h4 className="text-base font-bold text-slate-900">Round 4: Security & Headers</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${battleData.winners.security === 'A' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                    Winner: {battleData.winners.security === 'A' ? 'Your Site' : battleData.winners.security === 'B' ? 'Competitor' : 'Tie'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Your Security</span>
                    <span className="text-xl font-extrabold text-slate-900">{battleData.siteA.scores.security}/100</span>
                    <span className="text-xs font-medium text-slate-500 block mt-0.5">{battleData.siteA.isHttps ? 'HTTPS Active' : 'HTTP'}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Competitor Security</span>
                    <span className="text-xl font-extrabold text-slate-900">{battleData.siteB.scores.security}/100</span>
                    <span className="text-xs font-medium text-slate-500 block mt-0.5">{battleData.siteB.isHttps ? 'HTTPS Active' : 'HTTP'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONABLE OUTRANK CHEAT SHEET */}
            <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600" />
                <h4 className="text-lg font-bold text-slate-900">
                  How to Outrank & Beat This Competitor on Google
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                Actionable competitive intelligence gathered from this head-to-head comparison:
              </p>

              <div className="space-y-3 pt-2">
                {battleData.outrankTips.map((tip: string, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-sm flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">{tip}</p>
                  </div>
                ))}
              </div>

              {/* Full Audit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h5 className="text-sm font-bold text-slate-900">Want a deep multi-page crawl of your website?</h5>
                  <p className="text-xs text-slate-500">Run our free 7-module engine to fix every hidden issue.</p>
                </div>
                <Link
                  to="/"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition whitespace-nowrap"
                >
                  Start Full Free Audit
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
