import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CartItem} from '../models/cart-item.model';


@Injectable({
  providedIn: 'root'
})
export class CartItemService {
  private baseUrl = 'http://localhost:8080/api/cart-items'; // Spring backend URL
  constructor(private http: HttpClient) {}


  removeItem(itemId: number): Observable<CartItem> {
    return this.http.delete<CartItem>(`${this.baseUrl}/${itemId}`);
  }
  getItemsByCart(cartId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.baseUrl}/cart/${cartId}`);
  }

}
