import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

  constructor(private slipService: SlipService) { }

  ngOnInit(): void {
  }

  deleteSlip(slip: Slip): void {
    this.slips = this.slips.filter(obj => obj !== slip);
    if(slip.id) {
      this.slipService.deleteSlip(slip.id).subscribe();
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
    this.updatedSlips.emit(this.slips);

  }
  drop(event: CdkDragDrop<string[]>) {
    if(event.previousIndex < event.currentIndex) {
      this.slips[event.previousIndex].position = this.slips[event.currentIndex].position + 1;
      for(let i=event.previousIndex; i <= event.currentIndex; i ++) {
        this.slips[i].position -= 1;
      }
    } else if (event.previousIndex > event.currentIndex) {
      this.slips[event.previousIndex].position = this.slips[event.currentIndex].position;
      for(let i=event.currentIndex; i < event.previousIndex; i++) {
        this.slips[i].position += 1;
      }
    }
    moveItemInArray(this.slips, event.previousIndex, event.currentIndex);
    //console.log('emitting drop');
    this.updatedSlips.emit(this.slips);
    
  }
  


}
