import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() sessionId: number = 0;

  @Output() singersUpdate: EventEmitter<Singer[]> = new EventEmitter<Singer[]>();
  @Output() slipsUpdate: EventEmitter<Slip[]> = new EventEmitter<Slip[]>();

  updatedSlips: Slip[] = [];
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  selectedSinger?: any = null;
  editting: boolean = false;
  closeResult = '';

  constructor(private singerService: SingerService, 
              private slipService: SlipService, 
              private modalService: NgbModal,
              private title: Title, ) { }

  ngOnInit(): void {
    this.title.setTitle('singers');
    //console.log('initialing ', this.title.getTitle());
  }

    open(content:any) {

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      scrollable: false,
    }).result.then((result) => {
      if(result === 'Done click') {
        //don't do anything        
      }
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteSinger(singer: Singer): void {
    //Need to delete the slips assigned to the singer being deleted as well
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

  updateSinger(singer: any): void {
    //Need to update the slips assigned to the updated singer as well
    if(!singer.song && singer.id) {
      //updating singer
      this.singerService.updateSinger(singer).subscribe(() => {
        this.updateSlips(singer);       
      })
    } else {
      //adding singer
      this.singerService.addSinger(singer, this.sessionId).subscribe((singerResult) => {
        this.singers.push(singerResult);
        if(singer.song.id) {
          this.addSlip(singerResult, singer.song);
        }
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

  addSlip(singer: any, song: any) {
    //adding slip for new singer, calc the position and push to array
    const lastPosition = Math.max(...this.slips.map(obj => obj.position));
    if(this.sessionId > 0 ) {
      this.slipService.addSlip(
        { 
          sessionId: this.sessionId, 
          singer: singer, 
          song: song, 
          isCollapsed: true, 
          position: lastPosition > 0 ? lastPosition+1 : 1
        }).subscribe((slip) => {
        this.slips.push(slip);
        this.slipsUpdate.emit(this.slips);
        } )
    }
    
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
