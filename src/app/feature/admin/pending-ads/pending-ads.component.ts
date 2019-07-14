import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from 'feature/admin/admin.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {ToastrService} from 'ngx-toastr';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Ad} from 'feature/items/ad';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

@Component({
  selector: 'tlims-pending-ads',
  templateUrl: './pending-ads.component.html',
  styleUrls: ['./pending-ads.component.scss']
})
export class PendingAdsComponent implements OnInit, OnDestroy {

  ads: Array<any> = [];
  isLoading = false;
  searchTerm = '';
  query: Paging = new Paging();
  searchField: FormControl;

  constructor(private adminService: AdminService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(debounceTime(400), distinctUntilChanged(),
      switchMap((value) => of(value)), untilDestroyed(this)).subscribe((res) => {
      this.searchTerm = res;
      this.getAllPendingAds();
    });
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
    this.isLoading = true;
    this.adminService.pendingAds(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.ads = res['content'];
      }
      this.isLoading = false;
    }, (err) => {
      this.toastr.error('Error loading pending ads');
      this.isLoading = false;
    });
  }

  trackByFn(index, d) {
    return d.id;
  }

  ngOnDestroy(): void {
  }

}
