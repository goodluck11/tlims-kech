import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Garden} from 'feature/items/garden/garden';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Category, PickListType} from 'core/model/category';
import {CATEGORY} from 'core/constant/category.const';
import {CodeValue, Condition, Contact} from 'core/model/base-model';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {Utils} from 'core/utils/utils';
import {EnumValues} from 'enum-values';
import {ListItemService} from 'core/services/list-item.service';
import {MsgService} from 'core/services/msg.service';

@Component({
  selector: 'tlims-garden',
  templateUrl: './garden.component.html',
  styleUrls: ['./garden.component.scss']
})
export class GardenComponent implements OnInit, OnDestroy {

  gForm: FormGroup;
  garden: Garden = new Garden();
  @Input()
  subCategories: Array<Category> = [];
  CATEGORY = CATEGORY;
  isLoading = false;
  isDataLoading = false;
  files: File[];
  contact: Contact = new Contact();
  isField1 = false; // type, condition
  isField3 = false; // type only
  isField2 = false; // color
  itemTypes: Array<CodeValue> = [];
  colors: Array<CodeValue> = [];
  subCatCode: string;

  constructor(private fb: FormBuilder, private itemService: ItemService, private listItemService: ListItemService,
              private msgService: MsgService, private router: Router, private activatedRoute: ActivatedRoute) {
    itemService.endPoint = 'gardens';
  }

  ngOnInit() {
    this.reset();
    this.getResolvedData();
  }

  getContact($event) {
    this.contact = $event;
  }

  getImages($event) {
    this.files = $event;
  }

  create() {
    this.isLoading = true;
    this.garden = this.gForm.value;
    this.garden.contact = this.contact;
    this.itemService.create('garden', this.garden, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.msgService.success('Ad ' + this.garden.titleDescription.title + ' successfully created');
      this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.msgService.error(err);
      this.isLoading = false;
    });
  }

  cancel() {
    console.log(this.gForm.value);
  }

  reset() {
    this.garden = new Garden();
    this.files = [];
    this.initForm();
  }

  getResolvedData() {
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.colors = Utils.convertPickListToCodeValue(data.colors);
    });
  }

  getPickList(listType) {
    const obs$ = this.listItemService.findByListTypeAndSubcategory(listType, this.subCatCode);
    this.isDataLoading = true;
    obs$.pipe(untilDestroyed(this)).subscribe((data: any) => {
      if (Array(data)) {
        this.mapValues(listType, data);
      }
      this.isDataLoading = false;
    }, (err) => {
      this.isDataLoading = false;
      // console.log(err);
    });
  }

  mapValues(listType, data) {
    switch (listType) {
      case EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE):
        this.itemTypes = Utils.convertListItemToCodeValue(data);
        break;
    }
  }

  populateCodeValueName(groupName) {
    if ('subCategory' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromCategory(this.subCategories, this.getValueFromCodeValue(groupName)));
      this.resolveField();
    }
  }

  resolveField() {
    const subCatCode = this.getValueFromCodeValue('subCategory');
    this.subCatCode = subCatCode;
    this.resetField();
    switch (subCatCode) {
      case this.CATEGORY.GARDEN.SUBCATEGORY.furniture:
      case this.CATEGORY.GARDEN.SUBCATEGORY.kitchen_app:
        this.setRequiredField('subCatType', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField1 = true;
        this.isField2 = true;
        break;
      case this.CATEGORY.GARDEN.SUBCATEGORY.home_access:
      case this.CATEGORY.GARDEN.SUBCATEGORY.kitchen:
        this.isField3 = true;
        this.setRequiredField('subCatType', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        break;
      case this.CATEGORY.GARDEN.SUBCATEGORY.home_app:
      case this.CATEGORY.GARDEN.SUBCATEGORY.garden:
        this.setRequiredField('subCatType', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField1 = true;
    }
  }

  resetField() {
    this.isField1 = false;
    this.isField2 = false;
    this.isField3 = false;
    this.setRequiredField('subCatType', false);
  }

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.gForm.get(groupName).get('name').value : this.gForm.get(groupName).get('code').value;
  }

  setNameFromCodeValue(groupName, value: any) {
    this.gForm.get(groupName).get('name').setValue(value);
  }

  setRequiredField(fieldName: string, isRequired: boolean) {
    const field = this.gForm.get(fieldName);
    if (isRequired) {
      field.setValidators([Validators.required]);
      this.markFields(field);
    } else {
      field.clearValidators();
    }
    field.updateValueAndValidity();
  }

  markFields(control) {
    control.markAsPristine();
    control.markAsUntouched();
  }

  initForm() {
    const subCategory = this.garden.subCategory.code ? this.garden.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.gForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.garden.titleDescription.title, [Validators.required]],
        description: [this.garden.titleDescription.description]
      }),
      category: this.fb.group({
        code: [this.subCategories[0].parentCategory.categoryCode.dataCode],
        name: [this.subCategories[0].parentCategory.titleDescription.title]
      }),
      subCategory: this.fb.group({
        code: [subCategory.code, [Validators.required]],
        name: [subCategory.name, [Validators.required]]
      }),
      subCatType: [this.garden.subCatType ? this.garden.subCatType.code ? this.garden.subCatType : null : null],
      itemCondition: [this.garden.itemCondition ? this.garden.itemCondition :
        EnumValues.getNameFromValue(Condition, Condition.NEW)],
      color: [this.garden.color],
      price: [this.garden.price],
      negotiable: [this.garden.negotiable]
    });
    this.resolveField();
  }

  ngOnDestroy(): void {
  }

}
