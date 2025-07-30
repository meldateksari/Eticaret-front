import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CartItem } from '../../models/cart-item.model';
import { Address } from '../../models/address.model';
import { AddressService } from '../../services/address.service';
import { CartItemService } from '../../services/cart-items.service';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';
import {Router, RouterModule} from '@angular/router';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,RouterModule ],
  templateUrl: './checkout.html'

})
export class Checkout implements OnInit {
  userId!: number;
  cartId!: number;
  cartItems: CartItem[] = [];
  address: Address[] = [];
  selectedAddress!: Address;
  shippingMethod: 'standard' | 'express' = 'standard';
  isCartLoaded: boolean = false;

  constructor(
    private addressService: AddressService,
    private cartItemService: CartItemService,
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));

    if (!this.userId || isNaN(this.userId)) {
      console.error('❌ Kullanıcı ID bulunamadı.');
      return;
    }

    // 1. Adresleri getir
    this.addressService.getAddressesByUserId(this.userId).subscribe({
      next: (addresses) => {
        this.address = addresses;
        const defaultAddr = addresses.find(a => a.isDefault);
        this.selectedAddress = defaultAddr || addresses[0];
      },
      error: (err) => {
        console.error('❌ Adresler alınamadı:', err);
      }
    });

    // 2. Kullanıcıya ait Cart'ı getir
    this.cartService.getCartByUserId(this.userId).subscribe({
      next: (cart: Cart) => {
        this.cartId = cart.id;
        this.loadCartItems(this.cartId);
      },
      error: (err) => {
        console.error('❌ Kullanıcının sepeti bulunamadı:', err);
      }
    });
  }

  // 3. cartId ile ürünleri getir
  loadCartItems(cartId: number): void {
    this.cartItemService.getItemsByCart(cartId).subscribe({
      next: (items: CartItem[]) => {
        console.log('🛒 Cart items:', items);
        this.cartItems = items;
        this.isCartLoaded = true;
      },
      error: (err) => {
        console.error('❌ Sepet ürünleri alınamadı:', err);
        this.isCartLoaded = true;
      }
    });
  }

  // Toplam tutarı hesapla
  get totalAmount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }

  // Siparişi ver
  placeOrder() {
    if (!this.userId || !this.selectedAddress) {
      console.error('❌ Kullanıcı ID veya adres eksik.');
      return;
    }

    // 🔁 CartItem'leri OrderItem formatına dönüştür
    const orderItems = this.cartItems.map(item => ({
      productId: item.productId,        // veya item.product.id
      productName: item.productName,    // veya item.product.name
      quantity: item.quantity,
      price: item.price
    }));

    // 🧾 Sipariş nesnesini hazırla
    const orderRequest = {
      userId: this.userId,
      shippingAddressId: this.selectedAddress.id,
      billingAddressId: this.selectedAddress.id, // varsa
      totalAmount: this.totalAmount,
      orderItems: orderItems
    };

    // 📡 Siparişi gönder
    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        const orderId = response.id;

        // Sipariş ID'yi localStorage'a kaydet (veya query param ile taşıyabilirsin)
        localStorage.setItem('orderId', orderId.toString());

        this.router.navigate(['/payments']); // Ödeme sayfasına git
      },
      error: (err) => {
        console.error('❌ Sipariş oluşturulamadı:', err);
      }
    });

  }


}
