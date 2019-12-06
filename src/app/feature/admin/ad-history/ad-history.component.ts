import {Component, OnDestroy, OnInit} from '@angular/core';
import {Paging} from 'core/model/paging';
import {AdminService} from 'feature/admin/admin.service';
import {ToastrService} from 'ngx-toastr';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {SearchRequest} from 'core/model/search-request';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {Ad} from 'feature/items/ad';

@Component({
  selector: 'tlims-ad-history',
  templateUrl: './ad-history.component.html',
  styleUrls: ['./ad-history.component.scss']
})
export class AdHistoryComponent implements OnInit, OnDestroy {

  ads: Array<Ad> = [];
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
      this.getAdHistory();
    });
    this.getAdHistory();
  }

  getAdHistory() {
    this.isLoading = true;
    this.adminService.adHistory(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.ads = res['content'];
      }
      this.isLoading = false;
    }, (err) => {
      this.toastr.error('Error loading ads');
      this.isLoading = false;
    });
  }

  toggleAction(actionName, data) {
    const sponsored = this.adminService.sponsoredOrNot(data);
    const featured = this.adminService.featuredOrNot(data);
    const status = this.adminService.activateOrDeactivateAd(data);

    switch (actionName) {
      case 'status':
        status.pipe(untilDestroyed(this)).subscribe((res) => {
          this.handleResult(res);
        });
        break;
      case 'featured':
        featured.pipe(untilDestroyed(this)).subscribe((res) => {
          this.handleResult(res);
        });
        break;
      case 'sponsored':
        sponsored.pipe(untilDestroyed(this)).subscribe((res) => {
          this.handleResult(res);
        });
        break;
    }
  }

  handleResult(res) {
    console.log(res);
    if ('OK' === res) {
      this.toastr.success('Action successful');
      this.getAdHistory();
    }
  }

  trackByFn(index, d) {
    return d.id;
  }

  ngOnDestroy(): void {
  }

}
