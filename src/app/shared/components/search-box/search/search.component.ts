import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from 'core/services/category.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Category} from 'core/model/category';
import {CoreService} from 'core/services/core.service';
import {SearchRequest2} from 'core/model/search-request';
import {Paging} from 'core/model/paging';
import {FormControl} from '@angular/forms';
import {CATEGORY} from 'core/constant/category.const';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Ad} from 'feature/items/ad';
import {GroupByPipe} from 'ngx-pipes';

@Component({
  selector: 'tlims-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  categories: Array<Category> = [];
  searchTerm = '';
  page: Paging = new Paging();
  categoryControl = new FormControl();
  searchControl = new FormControl();
  isOpen = false;
  isLoading = false;
  highlight;
  ads: Array<Ad> = [];
  routerLink = '/tlims/ad/';

  constructor(private categoryService: CategoryService, private coreService: CoreService, private groupByPipe: GroupByPipe) {
  }

  ngOnInit() {
    this.categoryControl.setValue(CATEGORY.ALL);
    this.getCategories();
    this.searchControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged(),
      switchMap((value) => of(value)), untilDestroyed(this)).subscribe((res) => {
        this.isOpen = true;
        if (this.searchTerm !== '') {
          this.isOpen = false;
        }
      this.searchTerm = res;
      this.searchAds();
    });
  }

  getCategories() {
    this.categoryService.getSharedCategories().pipe(untilDestroyed(this)).subscribe((res) => {
      this.categories = res;
    });
  }

  searchAds() {
    this.isLoading = true;
    this.ads = [];
    this.coreService.globalSearch(new SearchRequest2(this.searchTerm, this.page, this.categoryControl.value))
      .pipe(untilDestroyed(this)).subscribe((res: any) => {
      this.isLoading = false;
      this.ads = res['content'];
      console.log(this.ads);
    });
  }

  ngOnDestroy(): void {
  }
}
