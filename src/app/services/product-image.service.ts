import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductImage } from '../models/product-image.model';
import { Observable } from 'rxjs';

@Injectable()
export class ProductImageService {
  private baseUrl = 'http://localhost:8080/api/product-images';

  constructor(private http: HttpClient) {}

  getByProductId(productId: number): Observable<ProductImage[]> {
    return this.http.get<ProductImage[]>(`${this.baseUrl}/product/${productId}`);
  }

  add(image: ProductImage): Observable<ProductImage> {
    return this.http.post<ProductImage>(this.baseUrl, image);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  deleteByProductId(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/product/${productId}`);
  }
}
