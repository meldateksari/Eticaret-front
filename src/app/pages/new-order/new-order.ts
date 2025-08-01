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
    const orderId = this.route.snapshot.paramMap.get('id');
    console.log(orderId);

  }
}
