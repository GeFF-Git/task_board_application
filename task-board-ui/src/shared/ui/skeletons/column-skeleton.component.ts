import { Component } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';
import { TaskCardSkeletonComponent } from './task-card-skeleton.component';

@Component({
  selector: 'app-column-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent, TaskCardSkeletonComponent],
  template: `
    <div class="column-skeleton">
      <div class="column-header">
        <div class="header-left">
          <app-skeleton-block width="24px" height="24px" borderRadius="4px" />
          <app-skeleton-block width="100px" height="20px" />
          <app-skeleton-block width="24px" height="20px" borderRadius="10px" />
        </div>
        <app-skeleton-block width="24px" height="24px" borderRadius="4px" />
      </div>
      
      <div class="column-cards">
        <app-task-card-skeleton />
        <app-task-card-skeleton />
        <app-task-card-skeleton />
      </div>
    </div>
  `,
  styles: [`
    .column-skeleton {
      min-width: 280px;
      max-width: 320px;
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--column-bg, rgba(255, 255, 255, 0.02));
      border-radius: 12px;
      padding: 12px;
    }
    
    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 0 4px;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .column-cards {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    :host-context(.light) .column-skeleton {
      --column-bg: rgba(0, 0, 0, 0.02);
    }
  `]
})
export class ColumnSkeletonComponent {}
