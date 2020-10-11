import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MsgService} from 'core/services/msg.service';
import {AuthenticationService} from 'core/services/auth.service';
import {Router} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {Location} from '@angular/common';

@Component({
  selector: 'tlims-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  emailControl: FormControl;
  isLoading = false;

  constructor(private fb: FormBuilder, private toastr: MsgService, private authService: AuthenticationService,
              private router: Router, private location: Location) {
    this.emailControl = new FormControl(null, [Validators.email, Validators.required]);
  }

  ngOnInit() {
  }

  submit() {
    const email = String(this.emailControl.value).trim();
    this.isLoading = true;
    this.authService.forgotPassword(this.emailControl.value).pipe(untilDestroyed(this)).subscribe((data: any) => {
      this.isLoading = false;
      if (data) {
        this.router.navigate([`${APP_URL.resetPassword}`], { queryParams: { ref: email } });
      }
    }, (err) => {
      this.isLoading = false;
      this.toastr.error(err);
    });
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {
  }
}
