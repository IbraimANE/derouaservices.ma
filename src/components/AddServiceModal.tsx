import React, { useState } from 'react';
import { X, PlusCircle, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ServiceCategory } from '../types.ts';
import { DEROUA_NEIGHBORHOODS } from '../data/derouaData.ts';

export const AddServiceModal: React.FC = () => {
  const { 
    language, 
    t, 
    isAddModalOpen, 
    setIsAddModalOpen, 
    addService 
  } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<ServiceCategory, 'all'>>('artisan');
  const [trade, setTrade] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [neighborhood, setNeighborhood] = useState('Hay Al Wifaq');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [is247, setIs247] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !trade.trim()) return;

    setIsSubmitting(true);
    try {
      await addService({
        category,
        name: { ar: name, fr: name, en: name },
        tradeOrRole: { ar: trade, fr: trade, en: trade },
        phone: phone.trim(),
        whatsapp: whatsapp.trim() ? whatsapp.trim() : undefined,
        address: { 
          ar: address.trim() || 'مدينة الدروة', 
          fr: address.trim() || 'Ville de Deroua', 
          en: address.trim() || 'Deroua city' 
        },
        neighborhood: { 
          ar: neighborhood, 
          fr: neighborhood, 
          en: neighborhood 
        },
        is24_7: is247,
        isOpenNow: true,
        verified: false,
        description: {
          ar: description.trim() || 'خدمة مسجلة في دليل الدروة',
          fr: description.trim() || 'Service enregistré dans l\'annuaire de Deroua',
          en: description.trim() || 'Service registered in Deroua directory'
        },
        workingHours: {
          ar: is247 ? 'متاح 24/24' : '08:30 - 20:00',
          fr: is247 ? '24h/24' : '08:30 - 20:00',
          en: is247 ? '24/7' : '08:30 - 20:00'
        }
      });

      setIsAddModalOpen(false);
      // Reset fields
      setName('');
      setTrade('');
      setPhone('');
      setWhatsapp('');
      setAddress('');
      setDescription('');
      setIs247(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.addServiceBtn}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar'
                  ? 'سجل نشاطك المهني أو الحرفي في دليل خدمات الدروة'
                  : 'Inscrivez votre activité ou métier dans l\'annuaire local de Deroua'}
              </p>
            </div>
          </div>
          <button
            id="close-add-modal-btn"
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Name */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'الاسم الكامل أو اسم المحل *' : 'Nom du professionnel ou de l\'enseigne *'}
            </label>
            <input
              id="service-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: المعلم رشيد - ترصيص صحي' : 'Ex: Rachid Plomberie Express'}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          {/* Category & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'التصنيف *' : 'Catégorie *'}
              </label>
              <select
                id="service-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<ServiceCategory, 'all'>)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                <option value="artisan">{t.artisan}</option>
                <option value="health">{t.health}</option>
                <option value="pharmacy">{t.pharmacy}</option>
                <option value="transport">{t.transport}</option>
                <option value="commerce">{t.commerce}</option>
                <option value="municipal">{t.municipal}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'الحرفة أو التخصص *' : 'Métier ou Spécialité *'}
              </label>
              <input
                id="service-trade-input"
                type="text"
                required
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                placeholder={language === 'ar' ? 'كهربائي، صباغ، ميكانيكي...' : 'Plombier, Électricien, Médecin...'}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'ar' ? 'رقم الهاتف *' : 'Numéro de téléphone *'}</span>
              </label>
              <input
                id="service-phone-input"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 XX XX XX XX"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'ar' ? 'رقم الواتساب (اختياري)' : 'WhatsApp (Optionnel)'}</span>
              </label>
              <input
                id="service-whatsapp-input"
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="2126XXXXXXXX"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Neighborhood & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.neighborhoodLabel} *</span>
              </label>
              <select
                id="service-neighborhood-select"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                {DEROUA_NEIGHBORHOODS.filter(n => n.id !== 'all').map(n => (
                  <option key={n.id} value={n.fr}>
                    {n[language]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'العنوان بالتفصيل' : 'Adresse précise'}
              </label>
              <input
                id="service-address-input"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={language === 'ar' ? 'شارع، زنقة أو رقم العمارة' : 'Rue, boulevard ou résidence'}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'وصف مختصر للخدمات' : 'Description courte des prestations'}
            </label>
            <textarea
              id="service-desc-textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'ar' ? 'أبرز الخدمات والخبرة...' : 'Services proposés, interventions...'}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          {/* 24/7 toggle */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
            <input
              id="service-247-checkbox"
              type="checkbox"
              checked={is247}
              onChange={(e) => setIs247(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded cursor-pointer"
            />
            <label htmlFor="service-247-checkbox" className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              {language === 'ar' ? 'متاح للتدخلات العاجلة 24/24' : 'Disponible 24h/24 pour urgences'}
            </label>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              id="cancel-add-btn"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              id="submit-service-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold transition-colors shadow-xs flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'ar' ? 'جاري التسجيل...' : 'Enregistrement...'}</span>
                </>
              ) : (
                <span>{language === 'ar' ? 'نشر الخدمة' : 'Enregistrer'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
