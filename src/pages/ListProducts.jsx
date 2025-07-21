import React, { useState, useEffect } from "react";
import { getProducts } from "../api/products";

const categories = ["Singles", "Boosters", "Decks"];
const languages = ["English", "Spanish", "German", "French"];
const expansions = ["All", "Core Set", "Expansion 1", "Expansion 2"];

const ListProducts = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [expansion, setExpansion] = useState(expansions[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filter products by name (case-insensitive substring match)
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[70vh] p-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">List Mixed Products</h2>
      <div className="flex gap-8">
        {/* Filters */}
        <div className="w-80 bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <label className="font-semibold">Name
            <input
              type="text"
              className="mt-1 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type to search..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label className="font-semibold">Category
            <select
              className="mt-1 px-3 py-2 border rounded-md w-full"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label className="font-semibold">Language
            <select
              className="mt-1 px-3 py-2 border rounded-md w-full"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </label>
          <label className="font-semibold">Expansion
            <select
              className="mt-1 px-3 py-2 border rounded-md w-full"
              value={expansion}
              onChange={e => setExpansion(e.target.value)}
            >
              {expansions.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </label>
        </div>
        {/* Product Results */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          {loading ? (
            <div className="text-gray-500">Cargando productos...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ul className="space-y-3">
              {filteredProducts.length === 0 ? (
                <li className="text-gray-500">No products found.</li>
              ) : (
                filteredProducts.map(product => (
                  <li key={product.name} className="flex items-center gap-3 text-lg">
                    <span className="text-2xl">{product.icon}</span>
                    <span>{product.name}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProducts; 