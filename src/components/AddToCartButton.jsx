import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const AddToCartButton = ({ card, className = "", showQuantity = false }) => {
  const { addItemToCart, isInCart, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding || loading) return;

    setIsAdding(true);
    setMessage("");

    try {
      const result = await addItemToCart(card);
      if (result.success) {
        setMessage("¡Añadido al carrito!");
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage(result.error || "Error al añadir al carrito");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error al añadir al carrito");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  const isCardInCart = isInCart(card.id);

  return (
    <div className="relative">
      <button
        onClick={handleAddToCart}
        disabled={isAdding || loading}
        className={`
          ${className}
          ${isCardInCart 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-blue-600 hover:bg-blue-700'
          }
          text-white font-semibold px-3 py-2 rounded-md transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2
        `}
      >
        {isAdding ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Añadiendo...
          </>
        ) : isCardInCart ? (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            En carrito
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
            </svg>
            Añadir al carrito
          </>
        )}
      </button>
      
      {message && (
        <div className={`
          absolute top-full left-0 mt-2 px-3 py-1 rounded-md text-sm font-medium z-10
          ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
        `}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
