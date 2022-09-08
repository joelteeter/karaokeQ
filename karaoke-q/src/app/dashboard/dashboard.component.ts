import { Component, OnInit } from '@angular/core';

import { Singer } from '../models/singer';
import { SingerService } from '../services/singer.service';

import { Slip } from '../models/slip';
import { SlipService } from '../services/slip.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  singers: Singer[] = [];
  slips: Slip[] = [];
  newSlip: any = null;
  isAutoBalanceQueue = true;

  constructor(private singerService: SingerService, private slipService: SlipService) { }

  ngOnInit(): void {
    this.getSingers();
    this.getSlips();
  }

  getSingers(): void {
    //this won't come up much, using memory for now to populate some init data
    this.singerService.getSingers()
      .subscribe(singers => this.singers = singers);
  }
  
  getSlips(): void {
    //this won't come up much, using memory for now to populate some init data
    this.slipService.getSlips()
      .subscribe(slips => {
        this.slips = [];
        slips.forEach(slip => {
          slip.isCollapsed = true;
          this.slips.push(slip);
        })
        if(this.isAutoBalanceQueue){
          this.balanceQueue();
        }
      });
  }

  addSlip(slipToAdd: Slip): void {
    const lastPosition = Math.max(...this.slips.map(obj => obj.position));
    slipToAdd.position = lastPosition + 1;
    this.slipService.addSlip(slipToAdd).subscribe((slip) => {
      this.slips.push(slip);
      if(this.isAutoBalanceQueue) {
      this.balanceQueue();
    }
    });
  }

  updateSingers(singers: any): void {
    this.singers = singers;
    if(this.isAutoBalanceQueue) {
      this.balanceQueue();
    }

  }
  updateSlips(slips: any): void {
    this.slips = slips;
    console.log('emit caught')
    if(this.isAutoBalanceQueue) {
      this.balanceQueue();
    }
  }

  balanceQueue(): void {
    /*
      there has GOT to be a slicker way to do this...
      i'm breaking down the queue into peices with unique singers, then combining those pieces.
      each piece is a map of singer and song, if a slip has a singer who is already in a piece/map 
      then I add them to the next one that doesn't
    */

    const mapArray:any = [];
    const singerMap = new Map();

    //set the singer map, i can use this to determine how many pieces/maps I need
    for(let i = 0; i < this.slips.length; i++) {
      if(singerMap.has(this.slips[i].singer!.name)) {
        singerMap.set(this.slips[i].singer!.name, singerMap.get(this.slips[i].singer!.name) + 1)
      } else {
        singerMap.set(this.slips[i].singer!.name, 1)
      }
    }
    const maxMaps = Math.max(...singerMap.values());

    //create the pieces/maps
    for(let j = 0; j < maxMaps; j++) {
      mapArray.push(new Map());
    }
    
    //sort the slips into the pieces
    for(let s = 0; s < this.slips.length; s++) {
      for(let m = 0; m < maxMaps; m++) {
        //if singer doesn't have a slip in map[m], add one, then break from sub loop
        if(!mapArray[m].has(this.slips[s].singer!.name)){
          mapArray[m].set(this.slips[s].singer!.name, this.slips[s]);
          break;
        }
      }
    }

    //now for each piece, I grab the slips and push them to what will be the new queue;
    let newQueue:any[] = [];
    mapArray.forEach((map:any) => {
      map.forEach((a:any )=> {
        newQueue.push(a);
      })
    })

    //set the queue to the new queue
    this.slips = newQueue;
    
  }

}
