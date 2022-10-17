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
    this.title.setTitle('dashboard');
    //console.log('initialing ', this.title.getTitle());

    //Get valid session or redirect back to sessions component
    this.route.paramMap.subscribe( (params: ParamMap) =>
      {
        this.sessionId = params.get('id');
        this.sessionService.getSession(this.sessionId).subscribe( (result:any) => {
          if(result.length > 0) {
            this.session = result;
          } else {
            //invalid session, go home
            this.session = null;
            this.router.navigate(['/']);
          }
        });
      }
    );

    //TODO: move getSingers to child components? would probably need to have those children deal with related services too...
    this.getSingers();

    this.getSlips();
  }

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
    this.singerService.getSingers(this.sessionId)
    .subscribe(singers => {
      this.singers = singers;
    });
  }
  
  getSlips(): void {
    this.slipService.getSlips(this.sessionId)
    .subscribe(slips => {
      this.slips = [];
      slips.forEach(slip => {
        slip.isCollapsed = true;
        this.slips.push(slip);
      })
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
    /* capturing the emit from singers component */
    //TODO: move singers to children component(s) have dashboard just deal with slips
    this.singers = singers;
    if(this.settings.isAutoBalanceQueue) {
      this.balanceQueue();
    }

  }

  updateSlips(slips: any): void {
    /* called when slips needs updating */
    this.slips = slips;
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
    /*
      i'm breaking down the queue into peices with unique singers, then combining those pieces.
      each piece is a map of singer and song, if a slip has a singer who is already in a piece/map 
      then I add them to the next one that doesn't
    */
    //TODO: move this to the backend, getSlipsBySessionId expect a result of array slip id, pos pairs then sort frontend's array accordingly

    const mapArray:any = [];
    const singerMap = new Map();

    //set the singer map, i can use this to determine how many pieces/maps I need
    //  foreach slip, map singer, to how many songs they have
    //  the max will be how many 'chunks' of the queue i need
    for(let i = 0; i < this.slips.length; i++) {
      if(singerMap.has(this.slips[i].singer!.id)) {
        singerMap.set(this.slips[i].singer!.id, singerMap.get(this.slips[i].singer!.id) + 1)
      } else {
        singerMap.set(this.slips[i].singer!.id, 1)
      }
    }
    const maxMaps = Math.max(...singerMap.values());

    //create the pieces/maps
    // creating them in memory so i loop through them and can assign values later
    for(let j = 0; j < maxMaps; j++) {
      mapArray.push(new Map());
    }
    
    //sort the slips into the pieces
    //  for each slip, see if a piece has a slip for the slip's singer
    //    if so, skip this piece and go on to the next
    //    if not, add this slip into the piece
    for(let s = 0; s < this.slips.length; s++) {
      for(let m = 0; m < maxMaps; m++) {
        //if singer doesn't have a slip in map[m], add one, then break from sub loop
        if(!mapArray[m].has(this.slips[s].singer!.id)){
          mapArray[m].set(this.slips[s].singer!.id, this.slips[s]);
          break;
        }
      }
    }

    //now for each piece, I grab the slips within and push them to what will be the new queue;
    // TODO: this mass update isn't great, could possibly send an array of just slip id and pos instead of so many smaller updates...
    let newQueue:any[] = [];
    let count = 1;
    mapArray.forEach((map:any) => {
      map.forEach((a:any )=> {
        a.position = count;
        newQueue.push(a);
        this.slipService.updateSlip(a).subscribe();
        count++;
      })
    })

    //set the queue to the new queue
    this.slips = newQueue;
    
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
