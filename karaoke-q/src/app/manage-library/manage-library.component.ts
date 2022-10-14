import { Component, OnInit, Input } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {CdkTableModule} from '@angular/cdk/table';
import {Sort} from '@angular/material/sort';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { Song } from '../models/song';
import { Slip } from '../models/slip';
import { SongService } from '../services/song.service';
import { SlipService } from '../services/slip.service';

@Component({
  selector: 'app-manage-library',
  templateUrl: './manage-library.component.html',
  styleUrls: ['./manage-library.component.scss']
})
export class ManageLibraryComponent implements OnInit {

  validSong:boolean = false;
  validatingSong:boolean = true;
  closeResult = '';
  dataSource:Song[] = [];
  displayedColumns: string[] = ['artist', 'title', 'embedurl', 'ops'];
  slips:Slip[] = [];
  searchTerm: string = '';
  songs:Song[] = [];

  edittingSong:Song = {} as Song;

  constructor(private songService: SongService,
              private slipService: SlipService,
              private modalService: NgbModal,
              public activeModal: NgbActiveModal,
              private title: Title, ) { }

  ngOnInit(): void {
    this.title.setTitle('manage-library');
    console.log('initialing ', this.title.getTitle());
    this.songService.getSongs().subscribe( (songs:any) => {
      console.log(songs);
      this.songs = songs.data;
      this.dataSource = [...songs.data];
    });

    //this should be done better, currently getting all slips to validate a song deleted doesn't exist in any of them
    this.slipService.getAllSlips().subscribe( (slips:any) => {
      this.slips = slips;
    }); 
    
  }

  //push term into observable stream
  search(term: string): void {
    console.log(term);
    this.dataSource = this.songs.filter( (el) => {
      if(!el.title.toLowerCase().includes(term.toLowerCase()) && !el.artist.toLowerCase().includes(term.toLowerCase())){
        return false
      }
      return true;
    })
  }

  sortData(sort: Sort) {
    const data = this.songs.slice();
    if(!sort.active || sort.direction === '') {
      this.dataSource = data;
      return;
    }

    this.dataSource = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'artist':
          return compare(a.artist, b.artist, isAsc);
        case 'title':
          return compare(a.title, b.title, isAsc);
        default:
          return 0;          
      }
    })
  }

  filterFlagged(): void {
    this.dataSource = this.songs.filter( el => {
      if(el.validation_requested) {
        return true;
      }
      return false;
    })
  }

  clearFilter(): void {
    this.dataSource = [...this.songs];
    this.searchTerm = '';
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
        return obj.song!.id === song.id;
      });
    if(slipExists.length > 0) {
      alert('cannot delete a song currently queued!');
    } else {
      if(window.confirm('This will permanently remove this song from the library! Procede?')) {
        this.songService.deleteSong(song.id).subscribe( result => {
          
          this.dataSource = this.dataSource.filter(s => {
            return s.id != song.id;
          })
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

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
