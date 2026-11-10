import React, { useEffect, useState } from 'react';
import { websiteApi, auditApi } from '../services/api.js';
import { WebsiteItem } from '../types/index.js';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Plus, Trash2, RefreshCw, ArrowRight, ExternalLink } from 'lucide-react';

export const WebsitesPage: React.FC = () => {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchWebsites = async () => {
    try {
      const res = await websiteApi.list();
      if (res.data.success) {
        setWebsites(res.data.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setSaving(true);
    try {
      const res = await websiteApi.create({
        url: urlInput.trim(),
        name: nameInput.trim() || undefined,
      });
      if (res.data.success) {
        setModalOpen(false);
        setUrlInput('');
        setNameInput('');
        fetchWebsites();
      }
    } catch (err: any) {
      alert(err.message || 'Could not save website');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this website?')) return;
    try {
      await websiteApi.delete(id);
      fetchWebsites();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleAuditWebsite = async (web: WebsiteItem) => {
    try {
      const res = await auditApi.start({
        url: web.url,
        websiteId: web._id,
        maxPages: web.defaultMaxPages,
      });
      if (res.data.success && res.data.data) {
        navigate(`/report/${res.data.data.auditId}`);
      }
    } catch (err: any) {
      alert(err.message || 'Could not start audit');
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-700 uppercase tracking-wide">
              Website Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Tracked Domains</h1>
            <p className="text-xs text-slate-500 mt-1">
              Maintain continuous health monitoring and scheduled scans for your portfolio or client websites.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Website</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Loading tracked websites...</div>
        ) : websites.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">No Websites Added Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Add your primary website or client projects to monitor health scores, track regressions, and schedule recurring audits.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
            >
              Add Your First Website
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((web) => (
              <div
                key={web._id}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{web.name}</h4>
                        <span className="text-xs font-mono text-slate-500 truncate block max-w-[180px]">{web.domain}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(web._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Remove website"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="py-3.5 border-y border-slate-100 my-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Latest Health</span>
                    {web.healthScore !== undefined ? (
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-xs ${
                          web.healthScore >= 80
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : web.healthScore >= 60
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {web.healthScore}/100
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">Not scanned</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleAuditWebsite(web)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Audit Now</span>
                  </button>
                  {web.lastAuditId && (
                    <Link
                      to={`/report/${web.lastAuditId}`}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    >
                      Report
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Website Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Add Website to Track</h3>
              <p className="text-xs text-slate-500 mb-5">Enter website URL and an optional project label.</p>

              <form onSubmit={handleAddWebsite} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Website URL *</label>
                  <input
                    type="text"
                    required
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Project Label (Optional)</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="E.g. Main Client Store"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
                  >
                    {saving ? 'Adding...' : 'Save Website'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
