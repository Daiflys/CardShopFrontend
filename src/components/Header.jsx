import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const DUMMY_CARDS = [
  { id: 1, name: "Dragon1" },
  { id: 2, name: "Dragon2" },
  { id: 3, name: "Dragon3" },
];

const Header = () => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Filter dummy data as user types (replace with backend call in future)
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim()) {
      // Here you can call your backend endpoint instead of filtering DUMMY_CARDS
      const filtered = DUMMY_CARDS.filter(card =>
        card.name.toLowerCase().includes(value.trim().toLowerCase())
      );
      setResults(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    if (search.trim()) {
      const slug = search.trim().toLowerCase().replace(/\s+/g, "-");
      navigate(`/card/${slug}`);
    }
  };

  const handleResultClick = (card) => {
    setSearch(card.name);
    setShowDropdown(false);
    navigate(`/card/${card.name.toLowerCase().replace(/\s+/g, "-")}`);
  };

  // Hide dropdown if clicked outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-blue-800">cardmarket</span>
        <nav className="hidden md:flex gap-4 text-gray-700">
          <a href="#" className="hover:text-blue-600">PRODUCTS</a>
          <a href="#" className="hover:text-blue-600">TRENDS</a>
        </nav>
      </div>
      <div className="flex-1 mx-6 relative" ref={inputRef}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Cardmarket..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(results.length > 0)}
            autoComplete="off"
          />
        </form>
        {showDropdown && (
          <ul className="absolute z-20 left-0 right-0 bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
            {results.length === 0 ? (
              <li className="px-4 py-2 text-gray-500">No results</li>
            ) : (
              results.map(card => (
                <li
                  key={card.id}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleResultClick(card)}
                >
                  {card.name}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 border rounded hover:bg-blue-50"
          onClick={() => navigate('/login')}
        >LOG IN</button>
        <button
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          onClick={() => navigate('/register')}
        >SIGN UP</button>
      </div>
    </header>
  );
};

export default Header; 