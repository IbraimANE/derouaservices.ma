import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  AlertTriangle, 
  Building, 
  Droplets, 
  Car, 
  Calendar, 
  ShieldCheck, 
  Image as ImageIcon, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { NoticeItem } from '../types.ts';

export const AddNoticeModal: React.FC = () => {
  const { 
    language, 
    isAddNoticeModalOpen, 
    setIsAddNoticeModalOpen, 
    addNotice,
    isAdminAuthenticated,
    setIsAdminModalOpen,
    showToast
  } = useApp();

  const [titleAr, setTitleAr] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [contentFr, setContentFr] = useState('');
  const [authorAr, setAuthorAr] = useState('جماعة الدروة');
  const [authorFr, setAuthorFr] = useState('Commune de Deroua');
  const [type, setType] = useState<NoticeItem['type']>('municipal');
  const [isUrgent, setIsUrgent] = useState(false);
  const [externalLink, setExternalLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddNoticeModalOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleAr.trim() && !titleFr.trim()) {
      showToast(language === 'ar' ? 'يرجى إدخال عنوان المستجد' : 'Veuillez renseigner le titre');
      return;
    }

    if (!contentAr.trim() && !contentFr.trim()) {
      showToast(language === 'ar' ? 'يرجى إدخال تفاصيل المستجد' : 'Veuillez renseigner le contenu');
      return;
    }

    setIsSubmitting(true);

    try {
      const today = new Date().toISOString().split('T')[0];

      const newNoticePayload: Omit<NoticeItem, 'id' | 'createdAt'> = {
        type,
        title: {
          ar: titleAr.trim() || titleFr.trim(),
          fr: titleFr.trim() || titleAr.trim(),
          en: titleFr.trim() || titleAr.trim(),
        },
        content: {
          ar: contentAr.trim() || contentFr.trim(),
          fr: contentFr.trim() || contentAr.trim(),
          en: contentFr.trim() || contentAr.trim(),
        },
        date: today,
        isUrgent,
        author: {
          ar: authorAr.trim() || 'جماعة الدروة',
          fr: authorFr.trim() || 'Commune de Deroua',
          en: authorFr.trim() || 'Deroua Municipality'
        },
        externalLink: externalLink.trim() || undefined
      };

      await addNotice(newNoticePayload, imageFile || undefined);

      // Reset and close
      setTitleAr('');
      setTitleFr('');
      setContentAr('');
      setContentFr('');
      setExternalLink('');
      setImageFile(null);
      setImagePreview(null);
      setIsUrgent(false);
      setIsAddNoticeModalOpen(false);
    } catch (err) {
      console.error('Error adding notice:', err);
      showToast(language === 'ar' ? 'حدث خطأ أثناء حفظ المستجد' : 'Erreur lors de la publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Commune Logo & Branding */}
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo-commune-deroua-01-1.webp" 
                alt="شعار جماعة الدروة"
                className="w-10 h-10 object-contain rounded-lg bg-white/10 p-0.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo-commune-deroua.jpg';
                }}
              />
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <span>{language === 'ar' ? 'إضافة مستجد جديد - جماعة الدروة' : 'Publier une actualité de Deroua'}</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </h3>
                <p className="text-xs text-sky-200">
                  {language === 'ar'
                    ? 'إعلانات، قرارات بلدية ومستجدات صيدليات الحراسة'
                    : 'Avis municipaux, tours de garde et communiqués'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddNoticeModalOpen(false)}
              className="p-1.5 rounded-xl text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Warning if not authenticated as admin */}
        {!isAdminAuthenticated && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/40 p-3 px-5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                {language === 'ar' 
                  ? 'ملاحظة: هذا القسم مخصص لإدارة الموقع وجماعة الدروة لنشر البلاغات الرسمية.' 
                  : 'Section réservée à l\'administration pour les avis officiels.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAddNoticeModalOpen(false);
                setIsAdminModalOpen(true);
              }}
              className="font-bold underline whitespace-nowrap ml-2"
            >
              {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Notice Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'ar' ? 'نوع المستجد أو الإعلان' : 'Type de publication'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'municipal', labelAr: 'بلدي / جماعي', labelFr: 'Municipal', icon: Building, color: 'text-sky-600 dark:text-sky-400' },
                { id: 'pharmacy_duty', labelAr: 'صيدلية حراسة', labelFr: 'Pharmacie', icon: AlertTriangle, color: 'text-emerald-600 dark:text-emerald-400' },
                { id: 'utility', labelAr: 'ماء وكهرباء', labelFr: 'Services d\'eau', icon: Droplets, color: 'text-blue-600 dark:text-blue-400' },
                { id: 'transport', labelAr: 'نقل ومواصلات', labelFr: 'Transport', icon: Car, color: 'text-purple-600 dark:text-purple-400' }
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = type === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setType(cat.id as NoticeItem['type'])}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold gap-1 transition-all ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:border-sky-500 text-sky-900 dark:text-sky-200 ring-2 ring-sky-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                    <span>{language === 'ar' ? cat.labelAr : cat.labelFr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Urgent Checkbox */}
          <div className="flex items-center gap-2 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 p-3 rounded-xl">
            <input
              id="notice-urgent-check"
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
            />
            <label htmlFor="notice-urgent-check" className="text-xs font-bold text-amber-900 dark:text-amber-200 cursor-pointer">
              {language === 'ar' ? 'تمييز كإعلان عاجل وهام (تنبيه فوري)' : 'Marquer comme avis urgent et important'}
            </label>
          </div>

          {/* Title Inputs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'عنوان المستجد (بالعربية) *' : 'Titre en arabe *'}
            </label>
            <input
              type="text"
              required
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: صيدلية الحراسة للأسبوع الجاري أو بلاغ جماعي حول...' : 'Ex: Avis municipal important...'}
              dir="rtl"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'عنوان المستجد (بالفرنسية - اختياري)' : 'Titre en français (optionnel)'}
            </label>
            <input
              type="text"
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              placeholder="Ex: Pharmacie de garde ou Communiqué communal..."
              dir="ltr"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Content Inputs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'نص وتفاصيل المستجد (بالعربية) *' : 'Texte de l\'actualité (arabe) *'}
            </label>
            <textarea
              required
              rows={3}
              value={contentAr}
              onChange={(e) => setContentAr(e.target.value)}
              placeholder={language === 'ar' ? 'اكتب تفاصيل الإعلان، الأوقات، المواقع أو التعليمات الخاصة بالساكنة...' : 'Détails du communiqué...'}
              dir="rtl"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'نص وتفاصيل المستجد (بالفرنسية - اختياري)' : 'Texte en français (optionnel)'}
            </label>
            <textarea
              rows={2}
              value={contentFr}
              onChange={(e) => setContentFr(e.target.value)}
              placeholder="Détails du communiqué pour les citoyens..."
              dir="ltr"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Author / Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'الجهة المصدرة (بالعربية)' : 'Organisme émetteur (arabe)'}
              </label>
              <input
                type="text"
                value={authorAr}
                onChange={(e) => setAuthorAr(e.target.value)}
                placeholder="جماعة الدروة"
                dir="rtl"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'الجهة المصدرة (بالفرنسية)' : 'Organisme (français)'}
              </label>
              <input
                type="text"
                value={authorFr}
                onChange={(e) => setAuthorFr(e.target.value)}
                placeholder="Commune de Deroua"
                dir="ltr"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* External Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'رابط خارجي أو وثيقة (اختياري)' : 'Lien ou document externe (optionnel)'}
            </label>
            <div className="relative">
              <ExternalLink className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="url"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="https://..."
                dir="ltr"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'صورة توضيحية أو ملصق الإعلان (اختياري)' : 'Affiche ou image d\'illustration (optionnel)'}
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">
                <ImageIcon className="w-4 h-4 text-sky-600" />
                <span>{language === 'ar' ? 'اختيار صورة من الجهاز' : 'Choisir une image'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
              {imagePreview && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddNoticeModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>
                {isSubmitting 
                  ? (language === 'ar' ? 'جاري النشر...' : 'Publication...') 
                  : (language === 'ar' ? 'نشر المستجد الآن' : 'Publier l\'actualité')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
