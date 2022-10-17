import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { Slip } from '../models/slip';
import { LogsService } from './logs.service';

@Injectable({
  providedIn: 'root'
})
export class SlipService {

  private slipsUrl = '/slips';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private logsService: LogsService,
    private http: HttpClient) { 
      if(environment && environment.apiUrl) {
        this.slipsUrl = environment.apiUrl + this.slipsUrl;
      }
    }

  /* GET */
  getSlips(sessionId?: number): Observable<Slip[]> {   
    this.logsService.add(`getting slips for session: ${sessionId}`);
    let params = new HttpParams();
    if(sessionId) {
      params = params.append('sessionid', sessionId);
    }
    return this.http.get<Slip[]>(this.slipsUrl, {params: params})
      .pipe(
        tap(_ => this.log('fetched slips')),
        catchError(this.handleError<Slip[]>('getSlips', []))
      );
  }
  getAllSlips(): Observable<Slip[]> {   
    this.logsService.add('getting all slips');
    return this.http.get<Slip[]>(this.slipsUrl)
      .pipe(
          tap(_ => this.log('fetched slips')),
          catchError(this.handleError<Slip[]>('getSlips', []))
        );
  }
  /* GET */
  getSlipsBySongId(songId?: number): Observable<Slip[]> {   
    this.logsService.add(`getting slips for session: ${songId}`);
    let params = new HttpParams();
    if(songId) {
      params = params.append('songid', songId);
    }
    return this.http.get<Slip[]>(this.slipsUrl+'/search', {params: params})
      .pipe(
        tap(_ => this.log('fetched slips')),
        catchError(this.handleError<Slip[]>('getSlips', []))
      );
  }

  getSlip(id: number): Observable<Slip> {
    const url = `${this.slipsUrl}/${id}';`
    this.logsService.add(`SlipService: fetched slip id=$(id}`);
    return this.http.get<Slip>(url)
      .pipe(
        tap(_ => this.log('fetched slip id=${id}')),
        catchError(this.handleError<Slip>('getSlip id=${id}))'))
      );
  }

  /* PUT */
  updateSlip(slip: Slip): Observable<any> {
    const url = `${this.slipsUrl}/${slip.id}`;
    return this.http.put(url, slip, this.httpOptions)
      .pipe(        
        tap(_ => this.log(`updated slip id=${slip.id}`)),
        catchError(this.handleError<any>('updateSlip'))
      );
  }

  /* POST */
  addSlip(slip: Slip): Observable<Slip> {
    this.logsService.add('adding slip');
    return this.http.post<Slip>(this.slipsUrl, slip, this.httpOptions)
      .pipe(
        tap((newSlip: Slip) => this.log(`added slip w/ id=${newSlip.id}`)),
        catchError(this.handleError<Slip>('addSlip'))
      );
  }
  updateBalancedSlips(slips: Slip[]): Observable<any> {
    const url = `${this.slipsUrl}/balance/`;
    return this.http.post(url, slips, this.httpOptions)
      .pipe(        
        tap(_ => this.log(`balanced ${slips.length} slips`)),
        catchError(this.handleError<any>('updateSlip'))
      );
  }
  dragDropSlip(payload: any): Observable<any> {
    const url = `${this.slipsUrl}/dragdrop/`;
    return this.http.post(url, payload, this.httpOptions)
      .pipe(        
        tap(_ => this.log(`updated slips on drag drop`)),
        catchError(this.handleError<any>('updateSlip'))
      );
  }

  /* DELETE */
  deleteSlip(id: number): Observable<Slip> {
    const url = `${this.slipsUrl}/${id}`;

    return this.http.delete<Slip>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted slip id=${id}`)),
      catchError(this.handleError<Slip>('deleteSlip'))
    );
  }
  deleteSessionSlips(sessionId: number): Observable<Slip> {
    let params = new HttpParams();
    if(sessionId) {
      params = params.append('sessionid', sessionId);    
      
    }
    return this.http.delete<Slip>(this.slipsUrl, {params: params}).pipe(
      tap(_ => this.log(`deleted slip session_id=${sessionId}`)),
      catchError(this.handleError<Slip>('deleteSlip'))
    );
  }

  /* SEARCH */
  searchSlips(term: string): Observable<Slip[]> {
    if(!term.trim()) {
      //no search term, no serach results
      return of([]);
    }
    return this.http.get<Slip[]>(`${this.slipsUrl}/?name=${term}`)
      .pipe(
        tap(x => x.length ?
          this.log(`found slips matching "${term}"`) :
          this.log(`no slips found matching "${term}"`)),
        catchError(this.handleError<Slip[]>('searchSlips', []))
      );
  }

  /** Log a SlipService message with the MessageService */
  private log(message: string) {
    this.logsService.add(`SlipService: ${message}`);
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
