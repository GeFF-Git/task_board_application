import { Injectable, inject, signal } from '@angular/core';
import { ReportService, TaskReportDto } from './report.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportStore {
  private readonly _reportService = inject(ReportService);

  private readonly _report = signal<TaskReportDto | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly report = this._report.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  async loadReport(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const result = await firstValueFrom(this._reportService.getSummary());
      this._report.set(result);
    } catch {
      this._error.set('Failed to load metrics');
    } finally {
      this._loading.set(false);
    }
  }
}
