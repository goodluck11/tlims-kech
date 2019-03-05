import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'tlims-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.fb.group({
      email: [null],
      password: [null],
      phoneNumber: [null],
      firstName: [null],
      lastName: [null]
    });
  }

  register() {
    this.isLoading = true;
    this.authService.register(this.registerForm.value).pipe(untilDestroyed(this)).subscribe((data: any) => {
      this.isLoading = false;
      if (data.id) {
        this.toastr.success('User created successfully');
        this.initForm();
        this.router.navigateByUrl('/tlims/sign-in');
      }
    }, (err) => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
  }

}
