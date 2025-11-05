import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchGridCard from './SearchGridCard';
import { createFormatPrice, getAvailableCount } from '../utils/cardPricing';
import Button from '../design/components/Button';

const SearchResultsGrid = ({
  cards = [],
  onCardClick,
  loading = false,
  error = null,
  emptyMessage = 'No cards found',
  emptyIcon = null,
  // Simple configuration for common layouts
  columnsConfig = null, // { mobile: 1, tablet: 2, desktop: 3, large: 4 }
  // Or advanced grid configuration (takes precedence over columnsConfig)
  gridCols = null,
  gap = 'gap-4 lg:gap-6',
  showExpand = false,
  maxDisplayed = null,
  expandText = 'Show All',
  collapseText = 'Show Less',
  containerClassName = '',
  onRetry = null
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const formatPrice = createFormatPrice(t);

  // Calculate displayed cards
  const displayedCards = showExpand && maxDisplayed && !isExpanded
    ? cards.slice(0, maxDisplayed)
    : cards;

  const hasMoreCards = showExpand && maxDisplayed && cards.length > maxDisplayed;

  // Build responsive grid classes
  let finalGridCols;

  if (gridCols) {
    // Use advanced gridCols configuration if provided
    finalGridCols = {
      default: 'grid-cols-1',
      sm: 'sm:grid-cols-2',
      md: 'md:grid-cols-3',
      lg: 'lg:grid-cols-3',
      xl: 'xl:grid-cols-4',
      '2xl': '2xl:grid-cols-5',
      ...gridCols
    };
  } else if (columnsConfig) {
    // Use simple columnsConfig if provided
    const { mobile = 1, tablet = 2, desktop = 3, large = null } = columnsConfig;
    finalGridCols = {
      default: `grid-cols-${mobile}`,
      sm: `sm:grid-cols-${tablet}`,
      lg: `lg:grid-cols-${desktop}`,
      xl: large ? `xl:grid-cols-${large}` : `xl:grid-cols-${desktop}`,
      '2xl': large ? `2xl:grid-cols-${large}` : `2xl:grid-cols-${desktop}`
    };
  } else {
    // Default configuration
    finalGridCols = {
      default: 'grid-cols-2',
      sm: 'sm:grid-cols-2',
      md: 'md:grid-cols-3',
      lg: 'lg:grid-cols-3',
      xl: 'xl:grid-cols-4',
      '2xl': '2xl:grid-cols-5'
    };
  }

  const gridClasses = [
    'grid',
    finalGridCols.default,
    finalGridCols.sm,
    finalGridCols.md || '',
    finalGridCols.lg,
    finalGridCols.xl,
    finalGridCols['2xl'],
    gap
  ].filter(Boolean).join(' ');

  // Loading state
  if (loading) {
    return (
      <div className={`text-center py-12 ${containerClassName}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('common.loading', 'Loading...')}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-12 ${containerClassName}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Cards</h3>
          <p className="text-red-700 mb-4">{error}</p>
          {onRetry && (
            <Button
              variant="danger"
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (!cards || cards.length === 0) {
    return (
      <div className={`text-center py-12 ${containerClassName}`}>
        <div className="max-w-md mx-auto">
          {emptyIcon || (
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.438-.896-6.03-2.364C5.412 15.347 6.963 17 12 17s6.588-1.653 6.03-4.364A7.962 7.962 0 0112 15z" />
            </svg>
          )}
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Cards Found</h3>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {/* Cards Grid */}
      <div className={gridClasses}>
        {displayedCards.map((card) => (
          <SearchGridCard
            key={card.id}
            card={card}
            onClick={() => onCardClick && onCardClick(card)}
            formatPrice={formatPrice}
            getAvailableCount={getAvailableCount}
          />
        ))}
      </div>

      {/* Expand/Collapse Controls */}
      {hasMoreCards && (
        <div className="text-center mt-6">
          {!isExpanded ? (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsExpanded(true)}
            >
              {expandText} ({cards.length - maxDisplayed} more)
            </Button>
          ) : (
            <Button
              variant="link"
              onClick={() => setIsExpanded(false)}
            >
              {collapseText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsGrid;