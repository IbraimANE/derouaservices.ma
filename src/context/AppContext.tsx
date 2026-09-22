import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { onIdTokenChanged, signInWithEmailAndPassword, signOut, getIdTokenResult } from 'firebase/auth';
import { Language, ServiceCategory, ServiceItem, AdvertisementItem } from '../types';
import { INITIAL_SERVICES, APP_TRANSLATIONS } from '../data/derouaData';
import { auth, hasAdminRole, servicesApi, advertisementsApi } from '../lib/firebase';
import { isPublishedService, isPublishedAdvertisement, isCurrentGuardPharmacy } from '../lib/servicePolicy';

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
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
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

function savedValue(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function saveValue(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = savedValue('deroua_lang');
    return saved === 'fr' || saved === 'en' ? saved : 'ar';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    savedValue('deroua_theme') === 'dark' ? 'dark' : 'light');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(savedValue('deroua_favorites') || '[]');
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : [];
    } catch { return []; }
  });
  const [remoteServices, setRemoteServices] = useState<ServiceItem[]>([]);
  const [advertisements, setAdvertisements] = useState<AdvertisementItem[]>([]);
  const [isAdminAuthenticated, setAdminAuthenticated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
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
  const [now, setNow] = useState(Date.now);
  const requestVersion = React.useRef(0);
  const toastTimer = React.useRef<ReturnType<typeof setTimeout>>();
  const msg = (ar: string, fr: string, en: string) => ({ ar, fr, en }[language]);

  const showToast = useCallback((message: string) => {
    clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = setTimeout(() => setToastMessage(null), 6000);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const refreshData = useCallback(async () => {
    const version = ++requestVersion.current;
    setIsSyncing(true);
    try {
      const admin = await hasAdminRole();
      const [servicesResult, adsResult] = await Promise.all([
        servicesApi.getAll(admin), advertisementsApi.getAll(admin)
      ]);
      if (version !== requestVersion.current) return;
      setRemoteServices(servicesResult);
      setAdvertisements(adsResult);
    } catch {
      if (version !== requestVersion.current) return;
      showToast({
        ar: 'تعذر تحديث البيانات. حاول مجددًا عند توفر الاتصال.',
        fr: 'Actualisation impossible. Réessayez lorsque la connexion est disponible.',
        en: 'Could not refresh data. Please try again when connected.'
      }[language]);
    } finally {
      if (version === requestVersion.current) setIsSyncing(false);
    }
  }, [language, showToast]);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const unsubscribe = onIdTokenChanged(auth, async user => {
      const current = ++revision;
      ++requestVersion.current;
      setAdminAuthenticated(false);
      setRemoteServices([]);
      setAdvertisements([]);
      try {
        const admin = !!user && (await getIdTokenResult(user)).claims.admin === true;
        if (!active || current !== revision) return;
        setAdminAuthenticated(admin);
        await refreshData();
      } catch {
        if (active && current === revision) setAdminAuthenticated(false);
      }
    });
    return () => { active = false; ++requestVersion.current; unsubscribe(); };
  }, [refreshData]);

  useEffect(() => {
    // Discard old local moderation flags and cached requests; they never authorize access.
    for (const key of ['deroua_admin_auth', 'deroua_verified_overrides', 'deroua_deleted_services', 'deroua_advertisements_v3']) {
      try { localStorage.removeItem(key); sessionStorage.removeItem(key); } catch { /* Storage may be disabled. */ }
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    saveValue('deroua_lang', language);
  }, [language]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    saveValue('deroua_theme', theme);
  }, [theme]);
  useEffect(() => saveValue('deroua_favorites', JSON.stringify(favorites)), [favorites]);
  useEffect(() => {
    const online = () => { setIsOffline(false); void refreshData(); };
    const offline = () => setIsOffline(true);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
  }, [refreshData]);

  const allRawServices = useMemo(() => {
    const merged = new Map<string, ServiceItem>(
      INITIAL_SERVICES.map(service => [service.id, { ...service, status: 'approved' }])
    );
    remoteServices.forEach(service => merged.set(service.id, service));
    return [...merged.values()];
  }, [remoteServices]);
  const services = useMemo(() => allRawServices.filter(isPublishedService).map(service => ({
    ...service, isGuardPharmacy: isCurrentGuardPharmacy(service, now)
  })), [allRawServices, now]);
  const approvedAdvertisements = useMemo(() => advertisements.filter(isPublishedAdvertisement), [advertisements]);

  const loginAdmin = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if ((await getIdTokenResult(credential.user, true)).claims.admin !== true) {
        await signOut(auth);
        return false;
      }
      return true;
    } catch { return false; }
  };
  const logoutAdmin = async () => {
    try { await signOut(auth); } catch { showToast(msg('تعذر تسجيل الخروج.', 'Déconnexion impossible.', 'Could not sign out.')); }
  };

  const addService = async (service: Omit<ServiceItem, 'id' | 'createdAt'>) => {
    await servicesApi.create(service);
    showToast(msg('تم إرسال النشاط للمراجعة بنجاح.', 'Activité envoyée pour validation.', 'Service submitted for review.'));
    await refreshData();
    return true;
  };
  const adminAction = async (action: () => Promise<void>) => {
    try {
      if (!await hasAdminRole()) throw new Error('Admin required');
      await action();
      await refreshData();
      showToast(msg('تم حفظ التغيير في قاعدة البيانات.', 'Modification enregistrée.', 'Change saved to the database.'));
    } catch {
      showToast(msg('تعذر حفظ التغيير. تحقق من الصلاحيات والاتصال ثم أعد المحاولة.', 'Échec de la modification. Vérifiez les droits et la connexion.', 'Change failed. Check permissions and connection, then retry.'));
    }
  };
  const remoteAction = async (id: string, action: () => Promise<void>) => {
    if (!remoteServices.some(service => service.id === id)) {
      showToast(msg('هذه خدمة من الدليل الثابت. تُعدّل من مصدر البيانات حتى ترحيلها إلى قاعدة البيانات.', 'Service du catalogue statique : modification dans les données source.', 'This is a static directory entry. Edit its source data until it is migrated.'));
      return;
    }
    await adminAction(action);
  };
  const markAsVerified = (id: string) => remoteAction(id, () => servicesApi.updateVerification(id, true));
  const toggleVerification = (id: string) => remoteAction(id, () =>
    servicesApi.updateVerification(id, !remoteServices.find(service => service.id === id)?.verified));
  const deleteService = (id: string) => remoteAction(id, () => servicesApi.delete(id));
  const approveAdvertisement = (id: string) => adminAction(() => advertisementsApi.updateStatus(id, 'approved'));
  const rejectAdvertisement = (id: string) => adminAction(() => advertisementsApi.updateStatus(id, 'rejected'));
  const toggleAdApproval = (id: string) => adminAction(() => advertisementsApi.updateStatus(id,
    advertisements.find(ad => ad.id === id)?.status === 'approved' ? 'rejected' : 'approved'));
  const deleteAdvertisement = (id: string) => adminAction(() => advertisementsApi.delete(id));
  const addAdvertisement = async (ad: Omit<AdvertisementItem, 'id' | 'createdAt'>, image?: File) => {
    if (!await hasAdminRole()) throw new Error('Admin required');
    const created = await advertisementsApi.create(ad, image);
    if (ad.isApproved === true) await advertisementsApi.updateStatus(created.id, 'approved');
    await refreshData();
  };
  const submitAdInquiry: AppContextType['submitAdInquiry'] = async inquiry => {
    const localized = (text: string) => ({ ar: text, fr: text, en: text });
    await advertisementsApi.create({
      title: localized(inquiry.businessName), subtitle: localized(inquiry.notes || ''),
      description: localized(inquiry.notes || ''), category: inquiry.category,
      phone: inquiry.phone, whatsapp: inquiry.whatsapp, link: inquiry.link,
      applicantName: inquiry.businessName, duration: inquiry.duration, notes: inquiry.notes,
      status: 'pending', isApproved: false
    }, inquiry.imageFile);
    showToast(msg('تم إرسال طلب الإعلان للمراجعة بنجاح.', 'Demande envoyée pour validation.', 'Advertising request submitted for review.'));
  };
  const resetAllFilters = () => {
    setSearchQuery(''); setSelectedCategory('all'); setSelectedNeighborhood('all');
    setOnlyOpenNow(false); setOnlyEmergency(false); setIsFavoritesView(false);
  };

  return <AppContext.Provider value={{
    language, setLanguage, direction: language === 'ar' ? 'rtl' : 'ltr', theme,
    toggleTheme: () => setTheme(value => value === 'dark' ? 'light' : 'dark'),
    t: APP_TRANSLATIONS[language], services, allRawServices, favorites,
    toggleFavorite: id => setFavorites(values => values.includes(id) ? values.filter(value => value !== id) : [...values, id]),
    isFavorite: id => favorites.includes(id), addService, toggleVerification, markAsVerified, deleteService,
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedNeighborhood, setSelectedNeighborhood,
    onlyOpenNow, setOnlyOpenNow, onlyEmergency, setOnlyEmergency, isOffline, isSyncing, refreshData, toastMessage, showToast,
    isAddModalOpen, setIsAddModalOpen, isPrivacyModalOpen, setIsPrivacyModalOpen, isAboutModalOpen, setIsAboutModalOpen,
    isAdminModalOpen, setIsAdminModalOpen, isAdminAuthenticated, loginAdmin, logoutAdmin, advertisements,
    approvedAdvertisements, approveAdvertisement, rejectAdvertisement, toggleAdApproval, deleteAdvertisement,
    addAdvertisement, submitAdInquiry, isAdInquiryModalOpen, setIsAdInquiryModalOpen,
    isFavoritesView, setIsFavoritesView, resetAllFilters
  }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
