import {ProductImage} from '../pages/product-image/product-image';


export interface Product {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category: { id: number }; // sadece ID yollanacaksa
  brand?: string;
  imageUrl?: string;
  weight?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  images?: ProductImage[];
  // aşağıdakiler backend’den geliyorsa eklenebilir
  // reviews?: any[];
  // cartItems?: any[];
  // orderItems?: any[];
  // interactions?: any[];
  // productFeature?: any;
}
