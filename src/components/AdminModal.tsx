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
  EyeOff
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ServiceCategory } from '../types.ts';

export const AdminModal: React.FC = () => {
  const { 
    language, 
    isAdminModalOpen, 
    setIsAdminModalOpen, 
    isAdminAuthenticated, 
    loginAdmin, 
    logoutAdmin, 
    services, 
    toggleVerification, 
    markAsVerified,
    deleteService,
    setIsAddModalOpen,
    showToast,
    advertisements,
    approveAdvertisement,
    rejectAdvertisement,
    deleteAdvertisement,
    addAdvertisement
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Primary Tab: 'activity_log' | 'services' | 'advertisements'
  const [activeTab, setActiveTab] = useState<'activity_log' | 'services' | 'advertisements'>('activity_log');

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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setPasswordInput('');
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
                  placeholder={language === 'ar' ? 'أدخل كلمة مرور الإدارة...' : 'Mot de passe administrateur...'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-center tracking-widest font-mono"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-500 font-semibold">
                  {language === 'ar' ? 'كلمة المرور غير صحيحة، يرجى المحاولة ثانية' : 'Mot de passe incorrect'}
                </p>
              )}

              <button
                id="admin-submit-login-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{language === 'ar' ? 'الدخول إلى لوحة التحكم' : 'Accéder au panneau'}</span>
              </button>

              {/* Password hint removed for security as requested */}
            </form>
          </div>
        ) : (
          /* Main Admin Workspace with Dedicated Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Dedicated Primary Navigation Tabs */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-3 bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Tab 1: Activity Logging (Dedicated user submissions tab) */}
                <button
                  id="admin-tab-activity-log"
                  type="button"
                  onClick={() => setActiveTab('activity_log')}
                  className={`relative pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === 'activity_log'
                      ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white/60 dark:bg-slate-800/90 rounded-t-xl shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <ClipboardList className="w-4 h-4 text-sky-500" />
                  <span>{language === 'ar' ? 'سجل الأنشطة والمشاركات' : 'Journal d\'Activité & Soumissions'}</span>
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
                  className={`relative pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === 'services'
                      ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white/60 dark:bg-slate-800/90 rounded-t-xl shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Building className="w-4 h-4 text-slate-500" />
                  <span>{language === 'ar' ? 'دليل الأنشطة العام' : 'Annuaire Général des Services'}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {totalCount}
                  </span>
                </button>

                {/* Tab 3: Advertisements & Ad Space Management */}
                <button
                  id="admin-tab-advertisements"
                  type="button"
                  onClick={() => setActiveTab('advertisements')}
                  className={`relative pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === 'advertisements'
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white/60 dark:bg-slate-800/90 rounded-t-xl shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Megaphone className="w-4 h-4 text-amber-500" />
                  <span>{language === 'ar' ? 'إدارة الإعلانات' : 'Gestion des Publicités'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    pendingAdsCount > 0 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {totalAdsCount}
                  </span>
                  {pendingAdsCount > 0 && (
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-1.5 py-0.5 rounded-md border border-amber-300 dark:border-amber-800">
                      <Clock className="w-3 h-3" />
                      <span>{language === 'ar' ? `${pendingAdsCount} بانتظار الموافقة` : `${pendingAdsCount} en attente`}</span>
                    </span>
                  )}
                </button>
              </div>

              {/* Quick Actions in Tab Header */}
              <div className="flex items-center gap-2 pb-2">
                {activeTab === 'advertisements' ? (
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
          </div>
        )}
      </div>
    </div>
  );
};
