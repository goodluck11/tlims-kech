import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../core/services/auth.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Router} from '@angular/router';
import {StorageService} from '../../core/services/storage.service';

@Component({
  selector: 'prefix-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private authService: AuthService,
              private router: Router, private storageService: StorageService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [null],
      password: [null],
    });
  }

  login() {
    this.isLoading = true;
    this.authService.login(this.loginForm.value).pipe(untilDestroyed(this)).subscribe((data: any) => {
      if (data.token) {
        this.storageService.save({key: 'currentUser', data: data});
        this.router.navigateByUrl('/tlims/bo');
        const user = JSON.parse(data.user);
        this.toastr.success('Welcome ' + user.firstName + ' ' + user.lastName);
      }
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      if (err.error) {
        if (err.error.errorCode) {
          this.toastr.error(err.error.message);
        }
      }
      console.log(err);
    });
  }

  ngOnDestroy(): void {
  }

}
