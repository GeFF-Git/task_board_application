import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@shared/api/base-api.service';
import { Column } from '../model/column.model';

export type CreateColumnDto = Pick<Column, 'name' | 'order'>;
export type UpdateColumnDto = Pick<Column, 'name' | 'order'>;

export interface ReorderColumnDto {
    id: string;
    order: number;
}

@Injectable({ providedIn: 'root' })
export class ColumnService extends BaseApiService {
  getAll(): Observable<Column[]> {
    return this.httpGet<Column[]>('/columns');
  }

  create(dto: CreateColumnDto): Observable<Column> {
    return this.httpPost<Column>('/columns', dto);
  }

  update(id: string, dto: UpdateColumnDto): Observable<Column> {
    return this.httpPut<Column>(`/columns/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.httpDelete<void>(`/columns/${id}`);
  }

  reorder(reorderDtos: ReorderColumnDto[]): Observable<void> {
    return this.httpPatch<void>(`/columns/reorder`, reorderDtos);
  }
}
