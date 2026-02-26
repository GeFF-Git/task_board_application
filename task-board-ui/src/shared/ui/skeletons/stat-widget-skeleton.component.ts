import { Component } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';

@Component({
  selector: 'app-stat-widget-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent],
  template: `
    <div class="stat-card">
      <div class="stat-header">
        <app-skeleton-block width="120px" height="24px" margin="0 0 20px 0" />
      </div>

      <div class="stat-counts">
        <div class="stat-count-item">
          <app-skeleton-block width="32px" height="30px" margin="0 0 4px 0" />
          <app-skeleton-block width="64px" height="12px" />
        </div>
        <div class="stat-count-item">
          <app-skeleton-block width="32px" height="30px" margin="0 0 4px 0" />
          <app-skeleton-block width="64px" height="12px" />
        </div>
        <div class="stat-count-item">
          <app-skeleton-block width="32px" height="30px" margin="0 0 4px 0" />
          <app-skeleton-block width="64px" height="12px" />
        </div>
        <div class="stat-count-item">
          <app-skeleton-block width="32px" height="30px" margin="0 0 4px 0" />
          <app-skeleton-block width="64px" height="12px" />
        </div>
      </div>

      <div class="stacked-bar">
        <app-skeleton-block width="100%" height="32px" borderRadius="6px" />
      </div>
      <div class="bar-labels">
        <app-skeleton-block width="20px" height="12px" />
        <app-skeleton-block width="20px" height="12px" />
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: var(--card-bg, #1a1a2e);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      padding: 20px 24px 14px;
      margin-bottom: 24px;
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
    }
    
    .stat-counts {
      display: flex;
      gap: 32px;
      margin-bottom: 20px;
    }
    
    .stat-count-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .stacked-bar {
      margin-bottom: 6px;
    }
    
    .bar-labels {
      display: flex;
      justify-content: space-between;
      color: rgba(255,255,255,0.3);
      padding: 0 2px;
    }
    
    :host-context(.light) .stat-card {
      --card-bg: #ffffff;
      background: var(--card-bg);
      border-color: rgba(0,0,0,0.08);
    }
  `]
})
export class StatWidgetSkeletonComponent {}
