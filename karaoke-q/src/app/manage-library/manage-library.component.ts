import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {CdkTableModule} from '@angular/cdk/table';

import { faFile } from '@fortawesome/free-solid-svg-icons';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';
import { YoutubeService } from '../services/youtube.service';

@Component({
  selector: 'app-manage-library',
  templateUrl: './manage-library.component.html',
  styleUrls: ['./manage-library.component.scss']
})
export class ManageLibraryComponent implements OnInit {
  @Input() slips:any[] = [];

  validSong:boolean = false;
  validatingSong:boolean = true;
  closeResult = '';
  dataSource:Song[] = [];
  displayedColumns: string[] = ['artist', 'title', 'embedurl', 'ops'];

  edittingSong:Song = {} as Song;

  constructor(private songService: SongService, private youtubeService: YoutubeService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.songService.getSongs().subscribe( (songs:any) => {
      console.log(songs);
      this.dataSource = songs.data;
    });
  }

  open(content:any) {

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      scrollable: true,
    }).result.then((result) => {
      if(result === 'Save click') {

        
      }
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditModal(editSongModal:any) {
    this.modalService.open(editSongModal, {
      ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result === 'Save click') {

        this.songService.updateSong(this.edittingSong).subscribe( result => {

          this.dataSource.forEach((s:any) => {
            if(s.id === this.edittingSong.id) {
              s.artist = this.edittingSong.artist;
              s.title = this.edittingSong.title;
              s.embedurl = this.edittingSong.embedurl;
            }
          });


        });  

      }
      this.edittingSong = {} as Song;
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  validateSong(song: any): void {
    song.validation_requested = false;
    this.songService.updateSong(song).subscribe( () => {
      this.dataSource.forEach((s:any) => {
        if(s.id === song.id) {
          s.validation_requested = false;
        }
      });
    });
    
  }

  editSong(song: any): void {
    this.edittingSong = song;

  }
  deleteSong(song: any): void {
    console.log('deleting song', song);
    const slipExists = this.slips.filter(obj => {
        return obj.song.id === song.id;
      });
    console.log(slipExists);
    if(slipExists.length > 0) {
      alert('cannot delete a song currently queued!');
    } else {
      if(window.confirm('This will permanently remove this song from the library! Procede?')) {
        this.songService.deleteSong(song.id).subscribe( result => {
          
          console.log(result);
          this.dataSource = this.dataSource.filter(s => {
            return s.id != song.id;
          })
          console.log(this.dataSource);
        })
      }
    }
  }
  youTubeReady(e:any) {
    console.log(e);
    console.log('checking...');
    console.log(e.target.playerInfo.videoData)
    if(e.target.playerInfo.videoData.isPlayable) {
      this.validSong = true;
    } else {
      this.validSong = false;
      //this.validatingSong = false;
    }
    
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
