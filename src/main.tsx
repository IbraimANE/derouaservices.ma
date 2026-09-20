import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import { AdminApp } from './AdminApp.tsx';
import { AppProvider } from './context/AppContext.tsx';
import './index.css';

const isAdmin = window.location.hash === '#admin' || window.location.pathname === '/admin';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      {isAdmin ? <AdminApp /> : <App />}
    </AppProvider>
  </React.StrictMode>
);

window.addEventListener('hashchange', () => window.location.reload());
