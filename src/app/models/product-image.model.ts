export interface ProductImage {
  id?: number;
  imageUrl: string;
  isThumbnail?: boolean;
  sortOrder?: number;
  product: { id: number };
}
