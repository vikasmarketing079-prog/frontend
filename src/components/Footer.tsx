import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Twitter, Github, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                SiteAudit<span className="text-blue-600">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              The premier website health, SEO, performance, and security diagnostic platform for modern developers, agencies, and online businesses.
            </p>
            <div className="flex items-center space-x-2 pt-2 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:text-slate-700 hover:bg-slate-200/60 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:text-slate-700 hover:bg-slate-200/60 transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:text-slate-700 hover:bg-slate-200/60 transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-600 transition">
                  Website Audit
                </Link>
              </li>
              <li>
                <Link to="/tools/seo" className="hover:text-blue-600 transition">
                  SEO Checker
                </Link>
              </li>
              <li>
                <Link to="/tools/speed" className="hover:text-blue-600 transition">
                  Speed Checker
                </Link>
              </li>
              <li>
                <Link to="/tools/broken-links" className="hover:text-blue-600 transition">
                  Broken Link Checker
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-blue-600 transition">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/demo" className="hover:text-blue-600 transition">
                  Sample Reports
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-blue-600 transition">
                  Optimization Guides
                </Link>
              </li>
              <li>
                <Link to="/tools/ssl" className="hover:text-blue-600 transition">
                  SSL Inspector
                </Link>
              </li>
              <li>
                <Link to="/tools/security-headers" className="hover:text-blue-600 transition">
                  Security Headers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-600 transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SiteAudit Pro Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Engineered for enterprise web reliability & Core Web Vitals excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};
