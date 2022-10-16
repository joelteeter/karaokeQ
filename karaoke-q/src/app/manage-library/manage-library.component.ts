import { Component, OnInit, Input } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CdkTableModule } from '@angular/cdk/table';
import { Sort } from '@angular/material/sort';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { Song } from '../models/song';
import { Slip } from '../models/slip';
import { SongService } from '../services/song.service';
import { SlipService } from '../services/slip.service';
import { EditSongComponent } from '../edit-song/edit-song.component';

@Component({
  selector: 'app-manage-library',
  templateUrl: './manage-library.component.html',
  styleUrls: ['./manage-library.component.scss']
})

export class ManageLibraryComponent implements OnInit {

  dataSource:Song[] = [];
  displayedColumns: string[] = ['artist', 'title', 'embedurl', 'ops'];
  slips:Slip[] = [];
  searchTerm: string = '';
  songs:Song[] = [];

  constructor(private songService: SongService,
              private slipService: SlipService,
              private modalService: NgbModal,
              public activeModal: NgbActiveModal,
              private title: Title, ) { }

  ngOnInit(): void {
    this.title.setTitle('manage-library');
    //console.log('initialing ', this.title.getTitle());

    //keep dataSource and songs lists seperate, to undo search/filter, etc.
    this.songService.getSongs().subscribe( (songs:any) => {
      this.songs = songs.data;
      this.dataSource = [...songs.data];
    });      
  }

  search(term: string): void {
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
    this.dataSource = this.songs.slice();
    this.searchTerm = '';
  }

  openEditModal(song: Song): void {
    const modalRef = this.modalService.open(EditSongComponent, {
      ariaLabelledBy: 'manage-sessions',
      scrollable: true,
      size: 'xl',
    });

    //passing shallow copy of song to 'child' component
    modalRef.componentInstance.edittingSong = {...song};

    //data coming from 'child' save click
    //on save, call api endpoint, update dataSource(shallow copy of songs), and update songs in case filters are rest
    //on anything else do nothing as it was cancelled
    modalRef.result.then( (data) => {
      //on close
      if(data) {
        this.songService.updateSong(modalRef.componentInstance.edittingSong).subscribe( result => {
          this.dataSource = this.dataSource.map( (obj) => {
            if(obj.id === data.id) {
              return data;
            } else {
              return obj;
            }
          })
          this.songs = this.songs.map( (obj) => {
            if(obj.id === data.id) {
              return data;
            } else {
              return obj;
            }
          })
        });
      } else {
        
      }    
    }, (reason) => {
      //on dismiss
      
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
  
  deleteSong(song: any): void {
    //this should be done better?, currently getting all slips to validate a song deleted doesn't exist in any of them
    //perhaps move to back end with a related returned result?
    this.slipService.getAllSlips().subscribe( (slips:any) => {
      this.slips = slips;
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
    });
  }
}

//sorting helper
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
