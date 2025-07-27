import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-empty',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule],
  template: `
    <div class="bg-white rounded shadow p-10 text-center">
      <div class="text-5xl mb-4">🛒</div>
      <h2 class="text-2xl font-semibold mb-2 text-gray-700">{{ 'cart.emptyTitle' | translate }}</h2>
      <p class="text-gray-500 mb-6">{{ 'cart.emptySubtitle' | translate }}</p>
      <button mat-flat-button color="primary" (click)="onContinueShopping()">
        {{ 'cart.startShopping' | translate }}
      </button>
    </div>
  `,
  styleUrls: []
})
export class CartEmpty {
  @Output() continueShopping = new EventEmitter<void>();

  onContinueShopping(): void {
    this.continueShopping.emit();
  }
}