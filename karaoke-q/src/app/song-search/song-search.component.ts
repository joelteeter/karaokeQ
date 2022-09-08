import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Song } from '../models/song';
import { SongService } from '../services/song.service';

import { faTrashAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.scss']
})
export class SongSearchComponent implements OnInit {

  @Output() selectedSong: EventEmitter<Song> = new EventEmitter<Song>();

  songs$!: Observable<Song[]>;
  private searchTerms = new Subject<string>();
  searchTerm: string = '';
  songSelected: any = null;

  faTrashAlt = faTrashAlt;

  constructor(private songService: SongService) { }

  //push term into observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.songSelected = null;
    this.songs$ = this.searchTerms.pipe(
      //time between checks
      debounceTime(300),

      //ignore unchanged
      distinctUntilChanged(),

      //switch to new observable on change
      switchMap((term: string) => this.songService.searchSongs(term)),
    );
  }

  selectSong(song: Song): void {
    this.songSelected = song;
    this.selectedSong.emit(this.songSelected);
    this.searchTerm = '';
    this.search('');
  }

  cancelSelectedSong(): void {
    this.songSelected = null;
    this.selectedSong.emit(this.songSelected);
  }

}