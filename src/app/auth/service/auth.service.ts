import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {User} from '../../models/user.model';
import {LoginRequestDto} from '../dto/login-request.dto';
import {AuthResponseDto} from '../dto/auth-response.dto';


export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';

  isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  userSubject = new BehaviorSubject<User>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();


  constructor(private http: HttpClient) {}


  register(data: RegisterRequest): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.API_URL}/register`, data);
  }
  login(data: LoginRequest): Observable<AuthResponseDto> {

    return this.http.post<AuthResponseDto>(`${this.API_URL}/login`, data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getUserFromStorage(): User {
    const user = localStorage.getItem('user');
    if (user != null) return JSON.parse(user);
    return null;
  }
  getUser(): User | null {
    const raw = localStorage.getItem('user');
    try {
      const user = JSON.parse(raw || '{}');

      if (user && typeof user.id === 'number' && typeof user.email === 'string') {
        return user as User;
      }

      return null;
    } catch (e) {
      return null;
    }
  }





}

