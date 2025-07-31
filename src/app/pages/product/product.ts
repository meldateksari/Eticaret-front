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

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product implements OnInit {
  products: ProductModel[] = [];
  genderCategories: Category[] = [];
  allCategories: Category[] = [];

  quantities: { [productId: number]: number } = {};


  selectedGenderIds: number[] = [];
  selectedCategoryId: number | null = null;
  activeOnly: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['categoryId'];
      if (categoryId) {
        this.selectedCategoryId = +categoryId;
      }

      this.loadGenderCategories();
      this.loadCategories();
      this.loadProducts();
    });
  }

  loadProducts(): void {
    console.log('API\'den ürünler isteniyor. Filtreler:', {
      genderIds: this.selectedGenderIds,
      categoryId: this.selectedCategoryId,
      activeOnly: this.activeOnly
    });

    const genderIds = this.selectedGenderIds.length > 0 ? this.selectedGenderIds : undefined;

    this.productService.getAll(
      genderIds,
      this.selectedCategoryId ?? undefined,
      this.activeOnly ? true : undefined
    ).subscribe({
      next: (data) => {
        this.products = data;
        console.log('Filtrelenmiş ürünler yüklendi:', this.products);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Ürünler yüklenirken hata oluştu:', err);
      }
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
      alert('Lütfen giriş yapın.');
      return;
    }

    const productId = product.id;
    const quantity = this.quantities[productId] || 1;

    this.cartService.addProductToCart(+userId, productId, quantity).subscribe({
      next: () => {
        this.router.navigate(['/cart']);
      },
      error: (err) => {
        console.error('Sepete ekleme hatası:', err);
      }
    });
  }
}
