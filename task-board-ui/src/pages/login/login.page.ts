import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoginFormComponent } from '@features/auth/login-form/login-form.component';
import { ThemeToggleComponent } from '@features/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [MatIconModule, LoginFormComponent, ThemeToggleComponent],
  template: `
    <div class="login-page">
      <div class="login-theme-toggle"><app-theme-toggle /></div>
      <div class="login-card">
        <div class="login-logo">
          <div class="logo-icon">R</div>
          <h1 class="logo-text">Relate<em>wise</em></h1>
          <p class="logo-sub">Task Board</p>
        </div>
        <h2 class="login-title">Welcome back</h2>
        <p class="login-subtitle">Enter your credentials to access your workspace</p>
        <app-login-form />
        <p class="login-hint">Demo: use any valid email format &amp; any password</p>
      </div>
      <div class="login-bg-decor">
        <div class="decor-circle circle-1"></div>
        <div class="decor-circle circle-2"></div>
        <div class="decor-circle circle-3"></div>
      </div>
    </div>
  `,
  styles: [`
    .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--login-bg, #0a0a0b); position: relative; overflow: hidden; }
    .login-theme-toggle { position: absolute; top: 16px; right: 16px; z-index: 10; }
    .login-card { width: 100%; max-width: 420px; padding: 40px; background: var(--card-bg, rgba(24, 24, 27, 0.8)); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--border, rgba(255,255,255,0.08)); border-radius: 20px; position: relative; z-index: 5; }
    .login-logo { display: flex; flex-direction: column; align-items: center; margin-bottom: 32px; }
    .logo-icon { width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, #7c3aed, #ec4899); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 26px; color: #fff; margin-bottom: 12px; }
    .logo-text { font-size: 22px; font-weight: 700; color: var(--text-primary, #fff); margin: 0; }
    .logo-text em { font-style: italic; color: #7c3aed; }
    .logo-sub { font-size: 12px; color: var(--text-muted, rgba(255,255,255,0.4)); margin: 2px 0 0; }
    .login-title { font-size: 22px; font-weight: 700; color: var(--text-primary, #fff); margin: 0 0 6px; text-align: center; }
    .login-subtitle { font-size: 13px; color: var(--text-muted, rgba(255,255,255,0.45)); text-align: center; margin: 0 0 28px; }
    .login-hint { font-size: 11px; color: var(--text-muted, rgba(255,255,255,0.3)); text-align: center; margin-top: 20px; }
    .login-bg-decor { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
    .decor-circle { position: absolute; border-radius: 50%; filter: blur(80px); }
    .circle-1 { width: 400px; height: 400px; background: rgba(124, 58, 237, 0.15); top: -100px; right: -100px; }
    .circle-2 { width: 300px; height: 300px; background: rgba(236, 72, 153, 0.1); bottom: -80px; left: -80px; }
    .circle-3 { width: 200px; height: 200px; background: rgba(6, 182, 212, 0.1); top: 50%; left: 50%; transform: translate(-50%, -50%); }
    :host-context(.light) .login-page { --login-bg: #f0f0f2; --card-bg: rgba(255,255,255,0.85); --border: rgba(0,0,0,0.1); --text-primary: #18181b; --text-muted: rgba(0,0,0,0.4); }
  `]
})
export default class LoginPage {}
