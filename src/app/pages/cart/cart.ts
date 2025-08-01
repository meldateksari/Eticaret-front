import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';
import { Cart } from '../../models/cart.model'; // ✅ artık çakışmaz
import { Observable } from 'rxjs';
import {CartItemService} from '../../services/cart-items.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  providers: [CartService, CartItemService]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private cartItemService: CartItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Giriş yapmalısınız.');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.getCartByUserId(+userId).subscribe({
      next: (cart: Cart) => {
        console.log('📦 Cart verisi:', cart);
        this.cartItems = cart.items;
        this.calculateTotal();
      },
      error: () => {
        alert('Sepet yüklenemedi.');
      }
    });
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      const price = item?.price || 0;
      const quantity = item?.quantity || 1;
      return total + price * quantity;
    }, 0);
  }


  increase(item: CartItem) {
    item.quantity++;
    this.calculateTotal();
  }

  decrease(item: CartItem) {
    item.quantity--;

    if (item.quantity === 0) {
      this.cartItemService.removeItem(item.id).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter(ci => ci.id !== item.id);
          this.calculateTotal();
        },
        error: () => {
          alert('Ürün silinirken bir hata oluştu.');
          item.quantity = 1; // Hata olursa geri al
        }
      });
    } else {
      this.calculateTotal();
    }
  }


}
