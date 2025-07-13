import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // Simula un slug (en real, harías un fetch y obtendrías el id/slug real)
      const slug = search.trim().toLowerCase().replace(/\s+/g, "-");
      navigate(`/card/${slug}`);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-blue-800">cardmarket</span>
        <nav className="hidden md:flex gap-4 text-gray-700">
          <a href="#" className="hover:text-blue-600">PRODUCTS</a>
          <a href="#" className="hover:text-blue-600">TRENDS</a>
        </nav>
      </div>
      <form className="flex-1 mx-6" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search Cardmarket..."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </form>
      <div className="flex gap-2">
        <button className="px-4 py-2 border rounded hover:bg-blue-50">LOG IN</button>
        <button className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">SIGN UP</button>
      </div>
    </header>
  );
};

export default Header; 