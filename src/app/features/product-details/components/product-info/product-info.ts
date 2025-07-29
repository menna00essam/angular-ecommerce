import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PriceFormatPipe } from '../../../../shared/pipes/price-format.pipe';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule, TranslateModule, PriceFormatPipe],
  templateUrl: './product-info.html',
  styleUrls: ['./product-info.css']
 
})
export class ProductInfo {
  @Input() product: Product | null = null;
  @Input() oldPrice: number | null = null;
  @Input() discountAmount: number = 0;
  
  @Output() shareProduct = new EventEmitter<void>();

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }
}