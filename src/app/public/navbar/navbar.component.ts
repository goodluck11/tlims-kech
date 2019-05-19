import {Component, OnInit} from '@angular/core';
import {AuthService} from 'core/services/auth.service';
import {APP_URL} from 'core/constant/tlims.url';

@Component({
  selector: 'tlims-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  activeUser = '';
  APP_URL = APP_URL;

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
