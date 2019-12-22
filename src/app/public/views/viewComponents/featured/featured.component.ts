import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoreService} from 'core/services/core.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {Ad} from 'feature/items/ad';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ENV} from 'core/config/env.config';
import {APP_URL} from 'core/constant/tlims.url';
import {SlideConfigService} from 'core/services/slide-config.service';

@Component({
  selector: 'tlims-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent implements OnInit, OnDestroy {

  @BlockUI('featuresList') blockUI: NgBlockUI;
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
    this.blockUI.start('Loading featured ads...');
    this.coreService.featuredAds(new SearchRequest('', this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
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
