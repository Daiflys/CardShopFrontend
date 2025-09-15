import React from 'react';
import { useTranslation } from 'react-i18next';
import { getRaritySolidColor } from '../utils/rarity';
import { getLanguageFlag } from '../utils/languageFlags.jsx';

const SearchListCard = ({ 
  card, 
  index, 
  onClick, 
  formatPrice, 
  getAvailableCount, 
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
      <div className="px-4 py-3 grid gap-4 items-center relative overflow-hidden" style={{gridTemplateColumns: '40px 1fr 50px 70px 50px 80px 120px'}}>
        {/* Camera Icon */}
        <div 
          className="relative"
          onMouseEnter={(e) => {
            setHoveredCard(card.id);
            // Store icon position for tooltip positioning
            const rect = e.currentTarget.getBoundingClientRect();
            setHoveredCard({ id: card.id, rect });
          }}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="camera-hover-area">
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
        </div>

        {/* Hover Image - Fixed positioning to be on top of everything */}
        {hoveredCard && hoveredCard.id === card.id && (card.image_url || card.imageUrl) && (
          <div 
            className="fixed z-[9999] bg-white border rounded-lg shadow-2xl p-2 pointer-events-none"
            style={{
              left: hoveredCard.rect ? hoveredCard.rect.left - 320 - 8 : '100px', // Position to the left of icon
              top: hoveredCard.rect ? hoveredCard.rect.bottom - 400 : '100px', // Align bottom of image with bottom of icon
              width: '320px',
              maxHeight: '90vh', // Don't exceed viewport height
              overflow: 'hidden'
            }}
          >
            <img 
              src={card.image_url || card.imageUrl} 
              alt={card.card_name || card.name}
              className="w-full h-auto rounded max-h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Name */}
        <div className="min-w-0 overflow-hidden">
          <h3 className="font-medium text-blue-600 hover:underline truncate text-sm" title={card.card_name || card.name}>
            {card.card_name || card.name}
          </h3>
          <p className="text-xs text-gray-500 truncate" title={card.setName || card.set_name || 'Unknown Set'}>
            {card.setName || card.set_name || 'Unknown Set'}
          </p>
        </div>
        
        {/* Rarity */}
        <div className="text-center">
          {card.rarity ? (
            <span className={`inline-block w-3 h-3 rounded-full ${getRaritySolidColor(card.rarity)}`}></span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
        
        {/* Language */}
        <div className="text-center">
          {getLanguageFlag(card.language || 'en', 'normal')}
        </div>
        
        {/* # (Edition/Set Number) */}
        <div className="text-center text-sm text-gray-600 truncate">
          {card.number || card.collector_number || '-'}
        </div>
        
        {/* Available */}
        <div className="text-center text-sm truncate">
          {availableCount}
        </div>
        
        {/* From (Price) */}
        <div className="text-right truncate">
          <span className="text-sm font-bold text-blue-600">
            {formatPrice(card)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchListCard;