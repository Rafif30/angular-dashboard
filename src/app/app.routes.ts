import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.HomeComponent)
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/products/product-list.component').then(m => m.ProductListComponent)
          },
          {
            path: 'add',
            loadComponent: () =>
              import('./features/products/product-form.component').then(m => m.ProductFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/products/product-form.component').then(m => m.ProductFormComponent)
          },
          {
            path: 'detail/:id',
            loadComponent: () =>
              import('./features/products/product-detail.component').then(m => m.ProductDetailComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard/home'
  }
];