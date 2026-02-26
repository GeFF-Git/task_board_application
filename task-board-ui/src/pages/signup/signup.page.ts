import { Component } from '@angular/core';
import { SignupFormComponent } from '@features/auth/signup-form/signup-form.component';
import { ThemeToggleComponent } from '@features/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [SignupFormComponent, ThemeToggleComponent],
  template: `
    <div class="signup-page">
      <div class="signup-theme-toggle"><app-theme-toggle /></div>
      <div class="signup-card">
        <div class="signup-logo">
          <div class="logo-icon">R</div>
          <h1 class="logo-text">Relate<em>wise</em></h1>
          <p class="logo-sub">Task Board</p>
        </div>
        <h2 class="signup-title">Create an Account</h2>
        <p class="signup-subtitle">Sign up to get started</p>
        <app-signup-form />
      </div>
      <div class="signup-bg-decor">
        <div class="decor-circle circle-1"></div>
        <div class="decor-circle circle-2"></div>
        <div class="decor-circle circle-3"></div>
      </div>
    </div>
  `,
  styles: [`
    .signup-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--signup-bg, #0a0a0b); position: relative; overflow: hidden; }
    .signup-theme-toggle { position: absolute; top: 16px; right: 16px; z-index: 10; }
    .signup-card { width: 100%; max-width: 420px; padding: 40px; background: var(--card-bg, rgba(24, 24, 27, 0.8)); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--border, rgba(255,255,255,0.08)); border-radius: 20px; position: relative; z-index: 5; }
    .signup-logo { display: flex; flex-direction: column; align-items: center; margin-bottom: 32px; }
    .logo-icon { width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, #7c3aed, #ec4899); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 26px; color: #fff; margin-bottom: 12px; }
    .logo-text { font-size: 22px; font-weight: 700; color: var(--text-primary, #fff); margin: 0; }
    .logo-text em { font-style: italic; color: #7c3aed; }
    .logo-sub { font-size: 12px; color: var(--text-muted, rgba(255,255,255,0.4)); margin: 2px 0 0; }
    .signup-title { font-size: 22px; font-weight: 700; color: var(--text-primary, #fff); margin: 0 0 6px; text-align: center; }
    .signup-subtitle { font-size: 13px; color: var(--text-muted, rgba(255,255,255,0.45)); text-align: center; margin: 0 0 28px; }
    .signup-bg-decor { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
    .decor-circle { position: absolute; border-radius: 50%; filter: blur(80px); }
    .circle-1 { width: 400px; height: 400px; background: rgba(124, 58, 237, 0.15); top: -100px; right: -100px; }
    .circle-2 { width: 300px; height: 300px; background: rgba(236, 72, 153, 0.1); bottom: -80px; left: -80px; }
    .circle-3 { width: 200px; height: 200px; background: rgba(6, 182, 212, 0.1); top: 50%; left: 50%; transform: translate(-50%, -50%); }
    :host-context(.light) .signup-page { --signup-bg: #f0f0f2; --card-bg: rgba(255,255,255,0.85); --border: rgba(0,0,0,0.1); --text-primary: #18181b; --text-muted: rgba(0,0,0,0.4); }
  `]
})
export default class SignupPage {}
