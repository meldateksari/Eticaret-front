import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Address } from '../../models/address.model';
import { AddressService } from '../../services/address.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './checkout.html'
})
export class Checkout {
  address: Address = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  };
  shippingMethod: 'standard' | 'express' = 'standard';

  constructor(private addressService: AddressService) {}

  placeOrder() {
    const userId = 1; // Test amaçlı sabit; normalde login olmuş kullanıcıdan alınmalı

    this.addressService.createAddress(userId, this.address).subscribe({
      next: (response) => {
        console.log('Adres başarıyla kaydedildi:', response);
        // Shipping işlemine geçilebilir
      },
      error: (err) => {
        console.error('Adres kaydedilemedi:', err);
      }
    });
  }
}
