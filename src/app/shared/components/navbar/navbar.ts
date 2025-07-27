import { Component, inject, signal, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    TranslateModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);
  productService = inject(ProductService);

  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  cartItemCount = this.cartService.totalItems;
  cartTotal = this.cartService.totalPrice;

  searchQuery = signal<string>('');
  showMobileMenu = signal<boolean>(false);
  showLangMenu = signal<boolean>(false);
  showUserMenu = signal<boolean>(false);

  categories = [
    { label: 'CATEGORIES.ELECTRONICS', link: '/products' },
    { label: 'CATEGORIES.MONITORS', link: '/products/monitors' },
    { label: 'CATEGORIES.ACCESSORIES', link: '/products/accessories' },
    { label: 'CATEGORIES.CAMERAS', link: '/products/cameras' },
    { label: 'CATEGORIES.HEADPHONES', link: '/products/headphones' },
    { label: 'CATEGORIES.SECURITY', link: '/products/security' },
    { label: 'CATEGORIES.PHONES', link: '/products/phones' },
    { label: 'CATEGORIES.ALL_PRODUCTS', link: '/products/all' }
  ];

  @ViewChild('searchBox', { static: false }) searchBoxRef!: ElementRef;
  @ViewChild('mobileSearchBox', { static: false }) mobileSearchBoxRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (this.searchBoxRef &&
        !this.searchBoxRef.nativeElement.contains(target) &&
        this.searchQuery().trim()) {
      this.clearSearch();
    }

    if (this.mobileSearchBoxRef &&
        !this.mobileSearchBoxRef.nativeElement.contains(target) &&
        this.searchQuery().trim() &&
        this.showMobileMenu()) {
      this.clearSearch();
    }

    
    if (this.showLangMenu() && !target.closest('.relative button')) { 
      this.showLangMenu.set(false);
    }
    
    if (this.showUserMenu() && !target.closest('.relative button')) {
      this.showUserMenu.set(false);
    }
  }

  suggestions$: Observable<Product[]> = of([]);
  private searchInput$ = new BehaviorSubject<string>('');

  ngOnInit() {
    this.suggestions$ = this.searchInput$.pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (!query.trim()) return of([]);
        return this.productService.searchProducts(query.trim(), 5).pipe(
          map(res => res.products)
        );
      })
    );

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.clearSearch();
 
        this.showMobileMenu.set(false);
        this.showLangMenu.set(false);
        this.showUserMenu.set(false);
      }
    });
  }

  onSearchInputChange(query: string): void {
    this.searchQuery.set(query);
    this.searchInput$.next(query);
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
    this.clearSearch();
    this.showMobileMenu.set(false);
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/products'], { queryParams: { search: query } });
      this.clearSearch();
      this.showMobileMenu.set(false);
    }
  }

  private clearSearch(): void {
    this.searchQuery.set('');
    this.searchInput$.next('');
  }

  switchLanguage(lang: 'en' | 'ar') {
    this.languageService.switchLanguage(lang);
  }

  onLogout(): void {
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.update((show) => !show);
    this.showLangMenu.set(false);
    this.showUserMenu.set(false);
  }

  toggleLangMenu(): void {
    this.showLangMenu.update((show) => !show);
    this.showUserMenu.set(false);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update((show) => !show);
    this.showLangMenu.set(false); 
  }
}