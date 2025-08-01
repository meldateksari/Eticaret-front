export interface WishlistDto {
  id: number;
  userId: number;
  createdAt: string; // ISO 8601 formatında gelir
  items: WishlistItemDto[];
}

export interface WishlistItemDto {
  id: number;
  productId: number;
  addedAt: string; // ISO 8601 formatında gelir
}

export interface CreateWishlistItemRequest {
  userId: number;
  productId: number;
}
