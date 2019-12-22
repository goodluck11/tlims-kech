import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {ToastrService} from 'ngx-toastr';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ListItemService} from 'core/services/list-item.service';
import {ListItem} from 'core/model/category';
import {PageEvent} from '@angular/material';
import {PageRequest} from 'core/model/page-request';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'tlims-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ListItemsComponent implements OnInit, OnDestroy {
  listItems: Array<ListItem> = [];
  @BlockUI('pick-list') blockUI: NgBlockUI;
  searchTerm = '';
  query: Paging = new Paging();
  isOpenModal = false;
  listItem = new ListItem();
  isEdit = false;
  total: number;
  size: number;
  searchField: FormControl;

  constructor(private listItemService: ListItemService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllPickList();
    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(debounceTime(400), distinctUntilChanged(),
      switchMap((value) => of(value)), untilDestroyed(this)).subscribe((res) => {
      this.searchTerm = res;
      this.getAllPickList();
    });
  }

  getAllPickList() {
    this.blockUI.start('Loading List');
    this.listItemService.findAll(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((data: any) => {
      if (Array(data['content'])) {
        this.listItems = data['content'];
      }
      this.total = data.totalElements;
      this.size = data.size;
      this.blockUI.stop();
    }, (err) => {
      this.blockUI.stop();
      this.toastr.error('Error loading pick list items');
    });
  }

  getPage($event: PageEvent) {
    const pageRequest = new PageRequest(($event.pageIndex + 1), $event.pageSize);
    this.query.page = pageRequest.page;
    this.query.limit = pageRequest.size;
    this.getAllPickList();
  }

  edit(d) {
    this.listItem = d;
    this.isOpenModal = true;
    this.isEdit = true;
  }

  closeModal() {
    this.isOpenModal = false;
    this.listItem = new ListItem();
    this.isEdit = false;
  }

  trackByFn(index, cat) {
    return cat.id;
  }

  ngOnDestroy(): void {
  }
}
