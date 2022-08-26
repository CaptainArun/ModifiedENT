import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoadingScreenService } from './loading-screen.service';

@Injectable()
export class LoadingScreenInterceptor implements HttpInterceptor {

  constructor(private loadingSvc: LoadingScreenService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.loadingSvc.show();
    return next.handle(request).pipe(
      finalize(() => this.loadingSvc.hide())
    );
  }
}
