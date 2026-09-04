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
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics').then(m => m.Analytics)
  },
  {
    path: 'budget',
    loadComponent: () => import('./pages/budget/budget').then(m => m.Budget)
  },

  {
    path: 'configuration',
    loadComponent: () => import('./pages/configuration/configuration').then(m => m.Configuration)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
