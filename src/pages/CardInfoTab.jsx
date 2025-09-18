import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";
import { getRarityTextColor } from "../utils/rarity";
import ConditionIcon from "../components/ConditionIcon";
import { getCardsToSellById } from "../api/card";
import { getColorSymbols, parseManaCost } from "../data/colorSymbols";

const CardInfoTab = ({ card }) => {
  const navigate = useNavigate();
  const [cardsToSell, setCardsToSell] = useState([]);
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

  const handleExpansionClick = (e) => {
    e.preventDefault();
    const setCode = card.set || card.setCode || card.set_code;
    if (setCode) {
      navigate(`/search?set=${encodeURIComponent(setCode)}`);
    }
  };

  if (!card) return null;

  // Mock related cards for now (will be implemented later)
  const relatedCards = [
    {
      id: 1,
      name: "Replenish",
      language: "JP",
      price: 14000,
      stock: 8,
      condition: "NM",
      imageUrl: card.imageUrl
    },
    {
      id: 2,
      name: "Replenish",
      language: "EN",
      price: 18000,
      stock: 5,
      condition: "NM",
      imageUrl: card.imageUrl
    },
    {
      id: 3,
      name: "Replenish",
      language: "EN",
      price: 70000,
      stock: 0,
      condition: "Foil",
      imageUrl: card.imageUrl
    },
    {
      id: 4,
      name: "Replenish",
      language: "JP",
      price: 75000,
      stock: 2,
      condition: "Foil",
      imageUrl: card.imageUrl
    },
  ];

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
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              {card.name ?? "Unknown"} [UDS]
            </h1>
            <div className="text-sm text-gray-600 mb-4">
              Home &gt; {card.set_name ?? card.setName ?? "Unknown"} &gt; Mythic Rare &amp; Rare
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
            <div className="text-center py-8">
              <div className="text-gray-600">No cards for sale</div>
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

                  const cardForCart = {
                    id: listingId,
                    card_name: card.name,
                    image_url: card.imageUrl || card.image,
                    name: card.name,
                    price: cardToSell.cardPrice,
                    set: cardToSell.setName,
                    sellerId: cardToSell.userId,
                    quantity: selectedQty,
                    condition: cardToSell.condition,
                    available: cardToSell.quantity
                  };

                  return (
                    <div key={listingId} className="px-4 py-3 hover:bg-gray-50">
                      <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="flex items-center">
                          <ConditionIcon condition={cardToSell.condition} />
                        </div>
                        <div className="font-semibold text-green-600">
                          ¥ {cardToSell.cardPrice?.toLocaleString() ?? "Unknown"}
                        </div>
                        <div className="font-semibold text-blue-600">
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
              <tr className="bg-gray-100">
                <td className="px-4 py-3 font-medium text-gray-700 w-32">Name</td>
                <td className="px-4 py-3">{card.name || "Unknown"}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Color</td>
                <td className="px-4 py-3">
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
              <tr className="bg-gray-100">
                <td className="px-4 py-3 font-medium text-gray-700">Cost</td>
                <td className="px-4 py-3">
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
                    ) : (
                      parseManaCost("{3}{W}").map((manaSymbol, index) => (
                        <img
                          key={index}
                          src={manaSymbol.svg_uri}
                          alt={manaSymbol.symbol}
                          className="w-5 h-5"
                          title={`{${manaSymbol.symbol}}`}
                        />
                      ))
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Cardtype</td>
                <td className="px-4 py-3">{card.typeLine || "Sorcery"}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-4 py-3 font-medium text-gray-700">Subtype</td>
                <td className="px-4 py-3">-</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Rarity</td>
                <td className="px-4 py-3">
                  <span className={getRarityTextColor(card.rarity)}>
                    {card.rarity || "Rare"}
                  </span>
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-4 py-3 font-medium text-gray-700">Oracle</td>
                <td className="px-4 py-3">{card.oracleText || "Return all enchantment cards from your graveyard to the battlefield. (Auras with nothing to enchant remain in your graveyard.)"}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Flavor Text</td>
                <td className="px-4 py-3 italic">{card.flavorText || "-"}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-4 py-3 font-medium text-gray-700">Expansion</td>
                <td className="px-4 py-3">
                  <button
                    onClick={handleExpansionClick}
                    className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
                  >
                    {card.set_name || card.setName || "Urza's Destiny"}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Block</td>
                <td className="px-4 py-3">{card.block || "Urza"}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-4 py-3 font-medium text-gray-700">Illustrator</td>
                <td className="px-4 py-3">
                  <a href="#" className="text-blue-600 hover:underline">
                    {card.artistName || "Jim Nelson"}
                  </a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100">Legality</td>
                <td className="px-4 py-3">Legacy, Vintage, Commander, Middle School</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-center text-sm text-blue-600 space-x-4">
          <a href="#" className="hover:underline">Regarding Item Images on the Website.</a>
          <a href="#" className="hover:underline">View our returns policy here.</a>
        </div>
      </div>

      {/* Section 3: Related Cards */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Items: {relatedCards.length}</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm">
                <input type="checkbox" className="mr-1" />
                In stock only
              </label>
              <div className="flex gap-1">
                <span className="px-2 py-1 bg-gray-200 text-xs rounded">Normal</span>
                <span className="px-2 py-1 bg-green-200 text-xs rounded">Foil</span>
                <span className="px-2 py-1 bg-red-200 text-xs rounded">JP</span>
                <span className="px-2 py-1 bg-pink-200 text-xs rounded">EN</span>
                <span className="px-2 py-1 bg-purple-200 text-xs rounded">Other</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <div>
              Display Order: <strong>Price Descending</strong> • Price Ascending
            </div>
            <div>Page 1/1 / Last</div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {relatedCards.map((relatedCard) => (
              <div key={relatedCard.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="text-center mb-3">
                  <img
                    src={relatedCard.imageUrl}
                    alt={relatedCard.name}
                    className="w-24 h-32 object-cover mx-auto rounded border"
                  />
                </div>
                <div className="text-center text-xs mb-2">
                  [{relatedCard.language}] 『{relatedCard.name}』 [{relatedCard.condition}]
                </div>
                <div className="text-center text-lg font-bold mb-2">
                  ¥ {relatedCard.price.toLocaleString()}
                </div>
                <div className="text-center text-sm text-gray-600 mb-3">
                  {relatedCard.stock > 0
                    ? `[NM Stock:${relatedCard.stock}]`
                    : `[NM Stock:${relatedCard.stock}]`
                  }
                </div>

                {relatedCard.stock > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <label className="text-sm">Qty</label>
                      <button className="border px-2 py-1 text-sm">−</button>
                      <span className="px-3 py-1 border text-sm">1</span>
                      <button className="border px-2 py-1 text-sm">+</button>
                    </div>
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm">
                      Add to Cart 🛒
                    </button>
                    <div className="text-xs text-center text-gray-500">
                      Weekly Sold : 3 items
                    </div>
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 rounded text-sm">
                      Same Name Search
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button className="w-full bg-gray-300 text-gray-600 py-2 rounded text-sm cursor-not-allowed">
                      Want Notice ✉
                    </button>
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 rounded text-sm">
                      Same Name Search
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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