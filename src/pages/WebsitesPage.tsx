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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase font-mono text-blue-400">Website Management</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Tracked Domains</h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain standing monitors for your portfolio or client websites.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Website</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading websites...</div>
      ) : websites.length === 0 ? (
        <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
          <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Websites Added Yet</h3>
          <p className="text-xs text-slate-400 mb-6">
            Add your primary website or client projects to monitor health scores and schedule weekly scans.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30"
          >
            Add Your First Website
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((web) => (
            <div
              key={web._id}
              className="p-6 rounded-3xl bg-[#0B132B] border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white leading-tight">{web.name}</h4>
                      <span className="text-xs font-mono text-slate-400">{web.domain}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(web._id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-4 border-y border-slate-800/80 my-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Latest Health</span>
                  {web.healthScore !== undefined ? (
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-xs ${
                        web.healthScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : web.healthScore >= 60
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {web.healthScore}/100
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Not scanned</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleAuditWebsite(web)}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Audit Now</span>
                </button>
                {web.lastAuditId && (
                  <Link
                    to={`/report/${web.lastAuditId}`}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Add Website to Monitor</h3>
            <p className="text-xs text-slate-400 mb-4">Enter website URL and an optional friendly project name.</p>

            <form onSubmit={handleAddWebsite} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Website URL *</label>
                <input
                  type="text"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Project Name (Optional)</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="E.g. Main Company Store"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Save Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

