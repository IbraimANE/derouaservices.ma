import { useEffect, lazy, Suspense } from 'react';
import { useApp } from './context/AppContext';
const AdminModal = lazy(() => import('./components/AdminModal').then(module => ({ default: module.AdminModal })));
export const AdminApp = () => {
  const { setIsAdminModalOpen, isAdminModalOpen } = useApp();
  useEffect(() => { setIsAdminModalOpen(true); }, [setIsAdminModalOpen]);
  return <main className="min-h-screen p-8 bg-slate-50 dark:bg-slate-950">
    <a href="/">العودة إلى الدليل / Retour à l'annuaire</a>
    <button className="m-4 p-3 border rounded-lg" onClick={() => setIsAdminModalOpen(true)}>لوحة الإدارة / Administration</button>
    {isAdminModalOpen && <Suspense fallback={<p role="status">…</p>}><AdminModal /></Suspense>}
  </main>;
};
