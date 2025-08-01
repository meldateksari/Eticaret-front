import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Product} from '../models/product.model';
import {Observable} from 'rxjs';

@Injectable()
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

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }






}
