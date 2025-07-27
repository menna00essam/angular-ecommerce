import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products-pagination',
  standalone: true,
  imports: [CommonModule, TranslateModule],
   templateUrl: './products-pagination.html',
  styleUrls: ['./products-pagination.css']

})
export class ProductsPagination {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 0;
  @Input() totalProducts: number = 0;
  @Input() productsPerPage: number = 12;

  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  getVisiblePages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: (number | string)[] = [];

    if (total <= 0) return [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (current >= total - 3) {
        pages.push('...');
        for (let i = total - 4; i <= total - 1; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
      }

      pages.push(total);
    }

    return pages;
  }
}