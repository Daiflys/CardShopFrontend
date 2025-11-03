# Admin Panel

This directory contains all admin-related code, separated from the main application.

## Structure

```
admin/
├── components/          # Admin-specific components
│   ├── AdminLayout.jsx  # Main layout with sidebar + topbar
│   ├── AdminSidebar.jsx # Navigation sidebar
│   └── AdminTopbar.jsx  # Top navigation bar
├── scenes/             # Admin pages/views
│   ├── dashboard/      # Main dashboard
│   └── bulkUpload/     # CSV bulk card upload
└── data/               # Mock data and constants for admin
```

## Routes

All admin routes are prefixed with `/admin`:

- `/admin` - Dashboard (main admin page)
- `/admin/bulk-upload` - Bulk CSV card upload

## Adding New Admin Pages

1. Create a new folder in `scenes/` (e.g., `scenes/users/`)
2. Create an `index.jsx` file in that folder
3. Add the route in `src/App.jsx` inside the admin routes section
4. Add the menu item in `AdminSidebar.jsx`

## Styling

Uses Tailwind CSS for all styling, matching the main application.

## Authentication

All admin routes are protected with `RequireAuth` component. Make sure to verify admin role on the backend as well.

## Storefront Editor (Theme Customization)

The Storefront Editor lets admins customize a single theme with a Shopify-like experience and live preview. It currently stores config in localStorage to keep frontend-first development simple, and is designed to swap to a backend later.

- Location: `src/admin/scenes/storefrontEditor`
- Live preview iframe sends updates via `postMessage`
- Runtime applier: `src/components/StorefrontConfigListener.jsx`

Sections available:
- Logo & Favicon
- Colors (schemes)
- Typography (headings/body fonts and scale)
- Header (announcement bar, sticky, colors)
- Buttons (radius, casing, primary colors)
- Layout (container width, section spacing, card gap)
- Product Cards (image ratio, density, meta visibility)

Storage schema and key:
- Key: `STOREFRONT_EDITOR_CONFIG`
- Schema defined in `storageManager.js` (DEFAULT_CONFIG)

Runtime application:
- Preview mode (`/?preview=true`): applies updates from the editor instantly
- Normal mode: reads saved config on mount and applies it so shops see their theme by default

Backend handoff: replace reads/writes in `storageManager.js` with API calls keeping the same schema. The editor UI and preview pipeline will remain working.
