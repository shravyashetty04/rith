import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ChevronLeft, Sparkles, CreditCard, Smartphone, Apple, Wallet, Star,
  Laptop, Download, Lock, HelpCircle, Tv, ShieldCheck, Ticket
} from 'lucide-react';
import { useApp } from '../store';

const PLANS_DATA = [
  {
    id: 'gold',
    theme: 'gold',
    name: 'GOLD',
    badge: '★ RECOMMENDED',
    subBadge: 'AD FREE',
    tagline: 'BEST VALUE FOR BINGE WATCHERS',
    benefit: 'EARLY ACCESS TO NEW TELUGU PREMIERES',
    description: '4K • Dolby Atmos • Ads-Free Telugu & Tamil Movies & Web series',
    period: '1 Year',
    price: 999,
    originalPrice: 1499,
    color: '#D97706',
    badgeColor: '#F59E0B',
    textColor: 'text-amber-500',
    borderColor: 'border-amber-500/20 hover:border-amber-500/60',
    btnBg: 'bg-amber-500 hover:bg-amber-600 text-black',
  },
  {
    id: 'annual_premium',
    theme: 'green',
    name: 'Annual Premium',
    badge: 'No Ads',
    subBadge: 'AD FREE',
    tagline: 'PREMIUM STREAMING WITH ZERO INTERRUPTIONS',
    benefit: 'SMART RECOMMENDATIONS FOR YOUR FAVORITE GENRES',
    description: 'Full HD (1080p) • 5.1 • Ads-Free Telugu & Tamil Movies & Web series',
    period: '1 Year',
    price: 699,
    originalPrice: 1299,
    color: '#059669',
    badgeColor: '#10B981',
    textColor: 'text-emerald-500',
    borderColor: 'border-emerald-500/20 hover:border-emerald-500/60',
    btnBg: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  },
  {
    id: 'quarterly',
    theme: 'blue',
    name: 'Quarterly',
    badge: 'Begins ₹67/Month',
    subBadge: 'ADS',
    tagline: 'PERFECT FOR SHORT-TERM ACCESS',
    benefit: 'FLEXIBLE 3-MONTH PASS WITH EASY RENEWAL',
    description: 'Full HD (1080p) • Stereo • Ads Telugu & Tamil Movies & Web series',
    period: '3 Months',
    price: 199,
    originalPrice: 299,
    color: '#2563EB',
    badgeColor: '#3B82F6',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/20 hover:border-blue-500/60',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  {
    id: 'quarterly_mobile',
    theme: 'purple',
    name: 'Quarterly Mobile',
    badge: 'ADS',
    subBadge: '',
    tagline: 'MOBILE-ONLY STREAMING ON THE GO',
    benefit: 'POCKET-FRIENDLY PLAN FOR COMMUTERS AND STUDENTS',
    description: 'HD (720p) • Stream on mobile only Autorenew @₹149 • Stereo • Ads Telugu & Tamil Movies & Web series',
    period: '3 Months',
    price: 99,
    originalPrice: 149,
    color: '#7C3AED',
    badgeColor: '#8B5CF6',
    textColor: 'text-violet-500',
    borderColor: 'border-violet-500/20 hover:border-violet-500/60',
    btnBg: 'bg-violet-600 hover:bg-violet-700 text-white',
  }
];

const ANNUAL_WIDE_PLAN = {
  id: 'annual',
  theme: 'red',
  name: 'Annual',
  badge: '★ LIMITED ADS ★',
  tagline: 'LOWEST ANNUAL PRICE WITH TOP FEATURES',
  benefit: 'EXCLUSIVE FESTIVAL COLLECTIONS AND FAMILY SHARING TIPS',
  description: 'Full HD (1080p) • Stereo • Limited Ads Telugu & Tamil Movies & Web series',
  period: '1 Year',
  price: 499,
  originalPrice: 699,
  color: '#DC2626',
  badgeColor: '#EF4444',
  textColor: 'text-red-500',
  borderColor: 'border-red-600/20 hover:border-red-600/60',
  btnBg: 'bg-red-600 hover:bg-red-700 text-white',
};

export default function Subscription() {
  const { back, navigate, setPlan } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<any>(null); // For checkout modal drawer
  const [payMethod, setPayMethod] = useState<'card' | 'upi' | 'apple' | 'google'>('card');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleCheckout = (planObj: any) => {
    setSelectedPlan(planObj);
  };

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setPlan('premium'); // Promotes state to premium to unlock all content
      setTimeout(() => {
        navigate({ name: 'home' });
      }, 1600);
    }, 2000);
  };

  if (done) {
    return (
      <div className="fixed inset-0 bg-[#090a0f] z-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm w-full">
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Check size={48} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-white">Payment Successful!</h1>
          <p className="text-white/60 mt-2">Your Premium access is now active. Enjoy streaming in high-definition!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080c] text-white pt-20 lg:pt-24 pb-16 relative overflow-hidden">
      {/* Background ambient flares */}
      <div className="absolute top-1/4 left-[-10%] w-[40%] h-[30%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-[-10%] w-[40%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-[40%] w-[30%] h-[20%] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="page-shell relative z-10">
        {/* Back button */}
        <button onClick={back} className="flex items-center gap-1.5 text-white/50 hover:text-white mb-8 transition-colors text-sm">
          <ChevronLeft size={18} /> Back
        </button>

        {/* Top Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-amber-500 font-black tracking-[0.35em] text-xs uppercase flex items-center justify-center gap-1.5 mb-2.5">
            <span>★</span> CHOOSE YOUR <span>★</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wide uppercase text-white drop-shadow-[0_0_20px_rgba(245,158,11,0.2)] mb-4">
            Perfect Plan
          </h1>
          <div className="inline-block bg-[#e5a93b]/10 border border-[#e5a93b]/20 px-5 py-1.5 rounded-full mb-6">
            <span className="text-[#e5a93b] text-xs font-black tracking-widest uppercase">
              PREMIUM ENTERTAINMENT. YOUR WAY.
            </span>
          </div>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Unlock exclusive Telugu & Tamil hits, ad-free premieres, and unbeatable yearly savings in one premium plan.
          </p>
        </div>

        {/* Filters pills rows */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold text-white/60 tracking-wider uppercase bg-white/5 px-6 py-2.5 rounded-full border border-white/10">
            <span>4K MOVIES</span>
            <span className="text-white/20">•</span>
            <span>OFFLINE DOWNLOADS</span>
            <span className="text-white/20">•</span>
            <span>EXCLUSIVE ORIGINALS</span>
          </div>
          <div className="text-amber-500/30 tracking-widest text-[8px] sm:text-xs font-bold mt-4 select-none">
            •••••••••••••••••••••••••••••••••••••••••••••
          </div>
        </div>

        {/* Plan Cards 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
          {PLANS_DATA.map((p) => (
            <div
              key={p.id}
              className={`relative glass border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl flex flex-col overflow-hidden min-h-[460px] row-shadow`}
            >
              {/* Ticket Notches */}
              <div className="absolute w-5 h-8 bg-[#07080c] rounded-r-full -left-2.5 top-[60%] -translate-y-1/2 border-r border-t border-b border-white/10 z-20 pointer-events-none" />
              <div className="absolute w-5 h-8 bg-[#07080c] rounded-l-full -right-2.5 top-[60%] -translate-y-1/2 border-l border-t border-b border-white/10 z-20 pointer-events-none" />
              
              {/* Vertical Dashed Line & Rotate ADMIT ONE */}
              <div className="absolute right-11 top-0 bottom-0 border-r border-dashed border-white/10 pointer-events-none z-20" />
              
              <div className="absolute right-0 top-0 bottom-0 w-[42px] flex flex-col items-center justify-center pointer-events-none select-none z-20">
                {/* Barcode top */}
                <div className="flex flex-col gap-0.5 opacity-20 mb-4">
                  <div className="w-5 h-[1px] bg-white" />
                  <div className="w-5 h-[2px] bg-white" />
                  <div className="w-5 h-[1px] bg-white" />
                  <div className="w-5 h-[3px] bg-white" />
                </div>
                {/* Admit text */}
                <span className="text-[7.5px] font-black tracking-[0.25em] text-white/40 uppercase whitespace-nowrap rotate-90 my-10">
                  ADMIT ONE
                </span>
                {/* Barcode bottom */}
                <div className="flex flex-col gap-0.5 opacity-20 mt-4">
                  <div className="w-5 h-[3px] bg-white" />
                  <div className="w-5 h-[1px] bg-white" />
                  <div className="w-5 h-[2px] bg-white" />
                  <div className="w-5 h-[1px] bg-white" />
                </div>
              </div>

              {/* Card Contents (Padded on the right to leave space for Ticket stub) */}
              <div className="p-6 pr-14 flex-1 flex flex-col justify-between">
                <div>
                  {/* Top Badge */}
                  <div className="h-6 flex items-center mb-4">
                    {p.badge && (
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-black bg-amber-500/10 text-amber-500 tracking-wider uppercase border border-amber-500/20">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  {/* Plan Name */}
                  <div className="flex items-center gap-2 mb-1.5">
                    {p.subBadge && (
                      <span className="px-1.5 py-0.5 text-[8px] font-black tracking-wide text-emerald-400 border border-emerald-500/20 rounded bg-emerald-500/5">
                        {p.subBadge}
                      </span>
                    )}
                    <h3 className="text-xl font-bold tracking-tight text-white">{p.name}</h3>
                  </div>

                  {/* Subtitle taglines */}
                  <div className="text-[10px] font-semibold text-white/50 tracking-wider uppercase mb-5 leading-normal">
                    {p.tagline}
                  </div>

                  {/* Benefit */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-[11px] font-bold text-amber-500/90 tracking-wide uppercase mb-6 leading-relaxed">
                    {p.benefit}
                  </div>

                  {/* Description details */}
                  <p className="text-[11px] text-white/60 leading-relaxed mb-6">
                    {p.description}
                  </p>
                </div>

                {/* Pricing & Subscribe */}
                <div>
                  <div className="text-white/40 text-[9px] font-black tracking-widest uppercase mb-1">{p.period} PASS</div>
                  
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-2xl font-black text-white">INR {p.price}</span>
                  </div>

                  {p.originalPrice && (
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-xs text-white/30 line-through">₹{p.originalPrice}</span>
                      <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                        BEST DEAL
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleCheckout(p)}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${p.btnBg}`}
                  >
                    ★ SUBSCRIBE ★
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 5th Plan: Horizontal Wide Card */}
        <div className="max-w-7xl mx-auto px-1.5 mb-16">
          <div className="relative glass border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl overflow-hidden min-h-[220px] row-shadow">
            {/* Ticket Notches */}
            <div className="absolute w-5 h-8 bg-[#07080c] rounded-r-full -left-2.5 top-[60%] -translate-y-1/2 border-r border-t border-b border-white/10 z-20 pointer-events-none" />
            <div className="absolute w-5 h-8 bg-[#07080c] rounded-l-full -right-2.5 top-[60%] -translate-y-1/2 border-l border-t border-b border-white/10 z-20 pointer-events-none" />
            
            {/* Vertical Dashed Line & Rotate ADMIT ONE */}
            <div className="absolute right-11 top-0 bottom-0 border-r border-dashed border-white/10 pointer-events-none z-20" />
            
            <div className="absolute right-0 top-0 bottom-0 w-[42px] flex flex-col items-center justify-center pointer-events-none select-none z-20">
              <div className="flex flex-col gap-0.5 opacity-20 mb-3">
                <div className="w-5 h-[1px] bg-white" />
                <div className="w-5 h-[2px] bg-white" />
              </div>
              <span className="text-[7.5px] font-black tracking-[0.25em] text-white/40 uppercase whitespace-nowrap rotate-90 my-6">
                ADMIT ONE
              </span>
              <div className="flex flex-col gap-0.5 opacity-20 mt-3">
                <div className="w-5 h-[2px] bg-white" />
                <div className="w-5 h-[1px] bg-white" />
              </div>
            </div>

            {/* Horizontal contents */}
            <div className="p-6 pr-14 md:p-8 md:pr-16 flex flex-col md:flex-row md:items-center justify-between gap-6 h-full">
              <div className="max-w-2xl">
                <span className="inline-block px-2.5 py-0.5 rounded text-[9px] font-black bg-red-500/10 text-red-500 tracking-wider uppercase border border-red-500/20 mb-3.5">
                  {ANNUAL_WIDE_PLAN.badge}
                </span>
                
                <h3 className="text-2xl font-black text-white flex items-center gap-2 mb-1.5">
                  {ANNUAL_WIDE_PLAN.name}
                </h3>
                
                <div className="text-[10px] font-bold text-white/50 tracking-wider uppercase mb-3">
                  {ANNUAL_WIDE_PLAN.tagline}
                </div>
                
                <p className="text-[11px] text-amber-500/90 font-bold uppercase tracking-wider mb-2.5">
                  {ANNUAL_WIDE_PLAN.benefit}
                </p>
                
                <p className="text-[11px] text-white/60 leading-normal max-w-xl">
                  {ANNUAL_WIDE_PLAN.description}
                </p>
              </div>

              <div className="shrink-0 flex flex-col justify-end md:items-end min-w-[200px]">
                <div className="text-white/40 text-[9px] font-black tracking-widest uppercase mb-1">
                  {ANNUAL_WIDE_PLAN.period} PASS
                </div>
                
                <div className="flex items-baseline gap-1.5 mb-1.5">
                  <span className="text-3xl font-black text-white">INR {ANNUAL_WIDE_PLAN.price}</span>
                </div>
                
                <div className="text-xs text-white/30 line-through mb-5">
                  ₹{ANNUAL_WIDE_PLAN.originalPrice}
                </div>

                <button
                  onClick={() => handleCheckout(ANNUAL_WIDE_PLAN)}
                  className={`w-full md:w-44 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${ANNUAL_WIDE_PLAN.btnBg}`}
                >
                  ★ SUBSCRIBE ★
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Watch feature row */}
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Laptop, text: 'Watch on any device' },
              { icon: Download, text: 'Download & watch offline' },
              { icon: Lock, text: 'Secure & easy payments' },
              { icon: HelpCircle, text: '24x7 Customer support' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0 text-amber-500">
                  <item.icon size={18} />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-white/80 leading-snug">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Perks List */}
        <div className="max-w-7xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-amber-500 text-[10px] font-black tracking-widest uppercase block mb-1">YOUR EXCLUSIVE EDGE</span>
              <h2 className="text-lg sm:text-2xl font-black text-white">Unique perks you won&apos;t find anywhere else</h2>
            </div>
            <span className="px-2.5 py-1 rounded text-[9px] font-black bg-amber-500/10 text-amber-500 tracking-widest uppercase border border-amber-500/20 flex items-center gap-1">
              <Star size={10} className="fill-amber-500" /> PREMIUM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Tv, title: 'Premiere Access', desc: 'Watch new Telugu & Tamil releases first.' },
              { icon: Ticket, title: 'Festival Picks', desc: 'Curated collections for every celebration.' },
              { icon: Star, title: 'Top Reviews', desc: 'Hand-picked shows loved by fans.' },
              { icon: ShieldCheck, title: 'Smart Savings', desc: 'Best deals updated automatically.' },
            ].map((perk, i) => (
              <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-xl flex gap-3 hover:border-white/10 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0 mt-0.5">
                  <perk.icon size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">{perk.title}</h4>
                  <p className="text-[11px] text-white/50">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-Up Checkout Drawer / Overlay Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0e1017] border border-white/10 p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl relative"
            >
              <h3 className="text-xl font-black mb-1 flex items-center gap-2">
                Checkout Plan: <span className={selectedPlan.textColor}>{selectedPlan.name}</span>
              </h3>
              <p className="text-white/60 text-xs mb-6">Select your payment method to complete subscription</p>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI', icon: Smartphone },
                  { id: 'apple', label: 'Apple Pay', icon: Apple },
                  { id: 'google', label: 'Google Pay', icon: Wallet },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id as any)}
                    className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                      payMethod === m.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'border-white/10 hover:bg-white/5 text-white/70'
                    }`}
                  >
                    <m.icon size={16} />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Form Input fields depending on method */}
              {payMethod === 'card' ? (
                <div className="space-y-3 mb-6">
                  <input
                    placeholder="Card number"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="MM / YY"
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <input
                      placeholder="CVV"
                      type="password"
                      maxLength={3}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <input
                    placeholder="Enter UPI ID (e.g., user@okhdfcbank)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Summary prices */}
              <div className="bg-white/5 rounded-xl p-4 mb-6 text-xs space-y-2 border border-white/10">
                <div className="flex justify-between">
                  <span className="text-white/60">Subtotal ({selectedPlan.period})</span>
                  <span>INR {selectedPlan.price}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">GST (18%)</span>
                  <span>INR {Math.round(selectedPlan.price * 0.18)}.00</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between font-black text-sm text-white">
                  <span>Grand Total</span>
                  <span className="text-amber-500">Grand Total INR {Math.round(selectedPlan.price * 1.18)}.00</span>
                </div>
              </div>

              {/* Bottom buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl brand-gradient font-bold hover:scale-[1.01] transition-transform text-xs text-white disabled:opacity-50"
                >
                  {loading ? 'Processing Payment...' : `Pay INR ${Math.round(selectedPlan.price * 1.18)}`}
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-all text-xs text-white/80"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
