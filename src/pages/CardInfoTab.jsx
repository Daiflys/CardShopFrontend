import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";
import { getRarityTextColor, getRarityIcon } from "../utils/rarity";
import RarityCircle from "../components/RarityCircle";
import ConditionIcon from "../components/ConditionIcon";
import { getCardsToSellById } from "../api/card";
import { getColorSymbols, parseManaCost, parseOracleText } from "../data/colorSymbols.jsx";
import { getSetIcon } from "../data/sets.js";
import useRecentlyViewedStore from "../store/recentlyViewedStore.js";
import RecentlyViewed from "../components/RecentlyViewed.jsx";
import OtherVersions from "../components/OtherVersions.jsx";
import { getLanguageFlag } from "../utils/languageFlags.jsx";

const CardInfoTab = ({ card }) => {
  const navigate = useNavigate();
  const [cardsToSell, setCardsToSell] = useState([]);
  const addRecentlyViewed = useRecentlyViewedStore(state => state.addRecentlyViewed);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [showZoomModal, setShowZoomModal] = useState(false);

  const fetchCardsToSell = useCallback(async (cardName, cardId) => {
    if (!cardName) return;

    setLoading(true);
    setError("");

    try {
      const data = await getCardsToSellById(cardId, 0, 100); // Get first 100 results
      setCardsToSell(data.content || data);
    } catch (err) {
      setError(err.message);
      setCardsToSell([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (card?.name) {
      fetchCardsToSell(card.name, card.id);
    }
  }, [card?.name, card?.id, fetchCardsToSell]);

  // Add card to recently viewed when component mounts
  useEffect(() => {
    if (card && card.id && card.name) {
      addRecentlyViewed(card);
    }
  }, [card, addRecentlyViewed]);

  const handleExpansionClick = (e) => {
    e.preventDefault();
    const setCode = card.set || card.setCode || card.set_code;
    if (setCode) {
      navigate(`/search?set=${encodeURIComponent(setCode)}`);
    }
  };

  if (!card) return null;


  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Section 1: Card Image + Cards to Sell */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Card Image with Zoom */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={card.imageUrl ?? card.image ?? ""}
              alt={card.name ?? ""}
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
          <div className="mb-4">
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
              <h1 className="text-2xl font-bold text-gray-700 mb-0">
                {card.name ?? "Unknown"}
              </h1>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Home &gt; {card.setName ?? "Unknown"} &gt; {card.rarity ?? "Unknown"}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading cards for sale...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">Error: {error}</div>
              <button
                onClick={() => fetchCardsToSell(card.name, card.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : cardsToSell.length === 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 border-b">
                <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-700">
                  <div>Condition</div>
                  <div>Price</div>
                  <div>Stock</div>
                  <div>Qty</div>
                </div>
              </div>
              <div className="divide-y">
                {['NM', 'EX', 'GD', 'LP'].map((condition, index) => (
                  <div key={condition} className={`px-4 py-2 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center">
                        <ConditionIcon condition={condition} />
                      </div>
                      <div className="text-gray-400 text-sm">
                        -
                      </div>
                      <div className="text-gray-400 text-sm">
                        0
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1 bg-gray-300 text-gray-500 border border-gray-400 rounded text-sm cursor-not-allowed"
                          disabled
                          title="No stock available"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 border-b">
                <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-700">
                  <div>Condition</div>
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

                  const cardForCart = {
                    id: listingId,
                    cardToSellId: cardToSell.id, // The actual ID needed for checkout
                    cardName: card.name,
                    imageUrl: card.imageUrl || card.image,
                    name: card.name,
                    price: cardToSell.cardPrice,
                    set: cardToSell.setName,
                    sellerId: cardToSell.userId,
                    quantity: selectedQty,
                    condition: cardToSell.condition,
                    available: cardToSell.quantity
                  };

                  console.log(`🛒 CardForCart #${i}:`, cardForCart);

                  return (
                    <div key={listingId} className={`px-4 py-2 hover:bg-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="flex items-center">
                          <ConditionIcon condition={cardToSell.condition} />
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
                                className="border rounded px-2 py-1 text-sm w-16"
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
                              <AddToCartButton
                                card={cardForCart}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                              />
                            </>
                          ) : (
                            <button className="bg-gray-300 text-gray-500 px-3 py-1 text-sm rounded cursor-not-allowed">
                              Want Notice
                            </button>
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
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium">
              📍 See other versions
            </button>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded font-medium">
              ⓘ About Condition Info
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Card Description */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-600 text-white px-4 py-2">
          <h2 className="font-semibold">■ Card Description</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100 w-32">Name</td>
                <td className="px-4 py-3 bg-white">{card.name || "Unknown"}</td>
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
                      <span>Colorless</span>
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
                      const setCode = card.set || card.setCode || card.set_code;
                      const setIconUrl = getSetIcon(setCode);
                      return setIconUrl ? (
                        <img
                          src={setIconUrl}
                          alt={`${card.setName || "Urza's Destiny"} icon`}
                          className="w-4 h-4"
                        />
                      ) : null;
                    })()}
                    <button
                      onClick={handleExpansionClick}
                      className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
                    >
                      {card.setName || "Urza's Destiny"}
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Illustrator</td>
                <td className="px-4 py-3 bg-gray-200">
                  {card.artistName || "Jim Nelson"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      {/* Other Versions Section */}
      <OtherVersions card={card} currentCardId={card?.id} />

      {/* Recently Viewed Section */}
      <RecentlyViewed />

      {/* Zoom Modal */}
      {showZoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowZoomModal(false)}>
          <div className="max-w-2xl max-h-full p-4">
            <img
              src={card.imageUrl ?? card.image ?? ""}
              alt={card.name ?? ""}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardInfoTab; 