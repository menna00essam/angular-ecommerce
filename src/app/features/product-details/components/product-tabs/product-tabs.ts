import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-tabs',
  standalone: true,
  imports: [CommonModule, TranslateModule],
   templateUrl: './product-tabs.html',
  styleUrls: ['./product-tabs.css']
 
})
export class ProductTabs {
  @Input() product: Product | null = null;
  @Input() selectedTab: string = 'description';
  
  @Output() changeTab = new EventEmitter<string>();

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }
  get hasTags(): boolean {
  return !!this.product?.tags && this.product.tags.length > 0;
}

}