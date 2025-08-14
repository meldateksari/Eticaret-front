import { Component, OnInit } from '@angular/core';
import {AsyncPipe, CurrencyPipe, DecimalPipe, NgClass, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AdminpagesSidebar } from '../adminpages-sidebar/adminpages-sidebar';

import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { CartItemService } from '../../services/cart-items.service';

import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';

import { Observable, of, combineLatest } from 'rxjs';
import { map, catchError, startWith, pairwise } from 'rxjs/operators';

import { ChartModule } from 'primeng/chart';

type DashboardVm = {
  totalSales: number;
  totalUsers: number;
  totalStockQuantity: number;
  stockAvailabilityPercent: number;
};

type CustomerInsightsVm = {
  count: number;          // Son 30 gün yeni müşteri
  label: string;          // "Last 30 Days"
  changePct: number;      // Önceki 30 güne göre %
  isPositive: boolean;
};

type StockLevelsVm = {
  currentPct: number;     // Anlık stok yüzdesi
  changePct: number;      // Bir önceki yayına göre fark (puan)
  isPositive: boolean;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AdminpagesSidebar,
    AsyncPipe, CurrencyPipe, NgIf, DecimalPipe,
    HttpClientModule,
    ChartModule, NgClass
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [UserService, OrderService, ProductService, CartItemService]
})
export class Dashboard implements OnInit {
  users$ = of<any[]>([]);
  orders$ = of<Order[]>([]);
  products$ = of<Product[]>([]);
  cartItems$ = of<CartItem[]>([]);
  vm$   = of<DashboardVm>({ totalSales: 0, totalUsers: 0, totalStockQuantity: 0, stockAvailabilityPercent: 0 });

  // BAR
  salesByProductData$!: Observable<any>;
  salesByProductOptions: any = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true } }
  };

  // PIE
  salesSplitData$!: Observable<any>;
  salesSplitOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } }
  };

  // NEW: Dinamik kart verileri
  customerInsights$!: Observable<CustomerInsightsVm>;
  stockLevels$!: Observable<StockLevelsVm>;

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private productService: ProductService,
    private cartItemService: CartItemService
  ) {}

  ngOnInit(): void {
    // Kaynaklar
    this.users$ = this.userService.getAllUsers().pipe(catchError(() => of([])));
    this.products$ = this.productService.getAll().pipe(catchError(() => of([] as Product[])));
    this.cartItems$ = this.cartItemService.getAllItems().pipe(catchError(() => of([] as CartItem[])));

    // ViewModel
    this.vm$ = combineLatest({
      users: this.users$,
      products: this.products$,
      cartItems: this.cartItems$
    }).pipe(
      map(({ users, products, cartItems }) => {
        const totalSales = cartItems.reduce((sum, item) => sum + (Number((item as any).price) || 0), 0);
        const totalUsers = users.length;
        const totalStockQuantity = products.reduce((s, p) => s + (p.stockQuantity ?? 0), 0);
        const stockAvailabilityPercent = Math.round(
          (products.filter(p => (p.stockQuantity ?? 0) > 0).length / (products.length || 1)) * 100
        );
        return { totalSales, totalUsers, totalStockQuantity, stockAvailabilityPercent };
      })
    );

    // ---- Sales by Product (Bar)
    this.salesByProductData$ = this.cartItems$.pipe(
      map(items => {
        const byProduct = new Map<string, number>();
        for (const i of items) {
          const name =
            (i as any).productName ||
            (i as any).product?.name ||
            `#${(i as any).productId ?? 'Unknown'}`;
          const amount = Number((i as any).price) || 0;
          byProduct.set(name, (byProduct.get(name) || 0) + amount);
        }
        return {
          labels: Array.from(byProduct.keys()),
          datasets: [{ label: 'Total Sales', data: Array.from(byProduct.values()) }]
        };
      })
    );

    // ---- Sales Split (Pie)
    this.salesSplitData$ = this.cartItems$.pipe(
      map(items => {
        const byProduct = new Map<string, number>();
        for (const i of items) {
          const name =
            (i as any).productName ||
            (i as any).product?.name ||
            `#${(i as any).productId ?? 'Unknown'}`;
          const amount = Number((i as any).price) || 0;
          byProduct.set(name, (byProduct.get(name) || 0) + amount);
        }
        const sorted = Array.from(byProduct.entries()).sort((a, b) => b[1] - a[1]);
        const top3 = sorted.slice(0, 3);
        const restTotal = sorted.slice(3).reduce((s, [, v]) => s + v, 0);
        if (restTotal > 0) top3.push(['Other', restTotal]);

        return {
          labels: top3.map(([k]) => k),
          datasets: [{
            data: top3.map(([, v]) => v),
            backgroundColor: ['#c8baba', '#edc6b8', '#afc4ec', '#c3e6d3'],
            hoverBackgroundColor: ['#143e4a', '#452816', '#35455e', '#0f3722']
          }]
        };
      })
    );

    // ---- Customer Insights (dinamik)
    this.customerInsights$ = this.users$.pipe(
      map(users => {
        const now = new Date();
        const d30 = new Date(now); d30.setDate(now.getDate() - 30);
        const d60 = new Date(now); d60.setDate(now.getDate() - 60);

        const hasDates = users.some((u: any) => !!u?.createdAt);
        if (!hasDates) {
          // tarih yoksa: toplam kullanıcıyı göster, değişimi 0 yap
          const total = users.length;
          return { count: total, label: 'All Users', changePct: 0, isPositive: true };
        }

        const created = (u: any) => u?.createdAt ? new Date(u.createdAt) : null;

        const last30 = users.filter(u => {
          const c = created(u); return !!c && c >= d30 && c <= now;
        }).length;

        const prev30 = users.filter(u => {
          const c = created(u); return !!c && c >= d60 && c < d30;
        }).length;

        const changePct = prev30 === 0
          ? (last30 > 0 ? 100 : 0)
          : Math.round(((last30 - prev30) / prev30) * 100);

        return { count: last30, label: 'Last 30 Days', changePct, isPositive: changePct >= 0 };
      })
    );

    // ---- Stock Levels (dinamik)
    // Önceki yayına göre farkı gösterir (gerçek zamanlı değişim).
    this.stockLevels$ = this.vm$.pipe(
      map(vm => vm.stockAvailabilityPercent),
      startWith(0),
      pairwise(),
      map(([prev, curr]) => {
        const diff = curr - prev; // yüzde puan farkı
        return { currentPct: curr, changePct: Math.round(diff), isPositive: diff >= 0 };
      })
    );
  }
}
