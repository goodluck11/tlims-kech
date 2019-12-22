import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, ListItem, PickListType} from 'core/model/category';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Mobile, MobileCondition} from 'feature/items/mobile/mobile';
import {CodeValue, Contact} from 'core/model/base-model';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {Utils} from 'core/utils/utils';
import {CATEGORY} from 'core/constant/category.const';
import {EnumValues} from 'enum-values';
import {ListItemService} from 'core/services/list-item.service';

@Component({
  selector: 'tlims-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit, OnDestroy {

  mForm: FormGroup;
  @Input()
  subCategories: Array<Category> = [];
  CATEGORY = CATEGORY;
  mobile: Mobile = new Mobile();
  isLoading = false;
  files: File[] = [];
  conditions = [];
  isField1 = false;
  isField2 = false; // brand, model, ram, capacity, condition, screen, color, os, battery
  isField3 = false; // brand, model, capacity, condition, screen, color, os, ram
  isDataLoading = false;
  brands: Array<ListItem> = [];
  itemTypes: Array<ListItem> = [];
  colors: Array<CodeValue> = [];
  capacities: Array<CodeValue> = [];
  rams: Array<CodeValue> = [];
  models: Array<CodeValue> = [];
  operatings: Array<CodeValue> = [];
  sizes: Array<CodeValue> = [];
  subCatCode: string;
  contact: Contact = new Contact();
  parentCode: string;

  constructor(private fb: FormBuilder, private itemService: ItemService,
              private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router,
              private listItemService: ListItemService) {
    itemService.endPoint = 'mobiles';
  }

  ngOnInit() {
    this.conditions = EnumValues.getNamesAndValues(MobileCondition);
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((res) => {
      this.colors = Utils.convertPickListToCodeValue(res.colors);
    });
    this.initForm();
  }

  populateCodeValueName(groupName) {
    if ('subCategory' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromCategory(this.subCategories, this.getValueFromCodeValue(groupName)));
      this.resolveField();
    }
    if ('brand' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromListItem(this.brands, this.getValueFromCodeValue(groupName)));
      this.parentCode = this.getValueFromCodeValue(groupName);
      this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.MODEL), true);
    }
  }

  resolveField() {
    const subCatCode = this.getValueFromCodeValue('subCategory');
    this.subCatCode = subCatCode;
    this.resetField();
    switch (subCatCode) {
      case this.CATEGORY.MOBILE.SUBCATEGORY.accessories:
        this.setRequiredField('subCatType', true);
        this.setRequiredField('itemCondition', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField1 = true;
        break;
      case this.CATEGORY.MOBILE.SUBCATEGORY.phones:
      case this.CATEGORY.MOBILE.SUBCATEGORY.tablets:
        this.setCodeValueRequiredField('brand', true);
        this.setRequiredField('model', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.RAM));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.OS));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.STORE_CAPACITY));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.SIZE));
        this.isField2 = true;
        break;
    }
  }

  setCodeValueRequiredField(groupName: string, isRequired: boolean) {
    const code = this.mForm.get(groupName).get('code');
    const name = this.mForm.get(groupName).get('name');
    if (isRequired) {
      code.setValidators([Validators.required]);
      name.setValidators([Validators.required]);
      this.markFields(code);
      this.markFields(name);
    } else {
      code.clearValidators();
      name.clearValidators();
    }
    code.updateValueAndValidity();
    name.updateValueAndValidity();
  }

  setRequiredField(fieldName: string, isRequired: boolean) {
    const field = this.mForm.get(fieldName);
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

  resetField() {
    this.isField1 = false;
    this.isField2 = false;
    this.isField3 = false;
    this.removeConstraints();
  }

  removeConstraints() {
    this.setRequiredField('subCatType', false);
    this.setCodeValueRequiredField('brand', false);
    this.setRequiredField('itemCondition', false);
    this.setRequiredField('model', false);
  }

  getPickList(listType, withParent?: boolean) {
    let obs$ = this.listItemService.findByListTypeAndSubcategory(listType, this.subCatCode);
    if (withParent) {
      obs$ = this.listItemService.findByListTypeSubcategoryAndParentList(listType, this.subCatCode, this.parentCode);
    }
    this.isDataLoading = true;
    obs$.pipe(untilDestroyed(this)).subscribe((data: any) => {
      if (Array(data)) {
        this.mapValues(listType, data);
      }
      this.isDataLoading = false;
    }, (err) => {
      this.isDataLoading = false;
    });
  }

  mapValues(listType, data) {
    switch (listType) {
      case EnumValues.getNameFromValue(PickListType, PickListType.BRAND):
        this.brands = data;
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE):
        this.itemTypes = data;
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.STORE_CAPACITY):
        this.capacities = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.RAM):
        this.rams = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.SIZE):
        this.sizes = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.OS):
        this.operatings = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.MODEL):
        this.models = Utils.convertListItemToCodeValue(data);
        break;
    }
  }

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.mForm.get(groupName).get('name').value : this.mForm.get(groupName).get('code').value;
  }

  setNameFromCodeValue(groupName, value: any) {
    this.mForm.get(groupName).get('name').setValue(value);
  }

  initForm() {
    const subCategory = this.mobile.subCategory.code ? this.mobile.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.mForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.mobile.titleDescription.title, [Validators.required]],
        description: [this.mobile.titleDescription.description]
      }),
      category: this.fb.group({
        code: [this.subCategories[0].parentCategory.categoryCode.dataCode],
        name: [this.subCategories[0].parentCategory.titleDescription.title]
      }),
      subCategory: this.fb.group({
        code: [subCategory.code, [Validators.required]],
        name: [subCategory.name, [Validators.required]]
      }),
      subCatType: [this.mobile.subCatType ? this.mobile.subCatType.code ? this.mobile.subCatType : null : null],
      brand: this.fb.group({
        code: [this.mobile.brand.code],
        name: [this.mobile.brand.name]
      }),
      itemCondition: [this.mobile.itemCondition ? this.mobile.itemCondition :
        EnumValues.getNameFromValue(MobileCondition, MobileCondition.USED)],
      model: [this.mobile.model ? this.mobile.model.code ? this.mobile.model : null : null],
      color: [this.mobile.color],
      os: [this.mobile.os ? this.mobile.os.code ? this.mobile.os : null : null],
      ram: [this.mobile.ram ? this.mobile.ram.code ? this.mobile.ram : null : null],
      screenSize: [this.mobile.screenSize ? this.mobile.screenSize.code ? this.mobile.screenSize : null : null],
      storageCapacity: [this.mobile.storageCapacity ? this.mobile.storageCapacity.code ? this.mobile.storageCapacity : null : null],
      isExchangeable: [this.mobile.isExchangeable],
      price: [this.mobile.price, [Validators.required]],
      negotiable: [this.mobile.negotiable]
    });
    this.resolveField();
  }

  getImages($event) {
    this.files = $event;
  }

  getContact($event) {
    this.contact = $event;
  }

  create() {
    this.isLoading = true;
    this.mobile = this.mForm.value;
    this.mobile.contact = this.contact;
    this.itemService.create('mobile', this.mobile, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.mobile.titleDescription.title + ' successfully created');
      this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.mobile.titleDescription.title);
      this.isLoading = false;
    });
  }

  cancel() {
    console.log(this.mForm);
  }

  reset() {
    this.mobile = new Mobile();
    this.initForm();
    this.files = [];
  }

  ngOnDestroy(): void {
  }

}
