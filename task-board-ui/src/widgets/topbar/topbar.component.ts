import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ThemeToggleComponent } from '@features/theme-toggle/theme-toggle.component';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { TaskCreateDialogComponent } from '@features/task-create/task-create-dialog.component';
import { AuthStore } from '@features/auth/auth.store';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, ThemeToggleComponent, AvatarComponent],
  template: `
    <header class="topbar">
      <!-- <div class="topbar-left">
        <button mat-icon-button class="back-btn"><mat-icon>arrow_back</mat-icon></button>
        <nav class="breadcrumb">
          <span class="breadcrumb-icon"><mat-icon>folder</mat-icon></span>
          <span class="breadcrumb-item">Tasks</span>
          <mat-icon class="breadcrumb-sep">chevron_right</mat-icon>
          <span class="breadcrumb-icon"><mat-icon>folder</mat-icon></span>
          <span class="breadcrumb-item active">Tasks report</span>
        </nav>
      </div> -->
      <div class="topbar-center">
        <div class="search-container">
          <mat-icon class="search-icon">search</mat-icon>
          <input type="text" class="search-input" placeholder="Search" />
          <span class="search-shortcut">⌘K</span>
        </div>
      </div>
      <div class="topbar-right">
        <!-- <button mat-button class="topbar-action"><mat-icon>grid_view</mat-icon> Manage</button>
        <button mat-button class="topbar-action"><mat-icon>share</mat-icon> Share</button> -->
        <button mat-flat-button color="warn" class="logout-btn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
        <!-- <div class="team-avatars">
          <app-avatar name="Kamil Bachanek" size="sm" />
          <app-avatar name="Sarah Chen" size="sm" />
          <app-avatar name="Alex Rivera" size="sm" />
          <span class="avatar-overflow">+2</span>
        </div> -->
        <app-theme-toggle />
      </div>
    </header>
  `,
  styles: [`
    .topbar { height: 56px; display: flex; align-items: center; padding: 0 20px; background: var(--topbar-bg, #0f0f10); border-bottom: 1px solid var(--border, rgba(255,255,255,0.06)); gap: 16px; flex-shrink: 0; }
    .topbar-left { display: flex; align-items: center; gap: 8px; }
    .back-btn { color: var(--text-muted, rgba(255,255,255,0.4)) !important; width: 32px !important; height: 32px !important; padding: 0 !important; --mdc-icon-button-state-layer-size: 32px !important; border-radius: 8px; }
    .back-btn:hover { color: var(--text-primary, #fff) !important; }
    .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-muted, rgba(255,255,255,0.5)); }
    .breadcrumb-icon mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .breadcrumb-item.active { color: var(--text-primary, #fff); font-weight: 500; }
    .breadcrumb-sep { font-size: 16px !important; width: 16px !important; height: 16px !important; opacity: 0.4; }
    .topbar-center { flex: 1; max-width: 320px; }
    .search-container { display: flex; align-items: center; gap: 8px; background: var(--search-bg, rgba(255,255,255,0.06)); border: 1px solid var(--border, rgba(255,255,255,0.08)); border-radius: 8px; padding: 6px 12px; transition: border-color 0.2s; }
    .search-container:focus-within { border-color: rgba(124, 58, 237, 0.4); }
    .search-icon { font-size: 18px; width: 18px; height: 18px; color: var(--text-muted, rgba(255,255,255,0.4)); }
    .search-input { background: none; border: none; outline: none; color: var(--text-primary, #fff); font-size: 13px; flex: 1; }
    .search-input::placeholder { color: var(--text-muted, rgba(255,255,255,0.35)); }
    .search-shortcut { font-size: 11px; color: var(--text-muted, rgba(255,255,255,0.3)); background: var(--chip-bg, rgba(255,255,255,0.08)); padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    .topbar-right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
    .topbar-action { color: var(--text-secondary, rgba(255,255,255,0.7)) !important; font-size: 13px; transition: background-color 0.15s, color 0.15s; }
    .topbar-action:hover { background-color: rgba(255,255,255,0.08) !important; color: var(--text-primary, #fff) !important; }
    .topbar-action mat-icon { font-size: 18px; width: 18px; height: 18px; margin-right: 4px; }
    .create-task-btn { border-radius: 8px !important; font-weight: 600; font-size: 13px; }
    .team-avatars { display: flex; align-items: center; margin-left: 8px; }
    .team-avatars app-avatar + app-avatar, .team-avatars .avatar-overflow { margin-left: -6px; }
    .avatar-overflow { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 9999px; background: var(--chip-bg, rgba(255,255,255,0.1)); font-size: 10px; font-weight: 600; color: var(--text-secondary, rgba(255,255,255,0.7)); border: 2px solid var(--topbar-bg, #0f0f10); }
    :host-context(.light) .topbar { --topbar-bg: #fafafa; --border: rgba(0,0,0,0.08); --text-primary: #18181b; --text-secondary: rgba(0,0,0,0.6); --text-muted: rgba(0,0,0,0.35); --search-bg: rgba(0,0,0,0.04); --chip-bg: rgba(0,0,0,0.06); }
    :host-context(.light) .back-btn:hover { background-color: rgba(0,0,0,0.06) !important; color: #18181b !important; }
    :host-context(.light) .topbar-action:hover { background-color: rgba(0,0,0,0.06) !important; color: #18181b !important; }
  `]
})
export class TopbarComponent {
  private readonly authStore = inject(AuthStore);
  logout(): void {
    this.authStore.logout();
  }
}
