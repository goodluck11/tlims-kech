import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ChangePasswordRequest} from 'core/model/user';
import {UserService} from '../user.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'tlims-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss']
})
export class PasswordFormComponent implements OnInit, OnDestroy {

  passwordForm: FormGroup;
  isLoading = false;
  password: ChangePasswordRequest = new ChangePasswordRequest();

  constructor(private fb: FormBuilder, private userService: UserService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.initForm();
  }

  changePassword() {
    this.isLoading = true;
    this.password = this.passwordForm.value;
    this.userService.changePassword(this.password).pipe(untilDestroyed(this)).subscribe((data) => {
      if (data) {
        this.toastr.success('Password successfully changed');
        this.initForm();
      }
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      this.toastr.error('Error changing password');
    });
  }

  initForm() {
    this.passwordForm = this.fb.group({
      currentPassword: [],
      password: [],
      cpassword: []
    });
  }

  ngOnDestroy(): void {
  }

}
