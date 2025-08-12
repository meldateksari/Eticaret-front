import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { OrderStatus } from '../models/order-status.enum';

@Injectable()
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getOrdersByUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`);
  }

  createOrder(orderRequest: any): Observable<any> {
    return this.http.post(this.baseUrl, orderRequest);
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`);
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${orderId}`);
  }


  updateOrder(orderId: number, status: OrderStatus): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/updateStatus/${orderId}/${status}`, {});
  }

  updatePaymentStatus(orderId: number, paymentStatus: string) {
    const normalized = (paymentStatus || '').toUpperCase(); // "PAID"
    return this.http.post<Order>(`${this.baseUrl}/updatePayment/${orderId}/${normalized}`, {});
  }


}
