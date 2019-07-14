import {Component, OnDestroy} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'prefix-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'prefix';
  isLoading = false;

  constructor(private router: Router, private translate: TranslateService) {
    translate.setDefaultLang('en');
    router.events.subscribe((res) => {
      if (res instanceof NavigationStart) {
        this.isLoading = true;
      }
      if (res instanceof NavigationEnd || res instanceof NavigationError || res instanceof NavigationCancel) {
        this.isLoading = false;
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnDestroy(): void {
  }
}
