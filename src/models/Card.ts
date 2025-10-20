/**
 * Card model - Centralized definition of Card properties
 * Based on backend Card entity and frontend usage patterns
 */

export interface CardToSell {
  id?: string | null;
  cardPrice?: number;
  price?: number;
  condition?: string;
  quantity?: number;
  language?: string;
}

export interface CardData {
  // Core identification
  id?: string | null;
  oracle_id?: string | null;
  oracleId?: string | null;
  idAsUUID?: string | null;

  // Basic card information
  name?: string;
  printed_name?: string | null;
  printedName?: string | null;

  // Visual representation
  imageUrl?: string;
  image_url?: string;
  image?: string;

  // Set information
  set?: string;
  setName?: string;
  set_name?: string;
  setCode?: string;
  set_code?: string;

  // Card properties
  rarity?: string;
  number?: string;
  collector_number?: string;
  collectorNumber?: string;
  language?: string;
  lang?: string;

  // Game mechanics
  manaCost?: string;
  mana_cost?: string;
  convertedManaCost?: number | null;
  cmc?: number | null;
  typeLine?: string;
  type_line?: string;
  cardColors?: string[];
  colors?: string[];
  oracleText?: string;
  oracle_text?: string;
  flavorText?: string;
  flavor_text?: string;
  artistName?: string;
  artist?: string;

  // Legacy/alternative properties
  rules?: string[];
  printedIn?: string;
  block?: string;

  // Availability and pricing
  available?: number;
  cardsToSell?: CardToSell[];

  // Pricing information
  price?: number | null;
  from?: number | null;
  priceTrend?: number | null;
  avg30?: number | null;
  avg7?: number | null;
  avg1?: number | null;

  // Cart/listing specific
  quantity?: number;
  condition?: string;
  sellerId?: string | null;
  userId?: string | null;
  listingId?: string | null;
  cardToSellId?: string | null;

  // React-specific properties
  reactKey?: string | null;

  // Nested card structure (for API responses)
  card?: CardData;
}

export interface BulkSellCardData {
  price: number;
  condition: string;
  quantity: number;
  language?: string;
  comments?: string;
}

class Card {
  // Core identification
  id: string | null;
  oracle_id: string | null;
  idAsUUID: string | null;

  // Basic card information
  name: string;
  printed_name: string | null;

  // Visual representation
  imageUrl: string;

  // Set information
  set: string;
  setName: string;
  setCode: string;

  // Card properties
  rarity: string;
  number: string;
  collectorNumber: string;
  language: string;

  // Game mechanics
  manaCost: string;
  convertedManaCost: number | null;
  typeLine: string;
  cardColors: string[];
  oracleText: string;
  flavorText: string;
  artistName: string;

  // Legacy/alternative properties
  rules: string[];
  printedIn: string;
  block: string;

  // Availability and pricing
  available: number;
  cardsToSell: CardToSell[];

  // Pricing information
  price: number | null;
  from: number | null;
  priceTrend: number | null;
  avg30: number | null;
  avg7: number | null;
  avg1: number | null;

  // Cart/listing specific
  quantity: number;
  condition: string;
  sellerId: string | null;
  listingId: string | null;

  // React-specific properties
  reactKey: string | null;

  // Compatibility aliases
  image_url: string;
  image: string;
  set_name: string;
  set_code: string;
  collector_number: string;
  card_name: string;

  constructor(data: CardData = {}) {
    // Core identification
    this.id = data.id || null;
    this.oracle_id = data.oracle_id || data.oracleId || null;
    this.idAsUUID = data.idAsUUID || null;

    // Basic card information
    this.name = data.name || '';
    this.printed_name = data.printed_name || data.printedName || null;

    // Visual representation
    this.imageUrl = data.imageUrl || data.image_url || data.image || '';

    // Set information
    this.set = data.set || data.set_code || '';
    this.setName = data.setName || data.set_name || '';
    this.setCode = data.setCode || data.set_code || data.set || '';

    // Card properties
    this.rarity = data.rarity || '';
    this.number = data.number || data.collector_number || data.collectorNumber || '';
    this.collectorNumber = data.collectorNumber || data.collector_number || data.number || '';
    this.language = data.language || data.lang || '';

    // Game mechanics (from new backend fields)
    this.manaCost = data.manaCost || data.mana_cost || '';
    this.convertedManaCost = data.convertedManaCost || data.cmc || null;
    this.typeLine = data.typeLine || data.type_line || '';
    this.cardColors = data.cardColors || data.colors || [];
    this.oracleText = data.oracleText || data.oracle_text || '';
    this.flavorText = data.flavorText || data.flavor_text || '';
    this.artistName = data.artistName || data.artist || '';

    // Legacy/alternative properties (to maintain compatibility)
    this.rules = data.rules || [];
    this.printedIn = data.printedIn || '';
    this.block = data.block || '';

    // Availability and pricing
    this.available = data.available || 0;
    this.cardsToSell = data.cardsToSell || [];

    // Pricing information
    this.price = data.price || null;
    this.from = data.from || null;
    this.priceTrend = data.priceTrend || null;
    this.avg30 = data.avg30 || null;
    this.avg7 = data.avg7 || null;
    this.avg1 = data.avg1 || null;

    // Cart/listing specific (when card is in cart or being sold)
    this.quantity = data.quantity || 1;
    this.condition = data.condition || '';
    this.sellerId = data.sellerId || data.userId || null;
    this.listingId = data.listingId || data.cardToSellId || null;

    // React-specific properties
    this.reactKey = data.reactKey || null;

    // Additional compatibility aliases
    this.image_url = this.imageUrl;
    this.image = this.imageUrl;
    this.set_name = this.setName;
    this.set_code = this.setCode;
    this.collector_number = this.collectorNumber;
    this.card_name = this.name;
  }

  /**
   * Create a Card instance from API response data
   * Handles both individual cards and cards with availability
   */
  static fromApiResponse(data: CardData): Card {
    // Handle case where data has nested card structure
    if (data.card) {
      const card = new Card(data.card);
      card.available = data.available || (data.cardsToSell ? data.cardsToSell.length : 0);
      card.cardsToSell = data.cardsToSell || [];
      return card;
    }

    // Handle direct card data
    return new Card(data);
  }

  /**
   * Create multiple Card instances from API response array
   */
  static fromApiResponseArray(dataArray: CardData[]): Card[] {
    if (!Array.isArray(dataArray)) {
      console.warn('Card.fromApiResponseArray: Expected array, got:', typeof dataArray);
      return [];
    }

    return dataArray.map(data => Card.fromApiResponse(data));
  }

  /**
   * Convert card to format suitable for cart operations
   */
  toCartFormat() {
    return {
      id: this.listingId || this.id,
      card_name: this.name,
      image_url: this.imageUrl,
      name: this.name,
      price: this.price,
      set: this.setName || this.set,
      sellerId: this.sellerId,
      quantity: this.quantity,
      condition: this.condition,
      available: this.available
    };
  }

  /**
   * Convert card to format suitable for bulk sell operations
   */
  toBulkSellFormat(cardData: BulkSellCardData) {
    return {
      card_id: this.id, // Always use original card.id for backend
      oracle_id: this.oracle_id,
      set_name: this.setName,
      set_code: this.setCode,
      card_name: this.name,
      image_url: this.imageUrl,
      price: cardData.price,
      condition: cardData.condition,
      quantity: cardData.quantity,
      language: cardData.language || 'en',
      comments: cardData.comments || ''
    };
  }

  /**
   * Get display name for the card
   */
  getDisplayName(): string {
    return this.printed_name || this.name || 'Unknown Card';
  }

  /**
   * Get primary image URL
   */
  getImageUrl(): string {
    return this.imageUrl || this.image_url || this.image || '';
  }

  /**
   * Get set name for display
   */
  getSetName(): string {
    return this.setName || this.set_name || this.set || 'Unknown Set';
  }

  /**
   * Check if card has availability information
   */
  hasAvailability(): boolean {
    return this.available > 0 || (this.cardsToSell && this.cardsToSell.length > 0);
  }

  /**
   * Get lowest price from cardsToSell or fallback to price
   */
  getLowestPrice(): number | null {
    if (this.cardsToSell && this.cardsToSell.length > 0) {
      const prices = this.cardsToSell
        .map(card => card.cardPrice || card.price)
        .filter((price): price is number => price != null && price > 0);

      return prices.length > 0 ? Math.min(...prices) : this.price;
    }

    return this.price || this.from;
  }

  /**
   * Clone the card with new data
   */
  clone(newData: Partial<CardData> = {}): Card {
    return new Card({ ...this, ...newData });
  }
}

export default Card;
