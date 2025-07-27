import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PriceFormatPipe } from '../../../../shared/pipes/price-format.pipe';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule, TranslateModule, PriceFormatPipe],
  template: `
    <div class="space-y-6">
      <!-- Brand -->
      <div *ngIf="product?.brand" class="flex items-center gap-2">
        <span class="text-gray-500 text-sm font-medium">{{ 'BRAND' | translate }}:</span>
        <span class="text-primary text-sm font-semibold uppercase tracking-wide">  {{ product?.brand }}
</span>
      </div>

      <!-- Title -->
      <h1 class="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">{{ product?.title }}</h1>

      <!-- Rating -->
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex gap-0.5">
          <span
            *ngFor="let star of getStarArray(product?.rating || 0)"
            class="text-xl transition-colors duration-200"
            [class]="star === 1 ? 'text-yellow-400' : 'text-gray-300'"
          >★</span>
        </div>
        <span class="font-semibold text-gray-800 text-lg">{{ product?.rating }}</span>
        <span class="text-gray-500 text-sm">
          ({{ product?.rating }} {{ 'REVIEWS' | translate }})
        </span>
      </div>

      <!-- Price Section -->
      <div class="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
        <div class="text-3xl font-bold text-primary">
          {{ (product?.price || 0) | priceFormat }}
        </div>
        
        <ng-container *ngIf="oldPrice">
          <div class="text-xl text-gray-400 line-through">
            {{ oldPrice | priceFormat }}
          </div>
        </ng-container>

        <div *ngIf="discountAmount > 0" class="text-lg text-red-500 font-semibold">
          {{ 'YOU_SAVE' | translate }} {{ discountAmount | priceFormat }}
        </div>
      </div>

      <!-- Stock Status -->
      <div>
        <span 
          *ngIf="(product?.stock || 0) > 0" 
          class="inline-flex items-center gap-2 text-primary bg-green-50 px-4 py-3 rounded-xl font-medium"
        >
          <span class="font-bold">✓</span>
          {{ 'IN_STOCK' | translate }} ({{ product?.stock }} {{ 'ITEMS' | translate }})
        </span>
        <span 
          *ngIf="!(product?.stock) || product?.stock === 0" 
          class="inline-flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl font-medium"
        >
          <span class="font-bold">✗</span>
          {{ 'OUT_OF_STOCK' | translate }}
        </span>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div class="flex items-center gap-3 text-gray-600 text-sm font-medium">
          <span>{{ 'FREE_SHIPPING' | translate }}</span>
        </div>
        <div class="flex items-center gap-3 text-gray-600 text-sm font-medium">
          <span>{{ 'FREE_RETURNS' | translate }}</span>
        </div>
        <div class="flex items-center gap-3 text-gray-600 text-sm font-medium">
          <span>{{ 'PRODUCT_WARRANTY' | translate }}</span>
        </div>
      </div>

      <!-- Share Button -->
      <div class="pt-4 border-t border-gray-200">
        <button 
          (click)="shareProduct.emit()" 
          class="flex items-center gap-2 text-primary hover:text-primary font-medium transition-colors duration-200 hover:underline"
          type="button"
        >
          {{ 'SHARE_PRODUCT' | translate }}
        </button>
      </div>
    </div>
  `
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