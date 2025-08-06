export interface Review {
  id?: number;
  productId: number;
  userId: number;
  username?: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
}
