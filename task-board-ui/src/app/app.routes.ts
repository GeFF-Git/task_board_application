import { Routes } from '@angular/router';
import { authGuard } from '@shared/auth/auth.guard';
import { guestGuard } from '@shared/auth/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('../pages/login/login.page'),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('../pages/signup/signup.page'),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../pages/dashboard/dashboard.page'),
      },
      {
        path: 'task-board',
        loadComponent: () => import('../pages/task-board/task-board.page'),
      },
      {
        path: '',
        redirectTo: 'task-board',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'task-board',
  },
];
