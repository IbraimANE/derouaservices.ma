import React from 'react';
import { 
  Sparkles, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Copy, 
  Check, 
  Navigation 
} from 'lucide-react';
import { isCurrentGuardPharmacy, whatsappNumber } from '../lib/servicePolicy';
import { useApp } from '../context/AppContext.tsx';

export const GuardPharmacyWidget: React.FC = () => {
  const { language, t, services, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  // Find active guard pharmacy
  const guardPharmacy = services.find(s => isCurrentGuardPharmacy(s));

  if (!guardPharmacy) return <section className="p-5 rounded-2xl border bg-amber-50 text-amber-950" role="status">
    {language === 'ar' ? 'لا تتوفر لدينا حراسة صيدلية مؤكدة لهذا الوقت. تحقق من جدول الحراسة المحلي قبل التوجه.' : language === 'fr' ? 'Aucune pharmacie de garde confirmée pour cette période. Vérifiez le tableau local avant de vous déplacer.' : 'No confirmed duty pharmacy for this time. Check the local duty roster before travelling.'}
  </section>;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(guardPharmacy.phone); } catch { showToast(language === 'ar' ? 'تعذر نسخ الرقم.' : 'Copy failed.'); return; }
    setCopied(true);
    showToast(t.numberCopied);
    setTimeout(() => setCopied(false), 2000);
  };

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    (guardPharmacy.mapQuery || guardPharmacy.name[language]) + ' Deroua Maroc'
  )}`;

  return (
    <section className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-sky-50 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden transition-all">
      {/* Decorative pulse indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              {t.guardPharmacyNow}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              24h / 24
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{guardPharmacy.workingHours?.[language] || '24h/24'}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Pharmacy details */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {guardPharmacy.name[language]}
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-600 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              {t.dutyPharmacyBadge}
            </span>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{guardPharmacy.address[language]}</span>
            <span className="text-slate-400">•</span>
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              {guardPharmacy.neighborhood[language]}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl">
            {guardPharmacy.guardSource}<br />
            {new Date(guardPharmacy.guardStartsAt!).toLocaleString(language)} — {new Date(guardPharmacy.guardEndsAt!).toLocaleString(language)}
          </p>
        </div>

        {/* Direct Action buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Direct call button */}
          <a
            id="guard-pharmacy-call-btn"
            href={`tel:${guardPharmacy.phone}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all active:scale-98"
          >
            <Phone className="w-4 h-4" />
            <span>{guardPharmacy.phone}</span>
          </a>

          {/* WhatsApp if available */}
          {guardPharmacy.whatsapp && (
            <a
              id="guard-pharmacy-whatsapp-btn"
              href={`https://wa.me/${whatsappNumber(guardPharmacy.whatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:hover:bg-emerald-800 dark:text-emerald-200 transition-colors"
              title={t.whatsappChat}
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          )}

          {/* Copy phone */}
          <button
            id="guard-pharmacy-copy-btn"
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors"
            title={t.copyNumber}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Map Link */}
          <a
            id="guard-pharmacy-map-btn"
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors"
            title="Directions"
          >
            <Navigation className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
