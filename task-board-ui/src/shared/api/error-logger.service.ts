import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorLoggerService {
  log(error: unknown): void {
    console.error('TaskBoard Error:', error);
  }
}
