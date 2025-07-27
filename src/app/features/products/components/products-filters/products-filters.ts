import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-products-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './products-filters.html',
  styleUrls: ['./products-filters.css']
})
export class ProductsFilters {
  private productService = inject(ProductService);

  @Input() categories: any[] = [];
  @Input() totalProducts: number = 0;
  @Input() selectedCategory: string = '';
  @Input() sortBy: string = '';
  @Input() minPrice: number | null = null;
  @Input() maxPrice: number | null = null;
  @Input() selectedRating: number = 0;

  @Output() filtersChange = new EventEmitter<any>();
  @Output() resetFilters = new EventEmitter<void>();

  categoriesExpanded = false;
  ratingOptions = [4, 3, 2, 1];

  onFiltersChange() {
    this.filtersChange.emit({
      selectedCategory: this.selectedCategory,
      sortBy: this.sortBy,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      selectedRating: this.selectedRating
    });
  }

  onPriceChange() {
    if (this.minPrice !== null && this.maxPrice !== null && this.minPrice > this.maxPrice) {
      [this.minPrice, this.maxPrice] = [this.maxPrice, this.minPrice];
    }
    this.onFiltersChange();
  }

  onResetFilters() {
    this.resetFilters.emit();
  }

  getCategoryCount(categorySlug: string): number {
    return this.productService.getCategoryCount?.(categorySlug) ?? 0;
  }

  getRatingProductCount(rating: number): number {
    return this.productService.getRatingProductCount?.(rating) ?? 0;
  }

  getStars(rating: number): number[] {
    return Array(Math.max(0, Math.min(5, rating))).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    const filled = Math.max(0, Math.min(5, rating));
    return Array(5 - filled).fill(0);
  }

  toggleCategoriesExpanded() {
    this.categoriesExpanded = !this.categoriesExpanded;
  }
}