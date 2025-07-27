import { Component, OnInit, OnDestroy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductFilter } from '../../core/models/product.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { Empty } from '../../shared/components/error/empty/empty';

import { ProductsFilters } from './components/products-filters/products-filters';
import { ProductsGrid } from './components/products-grid/products-grid';
import { ProductsHeader } from './components/products-header/products-header';
import { ProductsPagination } from './components/products-pagination/products-pagination';
import { ProductsSkeleton } from '../../shared/components/products-skeleton/products-skeleton';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    Empty,
    ProductsFilters,
    ProductsGrid,
    ProductsHeader,
    ProductsPagination,
    ProductsSkeleton
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  products = this.productService.products;
  categories = this.productService.categories;
  loading = this.productService.loading;
  error = this.productService.error;
  totalProducts = this.productService.totalProducts;

  searchQuery = '';
  selectedCategory = '';
  sortBy = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedRating = 0;
  currentPage = 1;
  productsPerPage = 12;
  viewMode: 'grid' | 'list' = 'grid';

  totalPages = computed(() => {
    const total = this.totalProducts();
    return total > 0 ? Math.ceil(total / this.productsPerPage) : 0;
  });

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((query) => {
        this.searchQuery = query;
        this.currentPage = 1;
        this.loadProducts();
      });
  }

  ngOnInit() {
    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.searchSubject.next(target.value);
    }
  }

  onFiltersChange(filters: any) {
    this.selectedCategory = filters.selectedCategory;
    this.sortBy = filters.sortBy;
    this.minPrice = filters.minPrice;
    this.maxPrice = filters.maxPrice;
    this.selectedRating = filters.selectedRating;
    this.currentPage = 1;
    this.loadProducts();
  }

  onViewModeChange(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadProducts() {
    const filter: ProductFilter = {
      limit: this.productsPerPage,
      skip: (this.currentPage - 1) * this.productsPerPage,
    };

    if (this.searchQuery?.trim()) {
      filter.searchQuery = this.searchQuery.trim();
    }

    if (this.selectedCategory) {
      filter.category = this.selectedCategory;
    }

    if (this.minPrice !== null && this.minPrice >= 0) {
      filter.minPrice = this.minPrice;
    }

    if (this.maxPrice !== null && this.maxPrice >= 0) {
      filter.maxPrice = this.maxPrice;
    }

    if (this.selectedRating > 0) {
      filter.minRating = this.selectedRating;
    }

    if (this.sortBy) {
      const [field, order] = this.sortBy.split('-');
      if (field && order) {
        filter.sortBy = field;
        filter.order = order as 'asc' | 'desc';
      }
    }

    this.productService.getProducts(filter)?.subscribe({
      next: () => {},
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortBy = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedRating = 0;
    this.currentPage = 1;
    this.loadProducts();
  }

  retryLoading() {
    this.loadProducts();
  }
}