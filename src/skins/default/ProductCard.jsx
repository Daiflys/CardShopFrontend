import React from "react";

const DefaultProductCard = ({
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
    container: "bg-white rounded-lg shadow p-3 flex flex-col items-center min-w-[140px] max-w-[160px] hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden",
    imageContainer: "w-24 h-32 flex items-center justify-center mb-2",
    contentContainer: "flex flex-col items-center",
    title: "text-lg font-bold text-blue-800 mb-1",
    meta: "text-xs text-gray-500 text-center mb-1",
    price: "text-sm font-semibold text-green-600"
  };

  return (
    <div
      className={productCardStyles.container}
      onClick={onClick}
    >
      <div className={productCardStyles.imageContainer}>
        {imageSection}
      </div>

      <div className={productCardStyles.contentContainer}>
        <div className={productCardStyles.title}>
          {titleSection}
        </div>

        {metaSection && (
          <div className={productCardStyles.meta}>
            {metaSection}
          </div>
        )}

        {priceSection && (
          <div className={productCardStyles.price}>
            {priceSection}
          </div>
        )}
      </div>

      {rarityIndicator}
    </div>
  );
};

export default DefaultProductCard;