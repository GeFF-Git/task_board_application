import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthUser } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // State
  private readonly _currentUser = signal<AuthUser | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _csrfInitialized = signal(false);

  // Public projections
  readonly currentUser = this._currentUser.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  // Initialize CSRF token and attempt session rehydration on app startup
  async initializeSession(): Promise<void> {
    try {
      await firstValueFrom(this.authService.getCsrfToken());
      this._csrfInitialized.set(true);
      
      // Attempt to rehydrate session from cookie
      const user = await firstValueFrom(this.authService.getCurrentUser());
      this._currentUser.set(user);
    } catch {
      // It's normal for this to fail if the user is not logged in
      console.log('No active session found during initialization.');
    }
  }

  // Backwards compatibility for app.config.ts if it specifically calls initializeCsrf
  async initializeCsrf(): Promise<void> {
    return this.initializeSession();
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const user = await firstValueFrom(
        this.authService.login({ email, password, rememberMe })
      );
      this._currentUser.set(user);
      // Re-fetch CSRF token after login (new session)
      await firstValueFrom(this.authService.getCsrfToken());
      this.router.navigate(['/task-board']);
    } catch (err: any) {
      this._error.set(err?.error?.message ?? 'Invalid credentials');
    } finally {
      this._loading.set(false);
    }
  }

  async register(fullName: string, email: string, password: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const user = await firstValueFrom(
        this.authService.register({ fullName, email, password, confirmPassword: password })
      );
      this._currentUser.set(user);
      await firstValueFrom(this.authService.getCsrfToken());
      this.router.navigate(['/task-board']);   // Auto-login after signup
    } catch (err: any) {
      this._error.set(err?.error?.message ?? 'Registration failed');
    } finally {
      this._loading.set(false);
    }
  }

  async logout(): Promise<void> {
    this._loading.set(true);
    try {
      await firstValueFrom(this.authService.logout());
    } finally {
      this.clearSession();
      this._loading.set(false);
      this.router.navigate(['/login']);
    }
  }

  clearSession(): void {
    this._currentUser.set(null);
  }
}
