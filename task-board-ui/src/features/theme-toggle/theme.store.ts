import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { APP_CONFIG } from '@shared/config/app.config.token';

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly config = inject(APP_CONFIG);
  private readonly _theme = signal<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') ?? this.config.theme.default
  );

  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    effect(() => {
      const t = this._theme();
      document.documentElement.classList.toggle('dark', t === 'dark');
      document.documentElement.classList.toggle('light', t === 'light');
      localStorage.setItem('theme', t);
    });
  }

  toggle(): void {
    this._theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }
}
