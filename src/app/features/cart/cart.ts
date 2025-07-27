import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginRequiredDialogComponent } from './login-required-dialog-component/login-required-dialog-component';
import { AuthService } from '../../core/services/auth.service';
import { PriceFormatPipe } from '../../shared/pipes/price-format.pipe';
import { Loader } from '../../shared/components/loader/loader';
import { CartItemsComponent } from './components/cart-items/cart-items';
import { CartSummaryComponent } from './components/cart-summary/cart-summary';
import { CartEmpty } from './components/cart-empty/cart-empty';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,  
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    TranslateModule,
     Loader,
    CartItemsComponent,
    CartSummaryComponent,
    CartEmpty
  ],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isUpdating = signal<boolean>(false);

  items!: any;
  loading!: any;
  error!: any;
  totalItems!: any;
  totalPrice!: any;
  isEmpty!: any;

  subtotal!: any;
  shipping!: any;
  tax!: any;
  finalTotal!: any;

  constructor(
    private cartService: CartService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.items;
    this.loading = this.cartService.loading;
    this.error = this.cartService.error;
    this.totalItems = this.cartService.totalItems;
    this.totalPrice = this.cartService.totalPrice;
    this.isEmpty = this.cartService.isEmpty;

    this.subtotal = computed(() => this.totalPrice());
    this.shipping = computed(() => this.totalPrice() > 200 ? 0 : 25);
    this.tax = computed(() => Math.round(this.subtotal() * 0.15 * 100) / 100);
    this.finalTotal = computed(() => this.subtotal() + this.shipping() + this.tax());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateQuantity(productId: number, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(productId);
      return;
    }

    this.isUpdating.set(true);
    setTimeout(() => {
      this.cartService.updateQuantity(productId, newQuantity);
      this.isUpdating.set(false);
    }, 300);
  }

  increaseQuantity(productId: number): void {
    const currentQuantity = this.cartService.getProductQuantity(productId);
    this.updateQuantity(productId, currentQuantity + 1);
  }

  decreaseQuantity(productId: number): void {
    const currentQuantity = this.cartService.getProductQuantity(productId);
    if (currentQuantity > 1) {
      this.updateQuantity(productId, currentQuantity - 1);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    if (this.isEmpty()) return;

    const isAuthenticated = this.authService.isAuthenticated();

    if (!isAuthenticated) {
      this.dialog.open(LoginRequiredDialogComponent);
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    }).format(price);
  }

  getMaxQuantity(): number {
    return 99;
  }

  onQuantityInputChange(productId: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const newQuantity = parseInt(target.value, 10);
    
    if (isNaN(newQuantity) || newQuantity < 1) {
      target.value = '1';
      this.updateQuantity(productId, 1);
    } else if (newQuantity > this.getMaxQuantity()) {
      target.value = this.getMaxQuantity().toString();
      this.updateQuantity(productId, this.getMaxQuantity());
    } else {
      this.updateQuantity(productId, newQuantity);
    }
  }

  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  trackByProductId(index: number, item: CartItem): number {
    return item.productId;
  }
}