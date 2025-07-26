import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Order} from '../models/order.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = '/api/orders';

  constructor(private http: HttpClient) {}


}
