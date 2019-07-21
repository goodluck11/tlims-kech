import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from 'core/services/auth.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';

@Component({
  selector: 'tlims-verification',
  template: `
    <div class="alert alert-danger">
      Error verifying account. Please contact admin
    </div>
  `,
})
export class VerificationComponent implements OnInit, OnDestroy {

  constructor(private activatedRouter: ActivatedRoute, private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.activatedRouter.params.subscribe(value => {
      if (value.code) {
        this.authService.verifyAccount(value.code).pipe(untilDestroyed(this)).subscribe(res => {
          if (res === 'OK') {
            this.router.navigateByUrl(APP_URL.login);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
  }

}