export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  trackingNumber: string;
  items: {
    productName: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
}
