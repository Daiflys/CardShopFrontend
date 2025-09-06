import React, { useState, useEffect, useCallback } from "react";
import { getCardsToSell } from "../api/card";
import AddToCartButton from "../components/AddToCartButton";
import { getRarityTextColor } from "../utils/rarity";
import ConditionIcon from "../components/ConditionIcon";

const CardInfoTab = ({ card }) => {
  const [cardsToSell, setCardsToSell] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const fetchCardsToSell = useCallback(async (cardName) => {
    if (!cardName) return;
    
    setLoading(true);
    setError("");
    
    try {
      const data = await getCardsToSell(cardName);
      setCardsToSell(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (card?.name) {
      fetchCardsToSell(card.name);
    }
  }, [card?.name, fetchCardsToSell]);

  if (!card) return null;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="flex-shrink-0 flex justify-center">
          <img src={card.imageUrl ?? card.image ?? ""} alt={card.name ?? ""} className="w-64 h-auto rounded-lg shadow-lg border" />
        </div>
        {/* Main info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-900 mb-1">{card.name ?? "Unknown"}</h1>
          <div className="text-lg text-gray-600 mb-2">{card.set_name ?? card.setName ?? card.set ?? "Unknown"} - Singles</div>
          <div className="flex flex-wrap gap-4 mb-4">
            <div><b>Rarity:</b> <span className={getRarityTextColor(card.rarity)}>{card.rarity ?? "Unknown"}</span></div>
            <div><b>Number:</b> {card.number ?? "Unknown"}</div>
            <div><b>Printed in:</b> <span className="text-blue-700 font-semibold">{card.printedIn ?? "Unknown"}</span></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            <div><b>Available items</b><br />{card.available ?? "Unknown"}</div>
            <div><b>From</b><br />{card.from != null ? Number(card.from).toFixed(2) : "Unknown"} €</div>
            <div><b>Price Trend</b><br />{card.priceTrend != null ? Number(card.priceTrend).toFixed(2) : "Unknown"} €</div>
            <div><b>30-days avg</b><br />{card.avg30 != null ? Number(card.avg30).toFixed(2) : "Unknown"} €</div>
            <div><b>7-days avg</b><br />{card.avg7 != null ? Number(card.avg7).toFixed(2) : "Unknown"} €</div>
            <div><b>1-day avg</b><br />{card.avg1 != null ? Number(card.avg1).toFixed(2) : "Unknown"} €</div>
          </div>
          <div className="mb-4">
            <b>Rules Text</b>
            <ul className="list-disc ml-6 text-gray-700">
              {(card.rules && card.rules.length > 0)
                ? card.rules.map((r, i) => <li key={i}>{r ?? "Unknown"}</li>)
                : <li>Unknown</li>
              }
            </ul>
          </div>
        </div>
        {/* Chart (placeholder) */}
        <div className="hidden md:block w-72">
          <div className="bg-gray-100 rounded-lg p-4 shadow flex flex-col items-center">
            <span className="font-semibold mb-2">Avg. Sell Price</span>
            <div className="w-full h-32 bg-white rounded border flex items-center justify-center text-gray-400">
              [Graph Placeholder]
            </div>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-700 text-white px-2 py-1 rounded">Facebook</button>
              <button className="bg-black text-white px-2 py-1 rounded">X</button>
              <button className="bg-green-600 text-white px-2 py-1 rounded">WhatsApp</button>
              <button className="bg-orange-600 text-white px-2 py-1 rounded">Reddit</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sellers table */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Sellers</h2>
        {loading ? (
          <div className="text-center py-4">
            <div className="text-gray-600">Loading sellers...</div>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-red-600 mb-2">Error: {error}</div>
            <button 
              onClick={() => fetchCardsToSell(card.name)} 
              className="bg-blue-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        ) : cardsToSell.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-gray-600">No cards for sale for "{card?.name}"</div>
            <div className="text-sm text-gray-500">Be the first to sell this card</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="px-3 py-2 text-left">Set</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">Condition</th>
                  <th className="px-3 py-2 text-left">Available</th>
                  <th className="px-3 py-2 text-left">Seller ID</th>
                  <th className="px-3 py-2 text-left">Quantity</th>
                  <th className="px-3 py-2 text-right">Add to Cart</th>
                </tr>
              </thead>
              <tbody>
                {cardsToSell.map((cardToSell, i) => {
                  const listingId = cardToSell.id 
                    ?? cardToSell.cardToSellId 
                    ?? cardToSell.cardId 
                    ?? cardToSell.listingId 
                    ?? cardToSell._id 
                    ?? `${cardToSell.userId ?? 'nouser'}-${cardToSell.setName ?? 'noset'}-${i}`;
                  
                  // Crear el objeto card aquí para que se recalcule cuando cambie selectedQuantities
                  const selectedQty = selectedQuantities[listingId] || 1;
                  console.log(`🔄 Rendering card ${listingId} with quantity:`, selectedQty);
                  
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
                  
                  console.log(`🛍️ CardForCart object for ${listingId}:`, cardForCart);
                  
                  return (
                  <tr key={`${listingId}`} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">{cardToSell.setName ?? "Unknown"}</td>
                    <td className="px-3 py-2 font-semibold text-green-600">
                      €{cardToSell.cardPrice?.toFixed(2) ?? "Unknown"}
                    </td>
                    <td className="px-3 py-2">
                      <ConditionIcon condition={cardToSell.condition} />
                    </td>
                    <td className="px-3 py-2 font-semibold text-blue-600">
                      {cardToSell.quantity ?? "Unknown"}
                    </td>
                    <td className="px-3 py-2">{cardToSell.userId ?? "Unknown"}</td>
                    <td className="px-3 py-2">
                      {cardToSell.cardPrice ? (
                        <select 
                          className="border rounded px-2 py-1 text-sm"
                          value={selectedQuantities[listingId] || 1}
                          onChange={e => setSelectedQuantities(prev => ({
                            ...prev,
                            [listingId]: parseInt(e.target.value)
                          }))}
                        >
                          {Array.from({length: Math.min(cardToSell.quantity || 1, 10)}, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {cardToSell.cardPrice ? (
                        <AddToCartButton 
                          card={cardForCart}
                          className="px-3 py-1 text-sm"
                          onAddToCart={() => {
                            setSelectedQuantities(prev => ({
                              ...prev,
                              [listingId]: 1
                            }));
                          }}
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">Sin precio</span>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default CardInfoTab; 