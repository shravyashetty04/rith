import { AppProvider, useApp } from './store';
import Navbar from './components/Navbar';
import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Auth from './screens/Auth';
import Profiles from './screens/Profiles';
import Home from './screens/Home';
import Details from './screens/Details';
import Player from './screens/Player';
import Search from './screens/Search';
import Subscription from './screens/Subscription';
import { Favorites, History, Downloads, Notifications, Settings } from './screens/Library';
import { Live, Kids } from './screens/LiveKids';
import Admin from './screens/Admin';
import SignupFlow from './screens/SignupFlow';

function Router() {
  const { route, navigate, isAuthed } = useApp();

  // If not authenticated, force onboarding (allow signup-flow too)
  if (!isAuthed && route.name !== 'onboarding' && route.name !== 'auth' && route.name !== 'splash' && route.name !== 'signup-flow') {
    return <Onboarding />;
  }

  // Fullscreen routes (no navbar)
  if (route.name === 'splash') return <Splash />;
  if (route.name === 'onboarding') return <Onboarding />;
  if (route.name === 'auth') return <Auth mode={route.mode} />;
  if (route.name === 'signup-flow') return <SignupFlow email={route.email} />;
  if (route.name === 'profiles') return <Profiles />;
  if (route.name === 'player') return <Player id={route.id} episodeId={route.episodeId} />;
  if (route.name === 'admin') return <Admin />;

  // Routes with navbar
  return (
    <div className="min-h-screen bg-ink-975">
      <Navbar />
      {route.name === 'home' && <Home />}
      {route.name === 'details' && <Details id={route.id} />}
      {route.name === 'search' && <Search />}
      {route.name === 'subscription' && <Subscription />}
      {route.name === 'favorites' && <Favorites />}
      {route.name === 'history' && <History />}
      {route.name === 'downloads' && <Downloads />}
      {route.name === 'notifications' && <Notifications />}
      {route.name === 'settings' && <Settings />}
      {route.name === 'live' && <Live />}
      {route.name === 'kids' && <Kids />}

      <footer className="page-shell border-t border-white/10 pt-6 pb-12 mt-4 sm:pt-8 sm:pb-16 sm:mt-6 text-left">
        {/* Email registration segment */}
        <div className="max-w-2xl mx-auto text-center mb-16 px-4">
          <p className="text-white text-sm sm:text-base mb-4 font-normal">
            Ready to watch? Enter your email to create or restart your membership.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              navigate({ name: 'signup-flow', email });
            }}
            className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full"
          >
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="flex-1 bg-black/60 border border-white/20 rounded-md sm:rounded-r-none px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm"
            />
            <button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-md sm:rounded-l-none text-sm transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              Get Started
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>

        {/* Footer links grid */}
        <div className="w-full text-white/55 text-xs sm:text-sm">
          <p className="mb-6">
            Questions? Call <a href="tel:000-800-919-1743" className="hover:underline">000-800-919-1743</a>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 mb-8">
            <div className="flex flex-col gap-2.5">
              <a href="#" className="hover:underline">FAQ</a>
              <a href="#" className="hover:underline">Investor Relations</a>
              <a href="#" className="hover:underline">Ways to Watch</a>
              <a href="#" className="hover:underline">Corporate Information</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <a href="#" className="hover:underline">Help Centre</a>
              <a href="#" className="hover:underline">Jobs</a>
              <a href="#" className="hover:underline">Terms of Use</a>
              <a href="#" className="hover:underline">Privacy</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <a href="#" className="hover:underline">Account</a>
              <a href="#" className="hover:underline">Media Centre</a>
              <a href="#" className="hover:underline">Cookie Preferences</a>
              <a href="#" className="hover:underline">Legal Notices</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <a href="#" className="hover:underline">Contact Us</a>
              <a href="#" className="hover:underline">Speed Test</a>
              <a href="#" className="hover:underline">Only on StreamVerse</a>
            </div>
          </div>

          <div className="text-[10px] text-white/30 border-t border-white/5 pt-4 mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>StreamVerse OTT © 2026. All rights reserved.</span>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate({ name: 'home' })} className="hover:text-white transition-colors">Home</button>
              <button onClick={() => navigate({ name: 'live' })} className="hover:text-white transition-colors">Live TV</button>
              <button onClick={() => navigate({ name: 'kids' })} className="hover:text-white transition-colors">Kids</button>
              <button onClick={() => navigate({ name: 'subscription' })} className="hover:text-white transition-colors">Premium</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
