import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { searchCards } from "../api/search";
import { validateToken } from "../api/auth";
import { decodeJWTToken } from "../utils/oauth";
import CartIcon from "./CartIcon";
import LanguageSwitcherFlags from "./LanguageSwitcherFlags";
import Logo from "./Logo";
import { getSetIcon } from "../data/sets";
import { useComponent } from "../hooks/useComponent.js";
import { useTheme } from "../hooks/useTheme.js";
import "../registry/skinLoader.js";

const Header = ({ onThemeSettingsClick }) => {
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
          const res = await searchCards(value, {}, 0, 21); // First page, 21 results

          // Handle paginated response - now formatted by API layer
          const searchResults = res.content ? res.content : res;

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

  // Get the Header component from current skin
  const HeaderComponent = useComponent('Header');
  const { theme } = useTheme();

  // If no HeaderComponent is loaded yet, show a fallback
  if (!HeaderComponent) {
    return (
      <header className="w-full bg-gradient-to-r from-sky-50 to-blue-50 shadow-md border-b border-sky-200">
        <div className="flex items-center justify-center py-4">
          <span className="text-lg text-slate-600">Loading...</span>
        </div>
      </header>
    );
  }

  // Prepare components for the skin
  const logoComponent = (
    <div
      className={`${mobileMenuOpen || mobileSearchOpen ? theme.components.header.logoMobile : theme.components.header.logo} cursor-pointer`}
      onClick={() => navigate('/')}
    >
      <Logo className="w-8 h-8" />
    </div>
  );

  const navigationComponent = null;

  const searchComponent = (
    <div className="relative" ref={inputRef}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          id={mobileSearchOpen ? "mobile-search-cards" : "search-cards"}
          name="search"
          placeholder={t('common.search') + ' トレカ市場...'}
          className={theme.components.header.searchInput}
          value={search}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(results.length > 0)}
          autoComplete="off"
        />
      </form>
      {showDropdown && (
        <ul className={theme.components.header.searchDropdown}>
          {loading ? (
            <li className="px-4 py-2 text-gray-500">{t('common.loading')}</li>
          ) : results.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">{t('common.noResults')}</li>
          ) : (
            results.map(card => (
              <li
                key={card.id}
                className={theme.components.header.searchItem}
                onClick={() => {
                  handleResultClick(card);
                  if (mobileSearchOpen) setMobileSearchOpen(false);
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
  );

  const userMenuComponent = userEmail || userName ? (
    // Desktop user menu
    mobileMenuOpen ? (
      <>
        <div className={theme.components.header.mobileUserInfo}>
          <span className={theme.components.header.userAvatarMobile}>
            {(userName || userEmail || '?').toString().charAt(0).toUpperCase()}
          </span>
          <span className={theme.components.header.userName}>{userName || userEmail}</span>
        </div>
        <button
          className={theme.components.header.userDropdownItem}
          onClick={() => {
            navigate('/account/profile');
            setMobileMenuOpen(false);
          }}
        >
          {t('account.profile')}
        </button>
        <button
          className={theme.components.header.userDropdownItem}
          onClick={() => {
            navigate('/account/transactions');
            setMobileMenuOpen(false);
          }}
        >
          {t('account.transactions')}
        </button>
        <button
          className={theme.components.header.userDropdownItem}
          onClick={() => {
            navigate('/account/settings');
            setMobileMenuOpen(false);
          }}
        >
          {t('account.settings')}
        </button>
        <button
          className={theme.components.header.userDropdownItem}
          onClick={() => {
            navigate('/bulk-sell');
            setMobileMenuOpen(false);
          }}
        >
          Bulk Sell
        </button>
        <button
          className={theme.components.header.userDropdownLogout}
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
      <div className="relative">
        <details className="group">
          <summary className="list-none flex items-center gap-2 cursor-pointer select-none">
            <span className={theme.components.header.userAvatar}>
              {(userName || userEmail || '?').toString().charAt(0).toUpperCase()}
            </span>
            <span className={theme.components.header.userName}>{userName || userEmail}</span>
            <svg className={theme.components.header.dropdownArrow} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </summary>
          <ul className={theme.components.header.userDropdown}>
            <li>
              <button className={theme.components.header.userDropdownItem} onClick={() => navigate('/account/profile')}>{t('account.profile')}</button>
            </li>
            <li className="border-t border-sky-100">
              <button className={theme.components.header.userDropdownItem} onClick={() => navigate('/account/transactions')}>{t('account.transactions')}</button>
            </li>
            <li className="border-t border-sky-100">
              <button className={theme.components.header.userDropdownItem} onClick={() => navigate('/account/settings')}>{t('account.settings')}</button>
            </li>
            <li className="border-t border-sky-100">
              <button className={theme.components.header.userDropdownItem} onClick={() => navigate('/bulk-sell')}>Bulk Sell</button>
            </li>
            <li className="border-t border-sky-100">
              <button
                className={theme.components.header.userDropdownLogout}
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
    )
  ) : (
    // Not logged in
    mobileMenuOpen ? (
      <div className="space-y-3 pt-2">
        <button
          className={theme.components.header.mobileButton}
          onClick={() => {
            navigate('/login');
            setMobileMenuOpen(false);
          }}
        >
          {t('navigation.login').toUpperCase()}
        </button>
        <button
          className={theme.components.header.mobileSignupButton}
          onClick={() => {
            navigate('/register');
            setMobileMenuOpen(false);
          }}
        >
          {t('auth.signUp').toUpperCase()}
        </button>
      </div>
    ) : (
      <>
        <button
          className={theme.components.header.loginButton}
          onClick={() => navigate('/login')}
        >{t('navigation.login').toUpperCase()}</button>
        <button
          className={theme.components.header.signupButton}
          onClick={() => navigate('/register')}
        >{t('auth.signUp').toUpperCase()}</button>
      </>
    )
  );

  return (
    <HeaderComponent
      theme={theme}
      logo={logoComponent}
      navigation={navigationComponent}
      searchComponent={searchComponent}
      userMenu={(
        <>
          <CartIcon />
          {(userEmail || userName) && onThemeSettingsClick && (
            <button
              onClick={onThemeSettingsClick}
              className={theme.components.header.themeButton}
              title="Theme Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
            </button>
          )}
          {userMenuComponent}
        </>
      )}
      languageSwitcher={<LanguageSwitcherFlags />}
      mobileMenuOpen={mobileMenuOpen}
      mobileSearchOpen={mobileSearchOpen}
      onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      onMobileSearchToggle={() => setMobileSearchOpen(!mobileSearchOpen)}
    />
  );
};

export default Header; 