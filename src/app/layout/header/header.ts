import {Component, computed, OnInit, Signal, signal} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { Observable } from 'rxjs';
import {AsyncPipe, CurrencyPipe} from '@angular/common';
import { User } from '../../models/user.model';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  imports: [RouterLink, AsyncPipe, CurrencyPipe],
  providers: [ProductService],
})
export class Header implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  user!: Observable<User>;


  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  searchTerm = signal<string>('');
  productsSig = signal<Product[]>([]);
  showResults = signal<boolean>(false);       // dropdown görünürlüğü
  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.user = this.authService.user$;

    this.productService.getAll().subscribe(products => {
      this.productsSig.set(products);
    });
  }

  onSearchInput(value: string) {
    this.searchTerm.set(value);
    this.showResults.set(true);
  }
  openResults() { this.showResults.set(true); }

  // Blur, item'a tıklamadan dropdown'ı kapatmasın diye küçük gecikme:
  onBlur() { setTimeout(() => this.showResults.set(false), 120); }
  closeResults() { this.showResults.set(false); }

  filteredProducts = computed<Product[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.productsSig();
    if (!term) return [];
    return list.filter(p =>
      (p.name ?? '').toLowerCase().includes(term) ||
      (p.brand ?? '').toLowerCase().includes(term) ||
      (p.category?.name ?? '').toLowerCase().includes(term) ||
      String(p.price ?? '').includes(term)
    );
  });

  trackById = (_: number, p: Product) => p.id;

  goToProduct(id: string | number) { this.router.navigate(['/product', id]); }
  goToProfile() { this.router.navigate(['/profile']); }
  logout(event: MouseEvent) {
    event.stopPropagation();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  goToWishlist() { this.router.navigate(['/wishlist']); }
  goToCart() { this.router.navigate(['/cart']); }
}
