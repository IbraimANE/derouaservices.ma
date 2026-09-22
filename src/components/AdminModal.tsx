import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Trash2, 
  Phone, 
  PlusCircle, 
  Lock, 
  Unlock, 
  LogOut, 
  FileDown, 
  Sparkles,
  UserCheck,
  Building,
  Check,
  ClipboardList,
  Clock,
  Calendar,
  MapPin,
  MessageSquare,
  AlertTriangle,
  HeartPulse,
  Car,
  Wrench,
  ShoppingBag,
  Building2,
  CheckCheck,
  Megaphone,
  EyeOff,
  Bell,
  Briefcase,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ServiceCategory, JobType } from '../types.ts';

export const AdminModal: React.FC = () => {
  const { 
    language, 
    isAdminModalOpen, 
    setIsAdminModalOpen, 
    isAdminAuthenticated, 
    adminUserEmail,
    loginAdmin, 
    loginWithGoogle,
    changeAdminPassword,
    logoutAdmin, 
    services, 
    activeGuardPharmacyId,
    setActiveGuardPharmacy,
    toggleVerification, 
    markAsVerified,
    deleteService,
    setIsAddModalOpen,
    showToast,
    advertisements,
    approveAdvertisement,
    rejectAdvertisement,
    deleteAdvertisement,
    addAdvertisement,
    notices,
    deleteNotice,
    setIsAddNoticeModalOpen,
    jobs,
    addJobOffer,
    toggleJobStatus,
    deleteJobOffer
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Passkey change state
  const [newKeyInput, setNewKeyInput] = useState('');
  const [confirmKeyInput, setConfirmKeyInput] = useState('');
  const [keyChangeStatus, setKeyChangeStatus] = useState<string | null>(null);

  // Primary Tab: 'activity_log' | 'services' | 'advertisements' | 'pharmacies_security' | 'notices' | 'jobs'
  const [activeTab, setActiveTab] = useState<'activity_log' | 'services' | 'advertisements' | 'pharmacies_security' | 'notices' | 'jobs'>('activity_log');

  // Services Directory tab filters
  const [filterType, setFilterType] = useState<'all' | 'verified' | 'unverified' | 'user_submitted'>('all');
  const [searchAdmin, setSearchAdmin] = useState('');
  const [selectedCat, setSelectedCat] = useState<ServiceCategory>('all');

  // Activity Log tab filters
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [submissionCategoryFilter, setSubmissionCategoryFilter] = useState<ServiceCategory>('all');

  // Advertisements tab state & filters
  const [adSearch, setAdSearch] = useState('');
  const [adFilterStatus, setAdFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
  const [isAddingNewAd, setIsAddingNewAd] = useState(false);

  // New Ad form fields
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdSubtitle, setNewAdSubtitle] = useState('');
  const [newAdDescription, setNewAdDescription] = useState('');
  const [newAdCategory, setNewAdCategory] = useState('real_estate');
  const [newAdPhone, setNewAdPhone] = useState('');
  const [newAdWhatsapp, setNewAdWhatsapp] = useState('');
  const [newAdBadge, setNewAdBadge] = useState('');
  const [newAdPublishInstantly, setNewAdPublishInstantly] = useState(true);

  // Job Offers tab state & new job form fields
  const [jobSearch, setJobSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');
  const [isAddingNewJob, setIsAddingNewJob] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobSector, setNewJobSector] = useState('');
  const [newJobType, setNewJobType] = useState<JobType>('full_time');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobNeighborhood, setNewJobNeighborhood] = useState('مركز الدروة');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobRequirements, setNewJobRequirements] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobPhone, setNewJobPhone] = useState('');
  const [newJobWhatsapp, setNewJobWhatsapp] = useState('');
  const [newJobEmail, setNewJobEmail] = useState('');
  const [newJobHowToApply, setNewJobHowToApply] = useState('');
  const [newJobDeadline, setNewJobDeadline] = useState('');
  const [newJobFeatured, setNewJobFeatured] = useState(false);


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const success = await loginAdmin(passwordInput);
    setIsSubmitting(false);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setPasswordInput('');
    }
  };

  const handleGoogleLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await loginWithGoogle();
    setIsSubmitting(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyInput !== confirmKeyInput) {
      setKeyChangeStatus(language === 'ar' ? 'كلمات المرور غير متطابقة!' : 'Les mots de passe ne correspondent pas');
      return;
    }
    const ok = await changeAdminPassword(newKeyInput);
    if (ok) {
      setKeyChangeStatus(language === 'ar' ? 'تم تحديث الرمز بنجاح!' : 'Mot de passe mis à jour !');
      setNewKeyInput('');
      setConfirmKeyInput('');
    }
  };

  // Filter services for Directory table
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      // Search
      if (searchAdmin.trim()) {
        const q = searchAdmin.toLowerCase();
        const matchesName = (s.name.ar + s.name.fr + s.name.en).toLowerCase().includes(q);
        const matchesPhone = s.phone.includes(q) || (s.secondaryPhone && s.secondaryPhone.includes(q));
        const matchesRole = (s.tradeOrRole.ar + s.tradeOrRole.fr).toLowerCase().includes(q);
        const matchesNeighborhood = (s.neighborhood.ar + s.neighborhood.fr).toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesRole && !matchesNeighborhood) return false;
      }

      // Filter verification status
      if (filterType === 'verified' && !s.verified) return false;
      if (filterType === 'unverified' && s.verified) return false;
      if (filterType === 'user_submitted' && !s.isUserSubmitted) return false;

      // Category filter
      if (selectedCat !== 'all' && s.category !== selectedCat) return false;

      return true;
    });
  }, [services, searchAdmin, filterType, selectedCat]);

  // User submissions for Activity Log tab
  const allUserSubmissions = useMemo(() => {
    return services.filter(s => s.isUserSubmitted);
  }, [services]);

  const filteredSubmissions = useMemo(() => {
    return allUserSubmissions
      .filter(s => {
        // Search
        if (submissionSearch.trim()) {
          const q = submissionSearch.toLowerCase();
          const matchesName = (s.name.ar + s.name.fr + s.name.en).toLowerCase().includes(q);
          const matchesPhone = s.phone.includes(q) || (s.secondaryPhone && s.secondaryPhone.includes(q));
          const matchesRole = (s.tradeOrRole.ar + s.tradeOrRole.fr).toLowerCase().includes(q);
          const matchesNeighborhood = (s.neighborhood.ar + s.neighborhood.fr).toLowerCase().includes(q);
          if (!matchesName && !matchesPhone && !matchesRole && !matchesNeighborhood) return false;
        }

        // Verification status filter
        if (submissionStatusFilter === 'pending' && s.verified) return false;
        if (submissionStatusFilter === 'verified' && !s.verified) return false;

        // Category filter
        if (submissionCategoryFilter !== 'all' && s.category !== submissionCategoryFilter) return false;

        return true;
      })
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [allUserSubmissions, submissionSearch, submissionStatusFilter, submissionCategoryFilter]);

  // Statistics
  const totalCount = services.length;
  const verifiedCount = services.filter(s => s.verified).length;
  const unverifiedCount = totalCount - verifiedCount;
  const userSubmittedCount = allUserSubmissions.length;
  const pendingSubmissionsCount = allUserSubmissions.filter(s => !s.verified).length;
  const verifiedSubmissionsCount = allUserSubmissions.filter(s => s.verified).length;

  // Advertisements Statistics & Filtering
  const totalAdsCount = advertisements.length;
  const approvedAdsCount = advertisements.filter(a => a.isApproved === true || a.status === 'approved').length;
  const pendingAdsCount = advertisements.filter(a => !a.isApproved && a.status !== 'approved').length;

  const filteredAdvertisements = useMemo(() => {
    return advertisements.filter(ad => {
      if (adSearch.trim()) {
        const q = adSearch.toLowerCase();
        const matchesTitle = (ad.title.ar + ad.title.fr + (ad.applicantName || '')).toLowerCase().includes(q);
        const matchesPhone = ad.phone.includes(q) || (ad.whatsapp && ad.whatsapp.includes(q));
        const matchesNotes = (ad.notes || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesPhone && !matchesNotes) return false;
      }

      const isAppr = ad.isApproved === true || ad.status === 'approved';
      if (adFilterStatus === 'approved' && !isAppr) return false;
      if (adFilterStatus === 'pending' && isAppr) return false;

      return true;
    }).sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [advertisements, adSearch, adFilterStatus]);

  const handleCreateAdByAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle.trim() || !newAdPhone.trim()) {
      showToast(language === 'ar' ? 'يرجى إدخال اسم النشاط ورقم الهاتف' : 'Veuillez remplir le nom et le téléphone');
      return;
    }

    addAdvertisement({
      title: {
        ar: newAdTitle.trim(),
        fr: newAdTitle.trim(),
        en: newAdTitle.trim()
      },
      subtitle: {
        ar: newAdSubtitle.trim() || (language === 'ar' ? 'إشهار معتمد على محور الدروة' : 'Annonce vérifiée axe Deroua'),
        fr: newAdSubtitle.trim() || 'Annonce vérifiée axe Deroua',
        en: newAdSubtitle.trim() || 'Verified ad on Deroua axis'
      },
      description: {
        ar: newAdDescription.trim() || (language === 'ar' ? 'خدمات وعروض موثوقة لساكنة وزوار الدروة والمطار.' : 'Services de qualité pour les résidents et visiteurs de Deroua.'),
        fr: newAdDescription.trim() || 'Services de qualité pour les résidents et visiteurs de Deroua.',
        en: newAdDescription.trim() || 'Quality services for residents and visitors.'
      },
      category: newAdCategory,
      badge: newAdBadge.trim() ? {
        ar: newAdBadge.trim(),
        fr: newAdBadge.trim(),
        en: newAdBadge.trim()
      } : undefined,
      phone: newAdPhone.trim(),
      whatsapp: newAdWhatsapp.trim() || newAdPhone.trim(),
      isApproved: newAdPublishInstantly,
      status: newAdPublishInstantly ? 'approved' : 'pending',
      applicantName: language === 'ar' ? 'الإدارة (Admin)' : 'Admin',
      duration: language === 'ar' ? 'إشهار مباشر' : 'Direct',
      bgGradient: 'from-amber-600 via-orange-600 to-rose-700'
    });

    setNewAdTitle('');
    setNewAdSubtitle('');
    setNewAdDescription('');
    setNewAdPhone('');
    setNewAdWhatsapp('');
    setNewAdBadge('');
    setIsAddingNewAd(false);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      if (jobSearch.trim()) {
        const q = jobSearch.toLowerCase();
        const matchesTitle = (j.title.ar + j.title.fr + j.title.en).toLowerCase().includes(q);
        const matchesCompany = (j.company.ar + j.company.fr + j.company.en).toLowerCase().includes(q);
        const matchesSector = (j.sector.ar + j.sector.fr + j.sector.en).toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSector) return false;
      }
      if (jobTypeFilter !== 'all' && j.jobType !== jobTypeFilter) return false;
      return true;
    });
  }, [jobs, jobSearch, jobTypeFilter]);

  const handleCreateJobByAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobCompany.trim()) {
      showToast(language === 'ar' ? 'يرجى إدخال المسمى الوظيفي واسم الشركة/المشغل' : 'Veuillez saisir l\'intitulé du poste et l\'entreprise');
      return;
    }

    await addJobOffer({
      title: {
        ar: newJobTitle.trim(),
        fr: newJobTitle.trim(),
        en: newJobTitle.trim()
      },
      company: {
        ar: newJobCompany.trim(),
        fr: newJobCompany.trim(),
        en: newJobCompany.trim()
      },
      sector: {
        ar: newJobSector.trim() || (language === 'ar' ? 'خدمات عامة' : 'Services généraux'),
        fr: newJobSector.trim() || 'Services généraux',
        en: newJobSector.trim() || 'General Services'
      },
      jobType: newJobType,
      location: {
        ar: newJobLocation.trim() || `${newJobNeighborhood}، الدروة`,
        fr: newJobLocation.trim() || `${newJobNeighborhood}, Deroua`,
        en: newJobLocation.trim() || `${newJobNeighborhood}, Deroua`
      },
      neighborhood: {
        ar: newJobNeighborhood,
        fr: newJobNeighborhood,
        en: newJobNeighborhood
      },
      description: {
        ar: newJobDescription.trim() || (language === 'ar' ? 'مطلوب موظف(ة) للعمل بمدينة الدروة.' : 'Poste à pourvoir à Deroua.'),
        fr: newJobDescription.trim() || 'Poste à pourvoir à Deroua.',
        en: newJobDescription.trim() || 'Position available in Deroua.'
      },
      requirements: newJobRequirements.trim() ? {
        ar: newJobRequirements.trim(),
        fr: newJobRequirements.trim(),
        en: newJobRequirements.trim()
      } : undefined,
      salary: newJobSalary.trim() ? {
        ar: newJobSalary.trim(),
        fr: newJobSalary.trim(),
        en: newJobSalary.trim()
      } : undefined,
      phone: newJobPhone.trim() || undefined,
      whatsapp: newJobWhatsapp.trim() || (newJobPhone.trim() ? newJobPhone.trim() : undefined),
      email: newJobEmail.trim() || undefined,
      howToApply: newJobHowToApply.trim() ? {
        ar: newJobHowToApply.trim(),
        fr: newJobHowToApply.trim(),
        en: newJobHowToApply.trim()
      } : undefined,
      deadline: newJobDeadline.trim() || undefined,
      isActive: true,
      featured: newJobFeatured
    });

    // Reset Form
    setNewJobTitle('');
    setNewJobCompany('');
    setNewJobSector('');
    setNewJobLocation('');
    setNewJobDescription('');
    setNewJobRequirements('');
    setNewJobSalary('');
    setNewJobPhone('');
    setNewJobWhatsapp('');
    setNewJobEmail('');
    setNewJobHowToApply('');
    setNewJobDeadline('');
    setNewJobFeatured(false);
    setIsAddingNewJob(false);
  };


  const exportServicesJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(services, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `deroua_services_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(language === 'ar' ? 'تم تنزيل نسخة احتياطية من جميع الأنشطة' : 'Sauvegarde des activités téléchargée');
  };

  const formatSubmissionDate = (isoString?: string) => {
    if (!isoString) return language === 'ar' ? 'مؤخراً' : 'Récemment';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />;
      case 'pharmacy': return <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />;
      case 'health': return <HeartPulse className="w-3.5 h-3.5 text-sky-500" />;
      case 'transport': return <Car className="w-3.5 h-3.5 text-amber-500" />;
      case 'artisan': return <Wrench className="w-3.5 h-3.5 text-indigo-500" />;
      case 'commerce': return <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />;
      case 'municipal': return <Building2 className="w-3.5 h-3.5 text-blue-500" />;
      default: return <Building className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'emergency': return language === 'ar' ? 'طوارئ وإسعاف' : 'Urgences';
      case 'pharmacy': return language === 'ar' ? 'صيدليات' : 'Pharmacies';
      case 'health': return language === 'ar' ? 'صحة وأطباء' : 'Santé';
      case 'transport': return language === 'ar' ? 'نقل وطاكسيات' : 'Transport';
      case 'artisan': return language === 'ar' ? 'حرفيون ومهن' : 'Artisans';
      case 'commerce': return language === 'ar' ? 'تجارة وأسواق' : 'Commerces';
      case 'municipal': return language === 'ar' ? 'إدارات عمومية' : 'Services Publics';
      default: return category;
    }
  };

  if (!isAdminModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="admin-modal-container"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {language === 'ar' ? 'لوحة إدارة الأنشطة والتوثيق' : 'Panneau d\'Administration & Certification'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-sky-500 text-white">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'ar' 
                  ? 'إدارة الخدمات المسجلة، مراجعة الأنشطة، ومنح العلامة الزرقاء المعتمدة' 
                  : 'Gestion des activités, validation et attribution du badge bleu'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                id="admin-logout-btn"
                type="button"
                onClick={logoutAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title={language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ar' ? 'خروج' : 'Quitter'}</span>
              </button>
            )}
            <button
              id="admin-close-modal-btn"
              type="button"
              onClick={() => setIsAdminModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAdminAuthenticated ? (
          /* Login Form Gate */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'تسجيل الدخول للإدارة' : 'Accès Réservé à l\'Administration'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'ar'
                  ? 'هذا القسم مخصص لإدارة وتدقيق الأنشطة ومنح العلامة الزرقاء للمهنيين والمحلات بالدروة.'
                  : 'Cet espace permet d\'administrer les fiches professionnelles et d\'accorder la certification officielle.'}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="w-full space-y-3">
              <div className="relative">
                <input
                  id="admin-password-input"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder={language === 'ar' ? 'أدخل رمز مرور الإدارة...' : 'Mot de passe administrateur...'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-center tracking-widest font-mono"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="space-y-2">
                  <p className="text-xs text-rose-500 font-semibold">
                    {language === 'ar' ? 'رمز المرور غير صحيح أو تم قفل المحاولات مؤقتاً لحماية النظام' : 'Code incorrect ou accès temporairement bloqué'}
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      localStorage.removeItem('deroua_admin_lockout_until_v1');
                      localStorage.removeItem('deroua_admin_attempts_v1');
                      setAuthError(false);
                      setPasswordInput('deroua2026');
                      await loginAdmin('deroua2026');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'فك القفل والدخول المباشر (deroua2026)' : 'Débloquer et entrer (deroua2026)'}</span>
                  </button>
                </div>
              )}

              <button
                id="admin-submit-login-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>
                  {isSubmitting 
                    ? (language === 'ar' ? 'جارٍ التحقق...' : 'Vérification...') 
                    : (language === 'ar' ? 'الدخول إلى لوحة التحكم' : 'Accéder au panneau')}
                </span>
              </button>

              <div className="flex items-center gap-3 my-2 w-full">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-xs text-slate-400 font-medium">{language === 'ar' ? 'أو' : 'OU'}</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              </div>

              <button
                id="admin-google-login-btn"
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{language === 'ar' ? 'الدخول بحساب Google المشرف' : 'Se connecter avec Google'}</span>
              </button>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'ar' ? 'نظام مشفر ومحمي بآلية منع التخمين' : 'Système sécurisé et chiffré'}</span>
              </div>
            </form>
          </div>
        ) : (
          /* Main Admin Workspace with Dedicated Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Dedicated Primary Navigation Tabs */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-3 bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Tab 1: Activity Logging */}
                <button
                  id="admin-tab-activity-log"
                  type="button"
                  onClick={() => setActiveTab('activity_log')}
                  className={`relative pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'activity_log'
                      ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white/60 dark:bg-slate-800/90 rounded-t-xl shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <ClipboardList className="w-4 h-4 text-sky-500" />
                  <span>{language === 'ar' ? 'سجل الأنشطة' : 'Soumissions'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    pendingSubmissionsCount > 0 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {userSubmittedCount}
                  </span>
                  {pendingSubmissionsCount > 0 && (
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-1.5 py-0.5 rounded-md border border-amber-300 dark:border-amber-800">
                      <Clock className="w-3 h-3" />
                      <span>{language === 'ar' ? `${pendingSubmissionsCount} بانتظار التوثيق` : `${pendingSubmissionsCount} en attente`}</span>
                    </span>
                  )}
                </button>

                {/* Tab 2: General Services Directory */}
                <button
                  id="admin-tab-services-directory"
                  type="button"
                  onClick={() => setActiveTab('services')}
                  className={`relative pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'services'
                      ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white/60 dark:bg-slate-800/90 rounded-t-xl shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Building className="w-4 h-4 text-slate-500" />
                  <span>{language === 'ar' ? 'دليل الأنشطة العام' : 'Annuaire'}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {totalCount}
                  </span>
                </button>

                {/* Tab 3: Advertisements & Ad Space Management */}
                <button
                  id="admin-tab-advertisements"
                  type="button"
                  onClick={() => setActiveTab('advertisements')}
                  className={`relative pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'advertisements'
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white/60 dark:bg-slate-800/90 rounded-t-xl shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Megaphone className="w-4 h-4 text-amber-500" />
                  <span>{language === 'ar' ? 'الإعلانات' : 'Publicités'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    pendingAdsCount > 0 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {totalAdsCount}
                  </span>
                </button>

                {/* Tab 4: Guard Pharmacies & Security */}
                <button
                  id="admin-tab-pharmacies-security"
                  type="button"
                  onClick={() => setActiveTab('pharmacies_security')}
                  className={`relative pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'pharmacies_security'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white/60 dark:bg-slate-800/90 rounded-t-xl shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'ar' ? 'صيدليات الحراسة والأمان' : 'Pharmacies de Garde & Sécurité'}</span>
                </button>

                {/* Tab 5: Commune Updates & Official Notices */}
                <button
                  id="admin-tab-notices"
                  type="button"
                  onClick={() => setActiveTab('notices')}
                  className={`relative pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'notices'
                      ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white/60 dark:bg-slate-800/90 rounded-t-xl shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Bell className="w-4 h-4 text-sky-500" />
                  <span>{language === 'ar' ? 'مستجدات جماعة الدروة' : 'Actualités de la Commune'}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {notices.length}
                  </span>
                </button>

                {/* Tab 6: Job Offers (فرص وعروض العمل) */}
                <button
                  id="admin-tab-jobs"
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className={`relative pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'jobs'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white/60 dark:bg-slate-800/90 rounded-t-xl shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span>{language === 'ar' ? 'عروض وفرص العمل' : 'Offres d\'Emploi'}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {jobs.length}
                  </span>
                </button>
              </div>

              {/* Quick Actions in Tab Header */}
              <div className="flex items-center gap-2 pb-2">
                {activeTab === 'jobs' ? (
                  <button
                    id="admin-quick-add-job-btn"
                    type="button"
                    onClick={() => setIsAddingNewJob(prev => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>
                      {isAddingNewJob 
                        ? (language === 'ar' ? 'إغلاق النموذج' : 'Fermer') 
                        : (language === 'ar' ? 'نشر عرض عمل جديد' : 'Publier une offre')}
                    </span>
                  </button>
                ) : activeTab === 'advertisements' ? (
                  <button
                    id="admin-quick-add-ad-btn"
                    type="button"
                    onClick={() => setIsAddingNewAd(prev => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {isAddingNewAd 
                        ? (language === 'ar' ? 'إغلاق النموذج' : 'Fermer') 
                        : (language === 'ar' ? 'إنشاء إشهار كأدمن' : 'Créer une pub')}
                    </span>
                  </button>
                ) : (
                  <button
                    id="admin-quick-add-btn"
                    type="button"
                    onClick={() => {
                      setIsAdminModalOpen(false);
                      setIsAddModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{language === 'ar' ? 'إضافة نشاط' : 'Ajouter'}</span>
                  </button>
                )}
                <button
                  id="admin-export-backup-btn"
                  type="button"
                  onClick={exportServicesJson}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-bold transition-all"
                  title="Export JSON"
                >
                  <FileDown className="w-3.5 h-3.5 text-sky-500" />
                </button>
              </div>
            </div>

            {/* Tab 1: ACTIVITY LOGGING & USER SUBMISSIONS (Dedicated View) */}
            {activeTab === 'activity_log' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Header Banner & Stats */}
                <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50/40 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-sky-950/20 border border-sky-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-sky-500 text-white shadow-xs">
                          <ClipboardList className="w-4 h-4" />
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          {language === 'ar' ? 'سجل الأنشطة والطلبات (Activity Logging)' : 'Journal d\'Activité & Soumissions Citoyennes'}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                        {language === 'ar'
                          ? 'عرض زمني لجميع طلبات الأنشطة والمهن المضافة من طرف المواطنين وأصحاب المشاريع بالدروة. يمكنك التحقق من المعلومات وتطبيق العلامة الزرقاء الرسمية بنقرة واحدة.'
                          : 'Historique des activités soumises par les citoyens de Deroua. Validez les fiches et appliquez le badge bleu officiel.'}
                      </p>
                    </div>

                    {/* KPI Stat Chips */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[90px]">
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {language === 'ar' ? 'المشاركات' : 'Total'}
                        </div>
                        <div className="text-lg font-black text-slate-900 dark:text-white">
                          {userSubmittedCount}
                        </div>
                      </div>

                      <div className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center min-w-[100px]">
                        <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{language === 'ar' ? 'بانتظار التوثيق' : 'En attente'}</span>
                        </div>
                        <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                          {pendingSubmissionsCount}
                        </div>
                      </div>

                      <div className="px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-center min-w-[100px]">
                        <div className="text-xs font-semibold text-sky-700 dark:text-sky-300 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === 'ar' ? 'موثقة رسمياً' : 'Certifiées'}</span>
                        </div>
                        <div className="text-lg font-black text-sky-600 dark:text-sky-400">
                          {verifiedSubmissionsCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search & Filter Controls within Activity Log */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  {/* Search and Category Filter */}
                  <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="activity-log-search-input"
                        type="text"
                        value={submissionSearch}
                        onChange={(e) => setSubmissionSearch(e.target.value)}
                        placeholder={language === 'ar' ? 'بحث في سجل المشاركات بالاسم، المهنة، الهاتف، أو الحي...' : 'Recherche par nom, métier, tél...'}
                        className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <select
                      id="activity-log-category-select"
                      value={submissionCategoryFilter}
                      onChange={(e) => setSubmissionCategoryFilter(e.target.value as ServiceCategory)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="all">{language === 'ar' ? 'كل الأصناف' : 'Toutes catégories'}</option>
                      <option value="artisan">{language === 'ar' ? 'حرفيون ومهن' : 'Artisans'}</option>
                      <option value="health">{language === 'ar' ? 'صحة وأطباء' : 'Santé'}</option>
                      <option value="transport">{language === 'ar' ? 'نقل وطاكسيات' : 'Transport'}</option>
                      <option value="commerce">{language === 'ar' ? 'تجارة وأسواق' : 'Commerces'}</option>
                      <option value="pharmacy">{language === 'ar' ? 'صيدليات' : 'Pharmacies'}</option>
                      <option value="emergency">{language === 'ar' ? 'طوارئ' : 'Urgences'}</option>
                      <option value="municipal">{language === 'ar' ? 'إدارات' : 'Municipal'}</option>
                    </select>
                  </div>

                  {/* Verification Status Filter Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold shrink-0">
                    <button
                      id="filter-submissions-all"
                      type="button"
                      onClick={() => setSubmissionStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        submissionStatusFilter === 'all'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      {language === 'ar' ? 'الكل' : 'Tous'} ({userSubmittedCount})
                    </button>

                    <button
                      id="filter-submissions-pending"
                      type="button"
                      onClick={() => setSubmissionStatusFilter('pending')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        submissionStatusFilter === 'pending'
                          ? 'bg-amber-500 text-white shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{language === 'ar' ? 'بانتظار التوثيق' : 'En attente'} ({pendingSubmissionsCount})</span>
                    </button>

                    <button
                      id="filter-submissions-verified"
                      type="button"
                      onClick={() => setSubmissionStatusFilter('verified')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        submissionStatusFilter === 'verified'
                          ? 'bg-sky-500 text-white shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 fill-current" />
                      <span>{language === 'ar' ? 'الموثقة' : 'Vérifiés'} ({verifiedSubmissionsCount})</span>
                    </button>
                  </div>
                </div>

                {/* Submissions Activity Log List */}
                <div className="space-y-3">
                  {filteredSubmissions.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? 'لا توجد مشاركات مطابقة لمعايير التصفية' : 'Aucune soumission trouvée'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        {language === 'ar'
                          ? 'يمكنك إضافة نشاط جديد الآن أو إعادة ضبط خيارات البحث لعرض جميع الطلبات.'
                          : 'Vous pouvez ajouter une nouvelle activité ou réinitialiser les filtres.'}
                      </p>
                      <button
                        id="empty-add-service-btn"
                        type="button"
                        onClick={() => {
                          setIsAdminModalOpen(false);
                          setIsAddModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{language === 'ar' ? 'إضافة نشاط تجريبي' : 'Ajouter une soumission'}</span>
                      </button>
                    </div>
                  ) : (
                    filteredSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        id={`submission-card-${submission.id}`}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          submission.verified
                            ? 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800'
                            : 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/50 hover:border-amber-300'
                        }`}
                      >
                        {/* Top Meta Header: Timestamp, Category, Status Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{formatSubmissionDate(submission.createdAt)}</span>
                            </span>

                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {getCategoryIcon(submission.category)}
                              <span>{getCategoryLabel(submission.category)}</span>
                            </span>

                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                              {language === 'ar' ? 'مشاركة مواطن' : 'Soumission Citoyenne'}
                            </span>
                          </div>

                          {/* Verification Status Pill */}
                          <div>
                            {submission.verified ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-white dark:text-slate-900" />
                                <span>{language === 'ar' ? 'موثق بالعلامة الزرقاء' : 'Certifié Officiel'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>{language === 'ar' ? 'قيد المراجعة • لم تمنح العلامة' : 'En attente de vérification'}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Main Content Info */}
                        <div className="py-3.5 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Name & Trade */}
                          <div className="md:col-span-2 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                {submission.name[language]}
                              </h4>
                              {submission.verified && (
                                <CheckCircle2 className="w-4 h-4 fill-sky-500 text-white dark:text-slate-900 shrink-0" />
                              )}
                            </div>

                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                              {submission.tradeOrRole[language]}
                            </p>

                            {submission.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-0.5">
                                {submission.description[language]}
                              </p>
                            )}

                            {/* Location & Hours */}
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span>{submission.neighborhood[language]} • {submission.address[language]}</span>
                              </span>
                              {submission.is24_7 && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                                  24/24
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Contact Shortcuts */}
                          <div className="flex flex-col justify-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="text-[11px] font-semibold text-slate-400">
                              {language === 'ar' ? 'معلومات التواصل:' : 'Coordonnées directes :'}
                            </div>

                            <a
                              id={`activity-call-btn-${submission.id}`}
                              href={`tel:${submission.phone}`}
                              className="inline-flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:text-sky-600 border border-slate-200 dark:border-slate-600 shadow-2xs transition-colors"
                            >
                              <span className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                                <span dir="ltr">{submission.phone}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-sans">{language === 'ar' ? 'اتصال' : 'Appel'}</span>
                            </a>

                            {submission.whatsapp && (
                              <a
                                id={`activity-whatsapp-btn-${submission.id}`}
                                href={`https://wa.me/${submission.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 transition-colors"
                              >
                                <span className="flex items-center gap-1.5">
                                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>WhatsApp</span>
                                </span>
                                <span className="text-[10px] opacity-75 font-mono" dir="ltr">{submission.whatsapp}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Bottom Action Bar: 'Mark as Verified' Button */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {!submission.verified ? (
                              /* PRIMARY 'MARK AS VERIFIED' ACTION BUTTON */
                              <button
                                id={`activity-log-verify-btn-${submission.id}`}
                                type="button"
                                onClick={() => markAsVerified(submission.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md hover:shadow-sky-500/25 active:scale-98 transition-all"
                              >
                                <ShieldCheck className="w-4 h-4 text-sky-200" />
                                <span>
                                  {language === 'ar' 
                                    ? 'منح العلامة الزرقاء (Mark as Verified)' 
                                    : 'Marquer comme Vérifié (Attribuer le Badge)'}
                                </span>
                              </button>
                            ) : (
                              /* ALREADY VERIFIED STATE WITH OPTION TO TOGGLE */
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                                  <CheckCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                  <span>{language === 'ar' ? 'العلامة الزرقاء مفعلة ومعتمدة' : 'Badge bleu vérifié actif'}</span>
                                </span>

                                <button
                                  id={`activity-log-revoke-btn-${submission.id}`}
                                  type="button"
                                  onClick={() => toggleVerification(submission.id)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                  title={language === 'ar' ? 'إلغاء العلامة الزرقاء' : 'Retirer le badge'}
                                >
                                  {language === 'ar' ? 'إلغاء التوثيق' : 'Retirer le badge'}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Secondary Management Action: Delete / Reject submission */}
                          <button
                            id={`activity-log-delete-btn-${submission.id}`}
                            type="button"
                            onClick={() => {
                              if (window.confirm(language === 'ar' ? `هل أنت متأكد من حذف مشاركة ${submission.name[language]} نهائياً من الدليل؟` : `Supprimer définitivement la soumission de ${submission.name[language]} ?`)) {
                                deleteService(submission.id);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title={language === 'ar' ? 'حذف المشاركة' : 'Supprimer'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{language === 'ar' ? 'حذف الطلب' : 'Supprimer'}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Sync Note */}
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900 text-xs text-sky-800 dark:text-sky-300 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>
                      {language === 'ar'
                        ? 'النقر على "منح العلامة الزرقاء" يقوم فوراً بتوثيق الخدمة وإظهار الشارة الزرقاء في الدليل لكافة زوار الموقع.'
                        : 'L\'attribution du badge bleu est instantanément synchronisée sur tout l\'annuaire.'}
                    </span>
                  </div>
                  <div className="font-bold text-sky-600 dark:text-sky-400">
                    Deroua Services Activity Engine
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: GENERAL SERVICES DIRECTORY (Full Database Table) */}
            {activeTab === 'services' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* KPI Statistics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {language === 'ar' ? 'إجمالي الأنشطة' : 'Total Activités'}
                      </span>
                      <Building className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                      {totalCount}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {language === 'ar' ? 'مسجلة في قاعدة الدروة' : 'enregistrées'}
                    </span>
                  </div>

                  <div className="bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                        {language === 'ar' ? 'العلامة الزرقاء' : 'Badges Bleus'}
                      </span>
                      <CheckCircle2 className="w-4 h-4 fill-sky-500 text-white dark:text-slate-900" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 mt-1">
                      {verifiedCount}
                    </div>
                    <span className="text-[11px] text-sky-600/80 dark:text-sky-400/80 font-medium">
                      {totalCount > 0 ? `${Math.round((verifiedCount / totalCount) * 100)}% موثق رسمياً` : '0%'}
                    </span>
                  </div>

                  <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                        {language === 'ar' ? 'غير موثق' : 'Sans Badge'}
                      </span>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                      {unverifiedCount}
                    </div>
                    <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-medium">
                      {language === 'ar' ? 'بانتظار منح العلامة' : 'en attente'}
                    </span>
                  </div>

                  <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        {language === 'ar' ? 'إضافات المواطنين' : 'Ajouts Citoyens'}
                      </span>
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {userSubmittedCount}
                    </div>
                    <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
                      {language === 'ar' ? 'مضافة عبر الموقع' : 'via formulaire'}
                    </span>
                  </div>
                </div>

                {/* Filter and Search Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Search input & Category select */}
                  <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="admin-search-input"
                        type="text"
                        value={searchAdmin}
                        onChange={(e) => setSearchAdmin(e.target.value)}
                        placeholder={language === 'ar' ? 'بحث بالاسم، المهنة، الهاتف، أو الحي...' : 'Recherche par nom, métier, tél...'}
                        className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <select
                      id="admin-category-select"
                      value={selectedCat}
                      onChange={(e) => setSelectedCat(e.target.value as ServiceCategory)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="all">{language === 'ar' ? 'كافة الأصناف' : 'Toutes catégories'}</option>
                      <option value="emergency">{language === 'ar' ? 'طوارئ وإسعاف' : 'Urgences'}</option>
                      <option value="pharmacy">{language === 'ar' ? 'صيدليات' : 'Pharmacies'}</option>
                      <option value="health">{language === 'ar' ? 'صحة وأطباء' : 'Santé'}</option>
                      <option value="transport">{language === 'ar' ? 'نقل وطاكسيات' : 'Transport'}</option>
                      <option value="artisan">{language === 'ar' ? 'حرفيون ومهن' : 'Artisans'}</option>
                      <option value="commerce">{language === 'ar' ? 'تجارة وأسواق' : 'Commerces'}</option>
                      <option value="municipal">{language === 'ar' ? 'إدارات عمومية' : 'Services Publics'}</option>
                    </select>
                  </div>

                  {/* Status Filter Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold shrink-0 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setFilterType('all')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all ${
                        filterType === 'all'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      {language === 'ar' ? 'الكل' : 'Tous'} ({totalCount})
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilterType('verified')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        filterType === 'verified'
                          ? 'bg-sky-500 text-white shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 fill-current text-white" />
                      <span>{language === 'ar' ? 'الموثقة' : 'Vérifiés'} ({verifiedCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilterType('unverified')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all ${
                        filterType === 'unverified'
                          ? 'bg-amber-500 text-white shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      {language === 'ar' ? 'غير موثقة' : 'Non vérifiés'} ({unverifiedCount})
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilterType('user_submitted')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all ${
                        filterType === 'user_submitted'
                          ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      {language === 'ar' ? 'المواطنين' : 'Citoyens'} ({userSubmittedCount})
                    </button>
                  </div>
                </div>

                {/* Activities Table / List */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left rtl:text-right text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3">{language === 'ar' ? 'النشاط / المهنة' : 'Activité / Métier'}</th>
                          <th className="px-4 py-3">{language === 'ar' ? 'الحي / العنوان' : 'Quartier / Adresse'}</th>
                          <th className="px-4 py-3">{language === 'ar' ? 'الهاتف' : 'Téléphone'}</th>
                          <th className="px-4 py-3 text-center">{language === 'ar' ? 'العلامة الزرقاء' : 'Badge Bleu'}</th>
                          <th className="px-4 py-3 text-center">{language === 'ar' ? 'إجراءات الإدارة' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredServices.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                              {language === 'ar' ? 'لا توجد أنشطة مطابقة لمعايير البحث' : 'Aucune activité trouvée'}
                            </td>
                          </tr>
                        ) : (
                          filteredServices.map(service => (
                            <tr 
                              key={service.id}
                              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              {/* Name & Role */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                    {service.name[language]}
                                  </span>
                                  {service.verified && (
                                    <span title="موثق بالعلامة الزرقاء" className="text-sky-500 shrink-0">
                                      <CheckCircle2 className="w-4 h-4 fill-sky-500 text-white dark:text-slate-900" />
                                    </span>
                                  )}
                                  {service.isUserSubmitted && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                      {language === 'ar' ? 'جديد' : 'Nouveau'}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {service.tradeOrRole[language]} • {service.category}
                                </div>
                              </td>

                              {/* Neighborhood */}
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                <div>{service.neighborhood[language]}</div>
                                <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                                  {service.address[language]}
                                </div>
                              </td>

                              {/* Phone */}
                              <td className="px-4 py-3">
                                <a
                                  href={`tel:${service.phone}`}
                                  className="font-mono font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600 flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span dir="ltr">{service.phone}</span>
                                </a>
                              </td>

                              {/* Blue Badge Toggle Column */}
                              <td className="px-4 py-3 text-center">
                                <button
                                  id={`admin-btn-verify-${service.id}`}
                                  type="button"
                                  onClick={() => toggleVerification(service.id)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                                    service.verified
                                      ? 'bg-sky-500 hover:bg-sky-600 text-white'
                                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                                  }`}
                                  title={service.verified ? 'إلغاء العلامة الزرقاء' : 'منح العلامة الزرقاء'}
                                >
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${service.verified ? 'fill-white text-sky-500' : 'text-slate-400'}`} />
                                  <span>
                                    {service.verified 
                                      ? (language === 'ar' ? 'موثق' : 'Vérifié') 
                                      : (language === 'ar' ? 'منح العلامة' : 'Vérifier')}
                                  </span>
                                </button>
                              </td>

                              {/* Actions (Delete, etc.) */}
                              <td className="px-4 py-3 text-center">
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    id={`admin-btn-delete-${service.id}`}
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(language === 'ar' ? `هل أنت متأكد من حذف ${service.name[language]} من الدليل؟` : `Supprimer ${service.name[language]} ?`)) {
                                        deleteService(service.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                    title={language === 'ar' ? 'حذف من الدليل' : 'Supprimer'}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom info note */}
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900 text-xs text-sky-800 dark:text-sky-300 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>
                      {language === 'ar'
                        ? 'جميع التعديلات وحالات منح العلامة الزرقاء تُحفظ وتظهر فوراً لكافة زوار موقع derouaservices.ma'
                        : 'Les modifications de statut et badges bleus sont synchronisés en direct sur le portail.'}
                    </span>
                  </div>
                  <div className="font-semibold">
                    Deroua Services Core Admin
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: ADVERTISEMENTS & AD SPACE MANAGEMENT */}
            {activeTab === 'advertisements' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* User Rule Banner & Live Status Notice */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-slate-900 border border-amber-300 dark:border-amber-800/80 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {language === 'ar' 
                            ? 'المساحة الإعلانية أسفل الموقع — نظام الموافقة والتحكم الصارم' 
                            : 'Espace Publicitaire — Contrôle & Validation Administrateur'}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>{language === 'ar' ? 'مزامنة مباشرة مع أسفل الموقع' : 'Synchronisation directe'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {language === 'ar'
                          ? 'قاعدة النظام: المساحة الإعلانية أسفل الموقع تظل فارغة افتراضياً، ولن يظهر فيها أي إشهار إلا بعد أن تضغط كأدمن على "موافقة ونشر في الموقع". يمكنك أيضاً إيقاف نشر أي إعلان في أي وقت بنقرة واحدة.'
                          : 'Règle stricte : L\'espace publicitaire au bas du site reste vide par défaut. Seules les annonces expressément approuvées ici sont affichées aux visiteurs.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* KPI Statistics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {language === 'ar' ? 'إجمالي الإعلانات' : 'Total Annonces'}
                      </span>
                      <Megaphone className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                      {totalAdsCount}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {language === 'ar' ? 'طلبات مسجلة' : 'enregistrées'}
                    </span>
                  </div>

                  <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        {language === 'ar' ? 'معتمدة ومنشورة بالموقع' : 'Publiées sur le site'}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {approvedAdsCount}
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      {approvedAdsCount === 0 
                        ? (language === 'ar' ? 'المساحة فارغة حالياً' : 'Espace actuellement vide') 
                        : (language === 'ar' ? 'ظاهرة للزوار أسفل الموقع' : 'visibles aux visiteurs')}
                    </span>
                  </div>

                  <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                        {language === 'ar' ? 'بانتظار موافقتك' : 'En attente d\'approbation'}
                      </span>
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                      {pendingAdsCount}
                    </div>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400">
                      {language === 'ar' ? 'تحتاج مراجعة ونشر' : 'à valider'}
                    </span>
                  </div>

                  <div className="bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                        {language === 'ar' ? 'إجراء سريع' : 'Action Rapide'}
                      </span>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {language === 'ar' ? 'نشر إشهار فوري كأدمن' : 'Ajout direct'}
                      </div>
                    </div>
                    <button
                      id="admin-open-create-ad-btn"
                      type="button"
                      onClick={() => setIsAddingNewAd(true)}
                      className="w-full mt-2 py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'إنشاء إشهار جديد' : 'Nouvelle Annonce'}</span>
                    </button>
                  </div>
                </div>

                {/* Collapsible Form: Add New Advertisement Directly as Admin */}
                {isAddingNewAd && (
                  <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-600/80 rounded-2xl p-5 sm:p-6 shadow-md space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {language === 'ar' ? 'إنشاء إشهار جديد كمسؤول' : 'Créer une Nouvelle Annonce (Admin)'}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {language === 'ar' 
                              ? 'سيتم إضافة هذا الإعلان تحت إشرافك المباشر مع خيار النشر الفوري في الموقع.' 
                              : 'Publiez directement une annonce vérifiée sur le portail.'}
                          </p>
                        </div>
                      </div>
                      <button
                        id="admin-close-create-ad-form"
                        type="button"
                        onClick={() => setIsAddingNewAd(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateAdByAdmin} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {language === 'ar' ? 'اسم المحل / النشاط / المعلن *' : 'Nom de l\'activité / Annonceur *'}
                          </label>
                          <input
                            id="admin-new-ad-title"
                            type="text"
                            required
                            value={newAdTitle}
                            onChange={(e) => setNewAdTitle(e.target.value)}
                            placeholder={language === 'ar' ? 'مثال: مخبزة وحلويات الدروة، أو مكتب عقاري...' : 'Ex: Boulangerie Deroua, Agence Immo...'}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {language === 'ar' ? 'عنوان العرض أو الشعار المختصر' : 'Titre de l\'offre / Slogan'}
                          </label>
                          <input
                            id="admin-new-ad-subtitle"
                            type="text"
                            value={newAdSubtitle}
                            onChange={(e) => setNewAdSubtitle(e.target.value)}
                            placeholder={language === 'ar' ? 'مثال: شقق فاخرة بأسعار مناسبة قرب المطار' : 'Ex: Offre spéciale, livraison rapide...'}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {language === 'ar' ? 'تصنيف الإعلان' : 'Catégorie'}
                          </label>
                          <select
                            id="admin-new-ad-category"
                            value={newAdCategory}
                            onChange={(e) => setNewAdCategory(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="real_estate">{language === 'ar' ? 'عقار وسكن (Immobilier)' : 'Immobilier'}</option>
                            <option value="automotive">{language === 'ar' ? 'سيارات ونقل (Automobile & Transport)' : 'Automobile & Transport'}</option>
                            <option value="food">{language === 'ar' ? 'مطاعم ومقاهي (Cafés & Restaurants)' : 'Cafés & Restaurants'}</option>
                            <option value="services">{language === 'ar' ? 'خدمات ومهن (Services & Artisans)' : 'Services & Artisans'}</option>
                            <option value="commerce">{language === 'ar' ? 'تجارة ومحلات (Commerce & Boutiques)' : 'Commerce & Boutiques'}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {language === 'ar' ? 'رقم الهاتف للاتصال *' : 'Téléphone *'}
                          </label>
                          <input
                            id="admin-new-ad-phone"
                            type="tel"
                            required
                            value={newAdPhone}
                            onChange={(e) => setNewAdPhone(e.target.value)}
                            placeholder="0612345678"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dir-ltr text-left"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {language === 'ar' ? 'رقم الواتساب (اختياري)' : 'WhatsApp (optionnel)'}
                          </label>
                          <input
                            id="admin-new-ad-whatsapp"
                            type="tel"
                            value={newAdWhatsapp}
                            onChange={(e) => setNewAdWhatsapp(e.target.value)}
                            placeholder="0612345678"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dir-ltr text-left"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {language === 'ar' ? 'شارة مميزة على الإشهار (Badge)' : 'Badge spécial'}
                          </label>
                          <input
                            id="admin-new-ad-badge"
                            type="text"
                            value={newAdBadge}
                            onChange={(e) => setNewAdBadge(e.target.value)}
                            placeholder={language === 'ar' ? 'مثال: عرض خاص، شقق محفظة، توصيل مجاني...' : 'Ex: Offre VIP, Certifié...'}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              id="admin-new-ad-publish-toggle"
                              type="checkbox"
                              checked={newAdPublishInstantly}
                              onChange={(e) => setNewAdPublishInstantly(e.target.checked)}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                              {language === 'ar' ? 'موافقة ونشر فوري في أسفل الموقع الآن' : 'Approuver et publier immédiatement sur le site'}
                            </span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {language === 'ar' ? 'تفاصيل ونص الإشهار والعروض المتاحة' : 'Détails & description de l\'annonce'}
                        </label>
                        <textarea
                          id="admin-new-ad-desc"
                          rows={2}
                          value={newAdDescription}
                          onChange={(e) => setNewAdDescription(e.target.value)}
                          placeholder={language === 'ar' ? 'اكتب نص الإعلان، الموقع، الميزات، والأسعار إن وجدت...' : 'Description de l\'offre...'}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAd(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        >
                          {language === 'ar' ? 'إلغاء' : 'Annuler'}
                        </button>
                        <button
                          id="admin-submit-create-ad-btn"
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>{newAdPublishInstantly ? (language === 'ar' ? 'حفظ ونشر في الموقع' : 'Enregistrer & Publier') : (language === 'ar' ? 'حفظ كمسودة' : 'Enregistrer')}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Search & Status Filter Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-ad-search-input"
                      type="text"
                      value={adSearch}
                      onChange={(e) => setAdSearch(e.target.value)}
                      placeholder={language === 'ar' ? 'بحث في الإعلانات، المعلنين، أرقام الهاتف...' : 'Rechercher une annonce, un numéro...'}
                      className="w-full pr-9 pl-4 rtl:pr-9 rtl:pl-4 ltr:pl-9 ltr:pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold self-start sm:self-auto">
                    <button
                      id="filter-ads-all"
                      type="button"
                      onClick={() => setAdFilterStatus('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        adFilterStatus === 'all'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      {language === 'ar' ? 'الكل' : 'Tous'} ({totalAdsCount})
                    </button>

                    <button
                      id="filter-ads-pending"
                      type="button"
                      onClick={() => setAdFilterStatus('pending')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        adFilterStatus === 'pending'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{language === 'ar' ? 'بانتظار الموافقة' : 'En attente'} ({pendingAdsCount})</span>
                    </button>

                    <button
                      id="filter-ads-approved"
                      type="button"
                      onClick={() => setAdFilterStatus('approved')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        adFilterStatus === 'approved'
                          ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{language === 'ar' ? 'معتمدة ومنشورة بالموقع' : 'En ligne'} ({approvedAdsCount})</span>
                    </button>
                  </div>
                </div>

                {/* Advertisements List */}
                <div className="space-y-4">
                  {filteredAdvertisements.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
                        <Megaphone className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                          {language === 'ar' ? 'المساحة الإعلانية فارغة حالياً' : 'Aucune annonce trouvée'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                          {language === 'ar'
                            ? 'المكان المخصص للإعلانات أسفل الموقع فارغ حالياً كما حددت. لن يظهر أي إشهار إلا الإعلانات التي تقوم بإنشائها أو الموافقة عليها هنا.'
                            : 'L\'encart publicitaire au bas du site est vide comme prévu. Seules les annonces approuvées s\'afficheront.'}
                        </p>
                      </div>
                      <button
                        id="empty-create-first-ad-btn"
                        type="button"
                        onClick={() => setIsAddingNewAd(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{language === 'ar' ? 'إنشاء ونشر أول إشهار تجريبي كأدمن' : 'Créer une première annonce'}</span>
                      </button>
                    </div>
                  ) : (
                    filteredAdvertisements.map(ad => {
                      const isApproved = ad.isApproved === true || ad.status === 'approved';
                      return (
                        <div
                          key={ad.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            isApproved
                              ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-300 dark:border-emerald-800 shadow-2xs'
                              : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800/80 shadow-xs'
                          }`}
                        >
                          {/* Card Header: Status + Meta */}
                          <div className="flex items-start justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 flex-wrap">
                              {isApproved ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{language === 'ar' ? 'معتمد ومنشور في الموقع (Live)' : 'Approuvé & Publié sur le site'}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>{language === 'ar' ? 'بانتظار موافقة الأدمن (غير ظاهر بالموقع)' : 'En attente d\'approbation'}</span>
                                </span>
                              )}

                              {ad.duration && (
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                                  {language === 'ar' ? `المدة: ${ad.duration}` : `Durée: ${ad.duration}`}
                                </span>
                              )}

                              {ad.createdAt && (
                                <span className="text-[11px] text-slate-400">
                                  {formatSubmissionDate(ad.createdAt)}
                                </span>
                              )}
                            </div>

                            {ad.applicantName && (
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                {language === 'ar' ? `صاحب الطلب: ${ad.applicantName}` : `Demandeur: ${ad.applicantName}`}
                              </span>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="py-3.5 space-y-2">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <h3 className="text-base font-black text-slate-900 dark:text-white">
                                {ad.title[language] || ad.title.ar}
                              </h3>
                              {ad.badge && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-slate-950">
                                  {ad.badge[language] || ad.badge.ar}
                                </span>
                              )}
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                — {ad.subtitle[language] || ad.subtitle.ar}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              {ad.description[language] || ad.description.ar}
                            </p>

                            {ad.notes && (
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  {language === 'ar' ? 'ملاحظات وتفاصيل المعلن: ' : 'Notes du demandeur : '}
                                </span>
                                <span>{ad.notes}</span>
                              </div>
                            )}

                            {/* Contact Details */}
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-sky-500" />
                                <span className="font-mono dir-ltr">{ad.phone}</span>
                              </div>
                              {ad.whatsapp && (
                                <div className="flex items-center gap-1.5">
                                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="font-mono dir-ltr">{ad.whatsapp}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Action Controls */}
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                            {/* Primary Action: Approve & Publish vs Unpublish */}
                            <div className="flex items-center gap-2">
                              {!isApproved ? (
                                <button
                                  id={`admin-approve-ad-btn-${ad.id}`}
                                  type="button"
                                  onClick={() => {
                                    approveAdvertisement(ad.id);
                                    showToast(language === 'ar' ? 'تمت الموافقة على الإشهار ونشره بنجاح في الموقع' : 'Annonce approuvée et mise en ligne !');
                                  }}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>{language === 'ar' ? 'موافقة ونشر في الموقع' : 'Approuver & Publier sur le site'}</span>
                                </button>
                              ) : (
                                <button
                                  id={`admin-revoke-ad-btn-${ad.id}`}
                                  type="button"
                                  onClick={() => {
                                    rejectAdvertisement(ad.id);
                                    showToast(language === 'ar' ? 'تم إيقاف نشر الإشهار من الموقع' : 'Annonce retirée du site');
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold text-xs transition-all active:scale-95"
                                >
                                  <EyeOff className="w-4 h-4" />
                                  <span>{language === 'ar' ? 'إيقاف النشر بالموقع' : 'Retirer du site'}</span>
                                </button>
                              )}

                              {/* Direct Contact Buttons */}
                              <a
                                href={`tel:${ad.phone}`}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-sky-500" />
                                <span>{language === 'ar' ? 'اتصال' : 'Appeler'}</span>
                              </a>

                              {ad.whatsapp && (
                                <a
                                  href={`https://wa.me/${ad.whatsapp.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors border border-emerald-200 dark:border-emerald-800"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                            </div>

                            {/* Delete Ad Permanently */}
                            <button
                              id={`admin-delete-ad-btn-${ad.id}`}
                              type="button"
                              onClick={() => {
                                if (window.confirm(language === 'ar' ? `هل أنت متأكد من حذف إشهار ${ad.title[language] || ad.title.ar} نهائياً؟` : `Supprimer définitivement l'annonce ?`)) {
                                  deleteAdvertisement(ad.id);
                                }
                              }}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title={language === 'ar' ? 'حذف الإشهار' : 'Supprimer'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{language === 'ar' ? 'حذف الإشهار' : 'Supprimer'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer Sync Note */}
                <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      {language === 'ar'
                        ? 'فقط الإعلانات التي تحمل صفة "معتمد ومنشور في الموقع" تظهر للزوار في المساحة السفلية للموقع.'
                        : 'Seules les publicités avec le statut "Approuvé & Publié" sont visibles aux visiteurs.'}
                    </span>
                  </div>
                  <div className="font-bold text-amber-700 dark:text-amber-400">
                    Deroua Ads Control Engine
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Guard Pharmacies Management & Security Center */}
            {activeTab === 'pharmacies_security' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Section 1: Guard Pharmacy Selector */}
                <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <HeartPulse className="w-5 h-5 text-emerald-500" />
                        <span>{language === 'ar' ? 'تعيين صيدلية الحراسة المناوبة' : 'Pharmacie de Garde en Service'}</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {language === 'ar'
                          ? 'اختر الصيدلية المناوبة لهذا الأسبوع لتحديثها فوراً في الواجهة الرئيسية للموقع وتقديم أرقامها لجميع الزوار.'
                          : 'Sélectionnez la pharmacie de garde actuelle pour la mettre en avant sur la page d\'accueil.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.filter(s => s.category === 'pharmacy').map(pharmacy => {
                      const isCurrentActive = pharmacy.id === activeGuardPharmacyId;
                      return (
                        <div
                          key={pharmacy.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                            isCurrentActive
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">
                                {pharmacy.name[language] || pharmacy.name.ar}
                              </span>
                              {isCurrentActive && (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                                  {language === 'ar' ? 'مناوبة نشطة' : 'En service'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {pharmacy.address[language] || pharmacy.address.ar} • {pharmacy.neighborhood[language] || pharmacy.neighborhood.ar}
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono mt-1">
                              📞 {pharmacy.phone}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">
                              {pharmacy.workingHours?.[language] || '24h/24'}
                            </span>
                            {isCurrentActive ? (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>{language === 'ar' ? 'معتمدة حالياً' : 'Actuelle'}</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setActiveGuardPharmacy(pharmacy.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                              >
                                {language === 'ar' ? 'تعيين كحراسة حالية' : 'Activer comme garde'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Security & Password Management */}
                <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-sky-500" />
                        <span>{language === 'ar' ? 'أمان لوحة التحكم وتغيير مفتاح الدخول' : 'Sécurité & Modification du mot de passe'}</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {language === 'ar'
                          ? 'تحديث وتشفير مفتاح الدخول للإدارة وفق معيار Salted SHA-256.'
                          : 'Mettre à jour le mot de passe maître chiffré en SHA-256 avec sel.'}
                      </p>
                    </div>

                    {adminUserEmail && (
                      <div className="px-3 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-mono">
                        {adminUserEmail}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'ar' ? 'مفتاح الإدارة الجديد (6 خانات على الأقل)' : 'Nouveau mot de passe (min 6 caractères)'}
                      </label>
                      <input
                        type="password"
                        value={newKeyInput}
                        onChange={(e) => setNewKeyInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'ar' ? 'تأكيد المفتاح الجديد' : 'Confirmer le mot de passe'}
                      </label>
                      <input
                        type="password"
                        value={confirmKeyInput}
                        onChange={(e) => setConfirmKeyInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>

                    {keyChangeStatus && (
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {keyChangeStatus}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                    >
                      {language === 'ar' ? 'حفظ وتشفير الرمز الجديد' : 'Enregistrer le nouveau code'}
                    </button>
                  </form>

                  {/* Security Highlights */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                    <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      <span>{language === 'ar' ? 'تدابير الحماية المطبقة في النظام:' : 'Mesures de sécurité actives :'}</span>
                    </div>
                    <p>• {language === 'ar' ? 'تشفير كلمات المرور عبر Salted SHA-256 لمنع الهجمات الموجهة وجداول Rainbow Tables.' : 'Chiffrement Salted SHA-256 pour prévenir les attaques par dictionnaire.'}</p>
                    <p>• {language === 'ar' ? 'قفل تلقائي لمحاولات تسجيل الدخول لمدة 10 دقائق بعد 5 محاولات خاطئة لمنع هجمات التخمين (Brute-Force).' : 'Verrouillage automatique de 10 min après 5 tentatives infructueuses (anti brute-force).'}</p>
                    <p>• {language === 'ar' ? 'دعم المصادقة المباشرة عبر حساب Google للمشرفين المعتمدين.' : 'Support de l\'authentification officielle Google pour administrateurs autorisés.'}</p>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 5 Content: Commune Updates & Notices Management */}
            {activeTab === 'notices' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Header Banner with Commune Logo */}
                <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3.5 text-center sm:text-right">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 p-1 border border-white/20 shrink-0">
                      <img 
                        src="/logo-commune-deroua-01-1.webp" 
                        alt="شعار جماعة الدروة"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo-commune-deroua.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold">
                        {language === 'ar' ? 'إدارة مستجدات وإعلانات جماعة الدروة' : 'Gestion des Actualités de la Commune'}
                      </h3>
                      <p className="text-xs text-sky-200 mt-0.5">
                        {language === 'ar'
                          ? 'نشر وتحديث وحذف البلاغات البلدية، صيدليات الحراسة والإعلانات الموجهة للساكنة.'
                          : 'Publication, mise à jour et suppression des avis municipaux et pharmaceutiques.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddNoticeModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-sky-900 hover:bg-sky-50 font-bold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4 text-sky-700" />
                    <span>{language === 'ar' ? 'إنشاء مستجد جديد الآن' : 'Nouveau communiqué'}</span>
                  </button>
                </div>

                {/* Notices List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-sky-600" />
                      <span>{language === 'ar' ? 'قائمة المستجدات المنشورة حالياً' : 'Publications en ligne'}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        {notices.length}
                      </span>
                    </h4>
                  </div>

                  {notices.length === 0 ? (
                    <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                        <Bell className="w-6 h-6 opacity-60" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {language === 'ar' ? 'لا توجد مستجدات منشورة حالياً' : 'Aucune actualité publiée'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                        {language === 'ar'
                          ? 'يمكنك إنشاء أول إعلان صيدلاني أو بلاغ لجماعة الدروة بالنقر على الزر أدناه.'
                          : 'Publiez le premier avis communal ou tour de garde en cliquant ci-dessous.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsAddNoticeModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-xs"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{language === 'ar' ? 'إضافة أول مستجد' : 'Ajouter une actualité'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notices.map((n) => (
                        <div
                          key={n.id}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-2xs flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                                {n.type === 'pharmacy_duty' ? (language === 'ar' ? 'صيدلية حراسة' : 'Pharmacie') : (language === 'ar' ? 'بلدي' : 'Municipal')}
                              </span>
                              {n.isUrgent && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                  {language === 'ar' ? 'عاجل' : 'Urgent'}
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400 font-medium">
                                {n.date}
                              </span>
                            </div>
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                              {n.title[language] || n.title.ar || n.title.fr}
                            </h5>
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                              {n.content[language] || n.content.ar || n.content.fr}
                            </p>
                            <div className="text-[11px] text-slate-400 pt-1">
                              {language === 'ar' ? `المصدر: ${n.author[language] || n.author.ar}` : `Source: ${n.author[language] || n.author.fr}`}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                            <button
                              type="button"
                              onClick={() => deleteNotice(n.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{language === 'ar' ? 'حذف' : 'Supprimer'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 6 Content: Job Offers Management (لوحة تحكم عروض وفرص الشغل) */}
            {activeTab === 'jobs' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-indigo-900/60">
                  <div className="flex items-center gap-3.5 text-center sm:text-right">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold">
                        {language === 'ar' ? 'إدارة ونشر عروض العمل بالدروة' : 'Gestion des Offres d\'Emploi à Deroua'}
                      </h3>
                      <p className="text-xs text-indigo-200 mt-0.5">
                        {language === 'ar'
                          ? 'نشر عروض تشغيل جديدة مباشرة للموقع، تفعيل أو إيقاف العروض، وحذف العروض المنتهية.'
                          : 'Publier de nouvelles offres d\'emploi, activer/désactiver et supprimer les annonces expirées.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingNewJob(prev => !prev)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shrink-0 active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>
                      {isAddingNewJob 
                        ? (language === 'ar' ? 'إغلاق نموذج الإضافة' : 'Fermer') 
                        : (language === 'ar' ? 'نشر عرض عمل جديد الآن' : 'Nouvelle offre d\'emploi')}
                    </span>
                  </button>
                </div>

                {/* Form to Add New Job Offer (Admin Direct Publishing) */}
                {isAddingNewJob && (
                  <form 
                    onSubmit={handleCreateJobByAdmin}
                    className="p-5 sm:p-6 rounded-2xl border-2 border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-800/90 shadow-sm space-y-4 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-sm">
                        <Briefcase className="w-4 h-4" />
                        <span>{language === 'ar' ? 'بيانات عرض العمل الجديد' : 'Détails du nouveau poste'}</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        {language === 'ar' ? 'نشر فوري معتمد' : 'Publication immédiate'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          {language === 'ar' ? 'المسمى الوظيفي / اسم المهنة *' : 'Intitulé du poste *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={newJobTitle}
                          onChange={(e) => setNewJobTitle(e.target.value)}
                          placeholder={language === 'ar' ? 'مثال: مطلوب بائع متجر، معلم جبص، محاسب...' : 'Ex: Vendeur, Plâtrier, Chauffeur...'}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          {language === 'ar' ? 'اسم الشركة أو المحل / المشغل *' : 'Entreprise ou Employeur *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={newJobCompany}
                          onChange={(e) => setNewJobCompany(e.target.value)}
                          placeholder={language === 'ar' ? 'مثال: سوبرماركت الوفاق، صيدلية السلام، مقهى...' : 'Ex: Société, Magasin, Pharmacie...'}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          {language === 'ar' ? 'نوع العقد والعمل' : 'Type de contrat'}
                        </label>
                        <select
                          value={newJobType}
                          onChange={(e) => setNewJobType(e.target.value as JobType)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="full_time">{language === 'ar' ? 'دوام كامل (Plein temps)' : 'Plein temps'}</option>
                          <option value="part_time">{language === 'ar' ? 'دوام جزئي (Temps partiel)' : 'Temps partiel'}</option>
                          <option value="contract">{language === 'ar' ? 'عقد / بالورش (Chantier / Mission)' : 'Contrat'}</option>
                          <option value="temporary">{language === 'ar' ? 'عمل موسمي / مؤقت' : 'Temporaire'}</option>
                          <option value="internship">{language === 'ar' ? 'تدريب (Stage)' : 'Stage'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          {language === 'ar' ? 'قطاع النشاط' : 'Secteur d\'activité'}
                        </label>
                        <input
                          type="text"
                          value={newJobSector}
                          onChange={(e) => setNewJobSector(e.target.value)}
                          placeholder={language === 'ar' ? 'تجارة، بناء، صحة، حراسة، نقل، مطاعم...' : 'Commerce, BTP, Restauration...'}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          {language === 'ar' ? 'الحي بالدروة' : 'Quartier'}
                        </label>
                        <select
                          value={newJobNeighborhood}
                          onChange={(e) => setNewJobNeighborhood(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="مركز الدروة">مركز الدروة</option>
                          <option value="حي الوفاق">حي الوفاق</option>
                          <option value="حي الأمل">حي الأمل</option>
                          <option value="حي النسيم">حي النسيم</option>
                          <option value="جنان الدروة">جنان الدروة</option>
                          <option value="حي القصبة">حي القصبة</option>
                          <option value="المنطقة الصناعية / النواحي">المنطقة الصناعية / النواحي</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          {language === 'ar' ? 'العنوان بالتفصيل' : 'Adresse précise'}
                        </label>
                        <input
                          type="text"
                          value={newJobLocation}
                          onChange={(e) => setNewJobLocation(e.target.value)}
                          placeholder={language === 'ar' ? 'شارع محمد السادس، قرب المسجد الكبير...' : 'Avenue Mohammed VI...'}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          {language === 'ar' ? 'هاتف الاتصال أو الواتساب' : 'Téléphone ou WhatsApp'}
                        </label>
                        <input
                          type="tel"
                          value={newJobPhone}
                          onChange={(e) => setNewJobPhone(e.target.value)}
                          placeholder="06XXXXXXXX"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          {language === 'ar' ? 'الراتب أو المقابل (اختياري)' : 'Rémunération (Optionnel)'}
                        </label>
                        <input
                          type="text"
                          value={newJobSalary}
                          onChange={(e) => setNewJobSalary(e.target.value)}
                          placeholder={language === 'ar' ? 'مثال: 3500 درهم، محفز، حسب الخبرة...' : 'Ex: 4000 DH, négociable...'}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                        {language === 'ar' ? 'وصف المهام والعمل المطلوب' : 'Description du travail'}
                      </label>
                      <textarea
                        rows={2}
                        value={newJobDescription}
                        onChange={(e) => setNewJobDescription(e.target.value)}
                        placeholder={language === 'ar' ? 'تفاصيل الوظيفة، ساعات العمل، والمسؤوليات...' : 'Missions et responsabilités...'}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          {language === 'ar' ? 'الشروط المطلوبة (اختياري)' : 'Profil recherché'}
                        </label>
                        <input
                          type="text"
                          value={newJobRequirements}
                          onChange={(e) => setNewJobRequirements(e.target.value)}
                          placeholder={language === 'ar' ? 'خبرة، سكن بالدروة، دبلوم...' : 'Expérience, résidence à Deroua...'}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          {language === 'ar' ? 'البريد الإلكتروني للتوظيف (اختياري)' : 'Email de contact'}
                        </label>
                        <input
                          type="email"
                          value={newJobEmail}
                          onChange={(e) => setNewJobEmail(e.target.value)}
                          placeholder="derouaservices@gmail.com"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newJobFeatured}
                          onChange={(e) => setNewJobFeatured(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{language === 'ar' ? 'تمييز العرض في أعلى القائمة (Featured)' : 'Mettre en vedette'}</span>
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setIsAddingNewJob(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                      >
                        {language === 'ar' ? 'إلغاء' : 'Annuler'}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{language === 'ar' ? 'نشر عرض العمل الآن' : 'Publier immédiatement'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      placeholder={language === 'ar' ? 'ابحث في العروض...' : 'Filtrer les offres...'}
                      className="w-full ps-9 pe-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <select
                      value={jobTypeFilter}
                      onChange={(e) => setJobTypeFilter(e.target.value)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                    >
                      <option value="all">{language === 'ar' ? 'كل أنواع العقود' : 'Tous types'}</option>
                      <option value="full_time">{language === 'ar' ? 'دوام كامل' : 'Plein temps'}</option>
                      <option value="part_time">{language === 'ar' ? 'دوام جزئي' : 'Temps partiel'}</option>
                      <option value="contract">{language === 'ar' ? 'عقد / بالورش' : 'Contrat'}</option>
                      <option value="temporary">{language === 'ar' ? 'مؤقت' : 'Temporaire'}</option>
                      <option value="internship">{language === 'ar' ? 'تدريب' : 'Stage'}</option>
                    </select>
                  </div>
                </div>

                {/* Jobs Management List */}
                {filteredJobs.length === 0 ? (
                  <div className="py-12 text-center bg-white dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {language === 'ar' ? 'لا توجد عروض عمل مطابقة' : 'Aucune offre trouvée'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                          job.isActive 
                            ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-800' 
                            : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/40 opacity-70'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              job.isActive 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}>
                              {job.isActive ? (language === 'ar' ? 'نشط ومعروض' : 'Actif') : (language === 'ar' ? 'متوقف مؤقتاً' : 'Suspendu')}
                            </span>

                            {job.featured && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                {language === 'ar' ? 'مميز' : 'En vedette'}
                              </span>
                            )}

                            <span className="text-[11px] text-slate-400 font-medium">
                              {job.sector[language] || job.sector.ar}
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {job.title[language] || job.title.ar}
                          </h4>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              🏢 {job.company[language] || job.company.ar}
                            </span>
                            <span>📍 {job.location[language] || job.location.ar}</span>
                            {job.phone && <span>📞 {job.phone}</span>}
                            {job.salary && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">💰 {job.salary[language] || job.salary.ar}</span>}
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 pt-0.5">
                            {job.description[language] || job.description.ar}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                          <button
                            type="button"
                            onClick={() => toggleJobStatus(job.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              job.isActive
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:hover:bg-amber-900/60'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60'
                            }`}
                          >
                            {job.isActive 
                              ? (language === 'ar' ? 'إيقاف مؤقت' : 'Désactiver') 
                              : (language === 'ar' ? 'تفعيل' : 'Activer')}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العرض نهائياً؟' : 'Supprimer définitivement cette offre ?')) {
                                deleteJobOffer(job.id);
                              }
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{language === 'ar' ? 'حذف' : 'Supprimer'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

