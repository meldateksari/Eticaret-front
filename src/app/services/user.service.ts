import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import {UpdatePasswordRequest} from '../models/update-password-request.model';
import {Product} from '../models/product.model';

@Injectable()
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // user.service.ts
  assignRoleToUser(userId: number, role: 'ROLE_USER' | 'ROLE_ADMIN'): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${userId}/roles/${role}`, {});
  }

  updateUserInfo(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  updatePassword(userId: number, dto: UpdatePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userId}/password`, dto);
  }

  getRecommended(userId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${userId}/recommended-products`);
  }

  uploadProfileImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ imageUrl: string }>(
      `${this.apiUrl}/upload-profile-image`,
      formData
    );
  }




}
