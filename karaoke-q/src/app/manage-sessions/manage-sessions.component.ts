import { Component, OnInit, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Session } from '../models/session';
import { SessionService } from '../services/session.service';
import { SingerService } from '../services/singer.service';
import { SlipService } from '../services/slip.service';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage-sessions',
  templateUrl: './manage-sessions.component.html',
  styleUrls: ['./manage-sessions.component.scss']
})
export class ManageSessionsComponent implements OnInit {

  @Input() sessions: Session[] = [];

  faTrashAlt = faTrashAlt;

  constructor(private sessionService: SessionService, 
    private singerService: SingerService, 
    private slipService:SlipService, 
    public activeModal: NgbActiveModal,
    ) { }

  ngOnInit(): void {
  }

  delete(session: Session): void {
    //Could move to backend?
    //Delete all the slips in the session, then delete all the singers, then delete the session, then update sessions   
    this.slipService.deleteSessionSlips(session.id).subscribe( result => {
      this.singerService.deleteSessionSingers(session.id).subscribe( result => {
        this.sessionService.deleteSession(session.id).subscribe( sessionResult => {
          this.sessions = this.sessions.filter(obj => obj !== session);
        }) ;
      });
    })
  }

}
