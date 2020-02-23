import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthenticationService} from 'core/services/auth.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Router} from '@angular/router';
import {StorageService} from 'core/services/storage.service';
import {SharedService} from 'core/services/shared.service';
import {AuthService, FacebookLoginProvider, SocialUser} from 'angularx-social-login';

@Component({
  selector: 'prefix-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLoading = false;
  user: SocialUser;
  loggedIn: boolean;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private authService: AuthenticationService,
              private router: Router, private storageService: StorageService, private sharedService: SharedService,
              private authService1: AuthService) {
  }

  ngOnInit() {
    this.authService.logout();
    // this.authService1.signOut();
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [null],
      password: [null],
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
      this.handleResponse(data);
    }, (err) => {
      if (err.error) {
        if (err.error.message) {
          this.toastr.error(err.error.message);
        }
      }
    });
  }

  login() {
    this.isLoading = true;
    this.authService.login(this.loginForm.value).pipe(untilDestroyed(this)).subscribe((data: any) => {
      this.handleResponse(data);
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      if (err.error) {
        if (err.error.errorCode) {
          this.toastr.error(err.error.message);
        }
      }
    });
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

  ngOnDestroy(): void {
  }

}
