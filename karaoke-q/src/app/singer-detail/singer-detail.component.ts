import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Singer } from '../models/singer';
import { Song } from '../models/song';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.scss']
})
export class SingerDetailComponent implements OnInit {

  @Input() singers : Singer[] = [];
  @Input() singerToEdit: any = {};
  @Output() singerUpdated: EventEmitter<Singer> = new EventEmitter<Singer>();
  @Output() editCancelled: EventEmitter<boolean> = new EventEmitter<boolean>();


  color: any = null;
  selectedSinger: Singer = {} as Singer;
  selectedSong: Song = {} as Song;

  singerForm = this.fb.group({
    singerName: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,
              private title: Title, ) { 
  }

  ngOnChanges(changes: SimpleChanges) {

    this.updateSinger(this.singerToEdit);

  }

  ngOnInit(): void {
    this.title.setTitle('singer-detail');
    console.log('initialing ', this.title.getTitle());
    if(this.singerToEdit) {
      this.color = this.singerToEdit.color;
    }
  }

  onSubmit(): void {
    const singerNameControl = this.singerForm.get('singerName');
    if(!this.color) {
      this.color = '#000000';
    }
    if(singerNameControl) {
      let singer = this.singerForm.get('singerName')?.value;

      if(singer && singer != undefined && singer.length > 0) {
        //TODO: diable save if untouched or length 0
        if(singer && singer.length < 1) {
          return;
        }
        //check unique name        
        const matchedSinger = this.singers.filter(obj => {
          obj.name.toLowerCase() === singer!.toLowerCase() && !this.selectedSinger
        });
        if(matchedSinger && matchedSinger.length > 0) {
          //TODO: error 
          console.log('error name should be unique');
        }
        else {
          if(this.singerToEdit.id) {
            this.singerToEdit.name = singer;
            this.singerToEdit.color = this.color;
            console.log('emitting to singer.component.updatesinger()');            
            this.singerUpdated.emit(this.singerToEdit);
            
            
          } else {
            let singerToSave: any = { name: singer, song: this.selectedSong, color: this.color };
            console.log('emitting to singer.component.updatesinger()');
            this.singerUpdated.emit(singerToSave);            
          }
          
          
        }
      }
      
    }
  }

  cancel(): void {
    
    this.editCancelled.emit(true);
  }

  selectSong(song: Song): void {
    this.selectedSong = song;
  }

  updateSinger(singerToEdit: any): void {
    this.singerForm.setValue({
      singerName: this.singerToEdit.name? this.singerToEdit.name : '',
    });
    this.color = singerToEdit.color? singerToEdit.color : '#ffffff';
  }


}
