export type Language = 'ar' | 'fr' | 'en';

export type ServiceCategory = 
  | 'all'
  | 'emergency'
  | 'pharmacy'
  | 'health'
  | 'artisan'
  | 'municipal'
  | 'transport'
  | 'commerce';

export interface LocalizedString {
  ar: string;
  fr: string;
  en: string;
}

export interface ServiceItem {
  id: string;
  category: Exclude<ServiceCategory, 'all'>;
  name: LocalizedString;
  tradeOrRole: LocalizedString;
  phone: string;
  secondaryPhone?: string;
  whatsapp?: string;
  address: LocalizedString;
  neighborhood: LocalizedString;
  is24_7?: boolean;
  isOpenNow?: boolean;
  isEmergency?: boolean;
  isGuardPharmacy?: boolean;
  rating?: number;
  reviewsCount?: number;
  verified: boolean;
  description?: LocalizedString;
  workingHours?: LocalizedString;
  mapQuery?: string;
  isUserSubmitted?: boolean;
  createdAt?: string;
}

export interface AdvertisementItem {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  category: string;
  badge?: LocalizedString;
  phone: string;
  whatsapp?: string;
  link?: string;
  imageUrl?: string;
  bgGradient?: string;
  featured?: boolean;
  isApproved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  applicantName?: string;
  duration?: string;
  notes?: string;
  createdAt?: string;
}

export interface NoticeItem {
  id: string;
  type: 'pharmacy_duty' | 'municipal' | 'utility' | 'transport';
  title: LocalizedString;
  content: LocalizedString;
  date: string;
  isUrgent?: boolean;
  author: LocalizedString;
  iconName?: string;
}

export interface TransportRoute {
  id: string;
  from: LocalizedString;
  to: LocalizedString;
  type: 'grand_taxi' | 'bus' | 'shuttle';
  lineOrNumber?: string;
  fare: string;
  station: LocalizedString;
  frequency: LocalizedString;
  operatingHours: LocalizedString;
}
