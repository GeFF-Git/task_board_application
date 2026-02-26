import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="dashboard-page">
      <div class="dashboard-welcome">
        <h1>Welcome to <span class="brand">Relate<em>wise</em></span></h1>
        <p>Your workspace dashboard. Navigate to the task board to manage your projects.</p>
        <a routerLink="/task-board" class="go-to-board">
          <mat-icon>assignment</mat-icon>
          Go to Task Board
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 56px);
      padding: 40px;
    }
    .dashboard-welcome {
      text-align: center;
    }
    .dashboard-welcome h1 {
      font-size: 32px;
      font-weight: 700;
      color: var(--text-primary, #fff);
      margin-bottom: 12px;
    }
    .brand em {
      font-style: italic;
      color: #7c3aed;
    }
    .dashboard-welcome p {
      font-size: 15px;
      color: var(--text-muted, rgba(255,255,255,0.5));
      margin-bottom: 28px;
    }
    .go-to-board {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: #7c3aed;
      color: #fff;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: background 0.2s;
    }
    .go-to-board:hover {
      background: #6d28d9;
    }
    :host-context(.light) .dashboard-welcome h1 { color: #18181b; }
    :host-context(.light) .dashboard-welcome p { color: rgba(0,0,0,0.5); }
  `]
})
export default class DashboardPage {}
