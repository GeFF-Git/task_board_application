export type Priority = 'urgent' | 'normal' | 'low';

export type Status = 'backlog' | 'in-progress' | 'validation' | 'done';

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  columnId: string;
  assigneeIds: string[];
  category: string;
  categoryEmoji: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  subtaskCount: number;
  subtaskCompleted: number;
}
