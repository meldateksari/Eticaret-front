// src/app/models/product.model.ts
import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  brand?: string | null;
  imageUrl: string | null;
  weight?: number | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  size?: string;


  category: Category;
  genderCategories: Category[];
  images: string[];
}
