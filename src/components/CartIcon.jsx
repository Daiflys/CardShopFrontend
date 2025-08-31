import React, { useState } from "react";
import useCartStore from "../store/cartStore";
import { useNavigate } from "react-router-dom";

const CartIcon = () => {
  const { getCartCount, cartItems } = useCartStore();
  const [showCartPreview, setShowCartPreview] = useState(false);
  const cartCount = getCartCount();
  const hasItems = cartCount > 0;
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => setShowCartPreview(!showCartPreview)}
        className={`relative p-2 rounded-md transition-colors ${hasItems ? 'text-blue-700 bg-blue-50 hover:bg-blue-100' : 'text-gray-700 hover:text-blue-600'}`}
        aria-label="Shopping cart"
        title={hasItems ? `Cart (${cartCount})` : 'Empty cart'}
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3 3h2l.4 2H7l1.2 6h9.3a2 2 0 0 0 1.9-1.4l1.3-4.6H5.4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="19" r="1.7" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="18" cy="19" r="1.7" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </svg>
        {hasItems && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] rounded-full h-5 min-w-5 px-1 flex items-center justify-center font-bold shadow">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>

      {/* Cart Preview */}
      {showCartPreview && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cart</h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
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
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {cartItems.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <button 
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => { setShowCartPreview(false); navigate('/checkout'); }}
                >
                  View cart
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
