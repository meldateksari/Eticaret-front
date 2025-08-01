import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { WishlistDto, WishlistItemDto } from '../../models/wishlist.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-page.html',
  styleUrls: ['./wishlist-page.css'],
  providers: [WishlistService, ProductService]
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
    private route: ActivatedRoute
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

  addProductToWishlist(productId: number): void {
    if (!this.userId) {
      this.error = 'Kullanıcı ID geçersiz.';
      return;
    }

    const request = {
      userId: this.userId,
      productId: productId
    };

    this.wishlistService.addProductToWishlist(request).subscribe({
      next: (updatedWishlist) => {
        this.wishlist = updatedWishlist;
        this.loadProduct(productId);
      },
      error: (err) => {
        console.error('Ürün eklenirken hata oluştu:', err);
      }
    });
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

  // Add to cart functionality
  addToCart(productId: number): void {
    // Cart service'i kullanarak sepete ekleme işlemi
    // this.cartService.addToCart(productId);
    console.log('Ürün sepete eklendi:', productId);

    // Örnek: Toast notification göstermek için
    // this.toastr.success('Ürün sepete eklendi!');
  }
}
