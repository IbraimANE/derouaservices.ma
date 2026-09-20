import React from 'react';
import { Car, Bus, MapPin, Clock, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { TRANSPORT_ROUTES } from '../data/derouaData.ts';

export const TransportGuide: React.FC = () => {
  const { language, t, direction } = useApp();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t.transportTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ar'
                ? 'خطوط سيارات الأجرة الكبيرة والحافلات الرابطة بين الدروة والدار البيضاء وبرشيد والمطار'
                : 'Liaisons Grands Taxis et Bus vers Casablanca, Berrechid et l\'Aéroport Mohammed V'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {TRANSPORT_ROUTES.map((route) => {
          const isBus = route.type === 'bus';
          return (
            <div
              key={route.id}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
            >
              {/* Route header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                  isBus 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {isBus ? <Bus className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                  <span>{isBus ? (route.lineOrNumber || 'Bus') : (language === 'ar' ? 'طاكسي كبير' : 'Grand Taxi')}</span>
                </span>

                <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                  <DollarSign className="w-3 h-3" />
                  <span>{route.fare}</span>
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white mb-2.5">
                <span>{route.from[language]}</span>
                <ArrowIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{route.to[language]}</span>
              </div>

              {/* Meta information */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{route.station[language]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{route.operatingHours[language]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
