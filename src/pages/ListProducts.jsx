import React, { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import ProductCard from "../components/ProductCard";

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

  // Transform products to match ProductCard props
  const transformedProducts = filteredProducts.map(product => ({
    id: product.id || product.name.toLowerCase().replace(/\s+/g, "-"),
    card_name: product.name,
    image_url: product.image_url || "https://via.placeholder.com/120x160?text=Card",
    name: product.name,
    price: product.price,
    set: product.set
  }));

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
            <div className="text-gray-500">Loading products...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div>
              {transformedProducts.length === 0 ? (
                <div className="text-gray-500">No products found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {transformedProducts.map(product => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProducts; 