import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { advancedSearchCards } from "../api/search";
import { validateToken } from "../api/auth";
import { decodeJWTToken } from "../utils/oauth";
import CartIcon from "./CartIcon";
import LanguageSwitcherFlags from "./LanguageSwitcherFlags";
import Logo from "./Logo";
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
          const res = await advancedSearchCards({ name: value }, 0, 21); // First page, 21 results

          // Handle paginated response - now formatted by API layer
          const searchResults = res.content ? res.content : res;

          // Only update if this is still the latest search
          if (currentSearchId === currentSearchRef.current) {
            // Remove duplicates by card name (prioritizing exact matches and lower IDs)
            const uniqueResults = searchResults.filter((card, index, self) => {
              const cardName = card.cardName;
              return index === self.findIndex(c => {
                const cName = c.cardName;
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
    setSearch(card.cardName);
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(card.cardName)}`);
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

  // Hide dropdown when scrolling
  React.useEffect(() => {
    const handleScroll = () => {
      setShowDropdown(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-[100] w-full bg-gradient-to-r from-sky-50 to-blue-50 shadow-md border-b border-sky-200 font-sans">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 w-full max-w-none gap-4">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-4">
          <div
            className="text-2xl font-bold text-sky-700 cursor-pointer hover:text-sky-600 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded-md"
            onClick={() => navigate('/')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/');
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Go to homepage"
          >
            <Logo className="w-8 h-8" />
          </div>
          <nav className="flex gap-4 text-slate-600">
            <a
              href="/advanced-search"
              className="hover:text-sky-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                navigate('/advanced-search');
              }}
            >
              Advanced Search
            </a>
          </nav>
        </div>

        {/* Search */}
        <div className="w-96 mx-6 relative" ref={inputRef}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              id="search-cards"
              name="search"
              placeholder={t('common.search')}
              className="w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white/80 text-base min-h-[44px]"
              value={search}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(results.length > 0)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' && results.length > 0) {
                  e.preventDefault();
                  const firstItem = document.querySelector('[data-search-item="0"]');
                  if (firstItem) firstItem.focus();
                }
              }}
              autoComplete="off"
              aria-label={t('common.search') || 'Search for cards'}
              aria-expanded={showDropdown}
              aria-haspopup="listbox"
              aria-describedby={showDropdown ? 'search-results' : undefined}
            />
          </form>
          {showDropdown && (
            <ul
              id="search-results"
              className="absolute z-10 left-0 right-0 bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
              role="listbox"
              aria-label="Search results"
            >
              {loading ? (
                <li className="px-4 py-2 text-gray-500">{t('common.loading')}</li>
              ) : results.length === 0 ? (
                <li className="px-4 py-2 text-gray-500">{t('common.noResults')}</li>
              ) : (
                results.map(card => (
                  <li
                    key={card.id}
                    className="px-4 py-3 hover:bg-sky-50 border-b border-sky-100 last:border-b-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400"
                    onClick={() => handleResultClick(card)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleResultClick(card);
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevItem = document.querySelector(`[data-search-item="${results.indexOf(card) - 1}"]`);
                        if (prevItem) {
                          prevItem.focus();
                        } else {
                          document.getElementById('search-cards')?.focus();
                        }
                      } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextItem = document.querySelector(`[data-search-item="${results.indexOf(card) + 1}"]`);
                        if (nextItem) nextItem.focus();
                      }
                    }}
                    tabIndex={0}
                    role="option"
                    data-search-item={results.indexOf(card)}
                    aria-selected={false}
                  >
                    <div className="flex items-center gap-2">
                      {card.setCode && getSetIcon(card.setCode) && (
                        <img
                          src={getSetIcon(card.setCode)}
                          alt={card.setCode}
                          className="w-4 h-4 flex-shrink-0"
                        />
                      )}
                      <div className="font-medium text-gray-900">{card.cardName}</div>
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

        {/* User Menu and Language */}
        <div className="flex gap-2 lg:gap-4 items-center shrink-0">
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
                    <button className="w-full text-left px-4 py-3 hover:bg-sky-50 text-slate-700 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2" onClick={() => navigate('/account/profile')}>{t('account.profile')}</button>
                  </li>
                  <li className="border-t border-sky-100">
                    <button className="w-full text-left px-4 py-3 hover:bg-sky-50 text-slate-700 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2" onClick={() => navigate('/account/transactions')}>{t('account.transactions')}</button>
                  </li>
                  <li className="border-t border-sky-100">
                    <button className="w-full text-left px-4 py-3 hover:bg-sky-50 text-slate-700 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2" onClick={() => navigate('/account/settings')}>{t('account.settings')}</button>
                  </li>
                  <li className="border-t border-sky-100">
                    <button className="w-full text-left px-4 py-3 hover:bg-sky-50 text-slate-700 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2" onClick={() => navigate('/admin')}>Admin Panel</button>
                  </li>
                  <li className="border-t border-sky-100">
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
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
                className="px-2 sm:px-3 md:px-4 py-2 border border-sky-300 rounded hover:bg-sky-50 text-sky-700 transition-colors whitespace-nowrap min-h-[44px] h-11 flex items-center justify-center text-sm lg:text-base shrink-0"
                onClick={() => navigate('/login')}
              >{t('navigation.login').toUpperCase()}</button>
              <button
                className="px-2 sm:px-3 md:px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded hover:from-sky-700 hover:to-blue-700 transition-all shadow-md whitespace-nowrap min-h-[44px] h-11 flex items-center justify-center text-sm lg:text-base shrink-0"
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
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div
            className="text-xl font-bold text-sky-700 cursor-pointer hover:text-sky-600 transition-colors whitespace-nowrap"
            onClick={() => navigate('/')}
            tabIndex={0}
            role="button"
            aria-label="Go to homepage"
          >
            <Logo className="w-8 h-8" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-3 text-sky-700 hover:bg-sky-100 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              aria-expanded={mobileSearchOpen}
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 text-sky-700 hover:bg-sky-100 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
          <div className="px-4 sm:px-6 pb-3 border-b border-sky-200" ref={inputRef}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                id="mobile-search-cards"
                name="search"
                placeholder={t('common.search')}
                className="w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white/80 text-base min-h-[44px]"
                value={search}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(results.length > 0)}
                autoComplete="off"
                aria-label={t('common.search') || 'Search for cards'}
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
              />
            </form>
            {showDropdown && (
              <ul className="absolute z-10 left-0 right-0 bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto" role="listbox">
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
                      tabIndex={0}
                      role="option"
                    >
                      <div className="flex items-center gap-2">
                        {card.setCode && getSetIcon(card.setCode) && (
                          <img src={getSetIcon(card.setCode)} alt={card.setCode} className="w-4 h-4 flex-shrink-0" />
                        )}
                        <div className="font-medium text-gray-900">{card.cardName}</div>
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
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="px-4 sm:px-6 py-3 bg-white border-b border-sky-200"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            <nav className="space-y-3">
              <div className="space-y-2 mb-4 pb-4 border-b border-sky-200">
                <a
                  href="/advanced-search"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/advanced-search');
                    setMobileMenuOpen(false);
                  }}
                  className="block py-3 px-2 text-slate-600 hover:text-sky-600 transition-colors font-medium min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded-md"
                  role="menuitem"
                >
                  Advanced Search
                </a>
              </div>

              <CartIcon />

              {userEmail || userName ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold text-sm">
                      {(userName || userEmail || '?').toString().charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sky-700 font-semibold">{userName || userEmail}</span>
                  </div>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-sky-50 text-slate-700 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                    onClick={() => {
                      navigate('/account/profile');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('account.profile')}
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-sky-50 text-slate-700 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                    onClick={() => {
                      navigate('/account/transactions');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('account.transactions')}
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-sky-50 text-slate-700 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                    onClick={() => {
                      navigate('/account/settings');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('account.settings')}
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-sky-50 text-slate-700 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                    onClick={() => {
                      navigate('/admin');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Admin Panel
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
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
                    className="block w-full px-4 py-3 border border-sky-300 rounded-md hover:bg-sky-50 text-sky-700 transition-colors text-center font-medium min-h-[44px] whitespace-nowrap flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('navigation.login').toUpperCase()}
                  </button>
                  <button
                    className="block w-full px-4 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-md hover:from-sky-700 hover:to-blue-700 transition-all shadow-md text-center font-medium min-h-[44px] whitespace-nowrap flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
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
