import React from 'react';
import { useNavigate } from 'react-router-dom';
import useRecentlyViewedStore from '../store/recentlyViewedStore.js';

const RecentlyViewed = () => {
  const navigate = useNavigate();
  const recentlyViewed = useRecentlyViewedStore(state => state.getRecentlyViewed());

  // Don't render if no cards
  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  const handleCardClick = (cardId) => {
    navigate(`/card/${cardId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Recently Viewed</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {recentlyViewed.map((card, index) => (
            <div
              key={`${card.cardId}-${index}`}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleCardClick(card.cardId)}
            >
              <img
                src={card.image}
                alt={card.cardName}
                className="w-full aspect-[3/4] object-contain rounded-lg transition-colors bg-gray-50"
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/images/card-placeholder.png'; // Fallback image
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
