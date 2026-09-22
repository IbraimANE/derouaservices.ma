import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
const AdminApp = lazy(() => import('./AdminApp').then(module => ({ default: module.AdminApp })));
import { AppProvider } from './context/AppContext.tsx';
import './index.css';

const isAdmin = window.location.hash === '#admin' || window.location.pathname === '/admin';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <Suspense fallback={<p role="status">…</p>}>{isAdmin ? <AdminApp /> : <App />}</Suspense>
    </AppProvider>
  </React.StrictMode>
);

window.addEventListener('hashchange', () => window.location.reload());
