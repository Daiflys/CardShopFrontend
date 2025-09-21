import React from "react";

const LineLimiterProductCard = ({
  theme,
  imageSection,
  titleSection,
  metaSection,
  priceSection,
  rarityIndicator,
  onClick
}) => {
  const productCardStyles = theme?.components?.productCard || {
    container: "bg-white border-2 border-black shadow-none p-3 flex flex-col items-center min-w-[140px] max-w-[160px] hover:border-gray-700 transition-colors cursor-pointer relative overflow-hidden",
    imageContainer: "w-24 h-32 flex items-center justify-center mb-2 border border-black p-1",
    contentContainer: "flex flex-col items-center border-t border-black pt-2 w-full",
    title: "text-lg font-bold text-black mb-1 border-b border-black pb-1 text-center",
    meta: "text-xs text-black text-center mb-1 border-b border-gray-400 pb-1",
    price: "text-sm font-semibold text-black border border-black px-2 py-1"
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

      <div className="absolute top-1 right-1 border border-black bg-white">
        {rarityIndicator}
      </div>
    </div>
  );
};

export default LineLimiterProductCard;