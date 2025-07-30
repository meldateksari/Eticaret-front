import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) { }

  getGenderCategories(): Observable<Category[]> {
    // Bu endpoint'in backend'de cinsiyet kategorilerini döndürdüğünü varsayıyoruz.
    // Örneğin: "Kadın" ve "Erkek"
    return this.http.get<Category[]>(`${this.baseUrl}?type=gender`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }
}
