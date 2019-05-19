import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AuthService} from 'core/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor Entered here');
    const token = this.authService.getToken();
    let authReq;
    if (token !== null) {
      authReq = req.clone({
        headers: req.headers.set('X-Authorization', token)
      });
      return next.handle(authReq);
    } else {
      authReq = req.clone({});
      return next.handle(authReq);
    }

  }
}
