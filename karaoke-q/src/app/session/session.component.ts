import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Session } from '../models/session';
import { SessionService } from '../services/session.service';
import { SpinnerService } from '../services/spinner.service';

import { ManageLibraryComponent } from '../manage-library/manage-library.component';
import { ManageSessionsComponent } from '../manage-sessions/manage-sessions.component';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  sessions: Session[] = [];
  newSession: Session = {} as Session;
  magicWord: string = '';
  isAdmin: boolean = false;

  constructor(private sessionService: SessionService,
              private router: Router,
              private modalService: NgbModal,
              public spinnerService: SpinnerService,
              private title: Title, ) { }

  ngOnInit(): void {
    this.title.setTitle('Karaoke Queue Sessions');

    //get the sessions
    this.getSessions();

    //check env isAdmin
    if(environment && environment.isAdmin) {
      this.isAdmin = true;
    }
  }

  getSessions(): void {
    this.sessionService.getSessions().subscribe( sessions => {
      this.sessions = sessions
    })
  }

  isMagicWord(str: string): void {
    //TODO: add users and roles, this is a bad workaround for now
    //disable buttons if no magic word
    if(str.toLowerCase() == 'pretty please') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  add(name: string): void {
    //Add a session, then navigate to the session
    name = name.trim();
    if(!name) {
      return;
    }
    this.sessionService.addSession({ name } as Session).subscribe( session => {
      this.sessions.push(session);
      this.router.navigate([`/session/${session.id}`]);
    })
  }

  openLibraryManager(): void {
    //library manager modal with manage-library component
    const modalRef = this.modalService.open(ManageLibraryComponent, {
      ariaLabelledBy: 'manage-song-library',
      scrollable: true,
      size: 'xl',
    });
  }

  openSessionManager(): void {
    //session manager modal with manage-session component
    const modalRef = this.modalService.open(ManageSessionsComponent, {
      ariaLabelledBy: 'manage-sessions',
      scrollable: true,
      size: 'xl',
    });

    //this is how to pass things into the modal components
    modalRef.componentInstance.sessions = this.sessions;

    //after it's been closed
    /* generic result
    modalRef.result.then( (data) => {
      //on close
      console.log('closed modal', data);
    }, (reason) => {
      //on dismiss
      console.log('dismissed modal', reason);
    });
    */

    modalRef.result.then( (data) => {
      //on close
      this.getSessions();
    }, (reason) => {
      //on dismiss
      this.getSessions();
    });
  }

}
