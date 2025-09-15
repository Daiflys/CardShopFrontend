import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { searchCards } from "../api/search";
import { validateToken } from "../api/auth";
import { decodeJWTToken } from "../utils/oauth";
import CartIcon from "./CartIcon";
import LanguageSwitcherFlags from "./LanguageSwitcherFlags";
import { getSetIcon } from "../data/sets";

const Header = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const currentSearchRef = useRef(0);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);

  const checkAuth = async () => {
    const isValid = await validateToken();
    
    if (isValid) {
      const email = localStorage.getItem("userEmail");
      setUserEmail(email);

      const token = localStorage.getItem("authToken");
      if (token && token.split(".").length === 3) {
        try {
          const payloadJson = decodeJWTToken(token);
          if (payloadJson) {
            const nameFromToken = payloadJson.username || payloadJson.name || payloadJson.sub || payloadJson.email || null;
            if (nameFromToken) setUserName(nameFromToken);
          }
        } catch {
          // ignore decoding errors
        }
      }
    } else {
      setUserEmail(null);
      setUserName(null);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for localStorage changes (for cross-tab updates)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'userEmail') {
        checkAuth();
      }
    };

    // Listen for custom auth events (for same-tab updates)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearch(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Increment search counter for race condition prevention
    currentSearchRef.current += 1;
    const currentSearchId = currentSearchRef.current;
    
    if (value.trim()) {
      if (value.length < 3) {
        setResults([]);
        setShowDropdown(false);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      // Debounce search by 300ms
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await searchCards(value, {}, 0, 20); // First page, 20 results
          
          // Handle paginated response
          const searchResults = res.content || res;
          
          // Only update if this is still the latest search
          if (currentSearchId === currentSearchRef.current) {
            // Remove duplicates by card name (prioritizing exact matches and lower IDs)
            const uniqueResults = searchResults.filter((card, index, self) => {
              const cardName = card.name || card.card_name;
              return index === self.findIndex(c => {
                const cName = c.name || c.card_name;
                return cName && cardName && cName.toLowerCase() === cardName.toLowerCase();
              });
            });
            setResults(uniqueResults.slice(0, 10));
            setShowDropdown(uniqueResults.length > 0);
          }
        } catch {
          // Only update if this is still the latest search
          if (currentSearchId === currentSearchRef.current) {
            setResults([]);
            setShowDropdown(false);
          }
        } finally {
          // Only update if this is still the latest search
          if (currentSearchId === currentSearchRef.current) {
            setLoading(false);
          }
        }
      }, 300);
    } else {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleResultClick = (card) => {
    setSearch(card.name);
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(card.name)}`); 
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
    <header className="w-screen bg-gradient-to-r from-sky-50 to-blue-50 shadow-md border-b border-sky-200" style={{ marginLeft: 'calc(50% - 50vw)' }}>
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-8 py-4 w-full max-w-none">
        <div className="flex items-center gap-4">
          <span
            className="text-2xl font-bold text-sky-700 cursor-pointer hover:text-sky-600 transition-colors"
            onClick={() => navigate('/')}
          >
            トレカ市場
          </span>
          <nav className="flex gap-4 text-slate-600">
            <a href="#" className="hover:text-sky-600 transition-colors">{t('homepage.trendingCards').toUpperCase()}</a>
          </nav>
        </div>
        <div className="flex-1 mx-6 relative" ref={inputRef}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              id="search-cards"
              name="search"
              placeholder={t('common.search') + ' トレカ市場...'}
              className="w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white/80"
              value={search}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(results.length > 0)}
              autoComplete="off"
            />
          </form>
          {showDropdown && (
            <ul className="absolute z-20 left-0 right-0 bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {loading ? (
                <li className="px-4 py-2 text-gray-500">{t('common.loading')}</li>
              ) : results.length === 0 ? (
                <li className="px-4 py-2 text-gray-500">{t('common.noResults')}</li>
              ) : (
                results.map(card => (
                  <li
                    key={card.id}
                    className="px-4 py-3 hover:bg-sky-50 border-b border-sky-100 last:border-b-0 cursor-pointer"
                    onClick={() => handleResultClick(card)}
                  >
                    <div className="flex items-center gap-2">
                      {card.set_code && getSetIcon(card.set_code) && (
                        <img
                          src={getSetIcon(card.set_code)}
                          alt={card.set_code}
                          className="w-4 h-4 flex-shrink-0"
                        />
                      )}
                      <div className="font-medium text-gray-900">{card.name}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
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
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold shadow-md">
                    {(userName || userEmail || '?').toString().charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sky-700 font-semibold">{userName || userEmail}</span>
                  <svg className="h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                  </svg>
                </summary>
                <ul className="absolute right-0 mt-2 w-52 bg-white border rounded-md shadow-lg overflow-hidden z-30">
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-sky-50 text-slate-700" onClick={() => navigate('/account/profile')}>{t('account.profile')}</button>
                  </li>
                  <li className="border-t border-sky-100">
                    <button className="w-full text-left px-4 py-2 hover:bg-sky-50 text-slate-700" onClick={() => navigate('/account/transactions')}>{t('account.transactions')}</button>
                  </li>
                  <li className="border-t border-sky-100">
                    <button className="w-full text-left px-4 py-2 hover:bg-sky-50 text-slate-700" onClick={() => navigate('/account/settings')}>{t('account.settings')}</button>
                  </li>
                  <li className="border-t border-sky-100">
                    <button className="w-full text-left px-4 py-2 hover:bg-sky-50 text-slate-700" onClick={() => navigate('/bulk-sell')}>Bulk Sell</button>
                  </li>
                  <li className="border-t border-sky-100">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                      onClick={() => {
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("userEmail");
                        setUserName(null);
                        setUserEmail(null);
                        window.dispatchEvent(new CustomEvent('authChange'));
                        navigate('/');
                      }}
                    >{t('navigation.logout')}</button>
                  </li>
                </ul>
              </details>
            </div>
          ) : (
            <>
              <button
                className="px-4 py-2 border border-sky-300 rounded hover:bg-sky-50 text-sky-700 transition-colors"
                onClick={() => navigate('/login')}
              >{t('navigation.login').toUpperCase()}</button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded hover:from-sky-700 hover:to-blue-700 transition-all shadow-md"
                onClick={() => navigate('/register')}
              >{t('auth.signUp').toUpperCase()}</button>
            </>
          )}
          <LanguageSwitcherFlags />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        {/* Top bar with logo and hamburger */}
        <div className="flex items-center justify-between px-4 py-3">
          <span
            className="text-xl font-bold text-sky-700 cursor-pointer hover:text-sky-600 transition-colors"
            onClick={() => navigate('/')}
          >
            トレカ市場
          </span>
          <div className="flex items-center gap-3">
            <CartIcon />
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 text-sky-700 hover:bg-sky-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-sky-700 hover:bg-sky-100 rounded-md transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileSearchOpen && (
          <div className="px-4 pb-3 border-b border-sky-200">
            <div className="relative" ref={inputRef}>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  id="mobile-search-cards"
                  name="search"
                  placeholder={t('common.search') + ' トレカ市場...'}
                  className="w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white/80"
                  value={search}
                  onChange={handleInputChange}
                  onFocus={() => setShowDropdown(results.length > 0)}
                  autoComplete="off"
                />
              </form>
              {showDropdown && (
                <ul className="absolute z-20 left-0 right-0 bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {loading ? (
                    <li className="px-4 py-2 text-gray-500">{t('common.loading')}</li>
                  ) : results.length === 0 ? (
                    <li className="px-4 py-2 text-gray-500">{t('common.noResults')}</li>
                  ) : (
                    results.map(card => (
                      <li
                        key={card.id}
                        className="px-4 py-3 hover:bg-sky-50 border-b border-sky-100 last:border-b-0 cursor-pointer"
                        onClick={() => {
                          handleResultClick(card);
                          setMobileSearchOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {card.set_code && getSetIcon(card.set_code) && (
                            <img
                              src={getSetIcon(card.set_code)}
                              alt={card.set_code}
                              className="w-4 h-4 flex-shrink-0"
                            />
                          )}
                          <div className="font-medium text-gray-900">{card.name}</div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {card.price && <span className="text-green-600 font-semibold">${card.price}</span>}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="px-4 py-3 bg-white border-b border-sky-200">
            <nav className="space-y-3">
              <a href="#" className="block py-2 text-slate-600 hover:text-sky-600 transition-colors font-medium">
                {t('homepage.trendingCards').toUpperCase()}
              </a>
              {userEmail || userName ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold text-sm">
                      {(userName || userEmail || '?').toString().charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sky-700 font-semibold">{userName || userEmail}</span>
                  </div>
                  <button
                    className="block w-full text-left py-2 text-slate-700 hover:text-sky-600 transition-colors"
                    onClick={() => {
                      navigate('/account/profile');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('account.profile')}
                  </button>
                  <button
                    className="block w-full text-left py-2 text-slate-700 hover:text-sky-600 transition-colors"
                    onClick={() => {
                      navigate('/account/transactions');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('account.transactions')}
                  </button>
                  <button
                    className="block w-full text-left py-2 text-slate-700 hover:text-sky-600 transition-colors"
                    onClick={() => {
                      navigate('/account/settings');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('account.settings')}
                  </button>
                  <button
                    className="block w-full text-left py-2 text-slate-700 hover:text-sky-600 transition-colors"
                    onClick={() => {
                      navigate('/bulk-sell');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Bulk Sell
                  </button>
                  <button
                    className="block w-full text-left py-2 text-red-600 hover:text-red-700 transition-colors"
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("userEmail");
                      setUserName(null);
                      setUserEmail(null);
                      window.dispatchEvent(new CustomEvent('authChange'));
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                  >
                    {t('navigation.logout')}
                  </button>
                </>
              ) : (
                <div className="space-y-3 pt-2">
                  <button
                    className="block w-full px-4 py-3 border border-sky-300 rounded-md hover:bg-sky-50 text-sky-700 transition-colors text-center font-medium"
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('navigation.login').toUpperCase()}
                  </button>
                  <button
                    className="block w-full px-4 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-md hover:from-sky-700 hover:to-blue-700 transition-all shadow-md text-center font-medium"
                    onClick={() => {
                      navigate('/register');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('auth.signUp').toUpperCase()}
                  </button>
                </div>
              )}
              <div className="pt-3 border-t border-sky-200">
                <LanguageSwitcherFlags />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 