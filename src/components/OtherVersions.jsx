import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getCardsByOracleId } from '../api/card';
import SearchResultsGrid from './SearchResultsGrid';
import usePaginationStore from '../store/paginationStore';
import Card from '../models/Card';

const OtherVersions = ({ card, currentCardId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [otherVersions, setOtherVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const { handlePaginatedResponse } = usePaginationStore();

  // Listen for window resize to update maxDisplayed
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!card?.oracleId) {
      return;
    }

    const oracleId = card.oracleId;

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
          return version.id !== currentCardId && version.cardName && version.id;
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
  }, [card?.oracleId, currentCardId, handlePaginatedResponse]);

  // Don't render if no oracle ID available
  if (!card?.oracleId) {
    return null;
  }

  // Don't render if only one version (the current card)
  if (!loading && !error && otherVersions.length === 0) {
    return null;
  }

  const handleCardClick = (cardToNavigate) => {
    navigate(`/card/${cardToNavigate.id}`);
  };

  const fetchOtherVersionsRetry = () => {
    if (card?.oracleId) {
      const oracleId = card.oracleId;
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
            return version.id !== currentCardId && version.cardName && version.id;
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
    }
  };

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
      </div>

      <SearchResultsGrid
        cards={otherVersions}
        onCardClick={handleCardClick}
        loading={loading}
        error={error}
        emptyMessage={t('cardDetail.noOtherVersions', 'No other versions found')}
        showExpand={true}
        maxDisplayed={isDesktop ? 3 : 2}
        expandText={t('common.showAll', 'Show All')}
        collapseText={t('common.showLess', 'Show Less')}
        onRetry={fetchOtherVersionsRetry}
        columnsConfig={{
          mobile: 2,
          tablet: 2,
          desktop: 3
        }}
      />
    </section>
  );
};

export default OtherVersions;