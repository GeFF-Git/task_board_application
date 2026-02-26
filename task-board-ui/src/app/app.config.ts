import { 
  ApplicationConfig, 
  provideZonelessChangeDetection, 
  ErrorHandler,
  APP_INITIALIZER
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { csrfInterceptor } from '@shared/auth/csrf.interceptor';
import { authInterceptor } from '@shared/auth/auth.interceptor';
import { errorInterceptor } from '@shared/api/error.interceptor';
import { GlobalErrorHandler } from '@shared/api/global-error-handler';
import { AuthStore } from '@features/auth/auth.store';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ENVIRONMENT } from '@shared/config/environment.token';
import { environment } from '../environments/environment';

export function initializeCsrf(authStore: AuthStore) {
  return () => authStore.initializeCsrf();
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ENVIRONMENT, useValue: environment },
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(
      withFetch(),
      withInterceptors([csrfInterceptor, authInterceptor, errorInterceptor])
    ),
    provideAnimations(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCsrf,
      deps: [AuthStore],
      multi: true
    },
    // Required to inject MatSnackBar in ErrorInterceptor/ErrorHandler
    MatSnackBarModule,
  ],
};
