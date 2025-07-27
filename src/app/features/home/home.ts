import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Component, OnInit, OnDestroy, inject, WritableSignal, signal } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { Product, Category } from '../../core/models/product.model';
import { Router, RouterModule } from '@angular/router';



import { HeroSectionComponent } from './components/hero-section-component/hero-section-component';
import { FeaturesSection } from './components/features-section/features-section';
import { ProductShowcaseSection } from './components/product-showcase-section/product-showcase-section';
import { FeaturedProductsSection } from './components/featured-products-section/featured-products-section';
import { OffersSection } from './components/offers-section/offers-section';
import { CategoriesSection } from './components/categories-section/categories-section';
import { ProductsSkeleton } from '../../shared/components/products-skeleton/products-skeleton';
import { Empty } from '../../shared/components/error/empty/empty';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule, 
    RouterModule,
    HeroSectionComponent,
    FeaturesSection,
    ProductShowcaseSection,
    FeaturedProductsSection,
    OffersSection,
    CategoriesSection,
    ProductsSkeleton
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  public router = inject(Router);

  featuredProducts: WritableSignal<Product[]> = signal([]);
  displayedCategories: WritableSignal<Category[]> = signal([]);
  loading: WritableSignal<boolean> = signal(true);
  error: WritableSignal<string | null> = signal(null);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts.set(products.slice(0, 8));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load featured products');
        this.loading.set(false);
      }
    });

    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.displayedCategories.set(categories.slice(0, 6));
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });
  }

  onRetryLoading(): void {
    this.loadData();
  }

  onNavigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  onNavigateToCategory(slug: string): void {
    this.router.navigate(['/products'], { queryParams: { category: slug } });
  }
}