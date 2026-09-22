import React from 'react';
import { 
  Megaphone, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  ArrowUpRight,
  PlusCircle,
  Building,
  Car,
  Utensils,
  Wrench
} from 'lucide-react';
import { whatsappNumber } from '../lib/servicePolicy';
import { useApp } from '../context/AppContext.tsx';
import { AdvertisementItem } from '../types.ts';

export const AdBannerSection: React.FC = () => {
  const { language, approvedAdvertisements, setIsAdInquiryModalOpen } = useApp();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'real_estate': return Building;
      case 'auto': return Car;
      case 'food': return Utensils;
      default: return Wrench;
    }
  };

  const openWhatsApp = (phone: string, title: string) => {
    const text = encodeURIComponent(
      language === 'ar'
        ? `السلام عليكم، تواصلت معكم بخصوص إعلانكم المنشور على موقع خدمات الدروة (${title})`
        : `Bonjour, je vous contacte suite à votre annonce sur le portail Deroua Services (${title})`
    );
    window.open(`https://wa.me/${whatsappNumber(phone)}?text=${text}`, '_blank');
  };

  return (
    <section 
      id="advertisement-section"
      className="relative mt-12 pt-10 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Megaphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{language === 'ar' ? 'المساحة الإعلانية والشركاء' : 'Espace Publicitaire & Partenaires'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {language === 'ar' 
                ? 'إعلانات وعروض تجارية معتمدة بالدروة' 
                : 'Offres Commerciales & Partenaires à Deroua'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === 'ar'
                ? 'عروض عقارية، وكالات كراء السيارات، ومراكز الخدمات المصادق عليها رسمياً من إدارة الموقع.'
                : 'Immobilier, agences auto et commerces certifiés et validés par l\'administration de Deroua Services.'}
            </p>
          </div>

          {/* Call to action: advertise with us */}
          <button
            id="ad-banner-inquire-btn"
            type="button"
            onClick={() => setIsAdInquiryModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-98 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ar' ? 'احجز مساحتك الإعلانية' : 'Annoncez ici à Deroua'}</span>
          </button>
        </div>

        {/* Advertisements Display Area: empty when no approved ads, otherwise lists approved ads */}
        {approvedAdvertisements.length === 0 ? (
          <div 
            id="ad-empty-placeholder"
            className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-8 sm:p-12 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-3.5">
              <Megaphone className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {language === 'ar' ? 'المساحة الإعلانية شاغرة حالياً' : 'Espace publicitaire actuellement disponible'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1.5 mb-5 leading-relaxed">
              {language === 'ar'
                ? 'لا توجد إعلانات معروضة في الوقت الراهن. الإشهارات التي يوافق عليها المشرف (الأدمن) حصرياً هي التي تظهر في هذه المساحة.'
                : 'Aucune annonce active pour le moment. Seules les publicités approuvées par l\'administrateur seront diffusées ici.'}
            </p>
            <button
              id="empty-ad-reserve-btn"
              type="button"
              onClick={() => setIsAdInquiryModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'ar' ? 'طلب حجز مساحة إعلانية جديدة' : 'Demander une diffusion'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {approvedAdvertisements.map((ad: AdvertisementItem) => {
              const Icon = getCategoryIcon(ad.category);

              return (
                <article
                  key={ad.id}
                  id={`ad-card-${ad.id}`}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Subtle top gradient bar */}
                  <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${ad.bgGradient || 'from-amber-500 to-orange-600'}`} />

                  <div>
                    {/* Top tags */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                          <Icon className="w-4 h-4" />
                        </span>
                        {ad.badge && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {ad.badge[language]}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                        {language === 'ar' ? 'إشهار معتمد من الإدارة' : 'Approuvé par Admin'}
                      </span>
                    </div>

                    {/* Title & subtitle */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {ad.title[language]}
                    </h3>

                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      {ad.subtitle[language]}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {ad.description[language]}
                    </p>
                  </div>

                  {/* Contact and action footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span dir="ltr">{ad.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${ad.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'ar' ? 'اتصال' : 'Appeler'}</span>
                      </a>

                      {ad.whatsapp && (
                        <button
                          type="button"
                          onClick={() => openWhatsApp(ad.whatsapp!, ad.title[language])}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Banner for merchants & business owners */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-7 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
          <div className="space-y-2 text-center md:text-left rtl:md:text-right max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'فرصة للمهنيين وأصحاب المحلات بالدروة' : 'Opportunité pour commerçants'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              {language === 'ar'
                ? 'هل ترغب في نشر إشهارك أو نشاطك التجاري هنا؟'
                : 'Vous souhaitez diffuser votre publicité sur Deroua Services ?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'ar'
                ? 'اجعل خدماتك، عقاراتك، أو منتجاتك تظهر لآلاف الزوار من ساكنة الدروة والنواحي مع روابط مباشرة للاتصال وواتساب وموقعك.'
                : 'Mettez en avant vos services auprès des habitants et visiteurs de Deroua avec visibilité optimale et contacts directs.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <button
              id="cta-ad-inquire-btn"
              type="button"
              onClick={() => setIsAdInquiryModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 flex items-center gap-2"
            >
              <span>{language === 'ar' ? 'طلب مساحة إعلانية' : 'Demander un espace'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
