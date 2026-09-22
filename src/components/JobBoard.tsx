import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Building, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  Sparkles, 
  PlusCircle, 
  Share2, 
  ChevronDown, 
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { JobOffer, JobType } from '../types.ts';

export const JobBoard: React.FC = () => {
  const { 
    language, 
    jobs, 
    isAdminAuthenticated, 
    setIsAdminModalOpen, 
    showToast 
  } = useApp();

  const [jobSearch, setJobSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [activeJobDetails, setActiveJobDetails] = useState<string | null>(null);

  // Filter only active jobs for visitors (or all if admin)
  const availableJobs = useMemo(() => {
    return jobs.filter(j => {
      // Visibility: visitors only see active jobs
      if (!isAdminAuthenticated && !j.isActive) return false;

      // Search term
      if (jobSearch.trim()) {
        const q = jobSearch.toLowerCase();
        const matchesTitle = (j.title.ar + j.title.fr + j.title.en).toLowerCase().includes(q);
        const matchesCompany = (j.company.ar + j.company.fr + j.company.en).toLowerCase().includes(q);
        const matchesSector = (j.sector.ar + j.sector.fr + j.sector.en).toLowerCase().includes(q);
        const matchesDesc = (j.description.ar + j.description.fr + j.description.en).toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSector && !matchesDesc) return false;
      }

      // Job type filter
      if (selectedType !== 'all' && j.jobType !== selectedType) return false;

      // Neighborhood filter
      if (selectedNeighborhood !== 'all') {
        const nId = j.neighborhood?.ar || '';
        if (!nId.includes(selectedNeighborhood)) return false;
      }

      return true;
    });
  }, [jobs, isAdminAuthenticated, jobSearch, selectedType, selectedNeighborhood]);

  const getJobTypeBadge = (type: JobType) => {
    switch (type) {
      case 'full_time':
        return {
          label: language === 'ar' ? 'دوام كامل (Plein temps)' : (language === 'fr' ? 'Plein temps' : 'Full-time'),
          className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        };
      case 'part_time':
        return {
          label: language === 'ar' ? 'دوام جزئي (Temps partiel)' : (language === 'fr' ? 'Temps partiel' : 'Part-time'),
          className: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800'
        };
      case 'contract':
        return {
          label: language === 'ar' ? 'عقد / بالورش (Contrat / Chantier)' : (language === 'fr' ? 'Contrat / Mission' : 'Contract'),
          className: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        };
      case 'temporary':
        return {
          label: language === 'ar' ? 'عمل موسمي / مؤقت' : (language === 'fr' ? 'Saisonnier / Intérim' : 'Temporary'),
          className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
        };
      case 'internship':
        return {
          label: language === 'ar' ? 'تدريب (Stage)' : (language === 'fr' ? 'Stage' : 'Internship'),
          className: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        };
      default:
        return {
          label: language === 'ar' ? 'وظيفة' : 'Emploi',
          className: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
        };
    }
  };

  const handleShareJob = (job: JobOffer) => {
    const jobTitle = job.title[language] || job.title.ar;
    const company = job.company[language] || job.company.ar;
    const shareText = language === 'ar'
      ? `📢 عرض عمل بمدينة الدروة:\n💼 ${jobTitle}\n🏢 المشغّل: ${company}\n📍 الموقع: ${job.location[language] || job.location.ar}\n📞 هاتف للتواصل: ${job.phone || ''}\n🔗 للمزيد من التفاصيل والتقديم، تفضل بزيارة منصة خدمات الدروة derouaservices.ma`
      : `📢 Offre d'emploi à Deroua:\n💼 ${jobTitle}\n🏢 Entreprise: ${company}\n📍 Lieu: ${job.location[language] || job.location.fr}\n📞 Contact: ${job.phone || ''}\n🔗 Plus de détails sur derouaservices.ma`;

    if (navigator.share) {
      navigator.share({
        title: jobTitle,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
      showToast(language === 'ar' ? 'تم فتح تطبيق واتساب للمشاركة' : 'Partage via WhatsApp');
    }
  };

  return (
    <section className="space-y-4">
      {/* Banner / Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'ar' ? 'فضاء التشغيل والتكوين المحلي' : 'Espace Emploi & Opportunités Locales'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'ar' ? 'عروض وفرص العمل بمدينة الدروة' : 'Offres d\'Emploi & Recrutement à Deroua'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'منصة رسمية وموثوقة لربط شباب وساكنة الدروة مع المشغلين، الشركات، والأنشطة التجارية والحرفية بالمدينة والنواحي.'
                : 'Connecter les chercheurs d\'emploi de Deroua avec les entreprises, commerces et ateliers locaux.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdminAuthenticated ? (
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'ar' ? 'إضافة ونشر عرض جديد (لوحة الإدارة)' : 'Publier une offre'}</span>
              </button>
            ) : (
              <a
                href="mailto:derouaservices@gmail.com?subject=طلب نشر عرض عمل بمدينة الدروة"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all backdrop-blur-xs"
              >
                <Mail className="w-4 h-4 text-indigo-300" />
                <span>{language === 'ar' ? 'أنت مشغّل؟ انشر عرضك مجاناً' : 'Recruteur ? Contactez-nous'}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث عن مهنة، قطاع، شركة، أو كلمة مفتاحية...' : 'Rechercher un poste, métier, entreprise...'}
              className="w-full ps-9 pe-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Job Type Selector */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{language === 'ar' ? 'جميع أنواع العقود' : 'Tous types de contrat'}</option>
              <option value="full_time">{language === 'ar' ? 'دوام كامل (Plein temps)' : 'Plein temps'}</option>
              <option value="part_time">{language === 'ar' ? 'دوام جزئي (Temps partiel)' : 'Temps partiel'}</option>
              <option value="contract">{language === 'ar' ? 'عقد / بالورش (Mission)' : 'Contrat'}</option>
              <option value="temporary">{language === 'ar' ? 'مؤقت / موسمي' : 'Temporaire'}</option>
              <option value="internship">{language === 'ar' ? 'تدريب (Stage)' : 'Stage'}</option>
            </select>
          </div>
        </div>

        {/* Quick Stats & Badges */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              {availableJobs.length}
            </span>
            <span>{language === 'ar' ? 'عروض عمل متوفرة حالياً بالدروة' : 'offres d\'emploi disponibles'}</span>
          </div>

          {(jobSearch || selectedType !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setJobSearch('');
                setSelectedType('all');
                setSelectedNeighborhood('all');
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
            >
              {language === 'ar' ? 'إلغاء الفلترة' : 'Réinitialiser'}
            </button>
          )}
        </div>
      </div>

      {/* Jobs List */}
      {availableJobs.length === 0 ? (
        <div className="py-16 px-4 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {jobs.length === 0
              ? (language === 'ar' ? 'لا توجد عروض عمل منشورة حالياً' : 'Aucune offre d\'emploi publiée actuellement')
              : (language === 'ar' ? 'لا توجد عروض عمل مطابقة لبحثك' : 'Aucune offre ne correspond à votre recherche')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
            {jobs.length === 0
              ? (language === 'ar'
                  ? 'سيتم نشر أحدث عروض وفرص الشغل بمدينة الدروة والمناطق المجاورة فور توفرها من طرف الإدارة والمشغلين.'
                  : 'Les offres d\'emploi locales seront affichées dès leur publication par l\'administration.')
              : (language === 'ar'
                  ? 'يرجى تجربة تغيير معايير البحث أو تصفية الحي ونوع العمل.'
                  : 'Veuillez modifier vos critères de recherche ou réinitialiser les filtres.')}
          </p>
          {isAdminAuthenticated && (
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة عرض عمل جديد من لوحة الإدارة' : 'Publier une offre'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {availableJobs.map((job) => {
            const badge = getJobTypeBadge(job.jobType);
            const isExpanded = activeJobDetails === job.id;

            return (
              <div 
                key={job.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs ${
                  job.featured 
                    ? 'border-indigo-300 dark:border-indigo-800/80 bg-gradient-to-r from-indigo-50/40 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900' 
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.className}`}>
                        {badge.label}
                      </span>
                      {job.featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{language === 'ar' ? 'عرض مميز' : 'En vedette'}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <Tag className="w-3 h-3" />
                        <span>{job.sector[language] || job.sector.ar}</span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {job.title[language] || job.title.ar}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Building className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{job.company[language] || job.company.ar}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{job.location[language] || job.location.ar}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <span>💰</span>
                          <span>{job.salary[language] || job.salary.ar}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions right */}
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => handleShareJob(job)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={language === 'ar' ? 'مشاركة عرض العمل' : 'Partager'}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveJobDetails(prev => prev === job.id ? null : job.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>{isExpanded ? (language === 'ar' ? 'إخفاء التفاصيل' : 'Réduire') : (language === 'ar' ? 'التفاصيل والتقديم' : 'Détails')}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Short preview of description if collapsed */}
                {!isExpanded && (
                  <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description[language] || job.description.ar}
                  </p>
                )}

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4 animate-in fade-in duration-200">
                    {/* Description */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {language === 'ar' ? 'وصف الوظيفة والمهام:' : 'Description du poste :'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {job.description[language] || job.description.ar}
                      </p>
                    </div>

                    {/* Requirements */}
                    {job.requirements && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{language === 'ar' ? 'الشروط والمؤهلات المطلوبة:' : 'Exigences & Profil recherché :'}</span>
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {job.requirements[language] || job.requirements.ar}
                        </p>
                      </div>
                    )}

                    {/* How to Apply */}
                    {job.howToApply && (
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {language === 'ar' ? 'طريقة التقديم: ' : 'Comment postuler : '}
                        </span>
                        {job.howToApply[language] || job.howToApply.ar}
                      </div>
                    )}

                    {/* Contact & Application Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      {job.phone && (
                        <a
                          href={`tel:${job.phone}`}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? `اتصال بالمشغل (${job.phone})` : `Appeler (${job.phone})`}</span>
                        </a>
                      )}

                      {job.whatsapp && (
                        <a
                          href={`https://wa.me/${job.whatsapp}?text=${encodeURIComponent(
                            language === 'ar'
                              ? `السلام عليكم، بخصوص عرض العمل المنشور على موقع خدمات الدروة: "${job.title.ar}"، أود التقديم ومعرفة المزيد من التفاصيل.`
                              : `Bonjour, concernant l'offre d'emploi "${job.title[language] || job.title.fr}" sur derouaservices.ma, je souhaite postuler.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {job.email && (
                        <a
                          href={`mailto:${job.email}?subject=${encodeURIComponent(`Candidature: ${job.title.ar || job.title.fr}`)}`}
                          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{language === 'ar' ? 'إرسال السيرة الذاتية (Email)' : 'Envoyer CV par Email'}</span>
                        </a>
                      )}

                      {job.deadline && (
                        <div className="ms-auto flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? `آخر أجل: ${job.deadline}` : `Date limite: ${job.deadline}`}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
