import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// credit to https://onthecode.co.uk/blog/angular-display-spinner-every-request/ for a very angular solution to all these spinners!
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  visibility: BehaviorSubject<boolean>;

  constructor() {
    this.visibility = new BehaviorSubject(false); 
  }

  show() {
    this.visibility.next(true);
  }

  hide() {
    this.visibility.next(false);
  }
}
