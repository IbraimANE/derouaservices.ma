import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  PlusCircle, 
  Compass,
  Car,
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo.tsx';

interface PortalHeroProps {
  onExploreDirectory: () => void;
  onExploreTransport: () => void;
}

export const PortalHero: React.FC<PortalHeroProps> = ({
  onExploreDirectory,
  onExploreTransport
}) => {
  const { language, setIsAddModalOpen, setIsAboutModalOpen } = useApp();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
      {/* Background geometric decorative accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        {/* Left / Main text content */}
        <div className="flex-1 text-center md:text-left rtl:md:text-right space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-sky-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'ar' 
                ? 'البوابة الرقمية الرسمية لمدينة الدروة والنواصر' 
                : 'Portail Web Officiel de la Ville de Deroua'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            {language === 'ar' ? (
              <>
                كل ما تحتاجه في <span className="text-sky-400">مدينة الدروة</span> في موقع واحد
              </>
            ) : (
              <>
                Tous les services de <span className="text-sky-400">Deroua</span> en un seul portail
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {language === 'ar'
              ? 'دليل إلكتروني سريع وموثوق يضع بين يديك أرقام الطوارئ، صيدليات الحراسة الأسبوعية، خطوط النقل وسيارات الأجرة إلى كازا والمطار، والحرفيين المعتمدين.'
              : 'Annuaire numérique de référence pour consulter immédiatement les urgences médicales, pharmacies de garde, taxis vers Casablanca et l\'Aéroport Mohammed V, et artisans qualifiés.'}
          </p>

          {/* Quick Portal Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start rtl:md:justify-start gap-2.5 pt-1">
            <button
              id="hero-explore-dir-btn"
              type="button"
              onClick={onExploreDirectory}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-all shadow-md active:scale-98"
            >
              <Compass className="w-4 h-4 text-sky-600" />
              <span>{language === 'ar' ? 'تصفح الدليل الشامل' : 'Explorer l\'annuaire'}</span>
            </button>

            <button
              id="hero-explore-transport-btn"
              type="button"
              onClick={onExploreTransport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white text-xs sm:text-sm font-semibold border border-slate-700 transition-all"
            >
              <Car className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'المواصلات والطاكسيات' : 'Transports & Taxis'}</span>
            </button>

            <button
              id="hero-add-service-btn"
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'ar' ? 'سجل نشاطك' : 'Ajouter une activité'}</span>
            </button>
          </div>

          {/* Highlights pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start rtl:md:justify-start gap-4 pt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'ar' ? 'بيانات محلية موثوقة' : 'Coordonnées vérifiées'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {language === 'ar' ? 'طوارئ وصيدليات 24/24' : 'Urgences & Garde 24/7'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {language === 'ar' ? 'إقليم برشيد - الدار البيضاء' : 'Province Berrechid'}
            </span>
          </div>
        </div>

        {/* Right / Official Logo Emblem Card */}
        <div className="shrink-0 flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-[260px] w-full text-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-3 shadow-lg flex items-center justify-center overflow-hidden">
            <img
              src="/deroua-logo.jpg"
              alt="Deroua Services Official Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to SVG Logo if file preview is still copying
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="hidden only:flex w-full h-full items-center justify-center">
              <Logo variant="stacked" size="md" showSubtitle={false} />
            </div>
          </div>

          <div className="mt-3">
            <h3 className="text-sm font-black tracking-widest text-white uppercase">
              DEROUA SERVICES
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'ar' ? 'دليل المدينة والمجتمع' : 'Portail de services'}
            </p>
          </div>

          <button
            id="hero-about-site-btn"
            type="button"
            onClick={() => setIsAboutModalOpen(true)}
            className="mt-3 text-[11px] text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
          >
            {language === 'ar' ? 'عن الموقع الإلكتروني' : 'En savoir plus'}
          </button>
        </div>
      </div>
    </section>
  );
};
