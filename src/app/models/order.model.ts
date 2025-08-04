export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
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
