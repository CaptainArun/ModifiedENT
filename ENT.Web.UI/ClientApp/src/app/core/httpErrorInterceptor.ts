import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


export class ErrorMsg {
  public ErrorCode: number;
  public Status: string;
  public Message: string;
}
export class HttpErrorInterceptor implements HttpInterceptor {

  addToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('token');
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(this.addToken(request))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errMsg = new ErrorMsg();
          // Client Side Error
          if (error.error) {
            errMsg.Message = `Error: ${error.error.message}`;
          } else {
            // Server Side Error
            errMsg.ErrorCode = error.status;
            errMsg.Message = error.message;
            errMsg.Status = error.statusText;
          }

          return throwError(errMsg);
        })
      );
  }


}
