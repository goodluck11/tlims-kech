import {Component, OnDestroy, OnInit} from '@angular/core';
import {Paging} from 'core/model/paging';
import {AdminService} from 'feature/admin/admin.service';
import {ToastrService} from 'ngx-toastr';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {SearchRequest} from 'core/model/search-request';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

@Component({
  selector: 'tlims-ad-history',
  templateUrl: './ad-history.component.html',
  styleUrls: ['./ad-history.component.scss']
})
export class AdHistoryComponent implements OnInit, OnDestroy {

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

  trackByFn(index, d) {
    return d.id;
  }

  ngOnDestroy(): void {
  }

}
