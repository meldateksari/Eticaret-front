// src/app/models/product.model.ts
import { Category } from './category.model'; // Category modelinizi import edin

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  brand?: string | null;
  imageUrl?: string | null;
  weight?: number | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;

  category: Category; // Ürünün ana kategorisi
  genderCategories: Category[]; // Cinsiyet kategorileri listesi
  images: string[]; // Ürün resim URL'lerinin listesi
}
