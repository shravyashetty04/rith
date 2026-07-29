import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import { getTitle } from '../data';
import { useApp } from '../store';

export default function Home() {
  const { continueWatching, catalog } = useApp();
  const hero = catalog.find((t) => t.isFeatured) || catalog.find((t) => t.id === 't_katv') || catalog[0];

  const continueTitles = continueWatching
    .map((item) => {
      const t = catalog.find((x) => x.id === item.id) || getTitle(item.id);
      return t ? { ...t, progress: item.progress } : null;
    })
    .filter(Boolean) as (any)[];

  // Dynamic filter helpers based on catalog state
  const trending = catalog.filter((t) => t.trending);
  const latest = catalog.filter((t) => t.isNew);
  const originals = catalog.filter((t) => t.isOriginal);
  const topRated = [...catalog].sort((a, b) => b.imdb - a.imdb).slice(0, 10);
  const comingSoon = catalog.filter((t) => t.isComingSoon);
  
  // Category-wise filters
  const actionMovies = catalog.filter((t) => t.genres.some(g => g.toLowerCase() === 'action'));
  const sciFiMovies = catalog.filter((t) => t.genres.some(g => g.toLowerCase() === 'sci-fi'));
  const comedyMovies = catalog.filter((t) => t.genres.some(g => g.toLowerCase() === 'comedy'));
  const romanceMovies = catalog.filter((t) => t.genres.some(g => g.toLowerCase() === 'romance'));
  const horrorMovies = catalog.filter((t) => t.genres.some(g => ['horror', 'thriller'].includes(g.toLowerCase())));

  return (
    <div className="pb-16">
      <HeroBanner title={hero} />

      {/* Premium Cinematic Glowing Wave Divider */}
      <div className="relative z-20 -mt-12 sm:-mt-16 lg:-mt-20 pointer-events-none w-full overflow-hidden select-none">
        <svg
          className="w-full h-12 sm:h-16 lg:h-24 text-ink-975 filter drop-shadow-[0_-8px_20px_rgba(139,92,246,0.3)]"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E50914" />
              <stop offset="30%" stopColor="#D946EF" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="70%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#E50914" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Deep fill path */}
          <path d="M0,80 Q360,20 720,20 T1440,80 Z" fill="currentColor" />

          {/* Thick blurry glow line under */}
          <path
            d="M0,80 Q360,20 720,20 T1440,80"
            fill="none"
            stroke="url(#neon-gradient)"
            strokeWidth="8"
            opacity="0.5"
            filter="url(#glow)"
          />

          {/* Core crisp neon line */}
          <path
            d="M0,80 Q360,20 720,20 T1440,80"
            fill="none"
            stroke="url(#neon-gradient)"
            strokeWidth="3"
          />

          {/* Parallel secondary offset accent wave for depth */}
          <path
            d="M0,80 Q360,35 720,35 T1440,80"
            fill="none"
            stroke="url(#neon-gradient)"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>

        {/* Ambient background light flare */}
        <div className="absolute top-4 left-1/4 w-1/4 h-12 bg-pink-500/10 blur-[40px] rounded-full" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-16 bg-violet-600/15 blur-[60px] rounded-full" />
        <div className="absolute top-4 right-1/4 w-1/4 h-12 bg-blue-500/10 blur-[40px] rounded-full" />
      </div>

      <div className="relative z-10 page-shell -mt-2 sm:-mt-3 lg:-mt-4">
        <div className="space-y-4 sm:space-y-5">
          {continueTitles.length > 0 && (
            <div id="row-continue">
              <ContentRow title="Continue Watching" titles={continueTitles} />
            </div>
          )}
          <div id="row-trending">
            <ContentRow title="Trending Now" titles={trending} variant="ranked" />
          </div>
          <div id="row-latest">
            <ContentRow title="New & Popular" titles={latest} variant="large" />
          </div>
          {comingSoon.length > 0 && (
            <div id="row-coming-soon">
              <ContentRow title="Coming Soon" titles={comingSoon} variant="large" />
            </div>
          )}
          
          {/* Category-wise rows */}
          {actionMovies.length > 0 && (
            <div id="row-action">
              <ContentRow title="Action & Adventure" titles={actionMovies} variant="large" />
            </div>
          )}
          {sciFiMovies.length > 0 && (
            <div id="row-scifi">
              <ContentRow title="Sci-Fi & Fantasy" titles={sciFiMovies} variant="large" />
            </div>
          )}
          {comedyMovies.length > 0 && (
            <div id="row-comedy">
              <ContentRow title="Comedy Hits" titles={comedyMovies} variant="large" />
            </div>
          )}
          {romanceMovies.length > 0 && (
            <div id="row-romantic">
              <ContentRow title="Romantic & Love Movies" titles={romanceMovies} variant="large" />
            </div>
          )}
          {horrorMovies.length > 0 && (
            <div id="row-horror">
              <ContentRow title="Horror & Thrillers" titles={horrorMovies} variant="large" />
            </div>
          )}
          
          <div id="row-originals">
            <ContentRow title="StreamVerse Originals" titles={originals} variant="large" />
          </div>
          <div id="row-toprated">
            <ContentRow title="Top Rated" titles={topRated} variant="large" />
          </div>
        </div>
      </div>
    </div>
  );
}

