import React, { useState } from 'react';
import { ShieldCheck, Target, Users, Mail, Phone, MapPin, Send } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-400">Our Mission</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
          Building the Most Accurate Website Health Standard
        </h1>
        <p className="mt-4 text-base text-slate-400 leading-relaxed">
          SiteAudit Pro was created with a clear philosophy: <em>"Do not just tell users that their website is bad. Show them exactly what is wrong, where it is wrong, why it matters, and how to fix it."</em>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="p-8 rounded-3xl bg-[#0B132B] border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-5">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Real Engineering Truth</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We never generate synthetic scores or dummy metrics. Every diagnostic signal comes from live DNS, TLS, Playwright rendering, and HTTP inspection.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#0B132B] border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Safe & Ethical Crawling</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our crawler respects robots.txt directives, rate limits politely, and incorporates bulletproof SSRF defenses protecting internal networks.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#0B132B] border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-5">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Empowering Agencies</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Digital marketing agencies and freelancers use our white-label PDF reports to win client proposals and demonstrate measurable optimization ROI.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-400">Get in Touch</span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mt-2">Contact Our Engineering Team</h1>
        <p className="mt-3 text-sm text-slate-400">
          Have questions regarding crawl limits, agency integrations, or custom enterprise deployments?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0B132B] border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-xs text-slate-400 block">Support & Sales</span>
                <span className="text-sm font-semibold text-white">support@siteauditpro.com</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs text-slate-400 block">Direct Line</span>
                <span className="text-sm font-semibold text-white">+1 (888) 555-AUDIT</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-400" />
              <div>
                <span className="text-xs text-slate-400 block">Global Headquarters</span>
                <span className="text-sm font-semibold text-white">Silicon Valley, California</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#0B132B] border border-slate-800 rounded-3xl p-8">
          {submitted ? (
            <div className="py-12 text-center">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Message Delivered</h3>
              <p className="text-xs text-slate-400 mt-1">Our engineering team will reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
