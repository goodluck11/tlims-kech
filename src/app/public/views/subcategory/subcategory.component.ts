import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from 'core/model/category';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CoreService} from 'core/services/core.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Ad} from 'feature/items/ad';
import {NTuple} from 'core/model/search-request';

@Component({
  selector: 'tlims-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit, OnDestroy {

  categories: Array<Category> = [];
  subCategories: Array<Category> = [];
  category: Category = new Category();
  ads: Array<Ad> = [];
  brands: Array<any> = [];
  categoryCode: string;
  @BlockUI('subAdList') blockUI: NgBlockUI;
  searchTerm = '';
  query: Paging = new Paging();
  viewType = 'LIST';
  searchParams: NTuple = new NTuple();
  currentUrl: string;

  constructor(private activatedRoute: ActivatedRoute, private toastr: ToastrService,
              private coreService: CoreService, private router: Router) {
    this.query.limit = 24;
    this.query.order = '-createdDate';
  }

  ngOnInit() {
    this.currentUrl = this.router.url.split('?')[0];
    this.getRequestParams();
    this.getSubCategories();
    // this.getAllAds();
  }

  getRequestParams() {
    this.activatedRoute.params.pipe(untilDestroyed(this)).subscribe((res) => {
      this.searchParams.category = res.catCode;
      this.getView();
    });
  }

  getView() {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe((res) => {
      if (res) {
        this.mapQueryParams(res);
        this.getAllAdsAdvance();
      }
    });
  }

  mapQueryParams(res: {}) {
    const keys = Object.keys(res);
    keys.forEach(k => {
      if (QUERY_KEYS.SUBCATEGORY === k) {
        this.searchParams.subCategory = res[k];
      }
      if (QUERY_KEYS.PRICE === k) {
        this.searchParams.price = res[k];
      }
      if (QUERY_KEYS.CONDITION === k) {
        this.searchParams.itemCondition = res[k];
      }
      if (QUERY_KEYS.LIMIT === k) {
        this.query.limit = res[k];
      }
      if (QUERY_KEYS.VIEW === k) {
        this.viewType = res[k];
      }
    });
  }

  getAllAdsAdvance() {
    this.blockUI.start('Loading Ads...');
    this.searchParams.paging = this.query;
    this.coreService.allAdsAdvance(this.searchParams).pipe(untilDestroyed(this)).subscribe((res) => {
      this.handleResponse(res);
      this.blockUI.stop();
    }, (err) => {
      this.toastr.error('Server error encountered', 'Oops!');
      this.blockUI.stop();
    });
  }

  handleResponse(res) {
    if (Array(res['content'])) {
      this.ads = res['content'];
    }
  }

  getSubCategories() {
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.subCategories = data.subCategories;
      this.brands = data.brands;
      if (this.subCategories.length > 0) {
        this.category = this.subCategories[0].parentCategory;
      }
    });
  }

  ngOnDestroy(): void {
  }

}

export const QUERY_KEYS = {
  SUBCATEGORY: 'subCat',
  VIEW: 'view',
  PRICE: 'price',
  CONDITION: 'condition',
  BRAND: 'brands',
  LIMIT: 'limit'
};
