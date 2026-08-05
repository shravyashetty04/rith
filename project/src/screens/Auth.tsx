import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone, Apple, ChevronLeft, Check } from 'lucide-react';
import { useApp, PROFILES } from '../store';
import api from '../api';

type Mode = 'login' | 'signup' | 'forgot';

export default function Auth({ mode }: { mode: Mode }) {
  const { navigate, setAuthed, setProfile } = useApp();
  const [m, setM] = useState<Mode>(mode);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (m === 'forgot') {
      setTimeout(() => {
        setLoading(false);
        setOtpSent(true);
      }, 900);
      return;
    }

    try {
      if (m === 'signup') {
        await api.signUp(email, password, fullName);
      } else {
        await api.signIn(email, password);
      }
      setAuthed(true);
      setProfile(PROFILES[0]);
      navigate({ name: 'home' });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const titles: Record<Mode, { h: string; s: string }> = {
    login: { h: 'Welcome back', s: 'Sign in to continue streaming' },
    signup: { h: 'Create your account', s: 'Start your free trial today' },
    forgot: { h: 'Reset password', s: 'We\'ll send you a reset link' },
  };

  return (
    <div className="fixed inset-0 bg-ink-975 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/2899724/pexels-photo-2899724.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-ink-975/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-975 via-ink-975/60 to-ink-975/40" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6">
        <button
          onClick={() => navigate({ name: 'onboarding' })}
          className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Back</span>
        </button>
        <span className="font-display text-2xl tracking-wider">
          STREAM<span className="text-brand-500">VERSE</span>
        </span>
      </div>

      {/* Card */}
      <div className="relative z-10 flex items-center justify-center px-4 pb-16 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md glass-strong rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={m + (otpSent ? '-otp' : '')}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-3xl font-black tracking-tight">{titles[m].h}</h1>
              <p className="text-white/60 mt-1.5 text-sm">{titles[m].s}</p>
              
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {otpSent ? (
                <div className="mt-7">
                  <p className="text-sm text-white/70 mb-4">Enter the 6-digit code sent to your email</p>
                  <div className="flex gap-2 justify-between">
                    {otp.map((d, idx) => (
                      <input
                        key={idx}
                        value={d}
                        onChange={(e) => {
                          const v = e.target.value.slice(-1);
                          setOtp((o) => o.map((x, i) => (i === idx ? v : x)));
                          if (v && idx < 5) {
                            const next = document.getElementById(`otp-${idx + 1}`);
                            next?.focus();
                          }
                        }}
                        id={`otp-${idx}`}
                        inputMode="numeric"
                        className="w-11 h-14 text-center text-xl font-bold bg-white/5 border border-white/15 rounded-xl focus:border-brand-500 focus:outline-none transition-colors"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => { setAuthed(true); setProfile(PROFILES[0]); navigate({ name: 'home' }); }}
                    className="w-full mt-6 py-3.5 rounded-xl brand-gradient font-bold hover:scale-[1.02] transition-transform"
                  >
                    Verify & Continue
                  </button>
                  <button
                    onClick={() => setOtpSent(false)}
                    className="w-full mt-3 text-sm text-white/60 hover:text-white"
                  >
                    Resend code
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-7 space-y-4">
                  {m === 'signup' && (
                    <Field label="Full name" type="text" placeholder="Alex Carter" icon={<Mail size={18} />} value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  )}
                  <Field label="Email" type="email" placeholder="you@email.com" icon={<Mail size={18} />} value={email} onChange={(e) => setEmail(e.target.value)} />
                  {m !== 'forgot' && (
                    <div className="relative">
                      <Field
                        label="Password"
                        type={showPw ? 'text' : 'password'}
                        placeholder="••••••••"
                        icon={<Lock size={18} />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="absolute right-3 top-9 text-white/50 hover:text-white"
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  )}

                  {m === 'login' && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded accent-brand-500" />
                        Remember me
                      </label>
                      <button type="button" onClick={() => setM('forgot')} className="text-brand-500 hover:text-brand-400">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl brand-gradient font-bold hover:scale-[1.02] transition-transform disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {m === 'login' ? 'Sign In' : m === 'signup' ? 'Create Account' : 'Send Reset Link'}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {!otpSent && (
                <>
                  <div className="flex items-center gap-3 my-6">
                    <div className="h-px bg-white/15 flex-1" />
                    <span className="text-xs text-white/40">or continue with</span>
                    <div className="h-px bg-white/15 flex-1" />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { icon: <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z"/></svg>, label: 'Google' },
                      { icon: <Apple size={18} />, label: 'Apple' },
                      { icon: <Phone size={18} />, label: 'OTP' },
                    ].map((p) => (
                      <button
                        key={p.label}
                        onClick={() => {
                          if (p.label === 'OTP') { setM('forgot'); setOtpSent(true); }
                          else { setAuthed(true); setProfile(PROFILES[0]); navigate({ name: 'home' }); }
                        }}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/15 hover:bg-white/10 transition-colors text-sm font-medium"
                      >
                        {p.icon}
                        <span className="hidden sm:inline">{p.label}</span>
                      </button>
                    ))}
                  </div>

                  <p className="mt-6 text-center text-sm text-white/60">
                    {m === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      onClick={() => setM(m === 'login' ? 'signup' : 'login')}
                      className="text-brand-500 font-semibold hover:text-brand-400"
                    >
                      {m === 'login' ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </>
              )}

              {m === 'signup' && !otpSent && (
                <p className="mt-4 text-center text-[11px] text-white/40 leading-relaxed">
                  By continuing you agree to our{' '}
                  <span className="underline">Terms</span> and{' '}
                  <span className="underline">Privacy Policy</span>.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Feature strip */}
      <div className="relative z-10 hidden sm:flex items-center justify-center gap-8 pb-10 text-xs text-white/40">
        {['4K Ultra HD', 'No Ads', 'Download & Go', 'Cancel Anytime'].map((f) => (
          <div key={f} className="flex items-center gap-1.5">
            <Check size={14} className="text-brand-500" />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, type, placeholder, icon, value, onChange }: { label: string; type: string; placeholder: string; icon: React.ReactNode; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="block">
      <span className="text-xs text-white/60 font-medium">{label}</span>
      <div className="relative mt-1.5">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/15 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all text-white placeholder:text-white/30"
          required
        />
      </div>
    </label>
  );
}
