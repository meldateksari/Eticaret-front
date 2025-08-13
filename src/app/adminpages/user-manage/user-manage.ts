// user-manage.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminpagesSidebar } from '../adminpages-sidebar/adminpages-sidebar';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

type RoleCode = 'ROLE_USER' | 'ROLE_ADMIN';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminpagesSidebar],
  templateUrl: './user-manage.html',
  styleUrls: ['./user-manage.css'],
  providers: [UserService] // <-- İstediğin gibi providers içinde
})
export class UserManage implements OnInit {

  constructor(private userService: UserService,private router: Router,private toastr: ToastrService) {
  }

  users: User[] = [];
  loading = false;
  error?: string;

  // arama & basit UI state
  search = '';
  roleDraft: Record<number, 'ROLE_USER' | 'ROLE_ADMIN'> = {};
  savingUserIds = new Set<number>(); // herhangi bir işlemde spinner/disable için

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = undefined;

    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res ?? [];
        // her user için varsayılan rol seçimini ayarla (ilk rol yoksa ROLE_USER gösterelim)
        this.users.forEach(u => {
          const defaultRole: 'ROLE_USER' | 'ROLE_ADMIN' =
            // backend’de roles kapalıysa fallback:
            (u as any).roles?.[0] ?? 'ROLE_USER';
          if (u.id != null) this.roleDraft[u.id] = defaultRole;
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Kullanıcılar alınırken bir hata oluştu.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get filteredUsers(): User[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.users;
    return this.users.filter(u =>
      (u.firstName + ' ' + u.lastName).toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q) ||
      (u.phoneNumber ?? '').toLowerCase().includes(q)
    );
  }

  toggleActive(user: User): void {
    if (user.id == null) return;
    this.savingUserIds.add(user.id);

    const updated: User = { ...user, isActive: !user.isActive };
    this.userService.updateUser(user.id, updated).subscribe({
      next: (res) => {
        // local state’i güncelle
        const idx = this.users.findIndex(u => u.id === user.id);
        if (idx > -1) this.users[idx] = res;
        this.savingUserIds.delete(user.id!);
      },
      error: (err) => {
        console.error(err);
        this.savingUserIds.delete(user.id!);
        alert('Durum güncellenemedi.');
      }
    });
  }


  assignRole(user: User): void {
    const id = user.id;
    if (id == null) return;

    const role = this.roleDraft[id] as RoleCode | undefined;
    if (!role) {
      console.warn('assignRole: role seçilmemiş', { id });
      return;
    }

    this.savingUserIds.add(id);
    this.userService.assignRoleToUser(id, role).subscribe({
      next: (res) => {
        const idx = this.users.findIndex(u => u.id === id);
        if (idx > -1) this.users[idx] = res;
        this.savingUserIds.delete(id);

        // Başarılı toast
        this.toastr.success(`Rol başarıyla ${role} olarak atandı`, 'Başarılı');
      },
      error: (err) => {
        console.error(err);
        this.savingUserIds.delete(id);

        // Hatalı toast
        this.toastr.error('Rol atanamadı.', 'Hata');
      }
    });
  }



  delete(user: User): void {
    if (user.id == null) return;
    if (!confirm(`"${user.firstName} ${user.lastName}" kullanıcısını silmek istiyor musun?`)) return;

    this.savingUserIds.add(user.id);
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.savingUserIds.delete(user.id!);
      },
      error: (err) => {
        console.error(err);
        this.savingUserIds.delete(user.id!);
        alert('Silme işlemi başarısız.');
      }
    });
  }

  trackById(_: number, u: User): number | undefined {
    return u.id;
  }
  goToAddUsers() {
    this.router.navigate(['/add-users']);
  }
}
