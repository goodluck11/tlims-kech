import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, Picklist, PickListType} from 'core/model/category';
import {PickListService} from 'core/services/picklist.service';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Mobile} from 'feature/items/mobile/mobile';
import {CodeValue, Condition} from 'core/model/base-model';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {Utils} from 'core/utils/utils';
import {CATEGORY} from 'core/constant/category.const';
import {EnumValues} from 'enum-values';

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
  brands: Array<Picklist> = [];
  itemTypes: Array<Picklist> = [];
  colors: Array<CodeValue> = [];
  capacities: Array<CodeValue> = [];
  rams: Array<CodeValue> = [];
  operatings: Array<CodeValue> = [];
  sizes: Array<CodeValue> = [];
  subCatCode: string;

  constructor(private fb: FormBuilder, private pickListService: PickListService, private itemService: ItemService,
              private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) {
    itemService.endPoint = 'mobiles';
  }

  ngOnInit() {
    this.conditions = EnumValues.getNamesAndValues(Condition);
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
    if ('subCatType' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromPicklist(this.itemTypes, this.getValueFromCodeValue(groupName)));
    }
    if ('brand' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromPicklist(this.brands, this.getValueFromCodeValue(groupName)));
    }
  }

  resolveField() {
    const subCatCode = this.getValueFromCodeValue('subCategory');
    this.subCatCode = subCatCode;
    console.log(subCatCode);

    this.resetField();
    switch (subCatCode) {
      case this.CATEGORY.MOBILE.SUBCATEGORY.accessories:
        this.setCodeValueRequiredField('subCatType', true);
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
    this.setCodeValueRequiredField('subCatType', false);
    this.setCodeValueRequiredField('brand', false);
    this.setRequiredField('itemCondition', false);
    this.setRequiredField('model', false);
  }

  getPickList(listType) {
    const obs$ = this.pickListService.getPicklistsByByTypeAndCategory(listType, this.getValueFromCodeValue('category'), this.subCatCode);
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
        this.capacities = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.RAM):
        this.rams = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.SIZE):
        this.sizes = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.OS):
        this.operatings = Utils.convertPickListToCodeValue(data);
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
      subCatType: this.fb.group({
        code: [],
        name: [this.mobile.subCatType.name]
      }),
      brand: this.fb.group({
        code: [this.mobile.brand.code],
        name: [this.mobile.brand.name]
      }),
      itemCondition: [this.mobile.itemCondition],
      model: [this.mobile.model],
      color: [this.mobile.color],
      os: [this.mobile.os],
      ram: [this.mobile.ram],
      screenSize: [this.mobile.screenSize],
      storageCapacity: [this.mobile.storageCapacity],
      isExchangeable: [this.mobile.isExchangeable],
      price: [this.mobile.price, [Validators.required]],
      negotiable: [this.mobile.negotiable]
    });
    this.resolveField();
  }

  getImages($event) {
    this.files = $event;
  }

  create() {
    this.isLoading = true;
    this.mobile = this.mForm.value;
    this.itemService.create('fashion', this.mobile, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.mobile.titleDescription.title + ' successfully created');
      this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.mobile.titleDescription.title);
      console.log(err);
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
