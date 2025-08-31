import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import BannerNew from "./components/BannerNew";
import Trends from "./components/Trends";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListProducts from "./pages/ListProducts";
import Search from "./pages/Search";
import CardDetail from "./pages/CardDetail";
import Checkout from "./pages/Checkout";
import AccountLayout from "./pages/account/AccountLayout";
import Profile from "./pages/account/Profile";
import Transactions from "./pages/account/Transactions";
import Settings from "./pages/account/Settings";
import RequireAuth from "./pages/RequireAuth";
import CartInitializer from "./components/CartInitializer";
import "./App.css";

function App() {
  return (
    <CartInitializer>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f8fafc, #f0f9ff)' }}>
          <Header />
          <Routes>
            <Route path="/" element={
              <>
                <BannerNew />
                <main className="w-full">
                  <Trends />
                </main>
              </>
            } />
            <Route path="/login" element={<main className="max-w-6xl mx-auto"><Login /></main>} />
            <Route path="/register" element={<main className="max-w-6xl mx-auto"><Register /></main>} />
            <Route path="/list-products" element={<main className="max-w-6xl mx-auto"><ListProducts /></main>} />
            <Route path="/search" element={<main className="max-w-7xl mx-auto"><Search /></main>} />
            <Route path="/card/:cardId" element={<main className="max-w-6xl mx-auto"><CardDetail /></main>} />
            <Route path="/checkout" element={<main className="max-w-6xl mx-auto"><Checkout /></main>} />
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
