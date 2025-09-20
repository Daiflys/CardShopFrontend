# Responsive Design Guide

## REGLA PRINCIPAL: TODOS LOS DISEÑOS DEBEN SER RESPONSIVE

Todos los skins y temas deben funcionar correctamente en todas las resoluciones de pantalla, desde móviles hasta pantallas ultrawide.

## Breakpoints Estándar

```css
/* Mobile First Approach */
sm: 640px    /* Tablet pequeño */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Desktop grande */
2xl: 1536px  /* Desktop muy grande */
```

## Requisitos para Skins

### 1. Desktop Layout (lg:)
- `desktopContainer: "hidden lg:flex items-center justify-between px-8 py-4 w-full max-w-none"`
- Debe incluir logo, navigation, search, userMenu en una sola fila
- La búsqueda debe tener ancho fijo: `searchContainer: "w-96 mx-6 relative"`

### 2. Mobile Layout (lg:hidden)
- `mobileContainer: "lg:hidden"`
- Debe incluir:
  - `mobileTopBar` con logo y botones de menú
  - `mobileSearch` con dropdown condicional
  - `mobileMenu` con dropdown condicional

### 3. Estructura Requerida en Skins
```jsx
<header className={theme.components.header.container}>
  {/* Desktop Header */}
  <div className={theme.components.header.desktopContainer}>
    <div className="flex items-center gap-4">
      {logo}
      <nav className={theme.components.header.navigation}>
        {navigation}
      </nav>
    </div>
    <div className={theme.components.header.searchContainer}>
      {searchComponent}
    </div>
    <div className="flex gap-4 items-center">
      {userMenu}
      {languageSwitcher}
    </div>
  </div>

  {/* Mobile Header */}
  <div className={theme.components.header.mobileContainer}>
    <div className={theme.components.header.mobileTopBar}>
      {logo}
      <div className="flex items-center gap-3">
        <button onClick={onMobileSearchToggle} className={theme.components.header.mobileMenuButton}>
          {/* Search icon */}
        </button>
        <button onClick={onMobileMenuToggle} className={theme.components.header.mobileMenuButton}>
          {/* Menu icon */}
        </button>
      </div>
    </div>

    {mobileSearchOpen && (
      <div className={theme.components.header.mobileSearch}>
        {searchComponent}
      </div>
    )}

    {mobileMenuOpen && (
      <div className={theme.components.header.mobileMenu}>
        <nav className={theme.components.header.mobileMenuNav}>
          {navigation}
          {userMenu}
          <div className={theme.components.header.mobileLanguageSwitcher}>
            {languageSwitcher}
          </div>
        </nav>
      </div>
    )}
  </div>
</header>
```

## Requisitos para Temas

### Clases CSS Obligatorias
```javascript
components: {
  header: {
    // Container principal
    container: "w-full bg-[color] shadow-md border-b border-[color]",

    // Desktop (lg+)
    desktopContainer: "hidden lg:flex items-center justify-between px-8 py-4 w-full max-w-none",

    // Mobile (lg-)
    mobileContainer: "lg:hidden",
    mobileTopBar: "flex items-center justify-between px-4 py-3",
    mobileMenuButton: "p-2 text-[color] hover:bg-[color] rounded-md transition-colors",
    mobileSearch: "px-4 pb-3 border-b border-[color]",
    mobileMenu: "px-4 py-3 bg-[color] border-b border-[color]",
    mobileMenuNav: "space-y-3",
    mobileLanguageSwitcher: "pt-3 border-t border-[color]",

    // Logo
    logo: "text-2xl font-bold text-[color] cursor-pointer hover:text-[color] transition-colors",
    logoMobile: "text-xl font-bold text-[color] cursor-pointer hover:text-[color] transition-colors",

    // Navigation
    navigation: "flex gap-4 text-[color]",
    navigationLink: "hover:text-[color] transition-colors",

    // Search
    searchContainer: "w-96 mx-6 relative", // ANCHO FIJO OBLIGATORIO
    searchInput: "w-full px-3 py-2 border border-[color] rounded-md focus:outline-none focus:ring-2 focus:ring-[color] focus:border-[color] bg-[color]",
    searchDropdown: "absolute z-[60] left-0 right-0 bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto",
    searchItem: "px-4 py-3 hover:bg-[color] border-b border-[color] last:border-b-0 cursor-pointer",

    // User Menu
    userAvatar: "inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color] text-white font-bold shadow-md",
    userAvatarMobile: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color] text-white font-bold text-sm",
    userName: "text-[color] font-semibold",
    dropdownArrow: "h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform",
    userDropdown: "absolute right-0 mt-2 w-52 bg-white border rounded-md shadow-lg overflow-hidden z-30",
    userDropdownItem: "w-full text-left px-4 py-2 hover:bg-[color] text-[color]",
    userDropdownLogout: "w-full text-left px-4 py-2 hover:bg-red-50 text-red-600",

    // Auth Buttons
    loginButton: "px-4 py-2 border border-[color] rounded hover:bg-[color] text-[color] transition-colors",
    signupButton: "px-4 py-2 bg-[color] text-white rounded hover:bg-[color] transition-all shadow-md",

    // Theme Button
    themeButton: "p-2 text-[color] hover:bg-[color] rounded-md transition-colors",

    // Mobile specific
    mobileUserInfo: "flex items-center gap-3 py-2",
    mobileButton: "block w-full px-4 py-3 border border-[color] rounded-md hover:bg-[color] text-[color] transition-colors text-center font-medium",
    mobileSignupButton: "block w-full px-4 py-3 bg-[color] text-white rounded-md hover:bg-[color] transition-all shadow-md text-center font-medium"
  }
}
```

## Reglas de Testing

### Resoluciones a Probar
1. **Mobile**: 375px (iPhone SE)
2. **Tablet**: 768px (iPad)
3. **Desktop**: 1024px (laptop)
4. **Wide**: 1440px (desktop)
5. **Ultrawide**: 1920px (monitor grande)

### Checklist de Testing
- [ ] Logo visible en todas las resoluciones
- [ ] Búsqueda accesible (desktop visible, mobile en dropdown)
- [ ] Menú de usuario funcional en desktop y mobile
- [ ] Navegación responsive (desktop inline, mobile hamburger)
- [ ] Sin overflow horizontal
- [ ] Elementos no se superponen
- [ ] Tipografía legible en todos los tamaños
- [ ] Botones tienen target size adecuado (44px mínimo en móvil)

## Errores Comunes a Evitar

1. **❌ Usar `flex-1` en searchContainer** - Hace que la búsqueda tome todo el espacio
2. **❌ No incluir breakpoint lg:** - Causa problemas de responsive
3. **❌ Hardcodear clases CSS en skins** - Debe usar `theme.components.header.*`
4. **❌ No probar en mobile** - Desktop puede funcionar pero mobile no
5. **❌ Usar positioning absoluto sin relative container** - Causa overflow
6. **❌ No incluir todas las clases requeridas** - Causa errores cuando se cambia de tema

## Footer Component

### Estructura del Footer
```jsx
<footer className={theme.components.footer.container}>
  <div className={theme.components.footer.content}>
    {/* 3 columnas en desktop, 1 en mobile */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {/* Columna 1: About */}
      {/* Columna 2: Customer Service */}
      {/* Columna 3: Legal */}
    </div>

    <div className={theme.components.footer.divider}>
      {/* Logo centrado */}
      <div className="flex justify-center mb-6">
        <Logo />
      </div>

      {/* Social + Copyright */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Social Media */}
        {/* Copyright */}
      </div>
    </div>
  </div>
</footer>
```

### Clases CSS Requeridas para Footer
```javascript
footer: {
  container: "bg-[color] text-white",
  content: "max-w-7xl mx-auto px-4 py-12",
  columnTitle: "text-lg font-semibold mb-4 text-[color]",
  link: "text-[color] hover:text-[color] transition-colors cursor-pointer block",
  divider: "border-t border-[color] pt-8",
  logoContainer: "text-[color]",
  socialLink: "text-[color] hover:text-[color] transition-colors",
  copyright: "text-sm text-[color]"
}
```

## ✅ Componentes Verificados

- [x] Header: Default Skin + Default Theme
- [x] Header: Minimal Skin + Minimal Theme
- [x] Header: Default Skin + Minimal Theme
- [x] Header: Minimal Skin + Default Theme
- [x] Footer: Default Theme
- [x] Footer: Minimal Theme

Todos los componentes ahora siguen las mismas reglas responsive y son intercambiables.