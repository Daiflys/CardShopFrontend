import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SearchResultsGrid from './SearchResultsGrid';

const OtherVersions = ({ card, currentCardId, otherVersions = [], hasAvailability = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Don't render if no oracle ID available
  if (!card?.oracleId) {
    return null;
  }

  // Don't render if no other versions
  if (otherVersions.length === 0) {
    return null;
  }

  const handleCardClick = (cardToNavigate) => {
    navigate(`/card/${cardToNavigate.id}`);
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {t('cardDetail.otherVersions', 'Other Versions')}
          {otherVersions.length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({otherVersions.length} {otherVersions.length === 1 ? t('cardDetail.version', 'version') : t('cardDetail.versions', 'versions')})
            </span>
          )}
        </h2>
      </div>

      <SearchResultsGrid
        cards={otherVersions}
        onCardClick={handleCardClick}
        loading={false}
        error={null}
        emptyMessage={t('cardDetail.noOtherVersions', 'No other versions found')}
        showExpand={true}
        maxDisplayed={4}
        expandText={t('common.showAll', 'Show All')}
        collapseText={t('common.showLess', 'Show Less')}
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