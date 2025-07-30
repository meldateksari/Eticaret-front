// src/app/services/address.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Address } from '../models/address.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://localhost:8080/api/addresses'; // URL'yi backend adresine göre ayarla

  constructor(private http: HttpClient) {}

  createAddress(userId: number, address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.apiUrl}/${userId}`, address);
  }
  getAddressesByUserId(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/user/${userId}`);
  }
  updateAddress(id: number, address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/${id}`, address);
  }

}
