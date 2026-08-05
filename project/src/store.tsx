import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Profile, Title } from './types';
import { PROFILES, TITLES } from './data';
import api from './api';

export type Route =
  | { name: 'splash' }
  | { name: 'onboarding' }
  | { name: 'auth'; mode: 'login' | 'signup' | 'forgot' }
  | { name: 'profiles' }
  | { name: 'home' }
  | { name: 'details'; id: string }
  | { name: 'player'; id: string; episodeId?: string }
  | { name: 'search' }
  | { name: 'subscription' }
  | { name: 'downloads' }
  | { name: 'history' }
  | { name: 'favorites' }
  | { name: 'notifications' }
  | { name: 'settings' }
  | { name: 'live' }
  | { name: 'kids' }
  | { name: 'signup-flow'; email?: string }
  | { name: 'faq' }
  | { name: 'terms' }
  | { name: 'admin' };

interface AppState {
  route: Route;
  navigate: (r: Route) => void;
  back: () => void;
  canBack: boolean;
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  watchlist: string[];
  toggleWatchlist: (id: string) => void;
  continueWatching: { id: string; progress: number }[];
  setProgress: (id: string, progress: number) => void;
  isAuthed: boolean;
  setAuthed: (v: boolean) => void;
  catalogVersion: number;
  refreshCatalog: () => void;
  catalog: Title[];
  setCatalog: React.Dispatch<React.SetStateAction<Title[]>>;
  plan: string;
  setPlan: (p: string) => void;
}

const AppCtx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'splash' }]);
  const [profile, setProfileState] = useState<Profile | null>(PROFILES[0]);
  const [favorites, setFavorites] = useState<string[]>(['t1', 't4']);
  const [watchlist, setWatchlist] = useState<string[]>(['t3']);
  const [continueWatching, setContinueWatching] = useState<{ id: string; progress: number }[]>([
    { id: 't3', progress: 67 },
    { id: 't4', progress: 23 },
    { id: 't1', progress: 88 },
  ]);
  const [isAuthed, setAuthed] = useState(false);
  const [plan, setPlan] = useState<string>('free');
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [catalog, setCatalog] = useState<Title[]>(
    TITLES.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id || t.title.toLowerCase() === item.title.toLowerCase()))
  );

  const refreshCatalog = useCallback(() => {
    setCatalogVersion((v) => v + 1);
  }, []);

  // Fetch session & custom titles from backend
  useEffect(() => {
    const checkAuthAndCatalog = async () => {
      try {
        const session = await api.getSession();
        if (session) {
          setAuthed(true);
        }
      } catch (err) {
        console.warn('Failed to retrieve active Supabase session.', err);
      }

      try {
        const customs = await api.adminListTitles();
        if (customs && Array.isArray(customs)) {
          setCatalog((prev) => {
            const merged = [...prev];
            customs.forEach((ct) => {
              const dupIndex = merged.findIndex((t) => t.title.toLowerCase().trim() === ct.title.toLowerCase().trim());
              if (dupIndex !== -1) {
                merged[dupIndex] = { ...merged[dupIndex], ...ct };
              } else if (!merged.some((t) => t.id === ct.id)) {
                merged.unshift(ct);
              }
            });
            // Ensure absolute uniqueness by ID and Title
            const unique = merged.filter((item, index, self) => 
              index === self.findIndex((t) => t.id === item.id || t.title.toLowerCase() === item.title.toLowerCase())
            );
            return unique;
          });
          refreshCatalog();
        }
      } catch (err) {
        console.warn('Failed to sync catalog from backend server.', err);
      }
    };
    checkAuthAndCatalog();
  }, [refreshCatalog]);

  // Handle browser back button (popstate)
  useEffect(() => {
    try {
      window.history.replaceState({ stackIndex: 0 }, '');
    } catch (e) {
      // ignore
    }

    const handlePopState = () => {
      setStack((s) => {
        if (s.length > 1) {
          return s.slice(0, -1);
        }
        const current = s[s.length - 1];
        if (current?.name !== 'home' && current?.name !== 'splash' && current?.name !== 'onboarding') {
          return [{ name: 'home' }];
        }
        return s;
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const route = stack[stack.length - 1];
  const navigate = useCallback((r: Route) => {
    setStack((s) => {
      const next = [...s, r];
      try {
        window.history.pushState({ stackIndex: next.length - 1 }, '');
      } catch (e) {
        // ignore
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const back = useCallback(() => {
    setStack((s) => {
      if (s.length > 1) {
        try {
          window.history.back();
        } catch (e) {
          // ignore
        }
        return s.slice(0, -1);
      }
      const current = s[s.length - 1];
      if (current?.name !== 'home' && current?.name !== 'splash' && current?.name !== 'onboarding') {
        return [{ name: 'home' }];
      }
      return s;
    });
  }, []);

  const setProfile = useCallback((p: Profile | null) => setProfileState(p), []);
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);
  const toggleWatchlist = useCallback((id: string) => {
    setWatchlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }, []);
  const setProgress = useCallback((id: string, progress: number) => {
    setContinueWatching((cw) => {
      const exists = cw.find((c) => c.id === id);
      if (exists) return [{ id, progress }, ...cw.filter((c) => c.id !== id)];
      return [{ id, progress }, ...cw].slice(0, 10);
    });
  }, []);

  const value: AppState = {
    route,
    navigate,
    back,
    canBack: stack.length > 1,
    profile,
    setProfile,
    favorites,
    toggleFavorite,
    watchlist,
    toggleWatchlist,
    continueWatching,
    setProgress,
    isAuthed,
    setAuthed,
    catalogVersion,
    refreshCatalog,
    catalog,
    setCatalog,
    plan,
    setPlan,
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { PROFILES };
