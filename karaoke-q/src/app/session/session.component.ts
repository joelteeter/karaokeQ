import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../models/session';
import { SessionService } from '../services/session.service';


@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  sessions: Session[] = [];
  newSession: Session = {} as Session;

  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit(): void {
    this.getSessions();
  }

  getSessions(): void {
    this.sessionService.getSessions().subscribe( sessions => {
      this.sessions = sessions
    })
  }

  add(name: string): void {
    name = name.trim();
    if(!name) {
      return;
    }
    this.sessionService.addSession({ name } as Session).subscribe( session => {
      this.sessions.push(session);
      console.log('the created session', session);
      this.router.navigate([`/session/${session.id}`]);
      //TODO: ensure session is coming from API correct
      //TODO: goto route /session/session.id/ to show that sessions dashboard
    })
  }

}
