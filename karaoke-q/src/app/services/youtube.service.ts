import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, distinct, mergeMap, mergeAll, groupBy, reduce, toArray } from 'rxjs/operators';

import { LogsService } from './logs.service';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private ytUrl = 'https://www.youtube.com/embed/';  //web api  

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
     }),
  };

  

  constructor(private logsService: LogsService, private http: HttpClient) { }

  /* check if playable song c8wn2fMYvns - no works   gzsSSqAN-jI -  works */
  /* this didn't work TODO: get rid of this */
  checkSong(videoId: any) {
    const checkUrl = this.ytUrl+videoId;
    console.log(checkUrl);
    return this.http.post<any>(checkUrl, this.httpOptions)
      .pipe(
        tap((newSongs: any) => this.log(`added songs`)),
        catchError(this.handleError<any>('addSong'))
      );
  }


  /** Log a youtube service message with the MessageService */
  private log(message: string) {
    this.logsService.add(`YoutubeService: ${message}`);
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
