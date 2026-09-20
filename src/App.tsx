import React, { useState } from 'react';
import { useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { PortalHero } from './components/PortalHero.tsx';
import { EmergencyBanner } from './components/EmergencyBanner.tsx';
import { GuardPharmacyWidget } from './components/GuardPharmacyWidget.tsx';
import { CategoryNav } from './components/CategoryNav.tsx';
import { ServiceList } from './components/ServiceList.tsx';
import { TransportGuide } from './components/TransportGuide.tsx';
import { NoticeBoard } from './components/NoticeBoard.tsx';
import { AddServiceModal } from './components/AddServiceModal.tsx';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal.tsx';
import { AboutWebsiteModal } from './components/AboutWebsiteModal.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { AdBannerSection } from './components/AdBannerSection.tsx';
import { AdInquiryModal } from './components/AdInquiryModal.tsx';
import { Footer } from './components/Footer.tsx';
import { 
  Building2, 
  Car, 
  Bell, 
  Plus, 
  CheckCircle2 
} from 'lucide-react';

export const App: React.FC = () => {
  const { 
    language, 
    t, 
    toastMessage, 
    setIsAddModalOpen, 
    isAboutModalOpen,
    setIsAboutModalOpen,
    selectedCategory,
    isFavoritesView,
    searchQuery
  } = useApp();

  const [activeTab, setActiveTab] = useState<'directory' | 'transport' | 'notices'>('directory');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          id="toast-notification"
          className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900/90 text-white dark:bg-white/95 dark:text-slate-900 text-xs font-semibold shadow-lg backdrop-blur-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Website Navigation Header */}
      <Header />

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 space-y-6">
        {/* Welcome Portal Hero with Official DS Logo (Shown on Home view without active filters) */}
        {!searchQuery && selectedCategory === 'all' && !isFavoritesView && activeTab === 'directory' && (
          <PortalHero 
            onExploreDirectory={() => setActiveTab('directory')}
            onExploreTransport={() => setActiveTab('transport')}
          />
        )}

        {/* Urgent Emergency Quick-Dial Row */}
        <EmergencyBanner />

        {/* Guard Pharmacy of the Week Widget */}
        {!searchQuery && selectedCategory === 'all' && !isFavoritesView && (
          <GuardPharmacyWidget />
        )}

        {/* Web Feature Navigation Tabs (Directory / Transport / Notices) */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="tab-directory-btn"
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'directory'
                  ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'دليل الخدمات' : 'Annuaire des services'}</span>
            </button>

            <button
              id="tab-transport-btn"
              type="button"
              onClick={() => setActiveTab('transport')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'transport'
                  ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>{t.transportTitle}</span>
            </button>

            <button
              id="tab-notices-btn"
              type="button"
              onClick={() => setActiveTab('notices')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'notices'
                  ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{t.noticeBoardTitle}</span>
            </button>
          </div>
        </div>

        {/* Tab View Content */}
        {activeTab === 'directory' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Category Filter Pills & Selectors */}
            <CategoryNav />

            {/* Service Items Grid */}
            <ServiceList />
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <TransportGuide />
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <NoticeBoard />
          </div>
        )}

        {/* Dedicated Advertising Space & Local Partners at Bottom of Website */}
        <AdBannerSection />
      </main>

      {/* Floating Action Button for Mobile: Add service */}
      <button
        id="fab-add-service-btn"
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="sm:hidden fixed bottom-5 right-5 z-40 p-3.5 rounded-full bg-slate-900 text-white dark:bg-sky-600 shadow-xl hover:bg-slate-800 active:scale-95 transition-all"
        title={t.addServiceBtn}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Website Footer */}
      <Footer />

      {/* Modals */}
      <AddServiceModal />
      <PrivacyPolicyModal />
      <AboutWebsiteModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
      <AdminModal />
      <AdInquiryModal />
    </div>
  );
};
