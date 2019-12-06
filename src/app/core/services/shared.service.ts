import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AuthenticationService} from 'core/services/auth.service';

@Injectable()
export class SharedService {

  $sharedModel = new BehaviorSubject<boolean>(this.authService.isLoggedIn());
  messages = this.$sharedModel.asObservable();

  constructor(private authService: AuthenticationService) {
  }

  broadCast(data) {
    this.$sharedModel.next(data);
  }
}
