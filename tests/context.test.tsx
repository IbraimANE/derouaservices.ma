import React from 'react';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const fake = vi.hoisted(() => ({
  services: vi.fn(), ads: vi.fn(), createService: vi.fn(), createAd: vi.fn(),
  admin: false, listener: null as null | ((user: unknown) => Promise<void>)
}));
vi.mock('../src/lib/firebase', () => ({
  auth: {}, hasAdminRole: vi.fn(async () => fake.admin),
  servicesApi: { getAll: fake.services, create: fake.createService },
  advertisementsApi: { getAll: fake.ads, create: fake.createAd }
}));
vi.mock('firebase/auth', () => ({
  onIdTokenChanged: (_auth: unknown, callback: (user: unknown) => Promise<void>) => {
    fake.listener = callback; void callback(null); return () => { fake.listener = null; };
  },
  getIdTokenResult: vi.fn(async () => ({ claims: { admin: fake.admin } })),
  signInWithEmailAndPassword: vi.fn(), signOut: vi.fn()
}));
import { AppProvider, useApp } from '../src/context/AppContext';
const wrapper = ({ children }: { children: React.ReactNode }) => <AppProvider>{children}</AppProvider>;
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); fake.admin = false;
  fake.services.mockReset().mockResolvedValue([]);
  fake.ads.mockReset().mockResolvedValue([]);
  fake.createService.mockReset(); fake.createAd.mockReset();
});
afterEach(cleanup);
it('ignores forged local administrator sessions and moderation overrides', async () => {
  sessionStorage.setItem('deroua_admin_auth', 'true');
  localStorage.setItem('deroua_verified_overrides', JSON.stringify({ 'unapproved': true }));
  const { result } = renderHook(useApp, { wrapper });
  await waitFor(() => expect(fake.services).toHaveBeenCalled());
  expect(result.current.isAdminAuthenticated).toBe(false);
});
it('clears advertisements and remote services when the server becomes empty', async () => {
  fake.services.mockResolvedValue([{ id: 'remote', verified: true, status: 'approved' }]);
  fake.ads.mockResolvedValue([{ id: 'ad', status: 'approved', isApproved: true }]);
  const { result } = renderHook(useApp, { wrapper });
  await waitFor(() => expect(result.current.approvedAdvertisements).toHaveLength(1));
  fake.services.mockResolvedValue([]); fake.ads.mockResolvedValue([]);
  await act(async () => { await result.current.refreshData(); });
  expect(result.current.approvedAdvertisements).toEqual([]);
  expect(result.current.services.some(s => s.id === 'remote')).toBe(false);
});
it('does not publish pending services returned to a moderator', async () => {
  fake.services.mockResolvedValue([{ id: 'pending', verified: false, status: 'pending' }]);
  const { result } = renderHook(useApp, { wrapper });
  await waitFor(() => expect(result.current.allRawServices.some(s => s.id === 'pending')).toBe(true));
  expect(result.current.services.some(s => s.id === 'pending')).toBe(false);
});
it('propagates failed submissions and never reports success or caches them locally', async () => {
  fake.createService.mockRejectedValue(new Error('offline'));
  fake.createAd.mockRejectedValue(new Error('permission-denied'));
  const { result } = renderHook(useApp, { wrapper });
  await waitFor(() => expect(fake.services).toHaveBeenCalled());
  await expect(result.current.addService({} as never)).rejects.toThrow('offline');
  await expect(result.current.submitAdInquiry({ businessName: 'Test', phone: '0600000000', category: 'commerce', duration: '1_month' })).rejects.toThrow('permission-denied');
  expect(localStorage.getItem('deroua_custom_services')).toBeNull();
  expect(result.current.toastMessage).toBeNull();
});
