import { Component, input, inject, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../model/task.model';
import { UserService } from '@entities/user/api/user.service';
import { PriorityChipComponent } from '@shared/ui/priority-chip/priority-chip.component';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { formatDueDate } from '@shared/utils/date.utils';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatIconModule, PriorityChipComponent, AvatarComponent],
  template: `
    <div class="task-card" tabindex="0">
      <div class="card-header">
        <span class="task-code"
          ><mat-icon class="code-icon">radio_button_checked</mat-icon> {{ task().code }}</span
        >
        <app-priority-chip [priority]="task().priority" />
      </div>
      <h4 class="task-title">{{ task().title }}</h4>
      <div class="task-category">
        <span class="category-pill">{{ task().categoryEmoji }} {{ task().category }}</span>
      </div>
      <div class="task-due-date">
        <mat-icon class="due-icon">event</mat-icon><span>Due to: {{ formattedDueDate() }}</span>
      </div>
      <div class="card-footer">
        <div class="assignee-avatars">
          @for (user of assignees(); track user.id) {
            <app-avatar [name]="user.fullName" [src]="user.avatar ?? ''" size="sm" />
          }
          @if (overflowCount() > 0) {
            <span class="avatar-overflow">+{{ overflowCount() }}</span>
          }
        </div>
        <div class="card-meta">
          @if (task().commentCount > 0) {
            <span class="meta-item"
              ><mat-icon class="meta-icon">chat_bubble_outline</mat-icon>
              {{ task().commentCount }}</span
            >
          }
          <span class="meta-date">{{ formattedUpdatedDate() }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .task-card {
        background: var(--card-bg, #1c1c1f);
        border: 1px solid var(--card-border, rgba(255, 255, 255, 0.06));
        border-radius: 12px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        outline: none;
      }
      .task-card:hover {
        transform: translateY(-2px);
        border-color: rgba(124, 58, 237, 0.3);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      .task-card:focus-visible {
        border-color: #7c3aed;
        box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.3);
      }
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .task-code {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: var(--text-muted, rgba(255, 255, 255, 0.45));
        font-weight: 500;
      }
      .code-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
        color: var(--text-muted, rgba(255, 255, 255, 0.35));
      }
      .task-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary, #fff);
        margin: 0 0 8px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .task-category {
        margin-bottom: 10px;
      }
      .category-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 10px;
        background: var(--chip-bg, rgba(255, 255, 255, 0.06));
        border-radius: 6px;
        font-size: 11px;
        color: var(--text-secondary, rgba(255, 255, 255, 0.7));
      }
      .task-due-date {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--text-muted, rgba(255, 255, 255, 0.5));
        margin-bottom: 12px;
      }
      .due-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid var(--card-border, rgba(255, 255, 255, 0.06));
        padding-top: 10px;
      }
      .assignee-avatars {
        display: flex;
        align-items: center;
      }
      .assignee-avatars app-avatar + app-avatar,
      .assignee-avatars .avatar-overflow {
        margin-left: -6px;
      }
      .avatar-overflow {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 9999px;
        background: var(--chip-bg, rgba(255, 255, 255, 0.1));
        font-size: 10px;
        font-weight: 600;
        color: var(--text-secondary, rgba(255, 255, 255, 0.7));
        border: 2px solid var(--card-bg, #1c1c1f);
      }
      .card-meta {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .meta-item {
        display: flex;
        align-items: center;
        gap: 3px;
        font-size: 12px;
        color: var(--text-muted, rgba(255, 255, 255, 0.45));
      }
      .meta-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
      .meta-date {
        font-size: 11px;
        color: var(--text-muted, rgba(255, 255, 255, 0.35));
      }
      :host-context(.light) .task-card {
        --card-bg: #ffffff;
        --card-border: rgba(0, 0, 0, 0.08);
        --text-primary: #18181b;
        --text-secondary: rgba(0, 0, 0, 0.65);
        --text-muted: rgba(0, 0, 0, 0.45);
        --chip-bg: rgba(0, 0, 0, 0.05);
      }
      :host-context(.light) .task-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
    `,
  ],
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  private readonly userService = inject(UserService);

  readonly assignees = computed(() => {
    const ids = this.task().assigneeIds ?? [];
    return this.userService.getUsersByIds(ids).slice(0, 3);
  });

  readonly overflowCount = computed(() => {
    const ids = this.task().assigneeIds ?? [];
    return Math.max(0, ids.length - 3);
  });
  readonly formattedDueDate = computed(() => formatDueDate(this.task().dueDate));
  readonly formattedUpdatedDate = computed(() => {
    const d = new Date(this.task().updatedAt);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  });
}
