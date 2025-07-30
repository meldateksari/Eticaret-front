import { Component, OnInit } from '@angular/core'; // <-- OnInit eklendi
import { CartService } from '../../services/cart.service';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './new-order.html',
  styleUrls: ['./new-order.css']
})
export class NewOrder implements OnInit {
  order: any;

  constructor(
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));

    if (!userId) {
      console.error('Kullanıcı ID localStorage\'da bulunamadı.');
      return;
    }

    this.orderService.createOrder({ userId }).subscribe({
      next: (res) => {
        console.log('Sipariş oluşturuldu:', res);
        this.order = res;
      },
      error: (err) => {
        console.error('Sipariş oluşturulamadı:', err);
      }
    });
  }
}
