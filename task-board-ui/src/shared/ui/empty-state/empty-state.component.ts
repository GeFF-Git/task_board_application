import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon class="empty-icon">{{ icon() }}</mat-icon>
      <h3 class="empty-title">{{ title() }}</h3>
      <p class="empty-desc">{{ description() }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;
      opacity: 0.6;
    }
    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: rgba(255,255,255,0.3);
    }
    .empty-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px;
      color: rgba(255,255,255,0.7);
    }
    .empty-desc {
      font-size: 13px;
      color: rgba(255,255,255,0.4);
      margin: 0;
    }
    :host-context(.light) .empty-icon { color: rgba(0,0,0,0.2); }
    :host-context(.light) .empty-title { color: rgba(0,0,0,0.5); }
    :host-context(.light) .empty-desc { color: rgba(0,0,0,0.35); }
  `]
})
export class EmptyStateComponent {
  readonly icon = input<string>('inbox');
  readonly title = input<string>('No items');
  readonly description = input<string>('Nothing to show here yet.');
}
