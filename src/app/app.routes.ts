import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'transactions',
    loadComponent: () => import('./pages/transactions/transactions').then(m => m.Transactions)
  },
  {
    path: 'accounts',
    loadComponent: () => import('./pages/account/account').then(m => m.Account)
  },
  {
    path: 'plans',
    loadComponent: () => import('./pages/plans/plans').then(m => m.Plans)
  },
  {
    path: 'configuration',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];