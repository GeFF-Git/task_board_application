import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorLoggerService } from './error-logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly snackBar = inject(MatSnackBar);
  private readonly logger = inject(ErrorLoggerService);   // simple console wrapper

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    this.logger.log(error);

    // Do not show snackbar for HTTP errors — interceptor handles those
    if (!(error instanceof HttpErrorResponse)) {
      this.snackBar.open(message, 'Dismiss', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
