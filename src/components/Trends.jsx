import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getBestSellers, getBestBargains } from "../api/trends";

const Trends = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [bestBargains, setBestBargains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([getBestSellers(), getBestBargains()])
      .then(([sellers, bargains]) => {
        const normalizeSellers = (arr) => arr.map(item => ({
          id: item.id,
          card_name: item.card_name || item.name,
          image_url: item.image_url || item.imageUrl,
        }));

        const normalizeBargains = (arr) => arr.map(item => ({
          id: item.oracle_id,
          card_name: item.card_name || item.name,
          image_url: item.image_url || item.imageUrl,
        }));
  
        setBestSellers(normalizeSellers(sellers));
        setBestBargains(normalizeBargains(bargains));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading trends...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <section className="mt-16 px-4 md:px-8">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" /></svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Trends</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="card-modern p-6 hover-lift">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Best Sellers</h3>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200 hover:scrollbar-thumb-blue-300">
            {bestSellers.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </div>
        <div className="card-modern p-6 hover-lift">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Best Bargains!</h3>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-200 hover:scrollbar-thumb-amber-300">
            {bestBargains.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trends; 