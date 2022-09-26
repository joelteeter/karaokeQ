import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Session } from '../models/session';

import { LogsService } from './logs.service';



@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private sessionsUrl = 'http://localhost:3000/sessions';  //web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private logsService: LogsService,
    private http: HttpClient) { }

  /* GET */
  getSessions(): Observable<Session[]> {  
    return this.http.get<Session[]>(this.sessionsUrl)
      .pipe(
          tap(_ => this.log('fetched sessions')),
          catchError(this.handleError<Session[]>('getSessions', []))
        );
  }
  getSession(id: number): Observable<Session> {
    const url = `${this.sessionsUrl}/${id}';`
    this.logsService.add(`SessionService: fetched session id=$(id}`);
    return this.http.get<Session>(url)
      .pipe( 
        tap(_ => this.log('fetched session id=${id}')),
        catchError(this.handleError<Session>('getSession id=${id}))'))
      );
  }

  /* PUT */
  updateSession(session: Session): Observable<any> {
    const url = `${this.sessionsUrl}/${session.id}`;
    return this.http.put(url, session, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated session id=${session.id}`)),
        catchError(this.handleError<any>('updateSession'))
      );
  }

  /* POST */
  addSession(session: Session): Observable<Session> {
    return this.http.post<Session>(this.sessionsUrl, session, this.httpOptions)
      .pipe(
        tap((newSession: Session) => this.log(`added session w/ id=${newSession.id}`)),
        catchError(this.handleError<Session>('addSession'))
      );
  }

  /* DELETE */
  deleteSession(id: number): Observable<Session> {
    const url = `${this.sessionsUrl}/${id}`;

    return this.http.delete<Session>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted session id=${id}`)),
      catchError(this.handleError<Session>('deleteSession'))
    );
  }


  /** Log a SessionService message with the MessageService */
  private log(message: string) {
    this.logsService.add(`SessionService: ${message}`);
  }

/**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
