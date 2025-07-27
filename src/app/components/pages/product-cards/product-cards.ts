import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-cards.html',
  styleUrls: ['./product-cards.css']
})
export class ProductCards {
  @Input() products: Product[] = [];
}
