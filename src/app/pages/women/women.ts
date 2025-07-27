import { Component, OnInit } from '@angular/core';
import { ProductCards } from '../../components/pages/product-cards/product-cards';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-women',
  standalone: true,
  imports: [ProductCards, CommonModule],
  templateUrl: './women.html',
  styleUrls: ['./women.css']
})
export class Women implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAll().subscribe(data => {
      this.products = data;
    });
  }
}
