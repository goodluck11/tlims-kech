import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {ToastrService} from 'ngx-toastr';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {SearchRequest} from 'core/model/search-request';
import {UserService} from '../user.service';

@Component({
  selector: 'tlims-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit, OnDestroy {

  ads: Array<any> = [];
  @BlockUI() blockUI: NgBlockUI;
  searchTerm = '';
  query: Paging = new Paging();


  constructor(private userService: UserService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllUserAds();
  }

  getAllUserAds() {
    this.blockUI.start('Loading ads...');
    this.userService.findUserAds(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.ads = res['content'];
      }
      this.blockUI.stop();
    }, (err) => {
      this.toastr.error('Error loading ads');
      this.blockUI.stop();
    });
  }

  trackByFn(index, d) {
    return d.id;
  }

  ngOnDestroy(): void {
  }

}
