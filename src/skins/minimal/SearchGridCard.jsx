import React from "react";

const MinimalSearchGridCard = ({
  theme,
  cardImage,
  cardInfo,
  priceSection,
  actionSection,
  rarityIndicator,
  onClick,
  isAvailable
}) => {
  // Fallback if theme or searchGridCard styles are not available
  const searchGridCardStyles = theme?.components?.searchGridCard || {
    container: "rounded-md border border-gray-200 hover:border-gray-400 transition-all cursor-pointer hover:shadow-sm overflow-hidden relative w-full max-w-sm mx-auto",
    available: "bg-white",
    unavailable: "bg-gray-100",
    imageContainer: "aspect-[3/4] bg-gray-50 rounded-t-md p-2",
    contentContainer: "p-3 relative min-h-[80px] flex flex-col",
    infoSection: "mb-2 flex-1"
  };

  return (
    <div
      className={`${searchGridCardStyles.container} ${
        isAvailable ? searchGridCardStyles.available : searchGridCardStyles.unavailable
      }`}
      onClick={onClick}
    >
      {/* Simplified layout - image takes more space */}
      <div className={searchGridCardStyles.imageContainer}>
        {cardImage}
      </div>

      {/* Minimal content layout */}
      <div className={searchGridCardStyles.contentContainer}>
        {/* Compact card info */}
        <div className={searchGridCardStyles.infoSection}>
          {cardInfo}
        </div>

        {/* Inline price and action */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex-1">
            {priceSection}
          </div>
          <div className="flex-shrink-0">
            {actionSection}
          </div>
        </div>
      </div>

      {/* No rarity indicator in minimal design */}
    </div>
  );
};

export default MinimalSearchGridCard;