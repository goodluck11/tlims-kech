import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CoreService} from 'core/services/core.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Location} from '@angular/common';
import {AuthService} from 'core/services/auth.service';
import {User} from 'core/model/user';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ENV} from 'core/config/env.config';

@Component({
  selector: 'tlims-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit, OnDestroy {

  ad: any;
  user: User = new User();
  dataId: number;
  title: string;
  numberLength = 5;
  btnTitle = 'Show Number';
  isHide = true;
  @BlockUI('view') blockUI: NgBlockUI;
  @BlockUI('profile') blockProfile: NgBlockUI;
  baseUrl = `${ENV.STORAGE_API}`;
  selectedImg: string;
  fullImg = 'https://freakyjolly.com/demo/jquery/PreloadJS/images/1.jpg';
  slideConfig = {
    'slidesToShow': 1,
    'slidesToScroll': 1,
    'autoplay': false
  };

  constructor(private activatedRoute: ActivatedRoute, private toastr: ToastrService, private coreService: CoreService,
              private location: Location, private authService: AuthService) {
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(untilDestroyed(this)).subscribe((req) => {
      this.dataId = req.id;
      this.title = req.title;
      this.getAd();
    });
  }

  setImage(img) {
    this.selectedImg = img;
  }

  getAd() {
    if (!isNaN(this.dataId)) {
      this.blockUI.start('Loading details');
      this.coreService.getAd(this.dataId).pipe(untilDestroyed(this)).subscribe((data: any) => {
        if (data) {
          this.ad = data;
          this.selectedImg = this.baseUrl + this.ad.images[0];
          this.findByUsername();
          this.blockUI.stop();
        }
      }, (err) => {
        this.blockUI.stop();
        this.toastr.error('Error loading details of record ' + this.title);
      });
    } else {
      this.toastr.error('Details not found for record ' + this.title);
      this.location.back();
    }
  }

  findByUsername() {
    this.blockProfile.start();
    this.authService.findByUserName(this.ad.createdBy).pipe(untilDestroyed(this)).subscribe((data: any) => {
      this.user = data;
      this.blockProfile.stop();
    }, (err) => {
      this.blockProfile.stop();
      this.toastr.error('Error loading details of user');
    });
  }

  toggleNumber() {
    this.isHide = !this.isHide;
    if (this.isHide) {
      this.btnTitle = 'Show Number';
      this.numberLength = 5;
      return;
    }
    this.btnTitle = 'Hide Number';
    this.numberLength = 12;
  }

  ngOnDestroy(): void {
  }
}


