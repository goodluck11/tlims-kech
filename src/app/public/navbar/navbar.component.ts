import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'tlims-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  activeUser = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.currentUser();
  }

  currentUser() {
    this.activeUser = this.authService.getCurrentUser() ? this.authService.getCurrentUser().firstName : null;
  }

  logout() {
    this.authService.logout();
  }

}
