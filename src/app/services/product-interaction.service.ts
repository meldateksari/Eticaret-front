import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable()
export class ProductInteractionService {
  private interactionUrl = 'http://localhost:8080/api/interactions';

  constructor(private http: HttpClient) {}

  getProductInteraction(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.interactionUrl}/product/${productId}`);
  }
}
