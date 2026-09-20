import PocketBase, { RecordModel } from 'pocketbase';
import { ServiceItem, AdvertisementItem, ServiceCategory } from '../types.ts';

// Get PocketBase URL from environment variables or use local default
const envUrl = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_POCKETBASE_URL;
export const POCKETBASE_URL = envUrl || 'http://127.0.0.1:8090';

export const pb = new PocketBase(POCKETBASE_URL);

// Disable auto-cancellation for parallel requests
pb.autoCancellation(false);

/**
 * Checks if PocketBase server is reachable
 */
export async function checkPocketBaseHealth(): Promise<boolean> {
  try {
    const health = await pb.health.check();
    return health.code === 200;
  } catch {
    return false;
  }
}

/**
 * Transform PocketBase record to ServiceItem
 */
export function recordToServiceItem(record: RecordModel): ServiceItem {
  return {
    id: record.id,
    category: (record.category || 'artisan') as Exclude<ServiceCategory, 'all'>,
    name: {
      ar: record.name_ar || record.name || '',
      fr: record.name_fr || record.name || '',
      en: record.name_en || record.name || '',
    },
    tradeOrRole: {
      ar: record.trade_ar || record.trade || '',
      fr: record.trade_fr || record.trade || '',
      en: record.trade_en || record.trade || '',
    },
    phone: record.phone || '',
    secondaryPhone: record.secondary_phone || undefined,
    whatsapp: record.whatsapp || undefined,
    address: {
      ar: record.address_ar || record.address || 'مدينة الدروة',
      fr: record.address_fr || record.address || 'Ville de Deroua',
      en: record.address_en || record.address || 'Deroua City',
    },
    neighborhood: {
      ar: record.neighborhood_ar || record.neighborhood || 'الدروة المركز',
      fr: record.neighborhood_fr || record.neighborhood || 'Deroua Centre',
      en: record.neighborhood_en || record.neighborhood || 'Deroua Centre',
    },
    is24_7: Boolean(record.is_24_7),
    isOpenNow: record.is_open_now !== undefined ? Boolean(record.is_open_now) : true,
    isEmergency: Boolean(record.is_emergency),
    isGuardPharmacy: Boolean(record.is_guard_pharmacy),
    rating: record.rating ? Number(record.rating) : 5.0,
    reviewsCount: record.reviews_count ? Number(record.reviews_count) : 0,
    verified: Boolean(record.verified),
    description: {
      ar: record.description_ar || record.description || '',
      fr: record.description_fr || record.description || '',
      en: record.description_en || record.description || '',
    },
    workingHours: {
      ar: record.working_hours_ar || (record.is_24_7 ? 'متاح 24/24' : '08:30 - 20:00'),
      fr: record.working_hours_fr || (record.is_24_7 ? '24h/24' : '08:30 - 20:00'),
      en: record.working_hours_en || (record.is_24_7 ? '24/7' : '08:30 - 20:00'),
    },
    mapQuery: record.map_query || undefined,
    isUserSubmitted: Boolean(record.is_user_submitted),
    createdAt: record.created,
  };
}

/**
 * Transform PocketBase record to AdvertisementItem
 */
export function recordToAdItem(record: RecordModel): AdvertisementItem {
  const imageUrl = record.image 
    ? pb.files.getURL(record, record.image) 
    : (record.image_url || undefined);

  return {
    id: record.id,
    title: {
      ar: record.title_ar || record.title || '',
      fr: record.title_fr || record.title || '',
      en: record.title_en || record.title || '',
    },
    subtitle: {
      ar: record.subtitle_ar || record.subtitle || '',
      fr: record.subtitle_fr || record.subtitle || '',
      en: record.subtitle_en || record.subtitle || '',
    },
    description: {
      ar: record.description_ar || record.description || '',
      fr: record.description_fr || record.description || '',
      en: record.description_en || record.description || '',
    },
    category: record.category || 'general',
    badge: record.badge_ar ? {
      ar: record.badge_ar || '',
      fr: record.badge_fr || record.badge_ar || '',
      en: record.badge_en || record.badge_ar || '',
    } : undefined,
    phone: record.phone || '',
    whatsapp: record.whatsapp || undefined,
    link: record.link || undefined,
    imageUrl: imageUrl,
    bgGradient: record.bg_gradient || 'from-emerald-600 via-teal-600 to-cyan-700',
    featured: Boolean(record.featured),
    isApproved: Boolean(record.is_approved || record.status === 'approved'),
    status: (record.status as 'pending' | 'approved' | 'rejected') || (record.is_approved ? 'approved' : 'pending'),
    applicantName: record.applicant_name || undefined,
    duration: record.duration || undefined,
    notes: record.notes || undefined,
    createdAt: record.created,
  };
}

/**
 * Service API helper methods
 */
export const servicesApi = {
  async getAll(): Promise<ServiceItem[]> {
    try {
      const records = await pb.collection('services').getFullList({
        sort: '-created',
      });
      return records.map(recordToServiceItem);
    } catch (err) {
      console.warn('PocketBase services fetch error:', err);
      return [];
    }
  },

  async create(service: Omit<ServiceItem, 'id' | 'createdAt'>): Promise<ServiceItem> {
    const payload = {
      category: service.category,
      name_ar: service.name.ar,
      name_fr: service.name.fr,
      name_en: service.name.en,
      trade_ar: service.tradeOrRole.ar,
      trade_fr: service.tradeOrRole.fr,
      trade_en: service.tradeOrRole.en,
      phone: service.phone,
      secondary_phone: service.secondaryPhone || '',
      whatsapp: service.whatsapp || '',
      address_ar: service.address.ar,
      address_fr: service.address.fr,
      address_en: service.address.en,
      neighborhood_ar: service.neighborhood.ar,
      neighborhood_fr: service.neighborhood.fr,
      neighborhood_en: service.neighborhood.en,
      is_24_7: Boolean(service.is24_7),
      is_open_now: service.isOpenNow !== undefined ? Boolean(service.isOpenNow) : true,
      is_emergency: Boolean(service.isEmergency),
      is_guard_pharmacy: Boolean(service.isGuardPharmacy),
      rating: service.rating || 5.0,
      reviews_count: service.reviewsCount || 0,
      verified: Boolean(service.verified),
      description_ar: service.description?.ar || '',
      description_fr: service.description?.fr || '',
      description_en: service.description?.en || '',
      working_hours_ar: service.workingHours?.ar || '',
      working_hours_fr: service.workingHours?.fr || '',
      working_hours_en: service.workingHours?.en || '',
      map_query: service.mapQuery || '',
      is_user_submitted: true,
      status: service.verified ? 'approved' : 'pending',
    };

    const record = await pb.collection('services').create(payload);
    return recordToServiceItem(record);
  },

  async updateVerification(id: string, verified: boolean): Promise<void> {
    try {
      await pb.collection('services').update(id, {
        verified,
        status: verified ? 'approved' : 'pending',
      });
    } catch (err) {
      console.warn('PocketBase service update failed:', err);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await pb.collection('services').delete(id);
    } catch (err) {
      console.warn('PocketBase service delete failed:', err);
    }
  },
};

/**
 * Advertisement API helper methods
 */
export const advertisementsApi = {
  async getAll(): Promise<AdvertisementItem[]> {
    try {
      const records = await pb.collection('advertisements').getFullList({
        sort: '-created',
      });
      return records.map(recordToAdItem);
    } catch (err) {
      console.warn('PocketBase advertisements fetch error:', err);
      return [];
    }
  },

  async create(ad: Omit<AdvertisementItem, 'id' | 'createdAt'>, imageFile?: File): Promise<AdvertisementItem> {
    if (imageFile) {
      const formData = new FormData();
      formData.append('title_ar', ad.title.ar);
      formData.append('title_fr', ad.title.fr || ad.title.ar);
      formData.append('title_en', ad.title.en || ad.title.ar);
      formData.append('subtitle_ar', ad.subtitle?.ar || '');
      formData.append('subtitle_fr', ad.subtitle?.fr || ad.subtitle?.ar || '');
      formData.append('subtitle_en', ad.subtitle?.en || ad.subtitle?.ar || '');
      formData.append('description_ar', ad.description?.ar || '');
      formData.append('description_fr', ad.description?.fr || ad.description?.ar || '');
      formData.append('description_en', ad.description?.en || ad.description?.ar || '');
      formData.append('category', ad.category || 'commerce');
      formData.append('badge_ar', ad.badge?.ar || '');
      formData.append('badge_fr', ad.badge?.fr || ad.badge?.ar || '');
      formData.append('badge_en', ad.badge?.en || ad.badge?.ar || '');
      formData.append('phone', ad.phone);
      formData.append('whatsapp', ad.whatsapp || '');
      formData.append('link', ad.link || '');
      formData.append('image_url', ad.imageUrl || '');
      formData.append('bg_gradient', ad.bgGradient || 'from-emerald-600 via-teal-600 to-cyan-700');
      formData.append('featured', String(Boolean(ad.featured)));
      formData.append('is_approved', String(Boolean(ad.isApproved)));
      formData.append('status', ad.status || (ad.isApproved ? 'approved' : 'pending'));
      formData.append('applicant_name', ad.applicantName || '');
      formData.append('duration', ad.duration || '');
      formData.append('notes', ad.notes || '');
      formData.append('image', imageFile);

      const record = await pb.collection('advertisements').create(formData);
      return recordToAdItem(record);
    }

    const payload = {
      title_ar: ad.title.ar,
      title_fr: ad.title.fr,
      title_en: ad.title.en,
      subtitle_ar: ad.subtitle.ar,
      subtitle_fr: ad.subtitle.fr,
      subtitle_en: ad.subtitle.en,
      description_ar: ad.description.ar,
      description_fr: ad.description.fr,
      description_en: ad.description.en,
      category: ad.category,
      badge_ar: ad.badge?.ar || '',
      badge_fr: ad.badge?.fr || '',
      badge_en: ad.badge?.en || '',
      phone: ad.phone,
      whatsapp: ad.whatsapp || '',
      link: ad.link || '',
      image_url: ad.imageUrl || '',
      bg_gradient: ad.bgGradient || 'from-emerald-600 via-teal-600 to-cyan-700',
      featured: Boolean(ad.featured),
      is_approved: Boolean(ad.isApproved),
      status: ad.status || (ad.isApproved ? 'approved' : 'pending'),
      applicant_name: ad.applicantName || '',
      duration: ad.duration || '',
      notes: ad.notes || '',
    };

    const record = await pb.collection('advertisements').create(payload);
    return recordToAdItem(record);
  },

  async updateStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> {
    try {
      await pb.collection('advertisements').update(id, {
        status,
        is_approved: status === 'approved',
      });
    } catch (err) {
      console.warn('PocketBase advertisement update status failed:', err);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await pb.collection('advertisements').delete(id);
    } catch (err) {
      console.warn('PocketBase advertisement delete failed:', err);
    }
  },
};
