import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../services/location.service';

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.html',
  styleUrls: ['./addresses.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [LocationService, AddressService]
})
export class Addresses implements OnInit {
  addresses: Address[] = [];
  userId!: number;
  editingAddress: Address | null = null;
  showAddModal = false;
  countries: Country[] = []; // Değiştirildi - Country interface kullanıyor
  cities: string[] = [];
  isLoadingCities = false; // Loading state eklendi

  constructor(
    private addressService: AddressService,
    private locationService: LocationService
  ) {
  }

  newAddress: Address = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  };

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId && this.userId > 0) {
      this.loadAddresses(this.userId);
    }
    this.loadCountries(); // Ayrı method'a taşındı
  }

  private loadCountries(): void {
    this.locationService.getCountries().subscribe({
      next: (data) => {
        // API'den gelen veriyi Country interface'e uygun şekilde map et
        this.countries = data.map((country: any) => ({
          name: country.name?.common || country.name,
          code: country.cca2 || country.code
        })).sort((a, b) => a.name.localeCompare(b.name));

        console.log('Ülkeler yüklendi:', this.countries.length);
      },
      error: (err) => {
        console.error('Ülkeler alınamadı:', err);
        // Fallback ülke listesi
        this.countries = [
          {name: 'Turkey', code: 'TR'},
          {name: 'United States', code: 'US'},
          {name: 'Germany', code: 'DE'},
          {name: 'France', code: 'FR'},
          {name: 'United Kingdom', code: 'GB'},
          {name: 'Italy', code: 'IT'},
          {name: 'Spain', code: 'ES'}
        ];
      }
    });
  }

  onCountrySelected(): void {
    const selectedCountry = this.countries.find(c => c.name === this.newAddress.country);

    if (!selectedCountry) {
      console.warn('Ülke seçilemedi');
      return;
    }

    this.isLoadingCities = true;

    this.locationService.getCities(selectedCountry.code).subscribe({
      next: (data) => {
        this.cities = data.data ? data.data.map((c: any) => c.name || c.city).sort() : [];
        this.isLoadingCities = false;

        console.log(`${selectedCountry.name} için ${this.cities.length} şehir yüklendi`);
      },
      error: (err) => {
        console.error('Şehirler alınamadı:', err);
        this.isLoadingCities = false;

        // Fallback sadece Türkiye için
        if (selectedCountry.code === 'TR') {
          this.cities = [
            'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana',
            'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir'
          ];
          console.warn('API başarısız oldu, Türkiye şehirleri yedekten yüklendi.');
        } else {
          this.cities = [];
        }
      }
    });
  }



  addNewAddress(): void {
    if (!this.userId || this.userId <= 0) {
      console.error('Geçersiz kullanıcı ID');
      return;
    }

    // Form validasyonu
    if (!this.isValidAddress(this.newAddress)) {
      console.error('Eksik adres bilgileri');
      return;
    }

    this.addressService.createAddress(this.userId, this.newAddress).subscribe({
      next: (created) => {
        this.addresses.push(created);
        this.resetNewAddress();
        this.toggleAddModal();
        console.log('Adres başarıyla eklendi');
      },
      error: (err) => {
        console.error('Adres eklenemedi:', err);
      }
    });
  }

  private isValidAddress(address: Address): boolean {
    return !!(
      address.addressLine1?.trim() &&
      address.city?.trim() &&
      address.state?.trim() &&
      address.zipCode?.trim() &&
      address.country?.trim()
    );
  }

  private resetNewAddress(): void {
    this.newAddress = {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false
    };
    this.cities = []; // Şehirleri de temizle
  }

  toggleAddModal(): void {
    this.showAddModal = !this.showAddModal;
    if (!this.showAddModal) {
      this.resetNewAddress(); // Modal kapanırken formu temizle
    }
  }

  private loadAddresses(userId: number): void {
    this.addressService.getAddressesByUserId(userId).subscribe({
      next: (data) => {
        this.addresses = data;
        console.log(`${data.length} adres yüklendi`);
      },
      error: (err) => {
        console.error('Adresler alınırken hata oluştu:', err);
      }
    });
  }

  openEditModal(address: Address): void {
    // Kopya al: orijinal listeyi anında değiştirmemek için
    this.editingAddress = {...address};
  }

  closeModal(): void {
    this.editingAddress = null;
  }

  submitEditForm(): void {
    if (!this.editingAddress || !this.editingAddress.id) {
      console.error('Düzenlenecek adres bulunamadı');
      return;
    }

    if (!this.isValidAddress(this.editingAddress)) {
      console.error('Eksik adres bilgileri');
      return;
    }

    this.addressService.updateAddress(this.editingAddress.id, this.editingAddress).subscribe({
      next: () => {
        this.closeModal();
        this.loadAddresses(this.userId);
        console.log('Adres başarıyla güncellendi');
      },
      error: (err) => {
        console.error('Adres güncellenemedi', err);
      }
    });
  }
}


