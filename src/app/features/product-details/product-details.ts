import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { TranslateModule } from '@ngx-translate/core';

import { ProductImageGallery } from './components/product-image-gallery/product-image-gallery';
import { ProductInfo } from './components/product-info/product-info';
import { ProductPurchaseSection } from './components/product-purchase-section/product-purchase-section';
import { ProductPaymentOptions } from './components/product-payment-options/product-payment-options';
import { ProductTabs } from './components/product-tabs/product-tabs';
import { ProductRelated } from './components/product-related/product-related';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    TranslateModule, 
    ProductImageGallery,
    ProductInfo,
    ProductPurchaseSection,
    ProductPaymentOptions,
    ProductTabs,
    ProductRelated
  ],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-6 font-sans min-h-screen text-gray-800" [class.rtl]="isArabic()">
      
      <div *ngIf="loading()" class="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
        <p class="text-gray-500 text-lg font-medium">{{ 'LOADING' | translate }}</p>
      </div>

      <div *ngIf="error()" class="flex items-center justify-center min-h-[400px] p-10">
        <div class="text-center bg-gray-50 p-12 rounded-xl border-2 border-red-500 max-w-lg">
          <div class="text-5xl mb-4">⚠️</div>
          <h3 class="text-red-500 text-2xl font-semibold mb-3">{{ 'ERROR_OCCURRED' | translate }}</h3>
          <p class="text-gray-500 mb-6 leading-relaxed">{{ error() }}</p>
          <button 
            (click)="goBack()" 
            class="bg-gray-100 hover:bg-green-500 hover:text-white text-gray-800 py-3 px-6 rounded-xl font-medium transition-all duration-300 border-2 border-gray-200 hover:border-green-500"
          >
            {{ 'BACK_TO_PRODUCTS' | translate }}
          </button>
        </div>
      </div>

      <div *ngIf="product() as p" class="space-y-12">
        <nav class="mb-8 py-4">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <a 
              routerLink="/" 
              class="text-primary font-medium transition-colors duration-200 hover:underline"
            >
              {{ 'HOME' | translate }}
            </a>
            <span class="text-gray-400 font-light">/</span>
            <a 
              routerLink="/products" 
              class="text-primary font-medium transition-colors duration-200 hover:underline"
            >
              {{ 'PRODUCTS' | translate }}
            </a>
            <span class="text-gray-400 font-light">/</span>
            <span class="text-gray-800 font-semibold">{{ p.category }}</span>
          </div>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <app-product-image-gallery
            [images]="p.images || []"
            [selectedImage]="selectedImage()"
            [selectedImageIndex]="selectedImageIndex()"
            [productTitle]="p.title"
            [isNew]="p.meta.createdAt ? isNewProduct(p.meta.createdAt) : false"
            [discountPercentage]="p.discountPercentage || 0"
            (imageSelect)="selectImage($event)"
          ></app-product-image-gallery>

          <div class="space-y-6">
            <app-product-info
              [product]="p"
              [oldPrice]="oldPrice()"
              [discountAmount]="discountAmount()"
              (shareProduct)="shareProduct()"
            ></app-product-info>

            <app-product-purchase-section
              [product]="p"
              [quantity]="quantity()"
              [totalPrice]="totalPrice()"
              (increaseQuantity)="increaseQuantity()"
              (decreaseQuantity)="decreaseQuantity()"
              (addToCart)="addToCart()"
            ></app-product-purchase-section>
          </div>
        </div>

        <app-product-payment-options></app-product-payment-options>

        <app-product-tabs
          [product]="p"
          [selectedTab]="selectedTab"
          (changeTab)="changeTab($event)"
        ></app-product-tabs>

        <app-product-related
          [relatedProducts]="relatedProducts()"
        ></app-product-related>
      </div>
    </div>
  `,
  styleUrls: ['./product-details.css']
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  selectedImageIndex = signal<number>(0);
  quantity = signal<number>(1);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  isArabic = signal<boolean>(false);
  
  selectedTab = 'description';
  
  selectedImage = computed(() => {
    const prod = this.product();
    if (!prod || !prod.images || prod.images.length === 0) return prod?.thumbnail || '';
    return prod.images[this.selectedImageIndex()] || prod.thumbnail;
  });

  totalPrice = computed(() => {
    const prod = this.product();
    return prod ? prod.price * this.quantity() : 0;
  });

  oldPrice = computed(() => {
    const prod = this.product();
    if (!prod || !prod.discountPercentage) return null;
    return +(prod.price / (1 - prod.discountPercentage / 100)).toFixed(2);
  });

  discountAmount = computed(() => {
    const oldPriceValue = this.oldPrice();
    const prod = this.product();
    return oldPriceValue && prod ? 
      (oldPriceValue - prod.price) * this.quantity() : 0;
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.product.set(product);
          this.loadRelatedProducts(product.category, product.id);
        } else {
          this.error.set('Product not found');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product');
        this.loading.set(false);
        console.error('Error loading product:', err);
      }
    });
  }

  private loadRelatedProducts(category: string, currentProductId: number): void {
    this.productService.getRelatedProducts(currentProductId, category, 4).subscribe({
      next: (products) => {
        this.relatedProducts.set(products);
      },
      error: (err) => {
        console.error('Error loading related products:', err);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  increaseQuantity(): void {
    const prod = this.product();
    if (prod && this.quantity() < prod.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  changeTab(tab: string): void {
    this.selectedTab = tab;
  }

  addToCart(): void {
    const prod = this.product();
    if (prod) {
      this.cartService.addToCart({
        id: prod.id,
        title: prod.title,
        price: prod.price,
        thumbnail: prod.thumbnail
      }, this.quantity());
      
      this.quantity.set(1);
    }
  }

  shareProduct(): void {
    if (navigator.share) {
      const prod = this.product();
      if (prod) {
        navigator.share({
          title: prod.title,
          text: prod.description,
          url: window.location.href
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard');
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  isNewProduct(createdAt: string): boolean {
    const now = new Date();
    const created = new Date(createdAt);
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }
}