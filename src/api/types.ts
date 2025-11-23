// src/api/types.ts

// Auth types
export interface LoginResponse {
  success: boolean;
  token?: string;
}

export interface RegisterResponse {
  success: boolean;
}

export interface OAuthUserData {
  email?: string;
  name?: string;
  picture?: string;
}

// Card types
export interface Card {
  id: string;
  oracleId?: string;
  cardName: string;
  printedName?: string;
  imageUrl?: string;
  set: string;
  setCode?: string;
  setName?: string;
  rarity: string;
  language?: string;
  typeLine?: string;
  manaCost?: string;
  convertedManaCost?: number;
  cardColors?: string[];
  oracleText?: string;
  flavorText?: string;
  artistName?: string;
  collectorNumber?: string;
  minPrice?: number;
  maxPrice?: number;
  legalities?: Record<string, string>;
}

// Cart types
export interface CartItem {
  id: string | number;
  cardName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  condition: string;
  setName?: string;
  available?: number;
}

// Card to sell types
export interface CardToSell {
  cardToSellId?: number;
  id?: string | number;
  cardId?: string;
  oracleId: string;
  setName: string;
  setCode?: string;
  cardName: string;
  imageUrl: string;
  price?: number;
  condition: string;
  quantity: number;
  language: string;
  comments?: string | null;
}

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
}

// Search types
export interface SearchFilters {
  query?: string;
  set?: string;
  rarity?: string;
  color?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
  condition?: string;
  sortBy?: string;
  page?: number;
  size?: number;
  legalityFormat?: string;
  legalityStatus?: string;
}

// Pagination types
export interface PageResponse<T> {
  content: T[];
  pageable?: {
    pageNumber: number;
    pageSize: number;
    offset: number;
  };
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  error?: string;
}

// Banner types
export interface Banner {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  icon?: string;
  imageUrl: string;
  price: number;
  set: string;
}

// Bulk sell types
export interface BulkSellCardData {
  cardId: string;
  oracleId: string;
  setName: string;
  setCode: string;
  cardName: string;
  imageUrl: string;
  price: number;
  condition: string;
  quantity: number;
  language: string;
  comments?: string;
}

export interface BulkSellResponse {
  success: boolean;
  message: string;
}

// CSV import types
export interface CSVCardInput {
  setName: string;
  cardName: string;
  collectorNumber?: string;
  language?: string;
}

export interface CSVSearchRequest {
  cards: CSVCardInput[];
}

export interface CSVSearchResponse {
  results: Card[];
}

// Trends types
export interface TrendingCard {
  id: string | number;
  cardName: string;
  imageUrl: string;
}

// Advanced search criteria
export interface AdvancedSearchCriteria {
  name?: string;
  set?: string;
  rarity?: string;
  colors?: string[];
  languages?: string[];
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  legalityFormat?: string;
  legalityStatus?: string;
  [key: string]: any;
}

// Address types
export interface Address {
  id: number;
  userId: number;
  recipientName: string;
  street: string;
  additionalInfo: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  phone: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressCreateRequest {
  recipientName: string;
  street: string;
  additionalInfo?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  phone?: string | null;
}

export interface AddressUpdateRequest {
  recipientName: string;
  street: string;
  additionalInfo?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  phone?: string | null;
}

// Purchase types
export type PurchaseStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface PurchaseResponse {
  id: number;
  buyerId: number;
  sellerId: number;
  cardId: number;
  price: number;
  purchaseDate: string;
  transactionId?: string;
  quantity: number;
  status: PurchaseStatus;
  paymentProvider?: string;
  cardName?: string;
  setName?: string;
  condition?: string;
}
