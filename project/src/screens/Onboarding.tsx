import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Sparkles, Tv, Baby, Crown } from 'lucide-react';
import { useApp } from '../store';

const SLIDES = [
  {
    icon: Play,
    title: 'Watch Anything, Anywhere',
    body: 'Stream thousands of movies, series, and originals in stunning 4K HDR. From blockbusters to hidden gems — all in one place.',
    image: 'https://images.pexels.com/photos/2899724/pexels-photo-2899724.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    accent: '#E50914',
  },
  {
    icon: Tv,
    title: 'Live TV, Sports & Events',
    body: 'Never miss a moment. Watch live cricket, football, news, and exclusive events streaming in real-time, with DVR controls.',
    image: 'https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    accent: '#3b82f6',
  },
  {
    icon: Baby,
    title: 'Safe Space for Kids',
    body: 'A PIN-protected kids profile with hand-picked animation, learning shows, and family films. Total peace of mind for parents.',
    image: 'https://images.pexels.com/photos/1005012/pexels-photo-1005012.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    accent: '#22c55e',
  },
  {
    icon: Crown,
    title: 'Premium, Ad-Free, Yours',
    body: 'Unlock the full library in 4K Ultra HD with Dolby Atmos, download to watch offline, and stream on up to 6 devices.',
    image: 'https://images.pexels.com/photos/1615816/pexels-photo-1615816.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    accent: '#f59e0b',
  },
];

export default function Onboarding() {
  const { navigate } = useApp();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;

  const next = () => (last ? navigate({ name: 'auth', mode: 'login' }) : setI((v) => v + 1));
  const prev = () => setI((v) => Math.max(0, v - 1));

  return (
    <div className="fixed inset-0 bg-ink-975 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-975 via-ink-975/70 to-ink-975/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-975/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Logo */}
      <div className="absolute top-8 left-6 sm:left-10 z-20">
        <span className="font-display text-3xl tracking-wider text-white">
          STREAM<span className="text-brand-500">VERSE</span>
        </span>
      </div>

      <button
        onClick={() => navigate({ name: 'auth', mode: 'login' })}
        className="absolute top-8 right-6 sm:right-10 z-20 text-sm text-white/70 hover:text-white transition-colors"
      >
        Skip
      </button>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 sm:px-10 lg:px-16 pb-16 sm:pb-20">
        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: `${slide.accent}22`, border: `1px solid ${slide.accent}55` }}
              >
                <slide.icon size={28} style={{ color: slide.accent }} />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight text-shadow-lg">
                {slide.title}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed max-w-md">
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex items-center gap-2 mt-8">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? 'w-8 bg-brand-500' : 'w-1.5 bg-white/30'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-8">
            {i > 0 && (
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full glass border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            <button
              onClick={next}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full brand-gradient font-bold text-white hover:scale-105 transition-transform shadow-lg shadow-brand-500/30"
            >
              {last ? (
                <>
                  <Sparkles size={20} /> Get Started
                </>
              ) : (
                <>
                  Next <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
