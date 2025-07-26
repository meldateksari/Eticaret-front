import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {OrderService} from '../../services/order.service';
import {Order} from '../../models/order.model';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);
  orders: Order[] = [];

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    console.log('userId:', userId); // Bunu mutlaka görmelisin

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
