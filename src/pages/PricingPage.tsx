import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { subscriptionApi } from '../services/api.js';
import { CheckCircle, Zap, Shield, Sparkles } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { user, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      navigate('/register');
      return;
    }

    try {
      const res = await subscriptionApi.checkout({ planId });
      if (res.data.success) {
        if (res.data.gateway === 'razorpay' || res.data.gateway === 'stripe') {
          alert(`Checkout intent initiated for ${planId.toUpperCase()}. Live gateway is ready.`);
        } else {
          alert(`Plan switched to ${planId.toUpperCase()}!`);
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.error || err.message || 'Payment intent could not be started');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-400">Plans & Investment</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-base text-slate-400">
          From single website health monitoring to high-volume agency white-label auditing.
        </p>

        {/* Billing cycle toggle */}
        <div className="mt-8 inline-flex items-center gap-2 p-1.5 bg-[#0B132B] border border-slate-800 rounded-2xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              billingCycle === 'yearly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual (Save 20%)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Starter */}
        <div className="p-8 rounded-3xl bg-[#0B132B] border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Free Starter</h3>
            <p className="text-xs text-slate-400 mb-6">Ideal for quick scans & personal blogs</p>
            <div className="text-4xl font-black text-white mb-6">
              $0 <span className="text-sm font-normal text-slate-400">/ forever</span>
            </div>
            <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>10 pages crawled per scan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>7 diagnostic audit categories</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Weighted Health Score (0-100)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Interactive web report</span>
              </li>
            </ul>
          </div>
          <Link
            to="/"
            className="w-full text-center py-3 rounded-xl border border-slate-700 hover:border-slate-600 text-white font-semibold text-sm transition"
          >
            Start Free Now
          </Link>
        </div>

        {/* Pro Consultant */}
        <div className="p-8 rounded-3xl bg-[#0B132B] border-2 border-blue-500 relative flex flex-col justify-between shadow-2xl shadow-blue-500/15">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider">
            Recommended
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Pro Consultant</h3>
            <p className="text-xs text-slate-400 mb-6">For businesses, e-commerce & developers</p>
            <div className="text-4xl font-black text-white mb-6">
              {billingCycle === 'monthly' ? '$29' : '$23'} <span className="text-sm font-normal text-slate-400">/ month</span>
            </div>
            <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>100 pages crawled per scan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Downloadable PDF audit reports</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Audit version comparison & diffs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Automated weekly health monitoring</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Email alerts when issues arise</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleSelectPlan('pro')}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition"
          >
            Choose Pro Plan
          </button>
        </div>

        {/* Agency Enterprise */}
        <div className="p-8 rounded-3xl bg-[#0B132B] border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Agency Enterprise</h3>
            <p className="text-xs text-slate-400 mb-6">For marketing agencies & client workspaces</p>
            <div className="text-4xl font-black text-white mb-6">
              {billingCycle === 'monthly' ? '$99' : '$79'} <span className="text-sm font-normal text-slate-400">/ month</span>
            </div>
            <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>500 pages crawled per scan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Custom White-Label PDF reports (agency logo & colors)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Unlimited saved websites & clients</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Team members & priority queue</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleSelectPlan('agency')}
            className="w-full py-3 rounded-xl border border-slate-700 hover:border-slate-600 text-white font-semibold text-sm transition"
          >
            Choose Agency Enterprise
          </button>
        </div>
      </div>
    </div>
  );
};
