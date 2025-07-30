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

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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
    private cartService: CartService
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

    console.log('✅ Seçilen adres:', this.selectedAddress);
    console.log('🚚 Kargo tipi:', this.shippingMethod);

    this.addressService.createAddress(this.userId, this.selectedAddress).subscribe({
      next: (response) => {
        console.log('✅ Sipariş başarıyla işlendi:', response);
      },
      error: (err) => {
        console.error('❌ Sipariş sırasında hata oluştu:', err);
      }
    });
  }
}
