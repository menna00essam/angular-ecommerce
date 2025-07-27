import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-payment-options',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="my-12 p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Tapy Payment -->
        <div class="flex flex-row items-center text-start p-6 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-green-500 gap-4">
          <img 
            src="assets/images/tapy.webp" 
            alt="{{ 'INSTALLMENT_PAYMENT' | translate }}" 
            class="w-24 h-24 object-contain rounded-xl"
          />
          <div>
            <p class="text-gray-600 text-sm leading-relaxed mb-2">
              {{ 'INSTALLMENT_DESCRIPTION' | translate }}
            </p>
            <a 
              routerLink="/" 
              class="text-primary hover:text-primary text-sm font-semibold transition-colors duration-200 hover:underline"
            >
              {{ 'LEARN_MORE' | translate }}
            </a>
          </div>
        </div>

        <!-- SPOII Payment -->
        <div class="flex flex-row items-center text-start p-6 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-green-500 gap-4">
          <img 
            src="assets/images/sPOII.png" 
            alt="{{ 'INSTALLMENT_PAYMENT' | translate }}" 
            class="w-24 h-24 object-contain rounded-xl"
          />
          <div>
            <p class="text-gray-600 text-sm leading-relaxed mb-2">
              {{ 'INSTALLMENT_DESCRIPTION' | translate }}
            </p>
            <a 
              routerLink="/" 
              class="text-primary hover:text-primary text-sm font-semibold transition-colors duration-200 hover:underline"
            >
              {{ 'LEARN_MORE' | translate }}
            </a>
          </div>
        </div>

        <!-- Tamara Payment -->
        <div class="flex flex-row items-center text-start p-6 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-green-500 gap-4">
          <img 
            src="assets/images/tamara.png" 
            alt="{{ 'INSTALLMENT_PAYMENT' | translate }}" 
            class="w-24 h-24 object-contain rounded-xl"
          />
          <div>
            <p class="text-gray-600 text-sm leading-relaxed mb-2">
              {{ 'INSTALLMENT_DESCRIPTION' | translate }}
            </p>
            <a 
              routerLink="/" 
              class="text-primary hover:text-primary text-sm font-semibold transition-colors duration-200 hover:underline"
            >
              {{ 'LEARN_MORE' | translate }}
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductPaymentOptions {}
