import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
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
    //TODO: move this to the backend, send slip ID, prev pos, current pos - expect a result of... array of slips ordered correctly and then sort them by that order on frontend?
    //previousIndex is the item BEING dragged
    //currentIndex is the WHERE it is being dragged

    const droppedPosition = this.slips[event.currentIndex].position;
    if(event.previousIndex != event.currentIndex) {
      //if moving DOWN the queue, need to offset things above its drop point
      //if moving UP the queue, need to offset things below its drop point
      //Then need to update the thing being dropped

      if(event.previousIndex < event.currentIndex) {
        //was moved DOWN the queue
        for(let i=event.previousIndex; i <= event.currentIndex; i ++) {
          this.slips[i].position -= 1;
          this.slipService.updateSlip(this.slips[i]).subscribe();
        }
      } else if (event.previousIndex > event.currentIndex) {
        //was moved UP the queue
        for(let i=event.currentIndex; i < event.previousIndex; i++) {
          this.slips[i].position += 1;
          this.slipService.updateSlip(this.slips[i]).subscribe();
        }
      }
      this.slips[event.previousIndex].position = droppedPosition;
      this.slipService.updateSlip(this.slips[event.previousIndex]).subscribe();
      moveItemInArray(this.slips, event.previousIndex, event.currentIndex);
      this.updatedSlips.emit(this.slips);
    }
  }
  


}
