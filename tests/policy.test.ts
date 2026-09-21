import { describe, expect, it } from 'vitest';
import { isCurrentGuardPharmacy, isPublishedAdvertisement, isPublishedService, safeWebUrl, whatsappNumber, withoutUndefined } from '../src/lib/servicePolicy';
import type { ServiceItem } from '../src/types';
const service = { category: 'pharmacy', verified: true, status: 'approved', isGuardPharmacy: true,
  guardStartsAt: '2026-09-21T00:00:00Z', guardEndsAt: '2026-09-22T00:00:00Z', guardSource: 'Confirmed local roster' } as ServiceItem;
describe('publication and dated pharmacy duty', () => {
  it('never treats verification alone as approval', () => {
    expect(isPublishedService({ ...service, status: 'pending' })).toBe(false);
    expect(isPublishedService({ ...service, status: undefined })).toBe(false);
    expect(isPublishedService(service)).toBe(true);
    expect(isPublishedAdvertisement({ status: 'rejected', isApproved: true } as never)).toBe(false);
  });
  it('requires a real sourced interval with an exclusive end', () => {
    expect(isCurrentGuardPharmacy(service, Date.parse(service.guardStartsAt!))).toBe(true);
    expect(isCurrentGuardPharmacy(service, Date.parse(service.guardEndsAt!))).toBe(false);
    expect(isCurrentGuardPharmacy(service, Date.parse('2026-09-20'))).toBe(false);
    expect(isCurrentGuardPharmacy({ ...service, guardEndsAt: undefined })).toBe(false);
    expect(isCurrentGuardPharmacy({ ...service, guardSource: '' }, Date.parse(service.guardStartsAt!))).toBe(false);
    expect(isCurrentGuardPharmacy({ ...service, category: 'artisan' }, Date.parse(service.guardStartsAt!))).toBe(false);
  });
  it('normalizes Moroccan WhatsApp numbers and rejects executable links', () => {
    expect(whatsappNumber('06 61 98 45 12')).toBe('212661984512');
    expect(whatsappNumber('+212 661984512')).toBe('212661984512');
    expect(whatsappNumber('00212661984512')).toBe('212661984512');
    expect(safeWebUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeWebUrl('https://example.com')).toBe('https://example.com/');
  });
  it('removes undefined optional fields without destroying Firestore sentinels', () => {
    class Sentinel {}
    const sentinel = new Sentinel();
    expect(withoutUndefined({ a: undefined, nested: { b: undefined, c: false }, sentinel }))
      .toEqual({ nested: { c: false }, sentinel });
  });
});
