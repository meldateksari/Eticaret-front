import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecommendedProducts } from '../recommended-products/recommended-products';
import {Product as ProductModel, Product} from '../../models/product.model';
import { ProductInteractionService } from '../../services/product-interaction.service';
import {Reviews} from '../reviews/reviews';
import {User} from '../../models/user.model';
import {ReviewService} from '../../services/review.service';
import { WishlistService } from '../../services/wishlist.service';
import { MessageService } from 'primeng/api';
import {Toast} from 'primeng/toast';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RecommendedProducts, Reviews, Toast,],
  templateUrl: './product-detail.html',
  providers: [ProductInteractionService,ProductInteractionService,WishlistService, MessageService,CartService]
})
export class ProductDetail implements OnInit {
  currentUser: number;
  product: any;
  reviews: any[] = [];
  quantities: { [productId: number]: number } = {};




  constructor(
    private route: ActivatedRoute,
    private productInteractionService: ProductInteractionService,
    private reviewService: ReviewService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private messageService: MessageService
  ) {}


  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentUser = Number(localStorage.getItem("userId"));

    this.productInteractionService.getProductInteraction(productId)
      .subscribe((p: Product) => {
        this.product = p;

        // Ürün geldikten sonra yorumları al
        this.reviewService.getReviewsByProduct(this.product.id).subscribe(data => {
          this.reviews = data;
        });
      });
  }

  addProductToWishlist(product: Product, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Giriş Gerekli',
        detail: 'İstek listesine eklemek için giriş yapın.'
      });
      return;
    }

    const request = {
      userId: userId,
      productId: product.id
    };

    this.wishlistService.addProductToWishlist(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'İstek Listesi',
          detail: `${product.name} istek listesine eklendi.`
        });
      },
      error: (err) => {
        console.error('İstek listesine eklenirken hata:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Ürün istek listesine eklenemedi.'
        });
      }
    });
  }

  addToCart() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Giriş Gerekli',
        detail: 'Lütfen giriş yapın.'
      });
      return;
    }

    const productId = this.product.id;
    const quantity = this.product.quantity || 1;

    this.cartService.addProductToCart(+userId, productId, quantity).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sepete Eklendi',
          detail: `${this.product.name} (${quantity} adet) sepete eklendi`
        });
      },
      error: (err) => {
        console.error('Sepete ekleme hatası:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Ürün sepete eklenirken bir hata oluştu'
        });
      }
    });
  }



}
