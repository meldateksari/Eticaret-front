import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WishlistDto, CreateWishlistItemRequest } from '../models/wishlist.model';


@Injectable()
export class WishlistService {

  private apiUrl = `http://localhost:8080/api/wishlists`;

  constructor(private http: HttpClient) { }

  /**
   * Belirli bir kullanıcının istek listesini getirir.
   */
  getWishlistByUserId(userId: number): Observable<WishlistDto> {
    return this.http.get<WishlistDto>(`${this.apiUrl}/${userId}`);
  }

  /**
   * İstek listesine yeni bir ürün ekler.

   */
  addProductToWishlist(request: CreateWishlistItemRequest): Observable<WishlistDto> {
    return this.http.post<WishlistDto>(`${this.apiUrl}/add`, request);
  }

  /**
   * İstek listesinden bir ürünü kaldırır.
   */
  removeProductFromWishlist(request: CreateWishlistItemRequest): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove`, { body: request });
  }
}
