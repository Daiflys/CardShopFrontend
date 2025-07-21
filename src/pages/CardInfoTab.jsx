import React from "react";

const CardInfoTab = ({ card }) => {
  if (!card) return null;
  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Imagen */}
        <div className="flex-shrink-0 flex justify-center">
          <img src={card.imageUrl ?? card.image ?? ""} alt={card.name ?? ""} className="w-64 h-auto rounded-lg shadow-lg border" />
        </div>
        {/* Info principal */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-900 mb-1">{card.name ?? "Unknown"}</h1>
          <div className="text-lg text-gray-600 mb-2">{card.setName ?? card.set ?? "Unknown"} - Singles</div>
          <div className="flex flex-wrap gap-4 mb-4">
            <div><b>Rarity:</b> {card.rarity ?? "Unknown"}</div>
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
              {(card.sellers && card.sellers.length > 0)
                ? card.sellers.map((s, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{s.name ?? "Unknown"}</td>
                    <td className="px-3 py-2">{s.country ?? "Unknown"}</td>
                    <td className="px-3 py-2">{s.offer != null ? Number(s.offer).toFixed(2) : "Unknown"} €</td>
                    <td className="px-3 py-2">{s.quantity ?? "Unknown"}</td>
                  </tr>
                ))
                : <tr><td colSpan={4} className="text-center text-gray-500">No sellers</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CardInfoTab; 