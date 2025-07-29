import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  addToCart(product: Product): void {
    console.log('Sepete eklendi:', product);
    // Burada normalde ürünü bir BehaviorSubject'e veya API'ye gönderme mantığı olur.
  }
}
