import { Component } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';

@Component({
  selector: 'app-task-card-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent],
  template: `
    <div class="task-card-skeleton">
      <div class="card-header">
        <app-skeleton-block width="60px" height="24px" borderRadius="12px" />
        <app-skeleton-block width="24px" height="24px" borderRadius="50%" />
      </div>
      
      <div class="card-title">
        <app-skeleton-block width="85%" height="20px" margin="0 0 8px 0" />
        <app-skeleton-block width="60%" height="20px" />
      </div>
      
      <div class="card-footer">
        <app-skeleton-block width="80px" height="16px" />
        <div class="footer-right">
          <app-skeleton-block width="32px" height="16px" />
          <app-skeleton-block width="32px" height="16px" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-card-skeleton {
      background: var(--card-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .card-title {
      margin-top: 4px;
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }
    
    .footer-right {
      display: flex;
      gap: 12px;
    }
    
    :host-context(.light) .task-card-skeleton {
      --card-bg: #fff;
      --border-color: rgba(0, 0, 0, 0.06);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
  `]
})
export class TaskCardSkeletonComponent {}
