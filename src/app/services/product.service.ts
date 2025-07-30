import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Product} from '../models/product.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {
  }

  getAll(genderIds?: number[], categoryId?: number | null, active?: boolean): Observable<Product[]> {
    let params = new HttpParams();
    if (genderIds && genderIds.length > 0) {
      params = params.append('genderCategoryIds', genderIds.join(','));
    }
    if (categoryId !== undefined && categoryId !== null) {
      params = params.append('categoryId', categoryId.toString());
    }
    if (active) {
      params = params.append('active', active.toString());
    }
    return this.http.get<Product[]>(this.baseUrl, {params});
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getActive(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/active`);
  }

  getByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/category/${categoryId}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


}
