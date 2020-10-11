import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ToastrService} from 'ngx-toastr';
import {AuthenticationService} from 'core/services/auth.service';
import {Router} from '@angular/router';
import {MsgService} from 'core/services/msg.service';

@Component({
  selector: 'tlims-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  userEmail: string;

  constructor(private fb: FormBuilder, private readonly toastr: MsgService, private authService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      phoneNumber: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      displayName: [null]
    });
  }

  buildDisplayName() {
    const firstName = this.registerForm.get('firstName').value;
    const lName = this.registerForm.get('lastName').value;
    const dName = this.registerForm.get('displayName');
    if (dName.pristine) {
      if (lName && firstName) {
        dName.setValue(lName + ' ' + firstName);
      }
    }
  }

  register() {
    this.isLoading = true;
    this.isSuccess = false;
    this.authService.register(this.registerForm.value).pipe(untilDestroyed(this)).subscribe((data: any) => {
      console.log(data);
      this.isLoading = false;
      if (data.id) {
        this.userEmail = this.registerForm.get('email').value;
        this.isSuccess = true;
        // this.toastr.success('User created successfully');
        this.initForm();
      }
    }, (err) => {
      console.log(err);
      this.toastr.error(err);
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
  }

}
