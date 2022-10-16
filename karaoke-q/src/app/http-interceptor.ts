import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SpinnerService } from './services/spinner.service';

// credit to https://zoaibkhan.com/blog/how-to-add-loading-spinner-in-angular-with-rxjs/ for a very angular solution to all these spinners!
@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

  totalRequests = 0;
  requestsCompleted = 0;

  constructor(private loader: SpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    this.loader.show();
    this.totalRequests++;

    return next.handle(request).pipe(
      finalize(() => {

        this.requestsCompleted++;

        if (this.requestsCompleted === this.totalRequests) {
          this.loader.hide();
          this.totalRequests = 0; 
          this.requestsCompleted = 0;
        }
      })
    );
  }
}