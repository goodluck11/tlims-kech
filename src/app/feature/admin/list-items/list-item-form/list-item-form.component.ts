import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, ListItem, PickListType} from 'core/model/category';
import {CategoryService} from 'core/services/category.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {EnumValues} from 'enum-values';
import {ListItemService} from 'core/services/list-item.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Utils} from 'core/utils/utils';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {CodeValue} from 'core/model/base-model';

@Component({
  selector: 'tlims-list-item-form',
  templateUrl: './list-item-form.component.html',
  styleUrls: ['./list-item-form.component.scss']
})
export class ListItemFormComponent implements OnInit, OnDestroy {

  pForm: FormGroup;
  isLoading = false;
  @Input()
  listItem: ListItem = new ListItem();
  categories: Array<Category> = [];
  subcategories: Array<CodeValue> = [];
  subCategorySet: Set<CodeValue> = new Set<CodeValue>();
  selectedSubcategories: Array<CodeValue> = [];
  listItems: Array<ListItem> = [];
  listTypes: Array<any> = [];
  @BlockUI() blockUI: NgBlockUI;
  @Output()
  closeForm = new EventEmitter();
  @Output()
  refreshList = new EventEmitter();
  @Input()
  isEdit = false;

  constructor(private fb: FormBuilder, private categoryService: CategoryService, private listItemService: ListItemService,
              private toastr: ToastrService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.listTypes = EnumValues.getNamesAndValues(PickListType);
    this.getParentCategories();
    this.initForm();
    if (this.isEdit) {
      this.getSubCategories();
    }
  }

  getParentCategories() {
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.categories = data.categories;
    });
  }

  hasMultipleSubCat() {
    this.subCategorySet.clear();
  }

  getParentItem() {
    const category = <CodeValue>this.pForm.get('category').value;
    const subCategory = <CodeValue>this.pForm.get('parentSubcat').value;
    const itemType = this.pForm.get('parentItemType').value;
    if (category && subCategory && itemType) {
      this.blockUI.start('Loading Parent List Items');
      this.listItemService.findByListTypeAndSubcategory(itemType, subCategory.code).pipe(untilDestroyed(this))
        .subscribe((res: any) => {
          this.listItems = res;
          this.blockUI.stop();
        }, (err) => {
          this.toastr.error('Error loading Parent List Item');
          this.blockUI.stop();
        });
    }
  }

  addSingleSubCategory() {
    const subCategory = this.pForm.get('subCategory').value;
    this.subCategorySet.clear();
    if (subCategory) {
      this.subCategorySet.add(subCategory);
    }
    this.pForm.get('subCategories').setValue(Array.from(this.subCategorySet));
  }

  addOrRemoveSubCategory($event: CodeValue, checked) {
    if (checked) {
      this.subCategorySet.add($event);
    } else {
      this.subCategorySet.forEach(value => {
        if (value.code === $event.code) {
          this.subCategorySet.delete(value);
        }
      });
    }
    this.selectedSubcategories = Array.from(this.subCategorySet);
    this.pForm.get('subCategories').setValue(this.selectedSubcategories);
  }

  populateCodeValueName(groupName) {
    if ('category' === groupName) {
      this.setGroupName(groupName, Utils.getNameFromCategory(this.categories, this.getValueFromGroupNameCode(groupName)));
    }
  }

  getSubCategories() {
    const catCode = this.getValueFromGroupNameCode('category');
    this.populateCodeValueName('category');
    if (catCode) {
      this.blockUI.start('Loading Subcategories');
      this.categoryService.getSubCategories(catCode).pipe(untilDestroyed(this)).subscribe((data: any) => {
        this.subcategories = Utils.convertCategoryoCodeValue(data);
        this.handleEditing();
        this.blockUI.stop();
      }, (err) => {
        this.blockUI.stop();
        this.toastr.error('Error loading subcategories');
      });
    } else {
      this.subcategories = [];
    }
  }

  handleEditing() {
    if (this.isEdit) {
      this.selectedSubcategories = this.listItem.subCategories;
      this.subCategorySet = new Set(this.selectedSubcategories);
      this.getParentItem();
      this.initForm();
    }
  }

  getValueFromGroupNameCode(groupName) {
    return this.pForm.get(groupName).get('code').value;
  }

  setGroupName(groupName, value) {
    this.pForm.get(groupName).get('name').setValue(value);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  create() {
    this.isLoading = true;
    this.listItem = this.pForm.value;
    this.listItemService.create(this.listItem).pipe(untilDestroyed(this)).subscribe((data) => {
      this.toastr.success('List Item ' + this.listItem.titleDescription.title + ' successfully created');
      this.reset();
      this.refreshList.emit();
      this.isLoading = false;
    }, (err) => {
      this.toastr.error('List Item creation failed');
      this.isLoading = false;
    });
  }

  update() {
    this.isLoading = true;
    this.listItem = this.pForm.value;
    this.listItemService.update(this.listItem).pipe(untilDestroyed(this)).subscribe((data) => {
      this.toastr.success('List Item ' + this.listItem.titleDescription.title + ' successfully updated');
      this.reset();
      this.refreshList.emit();
      this.closeForm.emit();
      this.isLoading = false;
    }, (err) => {
      this.toastr.error('Updating List Item failed');
      this.isLoading = false;
    });
  }

  reset() {
    this.listItem = new ListItem();
    this.selectedSubcategories = [];
    this.subcategories = [];
    this.listItems = [];
    this.subCategorySet.clear();
    this.initForm();
  }

  initForm() {
    this.pForm = this.fb.group({
      id: [this.listItem.id],
      titleDescription: this.fb.group({
        title: [this.listItem.titleDescription.title, [Validators.required]],
        description: [this.listItem.titleDescription.description]
      }),
      listCode: this.fb.group({
        dataCode: [this.listItem.listCode.dataCode, [Validators.required]]
      }),
      itemType: [this.listItem.itemType, [Validators.required]],
      parentList: [this.listItem.parentList],
      parentItemType: [this.listItem.parentItemType],
      category: this.fb.group({
        code: [this.listItem.category.code, [Validators.required]],
        name: [this.listItem.category.name]
      }),
      subCategory: [this.isEdit ? this.listItem.subCategories[0] : null],
      parentSubcat: [this.listItem.hasParent ? this.listItem.parentSubcat : null],
      subCategories: [this.listItem.subCategories],
      hasManySubCategory: [this.listItem.hasManySubCategory ? this.listItem.hasManySubCategory : false],
      hasParent: [this.listItem.hasParent ? this.listItem.hasParent : false],
    });
  }

  ngOnDestroy(): void {
  }
}
