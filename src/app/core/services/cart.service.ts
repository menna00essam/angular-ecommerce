import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap, catchError, of } from 'rxjs';
import { 
  Cart, 
  CartResponse, 
  AddCartRequest, 
  UpdateCartRequest, 
  CartItem 
} from '../models/cart.model';
import { saveToStorage, loadFromStorage } from '../utils/storage.util';



@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseUrl = 'https://dummyjson.com';
  
  
  private cartItems = signal<CartItem[]>([]);
  private cartLoading = signal<boolean>(false);
  private cartError = signal<string | null>(null);


  public readonly items = this.cartItems.asReadonly();
  public readonly loading = this.cartLoading.asReadonly();
  public readonly error = this.cartError.asReadonly();
  
  public readonly totalItems = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  public readonly totalPrice = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.total, 0)
  );
  
  public readonly isEmpty = computed(() => this.cartItems().length === 0);

 
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

 
  getAllCarts(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.baseUrl}/carts`);
  }

 
  getCartById(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/carts/${id}`);
  }

 
  getCartsByUser(userId: number): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.baseUrl}/carts/user/${userId}`);
  }

 
  addCart(cartData: AddCartRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/carts/add`, cartData);
  }

 
  updateCart(cartId: number, updateData: UpdateCartRequest): Observable<Cart> {
    return this.http.put<Cart>(`${this.baseUrl}/carts/${cartId}`, updateData);
  }

 
  deleteCart(cartId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/carts/${cartId}`);
  }

 
  addToCart(product: {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
  }, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.productId === product.id);

    if (existingItemIndex > -1) {
 
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        total: (updatedItems[existingItemIndex].quantity + quantity) * product.price
      };
      this.cartItems.set(updatedItems);
    } else {
 
      const newItem: CartItem = {
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity,
        thumbnail: product.thumbnail,
        total: product.price * quantity
      };
      this.cartItems.set([...currentItems, newItem]);
    }

    this.updateCartSubject();
    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    const updatedItems = this.cartItems().filter(item => item.productId !== productId);
    this.cartItems.set(updatedItems);
    this.updateCartSubject();
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const updatedItems = currentItems.map(item => 
      item.productId === productId 
        ? { ...item, quantity, total: item.price * quantity }
        : item
    );
    
    this.cartItems.set(updatedItems);
    this.updateCartSubject();
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.updateCartSubject();
    this.saveCartToStorage();
  }

 
  isInCart(productId: number): boolean {
    return this.cartItems().some(item => item.productId === productId);
  }

 
  getProductQuantity(productId: number): number {
    const item = this.cartItems().find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }

 
  setLoading(loading: boolean): void {
    this.cartLoading.set(loading);
  }

 
  setError(error: string | null): void {
    this.cartError.set(error);
  }

 
  private updateCartSubject(): void {
    this.cartSubject.next(this.cartItems());
  }

private saveCartToStorage(): void {
  saveToStorage('cart', this.cartItems());
}

private loadCartFromStorage(): void {
  const cartData = loadFromStorage<CartItem[]>('cart');
  if (cartData) {
    this.cartItems.set(cartData);
    this.updateCartSubject();
  } else {
    this.cartItems.set([]);
  }
}


 
  syncCartWithServer(userId: number): Observable<Cart> {
    const localItems = this.cartItems();
    
    if (localItems.length === 0) {
      return of({} as Cart);
    }

    const cartData: AddCartRequest = {
      userId,
      products: localItems.map(item => ({
        id: item.productId,
        quantity: item.quantity
      }))
    };

    this.setLoading(true);
    
    return this.addCart(cartData).pipe(
      tap(cart => {
        this.setLoading(false);
        this.setError(null);
      }),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to sync cart with server');
        console.error('Cart sync error:', error);
        return of({} as Cart);
      })
    );
  }
}