import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth.service';
import {CommonModule} from '@angular/common';
import {Button} from 'primeng/button';
import {MessageService} from 'primeng/api';
import {RouterLink} from '@angular/router';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';


@Component({

  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  imports: [CommonModule,
    ReactiveFormsModule, Button, RouterLink, FloatLabel, InputText
  ],
  providers: [AuthService],
})
export class Register implements OnInit {
  registerForm!: FormGroup;

  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [''],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid){
      this.messageService.add({severity: 'warn', summary: 'Bir hata oluştu', detail: 'Lütfen alanları eksiksiz doldurun'});
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.successMessage = 'Kayıt başarılı!';
        this.errorMessage = '';
        this.registerForm.reset();
      },
      error: (err) => {
        this.errorMessage = 'Kayıt sırasında bir hata oluştu.';
        this.successMessage = '';
      }
    });
  }
}
