import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {NgSwitch} from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  templateUrl: './profile-sidebar.html',
  imports: [RouterLink, RouterLinkActive, NgSwitch,CommonModule],
})
export class ProfileSidebar {
  constructor(private router: Router) {}

  menuItems = [
    { icon: 'user', label: 'My Account', path: '/account' },
    { icon: 'package', label: 'My Orders', path: '/orders' },
    { icon: 'map-pin', label: 'My Addresses', path: '/addresses' },
    { icon: 'arrow-counter-clockwise', label: 'My Returns', path: '/returns' },
    { icon: 'heart', label: 'My Wishlist', path: '/wishlist' },
    { icon: 'gear', label: 'Settings', path: '/settings' }
  ];

}
