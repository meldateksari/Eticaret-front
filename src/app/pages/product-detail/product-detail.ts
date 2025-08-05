import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecommendedProducts } from '../recommended-products/recommended-products';
import { Product } from '../../models/product.model';
import { ProductInteractionService } from '../../services/product-interaction.service';
import {Reviews} from '../reviews/reviews';
import {User} from '../../models/user.model';
import {ReviewService} from '../../services/review.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RecommendedProducts, Reviews],
  templateUrl: './product-detail.html',
  providers: [ProductInteractionService]
})
export class ProductDetail implements OnInit {
  currentUser: number;
  product: any;
  reviews: any[] = [];



  constructor(
    private route: ActivatedRoute,
    private productInteractionService: ProductInteractionService,
    private reviewService: ReviewService,
  ) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productInteractionService.getProductInteraction(productId)
      .subscribe(p => this.product = p as Product);

    this.currentUser = Number(localStorage.getItem("userId"));

    this.reviewService.getReviewsByProduct(this.product.id).subscribe(data => {
      this.reviews = data;
    });

  }
}
