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
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">
        {/* LEFT: Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
              SiteAudit<span className="text-blue-600">Pro</span>
            </div>
            <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-0.5">
              Website Health Engine
            </div>
          </div>
        </Link>

        {/* CENTER: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to="/"
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
          >
            Overview
          </Link>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              onBlur={() => setTimeout(() => setToolsOpen(false), 250)}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition ${
                toolsOpen ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Free Tools</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-0 mt-2 w-76 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/5 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link
                  to="/tools/seo"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">SEO Checker</div>
                    <div className="text-[11px] text-slate-500">Title, meta tags, H1 & structure</div>
                  </div>
                </Link>

                <Link
                  to="/tools/speed"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">Speed Checker</div>
                    <div className="text-[11px] text-slate-500">TTFB, FCP & Core Web Vitals</div>
                  </div>
                </Link>

                <Link
                  to="/tools/broken-links"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">Broken Link Checker</div>
                    <div className="text-[11px] text-slate-500">Discover 404 dead ends</div>
                  </div>
                </Link>

                <Link
                  to="/tools/ssl"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">SSL Certificate Checker</div>
                    <div className="text-[11px] text-slate-500">Validity & expiry countdown</div>
                  </div>
                </Link>

                <Link
                  to="/tools/mobile"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">Mobile-Friendly Checker</div>
                    <div className="text-[11px] text-slate-500">Viewport & layout overflow</div>
                  </div>
                </Link>

                <Link
                  to="/tools/security-headers"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">Security Header Checker</div>
                    <div className="text-[11px] text-slate-500">HSTS, CSP & X-Frame protection</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/pricing"
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
          >
            Pricing
          </Link>

          <Link
            to="/demo"
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
          >
            Sample Report
          </Link>

          <Link
            to="/blog"
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
          >
            Resources
          </Link>
        </nav>

        {/* RIGHT: Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-sm font-medium text-slate-900 transition"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-blue-50 text-blue-600 border border-blue-200">
                  {user.plan}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[11px] text-slate-400">Signed in as</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-600" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/dashboard/websites"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"
                  >
                    <Search className="w-4 h-4 text-emerald-600" />
                    <span>My Websites</span>
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"
                  >
                    <UserIcon className="w-4 h-4 text-purple-600" />
                    <span>Settings & White-Label</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition text-left mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition"
              >
                Start Free Audit
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Overview
          </Link>
          <div className="pt-2 pb-1 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Free Checkers
            </span>
            <div className="mt-1 space-y-1">
              <Link
                to="/tools/seo"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                SEO Checker
              </Link>
              <Link
                to="/tools/speed"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Speed & Core Web Vitals
              </Link>
              <Link
                to="/tools/broken-links"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Broken Link Checker
              </Link>
              <Link
                to="/tools/ssl"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                SSL Certificate Checker
              </Link>
              <Link
                to="/tools/mobile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Mobile-Friendly Checker
              </Link>
              <Link
                to="/tools/security-headers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Security Header Checker
              </Link>
            </div>
          </div>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Pricing
          </Link>
          <Link
            to="/demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Sample Report
          </Link>
          <Link
            to="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Resources
          </Link>
          <div className="pt-4 flex flex-col gap-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-sm"
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
