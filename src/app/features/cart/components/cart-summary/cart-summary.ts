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
   templateUrl: './cart-summary.html',
  styleUrls: ['./cart-summary.css']
  ,
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