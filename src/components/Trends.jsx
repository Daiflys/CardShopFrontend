import React from "react";
import ProductCard from "./ProductCard";

const bestSellers = [
  { id: 1, name: "Edge of Eternities Play Bo...", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80" },
  { id: 2, name: "The Wind Crystal", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80" },
  { id: 3, name: "The Fire Crystal", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80" },
];

const bestBargains = [
  { id: 1, name: "Firemane Commando", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80" },
  { id: 2, name: "Filth", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80" },
  { id: 3, name: "Mind Grind", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80" },
];

const Trends = () => (
  <section className="mt-12 px-4 md:px-8">
    <div className="flex items-center gap-2 mb-8">
      <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" /></svg>
      <h2 className="text-3xl font-bold text-blue-900">Trends</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">Best Sellers</h3>
        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200">
          {bestSellers.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">Best Bargains!</h3>
        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200">
          {bestBargains.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Trends; 