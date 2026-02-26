import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TaskStore } from '@entities/task/api/task.store';
import { StatWidgetSkeletonComponent } from '@shared/ui/skeletons/stat-widget-skeleton.component';

@Component({
  selector: 'app-task-board-header',
  standalone: true,
  imports: [MatIconModule, StatWidgetSkeletonComponent],
  template: `
    @if (taskStore.loading()) {
      <app-stat-widget-skeleton />
    } @else {
    <div class="stat-card">
      <div class="stat-header">
        <div class="stat-title-row">
          <mat-icon class="stat-icon">lock_outline</mat-icon>
          <span class="stat-title">Task status</span>
        </div>
      </div>

      <div class="stat-counts">
        <div class="stat-count-item">
          <span class="count-value">{{ taskStore.backlogCount() }}</span>
          <span class="count-label">Backlog 📋</span>
        </div>
        <div class="stat-count-item">
          <span class="count-value">{{ taskStore.inProgressCount() }}</span>
          <span class="count-label">In progress ⚡</span>
        </div>
        <div class="stat-count-item">
          <span class="count-value">{{ taskStore.validationCount() }}</span>
          <span class="count-label">Validation 🔍</span>
        </div>
        <div class="stat-count-item">
          <span class="count-value">{{ taskStore.doneCount() }}</span>
          <span class="count-label">Done ✅</span>
        </div>
      </div>

      <div class="stacked-bar">
        <div class="bar-segment seg-backlog"    [style.flex]="taskStore.backlogCount()"></div>
        <div class="bar-segment seg-inprogress" [style.flex]="taskStore.inProgressCount()"></div>
        <div class="bar-segment seg-validation"  [style.flex]="taskStore.validationCount()"></div>
        <div class="bar-segment seg-done"        [style.flex]="taskStore.doneCount()"></div>
      </div>
      <div class="bar-labels"><span>1d</span><span>7d</span></div>
    </div>
    }
  `,
  styles: [`
    .stat-card {
      background: var(--card-bg, #1a1a2e);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      padding: 20px 24px 14px;
      margin-bottom: 24px;
    }

    /* Header — no action buttons */
    .stat-header {
      margin-bottom: 20px;
    }
    .stat-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: rgba(255,255,255,0.5);
    }
    .stat-title {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
    }

    /* Counts */
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
    .count-value {
      font-size: 30px;
      font-weight: 700;
      color: #fff;
      line-height: 1;
      letter-spacing: -0.5px;
    }
    .count-label {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
    }

    /* Horizontal stacked bar */
    .stacked-bar {
      display: flex;
      height: 32px;
      border-radius: 6px;
      overflow: hidden;
      gap: 2px;
    }
    .bar-segment {
      min-width: 4px;
      transition: flex 0.3s ease;
    }
    .seg-backlog    { background: #7c3aed; }
    .seg-inprogress { background: #a78bfa; }
    .seg-validation { background: #c4b5fd; }
    .seg-done       { background: #ddd6fe; }

    .bar-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
      font-size: 11px;
      color: rgba(255,255,255,0.3);
      padding: 0 2px;
    }

    /* Light theme */
    :host-context(.light) .stat-card {
      --card-bg: #ffffff;
      background: var(--card-bg);
      border-color: rgba(0,0,0,0.08);
    }
    :host-context(.light) .stat-title { color: #18181b; }
    :host-context(.light) .stat-icon { color: rgba(0,0,0,0.4); }
    :host-context(.light) .count-value { color: #18181b; }
    :host-context(.light) .count-label { color: rgba(0,0,0,0.45); }
    :host-context(.light) .bar-labels { color: rgba(0,0,0,0.3); }
    :host-context(.light) .seg-backlog    { background: #7c3aed; }
    :host-context(.light) .seg-inprogress { background: #a78bfa; }
    :host-context(.light) .seg-validation { background: #c4b5fd; }
    :host-context(.light) .seg-done       { background: #ede9fe; }
  `]
})
export class TaskBoardHeaderComponent {
  readonly taskStore = inject(TaskStore);
}
