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
  styleUrls: ['./new-order.css'],
  providers: [OrderService]
})
export class NewOrder implements OnInit {
  order: any;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const orderId = Number(id);

    if (!isNaN(orderId)) {
      this.orderService.getOrderById(orderId).subscribe({
        next: (data) => {
          this.order = {
            ...data,
            orderItems: (data.orderItems ?? []).map(item => ({
              productName: item.productName,
              quantity: item.quantity,
              price: item.price
            }))
          };
        },
        error: (err) => {
          console.error('Sipariş alınamadı:', err);
        }
      });
    } else {
      console.warn('Geçersiz sipariş ID:', id);
    }
  }



}
