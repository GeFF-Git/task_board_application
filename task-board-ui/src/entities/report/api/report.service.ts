import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@shared/api/base-api.service';

export interface TaskReportDto {
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  overdueTasks: number;
  upcomingTasks: number;
  columnBreakdown?: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class ReportService extends BaseApiService {
  getSummary(): Observable<TaskReportDto> {
    return this.httpGet<TaskReportDto>('/reports/summary');
  }
}
