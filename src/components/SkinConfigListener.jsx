import { useEffect } from 'react';

/**
 * SkinConfigListener
 *
 * Listens for skin configuration changes from localStorage
 * and applies them dynamically using CSS with !important to override Tailwind
 */
const SkinConfigListener = () => {
  useEffect(() => {
    console.log('🎨 SkinConfigListener mounted - checking for saved config');

    // Apply saved configuration on mount
    applySavedConfiguration();

    // Listen for storage changes (when saved from Skin Editor)
    const handleStorageChange = (e) => {
      if (e.key === 'skinEditorConfig') {
        console.log('🎨 Skin config updated, applying changes...');
        applySavedConfiguration();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (same-window updates)
    const handleCustomEvent = () => {
      console.log('🎨 Skin config custom event received');
      applySavedConfiguration();
    };

    window.addEventListener('skinConfigUpdate', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('skinConfigUpdate', handleCustomEvent);
    };
  }, []);

  return null; // This is a listener component, no UI
};

/**
 * Apply saved configuration from localStorage
 */
const applySavedConfiguration = () => {
  const savedConfig = localStorage.getItem('skinEditorConfig');

  if (!savedConfig) {
    console.log('📭 No saved skin configuration found');
    return;
  }

  try {
    const config = JSON.parse(savedConfig);
    console.log('📥 Loaded skin config:', config);

    // Apply header configuration
    if (config.header) {
      applyHeaderConfiguration(config.header);
    }

    console.log('✅ Skin configuration applied successfully');
  } catch (error) {
    console.error('❌ Failed to apply skin configuration:', error);
  }
};

/**
 * Apply header configuration with CSS !important overrides
 */
const applyHeaderConfiguration = (headerConfig) => {
  const styleId = 'skin-editor-header-styles';
  let styleElement = document.getElementById(styleId);

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  const { elements = {}, styles = {} } = headerConfig;

  // Build CSS rules
  let css = `
    /* Skin Editor - Header Customizations */
    /* These styles override Tailwind classes with !important */
  `;

  // Apply element visibility and sizing
  if (elements.logo) {
    const logo = elements.logo;

    // Visibility
    if (logo.visible === false) {
      css += `
        header .logo,
        header [class*="logo"],
        header .flex.items-center.gap-2:has(svg) {
          display: none !important;
        }
      `;
    }

    // Width
    if (logo.width) {
      css += `
        header .logo,
        header [class*="logo"] {
          width: ${logo.width} !important;
          max-width: ${logo.width} !important;
        }
      `;
    }

    // Font Size
    if (logo.fontSize) {
      css += `
        header .logo,
        header [class*="logo"],
        header .flex.items-center.gap-2 span {
          font-size: ${logo.fontSize} !important;
        }
      `;
    }
  }

  // Search element
  if (elements.search) {
    const search = elements.search;

    if (search.visible === false) {
      css += `
        header [type="search"],
        header input[name="search"],
        header .relative:has(input[type="search"]) {
          display: none !important;
        }
      `;
    }

    if (search.width) {
      css += `
        header [type="search"],
        header input[name="search"],
        header .relative:has(input[type="search"]) {
          width: ${search.width} !important;
          max-width: ${search.width} !important;
        }
      `;
    }
  }

  // Navigation
  if (elements.navigation && elements.navigation.visible === false) {
    css += `
      header nav,
      header nav[class*="navigation"] {
        display: none !important;
      }
    `;
  }

  // Cart
  if (elements.cart && elements.cart.visible === false) {
    css += `
      header [class*="cart"],
      header button:has(img[src*="cart"]),
      header a[href*="cart"] {
        display: none !important;
      }
    `;
  }

  // User Menu
  if (elements.userMenu && elements.userMenu.visible === false) {
    css += `
      header details,
      header [class*="avatar"],
      header .group:has(summary) {
        display: none !important;
      }
    `;
  }

  // Language Switcher
  if (elements.languageSwitcher && elements.languageSwitcher.visible === false) {
    css += `
      header button:has(img[alt*="flag"]),
      header [class*="language"] {
        display: none !important;
      }
    `;
  }

  // Apply header styles (colors, padding, etc.)
  if (styles.backgroundColor) {
    css += `
      header,
      header[class],
      header > div,
      header > div[class] {
        background-color: ${styles.backgroundColor} !important;
        background: ${styles.backgroundColor} !important;
      }
    `;
  }

  if (styles.textColor) {
    css += `
      header,
      header span,
      header a,
      header button:not([class*="bg-"]) {
        color: ${styles.textColor} !important;
      }
    `;
  }

  if (styles.borderColor) {
    css += `
      header,
      header[class*="border"] {
        border-color: ${styles.borderColor} !important;
      }
    `;
  }

  if (styles.buttonBgColor) {
    css += `
      header button[class*="bg-"],
      header a[class*="bg-"] {
        background-color: ${styles.buttonBgColor} !important;
      }
    `;
  }

  if (styles.buttonTextColor) {
    css += `
      header button[class*="bg-"],
      header a[class*="bg-"] {
        color: ${styles.buttonTextColor} !important;
      }
    `;
  }

  if (styles.padding) {
    css += `
      header > div,
      header > div[class*="px-"],
      header > div[class*="py-"] {
        padding: ${styles.padding} !important;
      }
    `;
  }

  if (styles.height && styles.height !== 'auto') {
    css += `
      header {
        height: ${styles.height} !important;
      }
    `;
  }

  styleElement.textContent = css;
  console.log('✅ Applied header configuration');
};

export default SkinConfigListener;
