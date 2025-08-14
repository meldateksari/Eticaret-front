import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule} from '@angular/forms';
import { forkJoin, firstValueFrom } from 'rxjs';
import {Toast, ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductImageService } from '../../services/product-image.service';

// basit tipler
type Category = { id: number; name?: string };
type ImgItem = { file?: File; previewUrl: string; isUrl?: boolean, base64?: string };

@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Toast, FormsModule],
  providers: [FormBuilder, ProductService, CategoryService, ProductImageService, MessageService],
  templateUrl: './add-products.html',
  styleUrls: ['./add-products.css']
})
export class AddProducts implements OnInit {

  categories: Category[] = [];
  genderCategories: Category[] = [];

  images: ImgItem[] = [];
  thumbnailIndex: number | null = null;

  submitting = false;
  isDragging = false;
  imageUrlText = '';

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private productImageService: ProductImageService,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: [''],
      description: [''],
      price: [null as number | null, [Validators.required, Validators.min(0)]],
      stockQuantity: [null as number | null, [Validators.required, Validators.min(0)]],
      brand: [''],
      categoryId: [null as number | null, Validators.required],
      genderCategoryIds: [[] as number[]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    // name -> slug
    this.form.get('name')!.valueChanges.subscribe((val) => {
      const slug = (val ?? '')
        .toString().trim().toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      this.form.patchValue({ slug }, { emitEvent: false });
    });
  }

  private loadCategories(): void {
    forkJoin({
      all: this.categoryService.getAllCategories(),
      gender: this.categoryService.getGenderCategories()
    }).subscribe({
      next: ({ all, gender }) => {
        this.categories = all ?? [];
        this.genderCategories = gender ?? [];
      },
      error: (err) => {
        console.error('Category load error', err);
        this.genderCategories = this.categories;
      }
    });
  }

  // ---------- Görsel dosya işlemleri ----------
  onFilesSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    for (const f of files) {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        this.images.push({ file: f, previewUrl: reader.result as string, base64 });
        if (this.thumbnailIndex === null) this.thumbnailIndex = 0;
      };
      reader.readAsDataURL(f);

      // console.log("byte" , base64)
    }
    input.value = '';
  }

  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) {
    e.preventDefault(); this.isDragging = false;
    const dt = e.dataTransfer;
    if (!dt?.files?.length) return;
    const files = Array.from(dt.files).filter(f => f.type.startsWith('image/'));
    for (const f of files) {
      const reader = new FileReader();
      reader.onload = () => {
        this.images.push({ file: f, previewUrl: reader.result as string });
        if (this.thumbnailIndex === null) this.thumbnailIndex = 0;
      };
      reader.readAsDataURL(f);
    }
  }

  // ---------- URL ile görsel ----------
  private isValidImageUrl(u: string): boolean {
    const url = (u || '').trim();
    return /^https?:\/\/.+/i.test(url) || /^data:image\/[a-zA-Z]+;base64,/.test(url);
  }
  addImageByUrl(): void {
    const url = (this.imageUrlText || '').trim();
    if (!this.isValidImageUrl(url)) {
      this.messageService.add({ severity: 'warn', summary: 'Uyarı', detail: 'Geçerli bir görsel URL’si girin.' });
      return;
    }
    this.images.push({ previewUrl: url, isUrl: true });
    if (this.thumbnailIndex === null) this.thumbnailIndex = 0;
    this.imageUrlText = '';
  }

  setThumbnail(i: number): void { this.thumbnailIndex = i; }
  removeImage(i: number): void {
    this.images.splice(i, 1);
    if (this.thumbnailIndex === i) this.thumbnailIndex = this.images.length ? 0 : null;
    else if (this.thumbnailIndex !== null && i < this.thumbnailIndex) this.thumbnailIndex--;
  }

  // ---------- Payload ----------
  private buildProductPayload() {
    const v = this.form.value;
    return {
      name: v.name!,
      slug: v.slug || '',
      description: v.description || '',
      price: Number(v.price),
      stockQuantity: Number(v.stockQuantity),
      brand: v.brand || null,
      imageUrl: null, // ana image bu ekranda set edilmiyor
      weight: null,
      isActive: !!v.isActive,
      createdAt: null,
      updatedAt: null,
      category: { id: Number(v.categoryId) },
      genderCategories: (v.genderCategoryIds ?? []).map((id: number) => ({ id })),
      images: []
    };
  }

  // ---------- Submit ----------
  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Eksik Alan', detail: 'Zorunlu alanları doldurun.' });
      return;
    }

    this.submitting = true;

    try {
      // 1) Ürünü oluştur
      const payload = this.buildProductPayload();
      console.log('Creating product with payload:', payload);

      const created = await firstValueFrom(this.productService.createProduct(payload as any));
      const productId = created?.id;
      console.log('Product created:', created);

      if (!productId) { throw new Error('Sunucudan productId alınamadı'); }

      // 2) Görselleri ekle
      if (this.images.length) {
        const calls = this.images.map((img, idx) =>
          this.productImageService.add({
            imageUrl: img.previewUrl,                 // URL ya da dataURL
            isThumbnail: this.thumbnailIndex === idx,
            sortOrder: idx,
            product: { id: productId },
            image: this.base64ToByteArray(img.base64)
          })
        );
        console.log('Posting images...', calls.length);
        await firstValueFrom(forkJoin(calls));
        console.log('Images posted');
      }

      this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Ürün eklendi.' });

      // 3) Yönlendir
      this.router.navigate(['/product-manage']);

    } catch (err: any) {
      console.error('Create/Add error', err);
      const detail = err?.error?.message || err?.message || 'Ürün veya görseller eklenemedi.';
      this.messageService.add({ severity: 'error', summary: 'Hata', detail });
    } finally {
      this.submitting = false;
    }
  }

  base64ToByteArray(base64: string): number[] {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}
