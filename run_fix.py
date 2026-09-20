# -*- coding: utf-8 -*-
import re

# 1. Write EmergencyBanner.tsx
banner = """import React from 'react';
import { Phone, AlertCircle, Shield, Flame, HeartPulse } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const EmergencyBanner: React.FC = () => {
  const { language, t } = useApp();

  const emergencyNumbers = [
    {
      number: '15',
      displayNumber: '15',
      title: language === 'ar' ? '\u0627\u0644\u0647\u0627\u064a\u062a (\u0621\u0644\u0627\u0637\u0641\u0627\u0621)' : 'Protection Civile (15)',
      desc: language === 'ar' ? '\u0621\u0644\u062d\u0627\u0629 \u0621\u0644\u0622\u0633\u0641\u0621\u062a' : 'Pompiers & Secours',
      color: 'from-red-600 to-rose-600',
      icon: Flame
    },
    {
      number: '177',
      displayNumber: '177',
      title: language === 'ar' ? '\u0627\u0644\u0631\u0643 \u0627\u0644\u0645\u0644\u062c\u064a (\u0627\u0644\u062d\u0641\u062a)' : 'Gendarmerie Royale (177)',
      desc: language === 'ar' ? '\u0627\u0644\u0621\u0645\u0646 \u0627\u0644\u0633\u0644\u0627\u0645\u062a' : 'Sécurité & Police',
      color: 'from-emerald-700 to-teal-800',
      icon: Shield
    },
    {
      number: '0666752258',
      displayNumber: '06 66 75 22 58',
      title: language === 'ar' ? '\u0628\u062d\u0645\u0629 \u0621\u0644\u0622\u0633\u0641\u0621\u062a (\u0627\u0644\u062d\u0641\u062a')' : 'Ambulance Commune Deroua',
      desc: language === 'ar' ? '\u062c\u062b\u062f \u0621\u0644\u062a\u062a\u0644\u062a / \u062c\u062b\u062f \u0627\u0644\u0631\u0636\u0627\u0647 / \u0621\u0648\u0621\u0627\u0647' : 'Abdelali / Abdelrazzak / Toufik',
      color: 'from-blue-600 to-indigo-700',
      icon: HeartPulse
    },
    {
      number: '0522337325',
      displayNumber: '05 22 33 73 25',
      title: language === 'ar' ? '\u0627\u0644\u0647\u0627\u064a\u062a \u0621\u0644\u0645\u0627\u0646\u0646\u062a \u0628\u0631\u0636\u064c\u062d' : 'Protection Civile Berrechid',
      desc: language === 'ar' ? '\u0645\u0647\u0631 \u0628\u0631\u0636\u064c\u062d' : 'Bureau Berrechid',
      color: 'from-amber-600 to-orange-700',
      icon: Phone
    },
    {
      number: '0522539502',
      displayNumber: '05 22 53 95 02',
      title: language === 'ar' ? '\u0627\u0644\u0647\u0627\u064a\u062a (\u0621\u0644\u0645\u0627\u0646\u0646\u062a \u0627\u0644\u0646\u0648\u0627\u0638\u0631)' : 'Protection Civile Nouaceur',
      desc: language === 'ar' ? '\u0645\u0647\u0631 \u0627\u0644\u0646\u0648\u0627\u0638\u0631' : 'Bureau Nouaceur',
      color: 'from-orange-700 to-red-700',
      icon: Phone
    }
  ];

  return (
    <section className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-mg border border-slate-800 relative overflow-hidden">
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
                  ? '\u0627\u062b\u0635\u0627\u0644 \u0645\u0628\u0623\u0638\u0631 \u0641\u0648\u0631\u064a \u0645\u062c\u0627\u0646\u064a (24/24)' 
                  : "Appel direct 24h/24 en cas d'urgence à Deroua"}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
            24h/24
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {emergencyNumbers.map((emg, idx) => {
            const Icon = emg.icon;
            return (
              <a
                key={idx}
                id={`emergency-call-${emg.number}}
                href={`tel:${emg.number}}
                className={group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r ${emg.color} text-white shadow-sm hover:brightness-110 active:scale-98 transition-all}
              >
                <div className="overflow-hidden">
                  <div className="text-[11px] font-medium text-white/80 truncate">
                    {emg.title}
                  </div>
                  <div className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5">
                    <span>{emg.displayNumber || emg.number}</span>
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
"""

with open('src/components/EmergencyBanner.tsx', 'w', encoding='utf-8') as f:
    f.write(banner)
print('EmergencyBanner.tsx written.')

# 2. Fix derouaData.ts
with open('src/data/derouaData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

arr_start = text.find('export const INITIAL_SERVICES: ServiceItem[] = [')
if arr_start != -1:
    before_arr = text[:arr_start]
    emg1_pos = text.find("id: 'emg-1'", arr_start)
    if emg1_pos != -1:
        emg1_brace = text.rfind('{', arr_start, emg1_pos)
        after_emg1 = text[emg1_brace:]
        
        ambulance_card = """  {
    id: 'emg-ambulance-deroua',
    category: 'emergency',
    name: {
      ar: '\u0628\u062d\u0645\u0629 \u0621\u0644\u0622\u0633\u0641\u0621\u062a \u0621\u0645\u0627\u0645\u0629 \u0627\u0644\u062d\u0641\u062a',
      fr: 'Ambulance - Commune de Deroua',
      en: 'Ambulance - Deroua Municipality'
    },
    tradeOrRole: {
      ar: '\u062c\u062b\u062f \u0621\u0644\u062a\u062a\u0644\u062a: 0666752258 | \u062c\u062b\u062f \u0627\u0644\u0631\u0636\u0627\u0647: 0660625487 | \u0621\u0648\u0621\u0627\u0647: 0626056477',
      fr: 'Abdelali: 0666752258 | Abdelrazzak: 0660625487 | Toufik: 0626056477',
      en: 'Abdelali: 0666752258 | Abdelrazzak: 0660625487 | Toufik: 0626056477'
    },
    phone : '0666752258',
    secondaryPhone : '0660625487',
    whatsapp: '212626056477',
    address: {
      ar: '\u0645\u0647\u0631 \u0621\u0645\u0627\u0645\u062a \u0627\u0644\u062d\u0641\u062a\u062c \u0621\u0631\u0644\u064c\u0631 \u0628\u0631\u0636\u064c\u062d',
      fr[ : 'Commune Urbaine de Deroua, Province de Berrechid',
      en[ : 'Deroua Municipality, Berrechid'
    },
    neighborhood: {
      ar: '\u0627\u0644\u062d\u0641\u062a \u0627\u0644\u0645\u0631\u062c\u062a',
      fr[ : 'Deroua Centre',
      en[ : 'Deroua Center'
    },
    is24_7: true,
    isOpenNow: true,
    isEmergency: true,
    verified: true,
    description: {
      ar: '\u0628\u062d\u0645\u062a \u0631\u064a\u0627\u0631\u062a \u0621\u0644\u0622\u0633\u0641\u0621\u062a \u0627\u0644\u062a\u062c\u062a\u062a \u0644\u0621\u0645\u0627\u0645\u0629 \u0627\u0644\u062d\u0641\u062a (\u062c\u062b\u062f \u0621\u0644\u062a\u062a\u062a: 0666752258 / \u062c\u062b\u062f \u0627\u0644\u0631\u0636\u0627\u0647: 0660625487 / \u0621\u0648\u0621\u0627\u0647: 0626056477)',
      fr[ : 'Service dambulance municipale (Abdelali: 0666752258 / Abdelrazzak: 0660625487 / Toufik: 0626056477)',
      en[ : 'Deroua Municipal Ambulance Service'
    },
    workingHours: { ar[ : '\u0645\u0621\u0627\u0621 24/24', fr[ : '24h/24', en[ : '24/7' }
  }, \n""".replace("fr[", "fr").replace("en[", "en").replace("ar[", "ar")
        text = before_arr + 'export const INITIAL_SERVICES: ServiceItem[] = [\n' + ambulance_card + after_emg1

# Replace ONEE water & elec with SRM
srm_card = """  { [id]: 'mun-srm-deroua',
    category: 'municipal',
    name: {
      ar: '\u0627\u0644\u0638\u0631\u062a\u062a \u0627\u0644\u0646\u0637\u0648\u064b\u0629 \u0645\u062a\u0627\u062d\u062d\u0629 \u0627\u0644\u062b\u062f\u0645\u0621 (SRM)',
      fr: 'Société Régionale Multiservices (SRM)',
      en: 'Regional Multiservices Company (SRM'
    },
    tradeOrRole: {
      ar: '\u0628\u062d\u0645\u0621\u062a \u0648\u062a\u0648\u0631\u064a\u062c \u0627\u0644\u0645\u0627\u0621 \u0627\u0644\u0637\u0621\u0644\u062d\u062b \u0644\u0644\u0637\u0631\u0628 \u0648\u0627\u0644\u0643\u0645\u0641\u062a\u0625',
      fr: 'Distribution Eau Potable & Électricité',
      en: 'Water & Electricity Distribution'
    },
    phone : '0522530230',
    secondaryPhone : '0801000777',
    address: {
      ar: '\u0645\u0631\u062c\u062a \u0627\u0644\u062d\u0641\u062a\u062c \u0621\u0631\u0644\u064c\u0631 \u0628\u0631\u0636\u064c\u062d (\u0648\u062c\u0621\u0644\u062a \u0628\u062d\u0645\u0621\u062a \u0627\u0644\u0636\u0628\u0646\u0625\u0621 SRM)',
      fr[ : 'Centre de Deroua, Agence SRM',
      en[ : 'Deroua Center, SRM Agency'
    },
    neighborhood: {
      ar: '\u0627\u0644\u062d\u0641\u062a \u0627\u0644\u0645\u0631\u062c\u062a',
      fr[ : 'Deroua Centre',
      en[ : 'Deroua Center'
    },
    mapQuery: 'https://maps.app.goo.gl/amkGwhEwMb4wnsGP6',
    is24_7: false,
    isOpenNow: true,
    verified: true,
    description: {
      ar: '\u0627\u0644\u0638\u0631\u062a\u062a \u0627\u0644\u0646\u0637\u0648\u064b\u0629 \u0645\u062a\u0627\u062d\u062d\u0629 \u0627\u0644\u062b\u062f\u0645\u0621 (SRM) \u0644\u062a\u062d\u0628\u064a\u0631 \u0645\u0627\u0621 \u0648\u0627\u0644\u0643\u0645\u0641\u0621\u062a (\u0627\u0644\u0627\u062a\u0635\u0627\u0644: 0522530230 / \u0647\u0648\u0627\u0631\u0632: 0801000777).',
      fr[ : 'Société Régionale Multiservices (SRM Casablanca-Settat) - Agence Deroua.',
      en[ : 'Regional Multiservices Company (SRM) managing water and electricity in Deroua.'
    },
    workingHours: { ad[ : '08:30 - 16:30 (\u0621\u0644\u0621\u062c\u0641\u064a\u0646 - \u0621\u0644\u062c\u0645\u062c\u062a) | \u0647\u0648\u0627\u0631\u0632 24/24', fr[ : '08h30 - 16h30 (Lun - Ven) | Urgences 24h/24', en[ : '08:30 - 16:30 (Mon - Fri) | Emergencies 24/7' }
  }, """.replace("[id]", "id").replace("fr[", "fr").replace("en[", "en").replace("ad[", "ar")

text = re.sub(r'\\{\s+[id]:\\s+\'(mun-3'|'mun-4|').*?\\}\s*,\\s+\\{\s+[id]:\\s+\'mun-4'.*?\\}\s*,'.replace("[id]", "id"), srm_card, text, flags=re.DOTALL)

with open('src/data/derouaData.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print('derouaData.ts written.')
