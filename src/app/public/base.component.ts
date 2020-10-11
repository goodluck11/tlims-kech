import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MsgService} from 'core/services/msg.service';
import {AuthenticationService} from 'core/services/auth.service';
import {Router} from '@angular/router';
import {StorageService} from 'core/services/storage.service';
import {SharedService} from 'core/services/shared.service';
import {AuthService} from 'angularx-social-login';

@Component({
  selector: '',
  template: '',
  styles: [``]
})
export class BaseComponent {

  constructor(protected fb: FormBuilder, protected toastr: MsgService, protected authService: AuthenticationService,
              protected router: Router, protected storageService: StorageService, protected sharedService: SharedService) {
  }

  handleResponse(data) {
    if (data.token) {
      this.storageService.save({key: 'currentUser', data: data});
      this.router.navigateByUrl(this.authService.getRedirectUrl() ? this.authService.getRedirectUrl() : '/tlims/bo');
      const user = JSON.parse(data.user);
      this.toastr.success('Welcome ' + user.firstName + ' ' + user.lastName);
      this.authService.removeRedirectUrl();
      this.sharedService.broadCast(true);
    }
  }
}
