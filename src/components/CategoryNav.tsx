import React from 'react';
import { 
  LayoutGrid, 
  AlertCircle, 
  Pill, 
  Stethoscope, 
  Wrench, 
  Building2, 
  Car, 
  ShoppingBag,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ServiceCategory } from '../types.ts';
import { DEROUA_NEIGHBORHOODS } from '../data/derouaData.ts';

export const CategoryNav: React.FC = () => {
  const {
    language,
    t,
    selectedCategory,
    setSelectedCategory,
    selectedNeighborhood,
    setSelectedNeighborhood,
    onlyOpenNow,
    setOnlyOpenNow,
    onlyEmergency,
    setOnlyEmergency,
    services,
    isFavoritesView,
    setIsFavoritesView,
    resetAllFilters,
    searchQuery
  } = useApp();

  const categories: { id: ServiceCategory; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { id: 'all', label: t.allCategories, icon: LayoutGrid, color: 'text-slate-600 dark:text-slate-300' },
    { id: 'emergency', label: t.emergency, icon: AlertCircle, color: 'text-red-600 dark:text-red-400' },
    { id: 'pharmacy', label: t.pharmacy, icon: Pill, color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'health', label: t.health, icon: Stethoscope, color: 'text-cyan-600 dark:text-cyan-400' },
    { id: 'artisan', label: t.artisan, icon: Wrench, color: 'text-amber-600 dark:text-amber-400' },
    { id: 'municipal', label: t.municipal, icon: Building2, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'transport', label: t.transport, icon: Car, color: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'commerce', label: t.commerce, icon: ShoppingBag, color: 'text-violet-600 dark:text-violet-400' },
  ];

  // Count per category
  const getCategoryCount = (catId: ServiceCategory) => {
    if (catId === 'all') return services.length;
    return services.filter(s => s.category === catId).length;
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedNeighborhood !== 'all' || 
    onlyOpenNow || 
    onlyEmergency || 
    isFavoritesView || 
    searchQuery !== '';

  return (
    <div className="space-y-3">
      {/* Category horizontal scroll pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id && !isFavoritesView;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              type="button"
              onClick={() => {
                setIsFavoritesView(false);
                setSelectedCategory(cat.id);
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : cat.color}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected 
                  ? 'bg-white/25 text-white' 
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Row: Neighborhood & Quick Toggles */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Neighborhood Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="neighborhood-select"
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              {DEROUA_NEIGHBORHOODS.map(n => (
                <option key={n.id} value={n.id} className="dark:bg-slate-900">
                  {n[language]}
                </option>
              ))}
            </select>
          </div>

          {/* Open Now Toggle */}
          <button
            id="toggle-open-now-btn"
            type="button"
            onClick={() => setOnlyOpenNow(!onlyOpenNow)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
              onlyOpenNow
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-300'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.openNow}</span>
            {onlyOpenNow && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
          </button>

          {/* 24/7 Emergency Toggle */}
          <button
            id="toggle-emergency-btn"
            type="button"
            onClick={() => setOnlyEmergency(!onlyEmergency)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
              onlyEmergency
                ? 'bg-red-50 border-red-300 text-red-700 font-semibold dark:bg-red-950/40 dark:border-red-700 dark:text-red-300'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t.open247}</span>
            {onlyEmergency && <CheckCircle2 className="w-3 h-3 text-red-600" />}
          </button>
        </div>

        {/* Actions right side: View on Map & Reset Filters */}
        <div className="flex items-center gap-2">
          <a
            id="jump-to-map-btn"
            href="#interactive-deroua-map-section"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:hover:bg-sky-900/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-semibold transition-all shadow-2xs"
            title={language === 'ar' ? 'عرض مواقع الخدمات على خريطة جوجل' : 'Voir sur la carte'}
          >
            <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{language === 'ar' ? 'الخريطة' : 'Carte'}</span>
          </a>

          {/* Reset Filters button if any active */}
          {hasActiveFilters && (
            <button
              id="reset-filters-btn"
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetFilters}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
