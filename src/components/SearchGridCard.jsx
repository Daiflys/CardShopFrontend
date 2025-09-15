import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCartStore from '../store/cartStore';
import RarityIndicator from './RarityIndicator';
import { getSetIcon } from '../data/sets';
import { getLanguageFlag } from '../utils/languageFlags.jsx';

const SearchGridCard = ({ card, onClick, formatPrice, getAvailableCount }) => {
  const { t } = useTranslation();
  const { addItemToCart, loading } = useCartStore();
  
  const availableCount = getAvailableCount(card);
  const hasStock = availableCount > 0;
  const isAvailable = card.available !== false; // Default to true if not specified
  
  // State for quantity selector
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Analyze cardsToSell for NM availability
  const cardsToSell = card.cardsToSell || [];
  const nmCards = cardsToSell.filter(cardToSell => 
    cardToSell.condition && cardToSell.condition.toUpperCase() === 'NM'
  );
  
  const hasNMStock = nmCards.length > 0;
  const nmStock = nmCards.reduce((total, cardToSell) => 
    total + (cardToSell.quantity || 0), 0
  );
  const cheapestNMPrice = hasNMStock 
    ? Math.min(...nmCards.map(cardToSell => cardToSell.price || 0))
    : 0;
  
  // Fallback: if no NM cards but card has general price, use formatPrice
  const displayPrice = hasNMStock ? cheapestNMPrice : null;

  const handleWantNotice = (e) => {
    e.stopPropagation(); // Prevent card click when clicking Want Notice
    // TODO: Implement Want Notice functionality
    console.log('Want Notice clicked for:', card.name);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking Add to Cart
    
    if (adding || loading) return;
    
    try {
      setAdding(true);
      
      // Find the cheapest NM card to add to cart
      const cheapestNMCard = nmCards.find(cardToSell => 
        cardToSell.price === cheapestNMPrice
      );
      
      if (!cheapestNMCard) {
        console.error('No NM card found to add to cart');
        return;
      }
      
      // Use the specific cardToSell ID, not the general card ID
      const listingId = cheapestNMCard.id 
        ?? cheapestNMCard.cardToSellId 
        ?? cheapestNMCard.cardId 
        ?? cheapestNMCard.listingId 
        ?? cheapestNMCard._id;
      
      // Create card object for cart based on CardInfoTab example
      const cardToAdd = {
        id: listingId, // Use the specific cardToSell ID
        card_name: card.name,
        image_url: card.imageUrl,
        name: card.name,
        price: cheapestNMPrice,
        set: card.setName,
        quantity: quantity,
        condition: 'NM',
        available: cheapestNMCard.quantity, // Available stock for this specific listing
        sellerId: cheapestNMCard.userId // Include seller info
      };
      
      const result = await addItemToCart(cardToAdd);
      
      if (result.success) {
        console.log(`Added ${quantity} x ${card.name} (ID: ${listingId}) to cart`);
        // Optionally show success message or reset quantity
        setQuantity(1);
      } else {
        console.error('Failed to add to cart:', result.error);
        // Handle error - could show toast notification
      }
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      // Handle error - could show toast notification
    } finally {
      setAdding(false);
    }
  };

  const handleCheckAvailability = (e) => {
    e.stopPropagation(); // Prevent card click when clicking Check Availability
    onClick(); // Navigate to card details
  };

  const incrementQuantity = (e) => {
    e.stopPropagation();
    setQuantity(prev => Math.min(prev + 1, nmStock)); // Don't exceed available stock
  };

  const decrementQuantity = (e) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(prev - 1, 1)); // Minimum 1
  };

  return (
    <div
      className={`${isAvailable ? 'bg-white' : 'bg-gray-300'} rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group hover:shadow-md overflow-hidden relative w-full max-w-sm mx-auto`}
      onClick={onClick}
    >
      {/* Card Image */}
      <div className={`aspect-[3/4] ${isAvailable ? 'bg-gray-50' : 'bg-gray-300'} rounded-t-lg p-2 sm:p-3`}>
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.card_name || card.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 rounded-md">
            <span className="text-xs sm:text-sm">No Image</span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3 sm:p-4 relative min-h-[100px] sm:min-h-[120px] flex flex-col">

        <div className="mb-2 sm:mb-3 flex-1">
          {/* Card name with language flag */}
          <div className="flex items-start gap-1 sm:gap-2 mb-1 sm:mb-2 relative">
            <h3 className="text-xs sm:text-sm font-semibold text-black-900 flex-1 min-w-0 break-words leading-tight">
              {card.printedName || card.name}
            </h3>
            <div className="flex-shrink-0 self-start">
              {getLanguageFlag(card.language || 'en', 'small')}
            </div>
          </div>
          <div className="flex items-center gap-1 mb-1 sm:mb-2">
            {card.setCode && getSetIcon(card.setCode) && (
              <img
                src={getSetIcon(card.setCode)}
                alt={card.setCode}
                className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0"
              />
            )}
            <p className="text-xs text-black-500 truncate">
              {card.setName || 'Unknown Set'}
            </p>
          </div>
          {/* Additional info line */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs text-black-400 mb-1">
            <span>#{card.collectorNumber || 'N/A'}</span>
            {card.rarity && <span className="capitalize">{card.rarity}</span>}
          </div>
        </div>
        
        {/* Bottom section with price and actions */}
        <div className="mt-auto mb-2 sm:mb-3">
          {isAvailable && hasNMStock ? (
            /* Available with NM stock */
            <>
              {/* NM Price and Stock info */}
              <div className="flex justify-end items-center mb-2">
                <div className="text-right">
                  <div className="text-sm sm:text-lg font-bold text-blue-600">
                    {displayPrice !== null ? `€${cheapestNMPrice.toFixed(2)}` : formatPrice(card)}
                  </div>
                  <div className="text-xs text-gray-500">
                    [NM Stock: {nmStock}]
                  </div>
                </div>
              </div>

              {/* Quantity selector - Compact on mobile */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm text-gray-600">Qty</span>
                <button
                  onClick={decrementQuantity}
                  className="w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 text-gray-600 text-sm"
                >
                  −
                </button>
                <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 text-gray-600 text-sm"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={adding || loading}
                className={`w-full py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 ${
                  adding || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                {adding ? (
                  <>
                    <svg className="animate-spin w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline">Adding...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
                    </svg>
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </>
                )}
              </button>
            </>
          ) : isAvailable && hasStock ? (
            /* Available but no NM stock */
            <>
              {/* Regular price */}
              <div className="flex justify-end items-center mb-2">
                <div className="text-right">
                  <span className="text-sm sm:text-lg font-bold text-blue-600">
                    {formatPrice(card)}
                  </span>
                </div>
              </div>

              {/* Check Availability button */}
              <button
                onClick={handleCheckAvailability}
                className="w-full py-2 px-2 sm:px-3 bg-green-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <span className="hidden sm:inline">Check Availability</span>
                <span className="sm:hidden">Check</span>
              </button>
            </>
          ) : (
            /* Not available */
            <>
              {/* Regular price */}
              <div className="flex justify-end items-center mb-2">
                <div className="text-right">
                  <span className="text-sm sm:text-lg font-bold text-blue-600">
                    {formatPrice(card)}
                  </span>
                </div>
              </div>

              {/* Want Notice button */}
              <button
                onClick={handleWantNotice}
                className="w-full py-2 px-2 sm:px-3 border border-red-400 text-red-600 rounded-md text-xs sm:text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1 sm:gap-2"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Want Notice</span>
                <span className="sm:hidden">Want</span>
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Rarity Indicator at the bottom of the entire card */}
      <RarityIndicator rarity={card.rarity} className="rounded-b-lg" />
    </div>
  );
};

export default SearchGridCard;