import { Component, input, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type PriorityLevel = 'urgent' | 'normal' | 'low';

@Component({
  selector: 'app-priority-chip',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <span class="priority-chip" [class]="priority()">
      <mat-icon class="priority-icon">flag</mat-icon>
      <span class="priority-label">{{ label() }}</span>
    </span>
  `,
  styles: [`
    .priority-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .priority-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    .urgent {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }
    .normal {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }
    .low {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }
  `]
})
export class PriorityChipComponent {
  readonly priority = input<PriorityLevel>('normal');
  readonly label = computed(() => {
    const p = this.priority();
    return p.charAt(0).toUpperCase() + p.slice(1);
  });
}
