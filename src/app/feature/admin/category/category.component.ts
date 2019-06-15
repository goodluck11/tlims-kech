import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Category} from 'core/model/category';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {CategoryService} from 'core/services/category.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {SearchRequest} from 'core/model/search-request';
import {Paging} from 'core/model/paging';

@Component({
  selector: 'tlims-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  catForm: FormGroup;
  isOpenModal = false;
  lookUp = -1;
  category: Category = new Category();
  @ViewChild('myFileUpload') myFileUpload;
  file: File;
  isLoading = false;
  categories: Array<Category> = [];
  subCategories: Array<Category> = [];
  categoryItems: Array<Category> = [];
  @BlockUI('category-list') blockUI: NgBlockUI;
  @BlockUI('subcategory-list') blockSubcat: NgBlockUI;
  isSubCategory = 1;
  isCreate = 2;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.getAllCategoryItem();
    this.initForm();
  }

  modal(d, state) {
    this.isOpenModal = true;
    this.lookUp = state;
    if (this.lookUp === this.isSubCategory) {
      this.blockSubcat.start('Loading ...');
      this.categoryService.getSubCategories(d).pipe(untilDestroyed(this)).subscribe((data: any) => {
        if (Array(data)) {
          this.subCategories = data;
        }
        this.blockSubcat.stop();
      }, (err) => {
        this.blockSubcat.stop();
        this.toastr.error('Error loading subcategories');
      });
    }
  }

  closeModal($event) {
    this.isOpenModal = $event;
    this.lookUp = -1;
  }

  getAllCategoryItem() {
    this.blockUI.start('Loading categories...');
    this.categoryService.getParentCategories().pipe(untilDestroyed(this)).subscribe((data: any) => {
      if (Array(data)) {
        this.categoryItems = data;
        this.categories = data;
      }
      this.blockUI.stop();
    }, (err) => {
      this.blockUI.stop();
      this.toastr.error('Error loading categories');
    });
  }

  create() {
    this.isLoading = true;
    this.file = this.getFile();
    this.category = this.catForm.value;
    this.categoryService.create(this.category, this.file).pipe(untilDestroyed(this)).subscribe((data) => {
      this.toastr.success('Category ' + this.category.titleDescription.title + ' successfully created');
      this.reset();
      this.isLoading = false;
      if (!this.category.parentCategory) {
        this.getAllCategoryItem();
      }
    }, (err) => {
      this.toastr.error('Category creation failed');
      this.isLoading = false;
    });
  }

  reset() {
    this.category = new Category();
    this.initForm();
    this.myFileUpload.nativeElement.value = '';
  }

  getFile() {
    const fileBrowser = this.myFileUpload.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      return this.myFileUpload.nativeElement.files[0];
    }
    return null;
  }

  initForm() {
    this.catForm = this.fb.group({
      categoryCode: this.fb.group({
        dataCode: [this.category.categoryCode.dataCode]
      }),
      titleDescription: this.fb.group({
        title: [this.category.titleDescription.title],
        description: [this.category.titleDescription.description]
      }),
      parentCategory: [this.category.parentCategory]
    });
  }

  ngOnDestroy(): void {
  }
}
