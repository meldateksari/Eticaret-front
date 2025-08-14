import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminpagesSidebar } from '../adminpages-sidebar/adminpages-sidebar';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminpagesSidebar],
  providers: [ProductService],
  templateUrl: './product-manage.html',
  styleUrl: './product-manage.css'
})
export class ProductManage implements OnInit {
  // state
  loading = false;
  error: string | null = null;

  // signals (Angular 16+)
  products = signal<Product[]>([]);
  searchTerm = signal<string>('');

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getAll()
      .subscribe({
        next: (res) => {
          const sorted = [...res].sort((a, b) => {
            const at = a?.createdAt ? new Date(a.createdAt as any).getTime() : 0;
            const bt = b?.createdAt ? new Date(b.createdAt as any).getTime() : 0;

            // en son eklenen üste
            if (bt !== at) return bt - at;     // createdAt DESC
            return (b.id ?? 0) - (a.id ?? 0);  // fallback: id DESC
          });
          this.products.set(sorted);

          this.loading = false;
        },
        error: () => {
          this.error = 'Ürünler yüklenemedi.';
          this.loading = false;
        }
      });
  }


  // arama + filtrelenmiş liste
  filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.products();
    if (!term) return list;
    return list.filter(p =>
      (p.name ?? '').toLowerCase().includes(term) ||
      (p.brand ?? '').toLowerCase().includes(term) ||
      (p.category?.name ?? '').toLowerCase().includes(term) ||
      String(p.price ?? '').includes(term)
    );
  });

  // delete
  async onDelete(p: Product): Promise<void> {
    const ok = window.confirm(`"${p.name}" ürününü silmek istediğine emin misin?`);
    if (!ok) return;

    this.productService.deleteProduct(p.id!).subscribe({
      next: () => {
        // listeden çıkar
        this.products.set(this.products().filter(x => x.id !== p.id));
      },
      error: (err) => {
        console.error(err);
        window.alert('Silme işlemi başarısız oldu.');
      }
    });
  }

  // edit’e git
  gotoEdit(p: Product): void {
    // rotanı şuna göre ayarla: /edit-products/:id
    this.router.navigate(['/edit-products', p.id]);
  }

  // status butonunda göstermek için basit yardımcılar
  inStock(p: Product): boolean {
    return (p.stockQuantity ?? 0) > 0 && (p.isActive ?? true);
  }

  imageFor(p: Product): string | null {
    // imageUrl varsa onu, yoksa ilk product image
    if (p.imageUrl) return p.imageUrl;
    const first = (p as any)?.images?.[0]?.imageUrl;
    return first ?? null;
  }
  // Placeholder görseli tek yerde tutalım:
  private readonly PLACEHOLDER = 'https://dummyimage.com/400x400/f5f5f5/999999.png&text=No+Image';

  thumbSrc(p: any): string {
    const images = p?.images as Array<any> | undefined;
    if (images && images.length) {
      // Thumbnail işaretli olanı al
      const tn = images.find(i => i?.isThumbnail);
      const img = tn ?? images[0];
      if (img?.image) {
        return `data:image/jpeg;base64,${img.image}`;
      }
      if (img?.imageUrl && /^https?:\/\//i.test(img.imageUrl)) {
        return img.imageUrl;
      }
    }
    return this.PLACEHOLDER;
  }

  onImgError(ev: Event) {
    const el = ev.target as HTMLImageElement;
    el.src = this.PLACEHOLDER;
  }

}
