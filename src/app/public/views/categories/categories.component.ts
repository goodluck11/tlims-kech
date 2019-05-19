import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from 'core/model/category';
import {ActivatedRoute} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {ToastrService} from 'ngx-toastr';
import {SearchRequest} from 'core/model/search-request';
import {CoreService} from 'core/services/core.service';

@Component({
  selector: 'tlims-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  categories: Array<Category> = [];
  ads: Array<Category> = [];
  categoryCode: string;
  @BlockUI() blockUI: NgBlockUI;
  searchTerm = '';
  query: Paging = new Paging();
  viewType = 'LIST';

  constructor(private activatedRoute: ActivatedRoute, private toastr: ToastrService, private coreService: CoreService) {
  }

  ngOnInit() {
    this.getParentCategories();
    this.getAllAds();
    this.getView();
  }

  getView() {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe((res) => {
      if (res) {
        if (res.view) {
          this.viewType = res.view;
        }
      }
    });
  }

  getAllAds() {
    this.blockUI.start('Loading Ads...');
    this.query.limit = 16;
    this.coreService.allAds(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.ads = res['content'];
      }
      this.blockUI.stop();
    }, (err) => {
      this.toastr.error('Error loading users');
      this.blockUI.stop();
    });
  }

  trackByFn(index, d) {
    return d.id;
  }

  getCategories(cat) {
    this.categoryCode = cat.categoryCode.dataCode;
  }

  getParentCategories() {
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.categories = data.categories;
      this.categoryCode = this.categories[0].categoryCode.dataCode;
    });
  }

  ngOnDestroy(): void {
  }

}