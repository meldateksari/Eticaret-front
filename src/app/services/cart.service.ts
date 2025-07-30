import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {CartComponent} from '../pages/cart/cart';
import {Cart} from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = 'http://localhost:8080/api/carts'; // Spring backend URL

  constructor(private http: HttpClient, private router: Router) {}

  addProductToCart(userId: number, productId: number, quantity: number = 1) {
    const params = {
      userId: userId.toString(),
      productId: productId.toString(),
      quantity: quantity.toString(),
    };

    return this.http.post(`${this.baseUrl}/add-product`, {}, { params });
  }
  getCartByUserId(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/user/${userId}`);
  }


  getCartItems(cartId: number): Observable<{ product: Product, quantity: number }[]> {
    return this.http.get<{ product: Product, quantity: number }[]>(`/api/cart/cart/${cartId}`);
  }


}
