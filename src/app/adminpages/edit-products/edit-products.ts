import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {ReactiveFormsModule, FormBuilder, Validators, FormsModule, FormGroup} from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

// mevcut modellerin varsa onları kullan; yoksa basit tipler:
export interface Category { id: number; name?: string; }
export interface ProductImage { imageUrl: string; }
export interface ProductResponseDto {
  id?: number;
  name: string;
  slug?: string | null;
  description?: string | null;
  price: number | null;
  stockQuantity: number | null;
  brand?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
  weight?: number | null;
  category?: { id: number } | null;
  genderCategories?: { id: number }[];
  images?: ProductImage[];
}

@Component({
  selector: 'app-edit-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  providers: [FormBuilder, ProductService, CategoryService],
  templateUrl: './edit-products.html',
  styleUrls: ['./edit-products.css']
})
export class EditProducts implements OnInit {
  form!: FormGroup;

  id!: number;


  loading = false;
  saving = false;
  error: string | null = null;

  categories: Category[] = [];
  genderCategories: Category[] = [];

  // görsel durumları
  images: ProductImage[] = [];           // sadece gösterim
  mainImageUrl: string | null = null;    // ekranda görünen (mevcut veya yeni)
  private originalMainImageUrl: string | null = null;
  mainImageChanged = false;
  private selectedFile: File | null = null;

  // URL alanı için
  imageUrlInput = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {this.form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: [''],
    description: [''],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    stockQuantity: [null as number | null, [Validators.required, Validators.min(0)]],
    brand: [''],
    categoryId: [null as number | null, Validators.required],
    genderCategoryIds: [[] as number[]],
    isActive: [true]
  });}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();

    // name -> slug (ingilizce harf/numara ve tire)
    this.form.get('name')!.valueChanges.subscribe((val) => {
      const slug = (val ?? '')
        .toString().trim().toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      this.form.patchValue({ slug }, { emitEvent: false });
    });
  }

  private loadData(): void {
    this.loading = true; this.error = null;

    forkJoin({
      product: this.productService.getProductById(this.id),
      allCats: this.categoryService.getAllCategories(),
      genderCats: this.categoryService.getGenderCategories()
    }).subscribe({
      next: ({ product, allCats, genderCats }) => {
        this.categories = allCats ?? [];
        this.genderCategories = genderCats ?? [];

        // ana görsel & input senkronu
        this.mainImageUrl = product?.imageUrl ?? null;
        this.originalMainImageUrl = this.mainImageUrl;
        this.imageUrlInput = this.mainImageUrl ?? '';

        // formu doldur
        this.form.patchValue({
          name: product?.name ?? '',
          slug: product?.slug ?? '',
          description: product?.description ?? '',
          price: product?.price ?? null,
          stockQuantity: product?.stockQuantity ?? null,
          brand: product?.brand ?? '',
          categoryId: product?.category?.id ?? null,
          genderCategoryIds: (product?.genderCategories ?? []).map((c: any) => c.id),
          isActive: product?.isActive ?? true
        });

        // ek görseller
        const imgs = (product?.images ?? []) as ProductImage[];
        this.images = imgs.filter(i => !!i.imageUrl);

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Ürün bilgileri yüklenemedi.';
        this.loading = false;
      }
    });
  }

  // ----- Görsel işlemleri -----

  onMainImageFileSelected(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Önizleme
    const reader = new FileReader();
    reader.onload = () => {
      this.mainImageUrl = reader.result as string;  // sadece preview
      this.imageUrlInput = this.mainImageUrl || '';
      this.mainImageChanged = true;
    };
    reader.readAsDataURL(file);

    // dosyayı sakla (FormData için)
    this.selectedFile = file;
    input.value = '';
  }

  applyImageUrlFromInput(): void {
    const url = (this.imageUrlInput || '').trim();
    if (!url) return;
    this.mainImageUrl = url;
    this.selectedFile = null; // URL kullanılacağı için dosyayı sıfırla
    this.mainImageChanged = (this.mainImageUrl !== this.originalMainImageUrl);
  }

  removeMainImage(): void {
    this.mainImageUrl = null;
    this.imageUrlInput = '';
    this.selectedFile = null;
    this.mainImageChanged = true;
  }

  // HER ZAMAN FormData döndür (backend @RequestPart("product") bekliyor)
  private buildPayload(): FormData {
    const v = this.form.value;

    const productDto: ProductResponseDto = {
      id: this.id,
      name: v.name!,
      slug: v.slug || '',
      description: v.description || '',
      price: v.price !== null ? Number(v.price) : null,
      stockQuantity: v.stockQuantity !== null ? Number(v.stockQuantity) : null,
      brand: v.brand || null,
      isActive: !!v.isActive,
      weight: null,
      category: v.categoryId ? { id: Number(v.categoryId) } : null,
      genderCategories: (v.genderCategoryIds ?? []).map((id: number) => ({ id })),
      // Görsel davranışı:
      // - Dosya seçildiyse backend isterse bu URL’yi yok sayabilir (problem değil)
      // - Dosya yoksa ve URL varsa onu gönder
      // - Kullanıcı kaldırdıysa null kalsın; removeImage ile sinyal vereceğiz
      imageUrl: this.selectedFile ? null : (this.mainImageUrl ?? null),
      images: this.images
    };

    const fd = new FormData();
    // JSON parçası: adı tam olarak "product" olmalı
    fd.append('product', new Blob([JSON.stringify(productDto)], { type: 'application/json' }));

    // dosya varsa ekle
    if (this.selectedFile) {
      fd.append('image', this.selectedFile);
    }

    // görseli kaldırma sinyali
    if (this.mainImageChanged && this.mainImageUrl === null) {
      fd.append('removeImage', 'true');
    }

    return fd;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true; this.error = null;

    const formData = this.buildPayload();

    this.productService.updateProduct(this.id, formData).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/product-manage']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Güncelleme başarısız oldu.';
        this.saving = false;
      }
    });
  }
}
