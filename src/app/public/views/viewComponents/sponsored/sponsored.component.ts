import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {Ad} from 'feature/items/ad';
import {ENV} from 'core/config/env.config';
import {CoreService} from 'core/services/core.service';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';

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
  storagePath = `${ENV.STORAGE_API}`;

  images = [
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

  slideConfigs = {
    'slidesToShow': 4,
    'slidesToScroll': 1,
    'infinite': true,
    'autoplay': true,
    'arrows': false
  };

  constructor(private coreService: CoreService) {
  }

  ngOnInit() {
    this.getFeaturedAds();
  }

  getFeaturedAds() {
    this.blockUI.start('Loading featured ads...');
    this.coreService.allAds(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      this.images = [];
      if (Array(res['content'])) {
        this.ads = res['content'];
        if (this.ads.length < 5) {
          this.ads.map(value => this.images.push({text: value.titleDescription.title, image: this.storagePath + value.images[0]}));
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