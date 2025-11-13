import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * StorefrontConfigListener
 *
 * Listens for configuration updates from the StorefrontEditor iframe
 * and applies them to the current page.
 */
const StorefrontConfigListener = () => {
  const location = useLocation();
  const isPreviewMode = new URLSearchParams(location.search).get('preview') === 'true';
  const pathname = location.pathname || '/';
  const inAdmin = pathname.startsWith('/admin') || pathname.startsWith('/storefront-editor');

  useEffect(() => {
    if (!isPreviewMode) return;

    console.log('📡 Preview mode active - listening for config updates');

    const handleMessage = (event) => {
      // Security: verify origin
      if (event.origin !== window.location.origin) {
        console.warn('Rejected message from different origin:', event.origin);
        return;
      }

      if (event.data.type === 'STOREFRONT_CONFIG_UPDATE') {
        const config = event.data.payload;
        console.log('📥 Received config update:', config);

        applyConfiguration(config);
      }
    };

    window.addEventListener('message', handleMessage);

    // Notify iframe that preview is ready
    window.parent.postMessage({
      type: 'PREVIEW_READY',
      timestamp: Date.now(),
    }, window.location.origin);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isPreviewMode]);

  // Apply saved config in non-preview mode so shops see their theme
  useEffect(() => {
    if (isPreviewMode || inAdmin) return;
    try {
      const raw = localStorage.getItem('STOREFRONT_EDITOR_CONFIG');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.applyToSite === false) {
          clearAppliedStyles();
          return;
        }
        // Apply base (colors/typography/favicon) and extended (header/buttons/layout/cards)
        applyConfiguration(parsed);
        applyExtendedConfiguration(parsed);
      } else {
        // No config, clear any previously injected styles
        clearAppliedStyles();
      }
    } catch (e) {
      console.warn('Failed to load storefront config from localStorage:', e);
    }
  }, [isPreviewMode, inAdmin]);

  // React to config changes from other tabs (editor saves to localStorage)
  useEffect(() => {
    if (isPreviewMode || inAdmin) return;
    const onStorage = (e) => {
      if (e.key !== 'STOREFRONT_EDITOR_CONFIG') return;
      try {
        const raw = e.newValue;
        if (!raw) { clearAppliedStyles(); return; }
        const parsed = JSON.parse(raw);
        if (parsed?.applyToSite === false) {
          clearAppliedStyles();
        } else {
          applyConfiguration(parsed);
          applyExtendedConfiguration(parsed);
        }
      } catch (err) {
        console.warn('Failed parsing updated storefront config:', err);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [isPreviewMode, inAdmin]);

  // Re-apply on route changes (e.g., returning to home page)
  useEffect(() => {
    if (isPreviewMode || inAdmin) return;
    try {
      const raw = localStorage.getItem('STOREFRONT_EDITOR_CONFIG');
      if (!raw) { clearAppliedStyles(); return; }
      const parsed = JSON.parse(raw);
      if (parsed?.applyToSite === false) { clearAppliedStyles(); return; }
      applyConfiguration(parsed);
      applyExtendedConfiguration(parsed);
    } catch {}
  }, [pathname, isPreviewMode, inAdmin]);

  // Ensure admin routes never inherit storefront styles
  useEffect(() => {
    if (!isPreviewMode && inAdmin) {
      clearAppliedStyles();
    }
  }, [pathname, isPreviewMode, inAdmin]);

  // In preview, also listen and apply extended settings (header/buttons/layout/cards)
  useEffect(() => {
    if (!isPreviewMode) return;
    const handler = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'STOREFRONT_CONFIG_UPDATE') {
        applyExtendedConfiguration(event.data.payload);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [isPreviewMode]);

  return null; // This is a listener component, no UI
};

/**
 * Apply configuration to the current page
 */
const applyConfiguration = (config) => {
  if (!config) return;

  try {
    // Apply Logo
    if (config.logo) {
      applyLogo(config.logo);
    }

    // Apply Favicon
    if (config.favicon) {
      applyFavicon(config.favicon);
    }

    // Apply Colors
    if (config.colors) {
      applyColors(config.colors);
    }

    // Apply Typography
    if (config.typography) {
      applyTypography(config.typography);
    }

    console.log('✅ Configuration applied successfully');
  } catch (error) {
    console.error('❌ Failed to apply configuration:', error);

    // Send error back to editor
    window.parent.postMessage({
      type: 'PREVIEW_ERROR',
      error: error.message,
      timestamp: Date.now(),
    }, window.location.origin);
  }
};

/**
 * Apply logo configuration
 * Moved to React component (Logo.tsx) to avoid DOM replacement conflicts with React.
 * This no-op is kept to maintain call sites.
 */
const applyLogo = (_logoConfig) => {
  // Intentionally handled by Logo.tsx via localStorage + postMessage
};

/**
 * Apply favicon
 */
const applyFavicon = (faviconConfig) => {
  if (!faviconConfig.file) return;

  let favicon = document.querySelector('link[rel="icon"]');

  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }

  favicon.href = faviconConfig.file;
};

/**
 * Apply color scheme with MAXIMUM specificity to override Tailwind
 */
const applyColors = (colorsConfig) => {
  const activeScheme = colorsConfig.schemes?.find(
    (scheme) => scheme.id === colorsConfig.activeSchemeId
  );

  if (!activeScheme) return;

  const styleId = 'storefront-color-scheme';
  let styleElement = document.getElementById(styleId);

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  const colors = activeScheme.colors;

  // Build CSS conditionally to avoid injecting invalid values
  const cssParts = [];
  cssParts.push(`:root {${colors.background ? `--storefront-bg:${colors.background};` : ''}${colors.text ? `--storefront-text:${colors.text};` : ''}${colors.accent1 ? `--storefront-accent1:${colors.accent1};` : ''}${colors.accent2 ? `--storefront-accent2:${colors.accent2};` : ''}${colors.border ? `--storefront-border:${colors.border};` : ''}}`);
  if (colors.background || colors.text) {
    cssParts.push(`html body,html body#root,body[class],body[class][class],div#root,div#root>div{${colors.background ? `background-color:${colors.background} !important;` : ''}${colors.text ? `color:${colors.text} !important;` : ''}}`);
  }
  // Avoid overriding header/footer and buttons from here; dedicated handlers manage them
  if (colors.text) cssParts.push(`h1,h2,h3,h4,h5,h6,h1[class],h2[class],h3[class],p[class],span[class],div[class]{color:${colors.text} !important;}`);
  if (colors.border) cssParts.push(`*[class*="border-"]{border-color:${colors.border} !important;}`);

  styleElement.textContent = cssParts.join('\n');
  console.log(`✅ Applied color scheme: ${activeScheme.name}`, colors);
};

/**
 * Apply typography with MAXIMUM specificity
 */
const applyTypography = (typographyConfig) => {
  const styleId = 'storefront-typography';
  let styleElement = document.getElementById(styleId);

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  const { headings, body } = typographyConfig;

  // Import Google Fonts if needed
  const fontImportId = 'storefront-font-import';
  let fontImportElement = document.getElementById(fontImportId);

  if (!fontImportElement) {
    fontImportElement = document.createElement('link');
    fontImportElement.id = fontImportId;
    fontImportElement.rel = 'stylesheet';
    document.head.appendChild(fontImportElement);
  }

  // Load both fonts from Google Fonts
  const fontsToLoad = [headings.font, body.font].filter((f, i, arr) => arr.indexOf(f) === i);
  fontImportElement.href = `https://fonts.googleapis.com/css2?${fontsToLoad.map(f => `family=${f.replace(' ', '+')}`).join('&')}&display=swap`;

  // Ultra-aggressive typography CSS
  const css = `
    /* Headings - Maximum specificity */
    h1, h1[class], h1[class][class],
    h2, h2[class], h2[class][class],
    h3, h3[class], h3[class][class],
    h4, h4[class], h4[class][class],
    h5, h5[class], h5[class][class],
    h6, h6[class], h6[class][class] {
      font-family: '${headings.font}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }

    /* Scale headings proportionally */
    h1, h1[class] {
      font-size: calc(2.25rem * ${headings.scale / 100}) !important;
    }

    h2, h2[class] {
      font-size: calc(1.875rem * ${headings.scale / 100}) !important;
    }

    h3, h3[class] {
      font-size: calc(1.5rem * ${headings.scale / 100}) !important;
    }

    h4, h4[class] {
      font-size: calc(1.25rem * ${headings.scale / 100}) !important;
    }

    h5, h5[class] {
      font-size: calc(1.125rem * ${headings.scale / 100}) !important;
    }

    h6, h6[class] {
      font-size: calc(1rem * ${headings.scale / 100}) !important;
    }

    /* Body - Maximum specificity */
    html, html body,
    body, body[class],
    p, p[class], p[class][class],
    span, span[class],
    div, div[class],
    a, a[class],
    button, button[class],
    input, input[class],
    textarea, textarea[class],
    select, select[class],
    label, label[class],
    li, li[class],
    td, td[class],
    th, th[class] {
      font-family: '${body.font}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }

    /* Body base font size */
    html, body {
      font-size: calc(16px * ${body.scale / 100}) !important;
    }

    /* All text elements inherit body scale */
    p, span:not(h1 span):not(h2 span):not(h3 span):not(h4 span):not(h5 span):not(h6 span),
    div:not(h1 div):not(h2 div):not(h3 div):not(h4 div):not(h5 div):not(h6 div),
    a:not(h1 a):not(h2 a):not(h3 a):not(h4 a):not(h5 a):not(h6 a),
    button, input, textarea, select, label, li, td {
      font-size: calc(1em * ${body.scale / 100}) !important;
    }
  `;

  styleElement.textContent = css;
  console.log(`✅ Applied typography - Headings: ${headings.font} (${headings.scale}%), Body: ${body.font} (${body.scale}%)`);
};

/**
 * Apply only the new sections so we don't duplicate the existing handlers
 */
const applyExtendedConfiguration = (config) => {
  if (!config) return;
  if (config.header) applyHeader(config.header);
  if (config.buttons) applyButtons(config.buttons);
  if (config.layout) applyLayout(config.layout);
  if (config.productCards) applyProductCards(config.productCards);
  if (config.pages) applyPageSections(config.pages);
};

/**
 * Remove injected styles and announcement bar when not applying to site
 */
const clearAppliedStyles = () => {
  const ids = [
    'storefront-color-scheme',
    'storefront-typography',
    'storefront-header-style',
    'storefront-buttons-style',
    'storefront-layout-style',
    'storefront-product-cards-style',
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  const bar = document.getElementById('storefront-announcement-bar');
  if (bar) bar.remove();
};

/**
 * Render page-level sections (starting with Home)
 */
const applyPageSections = (pages) => {
  // Home page container must exist
  const container = document.getElementById('storefront-sections-home');
  if (!container) return;

  // Clear previous rendered content
  container.innerHTML = '';

  const home = pages?.home;
  if (!home || !Array.isArray(home.sections)) return;

  home.sections.forEach((section) => {
    if (!section?.enabled) return;
    if (section.type === 'miniBanner') {
      const s = section.settings || {};
      const wrapper = document.createElement('section');
      wrapper.className = 'storefront-section-minibanner my-4';
      wrapper.setAttribute('data-section-id', section.id);
      wrapper.style.background = s.background || '#f3f4f6';
      if (s.backgroundImage) {
        // Overlay support via layered background
        const hex = (s.overlayColor || '#000000').replace('#', '');
        const r = parseInt(hex.substring(0,2), 16) || 0;
        const g = parseInt(hex.substring(2,4), 16) || 0;
        const b = parseInt(hex.substring(4,6), 16) || 0;
        const op = Math.max(0, Math.min(1, (s.overlayOpacity ?? 35) / 100));
        const overlay = s.overlayEnabled ? `linear-gradient(rgba(${r},${g},${b},${op}), rgba(${r},${g},${b},${op})), ` : '';
        wrapper.style.backgroundImage = `${overlay}url(${s.backgroundImage})`;
        wrapper.style.backgroundSize = 'cover';
        wrapper.style.backgroundPosition = 'center';
      } else {
        wrapper.style.backgroundImage = '';
      }
      wrapper.style.color = s.textColor || '#111827';
      wrapper.style.minHeight = (s.height || 160) + 'px';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = s.align === 'left' ? 'flex-start' : s.align === 'right' ? 'flex-end' : 'center';
      wrapper.style.padding = '12px';
      wrapper.style.borderRadius = (s.borderRadius ?? 8) + 'px';

      const content = document.createElement('div');
      content.className = 'text-sm sm:text-base font-medium';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      content.style.gap = '8px';
      if (s.showText !== false) {
        if (s.linkUrl) {
          const a = document.createElement('a');
          a.href = s.linkUrl;
          a.textContent = s.text || '';
          a.style.color = 'inherit';
          a.style.textDecoration = 'none';
          a.onmouseenter = () => (a.style.textDecoration = 'underline');
          a.onmouseleave = () => (a.style.textDecoration = 'none');
          content.appendChild(a);
        } else {
          content.textContent = s.text || '';
        }
      }

      // CTA button
      if (s.showButton && s.buttonLabel && s.buttonUrl) {
        const btn = document.createElement('a');
        btn.href = s.buttonUrl;
        btn.textContent = s.buttonLabel;
        btn.className = 'inline-block px-4 py-2 rounded-md';
        btn.style.background = s.buttonBg || '#0284c7';
        btn.style.color = s.buttonTextColor || '#ffffff';
        btn.style.textDecoration = 'none';
        btn.onmouseenter = () => (btn.style.opacity = '0.9');
        btn.onmouseleave = () => (btn.style.opacity = '1');
        content.appendChild(btn);
      }

      wrapper.appendChild(content);
      container.appendChild(wrapper);
    }
    if (section.type === 'richText') {
      const s = section.settings || {};
      const wrapper = document.createElement('section');
      wrapper.className = 'storefront-section-richtext my-6';
      wrapper.setAttribute('data-section-id', section.id);
      wrapper.style.background = s.background || '#ffffff';
      wrapper.style.color = s.textColor || '#111827';
      wrapper.style.padding = ((s.padding ?? 24)) + 'px';
      wrapper.style.borderRadius = '8px';

      const inner = document.createElement('div');
      inner.style.maxWidth = '100%';
      inner.style.textAlign = s.align || 'center';

      if (s.title) {
        const h = document.createElement('h2');
        h.className = 'text-xl sm:text-2xl font-semibold mb-2';
        h.textContent = s.title;
        inner.appendChild(h);
      }
      if (s.body) {
        const p = document.createElement('p');
        p.className = 'text-sm sm:text-base text-gray-700 mb-3';
        p.style.color = 'inherit';
        p.textContent = s.body;
        inner.appendChild(p);
      }
      if (s.buttonLabel && s.buttonUrl) {
        const a = document.createElement('a');
        a.href = s.buttonUrl;
        a.textContent = s.buttonLabel;
        a.className = 'inline-block px-4 py-2 rounded-md text-white';
        a.style.background = 'var(--storefront-accent1, #0284c7)';
        a.style.textDecoration = 'none';
        a.onmouseenter = () => (a.style.opacity = '0.9');
        a.onmouseleave = () => (a.style.opacity = '1');
        inner.appendChild(a);
      }

      wrapper.appendChild(inner);
      container.appendChild(wrapper);
    }
  });
};

/**
 * Apply header settings: announcement bar + header colors
 */
const applyHeader = (header) => {
  const id = 'storefront-announcement-bar';
  let bar = document.getElementById(id);
  if (header.showAnnouncementBar) {
    if (!bar) {
      bar = document.createElement('div');
      bar.id = id;
      document.body.prepend(bar);
    }
    bar.textContent = header.announcementText || '';
    bar.setAttribute('style', `width:100%;box-sizing:border-box;padding:8px 12px;text-align:center;font-size:14px;background:${header.announcementBg};color:${header.announcementTextColor};position:relative;z-index:40;`);
  } else if (bar) {
    bar.remove();
  }

  const styleId = 'storefront-header-style';
  let styleElement = document.getElementById(styleId);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  const parts = [];
  const props = [];
  if (header.headerBg) props.push(`background:${header.headerBg} !important;background-color:${header.headerBg} !important`);
  if (header.headerBorder) props.push(`border-color:${header.headerBorder} !important`);
  if (header.headerText) props.push(`color:${header.headerText} !important`);
  if (props.length) parts.push(`header, header[class], header > div { ${props.join('; ')} }`);
  if (header.headerText) parts.push(`header a, header span, header button { color:${header.headerText} !important; }`);
  if (header.stickyHeader) parts.push('header { position: sticky !important; top: 0; }');
  styleElement.textContent = parts.join('\n');
};

/**
 * Apply buttons settings globally
 */
const applyButtons = (buttons) => {
  const styleId = 'storefront-buttons-style';
  let styleElement = document.getElementById(styleId);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  const btnCss = [];
  btnCss.push(`button, a.button, .btn, .btn-primary, button[class], a[class*="bg-blue"], a[class*="bg-sky"], button[class*="bg-"] { border-radius: ${buttons.radius} !important; text-transform: ${buttons.uppercase ? 'uppercase' : 'none'} !important; font-weight: ${buttons.fontWeight || 600} !important; }`);
  if (buttons.primaryBg || buttons.primaryText) {
    btnCss.push(`.btn-primary, a[class*="bg-blue"], a[class*="bg-sky"], button[class*="bg-blue"], button[class*="bg-sky"] { ${buttons.primaryBg ? `background: ${buttons.primaryBg} !important; border-color: ${buttons.primaryBg} !important;` : ''} ${buttons.primaryText ? `color: ${buttons.primaryText} !important;` : ''} }`);
  }
  if (buttons.primaryBgHover) {
    btnCss.push(`.btn-primary:hover, a[class*="bg-blue"]:hover, a[class*="bg-sky"]:hover, button[class*="bg-blue"]:hover, button[class*="bg-sky"]:hover { background: ${buttons.primaryBgHover} !important; border-color: ${buttons.primaryBgHover} !important; }`);
  }
  styleElement.textContent = btnCss.join('\n');
};

/**
 * Apply layout (container width, spacing, grid gaps)
 */
const applyLayout = (layout) => {
  const styleId = 'storefront-layout-style';
  let styleElement = document.getElementById(styleId);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  const css = `
    main, .container, [class*="max-w-"] { max-width: ${layout.containerMaxWidth}px !important; margin-left:auto !important; margin-right:auto !important; }
    section, section[class], .section { padding-top: ${layout.sectionSpacing}px !important; padding-bottom: ${layout.sectionSpacing}px !important; }
    .grid, [class*="grid"], .cards, .cards[class] { gap: ${layout.cardGap}px !important; }
  `;
  styleElement.textContent = css;
};

/**
 * Apply product card settings (image ratio & density)
 */
const applyProductCards = (pc) => {
  const styleId = 'storefront-product-cards-style';
  let styleElement = document.getElementById(styleId);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  const [w, h] = (pc.imageRatio || '3/4').split('/').map(Number);
  const ratio = h ? (h / w) * 100 : 133.33;
  const densityMap = { compact: '0.25rem', comfortable: '0.5rem', spacious: '0.75rem' };
  const textSpace = densityMap[pc.density] || densityMap.comfortable;
  const css = `
    .product-card .image, [class*="card"] [class*="image"], .card [class*="image"] { position: relative !important; width: 100% !important; }
    .product-card .image::before, [class*="card"] [class*="image"]::before, .card [class*="image"]::before { content: ''; display: block; padding-top: ${ratio}%; }
    .product-card .image > img, [class*="card"] [class*="image"] > img, .card [class*="image"] > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .product-card .meta, [class*="card"] [class*="meta"], .card [class*="meta"], .product-card .details, [class*="card"] [class*="details"], .card [class*="details"] { line-height: 1.2 !important; gap: ${textSpace} !important; row-gap: ${textSpace} !important; margin-top: ${textSpace} !important; }
    ${pc.showCondition ? '' : '.product-card [data-meta="condition"], [class*="card"] [data-meta="condition"] { display:none !important; }'}
    ${pc.showSet ? '' : '.product-card [data-meta="set"], [class*="card"] [data-meta="set"] { display:none !important; }'}
    ${pc.showSeller ? '' : '.product-card [data-meta="seller"], [class*="card"] [data-meta="seller"] { display:none !important; }'}
  `;
  styleElement.textContent = css;
};

export default StorefrontConfigListener;
