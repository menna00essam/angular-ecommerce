import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './products-grid.html',
  styleUrls: ['./products-grid.css']  
})
export class ProductsGrid {
  @Input() products: Product[] = [];
  @Input() viewMode: 'grid' | 'list' = 'grid';
}