import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';
import { YoutubeService } from '../services/youtube.service';

@Component({
  selector: 'app-update-library',
  templateUrl: './update-library.component.html',
  styleUrls: ['./update-library.component.scss']
})
export class UpdateLibraryComponent implements OnInit {

  validSong:boolean = false;
  validatingSong:boolean = false;
  closeResult = '';
  newSong: Song = {} as Song;

  constructor(private songService: SongService, private youtubeService: YoutubeService, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(content:any) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result === 'Save click') {
        if(this.newSong.artist && this.newSong.title && this.newSong.embedurl) {
          this.submitNewSong();
          
        }
        
        
      }
      this.validSong = false;
      this.newSong = {} as Song;
      this.validatingSong = false;
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  checkSong(): void {
    this.validatingSong = true;
    
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

  submitNewSong(): void {
    this.songService.addSong(this.newSong).subscribe();
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
