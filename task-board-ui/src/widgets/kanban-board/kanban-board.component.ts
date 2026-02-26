import { Component, inject, computed, signal, effect, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { TaskStore } from '@entities/task/api/task.store';
import { ColumnStore } from '@entities/column/api/column.store';
import { TaskCardComponent } from '@entities/task/ui/task-card/task-card.component';
import { TaskEditDialogComponent } from '@features/task-edit/task-edit-dialog.component';
import { TaskCreateDialogComponent } from '@features/task-create/task-create-dialog.component';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner/loading-spinner.component';
import { BadgeComponent } from '@shared/ui/badge/badge.component';
import { Task } from '@entities/task/model/task.model';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CdkDrag, CdkDropList, CdkDragPlaceholder, MatIconModule, MatButtonModule, MatMenuModule, TaskCardComponent, EmptyStateComponent, LoadingSpinnerComponent, BadgeComponent],
  template: `
    @if (taskStore.loading()) {
      <div class="board-loading">
        @for (i of [0,1,2,3]; track i) { <div class="column-skeleton"><app-loading-spinner [skeleton]="true" /></div> }
      </div>
    } @else {
      <div class="kanban-board">
        @for (column of columns(); track column.id) {
          <div class="kanban-column">
            <div class="column-header">
              <div class="column-title-row">
                <mat-icon class="column-icon" [style.color]="column.color">{{ getColumnIcon(column.id) }}</mat-icon>
                <span class="column-name">{{ column.name }}</span>
                <app-badge [count]="getColumnTasks(column.id).length" />
              </div>
              <button mat-icon-button [matMenuTriggerFor]="columnMenu" class="column-menu-btn"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #columnMenu="matMenu">
                <button mat-menu-item (click)="addTaskToColumn(column.id)"><mat-icon>add</mat-icon> Add task</button>
                <button mat-menu-item><mat-icon>edit</mat-icon> Rename</button>
                <button mat-menu-item class="delete-item"><mat-icon>delete</mat-icon> Delete</button>
              </mat-menu>
            </div>
            <div cdkDropList [cdkDropListData]="getColumnTasks(column.id)" [id]="column.id"
                 [cdkDropListConnectedTo]="columnIds()" (cdkDropListDropped)="onDrop($event)" class="card-list">
              @for (task of getColumnTasks(column.id); track task.id) {
                <div cdkDrag [cdkDragData]="task" class="drag-card">
                  <app-task-card [task]="task" (click)="openTaskDetail(task)" />
                  <div class="drag-placeholder" *cdkDragPlaceholder></div>
                </div>
              } @empty {
                <app-empty-state icon="check_circle" title="No tasks" description="Drag tasks here or create a new one" />
              }
            </div>
            <button class="add-task-btn" (click)="addTaskToColumn(column.id)"><mat-icon>add</mat-icon><span>Add task</span></button>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .kanban-board { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; height: calc(100vh - 380px); min-height: 400px; }
    .kanban-column { min-width: 280px; max-width: 320px; flex: 1; display: flex; flex-direction: column; background: var(--column-bg, rgba(255,255,255,0.02)); border-radius: 12px; padding: 12px; }
    .column-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 0 4px; }
    .column-title-row { display: flex; align-items: center; gap: 8px; }
    .column-icon { font-size: 18px; width: 18px; height: 18px; }
    .column-name { font-size: 14px; font-weight: 600; color: var(--text-primary, #fff); }
    .column-menu-btn { width: 28px !important; height: 28px !important; padding: 0 !important; --mdc-icon-button-state-layer-size: 28px !important; color: var(--text-muted, rgba(255,255,255,0.3)) !important; border-radius: 6px; }
    .column-menu-btn:hover { color: var(--text-primary, #fff) !important; }
    .column-menu-btn mat-icon { font-size: 18px; }
    .card-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; min-height: 100px; padding: 4px; }
    .card-list::-webkit-scrollbar { width: 4px; }
    .card-list::-webkit-scrollbar-track { background: transparent; }
    .card-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .drag-card { cursor: grab; }
    .drag-card:active { cursor: grabbing; }
    .cdk-drag-preview { opacity: 0.85; box-shadow: 0 8px 24px rgba(0,0,0,0.4); border-radius: 12px; }
    .drag-placeholder { background: rgba(124, 58, 237, 0.08); border: 2px dashed rgba(124, 58, 237, 0.3); border-radius: 12px; min-height: 80px; transition: all 0.25s ease; }
    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .cdk-drop-list-dragging .drag-card:not(.cdk-drag-placeholder) { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .add-task-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 10px; margin-top: 8px; background: none; border: 1px dashed var(--border, rgba(255,255,255,0.08)); border-radius: 10px; color: var(--text-muted, rgba(255,255,255,0.35)); font-size: 13px; cursor: pointer; transition: all 0.15s ease; }
    .add-task-btn:hover { background: rgba(124, 58, 237, 0.06); border-color: rgba(124, 58, 237, 0.3); color: #a78bfa; }
    .add-task-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .board-loading { display: flex; gap: 16px; }
    .column-skeleton { flex: 1; min-width: 280px; background: var(--column-bg, rgba(255,255,255,0.02)); border-radius: 12px; padding: 16px; }
    .delete-item { color: #ef4444; }
    :host-context(.light) .kanban-column { --column-bg: rgba(0,0,0,0.02); --border: rgba(0,0,0,0.08); --text-primary: #18181b; --text-muted: rgba(0,0,0,0.35); }
    :host-context(.light) .column-menu-btn:hover { background-color: rgba(0,0,0,0.08) !important; color: #18181b !important; }
  `]
})
export class KanbanBoardComponent implements OnInit {
  ngOnInit(): void {
    this.columnStore.loadColumns();
  }
  readonly taskStore = inject(TaskStore);
  private readonly columnStore = inject(ColumnStore);
  private readonly dialog = inject(MatDialog);


  readonly columns = this.columnStore.sortedColumns;
  readonly columnIds = computed(() => this.columns().map(c => c.id));
  private tasksMap = computed(() => this.taskStore.tasksByColumn());

  getColumnTasks(columnId: string): Task[] {
    return this.tasksMap()[columnId] || [];
  }

  getColumnIcon(columnId: string): string {
    const icons: Record<string, string> = { 'backlog': 'inbox', 'in-progress': 'autorenew', 'validation': 'verified', 'done': 'check_circle' };
    return icons[columnId] || 'view_column';
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const targetColumnId = event.container.id;
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.taskStore.moveTask(task.id, targetColumnId);
    }
  }

  openTaskDetail(task: Task): void {
    this.dialog.open(TaskEditDialogComponent, { width: '560px', data: task, panelClass: 'task-dialog' });
  }

  addTaskToColumn(columnId: string): void {
    this.dialog.open(TaskCreateDialogComponent, { width: '560px', panelClass: 'task-dialog' });
  }
}
