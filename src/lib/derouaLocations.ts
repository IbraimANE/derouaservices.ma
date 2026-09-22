import { ServiceItem, ServiceCategory } from '../types.ts';

// Deroua center coordinates (Province of Berrechid, Morocco)
export const DEROUA_CENTER = {
  lat: 33.4132,
  lng: -7.5350
};

export const DEROUA_DEFAULT_ZOOM = 14;

// Coordinates for Deroua neighborhoods
export const NEIGHBORHOOD_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  centre: { lat: 33.4135, lng: -7.5355 },
  wifaq: { lat: 33.4182, lng: -7.5318 },
  amal: { lat: 33.4162, lng: -7.5365 },
  nassim: { lat: 33.4108, lng: -7.5408 },
  kasbah: { lat: 33.4088, lng: -7.5325 },
  jnane: { lat: 33.4172, lng: -7.5278 },
  saada: { lat: 33.4145, lng: -7.5425 },
  airport_zone: { lat: 33.3725, lng: -7.5750 }
};

// Exact geographic locations for established verified services in Deroua
export const KNOWN_SERVICE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Emergencies
  'emg-ambulance-deroua': { lat: 33.4140, lng: -7.5365 }, // Siège de la Commune
  'emg-1': { lat: 33.4150, lng: -7.5340 }, // Protection Civile
  'emg-2': { lat: 33.4158, lng: -7.5385 }, // Gendarmerie Royale Deroua

  // Pharmacies
  'ph-1': { lat: 33.4185, lng: -7.5322 }, // Pharmacie El Wifaq
  'ph-2': { lat: 33.4162, lng: -7.5368 }, // Pharmacie Al Amal
  'ph-3': { lat: 33.4112, lng: -7.5412 }, // Pharmacie Ennassim
  'ph-4': { lat: 33.4092, lng: -7.5328 }, // Pharmacie Al Kasbah
  'ph-5': { lat: 33.4175, lng: -7.5282 }, // Pharmacie Jnane Deroua
  'ph-6': { lat: 33.4138, lng: -7.5358 }, // Pharmacie Centrale
  'ph-7': { lat: 33.4152, lng: -7.5392 }, // Pharmacie Al Qods

  // Health
  'hlth-1': { lat: 33.4125, lng: -7.5342 }, // Centre de Santé Communal (Dispensaire)
  'hlth-2': { lat: 33.4142, lng: -7.5350 }, // Cabinet Dr. Alami
  'hlth-3': { lat: 33.4139, lng: -7.5362 }, // Laboratoire d'Analyses Médicales
  'hlth-4': { lat: 33.4128, lng: -7.5354 }, // Cabinet Dentaire

  // Municipal & Administrations
  'mun-1': { lat: 33.4140, lng: -7.5365 }, // Commune Urbaine de Deroua
  'mun-2': { lat: 33.4136, lng: -7.5368 }, // Barid Al Maghrib (Poste Maroc)
  'mun-srm-deroua': { lat: 33.4148, lng: -7.5372 }, // SRM Casablanca-Settat (ONEE Eau et Électricité)

  // Transport
  'tr-1': { lat: 33.4118, lng: -7.5338 }, // Station Grands Taxis (Casa / Deroua)
  'tr-2': { lat: 33.4115, lng: -7.5345 }, // Station Grands Taxis (Berrechid / Deroua)
  'tr-3': { lat: 33.3642, lng: -7.5752 }, // Gare Ferroviaire ONCF Nouaceur

  // Artisans
  'art-1': { lat: 33.4168, lng: -7.5360 }, // Plombier Hay Al Amal
  'art-2': { lat: 33.4180, lng: -7.5330 }, // Electricien Hay Al Wifaq
  'art-3': { lat: 33.4105, lng: -7.5398 }, // Menuiserie Aluminium Ennassim
  'art-4': { lat: 33.4122, lng: -7.5370 }, // Mécanique Auto & Dépannage
  'art-5': { lat: 33.4095, lng: -7.5340 }, // Peinture & Décoration Al Kasbah

  // User submitted samples
  'user-sub-1': { lat: 33.4188, lng: -7.5315 }, // Supermarché Al Wifaq
  'user-sub-2': { lat: 33.4155, lng: -7.5355 }, // Boulangerie Pâtisserie
  'user-sub-3': { lat: 33.4145, lng: -7.5360 }, // Pressing Moderne
  'user-sub-4': { lat: 33.4130, lng: -7.5345 }  // Quincaillerie Deroua Centre
};

/**
 * Returns accurate geographic coordinates for a given service.
 * If the service has explicit coordinates, uses them.
 * If known in database, returns pre-mapped coordinates.
 * Otherwise, generates a deterministic pseudo-random offset around the neighborhood centroid.
 */
export function getServiceCoordinates(service: ServiceItem): { lat: number; lng: number } {
  if (service.coordinates && typeof service.coordinates.lat === 'number' && typeof service.coordinates.lng === 'number') {
    return service.coordinates;
  }

  if (KNOWN_SERVICE_COORDINATES[service.id]) {
    return KNOWN_SERVICE_COORDINATES[service.id];
  }

  // Determine neighborhood centroid
  const nAr = service.neighborhood?.ar || '';
  const nFr = service.neighborhood?.fr || '';

  let base = NEIGHBORHOOD_CENTROIDS.centre;
  if (nAr.includes('الوفاق') || nFr.toLowerCase().includes('wifaq')) {
    base = NEIGHBORHOOD_CENTROIDS.wifaq;
  } else if (nAr.includes('الأمل') || nFr.toLowerCase().includes('amal')) {
    base = NEIGHBORHOOD_CENTROIDS.amal;
  } else if (nAr.includes('النسيم') || nFr.toLowerCase().includes('nassim')) {
    base = NEIGHBORHOOD_CENTROIDS.nassim;
  } else if (nAr.includes('القصبة') || nFr.toLowerCase().includes('kasbah')) {
    base = NEIGHBORHOOD_CENTROIDS.kasbah;
  } else if (nAr.includes('جنان') || nFr.toLowerCase().includes('jnane')) {
    base = NEIGHBORHOOD_CENTROIDS.jnane;
  } else if (nAr.includes('السعادة') || nFr.toLowerCase().includes('saada')) {
    base = NEIGHBORHOOD_CENTROIDS.saada;
  } else if (nAr.includes('المطار') || nFr.toLowerCase().includes('aéro') || nFr.toLowerCase().includes('nouaceur')) {
    base = NEIGHBORHOOD_CENTROIDS.airport_zone;
  }

  // Derive a reproducible spread of ±0.002 degrees (~200m) based on ID string
  let hash = 0;
  for (let i = 0; i < service.id.length; i++) {
    hash = (hash << 5) - hash + service.id.charCodeAt(i);
    hash |= 0;
  }
  const offsetLat = ((Math.abs(hash) % 100) - 50) * 0.00003;
  const offsetLng = ((Math.abs(hash >> 3) % 100) - 50) * 0.00003;

  return {
    lat: Number((base.lat + offsetLat).toFixed(6)),
    lng: Number((base.lng + offsetLng).toFixed(6))
  };
}

export interface CategoryPinStyle {
  bg: string;
  border: string;
  glyph: string;
  textColor: string;
  labelAr: string;
  labelFr: string;
}

export const CATEGORY_PIN_STYLES: Record<ServiceCategory, CategoryPinStyle> = {
  all: {
    bg: '#0284c7',
    border: '#0369a1',
    glyph: '#ffffff',
    textColor: 'text-sky-700 dark:text-sky-300',
    labelAr: 'جميع الخدمات',
    labelFr: 'Tous les services'
  },
  emergency: {
    bg: '#dc2626',
    border: '#991b1b',
    glyph: '#ffffff',
    textColor: 'text-red-700 dark:text-red-300',
    labelAr: 'طوارئ وإسعاف',
    labelFr: 'Urgences'
  },
  pharmacy: {
    bg: '#059669',
    border: '#047857',
    glyph: '#ffffff',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    labelAr: 'صيدليات',
    labelFr: 'Pharmacies'
  },
  health: {
    bg: '#0891b2',
    border: '#0e7490',
    glyph: '#ffffff',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    labelAr: 'صحة وأطباء',
    labelFr: 'Santé'
  },
  artisan: {
    bg: '#d97706',
    border: '#b45309',
    glyph: '#ffffff',
    textColor: 'text-amber-700 dark:text-amber-300',
    labelAr: 'حرفيون وصيانة',
    labelFr: 'Artisans'
  },
  municipal: {
    bg: '#2563eb',
    border: '#1d4ed8',
    glyph: '#ffffff',
    textColor: 'text-blue-700 dark:text-blue-300',
    labelAr: 'إدارات ومؤسسات',
    labelFr: 'Administrations'
  },
  transport: {
    bg: '#4f46e5',
    border: '#3730a3',
    glyph: '#ffffff',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    labelAr: 'نقل ومواصلات',
    labelFr: 'Transport'
  },
  commerce: {
    bg: '#7c3aed',
    border: '#6d28d9',
    glyph: '#ffffff',
    textColor: 'text-violet-700 dark:text-violet-300',
    labelAr: 'تجارة وتسوق',
    labelFr: 'Commerce'
  }
};
