import { motion } from 'framer-motion';
import { Radio, Play, Users, ChevronLeft, Baby, Star, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import { LIVE_CHANNELS, TITLES, byType } from '../data';
import ContentRow from '../components/ContentRow';

export function Live() {
  const { back, navigate } = useApp();
  return (
    <div className="pt-20 lg:pt-24 min-h-screen pb-16">
      <div className="page-shell py-6">
        <button onClick={back} className="flex items-center gap-1.5 text-white/60 hover:text-white mb-4">
          <ChevronLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl brand-gradient flex items-center justify-center">
            <Radio size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black">Live TV</h1>
            <p className="text-white/60 text-sm">{LIVE_CHANNELS.length} channels streaming now</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIVE_CHANNELS.map((ch, i) => (
            <motion.button
              key={ch.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate({ name: 'player', id: 't1' })}
              className="relative aspect-video rounded-2xl overflow-hidden group text-left"
            >
              <img src={ch.backdrop} alt={ch.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-brand-500 text-xs font-bold">
                <Radio size={11} /> LIVE
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded glass text-xs">
                <Users size={11} /> {ch.viewers}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{ch.logo}</span>
                  <div>
                    <div className="font-bold">{ch.name}</div>
                    <div className="text-xs text-white/60">{ch.category}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold">{ch.nowPlaying}</div>
                <div className="text-xs text-white/50">Up next: {ch.nextUp}</div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center">
                  <Play size={24} className="fill-white ml-0.5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-10">
          <ContentRow title="Live Sports & Events" titles={byType('sport')} variant="large" />
        </div>
      </div>
    </div>
  );
}

export function Kids() {
  const { back, navigate } = useApp();
  const kidsTitles = [...byType('kids'), ...TITLES.filter((t) => t.rating === 'U')];
  return (
    <div className="pt-20 lg:pt-24 min-h-screen pb-16">
      <div className="page-shell py-6">
        <button onClick={back} className="flex items-center gap-1.5 text-white/60 hover:text-white mb-4">
          <ChevronLeft size={20} /> Back
        </button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 sm:h-80 rounded-3xl overflow-hidden mb-8"
        >
          <img src={kidsTitles[0]?.backdrop} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-975 via-ink-975/60 to-transparent" />
          <div className="absolute bottom-0 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500 text-xs font-bold mb-3">
              <Baby size={14} /> KIDS
            </div>
            <h1 className="text-4xl sm:text-5xl font-black">{kidsTitles[0]?.title}</h1>
            <button
              onClick={() => navigate({ name: 'player', id: kidsTitles[0]!.id })}
              className="mt-4 flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-bold hover:scale-105 transition-transform"
            >
              <Play size={20} className="fill-black" /> Play Now
            </button>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 mb-4 text-green-400">
          <Sparkles size={20} />
          <h2 className="text-xl font-bold">Safe, fun, and made just for kids</h2>
        </div>

        <ContentRow title="Kids Originals" titles={kidsTitles} variant="large" />
        <ContentRow title="Family Movies" titles={TITLES.filter((t) => t.rating === 'U' || t.rating === 'U/A 13+')} />
        <ContentRow title="Animation" titles={byType('kids')} />
      </div>
    </div>
  );
}
