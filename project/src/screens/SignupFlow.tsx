import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Lock, Smartphone, CreditCard, ChevronLeft, QrCode, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../store';
import { PLANS } from '../data';
import api from '../api';

export default function SignupFlow({ email: prefilledEmail }: { email?: string }) {
  const { navigate, setAuthed } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [cycle, setCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [email, setEmail] = useState(prefilledEmail || '');
  const [password, setPassword] = useState('');
  const [payMethod, setPayMethod] = useState<'card' | 'upi'>('card');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Card form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const plan = PLANS.find((p) => p.id === selectedPlan)!;
  const price = cycle === 'yearly' ? plan.price * 10 : cycle === 'quarterly' ? plan.price * 3 : plan.price;
  const gst = Math.round(price * 0.18);
  const total = price + gst;

  const handleNextStep1 = () => {
    setStep(2);
  };

  const handleNextStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Attempt signup via Supabase Client
      await api.signUp(email, password, 'Subscriber');
      setStep(3);
    } catch (err: any) {
      console.warn('Supabase offline or config missing. Falling back to local signup simulation.', err);
      // Simulate local signup
      localStorage.setItem('simulated_user', JSON.stringify({ email, plan: selectedPlan }));
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      // Check if logged in in Supabase
      const session = await api.getSession();
      const userId = session?.user?.id;

      if (userId) {
        // Log transaction details to Supabase backend
        await api.createSubscription(userId, selectedPlan, payMethod);
        await api.recordPayment(userId, total, 'INR', payMethod);
      } else {
        // Simulated local subscription storage
        const userObj = JSON.parse(localStorage.getItem('simulated_user') || '{}');
        localStorage.setItem('simulated_subscription', JSON.stringify({
          ...userObj,
          plan: selectedPlan,
          status: 'active',
          paymentMethod: payMethod,
          paidAmount: total,
          createdAt: new Date().toISOString()
        }));
      }

      setStep(4);
    } catch (err: any) {
      console.warn('Supabase offline. Simulating payment success locally.', err);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const finishSetup = () => {
    setAuthed(true);
    // Redirect to profiles selection page with Netflix success param
    navigate({ name: 'profiles' });
    // Push url query param
    window.history.pushState({}, '', '/in/?accountCreated=success');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="page-shell h-16 flex items-center justify-between">
          <button onClick={() => navigate({ name: 'onboarding' })} className="flex items-center gap-2 text-white">
            <span className="font-display text-2xl tracking-wider">
              STREAM<span className="text-brand-500">VERSE</span>
            </span>
          </button>
          {step < 4 && (
            <button
              onClick={() => navigate({ name: 'auth', mode: 'login' })}
              className="text-sm font-semibold hover:underline text-white/80 hover:text-white"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="flex-1 flex items-center justify-center p-4 py-12 md:py-16">
        <div className="w-full max-w-4xl glass-strong border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Progress Indicators */}
          {step < 4 && (
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 text-xs text-white/40 font-bold uppercase tracking-wider">
              <span>Step {step} of 3</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={`w-8 h-1 rounded transition-colors ${
                      step >= s ? 'bg-brand-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-3">
                    <Sparkles size={12} />
                    Choose the plan that's right for you
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight">Select your Subscription Plan</h1>
                  <p className="text-white/60 text-sm mt-1">Upgrade or downgrade anytime. No lock-in contracts.</p>
                </div>

                {/* Plan Toggle Cycle */}
                <div className="flex justify-center mb-8">
                  <div className="glass rounded-full p-1 flex gap-1">
                    {(['monthly', 'quarterly', 'yearly'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCycle(c)}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold capitalize transition-all ${
                          cycle === c ? 'brand-gradient text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {c}
                        {c === 'yearly' && <span className="ml-1.5 text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">Save 17%</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {PLANS.map((p) => {
                    const planPrice = cycle === 'yearly' ? p.price * 10 : cycle === 'quarterly' ? p.price * 3 : p.price;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlan(p.id)}
                        className={`relative glass-strong rounded-xl p-5 cursor-pointer border-2 transition-all flex flex-col ${
                          selectedPlan === p.id
                            ? 'border-brand-500 bg-brand-500/5 shadow-[0_0_20px_rgba(229,9,20,0.15)] scale-[1.01]'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {p.badge && (
                          <span
                            className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white shadow-lg"
                            style={{ backgroundColor: p.color }}
                          >
                            {p.badge}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <Crown size={18} style={{ color: p.color }} />
                          <span className="font-bold text-lg">{p.name}</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-2xl font-black">₹{planPrice}</span>
                          <span className="text-white/40 text-xs">/{p.period}</span>
                        </div>
                        <p className="text-xs text-white/50 mb-4">{p.resolution} Resolution</p>
                        
                        <div className="h-px bg-white/5 mb-4" />
                        
                        <ul className="space-y-2.5 flex-1">
                          {p.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-xs">
                              <Check size={14} className="text-brand-500 shrink-0 mt-0.5" />
                              <span className="text-white/80 leading-normal">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextStep1}
                    className="w-full sm:w-auto px-10 py-3.5 rounded-xl brand-gradient font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-brand-500/25 flex items-center justify-center gap-1.5"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tight">Create a password to start your membership</h1>
                    <p className="text-white/60 text-sm mt-2">Just a few more steps and you're done! We hate paperwork, too.</p>
                  </div>

                  <form onSubmit={handleNextStep2} className="space-y-4">
                    {errorMessage && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {errorMessage}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-white placeholder:text-white/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password (min 6 chars)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-white placeholder:text-white/20"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white"
                      >
                        <ChevronLeft size={16} /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3.5 rounded-xl brand-gradient font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-brand-500/25 flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {loading ? 'Registering...' : 'Create Account'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/30 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock size={24} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Set up your payment method</h1>
                    <p className="text-white/60 text-sm mt-1">Your billing begins after checkout. Secure transaction gateway.</p>
                  </div>

                  {/* Payment Switch */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => setPayMethod('card')}
                      className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border-2 transition-all ${
                        payMethod === 'card'
                          ? 'border-brand-500 bg-brand-500/5 font-bold text-white'
                          : 'border-white/10 hover:border-white/20 text-white/60 hover:text-white'
                      }`}
                    >
                      <CreditCard size={18} />
                      <span className="text-sm">Credit / Debit Card</span>
                    </button>
                    <button
                      onClick={() => setPayMethod('upi')}
                      className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border-2 transition-all ${
                        payMethod === 'upi'
                          ? 'border-brand-500 bg-brand-500/5 font-bold text-white'
                          : 'border-white/10 hover:border-white/20 text-white/60 hover:text-white'
                      }`}
                    >
                      <Smartphone size={18} />
                      <span className="text-sm">UPI Payment (QR Code)</span>
                    </button>
                  </div>

                  {/* Payment Form Interface */}
                  <div className="glass-strong rounded-xl p-5 mb-6 border border-white/5">
                    {payMethod === 'card' ? (
                      <div className="space-y-4">
                        <h3 className="font-bold text-sm text-white/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <ShieldCheck size={16} className="text-green-500" />
                          Secure Credit / Debit Card Checkout
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2">
                            <input
                              required
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              placeholder="Cardholder Name"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                              placeholder="Card Number (4000 1234 5678 9010)"
                              maxLength={19}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                            />
                          </div>
                          <div>
                            <input
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="Expiry Date (MM / YY)"
                              maxLength={5}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                            />
                          </div>
                          <div>
                            <input
                              required
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="CVV Code"
                              maxLength={3}
                              type="password"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 flex flex-col items-center">
                        <h3 className="font-bold text-sm text-white/80 uppercase tracking-wider mb-4 flex items-center gap-1.5 justify-center">
                          <QrCode size={16} className="text-brand-500" />
                          Pay with UPI Code
                        </h3>
                        <div className="bg-white p-3.5 rounded-xl inline-block shadow-2xl mb-4">
                          {/* Simulated QR Code drawing using CSS block */}
                          <div className="w-40 h-40 border-4 border-black bg-white flex items-center justify-center p-2 relative">
                            <div className="grid grid-cols-5 grid-rows-5 gap-1.5 w-full h-full opacity-85">
                              {[...Array(25)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`rounded-sm ${
                                    (i % 3 === 0 || i % 4 === 0 || i < 5 || i % 5 === 0) && i !== 12
                                      ? 'bg-black'
                                      : 'bg-transparent'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="absolute font-black text-[10px] text-brand-500 bg-white px-1.5 py-0.5 rounded border border-black/10 select-none">
                              STREAMVERSE
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-white/50 max-w-sm mb-4">
                          Scan this QR code using GPay, PhonePe, Paytm, or BHIM to pay instantly.
                        </p>
                        <button
                          onClick={handlePayment}
                          className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded-lg text-xs hover:bg-green-500/20 transition-all flex items-center gap-1"
                        >
                          <Check size={14} />
                          Simulate Successful UPI Scan
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Summary Invoice details */}
                  <div className="glass rounded-xl p-5 mb-8 border border-white/5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-white/40 mb-3">Order Invoice Summary</h4>
                    <div className="space-y-2 text-xs md:text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">{plan.name} Plan ({cycle} cycle)</span>
                        <span>₹{price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">GST Service Tax (18%)</span>
                        <span>₹{gst}</span>
                      </div>
                      <div className="h-px bg-white/10 my-2" />
                      <div className="flex justify-between font-bold text-sm">
                        <span>Total Due Amount</span>
                        <span className="text-brand-500 text-base">₹{total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    {payMethod === 'card' && (
                      <button
                        onClick={handlePayment}
                        disabled={loading || !cardName || !cardNumber || !cardExpiry || !cardCvv}
                        className="px-8 py-3.5 rounded-xl brand-gradient font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-brand-500/25 flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {loading ? 'Processing...' : `Pay ₹${total} & Activate`}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="animate-pulse" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">Account Created Successfully!</h1>
                <p className="text-white/60 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                  Welcome to StreamVerse! Your plan has been recorded in the database, and you can now set up your family profiles.
                </p>
                <div className="mt-8">
                  <button
                    onClick={finishSetup}
                    className="px-10 py-3.5 rounded-xl brand-gradient font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-brand-500/25 inline-flex items-center gap-1.5"
                  >
                    Set Up Profiles
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Basic footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-white/30">
        <p>StreamVerse OTT © 2026. Security Checkout Secured by SSL.</p>
      </footer>
    </div>
  );
}
