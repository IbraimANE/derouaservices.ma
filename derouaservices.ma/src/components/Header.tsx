import React from 'react';
import { 
  Moon, 
  Sun, 
  Heart, 
  PlusCircle, 
  Search, 
  X, 
  WifiOff, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Language } from '../types.ts';
import { Logo } from './Logo.tsx';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    t,
    favorites,
    isFavoritesView,
    setIsFavoritesView,
    searchQuery,
    setSearchQuery,
    setIsAddModalOpen,
    setIsAboutModalOpen,
    setIsAdminModalOpen,
    isAdminAuthenticated,
    isOffline
  } = useApp();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 transition-colors shadow-xs">
      {/* Offline Alert Bar if network is disconnected */}
      {isOffline && (
        <div id="offline-banner" className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 text-center">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>{t.offlineStatus}</span>
        </div>
      )}

      {/* Main Top Nav */}
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Official Logo Branding */}
          <div className="cursor-pointer select-none" onClick={() => { setSearchQuery(''); setIsFavoritesView(false); }}>
            <Logo variant="horizontal" size="md" />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-medium border border-slate-200 dark:border-slate-700/60">
              <button
                id="lang-ar-btn"
                type="button"
                onClick={() => handleLanguageChange('ar')}
                className={`px-2 py-1 rounded transition-all ${
                  language === 'ar' 
                    ? 'bg-white text-slate-900 shadow-xs font-bold dark:bg-slate-700 dark:text-white' 
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                عربي
              </button>
              <button
                id="lang-fr-btn"
                type="button"
                onClick={() => handleLanguageChange('fr')}
                className={`px-2 py-1 rounded transition-all ${
                  language === 'fr' 
                    ? 'bg-white text-slate-900 shadow-xs font-bold dark:bg-slate-700 dark:text-white' 
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                id="lang-en-btn"
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded transition-all ${
                  language === 'en' 
                    ? 'bg-white text-slate-900 shadow-xs font-bold dark:bg-slate-700 dark:text-white' 
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Favorites Toggle */}
            <button
              id="favorites-toggle-btn"
              type="button"
              onClick={() => setIsFavoritesView(!isFavoritesView)}
              className={`relative p-2 rounded-lg border transition-colors ${
                isFavoritesView 
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
              title={t.favorites}
            >
              <Heart className={`w-4 h-4 ${isFavoritesView ? 'fill-current' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Add service button (Web friendly) */}
            <button
              id="add-service-open-btn"
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addServiceBtn}</span>
            </button>

            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
              title={theme === 'dark' ? t.lightMode : t.darkMode}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Admin Management Portal Button */}
            <button
              id="admin-portal-header-btn"
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className={`p-2 rounded-lg border transition-colors ${
                isAdminAuthenticated
                  ? 'bg-sky-50 border-sky-300 text-sky-600 dark:bg-sky-950 dark:border-sky-800 dark:text-sky-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 border-transparent text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
              }`}
              title={t.adminPortal}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* About Website Info Button */}
            <button
              id="about-website-btn"
              type="button"
              onClick={() => setIsAboutModalOpen(true)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
              title={t.aboutWebsite}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="mt-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="main-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-500 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-900 transition-all rtl:pl-8 rtl:pr-9"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rtl:right-auto rtl:left-0 rtl:pr-0 rtl:pl-3"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
