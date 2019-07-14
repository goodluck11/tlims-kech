import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AuthService} from 'core/services/auth.service';

@Injectable()
export class SharedService {

  $sharedModel = new BehaviorSubject<boolean>(this.authService.isLoggedIn());
  messages = this.$sharedModel.asObservable();

  constructor(private authService: AuthService) {
  }

  broadCast(data) {
    this.$sharedModel.next(data);
  }
}
