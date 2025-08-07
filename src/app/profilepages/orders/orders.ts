import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {OrderService} from '../../services/order.service';
import {Order} from '../../models/order.model';
import {ProfileSidebar} from '../profile-sidebar/profile-sidebar';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,ProfileSidebar],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
  providers: [OrderService]
})
export class Orders implements OnInit {

  constructor(private orderService: OrderService) {
  }

  orders: Order[] = [];

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.fetchOrders(Number(userId));
    } else {
      console.error('Kullanıcı ID\'si localStorage içinde bulunamadı.');
    }
  }

  fetchOrders(userId: number) {
    this.orderService.getOrdersByUser(userId).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Siparişler alınamadı:', err);
      }
    });
  }
}
