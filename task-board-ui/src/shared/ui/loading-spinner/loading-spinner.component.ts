import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    @if (skeleton()) {
      <div class="skeleton-container">
        @for (i of skeletonLines; track i) {
          <div class="skeleton-line" [style.width]="randomWidth(i)"></div>
        }
      </div>
    } @else {
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
    }
  `,
  styles: [`
    .spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(124, 58, 237, 0.2);
      border-top-color: #7c3aed;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .skeleton-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }
    .skeleton-line {
      height: 14px;
      background: linear-gradient(90deg,
        rgba(255,255,255,0.06) 25%,
        rgba(255,255,255,0.1) 50%,
        rgba(255,255,255,0.06) 75%
      );
      background-size: 200% 100%;
      border-radius: 6px;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    :host-context(.light) .skeleton-line {
      background: linear-gradient(90deg,
        rgba(0,0,0,0.06) 25%,
        rgba(0,0,0,0.1) 50%,
        rgba(0,0,0,0.06) 75%
      );
      background-size: 200% 100%;
    }
  `]
})
export class LoadingSpinnerComponent {
  readonly skeleton = input<boolean>(false);
  readonly lines = input<number>(3);

  readonly skeletonLines = Array.from({ length: 3 }, (_, i) => i);

  randomWidth(i: number): string {
    const widths = ['100%', '80%', '60%', '90%', '70%'];
    return widths[i % widths.length];
  }
}
