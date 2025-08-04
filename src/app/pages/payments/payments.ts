import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {OrderService} from '../../services/order.service';
import {CreditCardService} from '../../services/credit-cards.service';
import {lastValueFrom} from 'rxjs';
import {CreditCard} from '../../models/credit-card.model';

@Component({
  standalone: true,
  selector: 'app-payment-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css'],
  providers: [OrderService,CreditCardService]
})
export class Payments implements OnInit {
  isLoading = false;
  showSuccess = false;
  orderId!: number;

  ngOnInit(): void {
    const orderId = localStorage.getItem('orderId');
    const userId = localStorage.getItem('userId');

    if (orderId) {
      this.orderId = Number(orderId);
    } else {
      console.error('❌ Sipariş ID bulunamadı!');
    }

    if (userId) {
      this.userId = Number(userId);
      this.fetchSavedCards(); // kayıtlı kartları getir
    } else {
      console.error('❌ Kullanıcı ID bulunamadı!');
    }
  }
  fetchSavedCards() {
    if (this.userId && !isNaN(this.userId)) {
      console.log('🟦 Fetching cards for userId:', this.userId);

      this.creditCardService.getCardsByUserId(this.userId).subscribe({
        next: cards => {
          this.savedCards = cards;
          console.log('🟩 Kartlar başarıyla alındı:', cards);
        },
        error: err => console.error('❌ Kartlar alınamadı:', err)
      });
    } else {
      console.error('Geçersiz userId:', this.userId);
    }
  }

  userId!: number;
  savedCards: CreditCard[] = [];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private creditCardService: CreditCardService
  ) {}



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



  deleteCard(cardId: number) {
    this.creditCardService.deleteCard(cardId).subscribe({
      next: () => this.fetchSavedCards(),
      error: err => console.error('Kart silinemedi:', err)
    });
  }


  async submitPayment() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const card: CreditCard = {
      cardNumber: this.paymentForm.value.cardNumber!,
      expiryDate: this.paymentForm.value.expiryDate!,
      cvv: this.paymentForm.value.cvv!,
      userId: this.userId
    };

    // Kaydet
    try {
      await lastValueFrom(this.creditCardService.addCard(card));
      await this.updatePayment();
      this.fetchSavedCards(); // güncel kartları getir

      this.showSuccess = true;
      this.paymentForm.reset();

      setTimeout(() => {
        this.router.navigate(['/new-order', this.orderId]);
      }, 1000);
    } catch (error) {
      console.error('Ödeme sırasında hata:', error);
    } finally {
      this.isLoading = false;
    }
  }



  onCardInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.paymentForm.get('cardNumber')?.setValue(value);
  }
  onExpiryInput(event: any): void {
    let input = event.target;
    let value = input.value.replace(/\D/g, ''); // sadece rakamları al
    const isDeleting = event.inputType === 'deleteContentBackward';

    // Silme işlemindeyse sadece mevcut değeri bırak
    if (isDeleting) {
      if (value.length <= 2) {
        input.value = value;
        this.paymentForm.get('expiryDate')?.setValue(value, { emitEvent: false });
        return;
      }
    }

    // Otomatik olarak / işareti ekle
    if (value.length >= 3) {
      let month = value.substring(0, 2);
      let year = value.substring(2, 4);

      // Ay kısmı tek haneliyse başına 0 ekle
      if (parseInt(month, 10) < 10 && month.length === 1) {
        month = '0' + month;
      }

      value = `${month}/${year}`;
    } else if (value.length === 2) {
      value = `${value}/`;
    }

    // 5 karakterle sınırla
    value = value.substring(0, 5);

    // Form kontrolünü güncelle
    this.paymentForm.get('expiryDate')?.setValue(value, { emitEvent: false });
  }


  onCvvInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.paymentForm.get('cvv')?.setValue(value);
  }

  async updatePayment() {
    const order = await lastValueFrom(this.orderService.updateOrder(this.orderId, "PAID"));
  }
  fillFormFromCard(card: CreditCard) {
    this.paymentForm.setValue({
      cardNumber: card.cardNumber,
      expiryDate: card.expiryDate,
      cvv: card.cvv
    });
  }

}
