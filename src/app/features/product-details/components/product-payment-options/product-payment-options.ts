import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-payment-options',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './product-payment-options.html',
  styleUrls: ['./product-payment-options.css']
 
})
export class ProductPaymentOptions {}
