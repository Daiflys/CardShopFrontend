import React from "react";
import { useNavigate } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ id, card_name, image_url, name, price, set }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/card/${id}`);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="bg-white rounded-lg shadow p-3 flex flex-col items-center min-w-[140px] max-w-[160px] hover:shadow-lg transition-shadow"
    >
      <div 
        className="w-24 h-32 flex items-center justify-center mb-2 cursor-pointer"
        onClick={handleCardClick}
      >
        <img src={image_url} alt={card_name} className="object-contain h-full w-full" />
      </div>
      <span className="text-lg font-bold text-blue-800 mb-1 cursor-pointer" onClick={handleCardClick}>
        {card_name}
      </span>
      {set && (
        <span className="text-xs text-gray-500 text-center mb-1">{set}</span>
      )}
      {price && (
        <span className="text-sm font-semibold text-green-600 mb-3">${price}</span>
      )}
      
      <div onClick={handleAddToCartClick}>
        <AddToCartButton 
          card={{ id, card_name, image_url, name, price, set }}
          className="w-full text-sm"
        />
      </div>
    </div>
  );
};

export default ProductCard; 