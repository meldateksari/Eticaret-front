import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Product} from '../models/product.model';
import {map, Observable} from 'rxjs';

@Injectable()
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {
  }
  supportsSearch = true; // <-- backend arama destekliyorsa true

  getAll(
    genderIds?: number[],
    categoryId?: number | null,
    active?: boolean,
    search?: string // <-- buraya ekledik
  ): Observable<Product[]> {
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
    if (search) { // <-- search paramı ekleme
      params = params.append('search', search);
    }

    return this.http.get<Product[]>(this.baseUrl, { params });
  }


  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createProduct(payload: any): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, payload);
  }
  updateProduct(id: number, payload: Partial<Product> | any): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, payload);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getLatestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/latest`);
  }

}
