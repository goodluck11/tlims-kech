import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from 'core/services/auth.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Router} from '@angular/router';
import {StorageService} from 'core/services/storage.service';
import {SharedService} from 'core/services/shared.service';
import {AuthService, FacebookLoginProvider, SocialUser} from 'angularx-social-login';
import {MsgService} from 'core/services/msg.service';
import {BaseComponent} from '../base.component';

@Component({
  selector: 'prefix-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLoading = false;
  user: SocialUser;
  loggedIn: boolean;

  constructor(protected fb: FormBuilder, protected toastr: MsgService, protected authService: AuthenticationService,
              protected router: Router, protected storageService: StorageService, protected sharedService: SharedService,
              protected authService1: AuthService) {
    super(fb, toastr, authService, router, storageService, sharedService);
  }

  ngOnInit() {
    this.authService.logout();
    // this.authService1.signOut();
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  fbLogin() {
    this.authService1.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.user = response;
        this.authUser(this.user.authToken);
      }
    );
  }

  authUser(token: string) {
    this.authService.fbLogin(token).pipe(untilDestroyed(this)).subscribe((data: any) => {
      super.handleResponse(data);
    }, (err) => {
      this.toastr.error(err);
    });
  }

  login() {
    this.isLoading = true;
    this.authService.login(this.loginForm.value).pipe(untilDestroyed(this)).subscribe((data: any) => {
      super.handleResponse(data);
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      this.toastr.error(err);
    });
  }

  ngOnDestroy(): void {
  }

}
