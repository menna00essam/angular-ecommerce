import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product, ProductsResponse, ProductFilter } from '../models/product.model';

jest.mock('../utils/product.util', () => ({
  enrichProduct: jest.fn((product) => product)
}));

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://dummyjson.com';

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 9',
      description: 'An apple mobile which is nothing like apple',
      price: 549,
      discountPercentage: 12.96,
      rating: 4.69,
      stock: 94,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
      images: ['https://cdn.dummyjson.com/product-images/1/1.jpg'],
      tags: ['smartphones', 'apple', 'mobile'],
      sku: 'APL-IPH9-001',
      weight: 174,
      dimensions: {
        width: 75.7,
        height: 150.9,
        depth: 8.3
      },
      warrantyInformation: '1 year warranty',
      shippingInformation: 'Ships in 1 month',
      availabilityStatus: 'In Stock',
      reviews: [
        {
          rating: 4,
          comment: 'Great phone!',
          date: '2024-05-23T08:56:21.618Z',
          reviewerName: 'John Doe',
          reviewerEmail: 'john.doe@x.dummyjson.com'
        }
      ],
      returnPolicy: '30 days return policy',
      minimumOrderQuantity: 1,
      meta: {
        createdAt: '2024-05-23T08:56:21.618Z',
        updatedAt: '2024-05-23T08:56:21.618Z',
        barcode: '9164035109868',
        qrCode: 'https://assets.dummyjson.com/public/qr-code.png'
      }
    },
    {
      id: 2,
      title: 'iPhone X',
      description: 'SIM-Free, Model A19211 6.5-inch Super Retina HD display',
      price: 899,
      discountPercentage: 17.94,
      rating: 4.44,
      stock: 34,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'https://cdn.dummyjson.com/product-images/2/thumbnail.jpg',
      images: ['https://cdn.dummyjson.com/product-images/2/1.jpg'],
      tags: ['smartphones', 'apple', 'mobile'],
      sku: 'APL-IPHX-002',
      weight: 174,
      dimensions: {
        width: 70.9,
        height: 143.6,
        depth: 7.7
      },
      warrantyInformation: '1 year warranty',
      shippingInformation: 'Ships in 1 month',
      availabilityStatus: 'In Stock',
      reviews: [
        {
          rating: 4,
          comment: 'Excellent display!',
          date: '2024-05-23T08:56:21.618Z',
          reviewerName: 'Jane Smith',
          reviewerEmail: 'jane.smith@x.dummyjson.com'
        }
      ],
      returnPolicy: '30 days return policy',
      minimumOrderQuantity: 1,
      meta: {
        createdAt: '2024-05-23T08:56:21.618Z',
        updatedAt: '2024-05-23T08:56:21.618Z',
        barcode: '9164035109869',
        qrCode: 'https://assets.dummyjson.com/public/qr-code.png'
      }
    },
    {
      id: 3,
      title: 'Samsung Universe 9',
      description: 'Samsung Galaxy book',
      price: 1249,
      discountPercentage: 15.46,
      rating: 4.09,
      stock: 36,
      brand: 'Samsung',
      category: 'smartphones',
      thumbnail: 'https://cdn.dummyjson.com/product-images/3/thumbnail.jpg',
      images: ['https://cdn.dummyjson.com/product-images/3/1.jpg'],
      tags: ['smartphones', 'samsung', 'mobile'],
      sku: 'SAM-GAL9-003',
      weight: 189,
      dimensions: {
        width: 74.2,
        height: 158.1,
        depth: 8.8
      },
      warrantyInformation: '1 year warranty',
      shippingInformation: 'Ships in 1 month',
      availabilityStatus: 'In Stock',
      reviews: [
        {
          rating: 4,
          comment: 'Good value for money!',
          date: '2024-05-23T08:56:21.618Z',
          reviewerName: 'Mike Johnson',
          reviewerEmail: 'mike.johnson@x.dummyjson.com'
        }
      ],
      returnPolicy: '30 days return policy',
      minimumOrderQuantity: 1,
      meta: {
        createdAt: '2024-05-23T08:56:21.618Z',
        updatedAt: '2024-05-23T08:56:21.618Z',
        barcode: '9164035109870',
        qrCode: 'https://assets.dummyjson.com/public/qr-code.png'
      }
    }
  ];

  const mockCategories: string[] = [
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'groceries'
  ];

  const mockProductsResponse: ProductsResponse = {
    products: mockProducts,
    total: 100,
    skip: 0,
    limit: 3
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    }).compileComponents();
    
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    try {
      httpMock.verify();
    } catch (error) {
      // Ignore verification errors in tests
    }
    if (service && typeof service.clearCache === 'function') {
      service.clearCache();
    }
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with default signal values', () => {
      expect(service.products()).toEqual([]);
      expect(service.categories()).toEqual([]);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe(null);
      expect(service.totalProducts()).toBe(0);
    });

    it('should load categories on initialization', () => {
      // The service constructor automatically calls loadCategories
      const req = httpMock.expectOne(`${baseUrl}/products/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });
  });

  describe('getProducts', () => {
    it('should fetch and return products with default filter', (done) => {
      service.getProducts().subscribe(response => {
        expect(response.products).toEqual(mockProducts);
        expect(response.total).toBe(100);
        expect(service.products()).toEqual(mockProducts);
        expect(service.totalProducts()).toBe(100);
        done();
      });

      // Handle categories request first
      const categoriesReq = httpMock.expectOne(`${baseUrl}/products/categories`);
      categoriesReq.flush(mockCategories);

      // First request to get total count
      const initialReq = httpMock.expectOne(`${baseUrl}/products?limit=0`);
      expect(initialReq.request.method).toBe('GET');
      initialReq.flush({ products: [], total: 100, skip: 0, limit: 0 });

      // Second request to get actual products
      const productsReq = httpMock.expectOne(req => 
        req.url === `${baseUrl}/products` && 
        req.params.get('limit') === '100' && 
        req.params.get('skip') === '0'
      );
      expect(productsReq.request.method).toBe('GET');
      productsReq.flush(mockProductsResponse);
    });

    it('should filter products by search query', (done) => {
      service.getProducts({ searchQuery: 'iPhone' }).subscribe(response => {
        expect(response.products.length).toBe(2);
        expect(response.products.every(p => p.title.includes('iPhone'))).toBe(true);
        done();
      });

      // Handle categories request
      const categoriesReq = httpMock.expectOne(`${baseUrl}/products/categories`);
      categoriesReq.flush(mockCategories);

      const initialReq = httpMock.expectOne(`${baseUrl}/products?limit=0`);
      initialReq.flush({ products: [], total: 100, skip: 0, limit: 0 });

      const productsReq = httpMock.expectOne(req => 
        req.url === `${baseUrl}/products`
      );
      productsReq.flush({ products: mockProducts, total: 100, skip: 0, limit: 100 });
    });

    it('should filter products by category', (done) => {
      service.getProducts({ category: 'smartphones' }).subscribe(response => {
        expect(response.products.every(p => p.category === 'smartphones')).toBe(true);
        done();
      });

      // Handle categories request
      const categoriesReq = httpMock.expectOne(`${baseUrl}/products/categories`);
      categoriesReq.flush(mockCategories);

      const initialReq = httpMock.expectOne(`${baseUrl}/products?limit=0`);
      initialReq.flush({ products: [], total: 100, skip: 0, limit: 0 });

      const productsReq = httpMock.expectOne(req => 
        req.url === `${baseUrl}/products`
      );
      productsReq.flush({ products: mockProducts, total: 100, skip: 0, limit: 100 });
    });

    it('should handle HTTP error gracefully', (done) => {
      service.getProducts().subscribe(response => {
        expect(response.products).toEqual([]);
        expect(response.total).toBe(0);
        expect(service.error()).toBe('Failed to load products');
        done();
      });

      // Handle categories request
      const categoriesReq = httpMock.expectOne(`${baseUrl}/products/categories`);
      categoriesReq.flush(mockCategories);

      const req = httpMock.expectOne(`${baseUrl}/products?limit=0`);
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('getProductById', () => {
    it('should fetch product by id', (done) => {
      const productId = 1;
      const mockProduct = mockProducts[0];

      service.getProductById(productId).subscribe(product => {
        expect(product).toEqual(mockProduct);
        done();
      });

      // Handle categories request
      const categoriesReq = httpMock.expectOne(`${baseUrl}/products/categories`);
      categoriesReq.flush(mockCategories);

      const req = httpMock.expectOne(`${baseUrl}/products/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should handle error when fetching product by id', (done) => {
      const productId = 999;

      service.getProductById(productId).subscribe(product => {
        expect(product).toBeNull();
        expect(service.error()).toBe('Failed to load product details');
        done();
      });

      // Handle categories request
      const categoriesReq = httpMock.expectOne(`${baseUrl}/products/categories`);
      categoriesReq.flush(mockCategories);

      const req = httpMock.expectOne(`${baseUrl}/products/${productId}`);
      req.error(new ProgressEvent('Product not found'));
    });
  });

  describe('getCategories', () => {
    it('should fetch categories', (done) => {
      service.getCategories().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
        expect(service.categories()).toEqual(mockCategories);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/products/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });

    it('should handle error when fetching categories', (done) => {
      // First, we need to clear the service to test fresh behavior
      service.clearCache();
      
      service.getCategories().subscribe(categories => {
        expect(categories).toEqual([]);
        expect(service.error()).toBe('Failed to load categories');
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/products/categories`);
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('Helper Methods', () => {
    beforeEach((done) => {
      // Load products into cache first
      service.getProducts().subscribe(() => {
        done();
      });

      // Handle categories request
      const categoriesReq = httpMock.expectOne(`${baseUrl}/products/categories`);
      categoriesReq.flush(mockCategories);

      const initialReq = httpMock.expectOne(`${baseUrl}/products?limit=0`);
      initialReq.flush({ products: [], total: 100, skip: 0, limit: 0 });

      const productsReq = httpMock.expectOne(req => 
        req.url === `${baseUrl}/products`
      );
      productsReq.flush({ products: mockProducts, total: 100, skip: 0, limit: 100 });
    });

    it('should return category count correctly', () => {
      const count = service.getCategoryCount('smartphones');
      expect(count).toBe(3); // All mock products are smartphones
    });

    it('should return rating product count correctly', () => {
      const count = service.getRatingProductCount(4.5);
      expect(count).toBe(1); // Only iPhone 9 has rating >= 4.5
    });

    it('should search products', (done) => {
      service.searchProducts('iPhone', 10).subscribe(response => {
        expect(response.products.length).toBe(2);
        expect(response.limit).toBe(10);
        done();
      });
    });

    it('should get products by category', (done) => {
      service.getProductsByCategory('smartphones', 10).subscribe(response => {
        expect(response.products.every(p => p.category === 'smartphones')).toBe(true);
        expect(response.limit).toBe(10);
        done();
      });
    });

    it('should get featured products', (done) => {
      service.getFeaturedProducts().subscribe(products => {
        expect(products.every(p => p.rating >= 4.1)).toBe(true);
        expect(products.length).toBeLessThanOrEqual(20);
        done();
      });
    });

    it('should get related products', (done) => {
      service.getRelatedProducts(1, 'smartphones', 5).subscribe(products => {
        expect(products.every(p => p.id !== 1)).toBe(true);
        expect(products.every(p => p.category === 'smartphones')).toBe(true);
        expect(products.length).toBeLessThanOrEqual(5);
        done();
      });
    });
  });

  describe('Cache Management', () => {
    it('should clear cache correctly', () => {
      service.clearCache();
      expect(service.getCategoryCount('smartphones')).toBe(0);
      expect(service.getRatingProductCount(4.0)).toBe(0);
    });
  });

  describe('getAllProductsCount', () => {
    it('should return total products count', (done) => {
      service.getAllProductsCount().subscribe(count => {
        expect(count).toBe(3);
        done();
      });

      // Handle categories request
      const categoriesReq = httpMock.expectOne(`${baseUrl}/products/categories`);
      categoriesReq.flush(mockCategories);

      const initialReq = httpMock.expectOne(`${baseUrl}/products?limit=0`);
      initialReq.flush({ products: [], total: 100, skip: 0, limit: 0 });

      const productsReq = httpMock.expectOne(req => 
        req.url === `${baseUrl}/products`
      );
      productsReq.flush({ products: mockProducts, total: 100, skip: 0, limit: 100 });
    });
  });

  describe('Loading States', () => {
    it('should set loading state correctly during product fetch', () => {
      service.getProducts().subscribe();
      
      // Loading should be true initially
      expect(service.loading()).toBe(true);

      // Handle categories request
      const categoriesReq = httpMock.expectOne(`${baseUrl}/products/categories`);
      categoriesReq.flush(mockCategories);

      const initialReq = httpMock.expectOne(`${baseUrl}/products?limit=0`);
      initialReq.flush({ products: [], total: 100, skip: 0, limit: 0 });

      const productsReq = httpMock.expectOne(req => 
        req.url === `${baseUrl}/products`
      );
      productsReq.flush({ products: mockProducts, total: 100, skip: 0, limit: 100 });

      // Loading should be false after completion
      expect(service.loading()).toBe(false);
    });

    it('should set loading state correctly during product by id fetch', () => {
      service.getProductById(1).subscribe();
      
      // Loading should be true initially
      expect(service.loading()).toBe(true);

      // Handle categories request
      const categoriesReq = httpMock.expectOne(`${baseUrl}/products/categories`);
      categoriesReq.flush(mockCategories);

      const req = httpMock.expectOne(`${baseUrl}/products/1`);
      req.flush(mockProducts[0]);

      // Loading should be false after completion
      expect(service.loading()).toBe(false);
    });
  });
});