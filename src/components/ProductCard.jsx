import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ id, card_name, image_url }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/card/${id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow p-3 flex flex-col items-center min-w-[140px] max-w-[160px] cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <div className="w-24 h-32 flex items-center justify-center mb-2">
        <img src={image_url} alt={card_name} className="object-contain h-full w-full" />
      </div>
      <span className="text-lg font-bold text-blue-800 mb-1">{card_name}</span>
      <span className="text-sm text-gray-700 text-center">{name}</span>
    </div>
  );
};

export default ProductCard; 