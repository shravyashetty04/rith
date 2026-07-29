import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, ChevronLeft, Sparkles, CreditCard, Smartphone, Apple, Wallet } from 'lucide-react';
import { useApp } from '../store';
import { PLANS } from '../data';

export default function Subscription() {
  const { back, navigate } = useApp();
  const [selected, setSelected] = useState('premium');
  const [cycle, setCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(false);
  const [payMethod, setPayMethod] = useState<'card' | 'upi' | 'apple' | 'google'>('card');
  const [done, setDone] = useState(false);

  const plan = PLANS.find((p) => p.id === selected)!;
  const price = cycle === 'yearly' ? plan.price * 10 : cycle === 'quarterly' ? plan.price * 3 : plan.price;
  const gst = Math.round(price * 0.18);
  const total = applied ? Math.round((price + gst) * 0.8) : price + gst;

  const pay = () => {
    setDone(true);
    setTimeout(() => navigate({ name: 'home' }), 1600);
  };

  if (done) {
    return (
      <div className="fixed inset-0 bg-ink-975 flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-24 h-24 rounded-full brand-gradient flex items-center justify-center mx-auto mb-6 animate-pulse-brand">
            <Check size={48} />
          </div>
          <h1 className="text-3xl font-black">Payment Successful!</h1>
          <p className="text-white/60 mt-2">Your {plan.name} plan is now active. Enjoy streaming!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24 min-h-screen pb-16">
      <div className="page-shell py-6">
        <button onClick={back} className="flex items-center gap-1.5 text-white/60 hover:text-white mb-6">
          <ChevronLeft size={20} /> Back
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-4">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs">7-day free trial included</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Choose Your Plan</h1>
          <p className="text-white/60 mt-2">Cancel anytime. No commitments.</p>
        </div>

        {/* Cycle toggle */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-full p-1 flex gap-1">
            {(['monthly', 'quarterly', 'yearly'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                  cycle === c ? 'brand-gradient' : 'hover:bg-white/10'
                }`}
              >
                {c}
                {c === 'yearly' && <span className="ml-1.5 text-[10px] text-green-400">Save 17%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelected(p.id)}
              className={`relative glass rounded-2xl p-6 cursor-pointer transition-all ${
                selected === p.id ? 'ring-2 ring-brand-500 scale-[1.02]' : 'hover:bg-white/5'
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ background: p.color }}>
                  {p.badge}
                </div>
              )}
              <div className="flex items-center gap-2 mb-1">
                <Crown size={20} style={{ color: p.color }} />
                <h3 className="text-xl font-bold">{p.name}</h3>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black">₹{p.price}</span>
                <span className="text-white/50 text-sm">/{p.period}</span>
              </div>
              <div className="text-sm text-white/70 mb-4">{p.resolution}</div>
              <ul className="space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-green-400 shrink-0 mt-0.5" />
                    <span className="text-white/80">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Coupon */}
        <div className="glass rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon code (try STREAM20)"
              className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={() => setApplied(coupon.toUpperCase() === 'STREAM20')}
              className="px-5 py-2.5 rounded-lg brand-gradient font-semibold text-sm"
            >
              Apply
            </button>
          </div>
          {applied && <div className="mt-2 text-sm text-green-400 flex items-center gap-1.5"><Check size={14} /> Coupon applied — 20% off!</div>}
        </div>

        {/* Payment methods */}
        <div className="glass rounded-xl p-5 mb-6">
          <h3 className="font-bold mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'card', label: 'Card', icon: CreditCard },
              { id: 'upi', label: 'UPI', icon: Smartphone },
              { id: 'apple', label: 'Apple Pay', icon: Apple },
              { id: 'google', label: 'Google Pay', icon: Wallet },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setPayMethod(m.id as typeof payMethod)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  payMethod === m.id ? 'border-brand-500 bg-brand-500/10' : 'border-white/15 hover:bg-white/5'
                }`}
              >
                <m.icon size={24} />
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>

          {payMethod === 'card' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <input placeholder="Card number" className="bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 sm:col-span-2" />
              <input placeholder="MM / YY" className="bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
              <input placeholder="CVV" className="bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="glass rounded-xl p-5 mb-6">
          <h3 className="font-bold mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <Row label={`${plan.name} (${cycle})`} value={`₹${price}`} />
            <Row label="GST (18%)" value={`₹${gst}`} />
            {applied && <Row label="Coupon (STREAM20)" value="-20%" green />}
            <div className="h-px bg-white/10 my-2" />
            <Row label="Total" value={`₹${total}`} bold />
          </div>
        </div>

        <button
          onClick={pay}
          className="w-full py-4 rounded-xl brand-gradient font-bold text-lg hover:scale-[1.01] transition-transform shadow-lg shadow-brand-500/30"
        >
          Pay ₹{total} & Start Watching
        </button>
        <p className="text-center text-xs text-white/40 mt-3">
          By subscribing you agree to StreamVerse Terms. Cancel anytime. Includes 7-day free trial.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, bold, green }: { label: string; value: string; bold?: boolean; green?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'font-bold' : 'text-white/70'}>{label}</span>
      <span className={`${bold ? 'font-bold text-lg' : ''} ${green ? 'text-green-400' : ''}`}>{value}</span>
    </div>
  );
}
