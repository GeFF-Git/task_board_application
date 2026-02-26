import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeStore } from './theme.store';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <button
      mat-icon-button
      (click)="themeStore.toggle()"
      [matTooltip]="themeStore.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      class="theme-btn"
    >
      <mat-icon>{{ themeStore.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  styles: [`
    .theme-btn {
      color: var(--text-secondary, rgba(255,255,255,0.7));
      transition: color 0.2s;
    }
    .theme-btn:hover {
      color: #f59e0b;
    }
  `]
})
export class ThemeToggleComponent {
  readonly themeStore = inject(ThemeStore);
}
