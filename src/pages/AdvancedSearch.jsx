import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdvancedSearchComponent from '../components/AdvancedSearch';
import PageLayout from '../components/PageLayout';
import { buildSearchUrl } from '../utils/searchUtils';

const AdvancedSearchPage = () => {
  const navigate = useNavigate();

  const handleSearch = (criteria) => {
    // Use centralized search URL builder
    const searchUrl = buildSearchUrl(criteria);
    navigate(searchUrl);
  };

  const handleReset = () => {
    // Reset is handled by the AdvancedSearchComponent itself
    // No need to do anything here
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

          {/* Initial State Message */}
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Search</h3>
            <p className="text-gray-600">
              Use the form above to search for cards with specific criteria.
              <br />
              Results will be displayed on the search results page.
            </p>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default AdvancedSearchPage;
