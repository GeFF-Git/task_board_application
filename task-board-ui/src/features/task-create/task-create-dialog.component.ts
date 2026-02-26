import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TaskStore } from '@entities/task/api/task.store';
import { UserService } from '@entities/user/api/user.service';
import { ColumnStore } from '@entities/column/api/column.store';
import { Priority, Task } from '@entities/task/model/task.model';

@Component({
  selector: 'app-task-create-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule,
    MatIconModule, MatChipsModule,
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>Create New Task</h2>
        <button mat-icon-button (click)="dialogRef.close()"><mat-icon>close</mat-icon></button>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Task Title</mat-label>
          <input matInput formControlName="title" placeholder="Enter task title" />
          @if (form.get('title')?.hasError('required') && form.get('title')?.touched) {
            <mat-error>Title is required</mat-error>
          }
        </mat-form-field>
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Status</mat-label>
            <mat-select formControlName="columnId">
              @for (col of columns(); track col.id) { <mat-option [value]="col.id">{{ col.name }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="urgent">🔴 Urgent</mat-option>
              <mat-option value="normal">🟠 Normal</mat-option>
              <mat-option value="low">🟢 Low</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Assignee</mat-label>
          <mat-select formControlName="assigneeId">
            @for (user of users(); track user.id) { <mat-option [value]="user.id">{{ user.name || user.fullName }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Due Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dueDate" />
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Describe the task..."></textarea>
        </mat-form-field>
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Category</mat-label>
            <input matInput formControlName="category" placeholder="e.g. Marketing" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Category Emoji</mat-label>
            <input matInput formControlName="categoryEmoji" placeholder="e.g. 📢" />
          </mat-form-field>
        </div>
        <div class="dialog-actions">
          <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || submitting()">
            @if (submitting()) { <mat-icon class="spin">autorenew</mat-icon> }
            Create Task
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 24px; min-width: 480px; max-width: 560px; }
    .dialog-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .dialog-header h2 { margin: 0; font-size: 20px; font-weight: 600; }
    .dialog-form { display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }
    .form-row { display: flex; gap: 16px; }
    .half-width { flex: 1; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 12px; }
    .spin { animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class TaskCreateDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TaskCreateDialogComponent>);
  private readonly taskStore = inject(TaskStore);
  private readonly userService = inject(UserService);
  private readonly columnStore = inject(ColumnStore);
  private readonly fb = inject(FormBuilder);

  readonly users = this.userService.users;
  readonly columns = this.columnStore.sortedColumns;
  readonly submitting = signal(false);

  ngOnInit(): void {
    if (this.columns().length === 0) {
      this.columnStore.loadColumns();
    }
    if (this.users().length === 0) {
      this.userService.loadUsers();
    }
  }

  readonly form = this.fb.group({
    title: ['', Validators.required],
    columnId: ['backlog', Validators.required],
    priority: ['normal' as Priority, Validators.required],
    assigneeId: [null as string | null],
    dueDate: [null as Date | null],
    description: [''],
    category: [''],
    categoryEmoji: ['📋'],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const val = this.form.getRawValue();
    await this.taskStore.createTask({
      title: val.title!, description: val.description || '', priority: val.priority!,
      status: val.columnId! as any, columnId: val.columnId!, assigneeIds: val.assigneeId ? [val.assigneeId] : [],
      category: val.category || 'General', categoryEmoji: val.categoryEmoji || '📋',
      dueDate: val.dueDate ? val.dueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    this.submitting.set(false);
    this.dialogRef.close(true);
  }
}
