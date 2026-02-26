import { TestBed } from '@angular/core/testing';
import { TaskStore } from './task.store';
import { TaskService } from './task.service';
import { ColumnStore } from '../../column/api/column.store';
import { of, throwError } from 'rxjs';
import { Task } from '../model/task.model';

describe('TaskStore', () => {
  let store: TaskStore;
  let taskServiceSpy: jest.Mocked<TaskService>;
  let columnStoreSpy: Record<string, any>;

  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', status: 'backlog', columnId: 'col-1' } as Task,
    { id: '2', title: 'Task 2', status: 'in-progress', columnId: 'col-2' } as Task,
  ];

  beforeEach(() => {
    taskServiceSpy = {
      getAll: jest.fn().mockReturnValue(of({ items: mockTasks, totalCount: 2 })),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      move: jest.fn(),
    } as unknown as jest.Mocked<TaskService>;

    columnStoreSpy = {
      columns: jest.fn().mockReturnValue([{ id: 'col-2', name: 'In Progress' }])
    };

    TestBed.configureTestingModule({
      providers: [
        TaskStore,
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: ColumnStore, useValue: columnStoreSpy }
      ]
    });

    store = TestBed.inject(TaskStore);
  });

  it('should be created and initialized with empty state', () => {
    expect(store).toBeTruthy();
    expect(store.tasks()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  describe('loadTasks', () => {
    it('should load tasks successfully', async () => {
      await store.loadTasks();
      expect(taskServiceSpy.getAll).toHaveBeenCalled();
      expect(store.tasks().length).toBe(2);
      expect(store.totalCount()).toBe(2);
      expect(store.loading()).toBe(false);
    });

    it('should handle load error', async () => {
      taskServiceSpy.getAll.mockReturnValue(throwError(() => new Error('API Error')));
      await store.loadTasks();
      expect(store.error()).toBe('Failed to load tasks');
      expect(store.loading()).toBe(false);
    });

    it('should map flat array response correctly', async () => {
      taskServiceSpy.getAll.mockReturnValue(of([{ id: '1', title: 'Task 1', status: 'backlog' } as any]) as any);
      await store.loadTasks();
      expect(store.tasks().length).toBe(1);
      expect(store.tasks()[0].columnId).toBe('backlog'); // Fallback when columnId is undefined
    });
  });

  describe('createTask', () => {
    it('should create task and append to state', async () => {
      const newTask = { id: '3', title: 'New', status: 'backlog' } as Task;
      taskServiceSpy.create.mockReturnValue(of(newTask));
      await store.createTask({ title: 'New', description: '' } as any);
      expect(taskServiceSpy.create).toHaveBeenCalled();
      expect(store.tasks()).toContainEqual(newTask);
    });

    it('should handle create error', async () => {
      taskServiceSpy.create.mockReturnValue(throwError(() => new Error('API Error')));
      await store.createTask({ title: 'New' } as any);
      expect(store.error()).toBe('Failed to create task');
    });
  });

  describe('updateTask', () => {
    beforeEach(async () => {
      await store.loadTasks();
    });

    it('should optimistically update task and call service', async () => {
      taskServiceSpy.update.mockReturnValue(of({} as Task));
      await store.updateTask('1', { title: 'Updated' });
      expect(taskServiceSpy.update).toHaveBeenCalledWith('1', { title: 'Updated' });
      expect(store.tasks().find(t => t.id === '1')?.title).toBe('Updated');
    });

    it('should rollback on update error', async () => {
      taskServiceSpy.update.mockReturnValue(throwError(() => new Error('API Error')));
      await store.updateTask('1', { title: 'Wrong' });
      expect(store.error()).toBe('Failed to update task');
      expect(store.tasks().find(t => t.id === '1')?.title).toBe('Task 1');
    });
  });

  describe('deleteTask', () => {
    beforeEach(async () => {
      await store.loadTasks();
    });

    it('should optimistically delete task', async () => {
      taskServiceSpy.delete.mockReturnValue(of(void 0));
      await store.deleteTask('1');
      expect(taskServiceSpy.delete).toHaveBeenCalledWith('1');
      expect(store.tasks().find(t => t.id === '1')).toBeUndefined();
    });

    it('should rollback on delete error', async () => {
      taskServiceSpy.delete.mockReturnValue(throwError(() => new Error('API Error')));
      await store.deleteTask('1');
      expect(store.error()).toBe('Failed to delete task');
      expect(store.tasks().find(t => t.id === '1')).toBeDefined();
    });
  });

  describe('moveTask', () => {
    beforeEach(async () => {
      await store.loadTasks();
    });

    it('should optimistically move task', async () => {
      taskServiceSpy.move.mockReturnValue(of(void 0));
      await store.moveTask('1', 'col-2');
      expect(taskServiceSpy.move).toHaveBeenCalledWith('1', 'col-2');
      
      const movedTask = store.tasks().find(t => t.id === '1');
      expect(movedTask?.columnId).toBe('col-2');
      expect(movedTask?.status).toBe('in-progress');
    });

    it('should rollback on move error', async () => {
      taskServiceSpy.move.mockReturnValue(throwError(() => new Error('API Error')));
      await store.moveTask('1', 'col-2');
      expect(store.error()).toBe('Failed to move task. Please try again.');
      
      const revertedTask = store.tasks().find(t => t.id === '1');
      expect(revertedTask?.columnId).toBe('col-1');
      expect(revertedTask?.status).toBe('backlog');
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      taskServiceSpy.delete.mockReturnValue(throwError(() => new Error('API Error')));
      await store.deleteTask('1'); // Provoke error
      expect(store.error()).toBeTruthy();
      store.clearError();
      expect(store.error()).toBeNull();
    });
  });

  describe('computed properties', () => {
    beforeEach(async () => {
      await store.loadTasks();
      store['_tasks'].set([
        { id: '1', status: 'backlog', columnId: 'col-1' } as Task,
        { id: '2', status: 'in-progress', columnId: 'col-2' } as Task,
        { id: '3', status: 'validation', columnId: 'col-3' } as Task,
        { id: '4', status: 'done', columnId: 'col-4' } as Task,
        { id: '5', status: 'backlog', columnId: 'col-1' } as Task,
      ]);
    });

    it('should group tasks by column', () => {
      const grouped = store.tasksByColumn();
      expect(grouped['col-1']?.length).toBe(2);
      expect(grouped['col-2']?.length).toBe(1);
    });

    it('should compute status counts correctly', () => {
      expect(store.backlogCount()).toBe(2);
      expect(store.inProgressCount()).toBe(1);
      expect(store.validationCount()).toBe(1);
      expect(store.doneCount()).toBe(1);
    });
  });
});
