import React from 'react';
import { Shield, Info, PlusCircle, Share2, MapPin, ShieldCheck, Megaphone } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Logo } from './Logo.tsx';

export const Footer: React.FC = () => {
  const { 
    language, 
    t, 
    setIsPrivacyModalOpen, 
    setIsAboutModalOpen, 
    setIsAddModalOpen,
    setIsAdminModalOpen,
    setIsAdInquiryModalOpen,
    showToast 
  } = useApp();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Deroua Services - ' + t.appName,
        text: t.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(language === 'ar' ? 'تم نسخ رابط الموقع الإلكتروني!' : 'Lien du site copié dans le presse-papier !');
    }
  };

  return (
    <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 px-4 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top footer row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          {/* Logo & description */}
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left rtl:md:text-right max-w-sm">
            <Logo variant="horizontal" size="md" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {language === 'ar'
                ? 'الموقع الإلكتروني الرسمي لدليل خدمات ومهنيي مدينة الدروة والنواحي (إقليم برشيد). دليل موثوق ومجاني لجميع السكان والزوار.'
                : 'Portail web de référence pour la ville de Deroua et ses environs (Province de Berrechid). Annuaire communautaire complet et gratuit.'}
            </p>
          </div>

          {/* Quick links & actions */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
            <button
              id="footer-add-btn"
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-500" />
              <span>{t.addServiceBtn}</span>
            </button>

            <button
              id="footer-ad-btn"
              type="button"
              onClick={() => setIsAdInquiryModalOpen(true)}
              className="hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 transition-colors"
            >
              <Megaphone className="w-4 h-4 text-amber-500" />
              <span>{t.advertisingSection}</span>
            </button>

            <button
              id="footer-admin-btn"
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className="hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              <span>{t.adminPortal}</span>
            </button>

            <button
              id="footer-about-btn"
              type="button"
              onClick={() => setIsAboutModalOpen(true)}
              className="hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors"
            >
              <Info className="w-4 h-4 text-sky-500" />
              <span>{t.aboutWebsite}</span>
            </button>

            <button
              id="footer-privacy-btn"
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>{t.privacyPolicy}</span>
            </button>

            <button
              id="footer-share-btn"
              type="button"
              onClick={handleShare}
              className="hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>{t.shareApp}</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright & region note */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {language === 'ar' ? 'الدروة • إقليم برشيد • جهة الدار البيضاء - سطات • المغرب' : 'Deroua • Province de Berrechid • Casablanca-Settat • Maroc'}
            </span>
          </div>

          <div>
            <span>© {new Date().getFullYear()} Deroua Services. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'Tous droits réservés.'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
