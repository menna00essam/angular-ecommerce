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
   templateUrl: './cart-items.html',
  styleUrls: ['./cart-items.css']
 
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