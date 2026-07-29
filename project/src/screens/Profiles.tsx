import { motion } from 'framer-motion';
import { Lock, Plus, ChevronRight } from 'lucide-react';
import { useApp, PROFILES } from '../store';

export default function Profiles() {
  const { navigate, setProfile } = useApp();

  const pick = (id: string) => {
    const p = PROFILES.find((p) => p.id === id);
    if (p) {
      setProfile(p);
      navigate({ name: 'home' });
    }
  };

  return (
    <div className="fixed inset-0 bg-ink-975 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight">Who's watching?</h1>
        <p className="text-white/50 mt-3">Choose a profile to continue</p>
      </motion.div>

      <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-10">
        {PROFILES.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.06 }}
            onClick={() => pick(p.id)}
            className="group flex flex-col items-center gap-3"
          >
            <div
              className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl shadow-2xl transition-all group-hover:ring-4 group-hover:ring-white"
              style={{ background: `linear-gradient(135deg, ${p.color} 0%, ${p.color}88 100%)` }}
            >
              <span>{p.avatar}</span>
              {p.pinProtected && (
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full glass-strong flex items-center justify-center">
                  <Lock size={14} />
                </div>
              )}
            </div>
            <span className="text-white/80 group-hover:text-white font-medium">{p.name}</span>
            {p.isKids && <span className="text-[10px] text-green-400 font-semibold">KIDS</span>}
          </motion.button>
        ))}

        <motion.button
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: PROFILES.length * 0.08, duration: 0.4 }}
          whileHover={{ scale: 1.06 }}
          className="group flex flex-col items-center gap-3"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl glass border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
            <Plus size={40} className="text-white/50 group-hover:text-white" />
          </div>
          <span className="text-white/50 group-hover:text-white font-medium">Add Profile</span>
        </motion.button>
      </div>

      <button
        onClick={() => navigate({ name: 'settings' })}
        className="mt-12 px-6 py-2.5 rounded-lg text-sm text-white/60 border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2"
      >
        Manage Profiles <ChevronRight size={16} />
      </button>
    </div>
  );
}
