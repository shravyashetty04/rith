import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Mic, X, TrendingUp, Clock, Filter, ChevronDown, Play, Star } from 'lucide-react';
import { useApp } from '../store';
import { TRENDING_SEARCHES, GENRES } from '../data';
import MovieCard from '../components/MovieCard';

export default function Search() {
  const { navigate, catalog } = useApp();
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [filter, setFilter] = useState<'all' | 'movie' | 'series' | 'original' | 'sport' | 'kids'>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => {
    let r = catalog;
    if (debounced) {
      const s = debounced.toLowerCase();
      r = r.filter((t) =>
        t.title.toLowerCase().includes(s) ||
        t.genres.some((g) => g.toLowerCase().includes(s)) ||
        t.cast.some((c) => c.toLowerCase().includes(s)) ||
        t.director.toLowerCase().includes(s) ||
        t.languages.some((l) => l.toLowerCase().includes(s))
      );
    }
    if (filter !== 'all') r = r.filter((t) => t.type === filter);
    if (genreFilter !== 'all') r = r.filter((t) => t.genres.includes(genreFilter));
    return r;
  }, [catalog, debounced, filter, genreFilter]);

  const suggestions = useMemo(() => {
    if (!q) return [];
    const s = q.toLowerCase();
    return catalog.filter((t) => t.title.toLowerCase().includes(s) && t.title.toLowerCase() !== s).slice(0, 5);
  }, [catalog, q]);

  const voiceSearch = () => {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setQ('Crimson Horizon');
    }, 1800);
  };

  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      <div className="page-shell py-6">
        {/* Search bar */}
        <div className="relative">
          <div className="flex items-center gap-3 glass rounded-2xl px-4 sm:px-5 py-3.5 border border-white/10 focus-within:border-brand-500 transition-colors">
            <SearchIcon size={22} className="text-white/60" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies, shows, people, genres..."
              className="flex-1 bg-transparent focus:outline-none text-lg placeholder:text-white/40"
            />
            {q && (
              <button onClick={() => setQ('')} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                <X size={18} />
              </button>
            )}
            <button
              onClick={voiceSearch}
              className={`p-2 rounded-full transition-colors ${listening ? 'bg-brand-500 animate-pulse-brand' : 'hover:bg-white/10'}`}
              aria-label="Voice search"
            >
              <Mic size={20} />
            </button>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`p-2 rounded-full transition-colors ${showFilters ? 'bg-white/10' : 'hover:bg-white/10'}`}
              aria-label="Filters"
            >
              <Filter size={20} />
            </button>
          </div>

          {/* Suggestions */}
          <AnimatePresence>
            {q && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl border border-white/10 overflow-hidden z-30"
              >
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setQ(s.title); navigate({ name: 'details', id: s.id }); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left"
                  >
                    <SearchIcon size={16} className="text-white/40" />
                    <span className="flex-1">{s.title}</span>
                    <span className="text-xs text-white/40">{s.year}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="glass rounded-xl p-4 space-y-3">
                <div>
                  <div className="text-xs text-white/50 mb-2">Type</div>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'movie', 'series', 'original', 'sport', 'kids'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-sm capitalize transition-colors ${
                          filter === f ? 'brand-gradient font-semibold' : 'glass hover:bg-white/10'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-2">Genre</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setGenreFilter('all')}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        genreFilter === 'all' ? 'brand-gradient font-semibold' : 'glass hover:bg-white/10'
                      }`}
                    >
                      All
                    </button>
                    {GENRES.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGenreFilter(g.name)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          genreFilter === g.name ? 'brand-gradient font-semibold' : 'glass hover:bg-white/10'
                        }`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trending / empty state */}
        {!q && (
          <div className="mt-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><TrendingUp size={20} className="text-brand-500" /> Trending Searches</h2>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setQ(s)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors text-sm"
                  >
                    <span className="text-brand-500 font-bold">{i + 1}</span>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Browse All</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {catalog.map((t) => (
                  <MovieCard key={t.id} title={t} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {q && (
          <div className="mt-8">
            <div className="text-sm text-white/60 mb-4">
              {results.length} result{results.length !== 1 ? 's' : ''} for <span className="text-white font-semibold">"{q}"</span>
            </div>
            {results.length === 0 ? (
              <div className="text-center py-20">
                <SearchIcon size={48} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No results found. Try a different search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {results.map((t) => (
                  <MovieCard key={t.id} title={t} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
