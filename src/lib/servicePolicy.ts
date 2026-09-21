import type { ServiceItem, AdvertisementItem } from '../types';

export function isPublishedService(service: ServiceItem): boolean {
  return service.status === 'approved' && service.verified === true;
}

export function isPublishedAdvertisement(ad: AdvertisementItem): boolean {
  return ad.status === 'approved' && ad.isApproved === true;
}

export function isCurrentGuardPharmacy(service: ServiceItem, now = Date.now()): boolean {
  if (service.category !== 'pharmacy' || !service.isGuardPharmacy || !isPublishedService(service) ||
      !service.guardStartsAt || !service.guardEndsAt || !service.guardSource?.trim()) return false;
  const start = Date.parse(service.guardStartsAt);
  const end = Date.parse(service.guardEndsAt);
  return Number.isFinite(start) && Number.isFinite(end) && start <= now && now < end;
}

export function whatsappNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (/^0[5-7]\d{8}$/.test(digits)) return '212' + digits.slice(1);
  return digits.startsWith('00') ? digits.slice(2) : digits;
}

export function safeWebUrl(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}

export function withoutUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withoutUndefined) as T;
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, withoutUndefined(v)])) as T;
  }
  return value;
}
