import { OrderItem } from './order-item.model';

export interface Order {
  id: number;
  orderDate: string; // ISO tarih formatında gelecek: "2024-01-15T14:32:00"
  totalAmount: number;
  status: string;        // örn: SHIPPED, DELIVERED, CANCELLED
  paymentStatus?: string; // opsiyonel: PAID, UNPAID, REFUNDED
  trackingNumber?: string;
  items: OrderItem[];
}
