import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Token'ı localStorage ya da sessionStorage'dan al

    const token = localStorage.getItem('token'); // veya sessionStorage.getItem('token');

    if (token) {
      // Yeni bir request klonu oluştur ve Authorization header ekle
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // HTTP isteğini devam ettir
    return next.handle(request);
  }
}
