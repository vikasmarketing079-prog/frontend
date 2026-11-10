import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { subscriptionApi } from '../services/api.js';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { user } = useAuth();
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
    <div className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 uppercase tracking-wide">
            Plans & Investment
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-base text-slate-500">
            From single website health monitoring to high-volume agency white-label auditing.
          </p>

          {/* Billing cycle toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual (Save 20%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Free Starter */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Free Starter</h3>
              <p className="text-xs text-slate-500 mb-6">Ideal for quick scans & personal blogs</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">
                $0 <span className="text-xs font-medium text-slate-400">/ forever</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-600 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>10 pages crawled per scan</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>7 diagnostic audit categories</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Weighted Health Score (0-100)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Interactive web report</span>
                </li>
              </ul>
            </div>
            <Link
              to="/"
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition shadow-sm"
            >
              Start Free Now
            </Link>
          </div>

          {/* Pro Consultant */}
          <div className="p-8 rounded-2xl bg-white border-2 border-blue-600 relative flex flex-col justify-between shadow-lg shadow-blue-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Pro Consultant</h3>
              <p className="text-xs text-slate-500 mb-6">For growing businesses, developers & stores</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">
                {billingCycle === 'monthly' ? '$29' : '$23'} <span className="text-xs font-medium text-slate-400">/ month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-600 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>100 pages crawled per scan</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Downloadable PDF audit reports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Audit version comparison & diffs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Automated weekly health monitoring</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Email alerts when regressions occur</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan('pro')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
            >
              Choose Pro Plan
            </button>
          </div>

          {/* Agency Enterprise */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Agency Enterprise</h3>
              <p className="text-xs text-slate-500 mb-6">For marketing agencies & client workspaces</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">
                {billingCycle === 'monthly' ? '$99' : '$79'} <span className="text-xs font-medium text-slate-400">/ month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-600 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>500 pages crawled per scan</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Custom White-Label PDF reports (agency logo & colors)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Unlimited saved websites & client domains</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Team collaboration & priority queue</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan('agency')}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition shadow-sm"
            >
              Choose Agency Enterprise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
