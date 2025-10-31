import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdvancedSearchComponent from '../components/AdvancedSearch';
import { advancedSearchCards } from '../api/search';
import SearchResultsGrid from '../components/SearchResultsGrid';
import Pagination from '../components/Pagination';
import PageLayout from '../components/PageLayout';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';

const AdvancedSearchPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [currentCriteria, setCurrentCriteria] = useState({});
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  // Auto-search if URL params are present
  useEffect(() => {
    const name = searchParams.get('name');
    const setCode = searchParams.get('setCode');
    const colors = searchParams.get('colors');
    const rarity = searchParams.get('rarity');

    if (name || setCode || colors || rarity) {
      const criteria = {};
      if (name) criteria.name = name;
      if (setCode) criteria.setCode = setCode;
      if (colors) criteria.colors = colors.split(',');
      if (rarity) criteria.rarity = rarity;

      handleSearch(criteria);
    }
  }, [searchParams]);


  const handleSearch = async (criteria, page = 0) => {
    setIsLoading(true);
    setError(null);
    setCurrentCriteria(criteria);
    setCurrentPage(page);

    try {
      const results = await advancedSearchCards(criteria, page, pageSize, sortBy, sortDirection);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
      console.error('Advanced search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (currentCriteria) {
      handleSearch(currentCriteria, newPage);
    }
  };

  const handleReset = () => {
    setSearchResults(null);
    setError(null);
    setCurrentCriteria({});
    setCurrentPage(0);
  };

  const handleCardClick = (card) => {
    navigate(`/card/${card.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageLayout>
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          {/* Search Form */}
          <div className="mb-8">
            <AdvancedSearchComponent
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">
                <strong>Search Error:</strong> {error}
              </p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults && !isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  {searchResults.totalElements === 0
                    ? 'No cards found matching your criteria'
                    : `Found ${searchResults.totalElements} card${searchResults.totalElements !== 1 ? 's' : ''}`
                  }
                </p>
              </div>

              {/* Sort Options */}
              {searchResults.totalElements > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={`${sortBy || ''}-${sortDirection || ''}`}
                    onChange={(e) => {
                      const [newSortBy, newSortDirection] = e.target.value.split('-');
                      setSortBy(newSortBy || null);
                      setSortDirection(newSortDirection || null);
                      if (currentCriteria) {
                        handleSearch(currentCriteria, 0);
                      }
                    }}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="-">Default</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="cmc-asc">Mana Cost (Low to High)</option>
                    <option value="cmc-desc">Mana Cost (High to Low)</option>
                    <option value="set-asc">Set (A-Z)</option>
                    <option value="rarity-asc">Rarity</option>
                  </select>
                </div>
              )}
            </div>

            {/* Cards Grid */}
            <SearchResultsGrid
              cards={searchResults.totalElements > 0 ? searchResults.content : []}
              onCardClick={handleCardClick}
              loading={false}
              error={null}
              emptyMessage="Try adjusting your search criteria or removing some filters."
              emptyIcon={
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.438-.896-6.03-2.364C5.412 15.347 6.963 17 12 17s6.588-1.653 6.03-4.364A7.962 7.962 0 0112 15z" />
                </svg>
              }
              columnsConfig={{
                mobile: 2,
                tablet: 2,
                desktop: 3
              }}
              containerClassName="mb-8"
            />

            {/* Pagination */}
            {searchResults && searchResults.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={searchResults.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}

          {/* Initial State */}
          {!searchResults && !isLoading && !error && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Search</h3>
              <p className="text-gray-600">
                Use the form above to search for cards with specific criteria.
              </p>
            </div>
          )}
        </div>
      </PageLayout>
    </div>
  );
};

export default AdvancedSearchPage;