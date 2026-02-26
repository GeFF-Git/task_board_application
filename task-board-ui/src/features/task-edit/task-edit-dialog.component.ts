import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskStore } from '@entities/task/api/task.store';
import { UserService } from '@entities/user/api/user.service';
import { ColumnStore } from '@entities/column/api/column.store';
import { Task, Priority } from '@entities/task/model/task.model';

@Component({
  selector: 'app-task-edit-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatIconModule,
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>Edit Task <span class="task-code">{{ data.code }}</span></h2>
        <button mat-icon-button (click)="dialogRef.close()"><mat-icon>close</mat-icon></button>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Task Title</mat-label>
          <input matInput formControlName="title" />
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
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Category</mat-label>
            <input matInput formControlName="category" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Category Emoji</mat-label>
            <input matInput formControlName="categoryEmoji" />
          </mat-form-field>
        </div>
        <div class="dialog-actions">
          <button mat-button type="button" color="warn" (click)="onDelete()">Delete</button>
          <span class="spacer"></span>
          <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || submitting()">Save Changes</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 24px; min-width: 480px; max-width: 560px; }
    .dialog-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .dialog-header h2 { margin: 0; font-size: 20px; font-weight: 600; }
    .task-code { font-size: 14px; color: rgba(255,255,255,0.4); font-weight: 400; margin-left: 8px; }
    .dialog-form { display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }
    .form-row { display: flex; gap: 16px; }
    .half-width { flex: 1; }
    .dialog-actions { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
    .spacer { flex: 1; }
  `]
})
export class TaskEditDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TaskEditDialogComponent>);
  readonly data: Task = inject(MAT_DIALOG_DATA);
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
    title: [this.data.title, Validators.required],
    columnId: [this.data.columnId, Validators.required],
    priority: [this.data.priority as Priority, Validators.required],
    assigneeId: [this.data.assigneeIds?.length > 0 ? this.data.assigneeIds[0] : null],
    dueDate: [new Date(this.data.dueDate)],
    description: [this.data.description],
    category: [this.data.category],
    categoryEmoji: [this.data.categoryEmoji],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const val = this.form.getRawValue();
    await this.taskStore.updateTask(this.data.id, {
      title: val.title!, description: val.description || '', priority: val.priority!,
      columnId: val.columnId!, status: val.columnId! as any, 
      assigneeIds: val.assigneeId ? [val.assigneeId] : [],
      category: val.category || '', categoryEmoji: val.categoryEmoji || '📋',
      dueDate: val.dueDate ? (val.dueDate as Date).toISOString().split('T')[0] : this.data.dueDate,
    });
    this.submitting.set(false);
    this.dialogRef.close(true);
  }

  async onDelete(): Promise<void> {
    await this.taskStore.deleteTask(this.data.id);
    this.dialogRef.close(true);
  }
}
