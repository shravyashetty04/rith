import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Film, Tv, Users as UsersIcon, Crown, BarChart3, Settings, Bell, Search,
  ChevronLeft, TrendingUp, TrendingDown, DollarSign, Eye, Play, Plus, MoreHorizontal,
  Star, Upload, FileText, Shield, LogOut, Ticket, Globe, Radio, Menu, X, CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { useApp } from '../store';
import { TITLES, PROFILES } from '../data';
import api from '../api';

type Tab = 'dashboard' | 'content' | 'users' | 'subs' | 'analytics' | 'cms' | 'settings';

const NAV: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content', label: 'Content', icon: Film },
  { id: 'users', label: 'Users', icon: UsersIcon },
  { id: 'subs', label: 'Subscriptions', icon: Crown },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'cms', label: 'CMS', icon: Upload },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Admin() {
  const { back, navigate, catalogVersion } = useApp();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className="fixed inset-0 bg-ink-975 flex text-white">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebar && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebar(false)} />}
      </AnimatePresence>
      <aside className={`fixed lg:static top-0 left-0 bottom-0 w-60 glass-strong z-40 flex flex-col transition-transform ${sidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex items-center justify-between">
          <span className="font-display text-xl tracking-wider">STREAM<span className="text-brand-500">VERSE</span></span>
          <button className="lg:hidden" onClick={() => setSidebar(false)}><X size={20} /></button>
        </div>
        <div className="px-2 mb-2">
          <div className="px-3 py-2 rounded-lg glass text-xs text-white/50">Admin Panel</div>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { setTab(n.id); setSidebar(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === n.id ? 'brand-gradient' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <n.icon size={18} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-white/10">
          <button onClick={() => navigate({ name: 'home' })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5">
            <LogOut size={18} /> Exit to App
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 glass-strong flex items-center gap-4 px-4 sm:px-6 border-b border-white/10">
          <button className="lg:hidden" onClick={() => setSidebar(true)}><Menu size={22} /></button>
          <div className="flex-1 max-w-md relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input placeholder="Search admin..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-brand-500" />
          </div>
          <button className="p-2 rounded-lg hover:bg-white/10 relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
          </button>
          <div className="w-9 h-9 rounded-lg brand-gradient flex items-center justify-center font-bold text-sm">A</div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {tab === 'dashboard' && <Dashboard />}
          {tab === 'content' && <Content setTab={setTab} />}
          {tab === 'users' && <Users />}
          {tab === 'subs' && <Subs />}
          {tab === 'analytics' && <Analytics />}
          {tab === 'cms' && <CMS setTab={setTab} />}
          {tab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  const { catalog } = useApp();
  const stats = [
    { label: 'Total Subscribers', value: '2.4M', change: '+12.5%', up: true, icon: UsersIcon, color: '#3b82f6' },
    { label: 'Monthly Revenue', value: '₹1.68Cr', change: '+8.2%', up: true, icon: DollarSign, color: '#22c55e' },
    { label: 'Hours Streamed', value: '14.2M', change: '+23.1%', up: true, icon: Play, color: '#E50914' },
    { label: 'Avg Watch Time', value: '2h 14m', change: '-3.2%', up: false, icon: Eye, color: '#f59e0b' },
  ];
  const chart = [42, 58, 51, 67, 73, 69, 82, 78, 91, 88, 96, 104];
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="text-white/50 text-sm">Welcome back, here's your platform overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}22`, color: s.color }}>
                <s.icon size={20} />
              </div>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${s.up ? 'text-green-400' : 'text-brand-500'}`}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.change}
              </span>
            </div>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-sm text-white/50">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold">Revenue Growth</h3>
            <p className="text-sm text-white/50">Monthly recurring revenue (₹ Lakhs)</p>
          </div>
          <select className="bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
            <option className="bg-ink-900">This Year</option>
            <option className="bg-ink-900">Last Year</option>
          </select>
        </div>
        <div className="flex items-end justify-between gap-2 h-48">
          {chart.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex-1 flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / 104) * 100}%` }}
                  transition={{ delay: i * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full rounded-t-lg brand-gradient relative"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{v}</span>
                </motion.div>
              </div>
              <span className="text-xs text-white/40">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top content */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Top Performing Titles</h3>
          <div className="space-y-3">
            {catalog.slice(0, 5).map((t, i) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-white/30 w-6">{i + 1}</span>
                <img src={t.poster} alt="" className="w-10 h-14 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{t.title}</div>
                  <div className="text-xs text-white/50">{(Math.random() * 5 + 1).toFixed(1)}M views</div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-sm"><Star size={12} className="fill-amber-400" /> {t.imdb}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { user: 'Maya R.', action: 'subscribed to Premium', time: '2m ago', color: '#22c55e' },
              { user: 'Devon K.', action: 'watched "Crimson Horizon"', time: '8m ago', color: '#3b82f6' },
              { user: 'Admin', action: 'uploaded "Glasshouse Protocol"', time: '1h ago', color: '#E50914' },
              { user: 'Aria L.', action: 'cancelled subscription', time: '2h ago', color: '#f59e0b' },
              { user: 'System', action: 'auto-renewed 1,240 accounts', time: '3h ago', color: '#8b5cf6' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ background: a.color }} />
                <div className="flex-1">
                  <div className="text-sm"><span className="font-semibold">{a.user}</span> <span className="text-white/60">{a.action}</span></div>
                  <div className="text-xs text-white/40">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Content({ setTab }: { setTab: (t: Tab) => void }) {
  const { catalogVersion } = useApp();
  const [q, setQ] = useState('');
  const filtered = TITLES.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black">Content Library</h1>
          <p className="text-white/50 text-sm">{TITLES.length} titles published</p>
        </div>
        <button
          onClick={() => setTab('cms')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg brand-gradient font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-brand-500/20"
        >
          <Plus size={18} /> Upload Title
        </button>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search titles..." className="w-full sm:w-80 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-brand-500" />
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60 text-xs uppercase">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4 hidden sm:table-cell">Type</th>
              <th className="text-left p-4 hidden md:table-cell">Status</th>
              <th className="text-left p-4 hidden lg:table-cell">Views</th>
              <th className="text-left p-4">Rating</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={t.poster} alt="" className="w-8 h-12 rounded object-cover" />
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-white/40">{t.year}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell capitalize">{t.type}</td>
                <td className="p-4 hidden md:table-cell">
                   {t.isComingSoon ? (
                     <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">Coming Soon</span>
                   ) : t.isFeatured ? (
                     <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold">Featured</span>
                   ) : (
                     <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Published</span>
                   )}
                 </td>
                <td className="p-4 hidden lg:table-cell">{(Math.random() * 5 + 0.5).toFixed(1)}M</td>
                <td className="p-4"><span className="flex items-center gap-1 text-amber-400"><Star size={12} className="fill-amber-400" /> {t.imdb}</span></td>
                <td className="p-4"><button className="p-1.5 hover:bg-white/10 rounded"><MoreHorizontal size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Users() {
  const users = [
    { name: 'Alex Carter', email: 'alex@email.com', plan: 'Premium', status: 'Active', joined: 'Jan 2024' },
    { name: 'Jordan Lee', email: 'jordan@email.com', plan: 'VIP', status: 'Active', joined: 'Mar 2024' },
    { name: 'Maya Rodriguez', email: 'maya@email.com', plan: 'Premium', status: 'Active', joined: 'Feb 2024' },
    { name: 'Devon Kim', email: 'devon@email.com', plan: 'Free', status: 'Trial', joined: 'Jul 2026' },
    { name: 'Aria Lopez', email: 'aria@email.com', plan: 'Premium', status: 'Cancelled', joined: 'Nov 2023' },
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black">Users</h1>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60 text-xs uppercase">
            <tr>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4 hidden sm:table-cell">Plan</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4 hidden md:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.email} className="hover:bg-white/5">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg brand-gradient flex items-center justify-center font-bold text-sm">{u.name[0]}</div>
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-white/40">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell">{u.plan}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    u.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                    u.status === 'Trial' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-brand-500/20 text-brand-400'
                  }`}>{u.status}</span>
                </td>
                <td className="p-4 hidden md:table-cell text-white/60">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Subs() {
  const plans = [
    { name: 'Free', users: '420K', revenue: '—', color: '#6b7280' },
    { name: 'Premium', users: '1.8M', revenue: '₹1.26Cr', color: '#E50914' },
    { name: 'VIP', users: '180K', revenue: '₹42L', color: '#f59e0b' },
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black">Subscriptions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.name} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={18} style={{ color: p.color }} />
              <h3 className="font-bold">{p.name}</h3>
            </div>
            <div className="text-2xl font-black">{p.users}</div>
            <div className="text-sm text-white/50">Active subscribers</div>
            <div className="mt-3 text-lg font-bold" style={{ color: p.color }}>{p.revenue}</div>
            <div className="text-xs text-white/40">Monthly revenue</div>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4">Recent Transactions</h3>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center"><DollarSign size={16} /></div>
                <div>
                  <div className="font-medium text-sm">Premium renewal</div>
                  <div className="text-xs text-white/40">User #{1000 + i} • {i + 1}h ago</div>
                </div>
              </div>
              <div className="font-bold text-green-400">+₹699</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Analytics() {
  const data = [
    { label: 'Action', pct: 32, color: '#E50914' },
    { label: 'Drama', pct: 24, color: '#3b82f6' },
    { label: 'Sci-Fi', pct: 18, color: '#8b5cf6' },
    { label: 'Romance', pct: 14, color: '#ec4899' },
    { label: 'Horror', pct: 12, color: '#f59e0b' },
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Genre Distribution</h3>
          <div className="space-y-3">
            {data.map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-sm mb-1"><span>{d.label}</span><span className="text-white/60">{d.pct}%</span></div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Device Breakdown</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Mobile', pct: 48, icon: '📱' },
              { label: 'TV', pct: 28, icon: '📺' },
              { label: 'Tablet', pct: 14, icon: '📲' },
              { label: 'Desktop', pct: 10, icon: '💻' },
            ].map((d) => (
              <div key={d.label} className="glass rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">{d.icon}</div>
                <div className="text-2xl font-black">{d.pct}%</div>
                <div className="text-xs text-white/50">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

function CMS({ setTab }: { setTab: (t: Tab) => void }) {
  const { refreshCatalog, catalog, setCatalog } = useApp();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'movie' | 'series' | 'live'>('movie');
  const [year, setYear] = useState('2024');
  const [ageRating, setAgeRating] = useState('U/A 16+');
  const [director, setDirector] = useState('');
  const [studio, setStudio] = useState('');
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState('');
  const [backdrop, setBackdrop] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Action', 'Drama']);
  const [imdb, setImdb] = useState('8.2');
  const [duration, setDuration] = useState('120 min');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isNewRelease, setIsNewRelease] = useState(false);
  const [isOriginal, setIsOriginal] = useState(false);
  
  const [videoFileName, setVideoFileName] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const clearForm = () => {
    setTitle('');
    setType('movie');
    setYear('2024');
    setAgeRating('U/A 16+');
    setDirector('');
    setStudio('');
    setDescription('');
    setPoster('');
    setBackdrop('');
    setSelectedGenres(['Action', 'Drama']);
    setImdb('8.2');
    setDuration('120 min');
    setIsFeatured(false);
    setIsTrending(false);
    setIsNewRelease(false);
    setIsOriginal(false);
    setVideoFileName('');
    setCustomVideoUrl('');
    setSuccess('');
  };

  const handlePublish = async () => {
    if (!title) return;
    setLoading(true);
    setSuccess('');

    const newTitle = {
      id: 't_custom_' + Math.random().toString(36).substring(2, 9),
      title,
      type,
      year: parseInt(year) || 2024,
      rating: ageRating || 'U/A 16+',
      director,
      studio,
      description,
      poster: poster || 'https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=600',
      backdrop: backdrop || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200',
      videoUrl: customVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
      trailerUrl: customVideoUrl || undefined,
      genres: selectedGenres,
      duration: duration || '2h 00m',
      imdb: parseFloat(imdb) || 8.2,
      match: Math.floor(Math.random() * 8) + 92,
      tags: ['4K Ultra HD', 'Dolby Atmos', 'HDR'],
      isNew: isNewRelease,
      isOriginal: isOriginal,
      trending: isTrending,
      isFeatured: isFeatured,
      isComingSoon: selectedGenres.includes('Coming Soon'),
    };

    try {
      await api.adminCreateTitle(newTitle);
      setCatalog((prev) => {
        const merged = [...prev];
        const dupIndex = merged.findIndex((t) => t.title.toLowerCase().trim() === newTitle.title.toLowerCase().trim());
        if (dupIndex !== -1) {
          merged[dupIndex] = { ...merged[dupIndex], ...newTitle } as any;
          return merged;
        }
        return [newTitle as any, ...prev];
      });
      refreshCatalog();
      setSuccess(`"${title}" published successfully to catalog!`);

      // Clear fields
      setTitle('');
      setDirector('');
      setStudio('');
      setDescription('');
      setPoster('');
      setBackdrop('');
      setVideoFileName('');
      setCustomVideoUrl('');
    } catch (err) {
      console.warn('Backend server offline. Simulating local title creation.', err);
      setCatalog((prev) => {
        const merged = [...prev];
        const dupIndex = merged.findIndex((t) => t.title.toLowerCase().trim() === newTitle.title.toLowerCase().trim());
        if (dupIndex !== -1) {
          merged[dupIndex] = { ...merged[dupIndex], ...newTitle } as any;
          return merged;
        }
        return [newTitle as any, ...prev];
      });
      refreshCatalog();
      setSuccess(`"${title}" published successfully (simulation mode)!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black">Content Management</h1>
          <p className="text-white/50 text-sm">Upload and manage your catalog</p>
        </div>
        <button
          onClick={clearForm}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg brand-gradient font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-brand-500/20"
        >
          <Upload size={18} /> Upload New
        </button>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Upload New Title</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Title" placeholder="Movie name" value={title} onChange={(e) => setTitle(e.target.value)} />
              <div>
                <label className="text-xs text-white/60">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'movie' | 'series' | 'live')}
                  className="w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 text-white"
                >
                  <option value="movie" className="bg-[#12131a]">Movie</option>
                  <option value="series" className="bg-[#12131a]">Series</option>
                  <option value="live" className="bg-[#12131a]">Live Channel</option>
                </select>
              </div>
              <Input label="Year" placeholder="2024" value={year} onChange={(e) => setYear(e.target.value)} />
              <Input label="Age Rating" placeholder="U/A 16+" value={ageRating} onChange={(e) => setAgeRating(e.target.value)} />
              <Input label="Director" placeholder="Director name" value={director} onChange={(e) => setDirector(e.target.value)} />
              <Input label="Studio" placeholder="Studio name" value={studio} onChange={(e) => setStudio(e.target.value)} />
              <div className="sm:col-span-2">
                <label className="text-xs text-white/60">Categories / Genres</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                  {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Romance', 'Horror', 'Sports', 'Kids', 'Coming Soon'].map((g) => {
                    const checked = selectedGenres.includes(g);
                    return (
                      <label key={g} className="flex items-center gap-2 text-xs text-white/80 cursor-pointer select-none bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              setSelectedGenres(selectedGenres.filter((x) => x !== g));
                            } else {
                              setSelectedGenres([...selectedGenres, g]);
                            }
                          }}
                          className="rounded border-white/20 bg-transparent text-brand-500 focus:ring-brand-500 focus:ring-opacity-25"
                        />
                        {g}
                      </label>
                    );
                  })}
                </div>
              </div>
              <Input label="IMDb Rating" placeholder="8.2" value={imdb} onChange={(e) => setImdb(e.target.value)} />
              <Input label="Duration" placeholder="120 min" value={duration} onChange={(e) => setDuration(e.target.value)} />
              
              {/* Poster select file or URL */}
              <div>
                <label className="text-xs text-white/60">Poster Image</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="URL or choose file..."
                    value={poster.startsWith('data:') || poster.startsWith('blob:') ? 'Local Image Selected' : poster}
                    onChange={(e) => setPoster(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 text-white"
                  />
                  <label className="px-3.5 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center border border-white/15 transition-colors shrink-0">
                    Browse
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const b64 = await fileToBase64(file);
                            setPoster(b64);
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Backdrop select file or URL */}
              <div className="sm:col-span-2">
                <label className="text-xs text-white/60">Backdrop Image</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="URL or choose file..."
                    value={backdrop.startsWith('data:') || backdrop.startsWith('blob:') ? 'Local Backdrop Selected' : backdrop}
                    onChange={(e) => setBackdrop(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 text-white"
                  />
                  <label className="px-3.5 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center border border-white/15 transition-colors shrink-0">
                    Browse
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const b64 = await fileToBase64(file);
                            setBackdrop(b64);
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Display Placements Selection */}
            <div className="border-t border-white/5 pt-3">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-400">Display Placement Control</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {[
                  { label: 'Feature on Home Banner', checked: isFeatured, onChange: setIsFeatured },
                  { label: 'Show in Trending Now', checked: isTrending, onChange: setIsTrending },
                  { label: 'Show in New & Popular', checked: isNewRelease, onChange: setIsNewRelease },
                  { label: 'Show in Originals', checked: isOriginal, onChange: setIsOriginal },
                ].map((p) => (
                  <label key={p.label} className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer select-none bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-2.5 rounded-lg transition-all active:scale-[0.98]">
                    <input
                      type="checkbox"
                      checked={p.checked}
                      onChange={(e) => p.onChange(e.target.checked)}
                      className="rounded border-white/20 bg-transparent text-brand-500 focus:ring-brand-500 focus:ring-opacity-25"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-white/60">Description</label>
              <textarea
                rows={3}
                placeholder="Synopsis..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-none text-white placeholder:text-white/20"
              />
            </div>

            {/* Video File drag-and-drop / selector */}
            <label className="block border-2 border-dashed border-white/15 rounded-xl p-8 text-center hover:border-brand-500 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setVideoFileName(file.name);
                    setCustomVideoUrl(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              />
              <Upload size={32} className="mx-auto text-white/40 mb-2" />
              <div className="text-sm font-semibold text-white/60">
                {videoFileName ? `Selected File: ${videoFileName}` : 'Drop video file here or click to browse'}
              </div>
              <div className="text-xs text-white/40 mt-1">
                {videoFileName ? 'Click to change selected video file' : 'MP4, MKV, HLS — up to 20GB'}
              </div>
            </label>

            <button
              onClick={handlePublish}
              disabled={loading || !title}
              className="px-6 py-3 rounded-lg brand-gradient font-bold text-sm hover:scale-[1.01] transition-transform disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Title'}
            </button>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: Film, label: 'Add Movie', action: () => { setType('movie'); setSelectedGenres(['Action', 'Drama']); } },
              { icon: Tv, label: 'Add Series', action: () => { setType('series'); setSelectedGenres(['Drama', 'Horror']); } },
              { icon: Radio, label: 'Add Live Channel', action: () => { setType('live'); setSelectedGenres(['Sports', 'Kids']); } },
              { icon: Ticket, label: 'Create Coupon' },
              { icon: Globe, label: 'Add Language' },
              { icon: FileText, label: 'Add Subtitle' },
              { icon: Shield, label: 'Manage Roles' },
            ].map((a) => (
              <button
                key={a.label}
                onClick={a.action}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-left"
              >
                <a.icon size={18} className="text-brand-500" /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-black">Settings</h1>
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-bold">Platform</h3>
        <Input label="Platform Name" placeholder="StreamVerse OTT" />
        <Input label="Support Email" placeholder="support@streamverse.com" />
        <div>
          <label className="text-xs text-white/60">Default Language</label>
          <select className="w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500">
            <option className="bg-ink-900">English</option>
            <option className="bg-ink-900">Hindi</option>
            <option className="bg-ink-900">Spanish</option>
          </select>
        </div>
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-3">Roles & Permissions</h3>
        <div className="space-y-2">
          {['Super Admin', 'Content Manager', 'Analytics Viewer', 'Support Agent'].map((r) => (
            <div key={r} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-sm font-medium">{r}</span>
              <span className="text-xs text-white/50">{r === 'Super Admin' ? 'All access' : 'Limited'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs text-white/60">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
      />
    </div>
  );
}
