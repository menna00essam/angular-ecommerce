import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { PriceFormatPipe } from '../../../../shared/pipes/price-format.pipe';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatCardModule, 
    MatDividerModule, 
    TranslateModule, 
    PriceFormatPipe
  ],
  template: `
    <mat-card class="p-6">
      <h3 class="text-xl font-semibold text-center mb-6">{{ 'cart.summary' | translate }}</h3>

      <div class="space-y-4 mb-6">
        <div class="flex justify-between text-gray-700">
          <span>{{ 'cart.subtotal' | translate }}:</span>
          <span>{{ subtotal | priceFormat }}</span>
        </div>
        <div class="flex justify-between text-gray-700">
          <span>
            {{ 'cart.shipping' | translate }}:
            <small *ngIf="shipping === 0" class="text-green-600">
              ({{ 'cart.freeShipping' | translate }})
            </small>
          </span>
          <span>{{ shipping | priceFormat }}</span>
        </div>
        <div class="flex justify-between text-gray-700">
          <span>{{ 'cart.tax' | translate }} (15%):</span>
          <span>{{ tax | priceFormat }}</span>
        </div>
        <mat-divider></mat-divider>
        <div class="flex justify-between font-semibold text-lg text-primary">
          <span>{{ 'cart.total' | translate }}:</span>
          <span>{{ finalTotal | priceFormat }}</span>
        </div>
      </div>

      <div *ngIf="subtotal < 200" class="bg-blue-50 p-4 rounded text-center text-sm text-primary mb-6">
        {{ 'cart.freeShippingNotice' | translate: {amount: formatPrice(200 - subtotal)} }}
        <div class="w-full h-2 bg-gray-200 rounded mt-2 overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-primary to-primary transition-all duration-300" 
            [style.width.%]="(subtotal / 200) * 100"
          >
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
<div class="flex flex-col gap-4">
  <button
    mat-flat-button
    color="primary"
    (click)="onProceedToCheckout()"
    [disabled]="isEmpty || isUpdating"
    class="w-full h-14 text-white rounded-md shadow-sm hover:shadow-md transition"
    style="background-color: var(--primary-color);"
  >
    {{ 'cart.checkout' | translate }}
  </button>

  <button
    mat-stroked-button
    color="accent"
    (click)="onContinueShopping()"
    class="w-full h-14 rounded-md transition"
    style="color: var(--primary-color); border: 1px solid var(--primary-color);"
    onmouseover="this.style.backgroundColor='rgba(98,208,182,0.1)'"
    onmouseout="this.style.backgroundColor='transparent'"
  >
    {{ 'cart.continueShopping' | translate }}
  </button>
</div>

      </div>
    </mat-card>
  `,
  styleUrls: []
})
export class CartSummaryComponent {
  @Input() subtotal: number = 0;
  @Input() shipping: number = 0;
  @Input() tax: number = 0;
  @Input() finalTotal: number = 0;
  @Input() isEmpty: boolean = false;
  @Input() isUpdating: boolean = false;
  @Input() formatPrice!: (price: number) => string;

  @Output() proceedToCheckout = new EventEmitter<void>();
  @Output() continueShopping = new EventEmitter<void>();

  onProceedToCheckout(): void {
    this.proceedToCheckout.emit();
  }

  onContinueShopping(): void {
    this.continueShopping.emit();
  }
}