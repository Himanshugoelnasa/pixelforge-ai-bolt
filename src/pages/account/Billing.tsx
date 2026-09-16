import { CreditCard, Zap, Check, Download, Calendar, ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const PLANS = [
  { name: 'Free', price: 0, credits: '1,000', features: ['8 AI models', 'Standard quality', '512px max', 'Community support'], color: 'border-white/10' },
  { name: 'Pro', price: 29, credits: '10,000', features: ['All AI models', 'Ultra quality', '4K resolution', 'Priority support', 'Batch processing', 'API access'], color: 'border-violet-500/50', current: true, popular: true },
  { name: 'Business', price: 99, credits: '50,000', features: ['Everything in Pro', 'Team management', 'Custom models', 'Dedicated support', 'Advanced analytics', 'Unlimited storage'], color: 'border-cyan-500/30' },
  { name: 'Enterprise', price: null, credits: 'Custom', features: ['Custom credits', 'SLA guarantee', 'Custom integrations', 'On-premise option', 'Training & setup'], color: 'border-white/10' },
];

const INVOICES = [
  { id: 'INV-2026-09', date: 'Sep 1, 2026', amount: '$29.00', status: 'Paid', description: 'Pro Plan — September 2026' },
  { id: 'INV-2026-08', date: 'Aug 1, 2026', amount: '$29.00', status: 'Paid', description: 'Pro Plan — August 2026' },
  { id: 'INV-2026-07', date: 'Jul 1, 2026', amount: '$29.00', status: 'Paid', description: 'Pro Plan — July 2026' },
  { id: 'INV-2026-06', date: 'Jun 1, 2026', amount: '$29.00', status: 'Paid', description: 'Pro Plan — June 2026' },
];

export default function Billing() {
  const { showToast, credits } = useApp();

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your subscription and billing information</p>
      </div>

      {/* Current plan */}
      <div className="bg-gradient-to-r from-violet-950/60 to-cyan-950/40 border border-violet-500/20 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-500 to-cyan-500 text-white">Current Plan</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-2">Pro Plan</h2>
            <p className="text-gray-400 text-sm mt-1">$29/month · Renews on October 1, 2026</p>
            <div className="flex items-center gap-2 mt-3">
              <Zap size={14} className="text-violet-400" />
              <span className="text-sm text-gray-300">{credits.toLocaleString()} of 10,000 credits remaining</span>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden w-64">
              <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" style={{ width: `${(credits / 10000) * 100}%` }} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => showToast('Manage billing...')} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm text-gray-400 hover:text-white transition-all">Manage</button>
            <button onClick={() => showToast('Upgrading to Business...')} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:from-violet-500 hover:to-cyan-400 transition-all">Upgrade</button>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(plan => (
            <div key={plan.name} className={`relative bg-gray-900/60 border-2 ${plan.color} rounded-2xl p-5 ${plan.current ? 'ring-1 ring-violet-500/30' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-cyan-500 text-white">Most Popular</span>
                </div>
              )}
              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <div className="mb-4">
                {plan.price !== null ? (
                  <><span className="text-3xl font-bold text-white">${plan.price}</span><span className="text-gray-500 text-sm">/mo</span></>
                ) : (
                  <span className="text-2xl font-bold text-white">Custom</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mb-4 pb-4 border-b border-white/8">
                <Zap size={13} className="text-violet-400" />
                <span className="text-sm font-semibold text-white">{plan.credits} credits</span>
              </div>
              <div className="space-y-2 mb-5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <Check size={13} className="text-emerald-400 shrink-0" />
                    <span className="text-xs text-gray-400">{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => showToast(plan.current ? 'Already on this plan' : `Switching to ${plan.name}...`)}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${plan.current ? 'bg-white/5 border border-white/10 text-gray-500 cursor-default' : 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400 shadow-lg shadow-violet-500/20'}`}
              >
                {plan.current ? 'Current Plan' : plan.price === null ? 'Contact Sales' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment method */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard size={16} className="text-violet-400" />
            Payment Method
          </h2>
          <div className="flex items-center gap-4 p-4 bg-white/3 border border-white/8 rounded-xl mb-4">
            <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Visa ending in 4242</p>
              <p className="text-xs text-gray-500">Expires 12/2028</p>
            </div>
            <button onClick={() => showToast('Update payment method')} className="ml-auto text-xs text-violet-400 hover:text-violet-300 transition-colors">Update</button>
          </div>
          <button onClick={() => showToast('Adding payment method...')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
            <div className="w-5 h-5 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-xs">+</div>
            Add payment method
          </button>
        </div>

        {/* Next billing */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-cyan-400" />
            Billing Summary
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Current Plan', value: 'Pro — $29/month' },
              { label: 'Next Billing Date', value: 'October 1, 2026' },
              { label: 'Credits Used', value: `${(10000 - credits).toLocaleString()} / 10,000` },
              { label: 'Total Spent (2026)', value: '$261.00' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-gray-900/60 border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">Billing History</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/3">
              {['Invoice', 'Date', 'Description', 'Amount', 'Status', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {INVOICES.map(inv => (
              <tr key={inv.id} className="hover:bg-white/3 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-gray-400">{inv.id}</td>
                <td className="px-5 py-3 text-gray-400">{inv.date}</td>
                <td className="px-5 py-3 text-gray-300">{inv.description}</td>
                <td className="px-5 py-3 font-semibold text-white">{inv.amount}</td>
                <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">{inv.status}</span></td>
                <td className="px-5 py-3">
                  <button onClick={() => showToast('Downloading invoice...')} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors">
                    <Download size={12} />PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
