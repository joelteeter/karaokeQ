import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
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

  constructor(private slipService: SlipService, ) { }

  ngOnInit(): void {
  }

  deleteSlip(slip: Slip): void {
    //delete a slip, then emmit to dashboard
    this.slips = this.slips.filter(obj => obj !== slip);
    if(slip.id) {
      this.slipService.deleteSlip(slip.id).subscribe();
      //emmit to dashboard
      this.updatedSlips.emit(this.slips);
    }    
  }

  editSlip(slip: any): void {
    //edit a slip, then emmit to dashboard
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
    //TODO: there's a very brief loading spinner or somthing else funky going on with the queue refreshing, look into this
    //started happening when moved to backend, look into the material drag/drop

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
        //emmit to dashboard
        this.updatedSlips.emit(result);
      });
      //from material dragdrop makes the dropping smoother  
      moveItemInArray(this.slips, event.previousIndex, event.currentIndex);
    }
  }
  


}
