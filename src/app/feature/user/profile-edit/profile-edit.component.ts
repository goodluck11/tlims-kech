import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from 'core/model/user';
import {AuthenticationService} from 'core/services/auth.service';
import {Location} from '@angular/common';

@Component({
  selector: 'tlims-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy {

  userForm: FormGroup;
  user: User = new User();

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private location: Location) {
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    console.log(this.user);
    if (!this.user) {
      this.location.back();
    }
    this.initForm();
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
