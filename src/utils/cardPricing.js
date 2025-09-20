// Card pricing utility functions extracted from Search.jsx
// Centralized logic for price formatting and availability

export const getLowestPrice = (card) => {
  if (card.price) return card.price;
  if (card.from) return card.from;
  if (card.prices && card.prices.length > 0) {
    return Math.min(...card.prices.map(p => p.price));
  }
  return null;
};

export const getAvailableCount = (card) => {
  if (card.available) return card.available;
  if (card.stock) return card.stock;
  if (card.quantity) return card.quantity;
  return 0;
};

export const createFormatPrice = (t) => (card) => {
  const price = getLowestPrice(card);
  if (!price || price === 0) {
    return t('product.outOfStock');
  }
  return `€${price.toFixed(2)}`;
};