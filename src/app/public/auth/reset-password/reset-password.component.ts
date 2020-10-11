import {Component, OnDestroy, OnInit} from '@angular/core';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MsgService} from 'core/services/msg.service';
import {AuthenticationService} from 'core/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {APP_URL} from 'core/constant/tlims.url';
import {ResetPasswordRequest} from 'core/model/reset-password-request';

@Component({
  selector: 'tlims-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  resetPassForm: FormGroup;
  isLoading = false;
  passwordRequest: ResetPasswordRequest = new ResetPasswordRequest();
  email: string;

  constructor(private readonly fb: FormBuilder, private readonly toastr: MsgService, private readonly authService: AuthenticationService,
              private readonly router: Router, private readonly location: Location, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getRequestParam();
    this.initForm();
  }

  getRequestParam() {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe((data) => {
      if (!data) {
        this.location.back();
        return;
      }
      this.email = data.ref;
    });
  }

  initForm() {
    this.resetPassForm = this.fb.group({
      email: [null],
      token: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submit() {
    this.isLoading = true;
    this.passwordRequest = this.resetPassForm.value;
    this.passwordRequest.email = this.email;
    this.authService.resetPassword(this.passwordRequest).pipe(untilDestroyed(this)).subscribe((data: any) => {
      this.isLoading = false;
      if (data) {
        this.initForm();
        this.toastr.success('Password reset successful');
        this.router.navigateByUrl(APP_URL.login);
      }
    }, (err) => {
      this.isLoading = false;
      this.toastr.error(err);
    });
  }

  ngOnDestroy(): void {
  }

}
