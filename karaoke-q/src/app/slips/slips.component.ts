import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import { Slip } from '../models/slip';
import { SlipService } from '../services/slip.service';
import { faTrashAlt, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-slips',
  templateUrl: './slips.component.html',
  styleUrls: ['./slips.component.scss']
})
export class SlipsComponent implements OnInit {

  @Input() slips: any[] = [];
  @Output() updatedSlips: EventEmitter<Slip[]> = new EventEmitter<Slip[]>();

  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faMinus = faMinus;
  isCollapsed = true;

  constructor(private slipService: SlipService,
              private title: Title, ) { }

  ngOnInit(): void {
    this.title.setTitle('slips');
    //console.log('initialing ', this.title.getTitle());
  }

  deleteSlip(slip: Slip): void {
    this.slips = this.slips.filter(obj => obj !== slip);
    if(slip.id) {
      this.slipService.deleteSlip(slip.id).subscribe();
      //emmit to dashboard
      this.updatedSlips.emit(this.slips);
    }    
  }

  editSlip(slip: any): void {
    this.slipService.updateSlip(slip).subscribe();
    this.slips = this.slips.map( (obj) => {
        if(obj.id === slip.id) {
          return {...obj, song: slip.song };
        }
        return obj;
      })
    //emmit to dashboard
    this.updatedSlips.emit(this.slips);

  }
  drop(event: CdkDragDrop<string[]>) {
    //heavy lifting moved to back end
    //TODO: there's a very brief loading spinner or somthing else funky going on with the queue refreshing, look into this
    //still WAY faster than it was doing this on front end

    //previousIndex is the item BEING dragged
    //currentIndex is the WHERE it is being dragged     

    
    if(event.previousIndex != event.currentIndex) {
      
      const payload = {
        slip : this.slips[event.previousIndex],
        draggedFrom : event.previousIndex,
        draggedTo : event.currentIndex,
        slips : this.slips,
      };

      this.slipService.dragDropSlip(payload).subscribe( result => {
        this.slips = result;
        //emmit to dashboard
        this.updatedSlips.emit(this.slips);
      });  
      
    }
  }
  


}
