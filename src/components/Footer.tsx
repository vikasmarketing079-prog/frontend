import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#060B18] border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                SiteAudit<span className="text-blue-400">PRO</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier website health, SEO, performance, and security diagnostic platform for developers, marketing agencies, and business owners.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-slate-500">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:text-white hover:bg-slate-800 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:text-white hover:bg-slate-800 transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:text-white hover:bg-slate-800 transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Free Diagnostic Tools */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Free Checkers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/tools/seo" className="hover:text-blue-400 transition">
                  Website SEO Checker
                </Link>
              </li>
              <li>
                <Link to="/tools/speed" className="hover:text-blue-400 transition">
                  Website Speed Checker
                </Link>
              </li>
              <li>
                <Link to="/tools/broken-links" className="hover:text-blue-400 transition">
                  Broken Link Checker
                </Link>
              </li>
              <li>
                <Link to="/tools/ssl" className="hover:text-blue-400 transition">
                  SSL Certificate Checker
                </Link>
              </li>
              <li>
                <Link to="/tools/mobile" className="hover:text-blue-400 transition">
                  Mobile-Friendly Checker
                </Link>
              </li>
              <li>
                <Link to="/tools/security-headers" className="hover:text-blue-400 transition">
                  Security Header Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Product & Platform */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/pricing" className="hover:text-blue-400 transition">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-blue-400 transition">
                  Interactive Demo Report
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-400 transition">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-blue-400 transition">
                  Audit Guides & Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-blue-400 transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SiteAudit Pro Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-3 sm:mt-0">
            Engineered with precision for absolute web performance.
          </p>
        </div>
      </div>
    </footer>
  );
};

