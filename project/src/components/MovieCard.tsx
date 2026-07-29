import { useState } from 'react';
import { Play, Plus, Check, ChevronDown, Star, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Title } from '../types';
import { useApp } from '../store';

interface Props {
  title: Title;
  size?: 'default' | 'large';
  rank?: number;
  progress?: number;
}

export default function MovieCard({ title, size = 'default', rank, progress }: Props) {
  const { navigate, favorites, toggleFavorite, watchlist, toggleWatchlist } = useApp();
  const [hovered, setHovered] = useState(false);
  const isFav = favorites.includes(title.id);
  const inList = watchlist.includes(title.id);

  const w = 'w-[140px] sm:w-[170px] lg:w-[190px]';
  const ar = 'aspect-[2/3]';

  return (
    <div
      className={`relative shrink-0 ${w} ${ar} cursor-pointer group z-10`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate({ name: 'details', id: title.id })}
    >
      {/* Rank number in front of the card, positioned further to the left side */}
      {rank !== undefined && (
        <div className="absolute left-[-45px] sm:left-[-58px] lg:left-[-72px] w-[35px] sm:w-[50px] lg:w-[65px] bottom-[-8px] sm:bottom-[-10px] lg:bottom-[-12px] z-20 flex justify-end pointer-events-none select-none">
          <span
            className="font-display text-[3.8rem] sm:text-[4.8rem] lg:text-[5.8rem] font-black leading-none text-black"
            style={{
              WebkitTextStroke: '1.5px #ffffff',
              textShadow: '0 0 10px rgba(0,0,0,0.8)',
            }}
          >
            {rank}
          </span>
        </div>
      )}

      {/* Main card container with scaling and inline overlay panel */}
      <motion.div
        whileHover={{ scale: 1.06, y: -6 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute inset-0 bg-ink-900 rounded-xl flex flex-col overflow-hidden row-shadow card-hover z-10"
      >
        {/* Poster Image Container */}
        <div className="relative w-full h-full overflow-hidden rounded-xl bg-ink-950 flex flex-col justify-end p-3 border border-white/5">
          {/* Text Fallback (visible if image is missing, transparent or fails to load) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 z-0">
            <div className="font-bold text-xs text-white line-clamp-3 mb-1 text-left">{title.title}</div>
            <div className="text-[9px] text-white/50 text-left">{title.year} • {title.rating || 'U/A 16+'}</div>
          </div>

          {title.poster && (
            <img
              src={title.poster}
              alt={title.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
            {title.isPremium && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500 text-black tracking-wider uppercase flex items-center gap-0.5 shadow-[0_2px_8px_rgba(245,158,11,0.5)]">⭐ PREMIUM</span>
            )}
            {title.isComingSoon && (
              <span className="px-2 py-0.5 rounded text-[8px] font-black bg-red-600 text-white tracking-widest uppercase">COMING SOON</span>
            )}
            {title.isNew && !title.isComingSoon && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white text-black tracking-wider">NEW</span>
            )}
            {title.badge === 'TOP 10' && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-500 text-white tracking-wider">TOP 10</span>
            )}
          </div>

          {/* Language dropdown (hover-only) */}
          {hovered && title.languages?.length > 0 && (
            <div className="absolute top-2 left-2 z-20 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white/90 flex items-center gap-1">
              <span>{title.languages[0]}</span>
              <ChevronDown size={10} />
            </div>
          )}

          {/* Match badge */}
          <div className="absolute top-2 right-2 z-10">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/60 backdrop-blur-sm text-green-400">
              {title.match}% Match
            </span>
          </div>

          {/* Mute button (hover-only) */}
          {hovered && (
            <div className="absolute bottom-2 right-2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/90 border border-white/10">
              <VolumeX size={12} />
            </div>
          )}

          {/* Progress bar for Continue Watching */}
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
              <div
                className="h-full bg-brand-500 rounded-r-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Coming Soon Red Strip */}
          {title.isComingSoon && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-[9px] font-black tracking-widest text-center py-1 z-20 uppercase shadow-[0_-2px_10px_rgba(220,38,38,0.5)]">
              Coming Soon
            </div>
          )}

          {/* Default State: Bottom title + metadata (fades out on hover) */}
          <div className={`absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-8 transition-opacity duration-200 ${hovered || title.isComingSoon ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="text-xs sm:text-sm font-bold leading-tight line-clamp-2">{title.title}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-white/70">
              <span className="text-green-400 font-semibold">{title.imdb}</span>
              <span>•</span>
              <span>{title.year}</span>
              <span>•</span>
              <span className="border border-white/30 px-1 rounded text-[9px]">{title.rating}</span>
              <span>•</span>
              <span className="truncate">{title.duration}</span>
            </div>
          </div>

          {/* Hover State: Detailed overlay panel inside the card box */}
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-x-0 bottom-0 z-20 bg-black/95 p-3 border-t border-white/10 rounded-b-xl flex flex-col gap-1.5 text-left"
            >
              {/* Title */}
              <div className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-1">{title.title}</div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate({ name: 'player', id: title.id }); }}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-white text-black font-bold text-[10px] hover:bg-white/90 transition-colors"
                >
                  <Play size={10} className="fill-black" />
                  Watch Now
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWatchlist(title.id); }}
                  className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                  aria-label="Add to watchlist"
                >
                  {inList ? <Check size={10} className="text-white" /> : <Plus size={10} className="text-white" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(title.id); }}
                  className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                  aria-label="Favorite"
                >
                  <Star size={10} className={isFav ? 'fill-brand-500 text-brand-500' : ''} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate({ name: 'details', id: title.id }); }}
                  className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0 ml-auto"
                  aria-label="More Info"
                >
                  <ChevronDown size={10} className="text-white" />
                </button>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-1 text-[9px] text-white/70">
                <span className="text-green-400 font-bold">{title.imdb} Rating</span>
                <span>•</span>
                <span>{title.year}</span>
                <span>•</span>
                <span className="border border-white/30 px-1 rounded text-[8px]">{title.rating}</span>
              </div>

              {/* Description */}
              <p className="text-[9px] text-white/50 leading-relaxed line-clamp-2">
                {title.description}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
