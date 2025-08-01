import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Product} from '../../models/product.model';
import {ProductService} from '../../services/product.service';
import {AuthService} from '../../auth/service/auth.service';
import {UserService} from '../../services/user.service';


@Component({
  selector: 'app-recommended-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommended-products.html',
  providers: [UserService]
})
export class RecommendedProducts implements OnInit {
  userId: number | null = null; // Başlangıçta null tanımla
  recommendedProducts: Product[] = [];
  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userId = user?.id ?? null;

    if (this.userId) {
      this.userService.getRecommended(this.userId).subscribe(data => {
        console.log("Gelen önerilen ürünler: ", data);
        this.recommendedProducts = data;
      });
    }
  }

}
