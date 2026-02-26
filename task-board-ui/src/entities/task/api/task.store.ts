import { Injectable, inject, signal, computed } from '@angular/core';
import { Task } from '../model/task.model';
import { TaskService } from './task.service';
import { ColumnStore } from '../../column/api/column.store';
import { groupBy } from '@shared/utils/signal.utils';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  private readonly columnKey = (t: Task) =>
    t.status === 'backlog'
      ? 'backlog'
      : t.status === 'in-progress'
        ? 'in-progress'
        : t.status === 'validation'
          ? 'validation'
          : ('done' as const);

  private readonly groupKey = (t: Task) => t.columnId ?? t.status ?? 'backlog';
  readonly tasksByColumn = computed(() => groupBy(this._tasks(), this.groupKey));
  readonly totalCount = computed(() => this._tasks().length);
  readonly backlogCount = computed(
    () => this._tasks().filter((t) => this.columnKey(t) === 'backlog').length,
  );
  readonly inProgressCount = computed(
    () => this._tasks().filter((t) => this.columnKey(t) === 'in-progress').length,
  );
  readonly validationCount = computed(
    () => this._tasks().filter((t) => this.columnKey(t) === 'validation').length,
  );
  readonly doneCount = computed(
    () => this._tasks().filter((t) => this.columnKey(t) === 'done').length,
  );

  private readonly _taskService = inject(TaskService);
  private readonly _columnStore = inject(ColumnStore);

  private _getMappedStatus(columnId?: string): Task['status'] {
    if (!columnId) return 'backlog';
    const column = this._columnStore.columns().find(c => c.id === columnId);
    return column ? (column.name.toLowerCase().replace(/ /g, '-') as Task['status']) : 'backlog';
  }

  async loadTasks(): Promise<void> {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this._taskService.getAll());
      const raw = result.items || (result as any);
      const tasks = Array.isArray(raw)
        ? raw.map((t: Task) => ({ ...t, columnId: t.columnId ?? t.status ?? 'backlog' }))
        : raw;
      this._tasks.set(tasks);
    } catch {
      this._error.set('Failed to load tasks');
    } finally {
      this._loading.set(false);
    }
  }

  async createTask(
    task: Omit<
      Task,
      | 'id'
      | 'code'
      | 'createdAt'
      | 'updatedAt'
      | 'commentCount'
      | 'subtaskCount'
      | 'subtaskCompleted'
    >,
  ): Promise<void> {
    try {
      const newTask = await firstValueFrom(this._taskService.create(task));
      this._tasks.update((tasks) => [...tasks, newTask]);
    } catch {
      this._error.set('Failed to create task');
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const prev = this._tasks();
    
    // Auto-map status if columnId is changing
    const statusPayload = updates.columnId 
      ? this._getMappedStatus(updates.columnId) 
      : updates.status;

    const mergedUpdates = { ...updates, ...(statusPayload ? { status: statusPayload } : {}) };

    this._tasks.update((tasks) => tasks.map((t) => t.id === id ? { ...t, ...mergedUpdates } : t));
    try {
      await firstValueFrom(this._taskService.update(id, mergedUpdates));
    } catch {
      this._tasks.set(prev);
      this._error.set('Failed to update task');
    }
  }

  async moveTask(taskId: string, targetColumnId: string): Promise<void> {
    // Snapshot for rollback
    const snapshot = this._tasks();

    // Optimistic update — instant UI response
    const mappedStatus = this._getMappedStatus(targetColumnId);
    this._tasks.update((tasks) =>
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              columnId: targetColumnId,
              status: mappedStatus,
            }
          : t,
      ),
    );

    try {
      await firstValueFrom(this._taskService.move(taskId, targetColumnId));
    } catch {
      // Rollback to snapshot on failure
      this._tasks.set(snapshot);
      this._error.set('Failed to move task. Please try again.');
    }
  }

  async deleteTask(id: string): Promise<void> {
    const prev = this._tasks();
    this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
    try {
      await firstValueFrom(this._taskService.delete(id));
    } catch {
      this._tasks.set(prev);
      this._error.set('Failed to delete task');
    }
  }

  clearError(): void {
    this._error.set(null);
  }
}
