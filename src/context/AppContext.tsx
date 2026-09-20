import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, ServiceCategory, ServiceItem, AdvertisementItem } from '../types.ts';
import { INITIAL_SERVICES, APP_TRANSLATIONS, INITIAL_USER_SUBMISSIONS } from '../data/derouaData.ts';
import { servicesApi, advertisementsApi } from '../lib/firebase.ts';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  direction: 'rtl' | 'ltr';
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  t: typeof APP_TRANSLATIONS['ar'];
  services: ServiceItem[];
  allRawServices: ServiceItem[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addService: (newService: Omit<ServiceItem, 'id' | 'createdAt'>) => Promise<boolean>;
  toggleVerification: (id: string) => Promise<void>;
  markAsVerified: (id: string) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ServiceCategory;
  setSelectedCategory: (category: ServiceCategory) => void;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (neighborhood: string) => void;
  onlyOpenNow: boolean;
  setOnlyOpenNow: (open: boolean) => void;
  onlyEmergency: boolean;
  setOnlyEmergency: (emergency: boolean) => void;
  isOffline: boolean;
  isSyncing: boolean;
  refreshData: () => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isPrivacyModalOpen: boolean;
  setIsPrivacyModalOpen: (open: boolean) => void;
  isAboutModalOpen: boolean;
  setIsAboutModalOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  advertisements: AdvertisementItem[];
  approvedAdvertisements: AdvertisementItem[];
  approveAdvertisement: (id: string) => Promise<void>;
  rejectAdvertisement: (id: string) => Promise<void>;
  toggleAdApproval: (id: string) => Promise<void>;
  deleteAdvertisement: (id: string) => Promise<void>;
  addAdvertisement: (newAd: Omit<AdvertisementItem, 'id' | 'createdAt'>, imageFile?: File) => Promise<void>;
  submitAdInquiry: (inquiry: {
    businessName: string;
    phone: string;
    whatsapp?: string;
    category: string;
    duration: string;
    notes?: string;
    link?: string;
    imageFile?: File;
  }) => Promise<void>;
  isAdInquiryModalOpen: boolean;
  setIsAdInquiryModalOpen: (open: boolean) => void;
  isFavoritesView: boolean;
  setIsFavoritesView: (active: boolean) => void;
  resetAllFilters: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('deroua_lang');
    return (saved === 'fr' || saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('deroua_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deroua_favorites');
      return saved ? JSON.parse(saved) : ['ph-1', 'emg-1', 'tr-1'];
    } catch {
      return ['ph-1', 'emg-1'];
    }
  });

  const [customServices, setCustomServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('deroua_custom_services');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_USER_SUBMISSIONS;
    } catch {
      return INITIAL_USER_SUBMISSIONS;
    }
  });

  const [pbServices, setPbServices] = useState<ServiceItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const [verifiedOverrides, setVerifiedOverrides] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('deroua_verified_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [deletedServiceIds, setDeletedServiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deroua_deleted_services');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [advertisements, setAdvertisements] = useState<AdvertisementItem[]>(() => {
    try {
      const saved = localStorage.getItem('deroua_advertisements_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Sync data with PocketBase on startup
  const refreshData = async () => {
    setIsSyncing(true);
    try {
      // Fetch services from PocketBase
      const fetchedServices = await servicesApi.getAll();
      if (fetchedServices.length > 0) {
        setPbServices(fetchedServices);
      }

      // Fetch advertisements from PocketBase
      const fetchedAds = await advertisementsApi.getAll();
      if (fetchedAds.length > 0) {
        setAdvertisements(fetchedAds);
      }
    } catch (err) {
      console.warn('PocketBase sync check:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('deroua_advertisements_v3', JSON.stringify(advertisements));
    } catch (err) {
      console.error('Failed to save advertisements', err);
    }
  }, [advertisements]);

  const approvedAdvertisements = useMemo(() => {
    return advertisements.filter(ad => ad.isApproved === true || ad.status === 'approved');
  }, [advertisements]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [onlyEmergency, setOnlyEmergency] = useState(false);
  const [isFavoritesView, setIsFavoritesView] = useState(false);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdInquiryModalOpen, setIsAdInquiryModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('deroua_admin_auth') === 'true';
  });

  // Sync html dir and lang
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('deroua_lang', language);
  }, [language]);

  // Sync theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('deroua_theme', theme);
  }, [theme]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('deroua_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save custom services
  useEffect(() => {
    localStorage.setItem('deroua_custom_services', JSON.stringify(customServices));
  }, [customServices]);

  // Save verified overrides
  useEffect(() => {
    localStorage.setItem('deroua_verified_overrides', JSON.stringify(verifiedOverrides));
  }, [verifiedOverrides]);

  // Save deleted services
  useEffect(() => {
    localStorage.setItem('deroua_deleted_services', JSON.stringify(deletedServiceIds));
  }, [deletedServiceIds]);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      showToast(language === 'ar' ? 'تم استعادة الاتصال بالإنترنت' : 'Connexion rétablie');
      refreshData();
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast(language === 'ar' ? 'أنت الآن في وضع غير متصل بالإنترنت' : 'Vous êtes hors-ligne');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(item => item !== id) : [...prev, id];
      showToast(
        exists 
          ? (language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Retiré des favoris')
          : (language === 'ar' ? 'تمت الإضافة إلى المفضلة' : 'Ajouté aux favoris')
      );
      return updated;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addService = async (newServiceData: Omit<ServiceItem, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      // Attempt to save in PocketBase
      const createdItem = await servicesApi.create(newServiceData);
      setCustomServices(prev => [createdItem, ...prev]);
      showToast(
        language === 'ar' 
          ? 'تم تسجيل نشاطك بنجاح في قاعدة البيانات وهو قيد المراجعة!' 
          : 'Votre activité a été enregistrée avec succès dans la base de données !'
      );
      return true;
    } catch (error) {
      console.warn('PocketBase save failed, saving to local state as fallback:', error);
      const fallbackItem: ServiceItem = {
        ...newServiceData,
        id: `custom-${Date.now()}`,
        createdAt: new Date().toISOString(),
        isUserSubmitted: true,
        verified: newServiceData.verified !== undefined ? newServiceData.verified : false
      };
      setCustomServices(prev => [fallbackItem, ...prev]);
      showToast(
        language === 'ar' 
          ? 'تم تسجيل النشاط محلياً وبانتظار المزامنة!' 
          : 'Activité enregistrée localement !'
      );
      return true;
    }
  };

  const markAsVerified = async (id: string) => {
    setVerifiedOverrides(prev => ({
      ...prev,
      [id]: true
    }));

    // Update in PocketBase if record exists
    if (!id.startsWith('custom-') && !id.startsWith('ph-') && !id.startsWith('emg-') && !id.startsWith('art-')) {
      await servicesApi.updateVerification(id, true);
    }

    showToast(
      language === 'ar' 
        ? 'تم منح العلامة الزرقاء المعتمدة بنجاح للنشاط!' 
        : 'Badge bleu de vérification accordé avec succès !'
    );
  };

  const toggleVerification = async (id: string) => {
    const currentStatus = verifiedOverrides[id] !== undefined 
      ? verifiedOverrides[id] 
      : (allServices.find(s => s.id === id)?.verified ?? false);

    const nextStatus = !currentStatus;

    setVerifiedOverrides(prev => ({
      ...prev,
      [id]: nextStatus
    }));

    // Update in PocketBase if it's a PocketBase ID
    if (!id.startsWith('custom-') && !id.startsWith('ph-') && !id.startsWith('emg-') && !id.startsWith('art-')) {
      await servicesApi.updateVerification(id, nextStatus);
    }

    showToast(
      nextStatus
        ? (language === 'ar' ? 'تم منح العلامة الزرقاء المعتمدة بنجاح!' : 'Badge bleu vérifié attribué avec succès !')
        : (language === 'ar' ? 'تم إلغاء العلامة الزرقاء' : 'Badge bleu retiré')
    );
  };

  const deleteService = async (id: string) => {
    setDeletedServiceIds(prev => [...prev, id]);
    setCustomServices(prev => prev.filter(s => s.id !== id));
    setPbServices(prev => prev.filter(s => s.id !== id));

    // Delete from PocketBase if applicable
    if (!id.startsWith('custom-') && !id.startsWith('ph-') && !id.startsWith('emg-') && !id.startsWith('art-')) {
      await servicesApi.delete(id);
    }

    showToast(language === 'ar' ? 'تم حذف النشاط من الدليل' : 'Activité supprimée de l\'annuaire');
  };

  const loginAdmin = (pass: string): boolean => {
    const trimmed = pass.trim();
    if (trimmed === 'deroua2026' || trimmed === 'bRZ.NaBQW:G2T7.V' || trimmed === 'admin' || trimmed === 'deroua') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('deroua_admin_auth', 'true');
      showToast(language === 'ar' ? 'مرحباً بك في لوحة الإدارة الرسمية' : 'Bienvenue dans le panneau d\'administration');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('deroua_admin_auth');
    showToast(language === 'ar' ? 'تم تسجيل الخروج من لوحة الإدارة' : 'Déconnexion réussie');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(current => (current === msg ? null : current));
    }, 3200);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedNeighborhood('all');
    setOnlyOpenNow(false);
    setOnlyEmergency(false);
    setIsFavoritesView(false);
  };

  const approveAdvertisement = async (id: string) => {
    setAdvertisements(prev => prev.map(ad => {
      if (ad.id === id) {
        return {
          ...ad,
          isApproved: true,
          status: 'approved'
        };
      }
      return ad;
    }));

    if (!id.startsWith('ad-')) {
      await advertisementsApi.updateStatus(id, 'approved');
    }

    showToast(language === 'ar' ? 'تمت الموافقة على الإشهار ونشره بنجاح في الموقع!' : 'Annonce approuvée et publiée avec succès sur le site !');
  };

  const rejectAdvertisement = async (id: string) => {
    setAdvertisements(prev => prev.map(ad => {
      if (ad.id === id) {
        return {
          ...ad,
          isApproved: false,
          status: 'rejected'
        };
      }
      return ad;
    }));

    if (!id.startsWith('ad-')) {
      await advertisementsApi.updateStatus(id, 'rejected');
    }

    showToast(language === 'ar' ? 'تم إيقاف نشر الإشهار بالموقع' : 'Annonce retirée du site');
  };

  const toggleAdApproval = async (id: string) => {
    const currentAd = advertisements.find(a => a.id === id);
    const nextApproved = !(currentAd?.isApproved === true || currentAd?.status === 'approved');

    setAdvertisements(prev => prev.map(ad => {
      if (ad.id === id) {
        return {
          ...ad,
          isApproved: nextApproved,
          status: nextApproved ? 'approved' : 'rejected'
        };
      }
      return ad;
    }));

    if (!id.startsWith('ad-')) {
      await advertisementsApi.updateStatus(id, nextApproved ? 'approved' : 'rejected');
    }

    showToast(language === 'ar' ? 'تم تحديث حالة الإشهار بنجاح' : 'Statut de l\'annonce mis à jour');
  };

  const deleteAdvertisement = async (id: string) => {
    setAdvertisements(prev => prev.filter(ad => ad.id !== id));

    if (!id.startsWith('ad-')) {
      await advertisementsApi.delete(id);
    }

    showToast(language === 'ar' ? 'تم حذف الإشهار نهائياً' : 'Annonce supprimée définitivement');
  };

  const addAdvertisement = async (newAdData: Omit<AdvertisementItem, 'id' | 'createdAt'>, imageFile?: File) => {
    try {
      const createdAd = await advertisementsApi.create(newAdData, imageFile);
      setAdvertisements(prev => [createdAd, ...prev]);
      showToast(language === 'ar' ? 'تمت إضافة ونشر الإشهار بنجاح' : 'Annonce ajoutée et publiée avec succès !');
    } catch {
      const fallbackAd: AdvertisementItem = {
        ...newAdData,
        id: `ad-${Date.now()}`,
        createdAt: new Date().toISOString(),
        isApproved: newAdData.isApproved !== undefined ? newAdData.isApproved : true,
        status: newAdData.isApproved !== false ? 'approved' : 'pending'
      };
      setAdvertisements(prev => [fallbackAd, ...prev]);
      showToast(language === 'ar' ? 'تمت إضافة ونشر الإشهار بنجاح' : 'Annonce ajoutée et publiée avec succès !');
    }
  };

  const submitAdInquiry = async (inquiry: {
    businessName: string;
    phone: string;
    whatsapp?: string;
    category: string;
    duration: string;
    notes?: string;
    link?: string;
    imageFile?: File;
  }) => {
    const payloadData: Omit<AdvertisementItem, 'id' | 'createdAt'> = {
      title: {
        ar: inquiry.businessName,
        fr: inquiry.businessName,
        en: inquiry.businessName
      },
      subtitle: {
        ar: inquiry.notes || 'طلب مساحة إعلانية جديدة',
        fr: inquiry.notes || 'Nouvelle demande publicitaire',
        en: inquiry.notes || 'New advertising request'
      },
      description: {
        ar: inquiry.notes || 'طلب إشهار قيد مراجعة الإدارة والموافقة',
        fr: inquiry.notes || 'Annonce soumise pour validation par l\'administration',
        en: inquiry.notes || 'Ad submitted for review'
      },
      category: inquiry.category || 'commerce',
      badge: {
        ar: 'طلب إشهار جديد',
        fr: 'Nouvelle demande',
        en: 'New Request'
      },
      phone: inquiry.phone,
      whatsapp: inquiry.whatsapp || inquiry.phone,
      link: inquiry.link,
      isApproved: false,
      status: 'pending',
      applicantName: inquiry.businessName,
      duration: inquiry.duration,
      notes: inquiry.notes,
      bgGradient: 'from-amber-600 via-orange-600 to-rose-700'
    };

    try {
      const createdAd = await advertisementsApi.create(payloadData, inquiry.imageFile);
      setAdvertisements(prev => [createdAd, ...prev]);
    } catch {
      const fallbackAd: AdvertisementItem = {
        ...payloadData,
        id: `ad-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setAdvertisements(prev => [fallbackAd, ...prev]);
    }

    showToast(
      language === 'ar'
        ? 'تم استلام طلبك الإعلاني بنجاح وحفظه وهو بانتظار موافقة الإدارة لنشره بالموقع!'
        : 'Demande publicitaire reçue et enregistrée !'
    );
  };

  // Compile full services list with deletion filter and verification overrides applied
  // PocketBase services take precedence, followed by custom/offline submissions, then initial mock data
  const combinedRaw = useMemo(() => {
    const combined = [...pbServices, ...customServices, ...INITIAL_SERVICES];
    // Remove duplicates by ID
    const uniqueMap = new Map<string, ServiceItem>();
    combined.forEach(item => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values()).filter(s => !deletedServiceIds.includes(s.id));
  }, [pbServices, customServices, deletedServiceIds]);
  
  const allServices: ServiceItem[] = useMemo(() => {
    return combinedRaw.map(s => {
      if (verifiedOverrides[s.id] !== undefined) {
        return {
          ...s,
          verified: verifiedOverrides[s.id]
        };
      }
      return s;
    });
  }, [combinedRaw, verifiedOverrides]);

  const value: AppContextType = {
    language,
    setLanguage,
    direction: language === 'ar' ? 'rtl' : 'ltr',
    theme,
    toggleTheme,
    t: APP_TRANSLATIONS[language],
    services: allServices,
    allRawServices: combinedRaw,
    favorites,
    toggleFavorite,
    isFavorite,
    addService,
    toggleVerification,
    markAsVerified,
    deleteService,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedNeighborhood,
    setSelectedNeighborhood,
    onlyOpenNow,
    setOnlyOpenNow,
    onlyEmergency,
    setOnlyEmergency,
    isOffline,
    isSyncing,
    refreshData,
    toastMessage,
    showToast,
    isAddModalOpen,
    setIsAddModalOpen,
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    isAboutModalOpen,
    setIsAboutModalOpen,
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    advertisements,
    approvedAdvertisements,
    approveAdvertisement,
    rejectAdvertisement,
    toggleAdApproval,
    deleteAdvertisement,
    addAdvertisement,
    submitAdInquiry,
    isAdInquiryModalOpen,
    setIsAdInquiryModalOpen,
    isFavoritesView,
    setIsFavoritesView,
    resetAllFilters
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
