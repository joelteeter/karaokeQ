import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { Singer } from '../models/singer';
import { LogsService } from './logs.service';

@Injectable({
  providedIn: 'root'
})

export class SingerService {

  private singersUrl = 'http://localhost:3000/singers';  //web api
  //private singersUrl = 'https://karaoke-q-api.herokuapp.com/singers';  //web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private logsService: LogsService,
    private http: HttpClient) { }

  /* GET */
  getSingers(sessionId: any): Observable<Singer[]> {
    let params = new HttpParams();
    if(sessionId) {
      params = params.append('sessionid', sessionId);
    }  
    return this.http.get<Singer[]>(this.singersUrl, {params: params})
      .pipe(
        tap(_ => this.log('fetched singers')),
        catchError(this.handleError<Singer[]>('getSingers', []))
      );
  }
  getSinger(id: number): Observable<Singer> {
    const url = `${this.singersUrl}/${id}';`
    this.logsService.add(`SingerService: fetched singer id=$(id}`);
    return this.http.get<Singer>(url)
      .pipe( 
        tap(_ => this.log('fetched singer id=${id}')),
        catchError(this.handleError<Singer>('getSinger id=${id}))'))
      );
  }

  /* PUT */
  updateSinger(singer: Singer): Observable<any> {
    const url = `${this.singersUrl}/${singer.id}`;
    return this.http.put(url, singer, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated singer id=${singer.id}`)),
        catchError(this.handleError<any>('updateSinger'))
      );
  }

  /* POST */
  addSinger(singer: Singer, sessionId:any ): Observable<Singer> {
    singer.sessionId = sessionId;
    return this.http.post<Singer>(this.singersUrl, singer, this.httpOptions,)
      .pipe(
        tap((newSinger: Singer) => this.log(`added singer w/ id=${newSinger.id}`)),
        catchError(this.handleError<Singer>('addSinger'))
      );
  }

  /* DELETE */
  deleteSinger(id: number): Observable<Singer> {
    const url = `${this.singersUrl}/${id}`;

    return this.http.delete<Singer>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted singer id=${id}`)),
      catchError(this.handleError<Singer>('deleteSinger'))
    );
  }
  deleteSessionSingers(sessionId: number): Observable<Singer> {
    let params = new HttpParams();
    if(sessionId) {
      params = params.append('sessionid', sessionId);    
      
    }
    return this.http.delete<Singer>(this.singersUrl, {params: params}).pipe(
      tap(_ => this.log(`deleted singer session_id=${sessionId}`)),
      catchError(this.handleError<Singer>('deleteSinger'))
    );
  }

  /* SEARCH */
  searchSingers(term: string): Observable<Singer[]> {
    if(!term.trim()) {
      //no search term, no serach results
      return of([]);
    }
    return this.http.get<Singer[]>(`${this.singersUrl}/?name=${term}`)
      .pipe(
        tap(x => x.length ?
          this.log(`found singers matching "${term}"`) :
          this.log(`no singers found matching "${term}"`)),
        catchError(this.handleError<Singer[]>('searchSingers', []))
      );
  }

  /** Log a SingerService message with the MessageService */
  private log(message: string) {
    this.logsService.add(`SingerService: ${message}`);
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
