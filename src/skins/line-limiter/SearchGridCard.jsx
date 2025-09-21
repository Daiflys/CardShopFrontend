import React from "react";

const LineLimiterSearchGridCard = ({
  theme,
  cardImage,
  cardInfo,
  priceSection,
  actionSection,
  rarityIndicator,
  onClick,
  isAvailable
}) => {
  const searchGridCardStyles = theme?.components?.searchGridCard || {
    container: "border-2 border-red-600 hover:border-red-800 transition-all cursor-pointer shadow-none overflow-hidden relative w-full max-w-sm mx-auto bg-white",
    available: "bg-white",
    unavailable: "bg-gray-100",
    imageContainer: "aspect-[3/4] bg-gray-50 border-b-2 border-red-600 p-2",
    contentContainer: "p-3 relative min-h-[80px] flex flex-col border-b-2 border-red-600",
    infoSection: "mb-2 flex-1 border border-black p-2",
    cardWrapper: "border-2 border-black bg-white m-1 p-2"
  };

  return (
    <div
      className={`${searchGridCardStyles.container} ${
        isAvailable ? searchGridCardStyles.available : searchGridCardStyles.unavailable
      }`}
      onClick={onClick}
    >
      <div className={searchGridCardStyles.cardWrapper}>
        <div className={searchGridCardStyles.imageContainer}>
          <div className="border border-black p-1">
            {cardImage}
          </div>
        </div>

        <div className={searchGridCardStyles.contentContainer}>
          <div className={searchGridCardStyles.infoSection}>
            {cardInfo}
          </div>

          <div className="flex items-center justify-between gap-2 mt-2 border-t border-black pt-2">
            <div className="flex-1 border border-black p-1">
              {priceSection}
            </div>
            <div className="flex-shrink-0 border border-black p-1">
              {actionSection}
            </div>
          </div>
        </div>

        <div className="absolute top-3 right-3 border border-black bg-white p-1">
          {rarityIndicator}
        </div>
      </div>
    </div>
  );
};

export default LineLimiterSearchGridCard;