import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ServiceCard } from './ServiceCard.tsx';
import { SearchX, Heart, Sparkles, SlidersHorizontal } from 'lucide-react';

export const ServiceList: React.FC = () => {
  const {
    services,
    language,
    t,
    selectedCategory,
    selectedNeighborhood,
    onlyOpenNow,
    onlyEmergency,
    searchQuery,
    favorites,
    isFavoritesView,
    resetAllFilters
  } = useApp();

  // Filter logic
  const filteredServices = services.filter((service) => {
    // 1. Favorites filter
    if (isFavoritesView && !favorites.includes(service.id)) {
      return false;
    }

    // 2. Category filter
    if (selectedCategory !== 'all' && service.category !== selectedCategory) {
      return false;
    }

    // 3. Neighborhood filter
    if (selectedNeighborhood !== 'all') {
      const match = 
        service.neighborhood.fr.toLowerCase().includes(selectedNeighborhood.toLowerCase()) ||
        service.neighborhood.ar.includes(selectedNeighborhood) ||
        (selectedNeighborhood === 'centre' && (service.neighborhood.fr.includes('Centre') || service.neighborhood.ar.includes('مركز'))) ||
        (selectedNeighborhood === 'wifaq' && (service.neighborhood.fr.includes('Wifaq') || service.neighborhood.ar.includes('الوفاق'))) ||
        (selectedNeighborhood === 'amal' && (service.neighborhood.fr.includes('Amal') || service.neighborhood.ar.includes('الأمل'))) ||
        (selectedNeighborhood === 'nassim' && (service.neighborhood.fr.includes('Nassim') || service.neighborhood.ar.includes('النسيم'))) ||
        (selectedNeighborhood === 'kasbah' && (service.neighborhood.fr.includes('Kasbah') || service.neighborhood.ar.includes('القصبة'))) ||
        (selectedNeighborhood === 'airport_zone' && (service.neighborhood.fr.includes('Aéroport') || service.neighborhood.ar.includes('المطار')));
      if (!match) return false;
    }

    // 4. Open Now filter
    if (onlyOpenNow && !service.isOpenNow && !service.is24_7) {
      return false;
    }

    // 5. Emergency filter
    if (onlyEmergency && !service.isEmergency && !service.is24_7) {
      return false;
    }

    // 6. Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = 
        service.name.ar.toLowerCase().includes(q) ||
        service.name.fr.toLowerCase().includes(q) ||
        service.name.en.toLowerCase().includes(q);
      const matchTrade = 
        service.tradeOrRole.ar.toLowerCase().includes(q) ||
        service.tradeOrRole.fr.toLowerCase().includes(q) ||
        service.tradeOrRole.en.toLowerCase().includes(q);
      const matchNeighborhood = 
        service.neighborhood.ar.toLowerCase().includes(q) ||
        service.neighborhood.fr.toLowerCase().includes(q);
      const matchAddress = 
        service.address.ar.toLowerCase().includes(q) ||
        service.address.fr.toLowerCase().includes(q);
      const matchPhone = service.phone.includes(q) || (service.secondaryPhone?.includes(q) ?? false);
      const matchDesc = 
        (service.description?.ar.toLowerCase().includes(q) ?? false) ||
        (service.description?.fr.toLowerCase().includes(q) ?? false);

      if (!matchName && !matchTrade && !matchNeighborhood && !matchAddress && !matchPhone && !matchDesc) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header bar with counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-1.5 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>
            {isFavoritesView ? t.favorites : t.allCategories}:{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {filteredServices.length}
            </strong>{' '}
            {t.totalServices}
          </span>
        </div>

        {searchQuery && (
          <span className="text-sky-600 dark:text-sky-400 font-medium">
            "{searchQuery}"
          </span>
        )}
      </div>

      {/* Empty State: Favorites */}
      {isFavoritesView && filteredServices.length === 0 && (
        <div id="empty-favorites-view" className="text-center py-12 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            {t.noFavoritesYet}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {language === 'ar'
              ? 'اضغط على رمز القلب في أي بطاقة خدمة لحفظها والوصول إليها بسرعة حتى بدون إنترنت.'
              : 'Cliquez sur l\'icône cœur pour sauvegarder vos contacts favoris et y accéder rapidement.'}
          </p>
          <button
            id="browse-all-btn"
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.allCategories}</span>
          </button>
        </div>
      )}

      {/* Empty State: Search or Filters with no results */}
      {!isFavoritesView && filteredServices.length === 0 && (
        <div id="empty-search-view" className="text-center py-12 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 flex items-center justify-center mx-auto mb-3">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            {t.noResultsFound}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {language === 'ar'
              ? 'جرب البحث بكلمات أخرى أو قم بإعادة ضبط خيارات التصفية لعرض جميع الخدمات.'
              : 'Essayez un autre mot-clé ou réinitialisez les filtres pour afficher l\'ensemble des services.'}
          </p>
          <button
            id="reset-search-btn"
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-white dark:bg-slate-700 text-xs font-semibold hover:bg-slate-900 transition-colors"
          >
            <span>{t.resetFilters}</span>
          </button>
        </div>
      )}

      {/* Service Cards Grid */}
      {filteredServices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};
