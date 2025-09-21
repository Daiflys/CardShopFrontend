import { componentRegistry } from './ComponentRegistry.js';

// Import skin components
import DefaultHeader from '../skins/default/Header.jsx';
import MinimalHeader from '../skins/minimal/Header.jsx';
import DefaultFooter from '../skins/default/Footer.jsx';
import MinimalFooter from '../skins/minimal/Footer.jsx';
import DefaultProductCard from '../skins/default/ProductCard.jsx';
import MinimalProductCard from '../skins/minimal/ProductCard.jsx';
import DefaultSearchGridCard from '../skins/default/SearchGridCard.jsx';
import MinimalSearchGridCard from '../skins/minimal/SearchGridCard.jsx';
import LineLimiterHeader from '../skins/line-limiter/Header.jsx';
import LineLimiterFooter from '../skins/line-limiter/Footer.jsx';
import LineLimiterProductCard from '../skins/line-limiter/ProductCard.jsx';
import LineLimiterSearchGridCard from '../skins/line-limiter/SearchGridCard.jsx';

// Function to register all skins
export const initializeSkins = () => {
  // Register default skin
  componentRegistry.registerSkin('default', {
    Header: DefaultHeader,
    Footer: DefaultFooter,
    ProductCard: DefaultProductCard,
    SearchGridCard: DefaultSearchGridCard
  });

  // Register minimal skin
  componentRegistry.registerSkin('minimal', {
    Header: MinimalHeader,
    Footer: MinimalFooter,
    ProductCard: MinimalProductCard,
    SearchGridCard: MinimalSearchGridCard
  });

  // Register line-limiter skin
  componentRegistry.registerSkin('line-limiter', {
    Header: LineLimiterHeader,
    Footer: LineLimiterFooter,
    ProductCard: LineLimiterProductCard,
    SearchGridCard: LineLimiterSearchGridCard
  });

  // Load saved skin preference
  componentRegistry.loadSkinFromStorage();

  console.log('Skins initialized:', componentRegistry.getAvailableSkins());
};

// Auto-initialize when this module is imported
initializeSkins();