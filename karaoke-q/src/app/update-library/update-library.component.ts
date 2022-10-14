import { Component, OnInit } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
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

  constructor(private songService: SongService, private youtubeService: YoutubeService, private modalService: NgbModal,
              private title: Title, ) { }

  ngOnInit(): void {
    this.title.setTitle('update-library');
    console.log('initialing ', this.title.getTitle());
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

  checkForUrl(e:any): void {
    //TODO: make this experience better
    //check for youtube link
    if(this.newSong.embedurl.toLowerCase().includes('?v=')) {
      //is a youtube link - should have ?v=xxxxxx as a query parameter
      //i want what's between the last /?v= and the first &, or everything after /?v=
      var newLinkString = this.newSong.embedurl.slice(this.newSong.embedurl.indexOf('?v=') + 3, this.newSong.embedurl.indexOf('&') > 0 ? this.newSong.embedurl.indexOf('&') : this.newSong.embedurl.length);
      this.newSong.embedurl = newLinkString;
    }
    //check for youtube embed link
    /*
    with a parameter
    <iframe width="560" height="315" src="https://www.youtube.com/embed/Tqr59JXrFCk?start=28" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    without a parameter
    <iframe width="560" height="315" src="https://www.youtube.com/embed/Tqr59JXrFCk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    ! even better, the lenght of a youtube video id is 11, just get index of /embed/ + 11
    */
    if(this.newSong.embedurl.toLowerCase().includes('/embed/')) {
      //is a youtube embed link, should have the id after '/embed'
      //i want whats between '/embed/' and the first ?, or the NEXT "
      var newEmbedString = this.newSong.embedurl.slice(this.newSong.embedurl.indexOf('/embed/') + 7, this.newSong.embedurl.indexOf('/embed/') + 7 + 11);
      this.newSong.embedurl = newEmbedString;
    }
  }

  youTubeReady(e:any) {
    console.log('checking...');
    console.log(e.target.playerInfo.videoData)
    if(e.target.playerInfo.videoData.isPlayable) {
      this.validSong = true;
    } else {
      this.validSong = false;
      //this.validatingSong = false;
    }
    
  }

    youTubeStateChange(e:any) {
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
