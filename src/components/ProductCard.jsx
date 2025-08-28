import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ id, card_name, image_url, name, price, set }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/card/${id}`);
  };

  return (
    <div 
      className="card-modern p-4 flex flex-col items-center min-w-[140px] max-w-[160px] cursor-pointer hover-lift group"
      onClick={handleCardClick}
    >
      <div className="w-24 h-32 flex items-center justify-center mb-3 overflow-hidden rounded-lg">
        <img src={image_url} alt={card_name} className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-110" />
      </div>
      <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 text-center leading-tight group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
        {card_name}
      </span>
      {set && (
        <span className="text-xs text-gray-500 text-center mb-1 font-medium">{set}</span>
      )}
      {price && (
        <span className="text-sm font-bold text-emerald-600 px-2 py-1 bg-emerald-50 rounded-full">${price}</span>
      )}
    </div>
  );
};

export default ProductCard; 