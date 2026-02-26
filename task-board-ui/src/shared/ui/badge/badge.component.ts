import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="variantClass()">
      {{ count() }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      line-height: 1;
    }
    .default {
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.7);
    }
    .primary {
      background: #7c3aed;
      color: #fff;
    }
    .danger {
      background: #ef4444;
      color: #fff;
    }
    .success {
      background: #10b981;
      color: #fff;
    }
    :host-context(.light) .default {
      background: rgba(0,0,0,0.08);
      color: rgba(0,0,0,0.6);
    }
  `]
})
export class BadgeComponent {
  readonly count = input<number | string>(0);
  readonly variant = input<'default' | 'primary' | 'danger' | 'success'>('default');
  readonly variantClass = computed(() => this.variant());
}
