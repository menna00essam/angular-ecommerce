import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { Product, Category, ProductsResponse, ProductFilter } from '../models/product.model';
import { enrichProduct } from '../utils/product.util';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = 'https://dummyjson.com';

  private _products = signal<Product[]>([]);
  private _categories = signal<Category[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _totalProducts = signal<number>(0);

  public readonly products = this._products.asReadonly();
  public readonly categories = this._categories.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly totalProducts = this._totalProducts.asReadonly();

 
  private allProductsCache: Product[] = [];
  private categoriesCache: Category[] | null = null;
  private isAllProductsLoaded = false;

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

 
  private loadAllProducts(): Observable<Product[]> {
    if (this.isAllProductsLoaded && this.allProductsCache.length > 0) {
      return of(this.allProductsCache);
    }

    this._loading.set(true);
    this._error.set(null);

 
    return this.http.get<ProductsResponse>(`${this.baseUrl}/products?limit=0`).pipe(
      switchMap(response => {
        const total = response.total;
        const requests: Observable<ProductsResponse>[] = [];
        const batchSize = 100;
        
        for (let skip = 0; skip < total; skip += batchSize) {
          const params = new HttpParams()
            .set('limit', batchSize.toString())
            .set('skip', skip.toString());
          
          requests.push(this.http.get<ProductsResponse>(`${this.baseUrl}/products`, { params }));
        }
        
        return forkJoin(requests);
      }),
 
      map((combinedResponses: ProductsResponse[]) => {
        const allProducts: Product[] = [];
        combinedResponses.forEach(response => {
          allProducts.push(...response.products.map((p: Product) => enrichProduct(p)));
        });
        
        this.allProductsCache = allProducts;
        this.isAllProductsLoaded = true;
        this._loading.set(false);
        
        return allProducts;
      }),
      catchError(err => {
        this._error.set('Failed to load products');
        this._loading.set(false);
        console.error('Error loading products:', err);
        return of([]);
      })
    );
  }

  getProducts(filter: ProductFilter = {}): Observable<ProductsResponse> {
    return this.loadAllProducts().pipe(
      map(allProducts => {
        let filteredProducts = [...allProducts];

        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
          );
        }

        if (filter.category) {
          filteredProducts = filteredProducts.filter(p => p.category === filter.category);
        }

        if (filter.minPrice !== null && filter.minPrice !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price >= filter.minPrice!);
        }

        if (filter.maxPrice !== null && filter.maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price <= filter.maxPrice!);
        }

        if (filter.minRating !== null && filter.minRating !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.rating >= filter.minRating!);
        }

 
        if (filter.sortBy) {
          filteredProducts.sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (filter.sortBy) {
              case 'price':
                aValue = a.price;
                bValue = b.price;
                break;
              case 'rating':
                aValue = a.rating;
                bValue = b.rating;
                break;
              case 'title':
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
                break;
              default:
                return 0;
            }

            if (filter.order === 'desc') {
              return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
            } else {
              return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
          });
        }

 
        const total = filteredProducts.length;
        const skip = filter.skip || 0;
        const limit = filter.limit || 12;
        const paginatedProducts = filteredProducts.slice(skip, skip + limit);

        const result: ProductsResponse = {
          products: paginatedProducts,
          total: total,
          skip: skip,
          limit: limit
        };

 
        this._products.set(paginatedProducts);
        this._totalProducts.set(total);

        return result;
      }),
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._error.set('Failed to filter products');
        this._loading.set(false);
        console.error('Error filtering products:', err);
        return of({ products: [], total: 0, skip: 0, limit: 0 });
      })
    );
  }

  getProductById(id: number): Observable<Product | null> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Product>(`${this.baseUrl}/products/${id}`).pipe(
      map(product => enrichProduct(product)),
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._error.set('Failed to load product details');
        this._loading.set(false);
        console.error('Error loading product:', err);
        return of(null);
      })
    );
  }

  getCategories(): Observable<Category[]> {
    if (this.categoriesCache) {
      this._categories.set(this.categoriesCache);
      return of(this.categoriesCache);
    }

    return this.http.get<Category[]>(`${this.baseUrl}/products/categories`).pipe(
      tap(categories => {
        this.categoriesCache = categories;
        this._categories.set(categories);
      }),
      catchError(err => {
        this._error.set('Failed to load categories');
        console.error('Error loading categories:', err);
        return of([]);
      })
    );
  }

  getCategoryCount(categorySlug: string): number {
    if (this.allProductsCache.length === 0) return 0;
    return this.allProductsCache.filter(p => p.category === categorySlug).length;
  }

  getRatingProductCount(minRating: number): number {
    if (this.allProductsCache.length === 0) return 0;
    return this.allProductsCache.filter(p => p.rating >= minRating).length;
  }

 
  searchProducts(query: string, limit: number = 12): Observable<ProductsResponse> {
    return this.getProducts({ searchQuery: query, limit });
  }

  getProductsByCategory(category: string, limit: number = 12): Observable<ProductsResponse> {
    return this.getProducts({ category, limit });
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.getProducts({ limit: 30 }).pipe(
      map(res => res.products.filter(p => p.rating >= 4.1).slice(0, 20))
    );
  }

  getRelatedProducts(productId: number, category: string, limit: number = 6): Observable<Product[]> {
    return this.getProductsByCategory(category, 20).pipe(
      map(res => res.products.filter(p => p.id !== productId).slice(0, limit))
    );
  }

  clearCache(): void {
    this.allProductsCache = [];
    this.categoriesCache = null;
    this.isAllProductsLoaded = false;
  }

  private loadCategories(): void {
    this.getCategories().subscribe();
  }

 
  getProductsPaginated(page: number, limit: number = 12): Observable<ProductsResponse> {
    const skip = (page - 1) * limit;
    return this.getProducts({ limit, skip });
  }

  filterByPriceRange(minPrice: number, maxPrice: number, limit: number = 12): Observable<ProductsResponse> {
    return this.getProducts({ minPrice, maxPrice, limit });
  }

  filterByRating(minRating: number, limit: number = 12): Observable<ProductsResponse> {
    return this.getProducts({ minRating, limit });
  }

  sortProducts(sortBy: string, order: 'asc' | 'desc' = 'asc', limit: number = 12): Observable<ProductsResponse> {
    return this.getProducts({ sortBy, order, limit });
  }

 
  getAllProductsCount(): Observable<number> {
    return this.loadAllProducts().pipe(
      map(products => products.length)
    );
  }
}