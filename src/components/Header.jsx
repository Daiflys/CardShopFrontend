import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchCards } from "../api/search";
import AddToCartButton from "./AddToCartButton";
import CartIcon from "./CartIcon";

const Header = () => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);

    const token = localStorage.getItem("authToken");
    if (token && token.split(".").length === 3) {
      try {
        const payloadBase64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const payloadJson = JSON.parse(atob(payloadBase64));
        const nameFromToken = payloadJson.username || payloadJson.name || payloadJson.sub || payloadJson.email || null;
        if (nameFromToken) setUserName(nameFromToken);
      } catch {
        // ignore decoding errors
      }
    }
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim()) {
      setLoading(true);
      try {
        const res = await searchCards(value);
        setResults(res);
        setShowDropdown(res.length > 0);
      } catch {
        setResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
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
    navigate(`/card/${card.id}`); 
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
        <span 
          className="text-2xl font-bold text-blue-800 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => navigate('/')}
        >
          cardmarket
        </span>
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
            {loading ? (
              <li className="px-4 py-2 text-gray-500">Searching...</li>
            ) : results.length === 0 ? (
              <li className="px-4 py-2 text-gray-500">No results</li>
            ) : (
              results.map(card => (
                <li
                  key={card.id}
                  className="px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleResultClick(card)}
                    >
                      <div className="font-medium text-gray-900">{card.name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {card.set && <span>{card.set}</span>}
                        {card.price && <span className="text-green-600 font-semibold">${card.price}</span>}
                      </div>
                    </div>
                    <div className="ml-3" onClick={(e) => e.stopPropagation()}>
                      <AddToCartButton 
                        card={card}
                        className="px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <div className="flex gap-4 items-center">
        <CartIcon />
        {userEmail || userName ? (
          <>
            <span className="text-blue-700 font-semibold">Hello {userName || userEmail}</span>
            <button
              className="px-4 py-2 border rounded hover:bg-blue-50"
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userEmail");
                setUserName(null);
                setUserEmail(null);
                navigate('/');
              }}
            >Sign out</button>
          </>
        ) : (
          <span className="text-gray-500">Sign in</span>
        )}
        {!userEmail && !userName && (
          <>
            <button
              className="px-4 py-2 border rounded hover:bg-blue-50"
              onClick={() => navigate('/list-products')}
            >List Products</button>
            <button
              className="px-4 py-2 border rounded hover:bg-blue-50"
              onClick={() => navigate('/login')}
            >LOG IN</button>
            <button
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              onClick={() => navigate('/register')}
            >SIGN UP</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 