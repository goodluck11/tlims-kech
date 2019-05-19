import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, Picklist, PickListType} from 'core/model/category';
import {CATEGORY} from 'core/constant/category.const';
import {PickListService} from 'core/services/picklist.service';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {EnumValues} from 'enum-values';
import {CodeValue, Condition} from 'core/model/base-model';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Utils} from 'core/utils/utils';
import {Commercial} from 'feature/items/commercial/commercial';
import {APP_URL} from 'core/constant/tlims.url';
import {Router} from '@angular/router';

@Component({
  selector: 'tlims-commercial',
  templateUrl: './commercial.component.html',
  styleUrls: ['./commercial.component.scss']
})
export class CommercialComponent implements OnInit, OnDestroy {

  commForm: FormGroup;
  commercial: Commercial = new Commercial();
  @Input()
  subCategories: Array<Category> = [];
  CATEGORY = CATEGORY;
  isDataLoading = false;
  isLoading = false;
  files: File[] = [];
  conditions = [];
  subCatCode: string;
  itemTypes: Array<Picklist> = [];
  powerSources: Array<Picklist> = [];
  shapes: Array<Picklist> = [];
  isField1 = false; // type, Power Source, condition, shape
  isField2 = false; // weight, condition


  constructor(private fb: FormBuilder, private pickListService: PickListService, private itemService: ItemService,
              private toastr: ToastrService, private router: Router) {
    itemService.endPoint = 'commercials';
  }

  ngOnInit() {
    this.conditions = EnumValues.getNamesAndValues(Condition);
    this.initForm();
  }

  getImages($event) {
    this.files = $event;
  }

  create() {
    this.isLoading = true;
    this.commercial = this.commForm.value;
    this.itemService.create('commercial', this.commercial, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.reset();
      this.toastr.success('Ad ' + this.commercial.titleDescription.title + ' successfully created');
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.commercial.titleDescription.title);
      this.isLoading = false;
    });
  }

  cancel() {

  }

  reset() {
    this.commercial = new Commercial();
    this.initForm();
    this.files = [];
  }

  populateCodeValueName(groupName) {
    if ('subCategory' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromCategory(this.subCategories, this.getValueFromCodeValue(groupName)));
      this.resolveField();
    }
    if ('subCatType' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromPicklist(this.itemTypes, this.getValueFromCodeValue(groupName)));
    }
  }

  resolveField() {
    const subCatCode = this.getValueFromCodeValue('subCategory');
    this.subCatCode = subCatCode;
    this.resetField();
    switch (subCatCode) {
      case this.CATEGORY.COMM.SUBCATEGORY.ovens:
        this.setCodeValueRequiredField('subCatType', true);
        this.setRequiredField('powerSource', true);
        this.setRequiredField('itemCondition', true);
        this.setRequiredField('shape', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.POWER_SOURCE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.SHAPE));
        this.isField1 = true;
        break;
      case this.CATEGORY.COMM.SUBCATEGORY.restaurant:
        this.setRequiredField('itemCondition', true);
        this.isField2 = true;
        break;
    }
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
      // console.log(err);
    });
  }

  mapValues(listType, data) {
    switch (listType) {
      case EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE):
        this.itemTypes = data;
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.POWER_SOURCE):
        this.powerSources = data;
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.SHAPE):
        this.shapes = data;
        break;
    }
  }

  contactForPriceFg() {
    this.setRequiredField('price', true);
    if (this.commForm.get('contactForPrice').value) {
      this.setRequiredField('price', false);
    }
  }

  setCodeValueRequiredField(groupName: string, isRequired: boolean) {
    const code = this.commForm.get(groupName).get('code');
    const name = this.commForm.get(groupName).get('name');
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
    const field = this.commForm.get(fieldName);
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
    this.setCodeValueRequiredField('subCatType', false);
    this.setRequiredField('powerSource', false);
    this.setRequiredField('itemCondition', false);
    this.setRequiredField('shape', false);
  }

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.commForm.get(groupName).get('name').value : this.commForm.get(groupName).get('code').value;
  }

  setNameFromCodeValue(groupName, value: any) {
    this.commForm.get(groupName).get('name').setValue(value);
  }


  initForm() {
    const subCategory = this.commercial.subCategory.code ? this.commercial.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.commForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.commercial.titleDescription.title, [Validators.required]],
        description: [this.commercial.titleDescription.description]
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
        code: [this.commercial.subCatType.code],
        name: [this.commercial.subCatType.name]
      }),
      itemCondition: [this.commercial.itemCondition ? this.commercial.itemCondition :
        EnumValues.getNameFromValue(Condition, Condition.NEW)],
      price: [this.commercial.price],
      powerSource: [this.commercial.powerSource],
      contactForPrice: [this.commercial.contactForPrice],
      deckNo: [this.commercial.deckNo],
      shape: [this.commercial.shape],
      trayNo: [this.commercial.trayNo],
      weight: [this.commercial.weight],
      maxTemperature: [this.commercial.maxTemperature],
      voltage: [this.commercial.voltage],
      negotiable: [this.commercial.negotiable]
    });
    this.resolveField();
    this.contactForPriceFg();
  }

  ngOnDestroy(): void {
  }
}
