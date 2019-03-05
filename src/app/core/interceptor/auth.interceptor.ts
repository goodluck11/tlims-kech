import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var currentUser = JSON.parse(localStorage.getItem('token'));
    let authReq;
    if (currentUser !== null) {
      //console.log(currentUser);
      var token = currentUser.token;

      authReq = req.clone({
        headers: req.headers.set('X-Authorization', token)
      });
      //console.log(authReq);
      return next.handle(authReq);
    } else {
      authReq = req.clone({});
      //console.log(authReq);
      return next.handle(authReq);
    }

  }
}
