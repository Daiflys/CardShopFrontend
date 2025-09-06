import React from 'react';
import { useTranslation } from 'react-i18next';
import RarityIndicator from './RarityIndicator';
import { getSetIcon } from '../data/sets';
import { getLanguageFlag } from '../utils/languageFlags.jsx';

const SearchGridCard = ({ card, onClick, formatPrice, getAvailableCount }) => {
  const { t } = useTranslation();
  const availableCount = getAvailableCount(card);
  const hasStock = availableCount > 0;

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group hover:shadow-md overflow-hidden relative"
      onClick={onClick}
    >
      {/* Card Image */}
      <div className="aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden p-2">
        {card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt={card.card_name || card.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm">No Image</span>
          </div>
        )}
      </div>
      
      {/* Card Info */}
      <div className="p-3 relative">
        {/* Available badge - only show if there's stock */}
        {hasStock && (
          <div className="absolute top-1 right-1">
            <span className="inline-block px-2 py-1 text-xs font-bold rounded bg-green-500 text-white">
              {availableCount}
            </span>
          </div>
        )}
        
        <div className={`mb-2 ${hasStock ? 'pr-12' : ''}`}>
          {/* Card name with language flag */}
          <div className="flex items-start gap-2 mb-1 relative">
            <h3 className="text-sm font-semibold text-gray-900 flex-1 min-w-0 break-words">
              {card.printedName || card.name}
            </h3>
            <div className="flex-shrink-0 self-start">
              {getLanguageFlag(card.language || 'en', 'normal')}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {card.set_code && getSetIcon(card.set_code) && (
              <img 
                src={getSetIcon(card.set_code)} 
                alt={card.set_code}
                className="w-6 h-6 flex-shrink-0"
              />
            )}
            <p className="text-xs text-gray-500 truncate">
              {card.set_name || card.setName || 'Unknown Set'}
            </p>
          </div>
        </div>
        
        {/* Bottom row with price */}
        <div className="flex justify-end items-center">
          <div className="text-right">
            <span className="text-sm font-bold text-blue-600">
              {formatPrice(card)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Rarity Indicator at the bottom of the entire card */}
      <RarityIndicator rarity={card.rarity} className="rounded-b-lg" />
    </div>
  );
};

export default SearchGridCard;