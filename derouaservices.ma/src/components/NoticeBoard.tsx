import React from 'react';
import { Bell, AlertTriangle, Building, Droplets, Calendar, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { DEROUA_NOTICES } from '../data/derouaData.ts';

export const NoticeBoard: React.FC = () => {
  const { language, t } = useApp();

  const getNoticeIcon = (type: string) => {
    switch (type) {
      case 'pharmacy_duty': return AlertTriangle;
      case 'municipal': return Building;
      case 'utility': return Droplets;
      default: return Bell;
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t.noticeBoardTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ar'
                ? 'آخر المستجدات والإعلانات الصيدلانية والبلدية لمدينة الدروة'
                : 'Avis municipaux, tours de garde et informations officielles de Deroua'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {DEROUA_NOTICES.map((notice) => {
          const Icon = getNoticeIcon(notice.type);
          return (
            <div
              key={notice.id}
              className={`p-4 rounded-xl border transition-colors ${
                notice.isUrgent
                  ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60'
                  : 'bg-slate-50/50 border-slate-200/80 dark:bg-slate-800/30 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`p-1 rounded-md ${
                    notice.isUrgent 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' 
                      : 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {notice.title[language]}
                  </h4>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 whitespace-nowrap">
                  <Calendar className="w-3 h-3" />
                  <span>{notice.date}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2.5">
                {notice.content[language]}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>{notice.author[language]}</span>
                </div>
                {notice.isUrgent && (
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    {language === 'ar' ? 'عاجل وهام' : 'Important'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
