export interface OrderItem {
  id: number;
  quantity: number;
  priceAtPurchase: number; // BigDecimal backend'den number olarak gelir
  product: {
    id: number;
    name: string;
  };
}
