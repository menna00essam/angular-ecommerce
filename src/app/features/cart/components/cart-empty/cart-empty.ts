import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-empty',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule],
   templateUrl: './cart-empty.html',
  styleUrls: ['./cart-empty.css']
})
export class CartEmpty {
  @Output() continueShopping = new EventEmitter<void>();

  onContinueShopping(): void {
    this.continueShopping.emit();
  }
}