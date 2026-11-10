import React from 'react';

export const PrivacyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-slate-300 space-y-6 text-sm leading-relaxed">
    <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
    <p className="text-xs text-slate-500 font-mono">Effective Date: January 1, 2025</p>
    <p>
      At SiteAudit Pro, accessible from siteauditpro.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by SiteAudit Pro and how we use it.
    </p>
    <h3 className="text-lg font-bold text-white pt-4">1. Information We Collect</h3>
    <p>
      When you enter a website URL for auditing, we fetch public HTML resources, response headers, SSL certificates, and DNS records necessary to compile your website health report. We never inspect or store private authentication credentials or session cookies.
    </p>
    <h3 className="text-lg font-bold text-white pt-4">2. Safe Crawling & SSRF Protection</h3>
    <p>
      Our crawling engine adheres strictly to modern Server-Side Request Forgery (SSRF) security standards, blocking private IP ranges, local intranet hostnames, and loopback addresses.
    </p>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-slate-300 space-y-6 text-sm leading-relaxed">
    <h1 className="text-3xl font-extrabold text-white">Terms and Conditions</h1>
    <p className="text-xs text-slate-500 font-mono">Last Updated: January 1, 2025</p>
    <p>
      By accessing or using SiteAudit Pro, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
    </p>
    <h3 className="text-lg font-bold text-white pt-4">1. Authorized Audit Usage</h3>
    <p>
      You agree to submit only websites and URLs that you own, operate, or have authorized permission to audit. You agree not to use SiteAudit Pro to bypass access controls, conduct unauthorized penetration tests, or disrupt target web servers.
    </p>
    <h3 className="text-lg font-bold text-white pt-4">2. Crawl Limits & Subscription Terms</h3>
    <p>
      Free tier accounts are subject to fair-use crawl limits (10 pages per scan). Pro and Agency tiers provide expanded limits as specified in your plan agreement.
    </p>
  </div>
);

export const CookiePage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-slate-300 space-y-6 text-sm leading-relaxed">
    <h1 className="text-3xl font-extrabold text-white">Cookie Policy</h1>
    <p className="text-xs text-slate-500 font-mono">Last Updated: January 1, 2025</p>
    <p>
      SiteAudit Pro uses minimal, essential cookies and browser local storage to maintain session authentication and guest audit continuity. We do not sell tracking data to third-party ad networks.
    </p>
    <h3 className="text-lg font-bold text-white pt-4">1. How We Use Cookies</h3>
    <p>
      We use cookies solely for session authorization (JWT tokens) and to track the progress of ongoing website diagnostic scans.
    </p>
  </div>
);
