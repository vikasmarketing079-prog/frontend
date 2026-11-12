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
  Swords,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">
        {/* LEFT: Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center">
              SiteAudit<span className="text-blue-600">Pro</span>
            </div>
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase -mt-0.5">
              Website Health Engine
            </div>
          </div>
        </Link>

        {/* CENTER: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              onBlur={() => setTimeout(() => setToolsOpen(false), 250)}
              className={`px-3.5 py-2 text-[15px] font-semibold rounded-xl flex items-center gap-1.5 transition-all duration-150 ${
                toolsOpen ? 'text-blue-600 bg-blue-50/70 font-bold' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
              }`}
            >
              <span>Free Tools</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/3 mt-2.5 w-[600px] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10 p-3.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-sans">
                {/* Featured Tool Banner: Competitor Battle */}
                <Link
                  to="/battle"
                  onClick={() => setToolsOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50/70 to-orange-50/40 hover:from-orange-100/90 hover:to-amber-100/80 border border-orange-200/90 transition-all duration-200 group mb-3 shadow-xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                      <Swords className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Competitor Head-to-Head Battle</span>
                        <span className="text-[10px] uppercase px-2 py-0.5 font-mono font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full shadow-xs">
                          NEW
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">
                        Compare your website against any competitor URL live round-by-round
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                </Link>

                {/* 2-Column Tools Grid */}
                <div className="grid grid-cols-2 gap-2 pb-3">
                  <Link
                    to="/tools/seo"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-slate-200/80 hover:bg-slate-50/90 transition-all duration-150 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        SEO Checker
                      </div>
                      <div className="text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                        Title, meta tags, H1 hierarchy & schema
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/tools/ssl"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-slate-200/80 hover:bg-slate-50/90 transition-all duration-150 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        SSL Certificate Checker
                      </div>
                      <div className="text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                        TLS validity, cipher & expiry countdown
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/tools/speed"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-slate-200/80 hover:bg-slate-50/90 transition-all duration-150 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <Gauge className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        Speed & Core Web Vitals
                      </div>
                      <div className="text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                        TTFB, FCP, LCP & payload weight
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/tools/mobile"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-slate-200/80 hover:bg-slate-50/90 transition-all duration-150 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        Mobile-Friendly Checker
                      </div>
                      <div className="text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                        375px/768px viewport & layout overflow
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/tools/broken-links"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-slate-200/80 hover:bg-slate-50/90 transition-all duration-150 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        Broken Link Checker
                      </div>
                      <div className="text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                        Discover 404 dead ends & broken links
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/tools/security-headers"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-slate-200/80 hover:bg-slate-50/90 transition-all duration-150 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        Security Header Checker
                      </div>
                      <div className="text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                        HSTS, CSP & X-Frame defense audit
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Dropdown Bottom Banner */}
                <div className="pt-3 pb-1 px-4 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/90 -mx-3.5 -mb-3.5 rounded-b-2xl">
                  <span className="text-slate-600 font-medium">Need multi-page site crawling?</span>
                  <Link
                    to="/"
                    onClick={() => setToolsOpen(false)}
                    className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition"
                  >
                    <span>Run Full Website Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/battle"
            className="px-3.5 py-2 text-[15px] font-bold text-orange-600 hover:text-orange-700 rounded-xl hover:bg-orange-50/80 transition-all duration-150 flex items-center gap-1.5"
          >
            <Swords className="w-4 h-4 text-orange-500" />
            <span>Battle</span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 font-mono font-extrabold bg-orange-600 text-white rounded-md shadow-xs">
              NEW
            </span>
          </Link>

          <Link
            to="/demo"
            className="px-3.5 py-2 text-[15px] font-semibold text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100/70 transition-all duration-150"
          >
            Sample Report
          </Link>

          <Link
            to="/blog"
            className="px-3.5 py-2 text-[15px] font-semibold text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100/70 transition-all duration-150"
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
                className="text-[15px] font-semibold text-slate-700 hover:text-slate-950 px-4 py-2 rounded-xl hover:bg-slate-100/70 transition-all duration-150"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center text-[15px] font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-150"
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
          <div className="pt-2 pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Free Checkers
            </span>
            <div className="mt-1 space-y-1">
              <Link
                to="/battle"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-orange-600 bg-orange-50/70 hover:bg-orange-100/70 rounded-lg"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Competitor Battle Arena</span>
                <span className="text-[9px] uppercase px-1 py-0.2 font-mono font-bold bg-orange-600 text-white rounded ml-auto">NEW</span>
              </Link>
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
