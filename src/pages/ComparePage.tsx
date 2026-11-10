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
      <div className="min-h-[60vh] flex items-center justify-center text-white">
        Loading audit comparison...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <p className="text-rose-400 mb-4">{error || 'Comparison data unavailable'}</p>
        <Link to="/dashboard" className="px-4 py-2 bg-blue-600 rounded-xl text-white font-semibold text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const scoreDiff = data.healthScoreDiff;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-mono uppercase text-blue-400">Audit Version Comparison</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Website Health Progress</h1>
        </div>
      </div>

      {/* Score Diff Banner */}
      <div className="p-6 rounded-3xl bg-[#0B132B] border border-slate-800 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-xs text-slate-400 block mb-1">Previous Scan</span>
            <span className="text-3xl font-black text-white">{data.previous.healthScore}</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {new Date(data.previous.date).toLocaleDateString()}
            </span>
          </div>

          <ArrowRight className="w-6 h-6 text-slate-500" />

          <div className="text-center">
            <span className="text-xs text-slate-400 block mb-1">Current Scan</span>
            <span className="text-3xl font-black text-white">{data.current.healthScore}</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {new Date(data.current.date).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          {scoreDiff >= 0 ? (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-6 h-6" />
            </div>
          )}
          <div>
            <span className={`text-xl font-black ${scoreDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} Points
            </span>
            <p className="text-xs text-slate-400">
              {scoreDiff >= 0 ? 'Health score improved' : 'Health score decreased'}
            </p>
          </div>
        </div>
      </div>

      {/* Resolved vs New Issues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resolved Issues */}
        <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Resolved Issues ({data.resolvedIssuesCount})</span>
            </h3>
          </div>

          {data.resolved.length === 0 ? (
            <p className="text-xs text-slate-400 p-4 bg-slate-900 rounded-xl">No previously open issues resolved.</p>
          ) : (
            <div className="space-y-3">
              {data.resolved.map((iss: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs">
                  <div className="font-bold text-emerald-300">{iss.title}</div>
                  <div className="text-slate-400 font-mono text-[11px] truncate mt-1">{iss.url}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newly Detected Issues */}
        <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>New Issues Detected ({data.newIssuesCount})</span>
            </h3>
          </div>

          {data.newIssues.length === 0 ? (
            <p className="text-xs text-slate-400 p-4 bg-slate-900 rounded-xl">No new issues appeared in this scan!</p>
          ) : (
            <div className="space-y-3">
              {data.newIssues.map((iss: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30 text-xs">
                  <div className="font-bold text-rose-300">{iss.title}</div>
                  <div className="text-slate-400 font-mono text-[11px] truncate mt-1">{iss.url}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
