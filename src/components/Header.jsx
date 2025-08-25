import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchCards } from "../api/search";
import { validateToken } from "../api/auth";
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
    const checkAuth = async () => {
      const isValid = await validateToken();
      
      if (isValid) {
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
      } else {
        setUserEmail(null);
        setUserName(null);
      }
    };

    checkAuth();
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
                  className="px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                  onClick={() => handleResultClick(card)}
                >
                  <div className="font-medium text-gray-900">{card.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {card.set && <span>{card.set}</span>}
                    {card.price && <span className="text-green-600 font-semibold">${card.price}</span>}
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
          <div className="relative">
            <details className="group">
              <summary className="list-none flex items-center gap-2 cursor-pointer select-none">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                  {(userName || userEmail || '?').toString().charAt(0).toUpperCase()}
                </span>
                <span className="text-blue-700 font-semibold hidden sm:inline">{userName || userEmail}</span>
                <svg className="h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </summary>
              <ul className="absolute right-0 mt-2 w-52 bg-white border rounded-md shadow-lg overflow-hidden z-30">
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-50" onClick={() => navigate('/account/profile')}>My account</button>
                </li>
                <li className="border-t">
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-50" onClick={() => navigate('/account/transactions')}>Transactions</button>
                </li>
                <li className="border-t">
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-50" onClick={() => navigate('/account/settings')}>Settings</button>
                </li>
                <li className="border-t">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-red-600"
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("userEmail");
                      setUserName(null);
                      setUserEmail(null);
                      navigate('/');
                    }}
                  >Sign out</button>
                </li>
              </ul>
            </details>
          </div>
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