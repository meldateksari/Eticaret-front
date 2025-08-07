import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { WishlistDto, WishlistItemDto } from '../../models/wishlist.model';
import { Product } from '../../models/product.model';
import {CartService} from '../../services/cart.service';

import { MessageService } from 'primeng/api';
import {Toast} from 'primeng/toast';



@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, Toast],
  templateUrl: './wishlist-page.html',
  styleUrls: ['./wishlist-page.css'],
  providers: [WishlistService, ProductService,CartService,MessageService,Toast]
})
export class Wishlist implements OnInit {

  wishlist: WishlistDto | undefined;
  loading = true;
  error: string | null = null;
  userId: number = 0;

  productCache: Map<number, Product> = new Map();
  loadingProducts: Set<number> = new Set();

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,

    private messageService: MessageService,
  ) {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = Number(storedUserId);
    } else {
      this.error = 'Kullanıcı ID bulunamadı.';
    }
  }

  ngOnInit(): void {
    if (this.userId) {
      this.getWishlist();
    }
  }

  getWishlist(): void {
    this.loading = true;
    this.wishlistService.getWishlistByUserId(this.userId).subscribe({
      next: (data) => {
        this.wishlist = data;
        this.loading = false;
        // Wishlist yüklendikten sonra ürün bilgilerini yükle
        this.loadProductsForWishlist();
      },
      error: (err) => {
        this.error = 'İstek listesi yüklenirken bir hata oluştu.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Wishlist'teki tüm ürünlerin bilgilerini yükle
  loadProductsForWishlist(): void {
    if (!this.wishlist?.items) return;

    this.wishlist.items.forEach(item => {
      if (!this.productCache.has(item.productId) && !this.loadingProducts.has(item.productId)) {
        this.loadProduct(item.productId);
      }
    });
  }

  // Tekil ürün bilgisi yükle
  loadProduct(productId: number): void {
    this.loadingProducts.add(productId);

    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.productCache.set(productId, product);
        this.loadingProducts.delete(productId);
      },
      error: (err) => {
        console.error(`Ürün yüklenirken hata oluştu (ID: ${productId}):`, err);
        this.loadingProducts.delete(productId);
      }
    });
  }

  getProductById(productId: number): Product | null {
    if (!this.productCache.has(productId) && !this.loadingProducts.has(productId)) {
      this.loadProduct(productId);
    }
    return this.productCache.get(productId) || null;
  }

  // TrackBy function for better performance
  trackByProductId(index: number, item: WishlistItemDto): number {
    return item.productId;
  }



  removeProductToWishlist(productId: number): void {
    if (!this.wishlist) {
      return;
    }

    const request = { userId: this.userId, productId: productId };
    this.wishlistService.removeProductFromWishlist(request).subscribe({
      next: () => {
        this.wishlist!.items = this.wishlist!.items.filter(item => item.productId !== productId);
        // Cache'den de kaldır (isteğe bağlı)
        this.productCache.delete(productId);
      },
      error: (err) => {
        console.error('Ürün kaldırılırken hata oluştu:', err);
      }
    });
  }

  addToCart(productId: number, quantity: number = 1): void {
    const userId = Number(localStorage.getItem('userId'));

    if (!userId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Giriş Gerekli',
        detail: 'Lütfen giriş yapın.'
      });
      return;
    }

    if (!quantity || quantity < 1) {
      quantity = 1;
    }

    this.cartService.addProductToCart(userId, productId, quantity).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sepete Eklendi',
          detail: `${quantity} adet ürün sepete eklendi.`
        });
      },
      error: (err) => {
        console.error('Sepete ekleme hatası:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Ürün sepete eklenirken bir hata oluştu.'
        });
      }
    });
  }

}
