import { Component, OnInit } from '@angular/core';
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
  //isAdmin: boolean = false;
  isAdmin: boolean = true;

  constructor(private sessionService: SessionService,
              private router: Router,
              private modalService: NgbModal,
              public spinnerService: SpinnerService,
              private title: Title, ) { }

  ngOnInit(): void {
    this.title.setTitle('sessions');
    //console.log('initialing ', this.title.getTitle());
    this.getSessions();
  }

  getSessions(): void {
    this.sessionService.getSessions().subscribe( sessions => {
      this.sessions = sessions
    })
  }

  isMagicWord(str: string): void {
    //TODO: add users and roles, this is a bad workaround for now
    if(str.toLowerCase() == 'pretty please') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  add(name: string): void {
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
    const modalRef = this.modalService.open(ManageLibraryComponent, {
      ariaLabelledBy: 'manage-song-library',
      scrollable: true,
      size: 'xl',
    });
  }
  openSessionManager(): void {
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
