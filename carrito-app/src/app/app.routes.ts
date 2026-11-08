import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/guards/auth.guard';
import { MainLayout } from './layout/main-layout';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'Iniciar sesión',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    // Todas las rutas internas cuelgan del layout y quedan protegidas por el guard.
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'products',
        title: 'Productos',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then(
            (m) => m.ProductList
          ),
      },
      {
        path: 'cart',
        title: 'Mi carrito',
        loadComponent: () => import('./features/cart/cart').then((m) => m.Cart),
      },
      {
        path: 'checkout',
        title: 'Confirmar compra',
        loadComponent: () =>
          import('./features/checkout/checkout').then((m) => m.Checkout),
      },
      {
        path: 'orders',
        title: 'Mis compras',
        loadComponent: () =>
          import('./features/orders/order-list/order-list').then(
            (m) => m.OrderList
          ),
      },
      {
        path: 'orders/:id',
        title: 'Detalle de compra',
        loadComponent: () =>
          import('./features/orders/order-detail/order-detail').then(
            (m) => m.OrderDetail
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'products' },
    ],
  },
  { path: '**', redirectTo: 'products' },
];
