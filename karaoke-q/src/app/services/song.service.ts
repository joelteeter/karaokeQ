import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, distinct, mergeMap, mergeAll, groupBy, reduce, toArray } from 'rxjs/operators';

import { Song } from '../models/song';

import { LogsService } from './logs.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private songsUrl = 'api/songs';  //web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  

  constructor(private logsService: LogsService, private http: HttpClient) { }

  /* POST */
  addSong(song: Song): Observable<Song> {
    return this.http.post<Song>(this.songsUrl, song, this.httpOptions)
      .pipe(
        tap((newSong: Song) => this.log(`added song w/ id=${newSong.id}`)),
        catchError(this.handleError<Song>('addSong'))
      );
  }

  /* SEARCH */
  searchSongs(term: string): Observable<Song[]> {
    if(!term.trim()) {
      //no search term, no serach results
      return of([]);
    }
    let byTitle = this.http.get<Song[]>(`${this.songsUrl}/?title=${term}`);
    let byArtist = this.http.get<Song[]>(`${this.songsUrl}/?artist=${term}`);

    //TODO: do this on the back end, this is... a thing
    return forkJoin(
      [
        byTitle, 
        byArtist
      ]
    ).pipe (
        map(([byTitleArray, byArtistArray]) =>  [...byTitleArray, ...byArtistArray]),
        
        // Emit each item individually
        mergeAll(),

        // Group by their id
        groupBy(o => o.id),

        // For each separate group, reduce to one
        mergeMap(
          grp$ => grp$.pipe(
            reduce((song) => song),
          ),
        ),

        // At the end, collect all the objects in an array
        toArray(),
        
    )
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
