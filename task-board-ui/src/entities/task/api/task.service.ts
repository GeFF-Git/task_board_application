import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@shared/api/base-api.service';
import { Task } from '../model/task.model';
import { HttpParams } from '@angular/common/http';

export interface TaskQueryParams {
  columnId?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

function buildHttpParams(params?: TaskQueryParams): HttpParams {
  let httpParams = new HttpParams();
  if (!params) return httpParams;

  if (params.columnId) httpParams = httpParams.set('columnId', params.columnId);
  if (params.priority) httpParams = httpParams.set('priority', params.priority);
  if (params.search) httpParams = httpParams.set('search', params.search);
  if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
  if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
  if (params.page) httpParams = httpParams.set('page', params.page.toString());
  if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());

  return httpParams;
}

export type CreateTaskDto = Omit<Task, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'commentCount' | 'subtaskCount' | 'subtaskCompleted'>;
export type UpdateTaskDto = Partial<CreateTaskDto>;

@Injectable({ providedIn: 'root' })
export class TaskService extends BaseApiService {
  getAll(params?: TaskQueryParams): Observable<PaginatedResult<Task>> {
    const httpParams = buildHttpParams(params);
    return this.httpGet<PaginatedResult<Task>>('/tasks', httpParams);
  }

  getById(id: string): Observable<Task> {
    return this.httpGet<Task>(`/tasks/${id}`);
  }

  create(dto: CreateTaskDto): Observable<Task> {
    return this.httpPost<Task>('/tasks', dto);
  }

  update(id: string, dto: UpdateTaskDto): Observable<Task> {
    return this.httpPut<Task>(`/tasks/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.httpDelete<void>(`/tasks/${id}`);
  }

  move(id: string, columnId: string): Observable<void> {
    return this.httpPatch<void>(`/tasks/${id}/move`, { columnId });
  }
}
