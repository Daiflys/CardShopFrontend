import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Trends from "./components/Trends";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListProducts from "./pages/ListProducts";
import CardDetail from "./pages/CardDetail";
import Checkout from "./pages/Checkout";
import AccountLayout from "./pages/account/AccountLayout";
import Profile from "./pages/account/Profile";
import Transactions from "./pages/account/Transactions";
import Settings from "./pages/account/Settings";
import RequireAuth from "./pages/RequireAuth";
import { CartProvider } from "./context/CartContext";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen" style={{background: 'var(--gradient-bg, linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%))'}}>
          <Header />
          <main className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={
                <>
                  <Banner />
                  <Trends />
                </>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/list-products" element={<ListProducts />} />
              <Route path="/card/:cardId" element={<CardDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/account/*"
                element={
                  <RequireAuth>
                    <AccountLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<Profile />} />
                <Route path="profile" element={<Profile />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
