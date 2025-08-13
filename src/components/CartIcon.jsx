import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const CartIcon = () => {
  const { getCartCount, cartItems } = useCart();
  const [showCartPreview, setShowCartPreview] = useState(false);
  const cartCount = getCartCount();

  return (
    <div className="relative">
      <button
        onClick={() => setShowCartPreview(!showCartPreview)}
        className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="Shopping cart"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>

      {/* Cart Preview */}
      {showCartPreview && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Carrito</h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Tu carrito está vacío</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.card_name || item.name} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">IMG</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.card_name || item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {cartItems.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Ver carrito completo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close cart preview */}
      {showCartPreview && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowCartPreview(false)}
        />
      )}
    </div>
  );
};

export default CartIcon;
