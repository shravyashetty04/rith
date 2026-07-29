import { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, Star, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Title } from '../types';
import { useApp } from '../store';

export default function HeroBanner({ title }: { title: Title }) {
  const { navigate, toggleWatchlist, watchlist, toggleFavorite, favorites } = useApp();
  const [muted, setMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const inList = watchlist.includes(title.id);
  const isFav = favorites.includes(title.id);

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0">
        <img
          src={title.backdrop}
          alt={title.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200';
          }}
        />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="absolute inset-0 bg-hero-left" />
      </div>

      {/* Content */}
      <div className="relative h-full page-shell flex flex-col pt-20 lg:pt-24 pb-24 sm:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={title.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mt-auto"
          >
            {title.isOriginal && (
              <div className="flex items-center gap-2 mb-3">
                <span className="font-display text-base tracking-[0.3em] brand-gradient px-2 py-0.5 rounded">S V ORIGINAL</span>
              </div>
            )}

            {title.logo ? (
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-white text-shadow-lg">
                {title.logo}
              </h1>
            ) : (
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-white text-shadow-lg">
                {title.title}
              </h1>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 text-sm">
              <span className="text-green-400 font-bold">{title.match}% Match</span>
              <span className="text-white/80">{title.year}</span>
              <span className="border border-white/40 px-1.5 py-0.5 rounded text-xs text-white/80">{title.rating}</span>
              <span className="text-white/80">{title.duration}</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={14} className="fill-amber-400" />
                <span className="font-bold">{title.imdb}</span>
              </div>
              {title.tags?.includes('4K Ultra HD') && (
                <span className="text-[10px] font-bold border border-white/30 px-1.5 py-0.5 rounded text-white/70">4K UHD</span>
              )}
            </div>

            <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed line-clamp-3 max-w-xl text-shadow-lg">
              {title.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate({ name: 'player', id: title.id })}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg bg-white text-black font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
              >
                <Play size={22} className="fill-black" />
                Play
              </button>
              <button
                onClick={() => navigate({ name: 'details', id: title.id })}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg glass text-white font-bold hover:bg-white/20 transition-all"
              >
                <Info size={20} />
                More Info
              </button>
              <button
                onClick={() => toggleWatchlist(title.id)}
                className="w-12 h-12 rounded-full glass border border-white/40 flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Add to my list"
              >
                {inList ? <Check size={22} /> : <Plus size={22} />}
              </button>
              <button
                onClick={() => toggleFavorite(title.id)}
                className="w-12 h-12 rounded-full glass border border-white/40 flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Rate"
              >
                <Star size={22} className={isFav ? 'fill-brand-500 text-brand-500' : ''} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rating chip */}
      <div className="absolute right-4 sm:right-6 lg:right-10 bottom-28 flex items-center gap-3">
        <div className="glass border-l-2 border-white pl-3 pr-4 py-1.5 rounded-r-lg">
          <span className="text-sm font-semibold">{title.rating}</span>
        </div>
      </div>
    </section>
  );
}
