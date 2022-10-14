import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpResponse, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { SpinnerService } from './services/spinner.service';

// credit to https://onthecode.co.uk/blog/angular-display-spinner-every-request/ for a very angular solution to all these spinners!
@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
	
	constructor(private spinnerService: SpinnerService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		this.spinnerService.show();

		return next.handle(req)
			.pipe(tap((event: HttpEvent<any>) => {
				if(event instanceof HttpResponse) {
					this.spinnerService.hide();
				}
			}, (error) => {
				this.spinnerService.hide();
			}));
	}
}