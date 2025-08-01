import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecommendedProducts } from '../recommended-products/recommended-products';
import { Product } from '../../models/product.model';
import { ProductInteractionService } from '../../services/product-interaction.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RecommendedProducts],
  templateUrl: './product-detail.html',
  providers: [ProductInteractionService]
})
export class ProductDetail implements OnInit {
  product!: Product;

  constructor(
    private route: ActivatedRoute,
    private productInteractionService: ProductInteractionService
  ) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productInteractionService.getProductInteraction(productId)
      .subscribe(p => this.product = p as Product);
  }
}
