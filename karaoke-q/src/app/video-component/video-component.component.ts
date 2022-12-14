import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.scss']
})

export class VideoComponentComponent implements OnInit {
  @ViewChild('content') content!: ElementRef;
  @Input() slipVideo: any;
  @Input() settings: any;
  @Output() videoPlayerStatus: EventEmitter<any> = new EventEmitter<any>();
  
  apiLoaded:boolean = false;
  closeResult = '';
  screenWidth = 0;
  playerWidth = 0;

  constructor(private modalService: NgbModal, ) { }

  ngOnInit(): void {

    //TODO figure out a way to adjust screen size repsonsively
    this.screenWidth = window.innerWidth;
    if(this.screenWidth < 992) {
      this.playerWidth = this.screenWidth - 15;
    } else {
      this.playerWidth = 640;
    }
    if (!this.apiLoaded) {
      // This code loads the IFrame Player API code asynchronously, according to the instructions at
      // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
      // loading it this way doesn't let me fit it into a containing div though...
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  public onResizeHandler(event:any): void {
    //TODO: figure out a way to resize the iframe based on changing widths
    this.screenWidth = event.target.innerWidth;
  }

  open(content:any) {
    //next singer modal
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result === 'Save click') {
        this.videoPlayerStatus.emit('nextSinger');        
      }
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  requestValidation():void {
    //request video validated by admin
    this.videoPlayerStatus.emit('requestValidation');
  }

  youTubeReady(e:any) {
    //api callback from player
    // console.log(e);
    // console.log('player is ready now playing ', e.target.videoTitle);
    // console.log('playing song now', this.settings.autoPlay);
    if(this.settings.autoPlay) {
      e.target.playVideo();
    }
    
  }
  youTubeStateChange(e:any) {
    //api callback from player
    /*
    .data - the state value
    .target - the player
    -1 ??? unstarted
    0 ??? ended
    1 ??? playing
    2 ??? paused
    3 ??? buffering
    5 ??? video cued
    */
    //console.log('player is changing state');
    switch(e.data) {
      case -1: 
        //console.log('player is unstarted ', e.target.videoTitle);
        break;
      
      case 0 :
        //video done playing, open the next singer modal
        if(this.slipVideo.length > 1) {
          this.open(this.content);
        } else {
          alert('get some more songs in there!');
        }
        break;        
      
      case 1 :
        //console.log('player is playing ', e.target.videoTitle);
        break;
      
      case 2 :
        //console.log('player is paused ', e.target.videoTitle);
        break;
      
      case 3 :
        //console.log('player is buffering ', e.target.videoTitle);
        break;
      
      case 5 :
        //video is ready to play, if autoplay setting then play the video
        //console.log('player is video cued ', e.target.videoTitle);
        if(this.settings.autoPlay) {
          e.target.playVideo();
        }
        break;
      
      default: 
        //console.log('player is ???? ', e.target.videoTitle);
        break;
      
    }
    //console.log(e);

  }
  youTubeError(e:any) {
    //api callback from player
    //console.log('player has errored!');
    //console.log(e);
  }
  youTubeApiChange(e:any) {
    //api callback from player
    //console.log('player api change');
    //console.log(e);
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
