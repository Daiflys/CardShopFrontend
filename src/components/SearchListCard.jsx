import React from 'react';
import { useTranslation } from 'react-i18next';

const SearchListCard = ({ 
  card, 
  index, 
  onClick, 
  formatPrice, 
  getAvailableCount, 
  getRarityIcon, 
  getRarityColor, 
  hoveredCard, 
  setHoveredCard 
}) => {
  const { t } = useTranslation();
  const availableCount = getAvailableCount(card);

  const handleRowClick = (e) => {
    // Don't trigger row click if clicking on camera icon
    if (e.target.closest('.camera-hover-area')) {
      return;
    }
    onClick();
  };

  return (
    <div 
      className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      }`}
      onClick={handleRowClick}
    >
      <div className="px-4 py-3 grid grid-cols-12 gap-4 items-center relative">
        {/* Camera Icon */}
        <div 
          className="col-span-1 relative"
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div 
            className="camera-hover-area w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors cursor-default"
          >
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1l-1-2H6L5 5H4zm8 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          
          {/* Hover Image */}
          {hoveredCard === card.id && card.imageUrl && (
            <div className="absolute left-full top-0 ml-2 z-[1000] pointer-events-none">
              <img 
                src={card.imageUrl} 
                alt={card.card_name || card.name}
                className="w-48 h-auto max-h-72 object-contain rounded-lg shadow-2xl border-2 border-white bg-white"
              />
            </div>
          )}
        </div>

        {/* Name */}
        <div className="col-span-4">
          <h3 className="font-medium text-blue-600 hover:underline truncate">
            {card.card_name || card.name}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {card.set || card.setName || 'Unknown Set'}
          </p>
        </div>
        
        {/* Rarity */}
        <div className="col-span-1 text-center">
          <span className={`text-lg ${getRarityColor(card.rarity)}`}>
            {getRarityIcon(card.rarity)}
          </span>
        </div>
        
        {/* # (Edition/Set Number) */}
        <div className="col-span-1 text-center text-sm text-gray-600">
          {card.number || card.collector_number || '-'}
        </div>
        
        {/* Available */}
        <div className="col-span-2 text-center text-sm">
          {availableCount}
        </div>
        
        {/* From (Price) */}
        <div className="col-span-3 text-right">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(card)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchListCard;