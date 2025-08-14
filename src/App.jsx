import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Trends from "./components/Trends";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListProducts from "./pages/ListProducts";
import CardDetail from "./pages/CardDetail";
import { CartProvider } from "./context/CartContext";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="bg-gray-100 min-h-screen">
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
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
