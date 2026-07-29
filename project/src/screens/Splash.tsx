import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../store';

export default function Splash() {
  const { navigate } = useApp();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ name: 'onboarding' });
    }, 2800);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="fixed inset-0 bg-ink-975 flex items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-brand-500/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-brand-700/20 blur-[120px] animate-pulse" style={{ animationDelay: '0.8s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="font-display text-7xl sm:text-8xl tracking-[0.15em] text-white text-shadow-lg block">
              STREAM<span className="text-brand-500">VERSE</span>
            </span>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-0.5 bg-brand-500 mt-2 origin-center"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 text-sm tracking-[0.4em] text-white/50 uppercase"
        >
          Premium Streaming
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex gap-1.5"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-brand-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
