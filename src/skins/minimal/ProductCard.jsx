import React from "react";

const MinimalProductCard = ({
  theme,
  imageSection,
  titleSection,
  metaSection,
  priceSection,
  rarityIndicator,
  onClick
}) => {
  // Fallback if theme or productCard styles are not available
  const productCardStyles = theme?.components?.productCard || {
    container: "bg-white rounded-md border border-gray-200 p-2 flex flex-col items-center min-w-[120px] max-w-[140px] hover:border-gray-400 transition-colors cursor-pointer relative overflow-hidden",
    imageContainer: "w-20 h-28 flex items-center justify-center mb-2",
    contentContainer: "flex flex-col items-center",
    title: "text-base font-medium text-gray-900 mb-1 text-center",
    price: "text-sm font-semibold text-gray-700"
  };

  return (
    <div
      className={productCardStyles.container}
      onClick={onClick}
    >
      {/* Simplified layout with image taking more space */}
      <div className={productCardStyles.imageContainer}>
        {imageSection}
      </div>

      {/* Minimal content - just title and price */}
      <div className={productCardStyles.contentContainer}>
        <div className={productCardStyles.title}>
          {titleSection}
        </div>

        {priceSection && (
          <div className={productCardStyles.price}>
            {priceSection}
          </div>
        )}
      </div>

      {/* No rarity indicator in minimal design */}
    </div>
  );
};

export default MinimalProductCard;