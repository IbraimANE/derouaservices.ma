import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Building, 
  Droplets, 
  Calendar, 
  ShieldCheck, 
  PlusCircle, 
  ExternalLink, 
  Trash2, 
  Sparkles,
  Info,
  Car
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const NoticeBoard: React.FC = () => {
  const { 
    language, 
    t, 
    notices, 
    isAdminAuthenticated, 
    deleteNotice, 
    setIsAddNoticeModalOpen,
    setIsAdminModalOpen 
  } = useApp();

  const getNoticeIcon = (type: string) => {
    switch (type) {
      case 'pharmacy_duty': return AlertTriangle;
      case 'municipal': return Building;
      case 'utility': return Droplets;
      case 'transport': return Car;
      default: return Bell;
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
      {/* Header with Commune Logo & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shadow-xs overflow-hidden">
            <img 
              src="/logo-commune-deroua-01-1.webp" 
              alt="شعار جماعة الدروة"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo-commune-deroua.jpg';
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {t.noticeBoardTitle || (language === 'ar' ? 'مستجدات جماعة الدروة' : 'Actualités de la Commune de Deroua')}
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {language === 'ar' ? 'المنصة الرسمية' : 'Portail Officiel'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {language === 'ar'
                ? 'آخر المستجدات والإعلانات الصيدلانية والبلدية لمدينة الدروة'
                : 'Dernières actualités, avis municipaux et informations pharmaceutiques de Deroua'}
            </p>
          </div>
        </div>

        {/* Administration / Create Update Button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            id="admin-add-notice-btn"
            onClick={() => setIsAddNoticeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ar' ? 'إنشاء مستجد جديد' : 'Publier une actualité'}</span>
          </button>

          {!isAdminAuthenticated && (
            <button
              type="button"
              id="admin-login-notice-btn"
              onClick={() => setIsAdminModalOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={language === 'ar' ? 'بوابة إدارة المستجدات' : 'Espace Admin'}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Notices Content Area */}
      <div className="mt-5">
        {notices.length === 0 ? (
          /* Clean Empty State as explicitly requested */
          <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Bell className="w-7 h-7 opacity-75" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              {language === 'ar' 
                ? 'لا توجد مستجدات أو إعلانات حالياً' 
                : 'Aucune actualité ou annonce pour le moment'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-4">
              {language === 'ar'
                ? 'سيتم نشر الإعلانات الصيدلانية، صيدليات الحراسة، والبلاغات البلدية الصادرة عن جماعة الدروة في هذه المساحة فور صدورها.'
                : 'Les avis municipaux, tours de garde des pharmacies et communiqués de la Commune de Deroua seront affichés ici dès leur publication.'}
            </p>
            <button
              type="button"
              onClick={() => setIsAddNoticeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100/70 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'ar' ? 'إنشاء ونشر مستجد من طرف الإدارة' : 'Ajouter une annonce administrative'}</span>
            </button>
          </div>
        ) : (
          /* Render Active Notices */
          <div className="space-y-3.5">
            {notices.map((notice) => {
              const Icon = getNoticeIcon(notice.type);
              return (
                <div
                  key={notice.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    notice.isUrgent
                      ? 'bg-amber-50/60 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200/80 dark:bg-slate-800/30 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`p-2 rounded-xl ${
                        notice.isUrgent 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200' 
                          : 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {notice.title[language] || notice.title.ar || notice.title.fr}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {notice.author[language] || notice.author.ar || 'جماعة الدروة'}
                          </span>
                          {notice.isUrgent && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
                              <Sparkles className="w-3 h-3" />
                              {language === 'ar' ? 'عاجل وهام' : 'Important'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{notice.date}</span>
                      </div>

                      {isAdminAuthenticated && (
                        <button
                          type="button"
                          onClick={() => deleteNotice(notice.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title={language === 'ar' ? 'حذف المستجد' : 'Supprimer'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notice Body */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {notice.content[language] || notice.content.ar || notice.content.fr}
                  </p>

                  {/* Optional Image */}
                  {notice.imageUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-60 bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={notice.imageUrl} 
                        alt="إعلان جماعة الدروة" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  {/* Footer metadata & links */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'ar' ? 'بلاغ رسمي موثق' : 'Communiqué officiel'}</span>
                    </div>

                    {notice.externalLink && (
                      <a
                        href={notice.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 font-bold hover:underline"
                      >
                        <span>{language === 'ar' ? 'عرض الوثيقة أو التفاصيل' : 'Voir le document'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
