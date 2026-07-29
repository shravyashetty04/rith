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
    description: [
      '4K • Dolby Atmos • Ads-Free',
      'Telugu & Tamil Movies & Web series',
      '• 1 Year'
    ],
    period: 'YEAR',
    price: 999,
    originalPrice: 1499,
    cardBg: 'bg-gradient-to-b from-[#141008] via-[#090806] to-[#120e06]',
    borderColor: 'border-[#a1761f]/60 hover:border-[#a1761f]',
    stubBg: 'bg-[#cca238]',
    stubText: 'text-black',
    badgeBg: 'bg-[#cca238] text-black',
    taglineBg: 'bg-white/5 border border-white/10 text-white/80',
    benefitColor: 'text-[#cca238]',
    btnBg: 'bg-[#cca238] text-black hover:bg-[#b08b2e]',
  },
  {
    id: 'annual_premium',
    theme: 'green',
    name: 'Annual Premium',
    badge: 'No Ads',
    subBadge: 'AD FREE',
    tagline: 'PREMIUM STREAMING WITH ZERO INTERRUPTIONS',
    benefit: 'SMART RECOMMENDATIONS FOR YOUR FAVORITE GENRES',
    description: [
      'Full HD (1080p) • 5.1 • Ads-Free',
      'Telugu & Tamil Movies',
      '& Web series • 1 Year'
    ],
    period: 'YEAR',
    price: 699,
    originalPrice: 1299,
    cardBg: 'bg-gradient-to-b from-[#06120b] via-[#030905] to-[#06120b]',
    borderColor: 'border-[#155f30]/60 hover:border-[#155f30]',
    stubBg: 'bg-[#17793d]',
    stubText: 'text-white',
    badgeBg: 'bg-[#17793d] text-white',
    taglineBg: 'bg-white/5 border border-white/10 text-white/80',
    benefitColor: 'text-[#10B981]',
    btnBg: 'bg-[#17793d] text-white hover:bg-[#115e2e]',
  },
  {
    id: 'quarterly',
    theme: 'blue',
    name: 'Quarterly',
    badge: 'Begins ₹67/Month',
    subBadge: 'ADS',
    tagline: 'PERFECT FOR SHORT-TERM ACCESS',
    benefit: 'FLEXIBLE 3-MONTH PASS WITH EASY RENEWAL',
    description: [
      'Full HD (1080p) • Stereo • Ads',
      'Telugu & Tamil Movies',
      '& Web series • 3 Months'
    ],
    period: 'MONTHS',
    price: 199,
    originalPrice: 299,
    cardBg: 'bg-gradient-to-b from-[#060b17] via-[#030509] to-[#060b17]',
    borderColor: 'border-[#1e40af]/60 hover:border-[#1e40af]',
    stubBg: 'bg-[#1d4ed8]',
    stubText: 'text-white',
    badgeBg: 'bg-[#1d4ed8] text-white',
    taglineBg: 'bg-white/5 border border-white/10 text-white/80',
    benefitColor: 'text-[#3B82F6]',
    btnBg: 'bg-[#1d4ed8] text-white hover:bg-[#173fa5]',
  },
  {
    id: 'quarterly_mobile',
    theme: 'purple',
    name: 'Quarterly Mobile',
    badge: 'ADS',
    subBadge: '',
    tagline: 'MOBILE-ONLY STREAMING ON THE GO',
    benefit: 'POCKET-FRIENDLY PLAN FOR COMMUTERS AND STUDENTS',
    description: [
      'HD (720p) • Stream on mobile only',
      'Autorenew @₹149 • Stereo • Ads',
      'Telugu & Tamil Movies & Web series • 3 Months'
    ],
    period: '3 MONTHS',
    price: 99,
    originalPrice: 149,
    cardBg: 'bg-gradient-to-b from-[#0f0617] via-[#070309] to-[#0f0617]',
    borderColor: 'border-[#5b21b6]/60 hover:border-[#5b21b6]',
    stubBg: 'bg-[#6d28d9]',
    stubText: 'text-white',
    badgeBg: 'bg-[#6d28d9] text-white',
    taglineBg: 'bg-white/5 border border-white/10 text-white/80',
    benefitColor: 'text-[#8B5CF6]',
    btnBg: 'bg-[#6d28d9] text-white hover:bg-[#551da8]',
  }
];

const ANNUAL_WIDE_PLAN = {
  id: 'annual',
  theme: 'red',
  name: 'Annual',
  badge: '★ LIMITED ADS ★',
  tagline: 'LOWEST ANNUAL PRICE WITH TOP FEATURES',
  benefit: 'EXCLUSIVE FESTIVAL COLLECTIONS AND FAMILY SHARING TIPS',
  description: 'Full HD (1080p) • Stereo • Limited Ads • Telugu & Tamil Movies & Web series • 1 Year',
  period: 'YEAR',
  price: 499,
  originalPrice: 699,
  cardBg: 'bg-gradient-to-b from-[#170608] via-[#0b0304] to-[#170608]',
  borderColor: 'border-[#991b1b]/60 hover:border-[#991b1b]',
  stubBg: 'bg-[#b91c1c]',
  stubText: 'text-white',
  badgeBg: 'bg-[#b91c1c] text-white',
  taglineBg: 'bg-white/5 border border-white/10 text-white/80',
  textColor: 'text-red-500',
  benefitColor: 'text-[#EF4444]',
  btnBg: 'bg-[#b91c1c] text-white hover:bg-[#991717]',
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
    <div
      className="min-h-screen text-white pt-20 lg:pt-24 pb-16 relative overflow-hidden select-none"
      style={{
        background: 'linear-gradient(to right, #150204 0%, #000000 12%, #000000 88%, #150204 100%)'
      }}
    >
      {/* Background ambient flares */}
      <div className="absolute top-1/4 left-[5%] w-[40%] h-[30%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-[5%] w-[40%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="page-shell relative z-10">
        {/* Back button */}
        <button onClick={back} className="flex items-center gap-1.5 text-white/50 hover:text-white mb-8 transition-colors text-sm">
          <ChevronLeft size={18} /> Back
        </button>

        {/* Top Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[#cca238] font-black tracking-[0.35em] text-xs uppercase flex items-center justify-center gap-1.5 mb-2">
            <span>★</span> CHOOSE YOUR <span>★</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wide uppercase text-white drop-shadow-[0_0_20px_rgba(245,158,11,0.2)] mb-4">
            Perfect Plan
          </h1>
          <div className="inline-block bg-[#cca238]/10 border border-[#cca238]/20 px-5 py-1 rounded-full mb-5">
            <span className="text-[#cca238] text-[10px] sm:text-xs font-black tracking-widest uppercase">
              PREMIUM ENTERTAINMENT. YOUR WAY.
            </span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Unlock exclusive Telugu & Tamil hits, ad-free premieres, and unbeatable yearly savings in one premium plan.
          </p>
        </div>

        {/* Filters pills rows */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] font-bold text-white/50 tracking-wider uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10">
            <span>4K MOVIES</span>
            <span className="text-white/20">•</span>
            <span>OFFLINE DOWNLOADS</span>
            <span className="text-white/20">•</span>
            <span>EXCLUSIVE ORIGINALS</span>
          </div>
          <div className="text-amber-500/20 tracking-widest text-[8px] sm:text-xs font-bold mt-4 select-none">
            •••••••••••••••••••••••••••••••••••••••••••••
          </div>
        </div>

        {/* Plan Cards 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
          {PLANS_DATA.map((p) => (
            <div
              key={p.id}
              className={`relative ${p.cardBg} border ${p.borderColor} transition-all duration-300 rounded-2xl h-[520px] overflow-hidden row-shadow flex`}
            >
              {/* Inner Circular Cutout Notch - Top Part (aligned at 30% mark of the vertical separation line) */}
              <div className="absolute w-5 h-5 bg-[#000000] border border-white/10 rounded-full right-[26px] top-[30%] -translate-y-1/2 z-20 pointer-events-none" />
              {/* Inner Circular Cutout Notch - Bottom Part (aligned at 70% mark of the vertical separation line) */}
              <div className="absolute w-5 h-5 bg-[#000000] border border-white/10 rounded-full right-[26px] bottom-[30%] translate-y-1/2 z-20 pointer-events-none" />
              
              {/* Vertical Dashed Perforation Line - connecting top cutout to bottom cutout */}
              <div className="absolute right-[36px] top-[30%] bottom-[30%] border-r border-dashed border-white/20 pointer-events-none z-20" />
              
              {/* Right Solid Colored Ticket Stub Accent Strip */}
              <div className={`absolute right-0 top-0 bottom-0 w-9 ${p.stubBg} flex flex-col items-center justify-between py-6 select-none z-10 border-l border-black/20 rounded-r-2xl`}>
                {/* Barcode top */}
                <div className={`flex flex-col gap-0.5 ${p.stubText} opacity-30`}>
                  <div className="w-5 h-[1px] bg-current" />
                  <div className="w-5 h-[3px] bg-current" />
                  <div className="w-5 h-[1px] bg-current" />
                  <div className="w-5 h-[2px] bg-current" />
                </div>
                {/* Admit Text */}
                <span className={`text-[8.5px] font-black tracking-[0.25em] ${p.stubText} uppercase whitespace-nowrap rotate-90 my-auto`}>
                  ADMIT ONE
                </span>
                {/* Barcode bottom */}
                <div className={`flex flex-col gap-0.5 ${p.stubText} opacity-30`}>
                  <div className="w-5 h-[3px] bg-current" />
                  <div className="w-5 h-[1px] bg-current" />
                  <div className="w-5 h-[2px] bg-current" />
                  <div className="w-5 h-[1px] bg-current" />
                </div>
              </div>

              {/* Left Main Contents Area (occupies 100% height, width leaves space for the right vertical strip) */}
              <div className="w-[calc(100%-36px)] h-full p-5 pr-4 flex flex-col justify-between">
                <div>
                  {/* Top Badge */}
                  <div className="h-6 flex items-center mb-3">
                    {p.badge && (
                      <span className={`px-2.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase ${p.badgeBg}`}>
                        {p.badge}
                      </span>
                    )}
                  </div>

                  {/* Plan Name & Ad Free bubble */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {p.subBadge && (
                      <span className="px-1.5 py-0.5 text-[8.5px] font-black tracking-wide text-emerald-400 border border-emerald-500/20 rounded bg-emerald-500/5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {p.subBadge}
                      </span>
                    )}
                    <h3 className="text-xl font-bold tracking-tight text-white">{p.name}</h3>
                  </div>

                  {/* Subtitle taglines capsules */}
                  <div className="inline-block bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-[8.5px] font-bold text-white/50 tracking-wider uppercase mb-4 max-w-full truncate">
                    {p.tagline}
                  </div>

                  {/* Benefit text */}
                  <div className={`text-[10px] font-bold tracking-wide uppercase leading-relaxed ${p.benefitColor} mb-3.5`}>
                    {p.benefit}
                  </div>

                  {/* Description details list */}
                  <div className="text-[10.5px] text-white/60 leading-normal space-y-0.5">
                    {p.description.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>

                {/* Bottom checkout elements (Pricing & Subscribe capsule button) */}
                <div className="mt-auto pt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-white">INR {p.price}</span>
                  </div>
                  
                  <div className="text-white/30 text-[9px] font-black tracking-widest uppercase mt-0.5">
                    {p.period}
                  </div>

                  {p.originalPrice && (
                    <div className="flex items-center gap-2 mt-2 mb-4">
                      <span className="text-xs text-white/30 line-through">₹{p.originalPrice}</span>
                      <span className="text-[8px] font-black text-[#cca238] uppercase bg-[#cca238]/10 border border-[#cca238]/20 px-1.5 py-0.5 rounded">
                        BEST DEAL
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleCheckout(p)}
                    className={`w-full py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${p.btnBg}`}
                  >
                    ★ SUBSCRIBE ★
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 5th Plan: Horizontal Wide Card (Red Theme) */}
        <div className="max-w-7xl mx-auto px-0.5 mb-12">
          <div className={`relative ${ANNUAL_WIDE_PLAN.cardBg} border ${ANNUAL_WIDE_PLAN.borderColor} transition-all duration-300 rounded-2xl h-[220px] overflow-hidden row-shadow`}>
            
            {/* Top notch cutout aligned with vertical dashed line */}
            <div className="absolute w-6 h-6 bg-[#000000] border border-white/10 rounded-full -top-3 right-[236px] z-20 pointer-events-none" />
            {/* Bottom notch cutout aligned with vertical dashed line */}
            <div className="absolute w-6 h-6 bg-[#000000] border border-white/10 rounded-full -bottom-3 right-[236px] z-20 pointer-events-none" />
            
            {/* Vertical Dashed Perforation Line */}
            <div className="absolute right-[248px] top-[20%] bottom-[20%] border-r border-dashed border-white/15 pointer-events-none z-20" />
            
            {/* Right Solid Colored Ticket Stub Strip */}
            <div className={`absolute right-0 top-0 bottom-0 w-8 ${ANNUAL_WIDE_PLAN.stubBg} flex flex-col items-center justify-between py-6 select-none z-10 border-l border-white/10 rounded-r-2xl`}>
              <div className={`flex flex-col gap-0.5 ${ANNUAL_WIDE_PLAN.stubText} opacity-30`}>
                <div className="w-4 h-[1px] bg-current" />
                <div className="w-4 h-[2px] bg-current" />
              </div>
              <span className={`text-[8.5px] font-black tracking-[0.25em] ${ANNUAL_WIDE_PLAN.stubText} uppercase whitespace-nowrap rotate-90 my-auto`}>
                ADMIT ONE
              </span>
              <div className={`flex flex-col gap-0.5 ${ANNUAL_WIDE_PLAN.stubText} opacity-30`}>
                <div className="w-4 h-[2px] bg-current" />
                <div className="w-4 h-[1px] bg-current" />
              </div>
            </div>

            {/* Left Content Area (leaves space for price block & ticket strip) */}
            <div className="absolute left-0 top-0 bottom-0 right-[248px] p-6 flex flex-col justify-between">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase border border-red-500/20 mb-3 bg-red-500/10 ${ANNUAL_WIDE_PLAN.textColor}`}>
                  {ANNUAL_WIDE_PLAN.badge}
                </span>
                
                <h3 className="text-2xl font-black text-white flex items-center gap-2 mb-0.5">
                  {ANNUAL_WIDE_PLAN.name}
                </h3>
                
                <div className="inline-block bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-[8px] font-bold text-white/50 tracking-wider uppercase mb-3">
                  {ANNUAL_WIDE_PLAN.tagline}
                </div>
                
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-[#EF4444]">
                  {ANNUAL_WIDE_PLAN.benefit}
                </p>
                
                <p className="text-[10px] text-white/60 leading-normal max-w-xl">
                  {ANNUAL_WIDE_PLAN.description}
                </p>
              </div>
            </div>

            {/* Middle Price/Subscribe block (between left content and right ticket stub) */}
            <div className="absolute right-[32px] top-0 bottom-0 w-[216px] p-6 flex flex-col justify-between items-end">
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="text-2xl font-black text-white">INR {ANNUAL_WIDE_PLAN.price}</span>
                </div>
                
                <div className="text-white/30 text-[9px] font-black tracking-widest uppercase mt-0.5">
                  {ANNUAL_WIDE_PLAN.period}
                </div>
                
                <div className="text-xs text-white/30 line-through">
                  ₹{ANNUAL_WIDE_PLAN.originalPrice}
                </div>
              </div>

              <button
                onClick={() => handleCheckout(ANNUAL_WIDE_PLAN)}
                className={`w-40 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${ANNUAL_WIDE_PLAN.btnBg}`}
              >
                ★ SUBSCRIBE ★
              </button>
            </div>
          </div>
        </div>

        {/* Watch feature trust row */}
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Laptop, text: 'Watch on any device' },
              { icon: Download, text: 'Download & watch offline' },
              { icon: Lock, text: 'Secure & easy payments' },
              { icon: HelpCircle, text: '24x7 Customer support' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0 text-[#cca238]">
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
              <span className="text-[#cca238] text-[10px] font-black tracking-widest uppercase block mb-1">YOUR EXCLUSIVE EDGE</span>
              <h2 className="text-lg sm:text-2xl font-black text-white">Unique perks you won&apos;t find anywhere else</h2>
            </div>
            <span className="px-2.5 py-1 rounded text-[9px] font-black bg-[#cca238]/10 text-[#cca238] tracking-widest uppercase border border-[#cca238]/20 flex items-center gap-1">
              <Star size={10} className="fill-[#cca238]" /> PREMIUM
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
                <div className="w-8 h-8 rounded-lg bg-[#cca238]/10 flex items-center justify-center text-[#cca238] border border-[#cca238]/20 shrink-0 mt-0.5">
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
                  <span className="text-amber-500">INR {Math.round(selectedPlan.price * 1.18)}.00</span>
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
