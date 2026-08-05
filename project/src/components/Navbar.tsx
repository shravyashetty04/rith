import { useEffect, useState } from 'react';
import { Search, Bell, Menu, X, ChevronDown, User, Settings, LogOut, Shield, Download, Heart, Clock, Home as HomeIcon, Tv, Baby, Crown, HelpCircle } from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { route, navigate, setAuthed, setProfile } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links: { label: string; route: any; icon: any }[] = [
    { label: 'Home', route: { name: 'home' }, icon: HomeIcon },
    { label: 'Live TV', route: { name: 'live' }, icon: Tv },
    { label: 'Kids', route: { name: 'kids' }, icon: Baby },
    { label: 'My List', route: { name: 'favorites' }, icon: Heart },
  ];

  const current = route.name;

  const subMenus: Record<string, { label: string; action: () => void }[]> = {
    'Home': [
      { label: 'All Categories', action: () => navigate({ name: 'home' }) },
      { label: 'Trending Now', action: () => { navigate({ name: 'home' }); setTimeout(() => document.getElementById('row-trending')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); } },
      { label: 'New & Popular', action: () => { navigate({ name: 'home' }); setTimeout(() => document.getElementById('row-latest')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); } },
      { label: 'Coming Soon', action: () => { navigate({ name: 'home' }); setTimeout(() => document.getElementById('row-coming-soon')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); } },
      { label: 'Action & Adventure', action: () => { navigate({ name: 'home' }); setTimeout(() => document.getElementById('row-action')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); } },
      { label: 'Sci-Fi & Fantasy', action: () => { navigate({ name: 'home' }); setTimeout(() => document.getElementById('row-scifi')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); } },
      { label: 'Comedy Hits', action: () => { navigate({ name: 'home' }); setTimeout(() => document.getElementById('row-comedy')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); } },
      { label: 'Romantic & Love', action: () => { navigate({ name: 'home' }); setTimeout(() => document.getElementById('row-romantic')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); } },
      { label: 'Horror & Thrillers', action: () => { navigate({ name: 'home' }); setTimeout(() => document.getElementById('row-horror')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); } },
      { label: 'Originals', action: () => { navigate({ name: 'home' }); setTimeout(() => document.getElementById('row-originals')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); } },
      { label: 'Top Rated', action: () => { navigate({ name: 'home' }); setTimeout(() => document.getElementById('row-toprated')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); } },
    ],
    'Live TV': [
      { label: 'All Channels', action: () => navigate({ name: 'live' }) },
      { label: 'SV News 24x7', action: () => navigate({ name: 'player', id: 'l1' }) },
      { label: 'SV Sports 1', action: () => navigate({ name: 'player', id: 'l2' }) },
      { label: 'SV Live Stage', action: () => navigate({ name: 'player', id: 'l4' }) },
    ],
    'Kids': [
      { label: 'Kids Hub', action: () => navigate({ name: 'kids' }) },
      { label: 'Tiny Titans', action: () => navigate({ name: 'player', id: 't12' }) },
      { label: 'SV Kids Live', action: () => navigate({ name: 'player', id: 'l5' }) },
    ],
    'My List': [
      { label: 'Favorites', action: () => navigate({ name: 'favorites' }) },
      { label: 'Watch History', action: () => navigate({ name: 'history' }) },
      { label: 'Downloads', action: () => navigate({ name: 'downloads' }) },
    ],
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'glass-strong shadow-2xl' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <nav className="page-shell h-16 lg:h-20 flex items-center gap-2 sm:gap-6">
        {/* Sidebar Trigger (Hamburger Menu on both Mobile and Desktop) */}
        <button
          className="text-white p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <button
          onClick={() => navigate({ name: 'home' })}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="font-display text-2xl sm:text-3xl tracking-wider text-white">
            STREAM<span className="text-brand-500">VERSE</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1 ml-4">
          {links.map((l, index) => {
            const active = current === l.route.name || (l.label === 'My List' && current === 'favorites');
            const items = subMenus[l.label];

            // 4 Plan Colors: Gold, Emerald, Royal Blue, Purple
            const colors = [
              { hover: 'hover:text-amber-400', underline: 'bg-amber-500' },
              { hover: 'hover:text-emerald-400', underline: 'bg-emerald-500' },
              { hover: 'hover:text-blue-400', underline: 'bg-blue-500' },
              { hover: 'hover:text-purple-400', underline: 'bg-purple-500' },
            ];
            const themeColor = colors[index % 4];

            return (
              <div key={l.label} className="relative group py-2">
                <button
                  onClick={() => navigate(l.route)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative flex items-center gap-1 ${
                    active ? 'text-white font-bold' : `text-white/70 ${themeColor.hover}`
                  }`}
                >
                  {l.label}
                  <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className={`absolute bottom-0 left-4 right-4 h-0.5 ${themeColor.underline} rounded-full`}
                    />
                  )}
                </button>

                {items && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="w-48 glass-strong rounded-xl shadow-2xl border border-white/10 p-1.5 flex flex-col gap-0.5">
                      {items.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            item.action();
                            // Blur active element to close dropdown after clicking on touchscreens
                            (document.activeElement as HTMLElement)?.blur();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => navigate({ name: 'search' })}
            className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-white/90 hover:text-white"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => navigate({ name: 'notifications' })}
            className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-white/90 hover:text-white relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-black/50" />
          </button>
          <button
            onClick={() => navigate({ name: 'subscription' })}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Crown size={18} />
            Premium
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-1.5 p-1 pr-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-sm font-bold">
                A
              </div>
              <ChevronDown size={16} className={`text-white/70 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-12 w-60 glass-strong rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg brand-gradient flex items-center justify-center font-bold">A</div>
                        <div>
                          <div className="text-sm font-semibold">Alex</div>
                          <div className="text-xs text-white/50">Premium member</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5">
                      {[
                        { label: 'Watch History', icon: Clock, action: () => navigate({ name: 'history' }) },
                        { label: 'My Favorites', icon: Heart, action: () => navigate({ name: 'favorites' }) },
                        { label: 'Downloads', icon: Download, action: () => navigate({ name: 'downloads' }) },
                        { label: 'Help & FAQ', icon: HelpCircle, action: () => navigate({ name: 'faq' }) },
                        { label: 'Account', icon: User, action: () => navigate({ name: 'settings' }) },
                        { label: 'Admin Panel', icon: Shield, action: () => navigate({ name: 'admin' }) },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => { item.action(); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <item.icon size={17} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="p-1.5 border-t border-white/10">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          setAuthed(false);
                          setProfile(null);
                          navigate({ name: 'auth', mode: 'login' });
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <LogOut size={17} />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Side Bar Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 bottom-0 w-80 glass-strong border-r border-white/5 z-50 p-5 pt-6 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display text-2xl tracking-wider">
                    STREAM<span className="text-brand-500">VERSE</span>
                  </span>
                  <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={22} /></button>
                </div>
                
                <div className="space-y-4">
                  {/* Primary Navigation links */}
                  <div>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 px-3">Navigation</h3>
                    <div className="space-y-1">
                      {links.map((l) => {
                        const active = current === l.route.name || (l.label === 'My List' && current === 'favorites');
                        return (
                          <button
                            key={l.label}
                            onClick={() => { navigate(l.route); setMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-colors ${
                              active ? 'text-white bg-white/15' : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <l.icon size={18} />
                            <span className="font-semibold text-sm">{l.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Remaining / Library things */}
                  <div>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 px-3">Remaining Features</h3>
                    <div className="space-y-1">
                      {[
                        { label: 'Search', route: { name: 'search' } as const, icon: Search },
                        { label: 'Notifications', route: { name: 'notifications' } as const, icon: Bell },
                        { label: 'Watch History', route: { name: 'history' } as const, icon: Clock },
                        { label: 'Downloads', route: { name: 'downloads' } as const, icon: Download },
                        { label: 'Premium Status', route: { name: 'subscription' } as const, icon: Crown },
                        { label: 'Account Settings', route: { name: 'settings' } as const, icon: Settings },
                        { label: 'Admin Control Panel', route: { name: 'admin' } as const, icon: Shield },
                      ].map((l) => {
                        const active = current === l.route.name;
                        return (
                          <button
                            key={l.label}
                            onClick={() => { navigate(l.route); setMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-colors ${
                              active ? 'text-white bg-white/15' : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <l.icon size={18} />
                            <span className="font-semibold text-sm">{l.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Drawer profile details */}
              <div className="border-t border-white/15 pt-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg brand-gradient flex items-center justify-center font-bold text-sm">A</div>
                    <div>
                      <div className="text-sm font-semibold">Alex</div>
                      <div className="text-xs text-white/50">Premium Member</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
