import { componentRegistry } from './ComponentRegistry.js';

// Import skin components
import DefaultHeader from '../skins/default/Header.jsx';
import MinimalHeader from '../skins/minimal/Header.jsx';

// Function to register all skins
export const initializeSkins = () => {
  // Register default skin
  componentRegistry.registerSkin('default', {
    Header: DefaultHeader
  });

  // Register minimal skin
  componentRegistry.registerSkin('minimal', {
    Header: MinimalHeader
  });

  // Load saved skin preference
  componentRegistry.loadSkinFromStorage();

  console.log('Skins initialized:', componentRegistry.getAvailableSkins());
};

// Auto-initialize when this module is imported
initializeSkins();