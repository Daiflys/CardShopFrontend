// src/admin/api/types.ts
// Shared TypeScript types for admin API

// User types
export interface UserDTO {
  id: number;
  username: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRoleRequest {
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalActiveUsers: number;
  totalCards: number;
  totalSales: number;
}

// Audit Log types
export interface AuditLogDTO {
  id: number;
  username: string;
  action: string;
  entityType: string | null;
  entityId: number | null;
  details: string | null;
  ipAddress: string | null;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Bulk Price Change types
export interface SetPriceBulkParams {
  language: string;
  set: string;
  rarity: string;
  condition: string;
  price: number;
}

export interface IncrementPriceBulkParams {
  language: string;
  set: string;
  rarity: string;
  condition: string;
  increment: number;
  quantityLessThan?: number;
}

export interface AdjustPricePercentageBulkParams {
  language: string;
  set: string;
  rarity: string;
  condition: string;
  percentage: number;
}

export interface CardToSellDTO {
  cardToSellId: number;
  oracleId: string;
  setName: string;
  set: string | null;
  cardName: string;
  imageUrl: string;
  cardPrice: number;
  condition: string;
  quantity: number;
  language: string;
  comments: string | null;
  // For DataGrid compatibility
  id?: number;
}

// Error response type
export interface ErrorResponse {
  message?: string;
  error?: string;
  status?: number;
}
