import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {Ad} from 'feature/items/ad';
import {ENV} from 'core/config/env.config';
import {CoreService} from 'core/services/core.service';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {BoxView} from '../featured/featured.component';
import {APP_URL} from 'core/constant/tlims.url';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
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
  searchTerm = '';
  APP_URL = APP_URL;
  storagePath = `${ENV.STORAGE_API}`;

  images: Array<BoxView> = [
    {
      text: 'Everfresh Flowers',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/1.jpg'
    },
    {
      text: 'Festive Deer',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/2.jpg'
    },
    {
      text: 'Morning Greens',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/3.jpg'
    },
    {
      text: 'Bunch of Love',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/4.jpg'
    },
    {
      text: 'Blue Clear',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/5.jpg'
    }
  ];

  slideConfigs: any;

  constructor(private coreService: CoreService, private breakpointObserver: BreakpointObserver,
              private slideConfigService: SlideConfigService) {
  }

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        const defaultVal = this.slideConfigService.getDefaultConfig();
        if (state.breakpoints['(max-width: 599.99px) and (orientation: portrait)']) {
          defaultVal.slidesToShow = 1;
        }
        if (state.breakpoints['(min-width: 600px) and (max-width: 959.99px)']) {
          defaultVal.slidesToShow = 2;
        }
        this.slideConfigs = defaultVal;
      });
    this.getFeaturedAds();
  }

  getFeaturedAds() {
    this.blockUI.start('Loading sponsored ads...');
    this.coreService.allAds(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.ads = res['content'];
        if (this.ads.length < 5) {
          this.ads.map(value => this.images.push({
            id: value.id, text: value.titleDescription.title,
            image: this.storagePath + value.images[0], code: value.code
          }));
        }
      }
      this.blockUI.stop();
    }, (err) => {
      this.blockUI.stop();
    });
  }

  ngOnDestroy(): void {
  }
}
