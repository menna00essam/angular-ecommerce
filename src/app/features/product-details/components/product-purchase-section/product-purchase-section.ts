import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PriceFormatPipe } from '../../../../shared/pipes/price-format.pipe';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-purchase-section',
  standalone: true,
  imports: [CommonModule, TranslateModule, PriceFormatPipe],
   templateUrl: './product-purchase-section.html',
  styleUrls: ['./product-purchase-section.css']
 
})
export class ProductPurchaseSection {
  @Input() product: Product | null = null;
  @Input() quantity: number = 1;
  @Input() totalPrice: number = 0;
  
  @Output() increaseQuantity = new EventEmitter<void>();
  @Output() decreaseQuantity = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<void>();
}