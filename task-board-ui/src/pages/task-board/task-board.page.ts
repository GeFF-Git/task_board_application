import { Component, inject, OnInit } from '@angular/core';
import { TaskStore } from '@entities/task/api/task.store';
import { AuthStore } from '@features/auth/auth.store';
import { TaskBoardHeaderComponent } from '@widgets/task-board-header/task-board-header.component';
import { KanbanBoardComponent } from '@widgets/kanban-board/kanban-board.component';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TaskCreateDialogComponent } from '@features/task-create/task-create-dialog.component';

@Component({
  selector: 'app-task-board-page',
  standalone: true,
  imports: [
    TaskBoardHeaderComponent,
    KanbanBoardComponent,
    AvatarComponent,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="task-board-page">
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Tasks report</h1>
          <p class="page-desc">
            Stay on top of your tasks, monitor progress, and track status. Streamline your workflow
            and transform how you deliver results.
          </p>
        </div>
        <div class="page-header-right">
          <!-- <div class="team-cluster">
            <app-avatar name="Kamil Bachanek" size="md" />
            <app-avatar name="Sarah Chen" size="md" />
            <app-avatar name="Alex Rivera" size="md" />
            <app-avatar name="Mike Johnson" size="md" />
            <app-avatar name="Lisa Park" size="md" />
            <button class="add-member-btn"><mat-icon>add</mat-icon></button>
          </div> -->

        <button mat-flat-button color="primary" class="create-task-btn" (click)="openCreateDialog()">Create task</button>
        </div>
      </div>
      <app-task-board-header />
      <div class="view-switcher">
        <div class="view-tabs">
          <button class="view-tab disabled" title="currently under development">Spreadsheet</button>
          <button class="view-tab active">Board</button>
          <button class="view-tab disabled" title="currently under development">Calendar</button>
          <button class="view-tab disabled" title="currently under development">Timeline</button>
        </div>
        <div class="view-actions">
          <button mat-button class="view-action-btn"><mat-icon>widgets</mat-icon> Widgets</button>
          <button mat-button class="view-action-btn">
            <mat-icon>filter_list</mat-icon> Filter
          </button>
        </div>
      </div>
      <app-kanban-board />
    </div>
  `,
  styles: [
    `
      .task-board-page {
        padding: 28px 28px 16px;
        height: calc(100vh - 56px);
        overflow-y: auto;
      }
      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 24px;
      }
      .page-header-right {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .page-title {
        font-size: 28px;
        font-weight: 700;
        color: var(--text-primary, #fff);
        margin: 0 0 8px;
      }
      .page-desc {
        font-size: 14px;
        color: var(--text-muted, rgba(255, 255, 255, 0.5));
        margin: 0;
        max-width: 520px;
        line-height: 1.5;
      }
      .team-cluster {
        display: flex;
        align-items: center;
      }
      .team-cluster app-avatar + app-avatar {
        margin-left: -8px;
      }
      .add-member-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px dashed var(--border, rgba(255, 255, 255, 0.15));
        background: none;
        color: var(--text-muted, rgba(255, 255, 255, 0.4));
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-left: -4px;
        transition: all 0.15s;
      }
      .add-member-btn:hover {
        border-color: #7c3aed;
        color: #a78bfa;
      }
      .add-member-btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      .logout-btn {
        border-radius: 8px !important;
      }
      .view-switcher {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .view-tabs {
        display: flex;
        gap: 4px;
        background: var(--tab-bg, rgba(255, 255, 255, 0.04));
        border-radius: 10px;
        padding: 4px;
      }
      .view-tab {
        padding: 6px 16px;
        border-radius: 7px;
        border: none;
        background: none;
        color: var(--text-muted, rgba(255, 255, 255, 0.5));
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
      }
      .view-tab:hover {
        color: var(--text-primary, #fff);
      }
      .view-tab.active {
        background: var(--tab-active-bg, rgba(255, 255, 255, 0.1));
        color: var(--text-primary, #fff);
        font-weight: 600;
      }
      .view-tab.disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .view-tab.disabled:hover {
        color: var(--text-muted, rgba(255, 255, 255, 0.5));
      }
      .view-actions {
        display: flex;
        gap: 8px;
      }
      .view-action-btn {
        color: var(--text-secondary, rgba(255, 255, 255, 0.6));
        font-size: 13px;
      }
      .view-action-btn mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }
      :host-context(.light) .task-board-page {
        --text-primary: #18181b;
        --text-secondary: rgba(0, 0, 0, 0.6);
        --text-muted: rgba(0, 0, 0, 0.4);
        --border: rgba(0, 0, 0, 0.12);
        --tab-bg: rgba(0, 0, 0, 0.04);
        --tab-active-bg: rgba(0, 0, 0, 0.07);
      }
    `,
  ],
})
export default class TaskBoardPage implements OnInit {
  private readonly taskStore = inject(TaskStore);

  ngOnInit(): void {
    this.taskStore.loadTasks();
  }
  private readonly dialog = inject(MatDialog);
  openCreateDialog(): void {
    this.dialog.open(TaskCreateDialogComponent, { width: '560px', panelClass: 'task-dialog' });
  }
}
