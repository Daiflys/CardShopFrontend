import React, { useState } from "react";
import useCartStore from "../store/cartStore";

const AddToCartButton = ({ card, className = "", showQuantity = false }) => {
  const { addItemToCart, isInCart, loading } = useCartStore();
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
        setMessage("Added to cart!");
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage(result.error || "Error adding to cart");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error adding to cart");
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
          inline-flex items-center justify-center gap-2
        `}
        title={isCardInCart ? 'In cart' : 'Add to cart'}
      >
        {isAdding ? (
          <>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white">
              <span className="h-4 w-4 rounded-full border-2 border-blue-700 border-t-transparent animate-spin" />
            </span>
            Adding...
          </>
        ) : isCardInCart ? (
          <>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-green-700">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            In cart
          </>
        ) : (
          <>
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-700">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M3 3h2l.4 2H7l1.2 6h9.3a2 2 0 0 0 1.9-1.4l1.3-4.6H5.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="19" r="1.6" stroke="currentColor" strokeWidth="2" />
                <circle cx="18" cy="19" r="1.6" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] font-black leading-none">+
              </span>
            </span>
            Add to cart
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
