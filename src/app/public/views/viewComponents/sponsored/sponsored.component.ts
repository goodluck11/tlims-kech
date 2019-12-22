import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {Ad} from 'feature/items/ad';
import {ENV} from 'core/config/env.config';
import {CoreService} from 'core/services/core.service';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {SlideConfigService} from 'core/services/slide-config.service';

@Component({
  selector: 'tlims-sponsored',
  templateUrl: './sponsored.component.html',
  styleUrls: ['./sponsored.component.scss']
})
export class SponsoredComponent implements OnInit, OnDestroy {

  @BlockUI('sponsorList') blockUI: NgBlockUI;
  query: Paging = new Paging();
  ads: Array<Ad> = [];
  APP_URL = APP_URL;
  storagePath = `${ENV.STORAGE_API}`;
  customOptions = this.slideConfigService.getConfig();
  isLocal = `${ENV.IS_LOCAL}`;

  constructor(private coreService: CoreService,
              private slideConfigService: SlideConfigService) {
  }

  ngOnInit() {
    this.getSponsoredAds();
  }

  getSponsoredAds() {
    this.blockUI.start('Loading sponsored ads...');
    this.coreService.sponsoredAds(new SearchRequest('', this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
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
