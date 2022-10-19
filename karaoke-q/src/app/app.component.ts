import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  loading$ = this.spinnerService.loading$.pipe(delay(0));
  title = 'karaoke-queu';

  constructor(public spinnerService: SpinnerService) { }

  ngOnInit(): void {
  }
}
