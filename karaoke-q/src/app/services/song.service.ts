import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of, forkJoin, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { Song } from '../models/song';
import { LogsService } from './logs.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private songsUrl = '/songs';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };  

  constructor(private logsService: LogsService, private http: HttpClient) { 
    if(environment && environment.apiUrl) {
      this.songsUrl = environment.apiUrl + this.songsUrl;
    }
  }

  /* GET */
  getSongs(): Observable<Song[]> {    
    return this.http.get<Song[]>(this.songsUrl)
      .pipe(
        tap(_ => this.log('fetched songs')),
        catchError(this.handleError<Song[]>('getSongs', []))
      );
  }

  /* POST */
  addSongs(songs: Song[]): Observable<Song[]> {
    return this.http.post<Song[]>(this.songsUrl, songs, this.httpOptions)
      .pipe(
        tap((newSongs: Song[]) => this.log(`added songs`)),
        catchError(this.handleError<Song[]>('addSong'))
      );
  }
  addSong(song: Song): Observable<Song> {
    return this.http.post<Song>(this.songsUrl, song, this.httpOptions)
      .pipe(
        tap((newSong: Song) => this.log(`added song w/ id=${newSong.id}`)),
        catchError(this.handleError<Song>('addSong'))
      );
  }

  /* PUT */
  updateSong(song: Song): Observable<any> {
    const url = `${this.songsUrl}/${song.id}`;
    return this.http.put(url, song, this.httpOptions)
      .pipe(        
        tap(_ => this.log(`updated song id=${song.id}`)),
        catchError(this.handleError<any>('updateSong'))
      );
  }

  /* DELETE */
  deleteSong(id: number): Observable<Song> {
    const url = `${this.songsUrl}/${id}`;

    return this.http.delete<Song>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted song id=${id}`)),
      catchError(this.handleError<Song>('deleteSong'))
    );
  }

  /* SEARCH */
  searchSongs(term: string): Observable<Song[]> {
    if (!term.trim()) {
      // if not search term, return empty song array.
      return of([]);
    }
    const searchUrl = `${this.songsUrl}/search?searchTerm=${term}`;
    return this.http.get<Song[]>(searchUrl).pipe(
      tap(x => x.length ?
         this.log(`found songs matching "${term}"`) :
         this.log(`no songs matching "${term}"`)),
      catchError(this.handleError<Song[]>('searchSongs', []))
    );
  }

  /** Log a SongService message with the MessageService */
  private log(message: string) {
    this.logsService.add(`SongService: ${message}`);
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
