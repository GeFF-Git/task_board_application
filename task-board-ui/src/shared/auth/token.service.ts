import { Injectable, inject, signal, computed } from '@angular/core';
import { APP_CONFIG } from '../config/app.config.token';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly config = inject(APP_CONFIG);

  private readonly _token = signal<string | null>(
    localStorage.getItem(this.config.auth.tokenKey)
  );
  private readonly _refreshToken = signal<string | null>(
    localStorage.getItem(this.config.auth.refreshTokenKey)
  );

  readonly token = this._token.asReadonly();
  readonly refreshToken = this._refreshToken.asReadonly();

  readonly isAuthenticated = computed(() => {
    const token = this._token();
    if (!token) return false;
    return !this.isExpired(token);
  });

  setTokens(token: string, refreshToken: string): void {
    this._token.set(token);
    this._refreshToken.set(refreshToken);
    localStorage.setItem(this.config.auth.tokenKey, token);
    localStorage.setItem(this.config.auth.refreshTokenKey, refreshToken);
  }

  clearTokens(): void {
    this._token.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem(this.config.auth.tokenKey);
    localStorage.removeItem(this.config.auth.refreshTokenKey);
  }

  private isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
