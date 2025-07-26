/*import { BigDecimal } from './big-decimal.type'; // Eğer BigDecimal için özel bir tür tanımladıysan
import { Category } from './category.model';
import { ProductImage } from './product-image.model';
import { Review } from './review.model';
import { CartItem } from './cart-item.model';
import { OrderItem } from './order-item.model';
import { UserProductInteraction } from './user-product-interaction.model';
import { ProductFeature } from './product-feature.model';*/

export interface Product {
  id?: number;
  name: string;
  slug: string;
  description?: string;
 // price: BigDecimal | number;
  stockQuantity: number;
 // category: Category;
  brand?: string;
  imageUrl?: string;
 // weight?: BigDecimal | number;
  isActive: boolean;
  createdAt?: string; // ISO tarih formatı
  updatedAt?: string;
/*
  // ilişkili veriler
  images?: ProductImage[];
  reviews?: Review[];
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
  interactions?: UserProductInteraction[];
  productFeature?: ProductFeature;*/
}
