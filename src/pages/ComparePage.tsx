import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auditApi } from '../services/api.js';
import { ArrowLeft, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { id, previousId } = useParams<{ id: string; previousId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !previousId) return;

    const fetchComparison = async () => {
      try {
        const res = await auditApi.compare(id, previousId);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Failed to compare audits');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [id, previousId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500 text-sm">
        Loading audit comparison...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <p className="text-rose-600 mb-4 text-sm font-semibold">{error || 'Comparison data unavailable'}</p>
        <Link to="/dashboard" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold text-xs transition shadow-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const scoreDiff = data.healthScoreDiff;

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-700 uppercase tracking-wide">
              Audit Version Comparison
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Website Health Progress</h1>
            <p className="text-xs text-slate-500 mt-1">
              Compare differences between consecutive audit runs to confirm fixed issues and detect regressions.
            </p>
          </div>
        </div>

        {/* Score Diff Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-xs text-slate-500 font-medium block mb-1">Previous Scan</span>
              <span className="text-3xl font-black text-slate-800">{data.previous.healthScore}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {new Date(data.previous.date).toLocaleDateString()}
              </span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-300" />

            <div className="text-center">
              <span className="text-xs text-slate-500 font-medium block mb-1">Current Scan</span>
              <span className="text-3xl font-black text-slate-900">{data.current.healthScore}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {new Date(data.current.date).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-5 py-4 rounded-xl border border-slate-200">
            {scoreDiff >= 0 ? (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <TrendingUp className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                <TrendingDown className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className={`text-xl font-black ${scoreDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} Points
              </span>
              <p className="text-xs text-slate-500 font-medium">
                {scoreDiff >= 0 ? 'Health score improved' : 'Health score decreased'}
              </p>
            </div>
          </div>
        </div>

        {/* Resolved vs New Issues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resolved Issues */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Resolved Issues ({data.resolvedIssuesCount})</span>
              </h3>
            </div>

            {data.resolved.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl border border-slate-100">
                No previously open issues resolved between these scans.
              </p>
            ) : (
              <div className="space-y-2.5">
                {data.resolved.map((iss: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs">
                    <div className="font-bold text-emerald-800">{iss.title}</div>
                    <div className="text-slate-500 font-mono text-[11px] truncate mt-1">{iss.url}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Newly Detected Issues */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>New Issues Detected ({data.newIssuesCount})</span>
              </h3>
            </div>

            {data.newIssues.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl border border-slate-100">
                No new issues appeared in this scan! Clean release.
              </p>
            ) : (
              <div className="space-y-2.5">
                {data.newIssues.map((iss: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs">
                    <div className="font-bold text-rose-800">{iss.title}</div>
                    <div className="text-slate-500 font-mono text-[11px] truncate mt-1">{iss.url}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
