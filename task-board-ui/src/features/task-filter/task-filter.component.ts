import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '@entities/user/api/user.service';

export interface TaskFilterCriteria {
  search: string;
  priority: string;
  assigneeId: string;
}

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule],
  template: `
    <div class="filter-bar">
      <mat-form-field appearance="outline" class="filter-field search-field">
        <mat-icon matPrefix>search</mat-icon>
        <input matInput placeholder="Search tasks..." (input)="onFilter()" [formControl]="searchCtrl" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Priority</mat-label>
        <mat-select [formControl]="priorityCtrl" (selectionChange)="onFilter()">
          <mat-option value="">All</mat-option>
          <mat-option value="urgent">Urgent</mat-option>
          <mat-option value="normal">Normal</mat-option>
          <mat-option value="low">Low</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Assignee</mat-label>
        <mat-select [formControl]="assigneeCtrl" (selectionChange)="onFilter()">
          <mat-option value="">All</mat-option>
          @for (user of users(); track user.id) { <mat-option [value]="user.id">{{ user.name }}</mat-option> }
        </mat-select>
      </mat-form-field>
      <button mat-icon-button (click)="clearFilters()" class="clear-btn"><mat-icon>filter_list_off</mat-icon></button>
    </div>
  `,
  styles: [`
    .filter-bar { display: flex; align-items: center; gap: 12px; padding: 0 4px; }
    .filter-field { font-size: 13px; }
    .filter-field ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    .search-field { flex: 1; max-width: 260px; }
    .clear-btn { color: var(--text-muted, rgba(255,255,255,0.4)); }
  `]
})
export class TaskFilterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  readonly users = this.userService.users;
  readonly filterChange = output<TaskFilterCriteria>();

  readonly searchCtrl = this.fb.control('');
  readonly priorityCtrl = this.fb.control('');
  readonly assigneeCtrl = this.fb.control('');

  onFilter(): void {
    this.filterChange.emit({
      search: this.searchCtrl.value || '',
      priority: this.priorityCtrl.value || '',
      assigneeId: this.assigneeCtrl.value || '',
    });
  }

  clearFilters(): void {
    this.searchCtrl.reset('');
    this.priorityCtrl.reset('');
    this.assigneeCtrl.reset('');
    this.onFilter();
  }
}
