import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from 'core/services/auth.service';
import {tap} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq;
    if (token !== null) {
      authReq = req.clone({
        headers: req.headers.set('X-Authorization', token)
      });
      return next.handle(authReq).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        }, error => {
          if (error instanceof HttpErrorResponse) {
            console.log(error);
            if (error.error && error.error['code'] === 16) {
              this.toastr.error('File size exceeds limit!', 'Error',
                {tapToDismiss: true, disableTimeOut: false, positionClass: 'toast-top-right'});
            }
          }
        })
      );
    } else {
      authReq = req.clone({});
      return next.handle(authReq);
    }

  }
}
