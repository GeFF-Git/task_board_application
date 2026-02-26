import { Injectable, inject, signal, computed } from '@angular/core';
import { ColumnService } from './column.service';
import { Column } from '../model/column.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ColumnStore {
  private readonly _columnService = inject(ColumnService);

  private readonly _columns = signal<Column[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly columns = this._columns.asReadonly();
  readonly sortedColumns = computed(() =>
    [...this._columns()].sort((a, b) => a.order - b.order)
  );
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  async loadColumns(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const result = await firstValueFrom(this._columnService.getAll());
      this._columns.set(result);
    } catch {
      this._error.set('Failed to load columns');
    } finally {
      this._loading.set(false);
    }
  }

  async addColumn(name: string, icon: string, color: string): Promise<void> {
    const current = this._columns();
    const maxOrder = Math.max(...current.map(c => c.order), -1);
    const order = maxOrder + 1;
    
    try {
      const newCol = await firstValueFrom(this._columnService.create({ name, order }));
      this._columns.update(cols => [...cols, newCol]);
    } catch {
      this._error.set('Failed to create column');
    }
  }

  async renameColumn(id: string, name: string): Promise<void> {
    const prev = this._columns();
    const colToUpdate = prev.find(c => c.id === id);
    if (!colToUpdate) return;
    
    // Optimistic
    this._columns.update(cols => cols.map(c => c.id === id ? { ...c, name } : c));
    try {
      await firstValueFrom(this._columnService.update(id, { name, order: colToUpdate.order }));
    } catch {
      this._columns.set(prev);
      this._error.set('Failed to rename column');
    }
  }

  async deleteColumn(id: string): Promise<void> {
    const prev = this._columns();
    // Optimistic
    this._columns.update(cols => cols.filter(c => c.id !== id));
    try {
      await firstValueFrom(this._columnService.delete(id));
    } catch {
      this._columns.set(prev);
      this._error.set('Failed to delete column');
    }
  }
}
