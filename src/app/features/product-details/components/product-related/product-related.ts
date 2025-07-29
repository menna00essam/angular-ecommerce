import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-related',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ProductCard],
   templateUrl: './product-related.html',
  styleUrls: ['./product-related.css']
 
})
export class ProductRelated {
  @Input() relatedProducts: Product[] = [];

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}