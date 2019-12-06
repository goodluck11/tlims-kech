import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from 'core/model/user';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  currentUser$ = new BehaviorSubject<User>(null);
  messages = this.currentUser$.asObservable();


  broadCast(data) {
    this.currentUser$.next(data);
  }
}
