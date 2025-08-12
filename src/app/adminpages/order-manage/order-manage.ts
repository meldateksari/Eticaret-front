import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminpagesSidebar } from '../adminpages-sidebar/adminpages-sidebar';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { Order } from '../../models/order.model';
import { OrderStatus } from '../../models/order-status.enum';

import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-order-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminpagesSidebar],
  providers: [OrderService, UserService],
  templateUrl: './order-manage.html',
  styleUrls: ['./order-manage.css']
})
export class OrderManage {
  // UI state
  searchTerm = '';
  loading = false;
  error: string | null = null;

  // data
  orders: Order[] = [];
  private userNameById = new Map<number, string>();

  // status döngü sırası
  statusOrder: OrderStatus[] = [
    OrderStatus.Created,
    OrderStatus.Processing,
    OrderStatus.Shipped,
    OrderStatus.Delivered,
    OrderStatus.Cancelled
  ];

  // butonda görünen etiketler
  statusLabels: Record<OrderStatus, string> = {
    [OrderStatus.Created]: 'Oluşturuldu',
    [OrderStatus.Processing]: 'İşleniyor',
    [OrderStatus.Shipped]: 'Kargolandı',
    [OrderStatus.Delivered]: 'Teslim Edildi',
    [OrderStatus.Cancelled]: 'İptal Edildi'
  };

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadAll(); // tüm kullanıcıları + onların siparişlerini getir
  }

  // TÜM kullanıcıları çek → isimleri map et → her kullanıcı için siparişleri çek → flatten
  private loadAll() {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers().pipe(
      map((users: any[] = []) => {
        users.forEach(u => {
          const fullName = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
          this.userNameById.set(u.id, fullName || `User #${u.id}`);
        });
        return users.map(u => u.id) as number[];
      }),
      switchMap((userIds: number[]) => {
        if (userIds.length === 0) return of<Order[][]>([]);
        // her kullanıcı için istekleri paralel at
        return forkJoin(
          userIds.map(id =>
            this.orderService.getOrdersByUser(id).pipe(
              catchError(err => {
                console.error(`user ${id} orders error`, err);
                return of<Order[]>([]); // bir kullanıcı hata verirse diğerlerini düşürme
              })
            )
          )
        );
      }),
      map((lists: Order[][]) => lists.flat())
    ).subscribe({
      next: (all) => { this.orders = all ?? []; this.loading = false; },
      error: (err) => {
        console.error(err);
        this.error = 'Siparişler yüklenirken bir sorun oluştu.';
        this.loading = false;
      }
    });
  }

  // arama (id, müşteri adı, ürün adı)
  get filteredOrders(): Order[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.orders;

    return this.orders.filter(o => {
      const idStr = (`#${o?.id ?? ''}`).toLowerCase();
      const customerName = (this.userNameById.get(o?.userId) || '').toLowerCase();
      const productNames = Array.isArray(o?.orderItems)
        ? o.orderItems.map(it => (it?.productName ?? '').toLowerCase()).join(' ')
        : '';
      return idStr.includes(q) || customerName.includes(q) || productNames.includes(q);
    });
  }

  trackById = (_: number, item: Order) => item.id;

  // statüyü sıradaki değere geçir ve backend’e yaz
  cycleStatus(order: Order) {
    const idx = this.statusOrder.indexOf(order.status as unknown as OrderStatus);
    const next = this.statusOrder[(idx + 1) % this.statusOrder.length];

    const prev = order.status as unknown as OrderStatus;
    (order as any).status = next; // optimistic UI

    // backend: POST /api/orders/updateStatus/{orderId}/{status}
    this.orderService.updateOrder(order.id, next as any).subscribe({
      error: (err) => {
        (order as any).status = prev; // revert
        console.error(err);
        alert('Durum güncellenemedi.');
      }
    });
  }

  // siparişi sil
  deleteOrder(order: Order) {
    const ok = confirm(`#${order.id} numaralı siparişi silmek istiyor musun?`);
    if (!ok) return;

    this.orderService.deleteOrder(order.id).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== order.id);
      },
      error: (err) => {
        console.error(err);
        alert('Silme işlemi başarısız.');
      }
    });
  }

  // para gösterimi
  formatCurrency(v: number | string | undefined): string {
    const num = typeof v === 'string' ? Number(v) : (v ?? 0);
    return `$${(isNaN(num) ? 0 : num).toFixed(2)}`;
  }

  // isim gösterimi
  getUserName(userId: number): string {
    return this.userNameById.get(userId) || `User #${userId}`;
  }

  getStatusLabel(order: Order): string {
    return this.statusLabels[order.status as keyof typeof this.statusLabels] || String(order.status);
  }
}
