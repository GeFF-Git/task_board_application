import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthStore } from '../auth.store';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    RouterModule,
  ],
  template: `
    <div class="login-form-container">
      @if (authStore.error()) {
        <div class="error-banner">
          <mat-icon>error_outline</mat-icon>
          <span>{{ authStore.error() }}</span>
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <mat-icon matPrefix>email</mat-icon>
          <input matInput formControlName="email" type="email" placeholder="your@email.com" />
          @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
            <mat-error>Enter a valid email</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <mat-icon matPrefix>lock</mat-icon>
          <input matInput formControlName="password" [type]="showPassword ? 'text' : 'password'" placeholder="••••••••" />
          <button mat-icon-button matSuffix type="button" (click)="showPassword = !showPassword">
            <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
            <mat-error>Password is required</mat-error>
          }
        </mat-form-field>

        <div class="form-options">
          <mat-checkbox formControlName="remember" color="primary">Remember me</mat-checkbox>
        </div>

        <button
          mat-flat-button
          color="primary"
          type="submit"
          class="login-button"
          [disabled]="form.invalid || authStore.loading()"
        >
          @if (authStore.loading()) {
            <ng-container><mat-icon class="spin">autorenew</mat-icon> Signing in...</ng-container>
          } @else {
            Sign In
          }
        </button>

        <div class="login-footer">
          <p>Don't have an account? <a routerLink="/signup">Sign up</a></p>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login-form-container { width: 100%; }
    .full-width { width: 100%; }
    .error-banner {
      display: flex; align-items: center; gap: 8px; padding: 12px 16px;
      background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px; color: #ef4444; font-size: 13px; margin-bottom: 16px;
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .form-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .login-button { width: 100%; height: 48px; font-size: 15px; font-weight: 600; border-radius: 10px !important; margin-bottom: 16px; }
    .spin { animation: spin 0.8s linear infinite; margin-right: 8px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .login-footer { text-align: center; font-size: 13px; color: var(--text-muted, rgba(255,255,255,0.45)); }
    .login-footer a { color: #8b5cf6; text-decoration: none; font-weight: 600; }
    .login-footer a:hover { text-decoration: underline; }
  `]
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);

  showPassword = false;

  readonly form = this.fb.group({
    email: [this.authStore.currentUser()?.email ?? '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [!!this.authStore.currentUser()],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    const { email, password, remember } = this.form.getRawValue();
    await this.authStore.login(email!, password!, remember!);
  }
}
