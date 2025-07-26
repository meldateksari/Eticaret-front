import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../service/auth.service';
import { LoginRequestDto } from '../../dto/login-request.dto';
import { AuthResponseDto } from '../../dto/auth-response.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
  ]
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router); // Router inject edilmeli

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });


  onSubmit(): void {
    if (this.form.valid) {
      const credentials: LoginRequestDto = this.form.value;

      this.authService.login(credentials).subscribe({
        next: (res: AuthResponseDto) => {
          localStorage.setItem('token', res.token);
          this.authService.isLoggedInSubject.next(true);
          this.authService.userSubject.next(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.messageService.add({
            severity: 'success',
            summary: 'Giriş Başarılı',
            detail: 'Hoş geldiniz!',
          });

          this.router.navigate(['']);
        },
        error: (err) => {
          const errorMsg = err.status === 401
            ? { summary: 'Hatalı Giriş', detail: 'Email veya şifre yanlış' }
            : { summary: 'Sunucu Hatası', detail: 'Bir hata oluştu.' };

          this.messageService.add({
            severity: 'error',
            ...errorMsg,
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Eksik Bilgi',
        detail: 'Lütfen tüm alanları doldurun.',
      });
    }
  }
}
