import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'core/services/auth.service';
import {APP_URL} from 'core/constant/tlims.url';
import {SharedService} from 'core/services/shared.service';
import {TranslateService} from '@ngx-translate/core';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Category} from 'core/model/category';
import {CategoryService} from 'core/services/category.service';

@Component({
  selector: 'tlims-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  activeUser = '';
  isLoggedIn: boolean;
  APP_URL = APP_URL;
  categories: Array<Category> = [];

  constructor(private authService: AuthService, private sharedService: SharedService, private translate: TranslateService,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.sharedService.messages.subscribe((res) => {
      this.isLoggedIn = res;
    });
    this.currentUser();
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().pipe(untilDestroyed(this)).subscribe((res: any) => {
      this.categories = res;
    });
  }

  currentUser() {
    this.activeUser = this.authService.getCurrentUser() ? this.authService.getCurrentUser().firstName : null;
  }

  changeLanguage(lang) {
    this.translate.use(lang).pipe(untilDestroyed(this)).subscribe();
  }

  logout() {
    this.sharedService.broadCast(false);
    this.authService.logout();
  }

  ngOnDestroy(): void {
  }

}
