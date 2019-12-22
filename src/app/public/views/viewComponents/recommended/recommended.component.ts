import {Component, OnDestroy, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {SlideConfigService} from 'core/services/slide-config.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {Ad} from 'feature/items/ad';
import {ENV} from 'core/config/env.config';
import {APP_URL} from 'core/constant/tlims.url';
import {CoreService} from 'core/services/core.service';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'tlims-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.scss']
})
export class RecommendedComponent implements OnInit, OnDestroy {

  @BlockUI('recommendList') blockUI: NgBlockUI;
  query: Paging = new Paging();
  ads: Array<Ad> = [];
  storagePath = `${ENV.STORAGE_API}`;
  APP_URL = APP_URL;
  customOptions = this.slideConfigService.getConfig();
  isLocal = `${ENV.IS_LOCAL}`;

  constructor(private coreService: CoreService,
              private slideConfigService: SlideConfigService) {
  }

  ngOnInit() {
    this.getFeaturedAds();
  }

  getFeaturedAds() {
    this.blockUI.start('Loading recommended ads...');
    this.coreService.archivedAds(new SearchRequest('', this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.ads = res['content'];
      }
      this.blockUI.stop();
    }, (err) => {
      this.blockUI.stop();
    });
  }

  ngOnDestroy(): void {
  }

}
