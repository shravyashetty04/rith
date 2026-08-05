import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, HelpCircle, ChevronDown, PhoneCall, Mail, MessageSquare, ShieldCheck, Sparkles, CreditCard, Tv, Download } from 'lucide-react';
import { useApp } from '../store';

interface FAQItem {
  id: string;
  category: 'general' | 'billing' | 'devices' | 'content';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'f1',
    category: 'general',
    question: 'What is StreamVerse?',
    answer: 'StreamVerse is a premium streaming service offering unlimited access to blockbuster movies, exclusive originals, live Kannada TV channels, sports, and international cinema across all your favorite devices.'
  },
  {
    id: 'f2',
    category: 'general',
    question: 'How much does StreamVerse cost?',
    answer: 'We offer flexible plans starting at INR 99/3-months for Quarterly Mobile, up to INR 999/year for our Gold 4K Ultra HD Ad-Free experience. You can change or cancel your plan at any time.'
  },
  {
    id: 'f3',
    category: 'general',
    question: 'Can I watch StreamVerse for free?',
    answer: 'Yes! We have a curated selection of free ad-supported movies and select premiere episodes available without any active subscription.'
  },
  {
    id: 'f4',
    category: 'billing',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major payment modes including UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking across 50+ Indian banks, Apple Pay, Google Pay, and Cash on Delivery (COD) for physical voucher cards.'
  },
  {
    id: 'f5',
    category: 'billing',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription anytime under Settings > Subscription. Your access will remain active until the end of your current billing period.'
  },
  {
    id: 'f6',
    category: 'billing',
    question: 'Will I get a refund if I cancel?',
    answer: 'Subscriptions are non-refundable once billed, but you will retain full access to all features until your subscription period expires.'
  },
  {
    id: 'f7',
    category: 'devices',
    question: 'Where can I stream StreamVerse?',
    answer: 'StreamVerse is available on iOS, Android, web browsers (Chrome, Safari, Firefox, Edge), Smart TVs (Android TV, Samsung Tizen, LG WebOS), Amazon Fire TV Stick, Apple TV, and Chromecast.'
  },
  {
    id: 'f8',
    category: 'devices',
    question: 'How many screens can stream simultaneously?',
    answer: 'Depending on your plan: Mobile allows 1 screen, Quarterly allows 2 screens, Annual Premium allows 3 screens, and Gold allows up to 4 simultaneous screens in 4K Ultra HD.'
  },
  {
    id: 'f9',
    category: 'devices',
    question: 'Can I download movies to watch offline?',
    answer: 'Yes! On Android and iOS devices, you can download movies and episodes to watch anytime without an active internet connection.'
  },
  {
    id: 'f10',
    category: 'content',
    question: 'What Kannada content is available on StreamVerse?',
    answer: 'StreamVerse features exclusive Kannada original series like "Addict", live 24/7 channel Ka TV, blockbuster movies (KGF, Kantara, Vikrant Rona), classical cinema, and dubbed multi-lingual releases.'
  },
  {
    id: 'f11',
    category: 'content',
    question: 'How often is new content added?',
    answer: 'We add new movies, original web series, and TV episodes every week! Check out the "New Releases" row on the Home page to stay updated.'
  },
  {
    id: 'f12',
    category: 'content',
    question: 'Is there a dedicated Kids profile?',
    answer: 'Yes! StreamVerse includes a dedicated Kids profile with age-appropriate animated shows, family movies, and parental PIN control settings.'
  }
];

export default function Faq() {
  const { back, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'billing' | 'devices' | 'content'>('all');
  const [openId, setOpenId] = useState<string | null>('f1');

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'general', label: 'Getting Started', icon: Sparkles },
    { id: 'billing', label: 'Plans & Payment', icon: CreditCard },
    { id: 'devices', label: 'Devices & Downloads', icon: Tv },
    { id: 'content', label: 'Kannada & Originals', icon: ShieldCheck },
  ];

  return (
    <div className="pt-20 lg:pt-24 min-h-screen pb-20 bg-ink-975 text-white">
      <div className="page-shell max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={back}
          className="flex items-center gap-1.5 text-white/60 hover:text-white mb-6 transition-colors text-sm font-semibold"
        >
          <ChevronLeft size={18} /> Back
        </button>

        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle size={14} /> Help & Support Centre
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to know about StreamVerse subscriptions, streaming quality, payments, and Kannada entertainment.
          </p>

          {/* Search Input Bar */}
          <div className="relative max-w-xl mx-auto mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. payment, Kannada, downloads, price)..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 mb-14">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-colors hover:border-white/20"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-brand-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-white/50"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 text-sm text-white/70 leading-relaxed border-t border-white/5">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 p-6">
              <HelpCircle className="mx-auto text-white/30 mb-3" size={40} />
              <p className="text-white font-bold text-base mb-1">No matching questions found</p>
              <p className="text-white/50 text-xs mb-4">Try searching with a different keyword or browse all categories.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>

        {/* Contact Support Banner */}
        <div className="bg-gradient-to-r from-brand-900/40 via-purple-900/30 to-brand-900/40 border border-brand-500/30 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-black mb-2">Still have questions?</h3>
            <p className="text-white/70 text-xs sm:text-sm mb-6">
              Our 24/7 customer support team is ready to assist you with account setup, plan upgrades, and streaming queries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="tel:0008009191743"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-all text-white"
              >
                <PhoneCall size={16} className="text-green-400" />
                <span>000-800-919-1743</span>
              </a>

              <button
                onClick={() => navigate({ name: 'subscription' })}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-xs font-bold transition-all text-white shadow-lg shadow-brand-500/25"
              >
                <Sparkles size={16} />
                <span>View Plans</span>
              </button>

              <a
                href="mailto:help@streamverse.com"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-all text-white"
              >
                <Mail size={16} className="text-blue-400" />
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
