import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import { getBestSellers, getBestBargains } from "../api/trends";

const Trends = () => {
  const { t } = useTranslation();
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

  if (loading) return <div className="p-8 text-center">{t('trends.loadingTrends')}</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <section className="w-screen py-8" style={{ marginLeft: 'calc(50% - 50vw)' }}>
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center gap-2 mb-8">
        <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" /></svg>
        <h2 className="text-3xl font-bold text-blue-900">{t('trends.title')}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">{t('trends.bestSellers')}</h3>
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200">
            {bestSellers.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">{t('trends.bestBargains')}</h3>
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200">
            {bestBargains.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Trends; 