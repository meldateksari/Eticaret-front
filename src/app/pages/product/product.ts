import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Product as ProductModel} from '../../models/product.model';
import {ProductService} from "../../services/product.service";
import {CommonModule} from "@angular/common";
import {CategoryService} from '../../services/category.service';
import {Category} from '../../models/category.model';
import {HttpErrorResponse} from '@angular/common/http';
import {CartService} from "../../services/cart.service";
import {FormsModule} from '@angular/forms';
import {Wishlist} from '../wishlist-page/wishlist-page';
import {WishlistService} from '../../services/wishlist.service';
import { ToastrModule } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import {Toast} from 'primeng/toast';
import {CartComponent} from '../cart/cart';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';



@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Toast,
    RouterLink,
    CartComponent
  ],
  templateUrl: './product.html',
  styleUrl: './product.css',
  providers: [ProductService, CategoryService, WishlistService, CartService,MessageService ]
})
export class Product implements OnInit {
  products: ProductModel[] = [];
  genderCategories: Category[] = [];
  allCategories: Category[] = [];

  quantities: { [productId: number]: number } = {};


  selectedGenderIds: number[] = [];
  selectedCategoryId: number | null = null;
  activeOnly: boolean = false;
  searchTerm = '';
  private search$ = new Subject<string>();
  filteredCount: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['categoryId'];
      if (categoryId) this.selectedCategoryId = +categoryId;

      // aramayı 300ms debounce ile dinle
      this.search$
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => this.loadProducts());

      this.loadGenderCategories();
      this.loadCategories();
      this.loadProducts();
    });
  }

  onSearch(term: string) {
    this.searchTerm = term ?? '';
    this.loadProducts(); // istersen sadece applySearch() de diyebilirsin, ama diğer filtrelerle tutarlı olsun
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadProducts();
  }

  loadProducts(): void {
    const genderIds = this.selectedGenderIds.length > 0 ? this.selectedGenderIds : undefined;

    this.productService.getAll(
      genderIds,
      this.selectedCategoryId ?? undefined,
      this.activeOnly ? true : undefined
    ).subscribe({
      next: (data) => {
        let list = data.map(p => ({
          ...p,
          imageUrl: p.imageUrl
            ?? p.images?.find((i: any) => i.isThumbnail)?.imageUrl
            ?? p.images?.[0]?.imageUrl
            ?? null
        }));

        // 🔎 FRONTEND ARAMA FİLTRESİ (case-insensitive)
        const q = this.searchTerm.trim().toLowerCase();
        if (q) {
          list = list.filter(p =>
            [
              p.name,
              (p as any).brand,
              p.category?.name
            ]
              .filter(Boolean)
              .some(v => String(v).toLowerCase().includes(q))
          );
        }

        this.products = list;
      },
      error: (err) => console.error('Ürünler yüklenirken hata oluştu:', err)
    });
  }


  loadGenderCategories(): void {
    this.categoryService.getGenderCategories().subscribe({
      next: (data) => {
        this.genderCategories = data;
        console.log('Cinsiyet Kategorileri yüklendi:', this.genderCategories);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Cinsiyet kategorileri yüklenirken hata oluştu:', err);
      }
    });
  }

  loadCategories(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        const categories = products.map(p => p.category);
        this.allCategories = categories.filter(
          (category, index, self) =>
            category &&
            index === self.findIndex(c => c.id === category.id)
        );
        console.log('Tekil kategoriler yüklendi:', this.allCategories);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Kategoriler yüklenirken hata oluştu:', err);
      }
    });
  }

  onGenderFilterChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const categoryId = Number(checkbox.value);
    console.log(`Cinsiyet filtre değişikliği: Kategori ID=${categoryId}, Seçili mi=${checkbox.checked}`);

    if (checkbox.checked) {
      this.selectedGenderIds.push(categoryId);
    } else {
      this.selectedGenderIds = this.selectedGenderIds.filter(id => id !== categoryId);
    }

    console.log('Güncel cinsiyet filtreleri:', this.selectedGenderIds);
    this.loadProducts();
  }

  onCategoryFilterChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId = selectedValue ? +selectedValue : null;
    console.log('Kategori filtresi değişti:', this.selectedCategoryId);
    this.loadProducts();
  }

  onActiveFilterChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.activeOnly = checkbox.checked;
    console.log('Aktif ürün filtresi:', this.activeOnly);
    this.loadProducts();
  }

  addToCart(product: ProductModel) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Giriş Gerekli',
        detail: 'Lütfen giriş yapın.'
      });
      return;
    }

    const productId = product.id;
    const quantity = this.quantities[productId] || 1;

    this.cartService.addProductToCart(+userId, productId, quantity).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sepete Eklendi',
          detail: `${product.name} (${quantity} adet) sepete eklendi`
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

  addProductToWishlist(product: ProductModel): void {
    const userId = Number(localStorage.getItem('userId'));

    if (!userId) {
      console.error('Kullanıcı ID bulunamadı.');
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
          detail: `${product.name} başarıyla eklendi`
        });
      },
      error: (err) => {
        console.error('İstek listesine eklenirken hata:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Ürün istek listesine eklenemedi'
        });
      }
    });
  }

}
