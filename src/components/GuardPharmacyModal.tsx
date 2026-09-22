import React, { useState, useMemo } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Navigation, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  HeartPulse,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { GUARD_PHARMACY_SCHEDULE } from '../data/derouaData.ts';
import { ServiceItem } from '../types.ts';

export const GuardPharmacyModal: React.FC = () => {
  const { 
    language, 
    isPharmacyModalOpen, 
    setIsPharmacyModalOpen, 
    services, 
    activeGuardPharmacyId, 
    setActiveGuardPharmacy, 
    isAdminAuthenticated,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'current' | 'schedule' | 'all'>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');

  if (!isPharmacyModalOpen) return null;

  // Filter all pharmacies
  const allPharmacies = services.filter(s => s.category === 'pharmacy');
  
  // Currently active guard pharmacy
  const activeGuard = allPharmacies.find(p => p.id === activeGuardPharmacyId) || allPharmacies[0];

  // Neighborhoods list for filtering
  const neighborhoods = Array.from(
    new Set(allPharmacies.map(p => p.neighborhood[language] || p.neighborhood.ar))
  ).filter(Boolean);

  const filteredPharmacies = useMemo(() => {
    return allPharmacies.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (p.name.ar + p.name.fr).toLowerCase().includes(q);
        const matchesAddress = (p.address.ar + p.address.fr).toLowerCase().includes(q);
        const matchesPhone = p.phone.includes(q);
        if (!matchesName && !matchesAddress && !matchesPhone) return false;
      }
      if (selectedNeighborhood !== 'all') {
        const nName = p.neighborhood[language] || p.neighborhood.ar;
        if (nName !== selectedNeighborhood) return false;
      }
      return true;
    });
  }, [allPharmacies, searchQuery, selectedNeighborhood, language]);

  const handleCall = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (pharmacy: ServiceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = pharmacy.whatsapp || pharmacy.phone;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `212${cleanPhone.slice(1)}` : cleanPhone;
    const message = language === 'ar'
      ? `السلام عليكم، أتواصل معكم عبر منصة خدمات الدروة (derouaservices.ma) للاستفسار عن توفر دواء أو مستلزم صيدلاني.`
      : `Bonjour, je vous contacte via la plateforme derouaservices.ma pour vérifier la disponibilité d'un médicament.`;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleOpenMap = (pharmacy: ServiceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const query = pharmacy.mapQuery || `${pharmacy.name.fr || pharmacy.name.ar} Deroua Maroc`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  const handleShare = async (pharmacy: ServiceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = language === 'ar'
      ? `🏥 صيدلية الحراسة بالدروة: ${pharmacy.name.ar}\n📍 العنوان: ${pharmacy.address.ar}\n📞 هاتف: ${pharmacy.phone}\nعبر منصة خدمات الدروة: https://derouaservices.ma`
      : `🏥 Pharmacie de garde Deroua : ${pharmacy.name.fr}\n📍 Adresse : ${pharmacy.address.fr}\n📞 Tél : ${pharmacy.phone}\nVia https://derouaservices.ma`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: pharmacy.name[language] || pharmacy.name.ar,
          text: shareText,
          url: 'https://derouaservices.ma'
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(shareText);
    showToast(language === 'ar' ? 'تم نسخ معلومات الصيدلية للمشاركة' : 'Informations de la pharmacie copiées !');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fade-in" id="guard-pharmacy-modal">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 sm:p-7 text-white flex-shrink-0">
          <button 
            onClick={() => setIsPharmacyModalOpen(false)}
            className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <HeartPulse className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                <span>{language === 'ar' ? 'مداومة رسمية مستمرة 24/24' : 'Service de Garde 24h/24'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
                {language === 'ar' ? 'صيدليات الحراسة بالدروة' : 'Pharmacies de Garde à Deroua'}
              </h2>
            </div>
          </div>

          <p className="text-emerald-100 text-sm max-w-2xl mt-1">
            {language === 'ar'
              ? 'دليل صيدلية الحراسة المقررة لهذا الأسبوع بمدينة الدروة، مع الجدول الزمني المحدث وأرقام الاتصال وموقع GPS المباشر.'
              : 'Informations complètes sur la pharmacie de garde officielle, calendrier hebdomadaire et coordonnées directes à Deroua.'}
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/15 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'current'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>{language === 'ar' ? 'الصيدلية المناوبة حالياً' : 'Pharmacie de Garde Actuelle'}</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'schedule'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{language === 'ar' ? 'جدول الحراسة الأسبوعي' : 'Calendrier Hebdomadaire'}</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{language === 'ar' ? 'جميع صيدليات الدروة' : 'Toutes les Pharmacies'}</span>
              <span className="px-1.5 py-0.2 text-xs rounded-full bg-emerald-900/40">{allPharmacies.length}</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: CURRENT ACTIVE GUARD PHARMACY */}
          {activeTab === 'current' && (
            <div className="space-y-6 animate-fade-in">
              {activeGuard ? (
                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-500/30 dark:border-emerald-500/30 rounded-3xl p-5 sm:p-7 relative overflow-hidden">
                  <div className="absolute top-0 end-0 bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'مناوبة هذا الأسبوع' : 'Garde Officielle'}</span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/50 px-3 py-1 rounded-full mb-2">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>{language === 'ar' ? 'مفتوحة الآن - حراسة ليلية ونهارية 24/24' : 'Ouverte maintenant - Garde 24h/24'}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {activeGuard.name[language] || activeGuard.name.ar}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm mt-2">
                        <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{activeGuard.address[language] || activeGuard.address.ar}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="font-medium text-emerald-800 dark:text-emerald-300">
                          {activeGuard.neighborhood[language] || activeGuard.neighborhood.ar}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleShare(activeGuard, e)}
                        className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4 text-emerald-600" />
                        <span>{language === 'ar' ? 'مشاركة' : 'Partager'}</span>
                      </button>
                    </div>
                  </div>

                  {activeGuard.description && (
                    <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                      {activeGuard.description[language] || activeGuard.description.ar}
                    </p>
                  )}

                  {/* Primary Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                    <button
                      onClick={(e) => handleCall(activeGuard.phone, e)}
                      className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{language === 'ar' ? `اتصال: ${activeGuard.phone}` : `Appeler : ${activeGuard.phone}`}</span>
                    </button>

                    <button
                      onClick={(e) => handleWhatsApp(activeGuard, e)}
                      className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>{language === 'ar' ? 'تأكد من توفر الدواء (واتساب)' : 'Vérifier par WhatsApp'}</span>
                    </button>

                    <button
                      onClick={(e) => handleOpenMap(activeGuard, e)}
                      className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 font-bold text-sm shadow-sm transition-all"
                    >
                      <Navigation className="w-5 h-5 text-emerald-600" />
                      <span>{language === 'ar' ? 'الاتجاهات عبر GPS' : 'Itinéraire GPS'}</span>
                    </button>
                  </div>

                  {/* Emergency notice */}
                  <div className="mt-5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 bg-emerald-100/40 dark:bg-emerald-950/40 p-3 rounded-xl">
                    <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      {language === 'ar'
                        ? 'ملاحظة: أثناء الحراسة الليلية، يرجى قرع جرس الصيدلية أو الاتصال بالهاتف في حال كانت الواجهة الزجاجية مغلقة لدواعي أمنية.'
                        : 'Note : Pendant la garde de nuit, veuillez sonner ou appeler si la vitrine est sécurisée.'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  {language === 'ar' ? 'لا توجد صيدلية حراسة محددة حالياً.' : 'Aucune pharmacie de garde sélectionnée.'}
                </div>
              )}

              {/* Admin quick switch if logged in */}
              {isAdminAuthenticated && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>{language === 'ar' ? 'لوحة تحكم المشرف: تعيين صيدلية الحراسة' : 'Panneau Admin : Changer la pharmacie de garde'}</span>
                    </h4>
                    <span className="text-xs text-amber-700 dark:text-amber-300 font-mono">ADMIN</span>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mb-3">
                    {language === 'ar'
                      ? 'يمكنك تغيير الصيدلية المناوبة حالياً بنقرة واحدة ليتم تحديثها فوراً لجميع زوار الموقع:'
                      : 'Sélectionnez la pharmacie en service pour mettre à jour instantanément le site :'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allPharmacies.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setActiveGuardPharmacy(p.id)}
                        className={`text-start px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                          p.id === activeGuardPharmacyId
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{p.name[language] || p.name.ar}</span>
                        {p.id === activeGuardPharmacyId ? (
                          <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px]">{language === 'ar' ? 'نشطة' : 'Active'}</span>
                        ) : (
                          <span className="text-emerald-600 font-bold">{language === 'ar' ? 'تعيين' : 'Choisir'}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ROTATION SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {language === 'ar' ? 'جدول تناوب صيدليات الحراسة بالدروة' : 'Calendrier de Roulement des Gardes'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'ar'
                      ? 'الجدول الدوري المعتمد لتناوب الصيدليات وفق الترتيب الصيدلاني بإقليم برشيد / الدروة.'
                      : 'Calendrier officiel des tours de garde à la ville de Deroua.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {GUARD_PHARMACY_SCHEDULE.map((item) => {
                  const isCur = item.pharmacyId === activeGuardPharmacyId || item.isCurrent;
                  return (
                    <div 
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCur
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-sm'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isCur ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white text-base">
                                {item.pharmacyName[language] || item.pharmacyName.ar}
                              </span>
                              {isCur && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                                  {language === 'ar' ? 'حراسة نشطة الآن' : 'En Service'}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                {item.weekLabel[language] || item.weekLabel.ar}
                              </span>
                              <span>•</span>
                              <span>{item.dates[language] || item.dates.ar}</span>
                              <span>•</span>
                              <span>{item.neighborhood[language] || item.neighborhood.ar}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={(e) => handleCall(item.phone, e)}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{item.phone}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ALL PHARMACIES DIRECTORY */}
          {activeTab === 'all' && (
            <div className="space-y-4 animate-fade-in">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute top-3.5 start-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ar' ? 'بحث بالاسم، الحي، أو الشارع...' : 'Recherche par nom, quartier...'}
                    className="w-full ps-9 pe-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="w-full sm:w-auto">
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">{language === 'ar' ? 'كافة أحياء الدروة' : 'Tous les quartiers'}</option>
                    {neighborhoods.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pharmacies List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredPharmacies.map(pharmacy => {
                  const isGuard = pharmacy.id === activeGuardPharmacyId;
                  return (
                    <div 
                      key={pharmacy.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isGuard
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 shadow-sm'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">
                              {pharmacy.name[language] || pharmacy.name.ar}
                            </h4>
                            {isGuard && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                                {language === 'ar' ? 'حراسة' : 'Garde'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{pharmacy.address[language] || pharmacy.address.ar}</span>
                          </div>
                          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                            {pharmacy.neighborhood[language] || pharmacy.neighborhood.ar}
                          </div>
                        </div>

                        {pharmacy.workingHours && (
                          <div className="text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-700/60 px-2 py-1 rounded-lg flex-shrink-0">
                            {pharmacy.workingHours[language] || pharmacy.workingHours.ar}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleCall(pharmacy.phone, e)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{pharmacy.phone}</span>
                          </button>

                          {pharmacy.whatsapp && (
                            <button
                              onClick={(e) => handleWhatsApp(pharmacy, e)}
                              className="p-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={(e) => handleOpenMap(pharmacy, e)}
                            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-all"
                            title="GPS"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {isAdminAuthenticated && !isGuard && (
                          <button
                            onClick={() => setActiveGuardPharmacy(pharmacy.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-[11px] font-bold hover:bg-amber-200 transition-all"
                          >
                            {language === 'ar' ? 'تعيين كحراسة' : 'Activer garde'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredPharmacies.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  {language === 'ar' ? 'لم يتم العثور على صيدلية مطابقة للبحث.' : 'Aucune pharmacie trouvée.'}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar' ? 'منصة خدمات الدروة الرسمية • تحديث فوري' : 'Plateforme Deroua Services • Mise à jour en temps réel'}
          </div>
          <button
            onClick={() => setIsPharmacyModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all"
          >
            {language === 'ar' ? 'إغلاق' : 'Fermer'}
          </button>
        </div>

      </div>
    </div>
  );
};
