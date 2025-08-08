import { Component } from '@angular/core';
import {ProfileSidebar} from '../profile-sidebar/profile-sidebar';
import {RecommendedProducts} from '../../pages/recommended-products/recommended-products';

@Component({
  selector: 'app-returns',
  imports: [
    ProfileSidebar,
    RecommendedProducts
  ],
  templateUrl: './returns.html',
  styleUrl: './returns.css'
})
export class Returns {

}
