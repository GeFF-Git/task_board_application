import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from '@widgets/sidebar/sidebar.component';
import { TopbarComponent } from '@widgets/topbar/topbar.component';
import { ThemeStore } from '@features/theme-toggle/theme.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    @if (isStandaloneRoute()) {
      <router-outlet />
    } @else {
      <div class="app-shell">
        <app-sidebar />
        <div class="main-area">
          <app-topbar />
          <main class="main-content">
            <router-outlet />
          </main>
        </div>
      </div>
    }
  `,
  styles: [`
    .app-shell { display: flex; height: 100vh; overflow: hidden; }
    .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
    .main-content { flex: 1; overflow: auto; background: var(--main-bg, #0f0f10); }
    :host-context(.light) .main-content { background: #f4f4f5; }
  `]
})
export class AppComponent{
  private readonly themeStore = inject(ThemeStore);
  private readonly router = inject(Router);

  isStandaloneRoute(): boolean {
    const url = this.router.url;
    return url === '/login' || url === '/signup';
  }
}
