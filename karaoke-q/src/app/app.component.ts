import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  //set loading according to interceptor
  loading$ = this.spinnerService.loading$.pipe(delay(0));
  title = 'karaoke-queu';

  constructor(public spinnerService: SpinnerService) { }

  ngOnInit(): void {
  }
}
