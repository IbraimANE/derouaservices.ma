import React from 'react';
import { X, Shield, Lock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const PrivacyPolicyModal: React.FC = () => {
  const { language, t, isPrivacyModalOpen, setIsPrivacyModalOpen } = useApp();

  if (!isPrivacyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.privacyPolicy}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'موقع خدمات الدروة - حماية بيانات المستخدمين' : 'Site Web Deroua Services - Protection des données'}
              </p>
            </div>
          </div>
          <button
            id="close-privacy-modal-btn"
            type="button"
            onClick={() => setIsPrivacyModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-xl text-sky-900 dark:text-sky-200 flex items-start gap-2">
            <Lock className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-xs mb-0.5">
                {language === 'ar' ? 'التزام الخصوصية والأمان' : 'Engagement de confidentialité et sécurité'}
              </p>
              <p className="text-[11px] opacity-90">
                {language === 'ar'
                  ? 'تم تصميم هذا الموقع الإلكتروني لخدمة ساكنة مدينة الدروة وزوارها. تُرسل بيانات نماذج الخدمات والإعلانات إلى Firebase لمراجعتها وإدارتها. لا تُدرج معلومات حساسة في الوصف أو الملاحظات.'
                  : 'Ce portail web est conçu pour les habitants et usagers de Deroua. Les formulaires sont transmis à Firebase pour modération. N\'incluez pas de données sensibles dans les descriptions.'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? '1. البيانات المخزنة محلياً' : '1. Données stockées localement'}</span>
            </h4>
            <p className="text-xs">
              {language === 'ar'
                ? 'يتم تخزين تفضيلات اللغة، والمظهر الليلي، وقائمة الأرقام المحفوظة في المفضلة داخل متصفحكم. تُرسل الطلبات والأسماء وأرقام التواصل والصور المختارة إلى Firebase، وتُنشر بيانات النشاط أو الإعلان بعد الموافقة. قد يُنشأ حساب تقني مجهول لإرسال الطلبات. يستخدم الموقع Google Fonts وAdSense، وقد تعالج هذه الخدمات بيانات الاتصال وملفات الارتباط وفق إعداداتها. روابط واتساب والخرائط تفتح خدمات خارجية.'
                : 'Les préférences restent dans le navigateur. Les demandes, contacts et images sont transmis à Firebase via un compte technique anonyme si nécessaire. Les informations approuvées sont publiques. Google Fonts et AdSense peuvent traiter des données de connexion et des cookies. WhatsApp et Maps sont des services externes.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? '2. الأذونات والاتصال المباشر' : '2. Permissions & Appels'}</span>
            </h4>
            <p className="text-xs">
              {language === 'ar'
                ? 'عند الضغط على رقم هاتف، يفتح التطبيق برنامج الاتصال الافتراضي في هاتفك دون إجراء أي مكالمة خفية أو تلقائية. لا يطلب التطبيق الوصول إلى جهات اتصالك أو صورك.'
                : 'Les boutons d\'appel déclenchent l\'application téléphone native uniquement avec confirmation de l\'utilisateur. L\'application n\'accède ni à vos contacts ni à vos fichiers privés.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? '3. دقة أرقام الهواتف والخدمات' : '3. Vérification des coordonnées'}</span>
            </h4>
            <p className="text-xs">
              {language === 'ar'
                ? 'تُعرض حراسة الصيدلية فقط عند توفر فترة سارية ومصدر. اتصل بالخدمة للتحقق من المعلومات والمواعيد قبل التوجه، ويمكن طلب تصحيح البيانات عبر إدارة الموقع.'
                : 'Une garde n\'est affichée qu\'avec une période valide et une source. Confirmez les coordonnées et horaires avant de vous déplacer; contactez la gestion du site pour les corriger.'}
            </p>
          </div>

          <div className="pt-2 text-[11px] text-slate-400">
            <span>{language === 'ar' ? 'آخر تحديث: 21 شتنبر 2026 • الدروة، المملكة المغربية' : 'Dernière mise à jour: 21 Septembre 2026 • Deroua, Maroc'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
          <button
            id="understand-privacy-btn"
            type="button"
            onClick={() => setIsPrivacyModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
          >
            {language === 'ar' ? 'فهمت وموافق' : 'Compris'}
          </button>
        </div>
      </div>
    </div>
  );
};
