import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from 'core/services/auth.service';
import {User} from 'core/model/user';

@Component({
  selector: 'tlims-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {

  user: User = new User();

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

}
