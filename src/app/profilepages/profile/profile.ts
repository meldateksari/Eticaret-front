import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormGroup, Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/service/auth.service';
import { User } from '../../models/user.model';

import {HttpClient} from '@angular/common/http';
import {FileUpload, FileUploadModule} from 'primeng/fileupload';
import {Observable} from 'rxjs';
import {ProfileSidebar} from '../profile-sidebar/profile-sidebar';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule, FileUploadModule,FileUpload,ProfileSidebar],
  providers: [UserService]
})
export class Profile implements OnInit {
  private serverBaseUrl = 'http://localhost:8080';
  userO!:Observable <User>;

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private formBuilder: NonNullableFormBuilder,
              private http: HttpClient
  ) {
  }
  imageUrl: string | null = null;

  user = signal<User | null>(null);
  profileForm = signal<FormGroup | null>(null);
  passwordForm = signal<FormGroup | null>(null);

  isProfileFormValid = computed(() => this.profileForm()?.valid ?? false);
  isPasswordFormValid = computed(() => this.passwordForm()?.valid ?? false);

  // === GETTERLAR ===
  get profileFormValue(): FormGroup | null {
    return this.profileForm();
  }

  get passwordFormValue(): FormGroup | null {
    return this.passwordForm();
  }

  get isProfileFormValidValue(): boolean {
    return this.isProfileFormValid();
  }

  get isPasswordFormValidValue(): boolean {
    return this.isPasswordFormValid();
  }

  ngOnInit(): void {
    const storedUser = this.authService.getUser();
    this.userO = this.authService.user$;
    if (storedUser?.id) {
      this.user.set(storedUser);

      this.imageUrl = storedUser.profileImageUrl ?? null;

      this.initializeForms();
    } else {
      this.router.navigate(['/login']);
    }
  }


  private initializeForms(): void {
    const currentUser = this.user();
    if (!currentUser) return;

    const profileFormGroup = this.formBuilder.group({
      firstName: [currentUser.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [currentUser.lastName || '', [Validators.required, Validators.minLength(2)]],
      email: [currentUser.email || '', [Validators.required, Validators.email]],
      phoneNumber: [currentUser.phoneNumber || '', [Validators.pattern(/^[0-9]{10,11}$/)]],
    });

    const passwordFormGroup = this.formBuilder.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    this.profileForm.set(profileFormGroup);
    this.passwordForm.set(passwordFormGroup);
  }

  private passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  updateAccount(): void {
    const form = this.profileForm();
    const currentUser = this.user();

    if (form?.valid && currentUser) {
      const updatedUserInfo = {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        phoneNumber: form.value.phoneNumber,
      };

      this.userService.updateUserInfo(currentUser.id, updatedUserInfo as User).subscribe({
        next: (updatedUserFromServer) => {
          alert('Hesabınız güncellendi.');
          // Sunucudan gelen kullanıcı bilgisi en güncel halidir.
          // Mevcut local user bilgisini sunucudan gelenle birleştirelim ki eksik alan kalmasın.
          const finalUser = { ...currentUser, ...updatedUserFromServer };
          localStorage.setItem('user', JSON.stringify(finalUser));
          this.authService.userSubject.next(finalUser);
          this.user.set(finalUser);
        },
        error: () => {
          alert('Güncelleme başarısız.');
        },
      });
    } else {
      alert('Lütfen tüm gerekli alanları doğru şekilde doldurun.');
    }
  }

  changePassword(): void {
    const form = this.passwordForm(); // formu senin tanımladığına göre çağırıyorsun
    const currentUser = this.user(); // giriş yapmış kullanıcı bilgisi

    if (form?.valid && currentUser) {
      const payload = {
        currentPassword: form.value.currentPassword!,
        newPassword: form.value.newPassword!,
      };

      this.userService.updatePassword(currentUser.id, payload).subscribe({
        next: () => {
          alert('Şifreniz başarıyla güncellendi.');
          form.reset();
        },
        error: (err) => {
          const msg = err?.error?.message || 'Şifre güncelleme başarısız.';
          alert(msg);
        },
      });
    } else {
      if (form?.hasError('mismatch')) {
        alert('Yeni şifreler eşleşmiyor.');
      } else {
        alert('Lütfen tüm gerekli alanları doğru şekilde doldurun.');
      }
    }
  }

  deleteAccount(): void {
    if (!confirm('Hesabınızı silmek istediğinize emin misiniz?')) return;

    const currentUser = this.user();
    if (!currentUser) return;

    this.userService.deleteUser(currentUser.id).subscribe({
      next: () => {
        alert('Hesap silindi.');
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: () => alert('Hesap silinemedi.'),
    });
  }

  uploadProfileImage(event: any): void {
    const file: File = event.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string; // anlık önizleme
    };
    reader.readAsDataURL(file);

    this.userService.uploadProfileImage(file).subscribe({
      next: (res) => {
        this.imageUrl = res.imageUrl; // base64 veri

        const currentUser = this.user();
        if (currentUser) {
          const updatedUser = { ...currentUser, profileImageUrl: res.imageUrl }; // base64 burada
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.user.set(updatedUser);
        }

        alert("Profil fotoğrafı yüklendi.");
      },

    });
  }



}
