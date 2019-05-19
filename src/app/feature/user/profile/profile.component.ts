import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from 'core/model/user';
import {AuthService} from 'core/services/auth.service';
import {Location} from '@angular/common';
import {UserService} from '../user.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'tlims-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userForm: FormGroup;
  user: User = new User();
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService, private location: Location,
              private userService: UserService) {
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.location.back();
    }
    this.initForm();
  }

  update() {
    this.isLoading = true;
    this.user = this.userForm.value;
    this.userService.updateProfile(this.user).pipe(untilDestroyed(this)).subscribe((data: any) => {
      if (data) {
        this.user = data;
        this.toastr.success('Profile successfully updated');
      }
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      this.toastr.error('Error while updating profile');
    });
  }

  initForm() {
    this.userForm = this.fb.group({
      firstName: [this.user.firstName],
      lastName: [this.user.lastName],
      phoneNumber: [this.user.phoneNumber],
      email: [this.user.email]
    });
  }

  ngOnDestroy(): void {
  }

}
