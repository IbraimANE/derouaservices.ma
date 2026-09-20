import React, { useState } from 'react';
import { X, Megaphone, Send, CheckCircle2, MessageSquare, Phone, Building, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const AdInquiryModal: React.FC = () => {
  const { language, isAdInquiryModalOpen, setIsAdInquiryModalOpen, showToast, submitAdInquiry } = useApp();

  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('real_estate');
  const [duration, setDuration] = useState('1_month');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isAdInquiryModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim()) {
      showToast(language === 'ar' ? 'يرجى إدخال اسم النشاط ورقم الهاتف' : 'Veuillez remplir les champs obligatoires');
      return;
    }

    submitAdInquiry({
      businessName: businessName.trim(),
      phone: phone.trim(),
      whatsapp: phone.trim(),
      category,
      duration,
      notes: notes.trim()
    });

    setSubmitted(true);
  };

  const AD_ADMIN_PHONE = '0649414261';
  const AD_ADMIN_PHONE_DISPLAY = '06 49 41 42 61';
  const AD_ADMIN_WHATSAPP = '212649414261';

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      language === 'ar'
        ? `السلام عليكم، أود حجز مساحة إعلانية على موقع خدمات الدروة derouaservices.ma:\n- اسم النشاط/المشروع: ${businessName || 'غير محدد بعد'}\n- رقم الهاتف للتواصل: ${phone || 'غير محدد'}\n- مدة الإشهار: ${duration}\n- ملاحظات: ${notes || 'لا توجد'}`
        : `Bonjour, je souhaite réserver un espace publicitaire sur derouaservices.ma:\n- Projet: ${businessName || 'Non spécifié'}\n- Téléphone: ${phone || ''}\n- Durée: ${duration}\n- Notes: ${notes || 'Aucune'}`
    );
    window.open(`https://wa.me/${AD_ADMIN_WHATSAPP}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="ad-inquiry-modal-container"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-amber-500/10 dark:bg-amber-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'حجز مساحة إعلانية في الدروة' : 'Espace Publicitaire Deroua'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'عزز وصول مشروعك لآلاف الزوار المحليين' : 'Visibilité maximale pour votre commerce'}
              </p>
            </div>
          </div>

          <button
            id="ad-modal-close-btn"
            type="button"
            onClick={() => {
              setIsAdInquiryModalOpen(false);
              setSubmitted(false);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'ar' ? 'تم استلام طلب حجز المساحة الإعلانية بنجاح' : 'Demande enregistrée avec succès'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
              {language === 'ar'
                ? 'شكراً لكم. طلبكم مسجل لدى الإدارة. لتأكيد وتفعيل الإعلان سريعاً، يمكنكم التواصل مباشرة عبر الرقم المخصص للإعلانات:'
                : 'Merci. Votre demande est enregistrée. Pour une activation rapide, contactez directement le numéro dédié :'}
            </p>

            {/* Direct Admin Ad Contact Box */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center space-y-1.5 max-w-sm mx-auto">
              <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 block">
                {language === 'ar' ? 'الرقم المخصص لتلقي طلبات الإعلانات:' : 'Numéro direct réservations publicitaires :'}
              </span>
              <a 
                href={`tel:${AD_ADMIN_PHONE}`}
                className="text-lg font-black text-slate-900 dark:text-white font-mono tracking-wider hover:text-amber-600 transition-colors inline-block"
                dir="ltr"
              >
                {AD_ADMIN_PHONE_DISPLAY}
              </a>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'ar' ? 'إرسال التفاصيل عبر واتساب' : 'Envoyer sur WhatsApp'}</span>
              </button>
              <a
                href={`tel:${AD_ADMIN_PHONE}`}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>{language === 'ar' ? 'اتصال مباشر' : 'Appeler'}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsAdInquiryModalOpen(false);
                  setSubmitted(false);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                {language === 'ar' ? 'إغلاق' : 'Fermer'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Quick Admin Contact Bar */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {language === 'ar' ? 'هاتف وواتساب حجز الإعلانات:' : 'Tél & WhatsApp résa :'}
                  </span>{' '}
                  <span className="font-mono font-black text-amber-700 dark:text-amber-400" dir="ltr">
                    {AD_ADMIN_PHONE_DISPLAY}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${AD_ADMIN_PHONE}`}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold hover:bg-slate-50 transition-colors"
                >
                  {language === 'ar' ? 'اتصال' : 'Appel'}
                </a>
                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-500 transition-colors flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'اسم المشروع / المحل أو الخدمة *' : 'Nom du projet / commerce *'}
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 rtl:right-3 rtl:left-auto top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: إقامات النخيل، مطعم الدروة، وكالة كراء...' : 'Ex: Résidence Anakhil, Garage Auto...'}
                  className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'رقم الهاتف أو الواتساب *' : 'Téléphone ou WhatsApp *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 rtl:right-3 rtl:left-auto top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06XXXXXXXX"
                    className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'مدة الإشهار المطلوبة' : 'Durée souhaitée'}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 rtl:right-3 rtl:left-auto top-3 text-slate-400" />
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="1_month">{language === 'ar' ? 'شهر واحد' : '1 mois'}</option>
                    <option value="3_months">{language === 'ar' ? '3 أشهر (تخفيض خاص)' : '3 mois'}</option>
                    <option value="6_months">{language === 'ar' ? '6 أشهر' : '6 mois'}</option>
                    <option value="1_year">{language === 'ar' ? 'سنة كاملة (شريك رسمي)' : '1 an (Partenaire)'}</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'تصنيف النشاط' : 'Secteur'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="real_estate">{language === 'ar' ? 'عقارات وإقامات سكنية' : 'Immobilier & Résidences'}</option>
                <option value="auto">{language === 'ar' ? 'سيارات، كراء، وفحص تقني' : 'Automobile & Location'}</option>
                <option value="food">{language === 'ar' ? 'مطاعم، مقاهي، وتغذية' : 'Restaurants & Cafés'}</option>
                <option value="health">{language === 'ar' ? 'صحة، مختبرات، وعيادات' : 'Santé & Laboratoires'}</option>
                <option value="service">{language === 'ar' ? 'خدمات، تجارة، ومهن حرة' : 'Commerces & Services'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'ملاحظات أو نص الإعلان المرغوب' : 'Détails ou message de l\'annonce'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'ar' ? 'أضف رابط صفحتك أو وصفاً مختصراً لعرضك...' : 'Votre site ou offre spéciale...'}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'ar' ? 'تواصل فوري عبر واتساب' : 'WhatsApp direct'}</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إرسال الطلب' : 'Envoyer'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
