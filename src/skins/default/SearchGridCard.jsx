import React from "react";

const DefaultSearchGridCard = ({
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
    container: "rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group hover:shadow-md overflow-hidden relative w-full max-w-sm mx-auto",
    available: "bg-white",
    unavailable: "bg-gray-300",
    imageContainer: "aspect-[3/4] bg-gray-50 rounded-t-lg p-2 sm:p-3",
    contentContainer: "p-3 sm:p-4 relative min-h-[100px] sm:min-h-[120px] flex flex-col",
    infoSection: "mb-2 sm:mb-3 flex-1",
    bottomSection: "mt-auto mb-2 sm:mb-3"
  };

  return (
    <div
      className={`${searchGridCardStyles.container} ${
        isAvailable ? searchGridCardStyles.available : searchGridCardStyles.unavailable
      }`}
      onClick={onClick}
    >
      {/* Card Image */}
      <div className={searchGridCardStyles.imageContainer}>
        {cardImage}
      </div>

      {/* Card Info */}
      <div className={searchGridCardStyles.contentContainer}>
        {/* Card Details */}
        <div className={searchGridCardStyles.infoSection}>
          {cardInfo}
        </div>

        {/* Bottom section with price and actions */}
        <div className={searchGridCardStyles.bottomSection}>
          {priceSection}
          {actionSection}
        </div>
      </div>

      {/* Rarity Indicator at the bottom of the entire card */}
      {rarityIndicator}
    </div>
  );
};

export default DefaultSearchGridCard;