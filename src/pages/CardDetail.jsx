import React from "react";
import { useParams } from "react-router-dom";

// Mock data para la carta
const mockCard = {
  name: "Dragon Wings",
  set: "Scourge",
  rarity: "Common",
  number: 34,
  printedIn: "Scourge",
  available: 2685,
  from: 0.02,
  priceTrend: 0.20,
  avg30: 0.20,
  avg7: 0.13,
  avg1: 0.27,
  image: "https://cards.scryfall.io/large/front/2/2/22b7e2e2-2e7e-4e2e-8e2e-2e7e2e2e2e2e.jpg?1682206500",
  rules: [
    "Enchanted creature has flying.",
    "Cycling {2}{U} ({2}{U}, Discard this card: Draw a card.)",
    "When a creature with converted mana cost 6 or more enters the battlefield, you may return Dragon Wings from your graveyard to play enchanting that creature."
  ],
  sellers: [
    { name: "NibiruCardsTCG", country: "FR", offer: 0.02, quantity: 1 },
    { name: "NibiruCardsTCG", country: "FR", offer: 0.02, quantity: 4 },
    { name: "NibiruCardsTCG", country: "FR", offer: 0.02, quantity: 1 },
    { name: "ledouble6", country: "FR", offer: 0.02, quantity: 1 },
  ],
};

const CardDetail = () => {
  const { cardId } = useParams();
  // En real, aquí harías fetch/card lookup por cardId
  const card = mockCard;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Imagen */}
          <div className="flex-shrink-0 flex justify-center">
            <img src={card.image} alt={card.name} className="w-64 h-auto rounded-lg shadow-lg border" />
          </div>
          {/* Info principal */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-900 mb-1">{card.name}</h1>
            <div className="text-lg text-gray-600 mb-2">{card.set} - Singles</div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div><b>Rarity:</b> {card.rarity}</div>
              <div><b>Number:</b> {card.number}</div>
              <div><b>Printed in:</b> <span className="text-blue-700 font-semibold">{card.printedIn}</span></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              <div><b>Available items</b><br />{card.available}</div>
              <div><b>From</b><br />{card.from.toFixed(2)} €</div>
              <div><b>Price Trend</b><br />{card.priceTrend.toFixed(2)} €</div>
              <div><b>30-days avg</b><br />{card.avg30.toFixed(2)} €</div>
              <div><b>7-days avg</b><br />{card.avg7.toFixed(2)} €</div>
              <div><b>1-day avg</b><br />{card.avg1.toFixed(2)} €</div>
            </div>
            <div className="mb-4">
              <b>Rules Text</b>
              <ul className="list-disc ml-6 text-gray-700">
                {card.rules.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
          {/* Gráfico (placeholder) */}
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
        {/* Tabla de vendedores */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Sellers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="px-3 py-2 text-left">Seller</th>
                  <th className="px-3 py-2 text-left">Country</th>
                  <th className="px-3 py-2 text-left">Offer</th>
                  <th className="px-3 py-2 text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {card.sellers.map((s, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{s.name}</td>
                    <td className="px-3 py-2">{s.country}</td>
                    <td className="px-3 py-2">{s.offer.toFixed(2)} €</td>
                    <td className="px-3 py-2">{s.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail; 