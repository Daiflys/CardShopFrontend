import React, { useState, useEffect } from 'react';
import { MTG_SETS, getSetByCode } from '../data/sets';
import { searchCardsBulk } from '../api/search';
import { bulkSellCards } from '../api/bulkSell';
import { getRaritySolidColor } from '../utils/rarity';
import { languageOptions as centralizedLanguageOptions } from '../utils/languageFlags.jsx';

const BulkSell = () => {
  const [selectedExpansion, setSelectedExpansion] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [selectedSorting, setSortBy] = useState('Collectors Number');
  const [filteredCards, setFilteredCards] = useState([]);
  const [cardData, setCardData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBulkModification, setShowBulkModification] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openLanguageSelector, setOpenLanguageSelector] = useState(null);
  const cardsPerPage = 50;

  const expansions = Object.values(MTG_SETS).map(set => ({
    code: set.code,
    name: set.name
  })).sort((a, b) => a.name.localeCompare(b.name));

  const rarities = ['All', 'Masterpiece', 'Mythic', 'Rare', 'Time Shifted', 'Uncommon', 'Common', 'Land', 'Special', 'Token', 'Code Card', 'Tip Card'];

  const sortingOptions = ['Collectors Number', 'English Name', 'Local Name', 'Rarity, Number'];

  const conditionOptions = [
    { code: "MT", name: "Mint", color: "bg-cyan-400" },
    { code: "NM", name: "Near Mint", color: "bg-green-500" },
    { code: "EX", name: "Excellent", color: "bg-yellow-600" },
    { code: "GD", name: "Good", color: "bg-yellow-500" },
    { code: "LP", name: "Light Played", color: "bg-orange-500" },
    { code: "PL", name: "Played", color: "bg-red-400" },
    { code: "PO", name: "Poor", color: "bg-red-600" }
  ];

  // Use centralized language options
  const languageOptions = centralizedLanguageOptions;

  const handleFilter = async () => {
    if (!selectedExpansion) {
      setError('Please select an expansion');
      return;
    }

    setLoading(true);
    setError('');
    setFilteredCards([]);
    setCardData({});
    
    try {
      // Prepare filters for the API call
      const filters = {
        set: selectedExpansion,
        rarity: selectedRarity,
        sortBy: selectedSorting
      };

      const cards = await searchCardsBulk(filters);
      setFilteredCards(cards);
      
      // Initialize card data with default values
      const initialCardData = {};
      cards.forEach(card => {
        initialCardData[card.id] = {
          selected: false,
          language: 'en',
          condition: 'NM',
          quantity: 0,
          price: 0.00,
          comments: ''
        };
      });
      setCardData(initialCardData);
      setCurrentPage(1);
      
    } catch (err) {
      setError('Error fetching cards: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCardData = (cardId, field, value) => {
    setCardData(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        [field]: value
      }
    }));
  };

  const copyCard = (card) => {
    // Create a new unique ID for the copy
    const copyId = `${card.id}_copy_${Date.now()}`;
    
    // Find the index of the original card and insert the copy right after it
    const cardCopy = { ...card, id: copyId };
    setFilteredCards(prev => {
      const originalIndex = prev.findIndex(c => c.id === card.id);
      const newArray = [...prev];
      newArray.splice(originalIndex + 1, 0, cardCopy); // Insert right after original
      return newArray;
    });
    
    // Copy the card data but reset quantity and selection
    const originalData = cardData[card.id] || {
      selected: false,
      language: 'en',
      condition: 'NM',
      quantity: 0,
      price: 0.00,
      comments: ''
    };
    
    setCardData(prev => ({
      ...prev,
      [copyId]: { 
        ...originalData,
        selected: false, // Always start unselected
        quantity: 0      // Always start with 0 quantity
      }
    }));
  };


  const handleSubmit = async () => {
    const selectedCards = Object.entries(cardData)
      .filter(([cardId, data]) => data.selected && data.quantity > 0)
      .map(([cardId, data]) => {
        const card = filteredCards.find(c => c.id === cardId);
        return {
          card_id: cardId,
          oracle_id: card.oracle_id,
          set_name: card.set_name,
          card_name: card.name,
          image_url: card.image_url,
          price: parseFloat(data.price),
          condition: data.condition,
          quantity: parseInt(data.quantity),
          comments: data.comments,
          language: data.language
        };
      });

    if (selectedCards.length === 0) {
      setError('Please select at least one card with quantity > 0');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await bulkSellCards(selectedCards);
      setSuccessMessage(`Successfully listed ${selectedCards.length} cards for sale!`);
      
      // Clear selection after successful submission
      const clearedCardData = {};
      Object.keys(cardData).forEach(cardId => {
        clearedCardData[cardId] = {
          ...cardData[cardId],
          selected: false,
          quantity: 0,
          price: 0.00,
          comments: ''
        };
      });
      setCardData(clearedCardData);
      
    } catch (err) {
      setError('Error submitting cards: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const selectedCount = Object.values(cardData).filter(data => data.selected).length;

  // Close language selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openLanguageSelector && !event.target.closest('.language-selector')) {
        setOpenLanguageSelector(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openLanguageSelector]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span className="text-blue-600">Stock</span>
            <span>/</span>
            <span className="text-blue-600">Listing Methods</span>
            <span>/</span>
            <span>Bulk List Cards</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Bulk List Cards</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Expansion */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expansion</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedExpansion}
                onChange={(e) => setSelectedExpansion(e.target.value)}
              >
                <option value="">Select expansion...</option>
                {expansions.map(expansion => (
                  <option key={expansion.code} value={expansion.code}>
                    {expansion.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rarity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rarity</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
              >
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            </div>

            {/* Sort by */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort by</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSorting}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortingOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Filter Button */}
            <div>
              <button
                onClick={handleFilter}
                disabled={loading}
                className="w-full bg-blue-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'FILTERING...' : 'FILTER'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Results */}
        {filteredCards.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            {/* Bulk Modification Toggle */}
            <div className="border-b p-4">
              <button
                onClick={() => setShowBulkModification(!showBulkModification)}
                className="flex items-center text-blue-700 font-semibold hover:text-blue-800"
              >
                <span className={`mr-2 transition-transform ${showBulkModification ? 'rotate-90' : ''}`}>▶</span>
                Bulk modification
              </button>
            </div>

            {/* Results count and pagination */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="text-sm text-gray-600">
                {filteredCards.length} Hits
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border rounded disabled:opacity-50"
                >
                  ←
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>

            {/* Cards Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="p-3 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const newCardData = { ...cardData };
                          currentCards.forEach(card => {
                            newCardData[card.id] = {
                              ...newCardData[card.id],
                              selected: e.target.checked
                            };
                          });
                          setCardData(newCardData);
                        }}
                      />
                    </th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Rarity</th>
                    <th className="p-3 text-left">Language</th>
                    <th className="p-3 text-left">Condition</th>
                    <th className="p-3 text-left">★</th>
                    <th className="p-3 text-left">Comments</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Copy</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCards.map((card, index) => (
                    <tr key={card.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={cardData[card.id]?.selected || false}
                          onChange={(e) => updateCardData(card.id, 'selected', e.target.checked)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="relative"
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredCard({ id: card.id, rect });
                            }}
                            onMouseLeave={() => setHoveredCard(null)}
                          >
                            {/* Camera icon */}
                            <svg 
                              className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                              />
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                              />
                            </svg>
                          </div>

                          {/* Large image tooltip on hover - Fixed positioning */}
                          {hoveredCard && hoveredCard.id === card.id && (card.image_url || card.imageUrl) && (
                            <div 
                              className="fixed z-[9999] bg-white border rounded-lg shadow-2xl p-2 pointer-events-none"
                              style={{
                                left: hoveredCard.rect ? hoveredCard.rect.left - 320 - 8 : '100px',
                                top: hoveredCard.rect ? hoveredCard.rect.bottom - 400 : '100px',
                                width: '320px',
                                maxHeight: '90vh',
                                overflow: 'hidden'
                              }}
                            >
                              <img 
                                src={card.image_url || card.imageUrl} 
                                alt={card.name}
                                className="w-full h-auto rounded max-h-full object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <span className="text-blue-600 hover:underline">{card.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block w-3 h-3 rounded-full ${getRaritySolidColor(card.rarity)}`}></span>
                      </td>
                      <td className="p-3">
                        <div className="relative language-selector">
                          <button
                            className="flex items-center space-x-2 border rounded px-2 py-1 bg-white hover:bg-gray-50 min-w-[120px]"
                            onClick={() => setOpenLanguageSelector(openLanguageSelector === card.id ? null : card.id)}
                          >
                            {(() => {
                              const selectedLang = languageOptions.find(lang => lang.key === (cardData[card.id]?.language || 'en'));
                              return (
                                <>
                                  {selectedLang?.flag}
                                  <span className="text-sm">{selectedLang?.name}</span>
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </>
                              );
                            })()}
                          </button>
                          
                          {openLanguageSelector === card.id && (
                            <div className="absolute z-10 mt-1 w-40 bg-white border rounded-md shadow-lg">
                              {languageOptions.map(lang => (
                                <button
                                  key={lang.key}
                                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 w-full text-left"
                                  onClick={() => {
                                    updateCardData(card.id, 'language', lang.key);
                                    setOpenLanguageSelector(null);
                                  }}
                                >
                                  {lang.flag}
                                  <span className="text-sm">{lang.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          className="border rounded px-2 py-1"
                          value={cardData[card.id]?.condition || 'NM'}
                          onChange={(e) => updateCardData(card.id, 'condition', e.target.value)}
                        >
                          {conditionOptions.map(option => (
                            <option key={option.code} value={option.code}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">★</td>
                      <td className="p-3">
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-24"
                          value={cardData[card.id]?.comments || ''}
                          onChange={(e) => updateCardData(card.id, 'comments', e.target.value)}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="0"
                          className="border rounded px-2 py-1 w-16"
                          value={cardData[card.id]?.quantity || 0}
                          onChange={(e) => updateCardData(card.id, 'quantity', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="border rounded px-2 py-1 w-20"
                          value={cardData[card.id]?.price || 0.00}
                          onChange={(e) => updateCardData(card.id, 'price', parseFloat(e.target.value) || 0.00)}
                        />
                        <span className="ml-1">€</span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => copyCard(card)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy this card"
                        >
                          <svg 
                            className="w-4 h-4 text-gray-600 hover:text-gray-800" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {filteredCards.length} Hits
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border rounded disabled:opacity-50"
                  >
                    ←
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Note: By changing page all input on the form will be lost if unsubmitted.
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Trying to upload more than 100 different articles might result in certain items not being listed. Please upload no more than 100 individual articles. Having multiple of the same article does not affect this restriction.
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || selectedCount === 0}
                  className="w-full bg-blue-700 text-white py-3 px-6 rounded font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'SUBMITTING...' : `PUT CARD(S) ON SALE (${selectedCount} selected)`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredCards.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-500 text-lg">
              Use the filters above to search for products.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkSell;