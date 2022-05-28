import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ErrorService {
  public notification = new BehaviorSubject<string>('');

  public handleError(err: any): Observable<never> {
    let errorMessage: string = '';

    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      if (this.isKnownError(err.status)){
        errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
        // return fallback observable?
      } // could have a else for other status codes?
    }

    // for now, show in console, but eventually deal with 
    // either showing an error to user or redirect to error page
    this.notification.next(errorMessage);
    console.error(err);
    return throwError(errorMessage);
    
  }

  private isKnownError(errorCode: number): boolean {
    const KNOWN_ERRORS = [400, 401, 403];
    return KNOWN_ERRORS.includes(errorCode);
  }

}



