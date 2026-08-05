import { motion } from 'framer-motion';
import { Heart, Play, Trash2, Clock, Download, Bell, Settings as SettingsIcon, ChevronLeft, Search, Star, Wifi, Pause, Check, User } from 'lucide-react';
import { useApp } from '../store';
import { getTitle, NOTIFICATIONS, WATCH_HISTORY, TITLES } from '../data';
import { useState } from 'react';

export function Favorites() {
  const { favorites, navigate, toggleFavorite } = useApp();
  const titles = favorites.map(getTitle).filter(Boolean);
  return (
    <Shell title="My Favorites" icon={Heart} count={titles.length}>
      {titles.length === 0 ? (
        <Empty icon={Heart} text="No favorites yet. Tap the star on any title to save it here." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {titles.map((t) => (
            <motion.div
              key={t!.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group cursor-pointer"
              onClick={() => navigate({ name: 'details', id: t!.id })}
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden card-hover">
                <img src={t!.poster} alt={t!.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                {t!.isComingSoon && (
                  <>
                    <div className="absolute top-2 left-2 z-20">
                      <span className="px-2 py-0.5 rounded text-[8px] font-black bg-red-600 text-white tracking-widest uppercase">COMING SOON</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-[9px] font-black tracking-widest text-center py-1 z-20 uppercase shadow-[0_-2px_10px_rgba(220,38,38,0.5)]">
                      Coming Soon
                    </div>
                  </>
                )}

                <div className={`absolute bottom-0 p-3 transition-opacity ${t!.isComingSoon ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <div className="text-sm font-bold line-clamp-1">{t!.title}</div>
                  <div className="text-xs text-white/60">{t!.year} • {t!.duration}</div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(t!.id); }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </Shell>
  );
}

export function History() {
  const { navigate } = useApp();
  const items = WATCH_HISTORY.map((h) => ({ ...h, title: getTitle(h.titleId)! })).filter((x) => x.title);
  return (
    <Shell title="Watch History" icon={Clock} count={items.length}>
      <div className="space-y-2">
        {items.map((item) => (
          <motion.div
            key={item.titleId}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate({ name: 'player', id: item.titleId })}
            className="flex items-center gap-4 p-3 rounded-xl glass hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="relative w-32 sm:w-40 aspect-video rounded-lg overflow-hidden shrink-0">
              <img src={item.title.backdrop} alt={item.title.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <Play size={24} className="fill-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold line-clamp-1">{item.title.title}</div>
              <div className="text-sm text-white/60 mt-0.5">{item.watchedAt} • {item.remainingMin}m left</div>
              <div className="mt-2 h-1 bg-white/15 rounded-full overflow-hidden w-full max-w-xs">
                <div className="h-full brand-gradient" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Shell>
  );
}

export function Downloads() {
  const { navigate } = useApp();
  const items = TITLES.slice(0, 4);
  return (
    <Shell title="Downloads" icon={Download} count={items.length}>
      <div className="space-y-2">
        {items.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl glass"
          >
            <div className="relative w-24 sm:w-32 aspect-video rounded-lg overflow-hidden shrink-0">
              <img src={t.backdrop} alt={t.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold line-clamp-1">{t.title}</div>
              <div className="text-sm text-white/60">{t.duration} • {t.tags?.[0] || '1080p'} • 1.2 GB</div>
              <div className="mt-2 h-1 bg-white/15 rounded-full overflow-hidden w-full max-w-xs">
                <div className="h-full bg-green-500" style={{ width: `${[100, 64, 28, 88][i]}%` }} />
              </div>
            </div>
            <button
              onClick={() => navigate({ name: 'player', id: t.id })}
              className="w-10 h-10 rounded-full brand-gradient flex items-center justify-center shrink-0"
            >
              <Play size={18} className="fill-white ml-0.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </Shell>
  );
}

export function Notifications() {
  const { navigate } = useApp();
  const [items, setItems] = useState(NOTIFICATIONS);
  const markAll = () => setItems((arr) => arr.map((n) => ({ ...n, read: true })));
  return (
    <Shell title="Notifications" icon={Bell} count={items.length} action={<button onClick={markAll} className="text-sm text-brand-500 hover:text-brand-400">Mark all read</button>}>
      <div className="space-y-2">
        {items.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => navigate({ name: 'home' })}
            className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
              n.read ? 'glass' : 'glass border-l-2 border-l-brand-500'
            } hover:bg-white/5`}
          >
            <div className="w-10 h-10 rounded-full brand-gradient/20 flex items-center justify-center shrink-0 text-brand-500">
              <Bell size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm">{n.title}</span>
                <span className="text-xs text-white/40 shrink-0">{n.time}</span>
              </div>
              <p className="text-sm text-white/70 mt-0.5">{n.body}</p>
            </div>
            {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2" />}
          </motion.div>
        ))}
      </div>
    </Shell>
  );
}

export function Settings() {
  const { navigate } = useApp();
  const [autoplay, setAutoplay] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [subs, setSubs] = useState(true);
  const [quality, setQuality] = useState('Auto');
  return (
    <Shell title="Account" icon={User}>
      <div className="space-y-6">
        <Group title="Playback">
          <Toggle label="Autoplay next episode" desc="Automatically play the next episode" value={autoplay} onChange={setAutoplay} />
          <Toggle label="Data Saver" desc="Reduce data usage on mobile networks" value={dataSaver} onChange={setDataSaver} />
          <SelectRow label="Video quality" value={quality} options={['Auto', '4K', '1080p', '720p', '480p']} onChange={setQuality} />
        </Group>
        <Group title="Accessibility">
          <Toggle label="Subtitles & CC" desc="Show subtitles by default" value={subs} onChange={setSubs} />
        </Group>
        <Group title="Account">
          <LinkRow label="Manage Subscription" onClick={() => navigate({ name: 'subscription' })} />
          <LinkRow label="Privacy & Terms" />
          <LinkRow label="Help Center" />
          <LinkRow label="Sign Out" danger onClick={() => navigate({ name: 'auth', mode: 'login' })} />
        </Group>
        <p className="text-center text-xs text-white/30">StreamVerse OTT v1.0.0 — Prototype</p>
      </div>
    </Shell>
  );
}

function Shell({ title, icon: Icon, count, children, action }: { title: string; icon: typeof Heart; count?: number; children: React.ReactNode; action?: React.ReactNode }) {
  const { back } = useApp();
  return (
    <div className="pt-20 lg:pt-24 min-h-screen pb-16">
      <div className="page-shell py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={back} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10">
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Icon size={22} className="text-brand-500" />
                <h1 className="text-2xl sm:text-3xl font-black">{title}</h1>
              </div>
              {count !== undefined && <div className="text-sm text-white/50 ml-8">{count} items</div>}
            </div>
          </div>
          {action}
        </div>
        {children}
      </div>
    </div>
  );
}

function Empty({ icon: Icon, text }: { icon: typeof Heart; text: string }) {
  return (
    <div className="text-center py-24">
      <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-5">
        <Icon size={36} className="text-white/30" />
      </div>
      <p className="text-white/60 max-w-sm mx-auto">{text}</p>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-2 px-1">{title}</h3>
      <div className="glass rounded-xl overflow-hidden divide-y divide-white/5">{children}</div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left">
      <div>
        <div className="font-medium">{label}</div>
        {desc && <div className="text-sm text-white/50">{desc}</div>}
      </div>
      <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${value ? 'brand-gradient' : 'bg-white/15'}`}>
        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : ''}`} />
      </div>
    </button>
  );
}

function SelectRow({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="font-medium">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-500">
        {options.map((o) => <option key={o} className="bg-ink-900">{o}</option>)}
      </select>
    </div>
  );
}

function LinkRow({ label, onClick, danger }: { label: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`w-full text-left p-4 hover:bg-white/5 transition-colors font-medium ${danger ? 'text-brand-500' : ''}`}>
      {label}
    </button>
  );
}
