import React from 'react';
import { X, Globe, MapPin, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Logo } from './Logo.tsx';

interface AboutWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutWebsiteModal: React.FC<AboutWebsiteModalProps> = ({ isOpen, onClose }) => {
  const { language } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        {/* Header with Logo */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <Logo variant="horizontal" size="sm" />
          <button
            id="close-about-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Main Mission */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-600" />
              <span>{language === 'ar' ? 'حول موقع خدمات الدروة' : 'À propos du portail Deroua Services'}</span>
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {language === 'ar'
                ? 'موقع إلكتروني مجتمعي مستقل يهدف إلى تيسير حياة ساكنة وزوار مدينة الدروة (إقليم برشيد - جهة الدار البيضاء سطات). يقدم الموقع دليلاً رقمياً شاملاً ومحدثاً لأرقام الطوارئ، صيدليات الحراسة، الإدارات العمومية، خطوط النقل وسيارات الأجرة، ومهنيي وحرفيي المدينة.'
                : 'Portail web communautaire indépendant conçu pour faciliter le quotidien des résidents et visiteurs de la ville de Deroua (Province de Berrechid, Casablanca-Settat). Retrouvez les urgences, pharmacies de garde, services publics, transports et artisans qualifiés.'}
            </p>
          </div>

          {/* Key pillars */}
          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white text-xs">
              {language === 'ar' ? 'مميزات الموقع الإلكتروني:' : 'Fonctionnalités clés du site :'}
            </h5>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>{language === 'ar' ? 'اتصال مباشر بنقرة واحدة:' : 'Appel direct en 1 clic :'}</strong>{' '}
                  {language === 'ar' ? 'ربط مباشر مع هواتف الطوارئ ومحادثات الواتساب الرسمية.' : 'Mise en relation immédiate avec les urgences et contacts WhatsApp.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>{language === 'ar' ? 'دليل النقل والمطار:' : 'Liaisons Casablanca & Aéroport :'}</strong>{' '}
                  {language === 'ar' ? 'مسارات وأسعار الطاكسيات الكبيرة والحافلات الرابطة بين الدروة وبرشيد والدار البيضاء والمطار.' : 'Tarifs et stations des grands taxis vers Sidi Maarouf, Berrechid et l\'Aéroport Mohammed V.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>{language === 'ar' ? 'حرفيون محليون معتمدون:' : 'Artisans locaux de confiance :'}</strong>{' '}
                  {language === 'ar' ? 'سباكة، كهرباء، تكييف، إغاثة سيارات على الطريق الوطنية 9، وأقفال 24/24.' : 'Plombiers, électriciens, serruriers 24/7 et dépanneuses sur la Route Nationale 9.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>{language === 'ar' ? 'موقع خفيف وسريع:' : 'Site rapide et optimisé :'}</strong>{' '}
                  {language === 'ar' ? 'يعمل بسلاسة على المتصفح عبر أي هاتف أو حاسوب دون الحاجة لتحميل أي تطبيق.' : 'Accessible directement depuis n\'importe quel navigateur web sans téléchargement préalable.'}
                </span>
              </li>
            </ul>
          </div>

          {/* Location info */}
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-xl text-xs text-sky-900 dark:text-sky-200 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold mb-0.5">
                {language === 'ar' ? 'النطاق الجغرافي' : 'Couverture géographique'}
              </p>
              <p className="text-[11px] opacity-90">
                {language === 'ar'
                  ? 'جماعة الدروة الحضرية، النواصر، مدار مطار محمد الخامس، الطريق الوطنية رقم 9، إقليم برشيد، المملكة المغربية.'
                  : 'Commune de Deroua, Province de Berrechid, Région de Casablanca-Settat, Maroc (Axe RN9 et Aéroport Mohammed V).'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Deroua Services © {new Date().getFullYear()}
          </span>
          <button
            id="close-about-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold transition-colors"
          >
            {language === 'ar' ? 'إغلاق' : 'Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
};
