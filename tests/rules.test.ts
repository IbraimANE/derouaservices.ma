// @vitest-environment node
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, expect, it } from 'vitest';
import { initializeTestEnvironment, assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
let env: RulesTestEnvironment;
const loc = { ar: 'اختبار', fr: 'Test', en: 'Test' };
const service = () => ({
  name: loc, tradeOrRole: loc, category: 'artisan', phone: '0600000000',
  address: loc, neighborhood: loc, is24_7: false, isOpenNow: false,
  verified: false, isUserSubmitted: true, status: 'pending', ownerUid: 'visitor', createdAt: serverTimestamp()
});
beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-deroua-test',
    firestore: { host: '127.0.0.1', port: 8080, rules: readFileSync('firestore.rules', 'utf8') },
    storage: { host: '127.0.0.1', port: 9199, rules: readFileSync('storage.rules', 'utf8') }
  });
});
beforeEach(async () => { await env.clearFirestore(); await env.clearStorage(); });
afterAll(async () => { await env?.cleanup(); });
it('accepts pending submissions but rejects anonymous writes and forged approval', async () => {
  const db = env.authenticatedContext('visitor').firestore();
  await assertSucceeds(setDoc(doc(db, 'services/ok'), service()));
  await assertFails(setDoc(doc(env.unauthenticatedContext().firestore(), 'services/noauth'), service()));
  await assertFails(setDoc(doc(db, 'services/forged'), { ...service(), verified: true, status: 'approved' }));
  await assertFails(setDoc(doc(db, 'services/guard'), { ...service(), isGuardPharmacy: true }));
  await assertFails(setDoc(doc(db, 'services/rating'), { ...service(), rating: 5 }));
  await assertFails(setDoc(doc(db, 'services/other'), { ...service(), ownerUid: 'other' }));
});
it('keeps pending records private and requires the admin claim for moderation', async () => {
  const visitor = env.authenticatedContext('visitor').firestore();
  const admin = env.authenticatedContext('moderator', { admin: true }).firestore();
  const publicDb = env.unauthenticatedContext().firestore();
  await assertSucceeds(setDoc(doc(visitor, 'services/request'), service()));
  await assertFails(getDoc(doc(publicDb, 'services/request')));
  await assertFails(getDocs(collection(publicDb, 'services')));
  await assertFails(updateDoc(doc(visitor, 'services/request'), { status: 'approved', verified: true }));
  await assertFails(deleteDoc(doc(visitor, 'services/request')));
  await assertSucceeds(getDoc(doc(admin, 'services/request')));
  await assertSucceeds(updateDoc(doc(admin, 'services/request'), { status: 'approved', verified: true }));
  const result = await assertSucceeds(getDocs(query(collection(publicDb, 'services'), where('status', '==', 'approved'), where('verified', '==', true))));
  expect(result.size).toBe(1);
  await assertSucceeds(deleteDoc(doc(admin, 'services/request')));
});
it('does not permit a visitor to publish an advertisement or inject a script link', async () => {
  const db = env.authenticatedContext('visitor').firestore();
  const ad = { title: loc, subtitle: loc, description: loc, category: 'commerce', phone: '0600000000',
    status: 'pending', isApproved: false, ownerUid: 'visitor', createdAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(db, 'advertisements/pending'), ad));
  await assertFails(setDoc(doc(db, 'advertisements/published'), { ...ad, status: 'approved', isApproved: true }));
  await assertFails(setDoc(doc(db, 'advertisements/script'), { ...ad, link: 'javascript:alert(1)' }));
  await assertFails(setDoc(doc(db, 'advertisements/badge'), { ...ad, badge: loc }));
  const adminDb = env.authenticatedContext('moderator', { admin: true }).firestore();
  await assertSucceeds(setDoc(doc(adminDb, 'advertisements/admin'), { ...ad, ownerUid: 'moderator', badge: loc, featured: true, bgGradient: 'from-sky-600 to-blue-700' }));
  await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'advertisements/pending')));
  await assertFails(updateDoc(doc(db, 'advertisements/pending'), { isApproved: true }));
});
it('restricts image uploads to the owner, accepted types and size limit', async () => {
  const storage = env.authenticatedContext('visitor').storage();
  await assertSucceeds(uploadBytes(ref(storage, 'ads/visitor/a/image'), new Uint8Array(10), { contentType: 'image/png' }));
  await assertFails(uploadBytes(ref(storage, 'ads/someone-else/b/image'), new Uint8Array(10), { contentType: 'image/png' }));
  await assertFails(uploadBytes(ref(storage, 'ads/visitor/c/image'), new Uint8Array(10), { contentType: 'text/html' }));
  await assertFails(uploadBytes(ref(storage, 'ads/visitor/d/image'), new Uint8Array(5 * 1024 * 1024 + 1), { contentType: 'image/png' }));
});
