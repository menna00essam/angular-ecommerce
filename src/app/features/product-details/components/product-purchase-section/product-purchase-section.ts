import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PriceFormatPipe } from '../../../../shared/pipes/price-format.pipe';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-purchase-section',
  standalone: true,
  imports: [CommonModule, TranslateModule, PriceFormatPipe],
  template: `
    <div *ngIf="product && (product.stock || 0) > 0" class="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6">
      <!-- Quantity Selector -->
      <div class="space-y-3">
        <label class="block text-lg font-semibold text-gray-800">
          {{ 'QUANTITY' | translate }}
        </label>
        <div class="flex items-center gap-4">
          <button 
            class="w-11 h-11 border-2 border-gray-200 bg-white rounded-xl flex items-center justify-center text-xl font-semibold transition-all duration-200 hover:border-green-500 hover:bg-green-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" 
            (click)="decreaseQuantity.emit()" 
            [disabled]="quantity <= 1"
            type="button"
          >
            −
          </button>
          <span class="text-xl font-semibold text-gray-800 min-w-8 text-center">{{ quantity }}</span>
          <button 
            class="w-11 h-11 border-2 border-gray-200 bg-white rounded-xl flex items-center justify-center text-xl font-semibold transition-all duration-200 hover:border-green-500 hover:bg-green-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" 
            (click)="increaseQuantity.emit()" 
            [disabled]="quantity >= (product.stock || 0)"
            type="button"
          >
            +
          </button>
        </div>
      </div>

      <!-- Add to Cart Button -->
      <button 
        (click)="addToCart.emit()" 
        class="w-full bg-primary hover:bg-primary text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg min-h-12"
        type="button"
      >
        <div class="flex items-center gap-3">
          <span>{{ 'ADD_TO_CART' | translate }}</span>
        </div>
        <span class="font-bold">{{ totalPrice | priceFormat }}</span>
      </button>
    </div>
  `
})
export class ProductPurchaseSection {
  @Input() product: Product | null = null;
  @Input() quantity: number = 1;
  @Input() totalPrice: number = 0;
  
  @Output() increaseQuantity = new EventEmitter<void>();
  @Output() decreaseQuantity = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<void>();
}