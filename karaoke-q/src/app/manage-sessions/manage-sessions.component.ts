import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../models/session';
import { SessionService } from '../services/session.service';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage-sessions',
  templateUrl: './manage-sessions.component.html',
  styleUrls: ['./manage-sessions.component.scss']
})
export class ManageSessionsComponent implements OnInit {

  sessions: Session[] = [];
  newSession: Session = {} as Session;

    faTrashAlt = faTrashAlt;

  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit(): void {
    this.getSessions();
  }

  getSessions(): void {
    this.sessionService.getSessions().subscribe( sessions => {
      this.sessions = sessions
    })
  }

  delete(session: Session): void {
    this.sessionService.deleteSession(session.id).subscribe( session => {
      this.getSessions();
    })
  }

}
