import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address.model';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.html',
  styleUrls: ['./addresses.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Addresses implements OnInit {
  addresses: Address[] = [];
  userId!: number;
  editingAddress: Address | null = null;


  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.userId = Number(storedUserId);

    if (!isNaN(this.userId) && this.userId > 0) {
      this.loadAddresses(this.userId);
    } else {
      console.error('Geçersiz kullanıcı ID');
    }
  }

  private loadAddresses(userId: number): void {
    this.addressService.getAddressesByUserId(userId).subscribe({
      next: (data) => {
        this.addresses = data;
      },
      error: (err) => {
        console.error('Adresler alınırken hata oluştu:', err);
      }
    });
  }
  openEditModal(address: Address): void {
    // Kopya al: orijinal listeyi anında değiştirmemek için
    this.editingAddress = { ...address };
  }

  closeModal(): void {
    this.editingAddress = null;
  }

  submitEditForm(): void {
    if (!this.editingAddress || !this.editingAddress.id) return;

    this.addressService.updateAddress(this.editingAddress.id, this.editingAddress).subscribe({
      next: () => {
        this.closeModal();
        this.loadAddresses(this.userId);
      },
      error: (err) => {
        console.error('Adres güncellenemedi', err);
      }
    });
  }
}
