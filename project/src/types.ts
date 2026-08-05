export type ContentType = 'movie' | 'series' | 'live' | 'original' | 'sport' | 'kids';

export type Quality = '4K' | '1080p' | '720p' | '480p' | '240p';

export interface Title {
  id: string;
  title: string;
  type: ContentType;
  year: number;
  rating: string; // age rating
  imdb: number;
  match: number; // percent match
  duration: string; // "2h 14m" or "4 Seasons"
  genres: string[];
  languages: string[];
  description: string;
  longDescription: string;
  cast: string[];
  director: string;
  studio: string;
  poster: string; // portrait
  backdrop: string; // landscape
  logo?: string; // optional title logo text
  badge?: string; // "NEW", "TOP 10", etc
  trending?: boolean;
  isOriginal?: boolean;
  isNew?: boolean;
  isComingSoon?: boolean;
  isFeatured?: boolean;
  requiredPlan?: string; // e.g., 'free', 'premium', 'gold', 'vip'
  tags?: string[];
  isPremium?: boolean;
  videoUrl: string;
  trailerUrl?: string;
  episodes?: Episode[];
  seasons?: number;
}

export interface Episode {
  id: string;
  season: number;
  episode: number;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
}

export interface Genre {
  id: string;
  name: string;
  image: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  pinProtected?: boolean;
  color: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  quality: string;
  resolution: string;
  devices: number;
  features: string[];
  highlight?: boolean;
  badge?: string;
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  icon: string;
  read: boolean;
}

export interface WatchHistoryItem {
  titleId: string;
  progress: number; // 0-100
  watchedAt: string;
  remainingMin: number;
}

export interface LiveChannel {
  id: string;
  name: string;
  category: string;
  logo: string;
  nowPlaying: string;
  nextUp: string;
  viewers: string;
  isLive: boolean;
  backdrop: string;
}
