import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import BannerNew from "./components/BannerNew";
import Trends from "./components/Trends";
import SetsSidebar from "./components/SetsSidebar";
import PageLayout from "./components/PageLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import CardDetail from "./pages/CardDetail";
import Checkout from "./pages/Checkout";
import AccountLayout from "./pages/account/AccountLayout";
import Profile from "./pages/account/Profile";
import Transactions from "./pages/account/Transactions";
import Settings from "./pages/account/Settings";
import BulkSell from "./pages/BulkSell";
import AdvancedSearch from "./pages/AdvancedSearch";
import RequireAuth from "./pages/RequireAuth";
import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/scenes/dashboard";
import BulkUpload from "./admin/scenes/bulkUpload";
import Users from "./admin/scenes/users";
import SkinEditor from "./admin/scenes/skinEditor";
import AuditLogs from "./admin/scenes/auditLogs";
import BulkPriceChange from "./admin/scenes/bulkPrice";
import CartInitializer from "./components/CartInitializer";
import RecentlyViewed from "./components/RecentlyViewed";
import "./App.css";

function App() {
  return (
    <CartInitializer>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes - No Header/Footer */}
          <Route path="/admin/*" element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="bulk-upload" element={<BulkUpload />} />
            <Route path="users" element={<Users />} />
            <Route path="skin-editor" element={<SkinEditor />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="bulk-price" element={<BulkPriceChange />} />
          </Route>

          {/* Main Routes - With Header/Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={
              <main className="w-full">
                <PageLayout
                  sidebar={<SetsSidebar />}
                  sidebarTitle="Collections"
                  showMobileSidebarButton={false}
                  containerClassName="py-6 lg:py-8"
                >
                  <BannerNew />
                  <Trends />
                  <RecentlyViewed />
                </PageLayout>
              </main>
            } />
            <Route path="/login" element={<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><Login /></main>} />
            <Route path="/register" element={<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><Register /></main>} />
            <Route path="/search" element={<main className="max-w-7xl mx-auto"><Search /></main>} />
            <Route path="/advanced-search" element={<AdvancedSearch />} />
            <Route path="/card/:cardId" element={<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><CardDetail /></main>} />
            <Route path="/checkout" element={<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><Checkout /></main>} />
            <Route path="/bulk-sell" element={<RequireAuth><BulkSell /></RequireAuth>} />

            <Route
              path="/account/*"
              element={
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <RequireAuth>
                    <AccountLayout />
                  </RequireAuth>
                </main>
              }
            >
              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </CartInitializer>
  );
}

export default App;
