import {OrderStatus} from './order-status.enum';

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  userId: number;
  shippingAddressId: number;
  billingAddressId: number;
  orderItems: {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }[];
}
