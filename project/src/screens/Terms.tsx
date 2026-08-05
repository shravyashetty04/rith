import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, FileText, Lock, Cookie, HelpCircle, PhoneCall, Mail } from 'lucide-react';
import { useApp } from '../store';

export default function Terms() {
  const { back, navigate } = useApp();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'legal' | 'cookies'>('terms');

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

        {/* Top Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck size={14} /> Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Terms of Use & Policies
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto">
            Please read these Terms of Use and Privacy Guidelines carefully before accessing StreamVerse services.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
          {[
            { id: 'terms', label: 'Terms of Use', icon: FileText },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'legal', label: 'Legal Notices', icon: ShieldCheck },
            { id: 'cookies', label: 'Cookie Preferences', icon: Cookie },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
                }`}
              >
                <Icon size={15} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 text-white/80 leading-relaxed text-sm sm:text-base"
        >
          {activeTab === 'terms' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="text-brand-400" size={20} /> 1. Acceptance of Terms & Service Overview
                </h2>
                <p className="mb-2">
                  StreamVerse provides a personalized subscription service that allows members to access streaming movies, original television series, live television channels, and sports events ("StreamVerse content") over the Internet to certain Internet-connected TVs, computers, smartphones, and other devices.
                </p>
                <p>
                  By visiting, registering, or using StreamVerse, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, you should not access or use the StreamVerse service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="text-brand-400" size={20} /> 2. Membership & Subscription Plans
                </h2>
                <p className="mb-2">
                  Your StreamVerse membership will continue until terminated. To use the StreamVerse service, you must have Internet access, a StreamVerse compatible device, and provide us with one or more Payment Methods.
                </p>
                <p>
                  We offer various membership plans including Quarterly Mobile, Quarterly, Annual Premium, and Gold 4K Ultra HD plans. We reserve the right to modify or adjust pricing for our service in any manner and at any time as we may determine in our sole discretion.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="text-brand-400" size={20} /> 3. Payment Modes, Billing & Cancellation
                </h2>
                <p className="mb-2">
                  <strong>Payment Modes Accepted:</strong> We accept UPI (Google Pay, PhonePe, Paytm, BHIM), Credit Cards, Debit Cards, Net Banking, Apple Pay, Google Pay, and physical prepaid gift cards.
                </p>
                <p className="mb-2">
                  <strong>Cancellation:</strong> You can cancel your StreamVerse membership at any time from your Account settings. To the extent permitted by applicable law, payments are non-refundable and we do not provide refunds or credits for any partial membership periods or unwatched content.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="text-brand-400" size={20} /> 4. Content License & Usage Restrictions
                </h2>
                <p className="mb-2">
                  The StreamVerse service and any content viewed through the service are for your personal and non-commercial use only and may not be shared with individuals beyond your household unless permitted by your plan.
                </p>
                <p>
                  You agree not to archive, reproduce, distribute, modify, display, perform, publish, license, create derivative works from, offer for sale, or use content and information contained on or obtained from or through the StreamVerse service.
                </p>
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Lock className="text-brand-400" size={20} /> 1. Privacy Policy & Data Collection
                </h2>
                <p className="mb-2">
                  At StreamVerse, we prioritize your privacy and data security. We collect information to provide, analyze, administer, enhance, and personalize our streaming services for you and your family.
                </p>
                <p>
                  Information collected includes: name, email address, payment details, IP address, device identifiers, watch history, search queries, and interactions with our application.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Lock className="text-brand-400" size={20} /> 2. How We Use Information
                </h2>
                <p className="mb-2">
                  We use collected information to determine your general geographic location, provide localized Kannada and regional content recommendations, process your payments, prevent fraud, and communicate with you about your account.
                </p>
                <p>
                  We do not sell your personal information to third parties. We use strict encryption protocols to safeguard all sensitive transactions.
                </p>
              </div>
            </>
          )}

          {activeTab === 'legal' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="text-brand-400" size={20} /> Corporate & Legal Information
                </h2>
                <p className="mb-2">
                  <strong>Corporate Entity:</strong> StreamVerse Media Labs Private Limited
                </p>
                <p className="mb-2">
                  <strong>Corporate Identification Number (CIN):</strong> U72200KA2026PTC998877
                </p>
                <p className="mb-2">
                  <strong>Registered Address:</strong> Residency Road, Bengaluru, Karnataka 560025, India
                </p>
                <p>
                  All content, trademarks, logos, and channel broadcasts featured on StreamVerse are the exclusive property of StreamVerse or its content licensing partners. All rights reserved.
                </p>
              </div>
            </>
          )}

          {activeTab === 'cookies' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Cookie className="text-brand-400" size={20} /> Cookie Preferences & Management
                </h2>
                <p className="mb-2">
                  StreamVerse uses essential cookies, performance cookies, and analytics storage to keep you logged in, save your watch progress, and deliver smooth video playback.
                </p>
                <p>
                  You can clear your cookie preferences anytime through your browser settings or directly via your Account Settings panel.
                </p>
              </div>
            </>
          )}
        </motion.div>

        {/* Footer Quick Links & Support */}
        <div className="mt-10 flex flex-wrap justify-between items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 text-xs text-white/70">
          <div>
            Need legal clarification or billing assistance? Contact our legal team at{' '}
            <a href="mailto:legal@streamverse.com" className="text-brand-400 hover:underline">
              legal@streamverse.com
            </a>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate({ name: 'faq' })}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors flex items-center gap-1.5"
            >
              <HelpCircle size={14} /> Help & FAQ
            </button>
            <button
              onClick={() => navigate({ name: 'subscription' })}
              className="px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors"
            >
              View Membership Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
