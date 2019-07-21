import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CoreService} from 'core/services/core.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Location} from '@angular/common';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ENV} from 'core/config/env.config';
import {MessageService} from 'core/services/message.service';

@Component({
  selector: 'tlims-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit, OnDestroy {

  ad: any;
  dataId: number;
  title: string;
  numberLength = 5;
  btnTitle = 'app.core.shownumber';
  isHide = true;
  isLoading = false;
  isOpenModal = false;
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
  readMore = '<a (click)="toggleFullText()" href="javascript:void(0);">[...]</a>';

  constructor(private activatedRoute: ActivatedRoute, private toastr: ToastrService, private coreService: CoreService,
              private location: Location, private messageService: MessageService) {
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(untilDestroyed(this)).subscribe((req) => {
      this.dataId = req.id;
      this.title = req.title;
      this.getAd();
    });
  }

  sendMessage($event) {
    this.isLoading = true;
    this.messageService.addMesssage($event).pipe(untilDestroyed(this)).subscribe((res: any) => {
      if (res.id) {
        this.toastr.success('Message successfully sent');
      }
      this.isLoading = false;
    });
  }

  getAd() {
    if (!isNaN(this.dataId)) {
      this.blockUI.start('Loading details');
      this.coreService.getAd(this.dataId).pipe(untilDestroyed(this)).subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.ad = data;
          this.selectedImg = this.baseUrl + this.ad.images[0];
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

  toggleNumber() {
    this.isHide = !this.isHide;
    if (this.isHide) {
      this.btnTitle = 'app.core.shownumber';
      this.numberLength = 5;
      return;
    }
    this.btnTitle = 'app.core.hidenumber';
    this.numberLength = 12;
  }

  ngOnDestroy(): void {
  }
}


