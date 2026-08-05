import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Plus, Check, Star, Share2, Download, ChevronLeft, ChevronDown, ChevronUp,
  Volume2, Calendar, Film, Globe, Users, Building2, ThumbsUp, MessageCircle,
} from 'lucide-react';
import { useApp } from '../store';
import { getTitle, TITLES, byGenre, PLANS } from '../data';
import ContentRow from '../components/ContentRow';

export default function Details({ id }: { id: string }) {
  const { catalog, navigate, back, favorites, toggleFavorite, watchlist, toggleWatchlist, plan } = useApp();
  const title = catalog.find((t) => t.id === id);
  const [season, setSeason] = useState(1);
  const [tab, setTab] = useState<'episodes' | 'more' | 'reviews'>('episodes');
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    { user: 'Maya R.', avatar: '🦊', rating: 5, text: 'Absolutely stunning. The cinematography alone is worth the subscription.', time: '2d ago' },
    { user: 'Devon K.', avatar: '🐯', rating: 4, text: 'Slow burn but the payoff is incredible. Stick with it.', time: '5d ago' },
  ]);

  if (!title) return <div className="pt-24 text-center">Title not found.</div>;

  const isFav = favorites.includes(title.id);
  const inList = watchlist.includes(title.id);
  const similar = catalog.filter((t) => t.id !== title.id && t.genres?.includes(title.genres?.[0] || ''));
  const seasons = title.seasons ? Array.from({ length: title.seasons }, (_, i) => i + 1) : [];

  const addReview = () => {
    if (!reviewText.trim()) return;
    setReviews((r) => [{ user: 'You', avatar: '🧑', rating: 5, text: reviewText, time: 'just now' }, ...r]);
    setReviewText('');
  };

  const handleDownload = (e: React.MouseEvent, url: string, titleName: string, reqPlan?: string, isPremium?: boolean) => {
    e.stopPropagation();
    
    // Check if user has access based on subscription tiers
    let isDenied = false;
    if (isPremium && (!plan || plan === 'free')) isDenied = true;
    if (reqPlan && reqPlan !== 'free') {
      const userPrice = plan === 'free' || !plan ? 0 : (PLANS.find(p => p.id === plan)?.price || 0);
      const reqPrice = PLANS.find(p => p.id === reqPlan)?.price || Infinity;
      if (userPrice < reqPrice) isDenied = true;
    }
    
    if (isDenied) {
      alert('You need a higher Premium subscription tier to download this content.');
      navigate({ name: 'subscription' });
      return;
    }
    
    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${titleName.replace(/\s+/g, '_')}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="pb-16">
      {/* Hero */}
      <div className="relative h-[70vh] min-h-[480px] w-full">
        <img src={title.backdrop} alt={title.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-975 via-ink-975/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-975/80 via-transparent to-transparent" />

        <button
          onClick={back}
          className="absolute top-20 left-4 sm:left-6 lg:left-10 z-10 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 page-shell pb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            {title.isOriginal && (
              <span className="font-display text-sm tracking-[0.3em] brand-gradient px-2 py-0.5 rounded inline-block mb-3">
                STREAMVERSE ORIGINAL
              </span>
            )}
            {title.logo ? (
              <h1 className="font-display text-5xl sm:text-7xl tracking-tight text-shadow-lg">{title.logo}</h1>
            ) : (
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-shadow-lg">{title.title}</h1>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
              <span className="text-green-400 font-bold">{title.match}% Match</span>
              <span className="text-white/80">{title.year}</span>
              <span className="border border-white/40 px-1.5 py-0.5 rounded text-xs">{title.rating}</span>
              <span className="text-white/80">{title.duration}</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={14} className="fill-amber-400" />
                <span className="font-bold">{title.imdb}</span>
              </div>
              {title.tags?.map((t) => (
                <span key={t} className="text-[10px] font-bold border border-white/30 px-1.5 py-0.5 rounded text-white/70">{t}</span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate({ name: 'player', id: title.id })}
                className="flex items-center gap-2 px-7 py-3 rounded-lg bg-white text-black font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
              >
                <Play size={22} className="fill-black" />
                {title.type === 'series' ? 'Play S1:E1' : 'Play'}
              </button>
              {title.trailerUrl && (
                <button
                  onClick={() => navigate({ name: 'player', id: title.id })}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg glass font-semibold hover:bg-white/10 transition-colors"
                >
                  <Film size={18} /> Trailer
                </button>
              )}
              <button
                onClick={() => toggleWatchlist(title.id)}
                className="w-11 h-11 rounded-full glass border border-white/30 flex items-center justify-center hover:scale-110 transition-transform"
              >
                {inList ? <Check size={20} /> : <Plus size={20} />}
              </button>
              <button
                onClick={() => toggleFavorite(title.id)}
                className="w-11 h-11 rounded-full glass border border-white/30 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Star size={20} className={isFav ? 'fill-brand-500 text-brand-500' : ''} />
              </button>
              <button
                onClick={(e) => handleDownload(e, title.videoUrl || '', title.title, title.requiredPlan, title.isPremium)}
                className="w-11 h-11 rounded-full glass border border-white/30 flex items-center justify-center hover:scale-110 transition-transform"
                title="Download"
              >
                <Download size={20} />
              </button>
              <button
                className="w-11 h-11 rounded-full glass border border-white/30 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Share2 size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="page-shell -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <p className="text-lg text-white/90 leading-relaxed">{title.longDescription}</p>

            <div className="flex flex-wrap gap-2 mt-5">
              {title.genres.map((g) => (
                <button
                  key={g}
                  onClick={() => navigate({ name: 'search' })}
                  className="px-3 py-1.5 rounded-full glass text-sm hover:bg-white/10 transition-colors"
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-8 border-b border-white/10">
              {([
                ['episodes', title.type === 'series' ? 'Episodes' : 'Details'],
                ['more', 'More Like This'],
                ['reviews', 'Reviews'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    tab === key ? 'border-brand-500 text-white' : 'border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {tab === 'episodes' && (
                <div>
                  {title.type === 'series' && seasons.length > 1 && (
                    <div className="flex items-center gap-3 mb-4">
                      <label className="text-sm text-white/60">Season</label>
                      <select
                        value={season}
                        onChange={(e) => setSeason(Number(e.target.value))}
                        className="bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                      >
                        {seasons.map((s) => (
                          <option key={s} value={s} className="bg-ink-900">Season {s}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {title.episodes?.filter((e) => e.season === season).map((ep) => (
                    <motion.button
                      key={ep.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      onClick={() => navigate({ name: 'player', id: title.id, episodeId: ep.id })}
                      className="w-full flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left mb-2"
                    >
                      <div className="relative w-40 sm:w-56 aspect-video rounded-lg overflow-hidden shrink-0">
                        <img src={ep.thumbnail} alt={ep.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <Play size={28} className="opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                        </div>
                        <span className="absolute bottom-1 right-1 text-[10px] bg-black/70 px-1.5 py-0.5 rounded">{ep.duration}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{ep.episode}. {ep.title}</h3>
                          <span className="text-xs text-white/50">{ep.duration}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-sm text-white/60 mt-1 line-clamp-2 pr-4">{ep.description}</p>
                          <button
                            onClick={(e) => handleDownload(e, ep.videoUrl || '', ep.title, title.requiredPlan, title.isPremium)}
                            className="w-8 h-8 rounded-full glass border border-white/20 flex items-center justify-center shrink-0 hover:bg-white/20 transition-colors z-10"
                            title="Download Episode"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.button>
                  )) || (
                    <div className="space-y-4">
                      <InfoRow icon={Calendar} label="Released" value={`${title.year}`} />
                      <InfoRow icon={Film} label="Director" value={title.director} />
                      <InfoRow icon={Building2} label="Studio" value={title.studio} />
                      <InfoRow icon={Users} label="Cast" value={title.cast.join(', ')} />
                      <InfoRow icon={Globe} label="Languages" value={title.languages.join(', ')} />
                      <InfoRow icon={Star} label="Rating" value={`IMDb ${title.imdb} • ${title.rating}`} />
                    </div>
                  )}
                </div>
              )}

              {tab === 'more' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {similar.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => navigate({ name: 'details', id: t.id })}
                      className="relative aspect-[2/3] rounded-xl overflow-hidden group card-hover text-left"
                    >
                      <img src={t.poster} alt={t.title} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      
                      {t.isComingSoon && (
                        <>
                          <div className="absolute top-2 left-2 z-20">
                            <span className="px-2 py-0.5 rounded text-[8px] font-black bg-red-600 text-white tracking-widest uppercase">COMING SOON</span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-[9px] font-black tracking-widest text-center py-1 z-20 uppercase shadow-[0_-2px_10px_rgba(220,38,38,0.5)]">
                            Coming Soon
                          </div>
                        </>
                      )}

                      <div className={`absolute bottom-0 p-3 transition-opacity ${t.isComingSoon ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <div className="text-sm font-bold line-clamp-1">{t.title}</div>
                        <div className="text-xs text-white/60">{t.year} • {t.duration}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {tab === 'reviews' && (
                <div>
                  <div className="glass rounded-xl p-4 mb-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full brand-gradient flex items-center justify-center text-lg">🧑</div>
                      <div className="flex-1">
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full bg-transparent border-b border-white/15 focus:border-brand-500 focus:outline-none py-2 text-sm resize-none"
                          rows={2}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={16} className="fill-amber-400 text-amber-400 cursor-pointer" />
                            ))}
                          </div>
                          <button
                            onClick={addReview}
                            className="px-4 py-1.5 rounded-lg brand-gradient text-sm font-semibold"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((r, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg shrink-0">{r.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{r.user}</span>
                            <div className="flex">
                              {Array.from({ length: r.rating }).map((_, j) => (
                                <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span className="text-xs text-white/40">{r.time}</span>
                          </div>
                          <p className="text-sm text-white/80 mt-1">{r.text}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                            <button className="flex items-center gap-1 hover:text-white"><ThumbsUp size={13} /> Helpful</button>
                            <button className="flex items-center gap-1 hover:text-white"><MessageCircle size={13} /> Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="glass rounded-xl p-5">
              <h3 className="font-bold mb-3">Details</h3>
              <div className="space-y-3 text-sm">
                <Detail label="Director" value={title.director} />
                <Detail label="Cast" value={title.cast.join(', ')} />
                <Detail label="Studio" value={title.studio} />
                <Detail label="Languages" value={title.languages.join(', ')} />
                <Detail label="Genres" value={title.genres.join(', ')} />
                <Detail label="Age Rating" value={title.rating} />
              </div>
            </div>

            <div className="glass rounded-xl p-5">
              <h3 className="font-bold mb-3">Audio & Subtitles</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/70"><Volume2 size={15} /> English, Hindi, Spanish, Japanese</div>
                <div className="flex items-center gap-2 text-white/70"><Globe size={15} /> Subtitles: 12 languages</div>
                <div className="flex items-center gap-2 text-white/70"><Film size={15} /> Dolby Atmos, 5.1, Stereo</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <ContentRow title="More Like This" titles={similar} variant="large" />
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="text-white/50 mt-0.5 shrink-0" />
      <div>
        <div className="text-xs text-white/50">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-white/50 text-xs">{label}</div>
      <div className="text-white/90">{value}</div>
    </div>
  );
}
