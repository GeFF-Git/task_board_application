import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { BadgeComponent } from '@shared/ui/badge/badge.component';
import { TaskStore } from '@entities/task/api/task.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, AvatarComponent, BadgeComponent],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed()">

      <!-- Brand -->
      <div class="brand">
        <div class="brand-logo">
          <div class="logo-icon">R</div>
          @if (!collapsed()) {
            <div class="brand-info">
              <span class="brand-name">Relate<em>wise</em></span>
              <span class="brand-sub">microdose.studio</span>
            </div>
          }
        </div>
      </div>

      <!-- Collapse toggle — always visible, pinned below brand -->
      <button class="collapse-toggle" (click)="toggleCollapse()" aria-label="Toggle sidebar">
        <mat-icon>{{ collapsed() ? 'chevron_right' : 'keyboard_double_arrow_left' }}</mat-icon>
      </button>

      <!-- Navigation -->
      <nav class="nav-main">
        @if (!collapsed()) {
          <!-- Expanded: Tasks button with expandable sub-items -->
          <button
            class="nav-item"
            [class.active]="true"
            (click)="tasksExpanded.set(!tasksExpanded())"
          >
            <mat-icon class="nav-icon">assignment</mat-icon>
            <span class="nav-label-text">Tasks</span>
            <mat-icon class="expand-chevron" [class.rotated]="tasksExpanded()">expand_more</mat-icon>
          </button>

          @if (tasksExpanded()) {
            <div class="sub-nav">
              <a class="sub-item" routerLink="/task-board" routerLinkActive="active"
                 [queryParams]="{ filter: 'backlog' }">
                <span class="sub-dot backlog"></span>
                <span class="sub-text">Backlog</span>
                <app-badge [count]="taskStore.backlogCount()" variant="default" />
              </a>
              <a class="sub-item" routerLink="/task-board" routerLinkActive="active"
                 [queryParams]="{ filter: 'in-progress' }">
                <span class="sub-dot in-progress"></span>
                <span class="sub-text">In Progress</span>
                <app-badge [count]="taskStore.inProgressCount()" variant="default" />
              </a>
              <a class="sub-item" routerLink="/task-board" routerLinkActive="active"
                 [queryParams]="{ filter: 'validation' }">
                <span class="sub-dot validation"></span>
                <span class="sub-text">Validation</span>
                <app-badge [count]="taskStore.validationCount()" variant="default" />
              </a>
              <a class="sub-item" routerLink="/task-board" routerLinkActive="active"
                 [queryParams]="{ filter: 'done' }">
                <span class="sub-dot done"></span>
                <span class="sub-text">Done</span>
                <app-badge [count]="taskStore.doneCount()" variant="default" />
              </a>
            </div>
          }
        } @else {
          <!-- Collapsed: single icon link -->
          <a class="nav-item active" routerLink="/task-board" title="Tasks">
            <mat-icon class="nav-icon">assignment</mat-icon>
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <a class="nav-item" routerLink="/settings" routerLinkActive="active">
          <mat-icon class="nav-icon">settings</mat-icon>
          @if (!collapsed()) { <span class="nav-label-text">Settings</span> }
        </a>

        <div class="user-chip" [class.compact]="collapsed()">
          <app-avatar name="Kamil Bachanek" size="sm" />
          @if (!collapsed()) {
            <div class="user-info">
              <span class="user-name">Kamil Bachanek</span>
              <span class="user-role">Admin</span>
            </div>
            <button mat-icon-button class="user-more-btn" aria-label="User menu">
              <mat-icon>more_horiz</mat-icon>
            </button>
          }
        </div>
      </div>
    </aside>
  `,
  styles: [`
    /* ── Container ── */
    .sidebar {
      width: 240px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--sidebar-bg, #0f0f10);
      border-right: 1px solid var(--border-color, rgba(255,255,255,0.06));
      padding: 16px 10px;
      overflow-y: auto;
      overflow-x: hidden;
      transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                  padding 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
    }
    .sidebar.collapsed {
      width: 56px;
      padding: 16px 8px;
    }
    .sidebar::-webkit-scrollbar { width: 3px; }
    .sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

    /* ── Brand ── */
    .brand {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      padding: 0 4px;
      min-height: 36px;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .logo-icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 17px;
      color: #fff;
      flex-shrink: 0;
    }
    .brand-info { display: flex; flex-direction: column; min-width: 0; }
    .brand-name { font-size: 15px; font-weight: 700; color: var(--text-primary, #fff); white-space: nowrap; }
    .brand-name em { font-style: italic; color: #7c3aed; }
    .brand-sub { font-size: 10px; color: var(--text-muted, rgba(255,255,255,0.35)); white-space: nowrap; }

    /* ── Collapse toggle ── */
    .collapse-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 32px;
      border: none;
      background: transparent;
      color: var(--text-muted, rgba(255,255,255,0.35));
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 12px;
      transition: background 0.15s, color 0.15s;
    }
    .collapse-toggle:hover {
      background: var(--hover-bg, rgba(255,255,255,0.06));
      color: var(--text-primary, #fff);
    }
    .collapse-toggle mat-icon { font-size: 18px; width: 18px; height: 18px; }

    /* ── Nav items ── */
    .nav-main { flex: 1; }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 10px;
      color: var(--text-secondary, rgba(255,255,255,0.6));
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      -webkit-appearance: none;
      appearance: none;
      outline: none;
    }
    .nav-item:hover {
      background: var(--hover-bg, rgba(255,255,255,0.06));
      color: var(--text-primary, #fff);
    }
    .nav-item:hover .nav-icon {
      color: var(--text-primary, #fff);
    }
    .nav-item.active {
      background: rgba(124, 58, 237, 0.14);
      color: #a78bfa;
      font-weight: 600;
    }
    .nav-item.active .nav-icon { color: #a78bfa; }
    .nav-item:focus-visible {
      box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.4);
    }

    /* Collapsed: center the icon */
    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 9px 0;
    }

    .nav-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      color: var(--text-muted, rgba(255,255,255,0.45));
      transition: color 0.15s;
    }
    .nav-label-text { flex: 1; white-space: nowrap; }

    .expand-chevron {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      transition: transform 0.2s ease;
      color: var(--text-muted, rgba(255,255,255,0.3));
    }
    .expand-chevron.rotated { transform: rotate(180deg); }

    /* ── Sub-nav ── */
    .sub-nav { padding: 4px 0 4px 18px; }
    .sub-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 12px;
      border-radius: 8px;
      color: var(--text-secondary, rgba(255,255,255,0.55));
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .sub-item:hover {
      background: var(--hover-bg, rgba(255,255,255,0.04));
      color: var(--text-primary, #fff);
    }
    .sub-item.active {
      color: var(--text-primary, #fff);
      font-weight: 500;
    }
    .sub-text { flex: 1; }
    .sub-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .sub-dot.backlog     { background: #6b7280; }
    .sub-dot.in-progress { background: #f59e0b; }
    .sub-dot.validation  { background: #8b5cf6; }
    .sub-dot.done        { background: #10b981; }

    /* ── Footer ── */
    .sidebar-footer {
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid var(--border-color, rgba(255,255,255,0.06));
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* ── User chip ── */
    .user-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      margin-top: 4px;
      border-radius: 10px;
      background: var(--chip-bg, rgba(255,255,255,0.04));
      transition: background 0.15s;
      cursor: pointer;
    }
    .user-chip:hover { background: var(--hover-bg, rgba(255,255,255,0.07)); }
    .user-chip.compact { padding: 6px; justify-content: center; }
    .user-info { display: flex; flex-direction: column; min-width: 0; flex: 1; }
    .user-name { font-size: 12px; font-weight: 600; color: var(--text-primary, #fff); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-role { font-size: 10px; color: var(--text-muted, rgba(255,255,255,0.35)); }
    .user-more-btn { color: var(--text-muted, rgba(255,255,255,0.3)); width: 24px; height: 24px; flex-shrink: 0; }
    .user-more-btn mat-icon { font-size: 16px; width: 16px; height: 16px; }

    /* ── Light theme ── */
    :host-context(.light) .sidebar {
      --sidebar-bg: #fafafa;
      --border-color: rgba(0,0,0,0.08);
      --text-primary: #18181b;
      --text-secondary: rgba(0,0,0,0.55);
      --text-muted: rgba(0,0,0,0.35);
      --hover-bg: rgba(0,0,0,0.04);
      --chip-bg: rgba(0,0,0,0.04);
    }
    :host-context(.light) .nav-item.active {
      background: rgba(124, 58, 237, 0.1);
      color: #7c3aed;
    }
    :host-context(.light) .nav-item.active .nav-icon { color: #7c3aed; }
  `]
})
export class SidebarComponent {
  readonly taskStore = inject(TaskStore);
  readonly collapsed = signal(false);
  readonly tasksExpanded = signal(true);

  toggleCollapse(): void {
    this.collapsed.update(v => !v);
  }
}
