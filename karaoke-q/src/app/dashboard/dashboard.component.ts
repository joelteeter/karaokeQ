import { Component, OnInit } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../services/session.service';
import { Singer } from '../models/singer';
import { SingerService } from '../services/singer.service';
import { Slip } from '../models/slip';
import { SlipService } from '../services/slip.service';
import { SongService } from '../services/song.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  sessionId?: any;
  session?: any = [];
  singers: Singer[] = [];
  slips: Slip[] = [];
  newSlip: any = null;
  settings: any = {
    isAutoBalanceQueue: true,
    autoPlay: false,
  }  
  closeResult = '';

  constructor(private singerService: SingerService, 
    private slipService: SlipService, 
    private songService: SongService,
    private sessionService: SessionService,  
    private modalService: NgbModal, 
    private route: ActivatedRoute,
    private router: Router,
    private title: Title ) { }

  ngOnInit(): void {
    this.title.setTitle('Karaoke Queue Session Dashboard');

    //Get valid session or redirect back to sessions component
    this.route.paramMap.subscribe( (params: ParamMap) =>
      {
        this.sessionId = params.get('id');
        this.sessionService.getSession(this.sessionId).subscribe( (result:any) => {
          if(result.length > 0) {
            this.session = result;
            this.title.setTitle(`${this.session[0].name} Karaoke Dashboard`);
          } else {
            //invalid session, go home
            this.session = null;
            this.router.navigate(['/']);
          }
        });
      }
    );

    //TODO: move getSingers to child components? would probably need to have those children deal with related services too...
    //Getting singers and slips
    this.getSingers();
    this.getSlips();
  }

  goToSessions(): void {
    this.router.navigate(['/']);
  }

  //How to modal
  openHowTo(content:any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'how-to-karaoke',
      scrollable: true,
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getSingers(): void {
    //get singers for this session
    this.singerService.getSingers(this.sessionId)
    .subscribe(singers => {
      this.singers = singers;
    });
  }
  
  getSlips(): void {
    //get slips for this session
    this.slipService.getSlips(this.sessionId)
    .subscribe(slips => {
      this.slips = [];
      slips.forEach(slip => {
        slip.isCollapsed = true;
        this.slips.push(slip);
      })

      //if set, balance the slips
      if(this.settings.isAutoBalanceQueue){
        this.balanceQueue();
      }
    });
  }

  addSlip(slipToAdd: Slip): void {
    /*
      Find the last position, then add one
      If no last position set it to 1
      Add the slip
    */
    let lastPosition = 0;
    if(this.slips.length > 0) {
      lastPosition = Math.max(...this.slips.map(obj => obj.position));
    }
    
    slipToAdd.position = lastPosition ? lastPosition + 1 : 1;
    slipToAdd.sessionId = this.sessionId;
    this.slipService.addSlip(slipToAdd).subscribe((slip) => {
      this.slips.push(slip);
      if(this.settings.isAutoBalanceQueue) {
        this.balanceQueue();
      }
    });
  }

  updateSingers(singers: any): void {
    /* capturing the emitted singers from singers component */
    //TODO: move singers to children component(s) have dashboard just deal with slips
    this.singers = singers;

    //if set balance the queue
    if(this.settings.isAutoBalanceQueue) {
      this.balanceQueue();
    }

  }

  updateSlips(slips: any): void {
    /* capturing the emitted slips from slips component*/
    this.slips = slips;

    //if set, balance the queue
    if(this.settings.isAutoBalanceQueue) {
      this.balanceQueue();
    }
  }

  updateVideoPlayerStatus(e: any): void {
    /*  Update the video player 
        go to next video if nextSinger event
        update request if validation requested
    */
    //console.log('updating video player status: ', e);
    if(e === 'nextSinger') {
      this.slipService.deleteSlip(Number(this.slips[0].id)).subscribe( () => {
        this.slips.shift();
      });
    }
    if(e === 'requestValidation') {
      if(this.slips[0] && this.slips[0].song) {
        this.slips[0].song.validation_requested = true;
        this.songService.updateSong(this.slips[0].song).subscribe();
      }
    }
  }

  balanceQueue(): void {
    //balance the queue to ensure fairness
    //TODO: mybe preserve order of first queue 'chunk' and replicate to following queue 'chunks'
    this.slipService.updateBalancedSlips(this.slips).subscribe( balancedSlips => {
      this.slips = balancedSlips;
    });
    
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
