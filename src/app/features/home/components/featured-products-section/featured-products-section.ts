import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { ProductCard } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-featured-products-section',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, ProductCard],
  templateUrl: './featured-products-section.html',
  styleUrls: ['./featured-products-section.css']
})
export class FeaturedProductsSection {
  @Input() products: Product[] = [];
  @Output() navigateToProducts = new EventEmitter<void>();

  onViewMore(): void {
    this.navigateToProducts.emit();
  }
}