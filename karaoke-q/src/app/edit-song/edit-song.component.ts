import { Component, OnInit, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Song } from '../models/song';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.scss']
})
export class EditSongComponent implements OnInit {

  @Input() edittingSong:Song = {} as Song;

  validSong:boolean = false;
  validatingSong:boolean = true;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
