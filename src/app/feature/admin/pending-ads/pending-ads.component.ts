import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from 'feature/admin/admin.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {ToastrService} from 'ngx-toastr';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Ad} from 'feature/items/ad';

@Component({
  selector: 'tlims-pending-ads',
  templateUrl: './pending-ads.component.html',
  styleUrls: ['./pending-ads.component.scss']
})
export class PendingAdsComponent implements OnInit, OnDestroy {

  ads: Array<any> = [];
  @BlockUI('pendingList') blockUI: NgBlockUI;
  searchTerm = '';
  query: Paging = new Paging();


  constructor(private adminService: AdminService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllPendingAds();
  }

  authorize(d: Ad) {
    this.adminService.authorizeAd(d.id).pipe(untilDestroyed(this)).subscribe((data) => {
      this.toastr.success(d.titleDescription.title + ' successfully authorized');
      this.getAllPendingAds();
    }, (err) => {
      this.toastr.error('Error authorizing AD ' + d.titleDescription.title);
    });
  }

  getAllPendingAds() {
    this.blockUI.start('Loading pending ads...');
    this.adminService.pendingAds(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.ads = res['content'];
      }
      this.blockUI.stop();
    }, (err) => {
      this.toastr.error('Error loading pending ads');
      this.blockUI.stop();
    });
  }

  trackByFn(index, d) {
    return d.id;
  }

  ngOnDestroy(): void {
  }

}
