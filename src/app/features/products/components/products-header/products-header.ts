import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
   templateUrl: './products-header.html',
  styleUrls: ['./products-header.css']
 
})
export class ProductsHeader {
  @Input() totalProducts: number = 0;
  @Input() currentPage: number = 1;
  @Input() productsPerPage: number = 12;
  @Input() viewMode: 'grid' | 'list' = 'grid';

  @Output() viewModeChange = new EventEmitter<'grid' | 'list'>();

  onViewModeChange(mode: 'grid' | 'list') {
    this.viewModeChange.emit(mode);
  }

  getDisplayRange(): string {
    if (this.totalProducts === 0) return '0-0';
    
    const start = (this.currentPage - 1) * this.productsPerPage + 1;
    const end = Math.min(this.currentPage * this.productsPerPage, this.totalProducts);
    return `${start}-${end}`;
  }
}