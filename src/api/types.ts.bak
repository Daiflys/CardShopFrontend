// src/api/types.ts
// Shared TypeScript types for API calls

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
  oracle_id?: string;
  name: string;
  card_name?: string;
  image_url?: string;
  imageUrl?: string;
  image?: string;
  set: string;
  setCode?: string;
  set_code?: string;
  set_name?: string;
  setName?: string;
  rarity: string;
  language?: string;
  lang?: string;
  typeLine?: string;
  manaCost?: string;
  cardColors?: string[];
  oracleText?: string;
  flavorText?: string;
  artistName?: string;
  number?: string;
  collector_number?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Cart types
export interface CartItem {
  id: string | number;
  card_name: string;
  name?: string;
  image_url?: string;
  imageUrl?: string;
  price: number;
  cardPrice?: number;
  quantity: number;
  condition: string;
  set?: string;
  setName?: string;
  sellerId?: number;
  userId?: number;
  available?: number;
}

// Card to sell types
export interface CardToSell {
  cardToSellId?: number;
  id?: string | number;
  card_id?: string;
  oracle_id: string;
  oracleId?: string;
  set_name: string;
  setName?: string;
  set_code?: string;
  set?: string;
  card_name: string;
  name?: string;
  image_url: string;
  imageUrl?: string;
  cardPrice?: number;
  price?: number;
  condition: string;
  quantity: number;
  language: string;
  userId?: number;
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
  image_url: string;
  price: number;
  set: string;
}

// Bulk sell types
export interface BulkSellCardData {
  card_id: string;
  oracle_id: string;
  set_name: string;
  set_code: string;
  card_name: string;
  image_url: string;
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
  card_name: string;
  name?: string;
  image_url: string;
  imageUrl?: string;
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
  // Additional fields that might come from backend
  cardName?: string;
  setName?: string;
  condition?: string;
}
