import React from 'react';
import { Phone, AlertCircle, Shield, Flame, HeartPulse } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const EmergencyBanner: React.FC = () => {
  const { language, t } = useApp();

  const emergencyNumbers = [
    {
      number: '15',
      title: language === 'ar' ? 'الوقاية المدنية (الإطفاء)' : 'Protection Civile (15)',
      desc: language === 'ar' ? 'إطفاء وإسعاف' : 'Pompiers & Secours',
      color: 'from-red-600 to-rose-600',
      icon: Flame
    },
    {
      number: '177',
      title: language === 'ar' ? 'الدرك الملكي (الدروة)' : 'Gendarmerie Royale (177)',
      desc: language === 'ar' ? 'أمن ونجدة' : 'Sécurité & Police',
      color: 'from-emerald-700 to-teal-800',
      icon: Shield
    },
    {
      number: '141',
      title: language === 'ar' ? 'الإسعاف الطبي (SAMU)' : 'SAMU / Urgences (141)',
      desc: language === 'ar' ? 'طوارئ طبية' : 'Secours médical',
      color: 'from-blue-600 to-indigo-700',
      icon: HeartPulse
    },
    {
      number: '0522530115',
      title: language === 'ar' ? 'وقاية الدروة المحلية' : 'Poste Deroua Direct',
      desc: language === 'ar' ? 'مقر الدروة' : 'Bureau local',
      color: 'from-amber-600 to-orange-700',
      icon: Phone
    }
  ];

  return (
    <section className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {t.emergencyNumbersQuick}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ar' 
                  ? 'اتصال مباشر فوري ومجاني في حالات الطوارئ بالدروة' 
                  : 'Appel direct 24h/24 en cas d\'urgence à Deroua'}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
            24h/24
          </span>
        </div>

        {/* Quick dial grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {emergencyNumbers.map((emg, idx) => {
            const Icon = emg.icon;
            return (
              <a
                key={idx}
                id={`emergency-call-${emg.number}`}
                href={`tel:${emg.number}`}
                className={`group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r ${emg.color} text-white shadow-sm hover:brightness-110 active:scale-98 transition-all`}
              >
                <div className="overflow-hidden">
                  <div className="text-[11px] font-medium text-white/80 truncate">
                    {emg.title}
                  </div>
                  <div className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-1.5">
                    <span>{emg.number}</span>
                  </div>
                  <div className="text-[10px] text-white/70 truncate hidden sm:block">
                    {emg.desc}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
