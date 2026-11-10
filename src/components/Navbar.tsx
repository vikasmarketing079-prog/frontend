import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import {
  ShieldCheck,
  ChevronDown,
  Gauge,
  Search,
  Lock,
  Smartphone,
  Link2,
  FileText,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleDemoClick = async () => {
    try {
      await quickDemoLogin();
      navigate('/dashboard');
    } catch {
      navigate('/demo');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#060B18]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
            <div className="w-full h-full bg-[#0B132B] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              SiteAudit<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">PRO</span>
            </span>
            <span className="text-[10px] tracking-wider text-slate-400 font-mono block -mt-1 uppercase">
              Website Health Engine
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to="/"
            className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
          >
            Overview
          </Link>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              onBlur={() => setTimeout(() => setToolsOpen(false), 250)}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 flex items-center gap-1.5 transition"
            >
              <span>Free Tools</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${toolsOpen ? 'rotate-180 text-blue-400' : ''}`} />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#0B132B] border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  to="/tools/seo"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
                >
                  <Search className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-sm font-semibold">SEO Checker</div>
                    <div className="text-xs text-slate-400">Title, meta, H1 & structure</div>
                  </div>
                </Link>
                <Link
                  to="/tools/speed"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
                >
                  <Gauge className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-semibold">Speed Checker</div>
                    <div className="text-xs text-slate-400">TTFB, FCP & Core Web Vitals</div>
                  </div>
                </Link>
                <Link
                  to="/tools/broken-links"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
                >
                  <Link2 className="w-5 h-5 text-rose-400" />
                  <div>
                    <div className="text-sm font-semibold">Broken Link Checker</div>
                    <div className="text-xs text-slate-400">Detect 404 dead ends</div>
                  </div>
                </Link>
                <Link
                  to="/tools/ssl"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
                >
                  <Lock className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-sm font-semibold">SSL Certificate Checker</div>
                    <div className="text-xs text-slate-400">Expiry & security validity</div>
                  </div>
                </Link>
                <Link
                  to="/tools/mobile"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
                >
                  <Smartphone className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm font-semibold">Mobile-Friendly Checker</div>
                    <div className="text-xs text-slate-400">Viewport & overflow detection</div>
                  </div>
                </Link>
                <Link
                  to="/tools/security-headers"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
                >
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-sm font-semibold">Security Headers</div>
                    <div className="text-xs text-slate-400">HSTS, CSP, X-Frame checks</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/pricing"
            className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
          >
            Pricing
          </Link>
          <Link
            to="/demo"
            className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
          >
            Sample Report
          </Link>
          <Link
            to="/blog"
            className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
          >
            Resources
          </Link>
        </nav>

        {/* Auth / Action CTA */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-sm font-medium text-white transition"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {user.plan}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0B132B] border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/dashboard/websites"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  >
                    <Search className="w-4 h-4 text-emerald-400" />
                    <span>My Websites</span>
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  >
                    <UserIcon className="w-4 h-4 text-purple-400" />
                    <span>Settings & White-Label</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-950/30 rounded-lg transition text-left mt-1"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={handleDemoClick}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition"
              >
                Demo Login
              </button>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition hover:shadow-blue-600/50"
              >
                Start Free Audit
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B132B] border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Overview
          </Link>
          <div className="pt-2 pb-1 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
              Free Checkers
            </span>
            <div className="mt-1 space-y-1">
              <Link
                to="/tools/seo"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg"
              >
                SEO Checker
              </Link>
              <Link
                to="/tools/speed"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg"
              >
                Speed & Core Web Vitals
              </Link>
              <Link
                to="/tools/ssl"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg"
              >
                SSL Certificate Checker
              </Link>
              <Link
                to="/tools/broken-links"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg"
              >
                Broken Link Checker
              </Link>
            </div>
          </div>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Pricing
          </Link>
          <Link
            to="/demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-blue-400 hover:bg-slate-800 rounded-lg"
          >
            Sample Audit Report
          </Link>
          <div className="pt-4 flex flex-col gap-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-xl border border-slate-700 text-slate-200 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg"
                >
                  Start Free Audit
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

