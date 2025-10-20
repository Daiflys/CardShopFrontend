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
