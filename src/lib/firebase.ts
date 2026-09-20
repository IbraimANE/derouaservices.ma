import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import type { ServiceItem, AdvertisementItem } from '../types';

const firebaseConfig = {
  projectId: "deroua-services",
  appId: "1:1016444326121:web:042da0d6f124a8f415a078",
  storageBucket: "deroua-services.firebasestorage.app",
  apiKey: "AIzaSyBdaHxjluLziN3AR1F_W7LmzzUVCUHhqeg",
  authDomain: "deroua-services.firebaseapp.com",
  messagingSenderId: "1016444326121",
  measurementId: "G-9CJ5B0MWS3",
  projectNumber: "1016444326121"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const servicesApi = {
  async getAll(): Promise<ServiceItem[]> {
    const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceItem));
  },
  async create(service: Omit<ServiceItem, 'id' | 'createdAt'>): Promise<ServiceItem> {
    const payload = { ...service, createdAt: serverTimestamp(), status: service.verified ? 'approved' : 'pending' };
    const docRef = await addDoc(collection(db, 'services'), payload);
    return { id: docRef.id, ...payload, createdAt: new Date().toISOString() } as unknown as ServiceItem;
  },
  async updateVerification(id: string, verified: boolean): Promise<void> {
    await updateDoc(doc(db, 'services', id), { verified, status: verified ? 'approved' : 'pending' });
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'services', id));
  }
};

export const advertisementsApi = {
  async getAll(): Promise<AdvertisementItem[]> {
    const q = query(collection(db, 'advertisements'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdvertisementItem));
  },
  async create(ad: Omit<AdvertisementItem, 'id' | 'createdAt'>, imageFile?: File): Promise<AdvertisementItem> {
    let imageUrl = ad.imageUrl || '';
    if (imageFile) {
      const storageRef = ref(storage, 'ads/' + Date.now() + '_' + imageFile.name);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    const payload = { ...ad, imageUrl, createdAt: serverTimestamp(), status: ad.status || (ad.isApproved ? 'approved' : 'pending') };
    const docRef = await addDoc(collection(db, 'advertisements'), payload);
    return { id: docRef.id, ...payload, createdAt: new Date().toISOString() } as unknown as AdvertisementItem;
  },
  async updateStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> {
    await updateDoc(doc(db, 'advertisements', id), { status, isApproved: status === 'approved' });
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'advertisements', id));
  }
};