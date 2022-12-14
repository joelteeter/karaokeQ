import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Singer } from '../models/singer';
import { Song } from '../models/song';
import { Slip } from '../models/slip';
import { SlipService } from '../services/slip.service';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-slip-detail',
  templateUrl: './slip-detail.component.html',
  styleUrls: ['./slip-detail.component.scss']
})
export class SlipDetailComponent implements OnInit {

  @Input() singers: Singer[] = [];
  @Input() slip: any = null;
  @Output() newSlip: EventEmitter<any> = new EventEmitter<any>();

  selectedSinger: any = {};
  selectedSong: any = {};
  closeResult = '';
  faEdit = faEdit;

  constructor(private modalService: NgbModal, ) { }

  ngOnInit(): void {
  }

  open(content:any) {
    //Open slip detail modal with the content template
    //TODO: make this a modal with it's own component - like manage-library
    this.selectedSong = null;
    if(this.slip) {
      this.selectedSinger = this.slip.singer;
    } else {
      this.selectedSinger = null;
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result === 'Save click') {
        //saving slip from modal
        this.saveSlip(this.slip);
      }
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }  

  selectSinger(singer:Singer) {
    this.selectedSinger = singer;
  }

  selectSong(song: Song) {
    this.selectedSong = song;
  }

  saveSlip(slip: any = null): void {
    //emmits saved slip to parent (dashboard or slips)
    if(slip) {
      this.newSlip.emit({...slip, song: this.selectedSong });
    } else {
      this.newSlip.emit({
        singer: this.selectedSinger,
        song: this.selectedSong,
        isCollapsed: true,        
      });
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
