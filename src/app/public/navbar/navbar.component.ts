import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthenticationService} from 'core/services/auth.service';
import {APP_URL} from 'core/constant/tlims.url';
import {SharedService} from 'core/services/shared.service';
import {TranslateService} from '@ngx-translate/core';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Category} from 'core/model/category';
import {CategoryService} from 'core/services/category.service';
import {User} from 'core/model/user';

@Component({
  selector: 'tlims-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  showSideBar = false;
  @Output()
  sideBarVisible = new EventEmitter();

  activeUser: User;
  isLoggedIn: boolean;
  APP_URL = APP_URL;
  categories: Array<Category> = [];

  constructor(private authService: AuthenticationService, private sharedService: SharedService, private translate: TranslateService,
              private categoryService: CategoryService) {
  }

  toggleSideBar() {
    this.showSideBar = !this.showSideBar;
    this.sideBarVisible.emit(this.showSideBar);
  }

  ngOnInit() {
    this.currentUser();
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().pipe(untilDestroyed(this)).subscribe((res: any) => {
      this.categories = res;
      this.categoryService.broadcastCategories(this.categories);
    });
  }

  currentUser() {
    this.activeUser = this.authService.getCurrentUser() ? this.authService.getCurrentUser().firstName : null;
    this.sharedService.messages.subscribe((res) => {
      this.isLoggedIn = res;
      if (res) {
        this.authService.findByUserName(this.activeUser.email).pipe(untilDestroyed(this)).subscribe((res) => {
          console.log(res);
        });
      }
    });
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
