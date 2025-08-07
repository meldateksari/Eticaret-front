import {Component, OnInit, AfterViewInit, NgZone, ViewChild, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';

import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';

import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import Swiper from 'swiper';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {CartService} from '../../services/cart.service';
import {WishlistService} from '../../services/wishlist.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink,Toast ],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  providers: [CategoryService, ProductService,CartService,WishlistService ]
})
export class HomePage implements OnInit, AfterViewInit {
  categories: Category[] = [];
  latestProducts: Product[] = [];
  allProducts: Product[] = [];

  quantities: { [productId: number]: number } = {};
  @ViewChild('swiperRef', { static: false }) swiperRef!: ElementRef;
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private messageService: MessageService,
    private ngZone: NgZone,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe(data => {
      this.allProducts = data;
      this.latestProducts = [...data].slice(-5).reverse();
    });

    this.loadCategories();
  }


  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const checkAndInitSwiper = () => {
        const swiperEl = this.swiperRef?.nativeElement;

        if (swiperEl && swiperEl.querySelector('.swiper-wrapper')?.children.length > 0) {
          new Swiper(swiperEl, {
            modules: [Autoplay, Navigation, Pagination],
            loop:true,
            autoplay: {
              delay: 3000,
              disableOnInteraction: false
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },
            slidesPerView: 1.2,
            spaceBetween: 24,
            breakpoints: {
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 }
            }
          });
        } else {
          // DOM henüz hazır değilse yeniden dene
          setTimeout(checkAndInitSwiper, 100);
        }
      };

      checkAndInitSwiper();
    });
  }



  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Kategoriler yüklenirken hata:', err)
    });
  }

  addToCart(product: Product) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.messageService.add({
        key: 'right',
        severity: 'warn',
        summary: 'Giriş Gerekli',
        detail: 'Sepete eklemek için lütfen giriş yapın.'
      });
      return;
    }

    const productId = product.id;
    const quantity = this.quantities[productId] || 1;

    this.cartService.addProductToCart(+userId, productId, quantity).subscribe({
      next: () => {
        this.messageService.add({
          key: 'right',
          severity: 'success',
          summary: 'Sepete Eklendi',
          detail: `${product.name} (${quantity} adet) sepete eklendi.`
        });
      },
      error: (err) => {
        console.error('Sepete ekleme hatası:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Sepete eklenirken bir hata oluştu.'
        });
      }
    });
  }

  // İstek listesine ekleme fonksiyonu
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

}
