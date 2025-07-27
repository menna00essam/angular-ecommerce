import { Routes } from '@angular/router';
 
 


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
 
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
 
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products').then(m => m.Products),
 
  },
  {
  path: 'products/:id',
  loadComponent: () => import('./features/product-details/product-details').then(m => m.ProductDetails)
},

  {
    path: 'cart', 
    loadComponent: () => import('./features/cart/cart').then(m => m.Cart),
 
  },
 {
  path: '**',
  loadComponent: () => import('./shared/components/error/not-found/not-found').then(m => m.NotFound)
}

];