import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-payment-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class Payments implements OnInit {
  isLoading = false;
  showSuccess = false;
  orderId!: number;

  ngOnInit(): void {
    const id = localStorage.getItem('orderId');
    if (id) {
      this.orderId = Number(id);
    } else {
      console.error('❌ Sipariş ID bulunamadı!');
    }
  }

  constructor(private router: Router) {}
  paymentForm = new FormGroup({
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{16}$/)
    ]),
    expiryDate: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
    ]),
    cvv: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{3}$/)
    ])
  });


  submitPayment() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.showSuccess = true;
      this.paymentForm.reset();

      setTimeout(() => {
        this.router.navigate(['/new-order', this.orderId]);
      }, 1000);
    }, 2000);
  }


  onCardInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.paymentForm.get('cardNumber')?.setValue(value);
  }
  onExpiryInput(event: any): void {
    const value = event.target.value.replace(/[^0-9/]/g, '');
    this.paymentForm.get('expiryDate')?.setValue(value);
  }

  onCvvInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.paymentForm.get('cvv')?.setValue(value);
  }
}
