import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import BannerNew from "./components/BannerNew";
import Trends from "./components/Trends";
import SetsSidebar from "./components/SetsSidebar";
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
import RequireAuth from "./pages/RequireAuth";
import CartInitializer from "./components/CartInitializer";
import RecentlyViewed from "./components/RecentlyViewed";
import ThemeDemo from "./components/ThemeDemo";
import "./App.css";

function App() {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  return (
    <CartInitializer>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f8fafc, #f0f9ff)' }}>
          <Header onThemeSettingsClick={() => setIsThemeModalOpen(true)} />
          <ThemeDemo
            isOpen={isThemeModalOpen}
            onClose={() => setIsThemeModalOpen(false)}
          />
          <Routes>
            <Route path="/" element={
              <>
                <BannerNew />
                <main className="w-full">
                  <div className="w-full px-3 py-6">
                    <div className="flex gap-0 items-start max-w-7xl mx-auto">
                      <div className="flex-shrink-0 hidden xl:block" style={{ marginLeft: '-3rem' }}>
                        <SetsSidebar />
                      </div>
                      <div className="flex-1 w-full">
                        <Trends />
                      </div>
                    </div>
                    <RecentlyViewed />
                  </div>
                </main>
              </>
            } />
            <Route path="/login" element={<main className="max-w-6xl mx-auto"><Login /></main>} />
            <Route path="/register" element={<main className="max-w-6xl mx-auto"><Register /></main>} />
            <Route path="/search" element={<main className="max-w-7xl mx-auto"><Search /></main>} />
            <Route path="/card/:cardId" element={<main className="max-w-6xl mx-auto"><CardDetail /></main>} />
            <Route path="/checkout" element={<main className="max-w-6xl mx-auto"><Checkout /></main>} />
            <Route path="/bulk-sell" element={<RequireAuth><BulkSell /></RequireAuth>} />
            <Route
              path="/account/*"
              element={
                <main className="max-w-6xl mx-auto">
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
          </Routes>
        </div>
      </BrowserRouter>
    </CartInitializer>
  );
}

export default App;
