import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { dashboardApi, auditApi } from '../services/api.js';
import {
  Globe,
  Activity,
  AlertCircle,
  FileCheck2,
  ArrowRight,
  Plus,
  RefreshCw,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardApi.getOverview();
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase font-mono text-blue-400">Portfolio Health Center</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Welcome back, {user?.name || 'Developer'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Current Tier: <strong className="text-blue-400 uppercase">{user?.plan || 'Free'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/websites"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Manage Websites</span>
          </Link>
          <Link
            to="/"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Website Audit</span>
          </Link>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Monitored Websites</span>
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">{data?.websitesCount || 0}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active domains</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Average Health Score</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {data?.averageHealthScore ? `${data.averageHealthScore}/100` : '--'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Weighted overall health</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Pending Critical Issues</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400">{data?.totalCriticalIssues || 0}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Require immediate fix</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Total Audits Run</span>
            <FileCheck2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{data?.totalAuditsCount || 0}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Historical scans</span>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Website Scans</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any audit to open full findings and action plan</p>
          </div>
          <Link to="/" className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-1">
            <span>Run new scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recentAudits?.length === 0 ? (
          <div className="p-8 text-center bg-[#060B18] rounded-2xl border border-slate-800">
            <Globe className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No audits completed yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Enter your URL to generate your first audit report.</p>
            <Link to="/" className="px-4 py-2 bg-blue-600 rounded-xl text-white text-xs font-bold">
              Run Free Audit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060B18] text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Domain / URL</th>
                  <th className="p-3.5">Health Score</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Pages</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data?.recentAudits?.map((a: any) => (
                  <tr key={a._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-bold text-white max-w-xs truncate">
                      <Link to={`/report/${a._id}`} className="hover:text-blue-400">
                        {a.targetUrl}
                      </Link>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold font-mono text-[11px] ${
                          a.healthScore >= 80
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : a.healthScore >= 60
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {a.healthScore}/100
                      </span>
                    </td>
                    <td className="p-3.5 font-mono uppercase text-[10px] text-slate-400">{a.status}</td>
                    <td className="p-3.5 font-mono text-slate-300">{a.pagesScanned || 0}</td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(a.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5">
                      <Link
                        to={`/report/${a._id}`}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <span>View Report</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
