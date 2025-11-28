import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";
import { getRarityTextColor, getRarityIcon } from "../utils/rarity";
import RarityCircle from "../components/RarityCircle";
import ConditionIcon from "../components/ConditionIcon";
import { getColorSymbols, parseManaCost, parseOracleText } from "../data/colorSymbols.jsx";
import { getSetIcon } from "../data/sets.js";
import useRecentlyViewedStore from "../store/recentlyViewedStore.js";
import RecentlyViewed from "../components/RecentlyViewed.jsx";
import OtherVersions from "../components/OtherVersions.jsx";
import { getLanguageFlag } from "../utils/languageFlags.jsx";
import {
  filterDisplayedLegalities,
  formatLegalityFormat,
  formatLegalityStatus,
  getLegalityStatusColor
} from '../utils/cardLegalities';
import Button from '../design/components/Button';

const CardInfoTab = ({ card }) => {
  const navigate = useNavigate();
  const [cardsToSell, setCardsToSell] = useState([]);
  const addRecentlyViewed = useRecentlyViewedStore(state => state.addRecentlyViewed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [showZoomModal, setShowZoomModal] = useState(false);

  // Build the combined list of cards to sell when card data changes
  useEffect(() => {
    if (!card) return;

    // Combine cardsToSell from the current card language + other languages (same set)
    const currentLanguageCards = card.cardsToSell || [];
    const otherLanguageCards = card.otherLanguagesCardsToSell || [];

    console.log('📦 Current language cards:', currentLanguageCards.length);
    console.log('🌍 Other language cards (same set):', otherLanguageCards.length);

    // Combine both lists (max 8 total)
    const combinedList = [...currentLanguageCards, ...otherLanguageCards].slice(0, 8);

    setCardsToSell(combinedList);
    setLoading(false);
  }, [card]);

  // Add card to recently viewed when component mounts
  useEffect(() => {
    if (card && card.id && card.cardName) {
      addRecentlyViewed(card);
    }
  }, [card, addRecentlyViewed]);

  const handleExpansionClick = (e) => {
    e.preventDefault();
    const setCode = card.set || card.setCode;
    if (setCode) {
      navigate(`/search?set=${encodeURIComponent(setCode)}`);
    }
  };

  if (!card) return null;


  return (
    <div className="max-w-6xl mx-auto px-0 py-4 sm:px-4 space-y-8">
      {/* Section 1: Card Image + Cards to Sell */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Card Image with Zoom */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <div className="relative">
            <img
              src={card.imageUrl ?? card.image ?? ""}
              alt={card.cardName ?? ""}
              className="w-80 h-auto rounded-lg shadow-lg border cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setShowZoomModal(true)}
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              🔍 Zoom In
            </div>
          </div>
        </div>

        {/* Cards to Sell Table */}
        <div className="flex-1">
          <div className="mb-4 pl-6 sm:pl-0">
            <div className="flex items-center gap-3 mb-2">
              {/* Language Flag */}
              <div className="transform scale-150">
                {(() => {
                  const language = (card.language || card.lang || 'en').toLowerCase();
                  // Handle common variations
                  const normalizedLanguage = language === 'jp' ? 'ja' : language;
                  return getLanguageFlag(normalizedLanguage, 'normal');
                })()}
              </div>
              <h1 className="text-2xl font-bold text-gray-700 mb-0 truncate whitespace-nowrap">
                {card.cardName ?? "Unknown"}
              </h1>
            </div>
            <div className="text-sm text-gray-600 mb-4 pl-1 sm:pl-0">
              Home &gt; {card.setName ?? "Unknown"} &gt; {card.rarity ?? "Unknown"}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading cards for sale...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600">Error: {error}</div>
            </div>
          ) : cardsToSell.length === 0 ? (
            <div className="sm:bg-white sm:rounded-lg sm:shadow overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 border-b">
                <div className="grid grid-cols-6 gap-2 text-sm font-semibold text-gray-700">
                  <div>Condition</div>
                  <div>Language</div>
                  <div>Foil</div>
                  <div>Price</div>
                  <div>Stock</div>
                  <div>Qty</div>
                </div>
              </div>
              <div className="divide-y">
                {['NM', 'EX', 'GD', 'LP'].map((condition, index) => (
                  <div key={condition} className={`px-4 py-2 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="grid grid-cols-6 gap-2 items-center">
                      <div className="flex items-center">
                        <ConditionIcon condition={condition} />
                      </div>
                      <div className="text-gray-400 text-sm">
                        -
                      </div>
                      <div className="text-gray-400 text-sm">
                        -
                      </div>
                      <div className="text-gray-400 text-sm">
                        -
                      </div>
                      <div className="text-gray-400 text-sm">
                        0
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled
                          title="No stock available"
                          className="whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="sm:bg-white sm:rounded-lg sm:shadow overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 border-b">
                <div className="grid grid-cols-6 gap-2 text-sm font-semibold text-gray-700">
                  <div>Condition</div>
                  <div>Language</div>
                  <div>Foil</div>
                  <div>Price</div>
                  <div>Stock</div>
                  <div>Qty</div>
                </div>
              </div>
              <div className="divide-y">
                {cardsToSell.slice(0, 8).map((cardToSell, i) => {
                  const listingId = cardToSell.id ?? `listing-${i}`;
                  const selectedQty = selectedQuantities[listingId] || 1;

                  console.log(`📋 Card to sell #${i}:`, cardToSell);

                  // Build card object for cart - all cards are from the same set, just different languages
                  const cardForCart = {
                    id: listingId,
                    cardToSellId: cardToSell.id, // The actual ID needed for checkout
                    cardName: card.cardName,
                    imageUrl: card.imageUrl || card.image,
                    price: cardToSell.cardPrice,
                    set: card.setName,
                    quantity: selectedQty,
                    condition: cardToSell.condition,
                    available: cardToSell.quantity
                  };

                  console.log(`🛒 CardForCart #${i}:`, cardForCart);

                  // Get language flag
                  const language = (cardToSell.language || 'en').toLowerCase();
                  const normalizedLanguage = language === 'jp' ? 'ja' : language;

                  // Get finish/foil display
                  const finish = cardToSell.finish || 'nonfoil';
                  const foilDisplay = finish === 'foil' ? '⭐' : finish === 'etched' ? '⚡' : '';

                  return (
                    <div key={listingId} className={`px-4 py-2 hover:bg-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <div className="grid grid-cols-6 gap-2 items-center">
                        <div className="flex items-center">
                          <ConditionIcon condition={cardToSell.condition} />
                        </div>
                        <div className="flex items-center justify-center">
                          {getLanguageFlag(normalizedLanguage, 'normal')}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {foilDisplay}
                        </div>
                        <div className="font-semibold text-green-600 text-sm">
                          ¥ {cardToSell.cardPrice?.toLocaleString() ?? "Unknown"}
                        </div>
                        <div className="font-semibold text-blue-600 text-sm">
                          {cardToSell.quantity ?? 0}
                        </div>
                        <div className="flex items-center gap-2">
                          {cardToSell.quantity > 0 ? (
                            <>
                              <select
                                className="border rounded px-2 py-1 text-sm w-16 flex-shrink-0"
                                value={selectedQty}
                                onChange={e => setSelectedQuantities(prev => ({
                                  ...prev,
                                  [listingId]: parseInt(e.target.value)
                                }))}
                              >
                                {Array.from({length: Math.min(cardToSell.quantity || 1, 10)}, (_, i) => i + 1).map(num => (
                                  <option key={num} value={num}>{num}</option>
                                ))}
                              </select>
                              <div className="flex-shrink-0 h-8">
                                <AddToCartButton
                                  card={cardForCart}
                                />
                              </div>
                            </>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled
                              className="whitespace-nowrap overflow-hidden text-ellipsis h-8"
                            >
                              Want Notice
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <Button
              variant="info"
              className="w-full whitespace-nowrap overflow-hidden text-ellipsis py-3"
              onClick={() => {
                const otherVersionsSection = document.getElementById('other-versions-section');
                if (otherVersionsSection) {
                  otherVersionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              📍 See other versions
            </Button>
            <Button
              variant="warning"
              className="w-full whitespace-nowrap overflow-hidden text-ellipsis"
            >
              ⓘ About Condition Info
            </Button>
          </div>
        </div>
      </div>

      {/* Section 2: Card Description */}
      <div className="sm:bg-white sm:rounded-lg sm:shadow overflow-hidden">
        <div className="bg-gray-600 text-white px-4 py-2">
          <h2 className="font-semibold">■ Card Description</h2>
        </div>
        {/* Mobile grid version */}
        <div className="block sm:hidden">
          <div className="border-t border-gray-200">
            <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600">Name</div>
            <div className="px-4 py-3 bg-white">{card.cardName || "Unknown"}</div>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600">Color</div>
            <div className="px-4 py-3 bg-white">
              <div className="flex items-center gap-2">
                {card.cardColors && card.cardColors.length > 0 ? (
                  getColorSymbols(card.cardColors).map((colorData, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <img src={colorData.svg_uri} alt={colorData.name} className="w-4 h-4" title={colorData.name} />
                      <span className="text-sm">{colorData.name}</span>
                    </div>
                  ))
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600">Cost</div>
            <div className="px-4 py-3 bg-white">
              <div className="flex items-center gap-1">
                {card.manaCost ? (
                  parseManaCost(card.manaCost).map((manaSymbol, index) => (
                    <img key={index} src={manaSymbol.svg_uri} alt={manaSymbol.symbol} className="w-5 h-5" title={`{${manaSymbol.symbol}}`} />
                  ))
                ) : "-"}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600">Cardtype</div>
            <div className="px-4 py-3 bg-white">{card.typeLine || "Sorcery"}</div>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600">Subtype</div>
            <div className="px-4 py-3 bg-white">-</div>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600">Rarity</div>
            <div className="px-4 py-3 bg-white">
              <div className="flex items-center gap-2">
                <RarityCircle rarity={card.rarity} size="large" />
                <span className="capitalize">{card.rarity || "Rare"}</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600">Oracle</div>
            <div className="px-4 py-3 bg-white">
              {card.oracleText ? (
                parseOracleText(card.oracleText)
              ) : (
                parseOracleText("Return all enchantment cards from your graveyard to the battlefield. (Auras with nothing to enchant remain in your graveyard.)")
              )}
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600">Flavor Text</div>
            <div className="px-4 py-3 bg-white italic">{card.flavorText || "-"}</div>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600">Expansion</div>
            <div className="px-4 py-3 bg-white">
              <div className="flex items-center gap-1">
                {(() => {
                  const setCode = card.set || card.setCode;
                  const setIconUrl = getSetIcon(setCode);
                  return setIconUrl ? (
                    <img src={setIconUrl} alt={`${card.setName || "Urza's Destiny"} icon`} className="w-4 h-4" />
                  ) : null;
                })()}
                <Button variant="link" onClick={handleExpansionClick}>
                  {card.setName || "Urza's Destiny"}
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600">Illustrator</div>
            <div className="px-4 py-3 bg-white">{card.artistName || "-"}</div>
          </div>
          <div className="border-t border-b border-gray-200">
            <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600">Legalities</div>
            <div className="px-4 py-3 bg-white">
              {(() => {
                const displayedLegalities = filterDisplayedLegalities(card.legalities);
                const entries = Object.entries(displayedLegalities);
                if (entries.length === 0) {
                  return <span className="text-gray-500">No legality information available</span>;
                }
                return (
                  <div className="flex flex-wrap gap-1">
                    {entries
                      .sort((a, b) => {
                        const order = { legal: 0, restricted: 1, banned: 2, not_legal: 3 };
                        return (order[a[1]] || 4) - (order[b[1]] || 4);
                      })
                      .map(([format, status]) => (
                        <div key={format} className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getLegalityStatusColor(status)}`}>
                          {formatLegalityFormat(format)}
                        </div>
                      ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
        {/* Desktop/tablet table version */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100 w-32">Name</td>
                <td className="px-4 py-3 bg-white">{card.cardName || "Unknown"}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Color</td>
                <td className="px-4 py-3 bg-gray-200">
                  <div className="flex items-center gap-2">
                    {card.cardColors && card.cardColors.length > 0 ? (
                      getColorSymbols(card.cardColors).map((colorData, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <img
                            src={colorData.svg_uri}
                            alt={colorData.name}
                            className="w-4 h-4"
                            title={colorData.name}
                          />
                          <span className="text-sm">{colorData.name}</span>
                        </div>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Cost</td>
                <td className="px-4 py-3 bg-white">
                  <div className="flex items-center gap-1">
                    {card.manaCost ? (
                      parseManaCost(card.manaCost).map((manaSymbol, index) => (
                        <img
                          key={index}
                          src={manaSymbol.svg_uri}
                          alt={manaSymbol.symbol}
                          className="w-5 h-5"
                          title={`{${manaSymbol.symbol}}`}
                        />
                      ))
                    ) : "-"}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Cardtype</td>
                <td className="px-4 py-3 bg-gray-200">{card.typeLine || "Sorcery"}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Subtype</td>
                <td className="px-4 py-3 bg-white">-</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Rarity</td>
                <td className="px-4 py-3 bg-gray-200">
                  <div className="flex items-center gap-2">
                    <RarityCircle rarity={card.rarity} size="large" />
                    <span className="capitalize">
                      {card.rarity || "Rare"}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Oracle</td>
                <td className="px-4 py-3 bg-white">
                  {card.oracleText ? (
                    parseOracleText(card.oracleText)
                  ) : (
                    parseOracleText("Return all enchantment cards from your graveyard to the battlefield. (Auras with nothing to enchant remain in your graveyard.)")
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Flavor Text</td>
                <td className="px-4 py-3 bg-gray-200 italic">{card.flavorText || "-"}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Expansion</td>
                <td className="px-4 py-3 bg-white">
                  <div className="flex items-center gap-1">
                    {(() => {
                      const setCode = card.set || card.setCode;
                      const setIconUrl = getSetIcon(setCode);
                      return setIconUrl ? (
                        <img
                          src={setIconUrl}
                          alt={`${card.setName || "Urza's Destiny"} icon`}
                          className="w-4 h-4"
                        />
                      ) : null;
                    })()}
                    <Button variant="link" onClick={handleExpansionClick}>
                      {card.setName || "Urza's Destiny"}
                    </Button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Illustrator</td>
                <td className="px-4 py-3 bg-gray-200">
                  {card.artistName || "-"}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Legalities</td>
                <td className="px-4 py-3 bg-white">
                  {(() => {
                    const displayedLegalities = filterDisplayedLegalities(card.legalities);
                    const entries = Object.entries(displayedLegalities);

                    if (entries.length === 0) {
                      return <span className="text-gray-500">No legality information available</span>;
                    }

                    return (
                      <div className="flex flex-wrap gap-2">
                        {entries
                          .sort((a, b) => {
                            // Sort order: legal first, then restricted, then banned/not_legal
                            const order = { legal: 0, restricted: 1, banned: 2, not_legal: 3 };
                            return (order[a[1]] || 4) - (order[b[1]] || 4);
                          })
                          .map(([format, status]) => (
                            <div
                              key={format}
                              className={`px-3 py-1.5 rounded-md text-xs font-medium border ${getLegalityStatusColor(status)}`}
                            >
                              <span className="font-semibold">{formatLegalityFormat(format)}</span>
                              <span className="mx-1">•</span>
                              <span>{formatLegalityStatus(status)}</span>
                            </div>
                          ))
                        }
                      </div>
                    );
                  })()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      {/* Other Versions Section */}
      <div id="other-versions-section">
        <OtherVersions card={card} currentCardId={card?.id} />
      </div>

      {/* Recently Viewed Section */}
      <RecentlyViewed />

      {/* Zoom Modal */}
      {showZoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowZoomModal(false)}>
          <div className="max-w-2xl max-h-full p-4">
            <img
              src={card.imageUrl ?? card.image ?? ""}
              alt={card.cardName ?? ""}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardInfoTab; 
