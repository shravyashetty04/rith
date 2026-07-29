import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  Title, Episode, Genre, Profile, Plan, Notification, WatchHistoryItem, LiveChannel,
} from './types';

const url = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

const isConfigured = false;

export const supabase: SupabaseClient = isConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : (new Proxy({}, {
      get() {
        return new Proxy(() => {}, {
          get() {
            return () => {
              throw new Error('Supabase URL and Anon Key are missing or empty. Please add them to your .env file to enable live backend connection.');
            };
          },
          apply() {
            throw new Error('Supabase URL and Anon Key are missing or empty. Please add them to your .env file to enable live backend connection.');
          }
        });
      }
    }) as any);

const host = typeof window !== 'undefined'
  ? (window.location.hostname.includes('loca.lt') || window.location.hostname.includes('localhost') ? '192.168.0.104' : window.location.hostname)
  : 'localhost';
const LOCAL_API_URL = `http://${host}:3001/api`;

async function localFetch(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${LOCAL_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }
  return response.json();
}

// ---------- Auth ----------

export const api = {
  /** Sign up with email + password. Email confirmation stays OFF. */
  async signUp(email: string, password: string, fullName?: string) {
    if (isConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      return data;
    } else {
      const data = await localFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName }),
      });
      localStorage.setItem('auth_session', JSON.stringify(data));
      return data;
    }
  },

  async signIn(email: string, password: string) {
    if (isConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      const data = await localFetch('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('auth_session', JSON.stringify(data));
      return data;
    }
  },

  async signInWithOtp(opts: { email?: string; phone?: string }) {
    const { data, error } = await supabase.auth.signInWithOtp(opts as any);
    if (error) throw error;
    return data;
  },

  async verifyOtp(opts: { email?: string; phone?: string; token: string; type: 'sms' | 'email' }) {
    const { data, error } = await supabase.auth.verifyOtp(opts as any);
    if (error) throw error;
    return data;
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (isConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      localStorage.removeItem('auth_session');
    }
  },

  async getSession() {
    if (isConfigured) {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
    const sessionStr = localStorage.getItem('auth_session');
    return sessionStr ? JSON.parse(sessionStr) : null;
  },

  onAuthChange(cb: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange((event, session) => cb(event, session));
  },

  // ---------- Profiles ----------

  async listProfiles(): Promise<Profile[]> {
    if (isConfigured) {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at');
      if (error) throw error;
      return (data ?? []) as Profile[];
    } else {
      return await localFetch('/profiles');
    }
  },

  async createProfile(p: Omit<Profile, 'id'>): Promise<Profile> {
    if (isConfigured) {
      const { data, error } = await supabase.from('profiles').insert(p).select().single();
      if (error) throw error;
      return data as Profile;
    } else {
      return await localFetch('/profiles', {
        method: 'POST',
        body: JSON.stringify(p),
      });
    }
  },

  async updateProfile(id: string, patch: Partial<Profile>): Promise<Profile> {
    if (isConfigured) {
      const { data, error } = await supabase.from('profiles').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data as Profile;
    } else {
      // Local update simulator
      const profiles = await localFetch('/profiles');
      const profile = profiles.find((p: any) => p.id === id);
      return { ...profile, ...patch };
    }
  },

  async deleteProfile(id: string): Promise<void> {
    if (isConfigured) {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
    } else {
      await fetch(`http://localhost:3001/api/profiles/${id}`, { method: 'DELETE' });
    }
  },

  // ---------- Titles (Movies / Series / Originals / Sports / Kids) ----------

  async listTitles(opts?: { type?: string; genre?: string; limit?: number }): Promise<Title[]> {
    let q = supabase.from('titles').select('*');
    if (opts?.type) q = q.eq('type', opts.type);
    if (opts?.genre) q = q.contains('genres', [opts.genre]);
    if (opts?.limit) q = q.limit(opts.limit);
    const { data, error } = await q.order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Title[];
  },

  async getTitle(id: string): Promise<Title | null> {
    const { data, error } = await supabase.from('titles').select('*').eq('id', id).single();
    if (error) return null;
    return data as Title;
  },

  async trending(): Promise<Title[]> {
    const { data, error } = await supabase.from('titles').select('*').eq('trending', true).limit(10);
    if (error) throw error;
    return (data ?? []) as Title[];
  },

  async latest(): Promise<Title[]> {
    const { data, error } = await supabase.from('titles').select('*').eq('is_new', true).order('year', { ascending: false }).limit(10);
    if (error) throw error;
    return (data ?? []) as Title[];
  },

  async topRated(): Promise<Title[]> {
    const { data, error } = await supabase.from('titles').select('*').order('imdb', { ascending: false }).limit(10);
    if (error) throw error;
    return (data ?? []) as Title[];
  },

  async originals(): Promise<Title[]> {
    const { data, error } = await supabase.from('titles').select('*').eq('is_original', true);
    if (error) throw error;
    return (data ?? []) as Title[];
  },

  async searchTitles(query: string): Promise<Title[]> {
    const { data, error } = await supabase
      .from('titles')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20);
    if (error) throw error;
    return (data ?? []) as Title[];
  },

  // ---------- Episodes ----------

  async listEpisodes(titleId: string, season?: number): Promise<Episode[]> {
    let q = supabase.from('episodes').select('*').eq('title_id', titleId);
    if (season) q = q.eq('season', season);
    const { data, error } = await q.order('season').order('episode');
    if (error) throw error;
    return (data ?? []) as Episode[];
  },

  // ---------- Genres ----------

  async listGenres(): Promise<Genre[]> {
    const { data, error } = await supabase.from('genres').select('*').order('name');
    if (error) throw error;
    return (data ?? []) as Genre[];
  },

  // ---------- Favorites ----------

  async listFavorites(userId: string): Promise<Title[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('title_id, titles(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return ((data ?? []) as unknown as { titles: Title }[]).map((r) => r.titles);
  },

  async toggleFavorite(userId: string, titleId: string): Promise<boolean> {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('title_id', titleId)
      .maybeSingle();
    if (data) {
      await supabase.from('favorites').delete().eq('id', data.id);
      return false;
    }
    const { error } = await supabase.from('favorites').insert({ user_id: userId, title_id: titleId });
    if (error) throw error;
    return true;
  },

  // ---------- Watchlist ----------

  async listWatchlist(userId: string): Promise<Title[]> {
    const { data, error } = await supabase
      .from('watchlist')
      .select('title_id, titles(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return ((data ?? []) as unknown as { titles: Title }[]).map((r) => r.titles);
  },

  async toggleWatchlist(userId: string, titleId: string): Promise<boolean> {
    const { data } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('title_id', titleId)
      .maybeSingle();
    if (data) {
      await supabase.from('watchlist').delete().eq('id', data.id);
      return false;
    }
    const { error } = await supabase.from('watchlist').insert({ user_id: userId, title_id: titleId });
    if (error) throw error;
    return true;
  },

  // ---------- Watch History / Continue Watching ----------

  async listHistory(userId: string): Promise<WatchHistoryItem[]> {
    const { data, error } = await supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', userId)
      .order('watched_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as WatchHistoryItem[];
  },

  async upsertHistory(userId: string, titleId: string, progress: number): Promise<void> {
    const { error } = await supabase
      .from('watch_history')
      .upsert(
        { user_id: userId, title_id: titleId, progress, watched_at: new Date().toISOString() },
        { onConflict: 'user_id,title_id' }
      );
    if (error) throw error;
  },

  // ---------- Reviews ----------

  async listReviews(titleId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, user_id, rating, body, created_at, profiles(name, avatar)')
      .eq('title_id', titleId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async addReview(userId: string, titleId: string, rating: number, body: string) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({ user_id: userId, title_id: titleId, rating, body })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ---------- Downloads ----------

  async listDownloads(userId: string) {
    const { data, error } = await supabase
      .from('downloads')
      .select('title_id, titles(*), quality, size_bytes, progress, expires_at')
      .eq('user_id', userId);
    if (error) throw error;
    return data ?? [];
  },

  // ---------- Notifications ----------

  async listNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Notification[];
  },

  async markNotificationRead(id: string): Promise<void> {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) throw error;
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
    if (error) throw error;
  },

  // ---------- Live Channels ----------

  async listLiveChannels(): Promise<LiveChannel[]> {
    const { data, error } = await supabase.from('live_channels').select('*').eq('is_live', true);
    if (error) throw error;
    return (data ?? []) as LiveChannel[];
  },

  // ---------- Subscription Plans ----------

  async listPlans(): Promise<Plan[]> {
    const { data, error } = await supabase.from('plans').select('*').order('price');
    if (error) throw error;
    return (data ?? []) as Plan[];
  },

  async getSubscription(userId: string) {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    } else {
      return await localFetch(`/subscriptions/active/${userId}`);
    }
  },

  async createSubscription(userId: string, planId: string, paymentMethod: string) {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({ user_id: userId, plan_id: planId, status: 'active', payment_method: paymentMethod })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      return await localFetch('/subscriptions', {
        method: 'POST',
        body: JSON.stringify({ userId, planId, paymentMethod }),
      });
    }
  },

  async cancelSubscription(id: string) {
    if (isConfigured) {
      const { error } = await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('id', id);
      if (error) throw error;
    }
  },

  // ---------- Payments ----------

  async listPayments(userId: string) {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    } else {
      // Local lists are fetched directly if needed, but not critical for main screens
      return [];
    }
  },

  async recordPayment(userId: string, amount: number, currency: string, method: string, invoiceId?: string) {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('payments')
        .insert({ user_id: userId, amount, currency, method, invoice_id: invoiceId, status: 'paid' })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      return await localFetch('/payments', {
        method: 'POST',
        body: JSON.stringify({ userId, amount, currency, method, invoiceId }),
      });
    }
  },

  // ---------- Coupons ----------

  async validateCoupon(code: string) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // ---------- Admin ----------

  async adminStats() {
    const [users, subs, titles, revenue] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('titles').select('id', { count: 'exact', head: true }),
      supabase.from('payments').select('amount'),
    ]);
    const totalRevenue = (revenue.data ?? []).reduce((s, p) => s + Number(p.amount), 0);
    return {
      totalUsers: users.count ?? 0,
      activeSubs: subs.count ?? 0,
      totalTitles: titles.count ?? 0,
      totalRevenue,
    };
  },

  async adminListTitles() {
    if (isConfigured) {
      const { data, error } = await supabase.from('titles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    } else {
      return await localFetch('/admin/titles');
    }
  },

  async adminCreateTitle(t: Partial<Title>) {
    if (isConfigured) {
      const { data, error } = await supabase.from('titles').insert(t).select().single();
      if (error) throw error;
      return data;
    } else {
      return await localFetch('/admin/titles', {
        method: 'POST',
        body: JSON.stringify(t),
      });
    }
  },

  async adminUpdateTitle(id: string, patch: Partial<Title>) {
    if (isConfigured) {
      const { data, error } = await supabase.from('titles').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } else {
      return await localFetch(`/admin/titles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patch),
      });
    }
  },

  async uploadFile(fileName: string, fileData: string) {
    if (isConfigured) {
      return { url: fileData };
    } else {
      return await localFetch('/upload', {
        method: 'POST',
        body: JSON.stringify({ fileName, fileData }),
      });
    }
  },

  async adminDeleteTitle(id: string) {
    if (isConfigured) {
      const { error } = await supabase.from('titles').delete().eq('id', id);
      if (error) throw error;
    } else {
      await fetch(`http://localhost:3001/api/admin/titles/${id}`, { method: 'DELETE' });
    }
  },

  async adminListUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, plan, status, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};

export default api;
