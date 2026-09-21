import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc, query, where, serverTimestamp, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAuth, getIdTokenResult, signInAnonymously } from 'firebase/auth';
import type { ServiceItem, AdvertisementItem } from '../types';
import { safeWebUrl, whatsappNumber, withoutUndefined } from './servicePolicy';

const app = initializeApp({
  projectId: "deroua-services",
  appId: "1:1016444326121:web:042da0d6f124a8f415a078",
  storageBucket: "deroua-services.firebasestorage.app",
  apiKey: "AIzaSyBdaHxjluLziN3AR1F_W7LmzzUVCUHhqeg",
  authDomain: "deroua-services.firebaseapp.com",
  messagingSenderId: "1016444326121"
});
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export async function hasAdminRole(): Promise<boolean> {
  await auth.authStateReady();
  return !!auth.currentUser && (await getIdTokenResult(auth.currentUser)).claims.admin === true;
}

async function requireAdmin() {
  if (!await hasAdminRole()) throw new Error('Administrator access required.');
}

async function submissionUser() {
  await auth.authStateReady();
  return auth.currentUser ?? (await signInAnonymously(auth)).user;
}

export const servicesApi = {
  async getAll(admin = false): Promise<ServiceItem[]> {
    if (admin) await requireAdmin();
    const source = collection(db, 'services');
    const q = admin ? query(source) : query(source, where('status', '==', 'approved'), where('verified', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(record => ({ ...record.data(), id: record.id } as ServiceItem));
  },
  async create(service: Omit<ServiceItem, 'id' | 'createdAt'>): Promise<ServiceItem> {
    const user = await submissionUser();
    const record = doc(collection(db, 'services'));
    const payload = withoutUndefined({
      category: service.category, name: service.name, tradeOrRole: service.tradeOrRole,
      phone: service.phone.trim(), whatsapp: service.whatsapp ? whatsappNumber(service.whatsapp) : undefined,
      address: service.address, neighborhood: service.neighborhood, description: service.description,
      workingHours: service.workingHours, is24_7: !!service.is24_7,
      isOpenNow: false, isUserSubmitted: true, verified: false, status: 'pending' as const,
      ownerUid: user.uid
    });
    await setDoc(record, { ...payload, createdAt: serverTimestamp() });
    return { ...payload, id: record.id, createdAt: new Date().toISOString() };
  },
  async updateVerification(id: string, verified: boolean): Promise<void> {
    await requireAdmin();
    await updateDoc(doc(db, 'services', id), { verified, status: verified ? 'approved' : 'pending' });
  },
  async updateGuard(id: string, startsAt: string, endsAt: string, source: string): Promise<void> {
    await requireAdmin();
    if (!Number.isFinite(Date.parse(startsAt)) || !Number.isFinite(Date.parse(endsAt)) ||
        Date.parse(endsAt) <= Date.parse(startsAt) || !source.trim()) throw new Error('Invalid duty period.');
    await updateDoc(doc(db, 'services', id), {
      isGuardPharmacy: true, guardStartsAt: startsAt, guardEndsAt: endsAt,
      guardSource: source.trim(), guardVerifiedAt: new Date().toISOString()
    });
  },
  async delete(id: string): Promise<void> {
    await requireAdmin();
    await deleteDoc(doc(db, 'services', id));
  }
};

export const advertisementsApi = {
  async getAll(admin = false): Promise<AdvertisementItem[]> {
    if (admin) await requireAdmin();
    const source = collection(db, 'advertisements');
    const q = admin ? query(source) : query(source, where('status', '==', 'approved'), where('isApproved', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(record => ({ ...record.data(), id: record.id } as AdvertisementItem));
  },
  async create(ad: Omit<AdvertisementItem, 'id' | 'createdAt'>, imageFile?: File): Promise<AdvertisementItem> {
    if (imageFile && (imageFile.size > 5 * 1024 * 1024 ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(imageFile.type))) throw new Error('Invalid image.');
    if (ad.link && !safeWebUrl(ad.link)) throw new Error('Invalid link.');
    const user = await submissionUser();
    const record = doc(collection(db, 'advertisements'));
    const admin = await hasAdminRole();
    const imageRef = imageFile ? ref(storage, 'ads/' + user.uid + '/' + record.id + '/image') : undefined;
    let imageUrl = '';
    try {
      if (imageRef && imageFile) {
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }
      const payload = withoutUndefined({
        title: ad.title, subtitle: ad.subtitle, description: ad.description, category: ad.category,
        phone: ad.phone.trim(), whatsapp: ad.whatsapp ? whatsappNumber(ad.whatsapp) : undefined,
        link: safeWebUrl(ad.link), imageUrl, applicantName: ad.applicantName,
        ...(admin ? { badge: ad.badge, bgGradient: ad.bgGradient, featured: !!ad.featured } : {}),
        duration: ad.duration, notes: ad.notes,
        status: 'pending' as const, isApproved: false, ownerUid: user.uid
      });
      await setDoc(record, { ...payload, createdAt: serverTimestamp() });
      return { ...payload, id: record.id, createdAt: new Date().toISOString() };
    } catch (error) {
      if (imageRef) await deleteObject(imageRef).catch(() => undefined);
      throw error;
    }
  },
  async updateStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> {
    await requireAdmin();
    await updateDoc(doc(db, 'advertisements', id), { status, isApproved: status === 'approved' });
  },
  async delete(id: string): Promise<void> {
    await requireAdmin();
    await deleteDoc(doc(db, 'advertisements', id));
  }
};
