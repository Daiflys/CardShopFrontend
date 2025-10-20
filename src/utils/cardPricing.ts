// Card pricing utility functions extracted from Search.jsx
// Centralized logic for price formatting and availability

interface CardWithPrice {
  price?: number;
  from?: number;
  prices?: Array<{ price: number }>;
}

interface CardWithAvailability {
  available?: number;
  stock?: number;
  quantity?: number;
}

export type Card = CardWithPrice & CardWithAvailability;

export const getLowestPrice = (card: Card): number | null => {
  if (card.price) return card.price;
  if (card.from) return card.from;
  if (card.prices && card.prices.length > 0) {
    return Math.min(...card.prices.map(p => p.price));
  }
  return null;
};

export const getAvailableCount = (card: Card): number => {
  if (card.available) return card.available;
  if (card.stock) return card.stock;
  if (card.quantity) return card.quantity;
  return 0;
};

export const createFormatPrice = (t: (key: string) => string) => (card: Card): string => {
  const price = getLowestPrice(card);
  if (!price || price === 0) {
    return t('product.outOfStock');
  }
  return `€${price.toFixed(2)}`;
};
