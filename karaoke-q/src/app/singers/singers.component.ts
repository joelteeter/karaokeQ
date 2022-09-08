import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Singer } from '../models/singer';
import { SingerService } from '../services/singer.service';

import { Slip } from '../models/slip';
import { SlipService } from '../services/slip.service';

import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-singers',
  templateUrl: './singers.component.html',
  styleUrls: ['./singers.component.scss']
})
export class SingersComponent implements OnInit {

  @Input() singers: Singer[] = [];
  @Input() slips: Slip[] = [];

  @Output() singersUpdate: EventEmitter<Singer[]> = new EventEmitter<Singer[]>();
  @Output() slipsUpdate: EventEmitter<Slip[]> = new EventEmitter<Slip[]>();

  updatedSlips: Slip[] = [];
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  selectedSinger?: any = null;
  editting: boolean = false;

  constructor(private singerService: SingerService, private slipService: SlipService) { }

  ngOnInit(): void {
  }

  deleteSinger(singer: Singer): void {
    this.singers = this.singers.filter(obj => obj !== singer);
    this.singerService.deleteSinger(singer.id).subscribe(() => {
      this.singersUpdate.emit(this.singers);
    });

    this.slips.forEach(slip => {
      //this.slips = this.slips.filter(obj => obj.singer.id !== singer.id);
      if(slip.singer && slip.singer.id === singer.id) {
        if(slip.id){
          this.slipService.deleteSlip(slip.id).subscribe();
          this.deleteSlip(slip);
        }
      }
    });
    
  }

  newSinger(): void {
    this.selectedSinger = {};
    this.editting = true;
  }

  editSinger(singer: Singer): void {
    this.selectedSinger = singer;
    this.editting = true;
  }

  updateSinger(s: Singer): void {
    if(s.id) {
      this.singerService.updateSinger(s).subscribe(() => {
        this.updateSlips(s);       
      })
    } else {
      this.singerService.addSinger(s).subscribe((singer) => {
        this.singers.push(singer);
        this.addSlip(singer);
      })
    }
    this.editting = false;
  }

  editCancelled(event: boolean) {
    this.selectedSinger = null;
    this.editting = false;
  }

  updateSlips(singer: Singer): void {
    this.slips.forEach(slip => {
      if(slip.singer && singer.id && slip.singer.id === singer.id) { 
        slip.singer = singer;       
        this.slipService.updateSlip(slip).subscribe();
      }
    });
  }

  deleteSlip(slipToDelete:Slip): void {
    this.slipsUpdate.emit(this.slips.filter((slip) => {
      return slip.singer!.id !== slipToDelete.singer!.id
    }));
  }

  addSlip(singer: any) {
    const lastPosition = Math.max(...this.slips.map(obj => obj.position));
    this.slipService.addSlip({ singer: singer, song: singer.song, isCollapsed: true, position: lastPosition+1}).subscribe((slip) => {
      this.slips.push(slip);
      this.slipsUpdate.emit(this.slips);
      } )
    
  }

}
