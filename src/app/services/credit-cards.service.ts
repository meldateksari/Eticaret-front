import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CreditCard} from '../models/credit-card.model';

@Injectable()
export class CreditCardService {
  private baseUrl = 'http://localhost:8080/api/credit-cards';

  constructor(private http: HttpClient) {}

  addCard(card: CreditCard): Observable<CreditCard> {
    return this.http.post<CreditCard>(this.baseUrl, card);
  }

  getCardsByUserId(userId: number): Observable<CreditCard[]> {
    return this.http.get<CreditCard[]>(`${this.baseUrl}/user/${userId}`);
  }

  deleteCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
