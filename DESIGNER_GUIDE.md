# 🎨 Designer Guide - Modular Skinning System

This guide allows you to create custom designs without needing to know programming logic. You only need basic HTML and CSS knowledge.

## 📂 File Structure (You only need these)

```
src/skins/
├── default/           # ← Default skin (DO NOT TOUCH)
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   └── SearchGridCard.jsx
├── minimal/           # ← Minimalist skin (you can copy as base)
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   └── SearchGridCard.jsx
└── your-new-skin/     # ← Create your design here
    ├── Header.jsx
    ├── Footer.jsx
    ├── ProductCard.jsx
    └── SearchGridCard.jsx
```

## 🎯 Step 1: Create Your New Skin

1. **Create a folder** for your skin:
```bash
src/skins/my-design/
```

2. **Copy an existing skin** as base:
   - Copy all files from `minimal/` to `my-design/`
   - Or copy from `default/` if you want more elements

## 🎨 Step 2: Edit Components (JSX + CSS Only)

**Example - Footer.jsx:**
```jsx
import React from "react";

const MyFooter = ({
  theme,
  logo,
  aboutSection,
  customerServiceSection,
  legalSection,
  socialMediaSection,
  copyrightSection
}) => {
  return (
    <footer className="bg-purple-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* YOUR DESIGN HERE - Only change HTML structure */}
        <div className="flex flex-col items-center space-y-6">

          {/* Centered logo */}
          <div className="text-purple-200">
            {logo}
          </div>

          {/* Links in single row */}
          <div className="flex gap-8 text-sm">
            <span className="text-purple-300 hover:text-white cursor-pointer">About</span>
            <span className="text-purple-300 hover:text-white cursor-pointer">Help</span>
            <span className="text-purple-300 hover:text-white cursor-pointer">Contact</span>
          </div>

          {/* Social media */}
          <div className="flex gap-4">
            {socialMediaSection}
          </div>

          {/* Copyright */}
          <div className="text-purple-400 text-xs">
            {copyrightSection}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MyFooter;
```

## 🎯 Step 3: Register Your Skin

**Edit `src/registry/skinLoader.js`:**

```javascript
// 1. Import your components
import MyHeader from '../skins/my-design/Header.jsx';
import MyFooter from '../skins/my-design/Footer.jsx';
import MyProductCard from '../skins/my-design/ProductCard.jsx';
import MySearchGridCard from '../skins/my-design/SearchGridCard.jsx';

// 2. Register your skin (at the end of the file, after existing ones)
componentRegistry.registerSkin('my-design', {
  Header: MyHeader,
  Footer: MyFooter,
  ProductCard: MyProductCard,
  SearchGridCard: MySearchGridCard
});
```

## 🎨 Step 4: Create Your Theme (Colors and Styles)

**Create `src/themes/my-theme.theme.js`:**

```javascript
export const myTheme = {
  id: 'my-theme',
  name: 'My Purple Theme',
  components: {
    header: {
      container: "bg-purple-800 text-white shadow-lg",
      logo: "text-2xl font-bold text-purple-100",
      navigation: "flex gap-6 text-purple-200",
      searchInput: "bg-purple-700 text-white border-purple-600",
      // ... more styles
    },
    footer: {
      container: "bg-purple-900 text-white",
      link: "text-purple-300 hover:text-white transition-colors cursor-pointer",
      // ... more styles
    },
    productCard: {
      container: "bg-white rounded-xl border-2 border-purple-200 hover:border-purple-400 shadow-lg",
      title: "text-purple-900 font-bold",
      price: "text-purple-700 font-semibold",
      // ... more styles
    }
  }
};
```

**Then, import your theme in `src/components/ThemeDemo.jsx`:**
```javascript
import { myTheme } from '../themes/my-theme.theme.js';

// Add your theme to the availableThemes object:
const availableThemes = {
  default: defaultTheme,
  minimal: minimalTheme,
  'my-theme': myTheme  // ← Add here
};
```

## 🔧 What You DON'T Need to Do (Zero Logic)

- ❌ **DON'T touch** logic files (`/api/`, `/store/`, `/utils/`)
- ❌ **DON'T handle** state (useState, useEffect, etc.)
- ❌ **DON'T write** complex JavaScript functions
- ❌ **DON'T configure** APIs or routes

## ✅ What You CAN Do (Design Only)

- ✅ **Change HTML structure** (divs, classes, layout)
- ✅ **Use Tailwind CSS** (colors, spacing, responsive)
- ✅ **Reorder elements** (logo top/bottom, menu left/right)
- ✅ **Hide/show sections** (like I did in minimal)
- ✅ **Change sizes, fonts, colors**

## 🎯 Practical Example: Custom ProductCard

```jsx
const MyProductCard = ({
  theme,
  imageSection,
  titleSection,
  metaSection,
  priceSection,
  rarityIndicator,
  onClick
}) => {
  return (
    <div
      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 hover:scale-105 transition-transform cursor-pointer border border-blue-200"
      onClick={onClick}
    >
      {/* Larger image */}
      <div className="w-32 h-44 mx-auto mb-3 rounded-lg overflow-hidden">
        {imageSection}
      </div>

      {/* Title with different font */}
      <div className="text-center">
        <div className="font-bold text-blue-900 text-lg mb-2">
          {titleSection}
        </div>

        {/* Highlighted price */}
        {priceSection && (
          <div className="bg-yellow-100 rounded-full px-3 py-1 inline-block">
            {priceSection}
          </div>
        )}
      </div>

      {/* Rarity indicator in corner */}
      <div className="absolute top-2 right-2">
        {rarityIndicator}
      </div>
    </div>
  );
};
```

## 🚀 How to Test Your Design

1. **Save** your files
2. **Go to Theme Settings** (settings button in header when logged in)
3. **Select** your skin from dropdown
4. **See changes instantly!**

## 📋 Data You Receive Automatically

Each component receives pre-processed data:

### ProductCard receives:
- `imageSection` - The card image
- `titleSection` - The card name
- `metaSection` - Set information (can be null)
- `priceSection` - The price (can be null)
- `rarityIndicator` - Rarity indicator
- `onClick` - Click function (DON'T TOUCH)

### Footer receives:
- `logo` - Company logo
- `aboutSection` - Complete "About Us" section
- `customerServiceSection` - Complete "Customer Service" section
- `legalSection` - Complete "Legal" section
- `socialMediaSection` - Social media links
- `copyrightSection` - Copyright text

### Header receives:
- `logo` - Clickable logo
- `navigation` - Navigation menu
- `searchComponent` - Complete search bar
- `userMenu` - User menu + cart
- `languageSwitcher` - Language selector

### SearchGridCard receives:
- `cardImage` - Card image
- `cardInfo` - Card information (name, set, etc.)
- `priceSection` - Price section
- `actionSection` - Action buttons (Add to Cart, etc.)
- `rarityIndicator` - Rarity indicator

## 📝 Tailwind CSS Tips

### Common colors:
- `bg-blue-500` - Blue background
- `text-white` - White text
- `border-gray-200` - Light gray border

### Spacing:
- `p-4` - Padding
- `m-2` - Margin
- `gap-4` - Space between flex elements

### Layout:
- `flex` - Display flex
- `grid` - Display grid
- `justify-center` - Center horizontally
- `items-center` - Center vertically

### Responsive:
- `md:flex-row` - On medium screens, use flex-row
- `lg:text-xl` - On large screens, use xl text

## 🔄 Recommended Workflow

1. **Copy** an existing skin as base
2. **Modify** one component at a time
3. **Test** changes in browser
4. **Iterate** until achieving desired design
5. **Register** your skin in skinLoader.js
6. **Share** your design with the team

---

**You don't need to look for APIs or process data! Everything arrives automatically to your components.**

## 📄 Version History

- **v1.0** - Initial guide with basic examples