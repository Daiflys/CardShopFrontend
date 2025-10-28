/**
 * Card model - Backend usa camelCase
 */

export interface CardToSell {
  id?: string | null;
  price?: number;
  condition?: string;
  quantity?: number;
  language?: string;
}

export interface CardData {
  id?: string | null;
  oracleId?: string | null;
  idAsUUID?: string | null;
  cardName?: string;
  printedName?: string | null;
  imageUrl?: string;
  set?: string;
  setName?: string;
  setCode?: string;
  rarity?: string;
  collectorNumber?: string;
  language?: string;
  manaCost?: string;
  convertedManaCost?: number | null;
  typeLine?: string;
  cardColors?: string[];
  oracleText?: string;
  flavorText?: string;
  artistName?: string;
  rules?: string[];
  printedIn?: string;
  block?: string;
  available?: number;
  cardsToSell?: CardToSell[];
  price?: number | null;
  from?: number | null;
  priceTrend?: number | null;
  avg30?: number | null;
  avg7?: number | null;
  avg1?: number | null;
  quantity?: number;
  condition?: string;
  userId?: string | null;
  cardToSellId?: string | null;
  reactKey?: string | null;
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
  id: string | null;
  oracleId: string | null;
  idAsUUID: string | null;
  cardName: string;
  printedName: string | null;
  imageUrl: string;
  set: string;
  setName: string;
  setCode: string;
  rarity: string;
  collectorNumber: string;
  language: string;
  manaCost: string;
  convertedManaCost: number | null;
  typeLine: string;
  cardColors: string[];
  oracleText: string;
  flavorText: string;
  artistName: string;
  rules: string[];
  printedIn: string;
  block: string;
  available: number;
  cardsToSell: CardToSell[];
  price: number | null;
  from: number | null;
  priceTrend: number | null;
  avg30: number | null;
  avg7: number | null;
  avg1: number | null;
  quantity: number;
  condition: string;
  userId: string | null;
  cardToSellId: string | null;
  reactKey: string | null;

  constructor(data: CardData = {}) {
    this.id = data.id || null;
    this.oracleId = data.oracleId || null;
    this.idAsUUID = data.idAsUUID || null;
    this.cardName = data.cardName || '';
    this.printedName = data.printedName || null;
    this.imageUrl = data.imageUrl || '';
    this.set = data.set || '';
    this.setName = data.setName || '';
    this.setCode = data.setCode || '';
    this.rarity = data.rarity || '';
    this.collectorNumber = data.collectorNumber || '';
    this.language = data.language || '';
    this.manaCost = data.manaCost || '';
    this.convertedManaCost = data.convertedManaCost || null;
    this.typeLine = data.typeLine || '';
    this.cardColors = data.cardColors || [];
    this.oracleText = data.oracleText || '';
    this.flavorText = data.flavorText || '';
    this.artistName = data.artistName || '';
    this.rules = data.rules || [];
    this.printedIn = data.printedIn || '';
    this.block = data.block || '';
    this.available = data.available || 0;
    this.cardsToSell = data.cardsToSell || [];
    this.price = data.price || null;
    this.from = data.from || null;
    this.priceTrend = data.priceTrend || null;
    this.avg30 = data.avg30 || null;
    this.avg7 = data.avg7 || null;
    this.avg1 = data.avg1 || null;
    this.quantity = data.quantity || 1;
    this.condition = data.condition || '';
    this.userId = data.userId || null;
    this.cardToSellId = data.cardToSellId || null;
    this.reactKey = data.reactKey || null;
  }

  static fromApiResponse(data: CardData): Card {
    if (data.card) {
      const card = new Card(data.card);
      card.available = data.available || (data.cardsToSell ? data.cardsToSell.length : 0);
      card.cardsToSell = data.cardsToSell || [];
      return card;
    }
    return new Card(data);
  }

  static fromApiResponseArray(dataArray: CardData[]): Card[] {
    if (!Array.isArray(dataArray)) {
      console.warn('Card.fromApiResponseArray: Expected array, got:', typeof dataArray);
      return [];
    }
    return dataArray.map(data => Card.fromApiResponse(data));
  }

  toCartFormat() {
    return {
      id: this.cardToSellId || this.id,
      cardName: this.cardName,
      imageUrl: this.imageUrl,
      price: this.price,
      setName: this.setName || this.set,
      userId: this.userId,
      quantity: this.quantity,
      condition: this.condition,
      available: this.available
    };
  }

  toBulkSellFormat(cardData: BulkSellCardData) {
    return {
      cardId: this.id,
      oracleId: this.oracleId,
      setName: this.setName,
      setCode: this.setCode,
      cardName: this.cardName,
      imageUrl: this.imageUrl,
      price: cardData.price,
      condition: cardData.condition,
      quantity: cardData.quantity,
      language: cardData.language || 'en',
      comments: cardData.comments || ''
    };
  }

  getDisplayName(): string {
    return this.printedName || this.cardName || 'Unknown Card';
  }

  getImageUrl(): string {
    return this.imageUrl || '';
  }

  getSetName(): string {
    return this.setName || this.set || 'Unknown Set';
  }

  hasAvailability(): boolean {
    return this.available > 0 || (this.cardsToSell && this.cardsToSell.length > 0);
  }

  getLowestPrice(): number | null {
    if (this.cardsToSell && this.cardsToSell.length > 0) {
      const prices = this.cardsToSell
        .map(card => card.price)
        .filter((price): price is number => price != null && price > 0);
      return prices.length > 0 ? Math.min(...prices) : this.price;
    }
    return this.price || this.from;
  }

  clone(newData: Partial<CardData> = {}): Card {
    return new Card({ ...this, ...newData });
  }
}

export default Card;
