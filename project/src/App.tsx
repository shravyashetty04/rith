import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import Faq from './screens/Faq';
import Terms from './screens/Terms';

function Router() {
  const { route, navigate, isAuthed } = useApp();
  const [modalInfo, setModalInfo] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    if (isAuthed && route.name === 'profiles') {
      navigate({ name: 'home' });
    }
  }, [isAuthed, route.name, navigate]);

  const handleFooterLink = (label: string) => {
    switch (label.toLowerCase()) {
      case 'faq':
      case 'help centre':
        navigate({ name: 'faq' });
        break;
      case 'terms of use':
      case 'privacy':
      case 'legal notices':
      case 'cookie preferences':
        navigate({ name: 'terms' });
        break;
      case 'account':
        navigate({ name: 'settings' });
        break;
      case 'contact us':
        setModalInfo({
          title: 'Contact Us',
          content: 'Support Hotline: 000-800-919-1743\nEmail Support: help@streamverse.com\nAddress: Residency Road, Bengaluru, India'
        });
        break;
      case 'ways to watch':
        setModalInfo({
          title: 'Ways to Watch',
          content: 'You can stream StreamVerse on Android, iOS, Apple TV, Fire TV, Chromecast, Samsung Smart TVs, and modern web browsers.'
        });
        break;
      case 'only on streamverse':
        setModalInfo({
          title: 'Only on StreamVerse',
          content: 'Browse our exclusive library of StreamVerse Originals, local live television channels, and curated international cinema.'
        });
        break;
      case 'speed test':
        window.open('https://www.speedtest.net', '_blank');
        break;
      case 'jobs':
        setModalInfo({
          title: 'Careers',
          content: 'We are currently hiring Frontend Engineers, Streaming Infrastructure Specialists, and Content Curators. Send your resume to careers@streamverse.com!'
        });
        break;
      case 'investor relations':
        setModalInfo({
          title: 'Investor Relations',
          content: 'StreamVerse is a privately held streaming technology group. For institutional partnership proposals, please reach out to investors@streamverse.com.'
        });
        break;
      case 'media centre':
        setModalInfo({
          title: 'Media Centre',
          content: 'Access latest press releases, brand assets, and contact details for our public relations team at press@streamverse.com.'
        });
        break;
      case 'corporate information':
        setModalInfo({
          title: 'Corporate Information',
          content: 'StreamVerse Media Labs Private Limited\nBengaluru, Karnataka, India\nCIN: U72200KA2026PTC998877'
        });
        break;
      default:
        navigate({ name: 'home' });
    }
  };

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
      {route.name === 'faq' && <Faq />}
      {route.name === 'terms' && <Terms />}

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 mb-8 text-left">
            {/* Column 1 */}
            <div className="flex flex-col gap-2.5 items-start">
              <button onClick={() => handleFooterLink('FAQ')} className="hover:underline transition-colors text-left">FAQ</button>
              <button onClick={() => handleFooterLink('Investor Relations')} className="hover:underline transition-colors text-left">Investor Relations</button>
              <button onClick={() => handleFooterLink('Ways to Watch')} className="hover:underline transition-colors text-left">Ways to Watch</button>
              <button onClick={() => handleFooterLink('Corporate Information')} className="hover:underline transition-colors text-left">Corporate Information</button>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-2.5 items-start">
              <button onClick={() => handleFooterLink('Help Centre')} className="hover:underline transition-colors text-left">Help Centre</button>
              <button onClick={() => handleFooterLink('Jobs')} className="hover:underline transition-colors text-left">Jobs</button>
              <button onClick={() => handleFooterLink('Terms of Use')} className="hover:underline transition-colors text-left">Terms of Use</button>
              <button onClick={() => handleFooterLink('Privacy')} className="hover:underline transition-colors text-left">Privacy</button>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-2.5 items-start">
              <button onClick={() => handleFooterLink('Account')} className="hover:underline transition-colors text-left">Account</button>
              <button onClick={() => handleFooterLink('Media Centre')} className="hover:underline transition-colors text-left">Media Centre</button>
              <button onClick={() => handleFooterLink('Cookie Preferences')} className="hover:underline transition-colors text-left">Cookie Preferences</button>
              <button onClick={() => handleFooterLink('Legal Notices')} className="hover:underline transition-colors text-left">Legal Notices</button>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-2.5 items-start">
              <button onClick={() => handleFooterLink('Contact Us')} className="hover:underline transition-colors text-left">Contact Us</button>
              <button onClick={() => handleFooterLink('Speed Test')} className="hover:underline transition-colors text-left">Speed Test</button>
              <button onClick={() => handleFooterLink('Only on StreamVerse')} className="hover:underline transition-colors text-left">Only on StreamVerse</button>
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

      {/* Modern Overlay Info Modal for Footer Links */}
      <AnimatePresence>
        {modalInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0f111a] border border-white/10 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl relative"
            >
              <h3 className="text-lg font-bold text-white mb-3">{modalInfo.title}</h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed whitespace-pre-line">{modalInfo.content}</p>
              <button
                onClick={() => setModalInfo(null)}
                className="w-full py-2.5 rounded-xl brand-gradient font-bold hover:scale-[1.02] transition-transform text-sm text-white"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
