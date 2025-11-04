import React from "react";
import { useNavigate } from "react-router-dom";
import RarityIndicator from "./RarityIndicator";
import { useComponent } from "../hooks/useComponent.js";
import { useTheme } from "../hooks/useTheme";

const ProductCard = ({ id, cardName, imageUrl, name, price, set, rarity }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Get the ProductCard component from current skin
  const ProductCardComponent = useComponent('ProductCard');

  const handleCardClick = () => {
    navigate(`/card/${id}`);
  };

  // If no ProductCardComponent is loaded yet, show a fallback
  if (!ProductCardComponent) {
    return (
      <div
        className="bg-white rounded-lg shadow p-3 flex flex-col items-center min-w-[140px] max-w-[160px] hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden"
        onClick={handleCardClick}
      >
        <div className="w-24 h-32 flex items-center justify-center mb-2">
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  // Prepare sections for the skin
  const imageSection = (
    <img src={imageUrl} alt={cardName} className="object-contain h-full w-full" />
  );

  const titleSection = (
    <span className="text-lg font-bold text-blue-800 mb-1">
      {cardName}
    </span>
  );

  const metaSection = set ? (
    <span className="text-xs text-gray-500 text-center mb-1">{set}</span>
  ) : null;

  const priceSection = price ? (
    <span className="text-sm font-semibold text-green-600">${price}</span>
  ) : null;

  const rarityIndicator = (
    <RarityIndicator rarity={rarity} className="rounded-b-lg" />
  );

  return (
    <ProductCardComponent
      theme={theme}
      imageSection={imageSection}
      titleSection={titleSection}
      metaSection={metaSection}
      priceSection={priceSection}
      rarityIndicator={rarityIndicator}
      onClick={handleCardClick}
    />
  );
};

export default ProductCard; 