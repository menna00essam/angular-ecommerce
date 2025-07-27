// components/categories-section/categories-section.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../../../core/models/product.model';

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule],
  templateUrl: './categories-section.html',
  styleUrls: ['./categories-section.css']
})
export class CategoriesSection {
  @Input() categories: Category[] = [];
  @Output() navigateToCategory = new EventEmitter<string>();
  @Output() navigateToProducts = new EventEmitter<void>();

  categoryImages: { [key: string]: string } = {
    Beauty: 'assets/images/Beauty.jpg',
    Fragrances: 'assets/images/Fragrances.jpg',
    Furniture: 'assets/images/Furniture.jpg',
    Groceries: 'assets/images/Groceries.jpg',
    'Home Decoration': 'assets/images/HomeDecoration.jpg',
    'Kitchen Accessories': 'assets/images/KitchenAccessories.jpg',
  };

  onCategoryClick(slug: string): void {
    this.navigateToCategory.emit(slug);
  }

  onViewAll(): void {
    this.navigateToProducts.emit();
  }
}
