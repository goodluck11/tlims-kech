import {Component, OnInit} from '@angular/core';
import {AuthService} from 'core/services/auth.service';
import {APP_URL} from 'core/constant/tlims.url';
import {StorageService} from 'core/services/storage.service';
import {SharedService} from 'core/services/shared.service';

@Component({
  selector: 'tlims-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  activeUser = '';
  isLoggedIn: boolean;
  APP_URL = APP_URL;

  constructor(private authService: AuthService, private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.messages.subscribe((res) => {
      this.isLoggedIn = res;
    });
    this.currentUser();
  }

  currentUser() {
    this.activeUser = this.authService.getCurrentUser() ? this.authService.getCurrentUser().firstName : null;
  }

  logout() {
    this.sharedService.broadCast(false);
    this.authService.logout();
  }

}
