import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle2, 
  Heart, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle,
  Pill,
  Stethoscope,
  Wrench,
  Building2,
  Car,
  ShoppingBag
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types.ts';
import { whatsappNumber } from '../lib/servicePolicy';
import { useApp } from '../context/AppContext.tsx';

interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { language, t, isFavorite, toggleFavorite, showToast, isAdminAuthenticated, toggleVerification } = useApp();
  const [copied, setCopied] = useState(false);

  const getCategoryIcon = (category: ServiceCategory) => {
    switch (category) {
      case 'emergency': return AlertCircle;
      case 'pharmacy': return Pill;
      case 'health': return Stethoscope;
      case 'artisan': return Wrench;
      case 'municipal': return Building2;
      case 'transport': return Car;
      case 'commerce': return ShoppingBag;
      default: return CheckCircle2;
    }
  };

  const getCategoryColor = (category: ServiceCategory) => {
    switch (category) {
      case 'emergency': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900';
      case 'pharmacy': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900';
      case 'health': return 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-900';
      case 'artisan': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900';
      case 'municipal': return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900';
      case 'transport': return 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900';
      case 'commerce': return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900';
      default: return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const Icon = getCategoryIcon(service.category);
  const isFav = isFavorite(service.id);

  const handleCopyPhone = async () => {
    try { await navigator.clipboard.writeText(service.phone); } catch { showToast(language === 'ar' ? 'تعذر نسخ الرقم.' : 'Copy failed.'); return; }
    setCopied(true);
    showToast(t.numberCopied);
    setTimeout(() => setCopied(false), 2000);
  };

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    (service.mapQuery || service.name[language]) + ' Deroua'
  )}`;

  return (
    <article
      id={`service-card-${service.id}`}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Category badge, status, and favorite toggle */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(service.category)}`}>
              <Icon className="w-3.5 h-3.5" />
              <span>{service.tradeOrRole[language]}</span>
            </span>

            {service.is24_7 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                24/24
              </span>
            )}

            {service.isGuardPharmacy && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                حراسة
              </span>
            )}

            {service.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 fill-sky-500 text-white dark:text-slate-900" />
                <span>{language === 'ar' ? 'موثق بالعلامة الزرقاء' : 'Vérifié'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isAdminAuthenticated && (
              <button
                id={`admin-toggle-verify-${service.id}`}
                type="button"
                onClick={() => toggleVerification(service.id)}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  service.verified
                    ? 'text-sky-600 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300'
                    : 'text-slate-400 bg-slate-100 hover:text-sky-600 hover:bg-sky-50 dark:bg-slate-800 dark:text-slate-400'
                }`}
                title={service.verified ? (language === 'ar' ? 'إلغاء العلامة الزرقاء (إدارة)' : 'Retirer le badge') : (language === 'ar' ? 'منح العلامة الزرقاء (إدارة)' : 'Attribuer le badge')}
              >
                <CheckCircle2 className={`w-4 h-4 ${service.verified ? 'fill-sky-500 text-white dark:text-slate-900' : ''}`} />
              </button>
            )}

            <button
              id={`fav-btn-${service.id}`}
              type="button"
              onClick={() => toggleFavorite(service.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isFav ? 'Retirer' : 'Favori'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title and verification */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {service.name[language]}
            </h3>
            {service.verified && (
              <span 
                title={language === 'ar' ? 'نشاط معتمد وموثق بالعلامة الزرقاء' : 'Activité vérifiée avec badge bleu'} 
                className="text-sky-500 shrink-0 drop-shadow-2xs"
              >
                <CheckCircle2 className="w-4.5 h-4.5 fill-sky-500 text-white dark:text-slate-900" />
              </span>
            )}
          </div>

          {/* Rating if available */}
          {service.rating && (
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold mt-0.5">
              <div className="flex items-center">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="ml-1 rtl:mr-1 rtl:ml-0 text-slate-700 dark:text-slate-300">
                  {service.rating.toFixed(1)}
                </span>
              </div>
              {service.reviewsCount && (
                <span className="text-slate-400 font-normal">
                  ({service.reviewsCount})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Address & Neighborhood */}
        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 mb-3">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{service.address[language]}</span>
          </div>
          <div className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[11px] font-medium">
            {service.neighborhood[language]}
          </div>

          {service.workingHours && (
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 pt-0.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{service.workingHours[language]}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {service.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {service.description[language]}
          </p>
        )}
      </div>

      {/* Action footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {/* Call button */}
        <a
          id={`call-btn-${service.id}`}
          href={`tel:${service.phone}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-all shadow-xs active:scale-98"
        >
          <Phone className="w-3.5 h-3.5" />
          <span dir="ltr">{service.phone}</span>
        </a>

        {/* WhatsApp Button */}
        {service.whatsapp && (
          <a
            id={`wa-btn-${service.id}`}
            href={`https://wa.me/${whatsappNumber(service.whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 dark:text-emerald-300 transition-colors"
            title={t.whatsappChat}
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        )}

        {/* Copy Phone */}
        <button
          id={`copy-phone-${service.id}`}
          type="button"
          onClick={handleCopyPhone}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
          title={t.copyNumber}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Map */}
        <a
          id={`map-link-${service.id}`}
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
          title="Google Maps"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
};
