import React from "react";
import { useNavigate } from "react-router-dom";
import RarityIndicator from "./RarityIndicator";

const ProductCard = ({ id, card_name, image_url, name, price, set, rarity }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/card/${id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow p-3 flex flex-col items-center min-w-[140px] max-w-[160px] hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="w-24 h-32 flex items-center justify-center mb-2">
        <img src={image_url} alt={card_name} className="object-contain h-full w-full" />
      </div>
      <span className="text-lg font-bold text-blue-800 mb-1">
        {card_name}
      </span>
      {set && (
        <span className="text-xs text-gray-500 text-center mb-1">{set}</span>
      )}
      {price && (
        <span className="text-sm font-semibold text-green-600">${price}</span>
      )}
      
      {/* Rarity Indicator at the bottom of the entire card */}
      <RarityIndicator rarity={rarity} className="rounded-b-lg" />
    </div>
  );
};

export default ProductCard; 