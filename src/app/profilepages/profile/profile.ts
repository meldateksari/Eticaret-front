import { Component, OnInit } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/service/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  providers: [AuthService],
})
export class Profile implements OnInit {
  user!: User;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUser = this.authService.getUser();
    if (storedUser?.id) {
      this.user = storedUser;
    } else {
      this.router.navigate(['/login']);
    }
  }

  updateAccount(): void {
    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: (updatedUser) => {
        alert('Hesabınız güncellendi.');
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.user = updatedUser;
      },
      error: () => {
        alert('Güncelleme başarısız.');
      }
    });
  }

  deleteAccount(): void {
    if (!confirm('Hesabınızı silmek istediğinize emin misiniz?')) return;

    this.userService.deleteUser(this.user.id).subscribe({

      next: () => {
        alert('Hesap silindi.');
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: () => alert('Hesap silinemedi.')
    });
  }
}
