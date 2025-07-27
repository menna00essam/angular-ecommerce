import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CartItem } from '../../../../core/models/cart.model';
import { PriceFormatPipe } from '../../../../shared/pipes/price-format.pipe';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule, PriceFormatPipe],
  template: `
    <div class="bg-white rounded shadow p-6">
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <h2 class="text-xl font-semibold text-gray-700">{{ 'cart.products' | translate }}</h2>
        <button
          mat-stroked-button
          color="warn"
          (click)="onClearCart()"
          [disabled]="isUpdating"
        >
          {{ 'cart.clearCart' | translate }}
        </button>
      </div>

      <div 
        *ngFor="let item of items; trackBy: trackByProductId" 
        class="grid grid-cols-1 sm:grid-cols-6 gap-4 py-4 border-b"
      >
        <div class="sm:col-span-1">
          <img 
            [src]="item.thumbnail" 
            [alt]="item.title" 
            class="w-full h-24 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
            (click)="onGoToProduct(item.productId)"
          />
        </div>

        <div class="sm:col-span-2">
          <h3 
            class="text-base font-medium text-gray-800 cursor-pointer hover:text-blue-600"
            (click)="onGoToProduct(item.productId)"
          >
            {{ item.title }}
          </h3>
          <p class="text-primary font-semibold mt-1">{{ item.price | priceFormat }}</p>
        </div>

        <div class="sm:col-span-1 flex items-center gap-2">
          <button 
            mat-mini-button 
            (click)="onDecreaseQuantity(item.productId)" 
            [disabled]="item.quantity <= 1 || isUpdating"
          >
            −
          </button>
          <input 
            type="number"
            class="w-16 border text-center rounded"
            [value]="item.quantity"
            [min]="1"
            [max]="getMaxQuantity"
            (change)="onQuantityChange(item.productId, $event)"
            [disabled]="isUpdating"
          />
          <button 
            mat-mini-button 
            (click)="onIncreaseQuantity(item.productId)" 
            [disabled]="item.quantity >= getMaxQuantity || isUpdating"
          >
            +
          </button>
        </div>

        <div class="sm:col-span-1 text-right">
          <p class="text-sm text-gray-500">{{ 'cart.total' | translate }}:</p>
          <p class="font-semibold">{{ getItemTotal(item) | priceFormat }}</p>
        </div>

        <div class="sm:col-span-1 text-right">
          <button 
            mat-icon-button 
            color="warn" 
            (click)="onRemoveItem(item.productId)" 
            [disabled]="isUpdating"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: []
})
export class CartItemsComponent {
  @Input() items: CartItem[] = [];
  @Input() isUpdating: boolean = false;
  @Input() getMaxQuantity!: number;
  @Input() getItemTotal!: (item: CartItem) => number;
  @Input() trackByProductId!: (index: number, item: CartItem) => number;

  @Output() clearCart = new EventEmitter<void>();
  @Output() increaseQuantity = new EventEmitter<number>();
  @Output() decreaseQuantity = new EventEmitter<number>();
  @Output() removeItem = new EventEmitter<number>();
  @Output() quantityChange = new EventEmitter<{productId: number, event: Event}>();
  @Output() goToProduct = new EventEmitter<number>();

  onClearCart(): void {
    this.clearCart.emit();
  }

  onIncreaseQuantity(productId: number): void {
    this.increaseQuantity.emit(productId);
  }

  onDecreaseQuantity(productId: number): void {
    this.decreaseQuantity.emit(productId);
  }

  onRemoveItem(productId: number): void {
    this.removeItem.emit(productId);
  }

  onQuantityChange(productId: number, event: Event): void {
    this.quantityChange.emit({ productId, event });
  }

  onGoToProduct(productId: number): void {
    this.goToProduct.emit(productId);
  }
}