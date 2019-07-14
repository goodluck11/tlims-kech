import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from 'core/model/category';
import {ActivatedRoute} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {CategoryService} from 'core/services/category.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ToastrService} from 'ngx-toastr';
import {CATEGORY} from 'core/constant/category.const';

@Component({
  selector: 'tlims-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit, OnDestroy {

  categories: Array<Category> = [];
  subCategories: Array<Category> = [];
  title = '';
  categoryCode: string;
  @BlockUI('adForm') blockUI: NgBlockUI;
  CATEGORY = CATEGORY;

  constructor(private activatedRoute: ActivatedRoute, private categoryService: CategoryService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getParentCategories();
  }

  getSubCategories(cat?: Category, catCode?: string) {
    this.blockUI.start('Loading Subcategories');
    const cCode = cat ? cat.categoryCode.dataCode : catCode;
    this.categoryService.getSubCategories(cCode).pipe(untilDestroyed(this)).subscribe((data: any) => {
      if (Array(data)) {
        this.title = data[0].parentCategory.titleDescription.title;
        this.subCategories = data;
      }
      this.categoryCode = cCode;
      this.blockUI.stop();
    }, (err) => {
      this.toastr.error('Error loading subcategories');
      this.blockUI.stop();
    });
  }

  getParentCategories() {
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.categories = data.categories;
      this.getQueryParams();
    });
  }

  getQueryParams() {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe((res) => {
      if (res.cat) {
        this.getSubCategories(undefined, res.cat);
      } else {
        this.getSubCategories(undefined, this.categories[0].categoryCode.dataCode);
      }
    });
  }

  ngOnDestroy(): void {
  }

}
