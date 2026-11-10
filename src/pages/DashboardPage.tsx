import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { dashboardApi } from '../services/api.js';
import {
  Globe,
  Activity,
  AlertCircle,
  FileCheck2,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  Search,
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
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-700 uppercase tracking-wide">
              Portfolio Health Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Welcome back, {user?.name || 'Developer'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Active Tier: <span className="font-semibold text-blue-600 uppercase">{user?.plan || 'Free'}</span> • Real-time site diagnostics and tracking
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/websites"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-sm transition flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>Tracked Websites</span>
            </Link>
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Audit</span>
            </Link>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-medium">Monitored Websites</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{data?.websitesCount || 0}</div>
            <span className="text-xs text-slate-500 mt-1.5 block">Active tracking targets</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-medium">Average Health Score</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">
              {data?.averageHealthScore ? `${data.averageHealthScore}/100` : '--'}
            </div>
            <span className="text-xs text-slate-500 mt-1.5 block">Weighted overall health</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-medium">Pending Critical Issues</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-rose-600">{data?.totalCriticalIssues || 0}</div>
            <span className="text-xs text-slate-500 mt-1.5 block">Requires immediate fix</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-medium">Total Audits Run</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{data?.totalAuditsCount || 0}</div>
            <span className="text-xs text-slate-500 mt-1.5 block">Historical crawls executed</span>
          </div>
        </div>

        {/* Recent Scans Table */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:px-8 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Website Audits</h3>
              <p className="text-xs text-slate-500 mt-0.5">Click any audit to inspect detailed findings, page breakdown, and action plan</p>
            </div>
            <Link to="/" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
              <span>Run new audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data?.recentAudits?.length === 0 ? (
            <div className="p-12 text-center bg-slate-50/50">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-3 shadow-sm">
                <Globe className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-900">No audits completed yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-5">Enter your website URL to generate your first audit report.</p>
              <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-xs font-bold transition shadow-sm">
                <span>Run Free Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-6">Domain / URL</th>
                    <th className="py-3.5 px-4">Health Score</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Pages Scanned</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.recentAudits?.map((a: any) => (
                    <tr key={a._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-semibold text-slate-900 max-w-xs truncate">
                        <Link to={`/report/${a._id}`} className="hover:text-blue-600">
                          {a.targetUrl}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold font-mono text-[11px] ${
                            a.healthScore >= 80
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : a.healthScore >= 60
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {a.healthScore}/100
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono uppercase text-[10px] text-slate-500">{a.status}</td>
                      <td className="py-4 px-4 font-mono text-slate-700">{a.pagesScanned || 0}</td>
                      <td className="py-4 px-4 text-slate-500">
                        {new Date(a.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/report/${a._id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
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
    </div>
  );
};
