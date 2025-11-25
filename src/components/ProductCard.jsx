import React from "react";
import { useNavigate } from "react-router-dom";
import RarityIndicator from "./RarityIndicator";

const ProductCard = ({ id, cardName, imageUrl, name, price, set, rarity, className = '' }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/card/${id}`);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow p-3 flex flex-col items-center min-w-[140px] max-w-[160px] hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden ${className}`}
      onClick={handleCardClick}
    >
      <div className="w-24 h-32 flex items-center justify-center mb-2">
        <img src={imageUrl} alt={cardName} className="object-contain h-full w-full" />
      </div>

      <div className="flex flex-col items-center">
        <div className="text-lg font-bold text-blue-800 mb-1">
          <span className="text-lg font-bold text-blue-800 mb-1">
            {cardName}
          </span>
        </div>

        {set && (
          <div className="text-xs text-gray-500 text-center mb-1">
            <span className="text-xs text-gray-500 text-center mb-1">{set}</span>
          </div>
        )}

        {price && (
          <div className="text-sm font-semibold text-green-600">
            <span className="text-sm font-semibold text-green-600">${price}</span>
          </div>
        )}
      </div>

      <RarityIndicator rarity={rarity} className="rounded-b-lg" />
    </div>
  );
};

export default ProductCard;
