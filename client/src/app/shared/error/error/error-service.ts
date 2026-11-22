import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  public notification = new BehaviorSubject<string>('');

  public handleError(err: unknown): Observable<never> {
    let errorMessage = 'An unexpected error occurred.';

    if (err instanceof HttpErrorResponse) {
      if (err.error instanceof ErrorEvent) {
        errorMessage = `A network error occurred: ${err.error.message}`;
      } else {
        errorMessage = this.getServerErrorMessage(err.error)
          ?? `The request failed with status ${err.status}.`;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    this.notification.next(errorMessage);
    console.error(err);
    return throwError(() => errorMessage);
  }

  private getServerErrorMessage(error: unknown): string | undefined {
    if (
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof error.error === 'string'
    ) {
      return error.error;
    }

    return undefined;
  }
}
