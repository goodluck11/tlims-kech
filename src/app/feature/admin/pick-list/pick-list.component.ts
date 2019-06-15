import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, Picklist, PickListType} from 'core/model/category';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from 'core/services/category.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {PickListService} from 'core/services/picklist.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Utils} from 'core/utils/utils';
import {EnumValues} from 'enum-values';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {SearchRequest} from 'core/model/search-request';

@Component({
  selector: 'tlims-pick-list',
  templateUrl: './pick-list.component.html',
  styleUrls: ['./pick-list.component.scss']
})
export class PickListComponent implements OnInit, OnDestroy {

  pForm: FormGroup;
  pSearchForm: FormGroup;
  isLoading = false;
  isOpenModal = false;
  picklist: Picklist = new Picklist();
  categories: Array<Category> = [];
  subcategories: Array<Category> = [];
  pickLists: Array<Picklist> = [];
  pickListItems: Array<Picklist> = [];
  listTypes: Array<any> = [];
  @BlockUI('pick-list') blockUI: NgBlockUI;
  searchTerm = '';
  isSearch = false;
  query: Paging = new Paging();

  constructor(private fb: FormBuilder, private categoryService: CategoryService, private picklistService: PickListService,
              private toastr: ToastrService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getAllPickList();
    this.listTypes = EnumValues.getNamesAndValues(PickListType);
    this.getParentCategories();
    this.initForm();
  }

  searchItem() {
    this.isSearch = true;
    this.getParentList();
  }

  getAllPickList() {
    this.blockUI.start('Loading List');
    this.picklistService.findAll(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((data: any) => {
      if (Array(data['content'])) {
        this.pickListItems = data['content'];
      }
      this.blockUI.stop();
    }, (err) => {
      this.blockUI.stop();
      this.toastr.error('Error loading pick list items');
    });
  }

  getParentCategories() {
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.categories = data.categories;
    });
  }

  populateCodeValueName(groupName, code) {
    if ('category' === groupName) {
      this.setGroupName(groupName, Utils.getNameFromCategory(this.categories, this.getValueFromGroupNameCode(groupName)));
    }
    if ('subCategory' === groupName) {
      this.setGroupName(groupName, Utils.getNameFromCategory(this.subcategories, this.getValueFromGroupNameCode(groupName)));
    }
  }

  getParentList() {
    const pListType = this.isSearch ? this.pSearchForm.get('picklistType').value : this.pForm.get('parentpickListType').value;
    const cat = this.isSearch ? this.pSearchForm.get('category').value : this.getValueFromGroupNameCode('category');
    const subCat = this.isSearch ? this.pSearchForm.get('subCategory').value : this.getValueFromGroupNameCode('subCategory');
    if (cat && subCat && pListType) {
      this.blockUI.start('Loading Parent List');
      this.picklistService.getPicklistsByByTypeAndCategory(pListType, cat, subCat).pipe(untilDestroyed(this)).subscribe((data: any) => {
        if (!this.isSearch) {
          this.pickLists = data;
        } else {
          this.pickListItems = data;
        }
        this.isSearch = false;
        this.blockUI.stop();
      }, (err) => {
        this.blockUI.stop();
        this.toastr.error('Error loading parent list');
      });
    }
  }

  getSearchSubCategories() {
    this.isSearch = true;
    this.getSubCategories();
  }

  getSubCategories() {
    this.blockUI.start('Loading Subcategories');
    let catCode = null;
    if (this.isSearch) {
      catCode = this.pSearchForm.get('category').value;
    } else {
      catCode = this.getValueFromGroupNameCode('category');
      this.populateCodeValueName('category', catCode);
    }
    if (catCode) {
      this.categoryService.getSubCategories(catCode).pipe(untilDestroyed(this)).subscribe((data: any) => {
        this.subcategories = data;
        this.blockUI.stop();
        this.isSearch = false;
      }, (err) => {
        this.blockUI.stop();
        this.toastr.error('Error loading subcategories');
      });
    } else {
      this.subcategories = [];
    }
  }

  getValueFromGroupNameCode(groupName) {
    return this.pForm.get(groupName).get('code').value;
  }

  setGroupName(groupName, value) {
    this.pForm.get(groupName).get('name').setValue(value);
  }

  create() {
    this.isLoading = true;
    this.picklist = this.pForm.value;
    this.picklistService.create(this.picklist).pipe(untilDestroyed(this)).subscribe((data) => {
      this.toastr.success('Picklist ' + this.picklist.titleDescription.title + ' successfully created');
      this.reset();
      this.getAllPickList();
      this.isLoading = false;
    }, (err) => {
      console.log(err);
      this.toastr.error('Picklist creation failed');
      this.isLoading = false;
    });
  }

  reset() {
    this.picklist = new Picklist();
    this.subcategories = [];
    this.initForm();
  }

  initForm() {
    this.pForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.picklist.titleDescription.title, [Validators.required]],
        description: [this.picklist.titleDescription.description]
      }),
      pickListcode: this.fb.group({
        dataCode: [this.picklist.pickListcode.dataCode, [Validators.required]]
      }),
      picklistType: [this.picklist.picklistType, [Validators.required]],
      parentList: [this.picklist.parentList],
      category: this.fb.group({
        code: [this.picklist.category.code],
        name: [this.picklist.category.name]
      }),
      subCategory: this.fb.group({
        code: [this.picklist.subCategory.code],
        name: [this.picklist.subCategory.name]
      }),
      parentpickListType: [this.picklist.parentpickListType],
    });

    this.pSearchForm = this.fb.group({
      picklistType: [],
      category: [],
      subCategory: []
    });
  }

  trackByFn(index, cat) {
    return cat.id;
  }

  ngOnDestroy(): void {
  }
}
