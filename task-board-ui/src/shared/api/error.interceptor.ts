import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../../features/auth/auth.store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // Session expired — show toast then redirect to login
          // We use injector to lazily get AuthStore to prevent circular deps (NG0200)
          console.log('401 error');
          const authStore = injector.get(AuthStore);
          authStore.clearSession();
          snackBar.open('Your session has expired, please login again', 'Dismiss', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
          router.navigate(['/login']);
          break;

        case 403:
          snackBar.open('You do not have permission to perform this action', 'Dismiss', {
            duration: 4000,
            panelClass: ['error-snackbar'],
          });
          break;

        case 422:
          // Validation errors — let the component handle these via the thrown error
          break;

        case 0:
          // Network error / API unreachable
          snackBar.open('Cannot reach the server. Please check your connection.', 'Dismiss', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
          break;

        default:
          if (error.status >= 500) {
            snackBar.open('Something went wrong. Please try again later.', 'Dismiss', {
              duration: 4000,
              panelClass: ['error-snackbar'],
            });
          }
      }

      return throwError(() => error);
    }),
  );
};
