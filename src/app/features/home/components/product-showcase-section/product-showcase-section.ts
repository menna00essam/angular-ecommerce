// components/product-showcase-section/product-showcase-section.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-showcase-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
    templateUrl: './product-showcase-section.html',
  styleUrls: ['./product-showcase-section.css']
  
})
export class ProductShowcaseSection {}