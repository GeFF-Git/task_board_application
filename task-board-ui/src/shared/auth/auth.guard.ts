import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../../features/auth/auth.store';
import { APP_CONFIG } from '../config/app.config.token';

export const authGuard: CanActivateFn = () => {
  const config = inject(APP_CONFIG);
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!config.auth.enabled) {
    return true;
  }

  if (authStore.isAuthenticated()) {
    return true;
  }

  return router.navigate(['/login']);
};
