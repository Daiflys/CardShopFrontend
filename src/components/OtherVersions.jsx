import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getCardsByOracleId } from '../api/card';
import SearchGridCard from './SearchGridCard';
import usePaginationStore from '../store/paginationStore';
import Card from '../models/Card';
import { createFormatPrice, getAvailableCount } from '../utils/cardPricing';

const OtherVersions = ({ card, currentCardId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [otherVersions, setOtherVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { handlePaginatedResponse } = usePaginationStore();
  const formatPrice = createFormatPrice(t);

  useEffect(() => {
    if (!card?.oracleId && !card?.oracle_id) {
      return;
    }

    const oracleId = card.oracleId || card.oracle_id;

    const fetchOtherVersions = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching other versions for oracle ID:', oracleId);
        const response = await getCardsByOracleId(oracleId);

        console.log('Raw Oracle ID response:', response);

        // Use the same pattern as Search.jsx - handle paginated response
        const cardsArray = handlePaginatedResponse(response, 0, 50);
        console.log('Cards array after pagination handler:', cardsArray);

        // Transform using Card model (handle nested structure)
        const cards = Card.fromApiResponseArray(cardsArray);
        console.log('Cards after Card model transformation:', cards);

        // Filter out the current card from results
        const filteredVersions = cards.filter(version => {
          return version.id !== currentCardId && version.name && version.id;
        });

        console.log('Other versions found after filtering:', filteredVersions);
        setOtherVersions(filteredVersions);
      } catch (err) {
        console.error('Error fetching other versions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherVersions();
  }, [card?.oracleId, card?.oracle_id, currentCardId]);

  // Don't render if no oracle ID available
  if (!card?.oracleId && !card?.oracle_id) {
    return null;
  }

  // Don't render if only one version (the current card)
  if (!loading && !error && otherVersions.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {t('cardDetail.otherVersions', 'Other Versions')}
          {!loading && otherVersions.length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({otherVersions.length} {otherVersions.length === 1 ? t('cardDetail.version', 'version') : t('cardDetail.versions', 'versions')})
            </span>
          )}
        </h2>

        {otherVersions.length > 4 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isExpanded ? t('common.showLess', 'Show Less') : t('common.showAll', 'Show All')}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">{t('cardDetail.errorLoadingVersions', 'Error loading other versions')}: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : otherVersions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('cardDetail.noOtherVersions', 'No other versions found')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
          {(isExpanded ? otherVersions : otherVersions.slice(0, 4)).map((card) => (
            <SearchGridCard
              key={card.id}
              card={card}
              onClick={() => navigate(`/card/${card.id}`)}
              formatPrice={formatPrice}
              getAvailableCount={getAvailableCount}
            />
          ))}
        </div>
      )}

      {otherVersions.length > 4 && !isExpanded && (
        <div className="text-center mt-6">
          <button
            onClick={() => setIsExpanded(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('cardDetail.showMoreVersions', 'Show {{count}} More Versions', { count: otherVersions.length - 4 })}
          </button>
        </div>
      )}
    </section>
  );
};

export default OtherVersions;