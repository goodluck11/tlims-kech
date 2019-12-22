import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, PickListType} from 'core/model/category';
import {CATEGORY} from 'core/constant/category.const';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {EnumValues} from 'enum-values';
import {CodeValue, Condition, Contact} from 'core/model/base-model';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Utils} from 'core/utils/utils';
import {Commercial} from 'feature/items/commercial/commercial';
import {APP_URL} from 'core/constant/tlims.url';
import {Router} from '@angular/router';
import {ListItemService} from 'core/services/list-item.service';

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
  itemTypes: Array<CodeValue> = [];
  powerSources: Array<CodeValue> = [];
  shapes: Array<CodeValue> = [];
  isField1 = false; // type, Power Source, condition, shape
  isField2 = false; // weight, condition
  isField3 = false; // type
  isField4 = false; // condition
  contact: Contact = new Contact();

  constructor(private fb: FormBuilder, private listItemService: ListItemService, private itemService: ItemService,
              private toastr: ToastrService, private router: Router) {
    itemService.endPoint = 'commercials';
  }

  ngOnInit() {
    this.conditions = EnumValues.getNamesAndValues(Condition);
    this.initForm();
  }

  getContact($event) {
    this.contact = $event;
  }

  getImages($event) {
    this.files = $event;
  }

  create() {
    this.isLoading = true;
    this.commercial = this.commForm.value;
    this.commercial.contact = this.contact;
    this.itemService.create('commercial', this.commercial, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.commercial.titleDescription.title + ' successfully created');
      this.reset();
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
  }

  resolveField() {
    const subCatCode = this.getValueFromCodeValue('subCategory');
    this.subCatCode = subCatCode;
    this.resetField();
    switch (subCatCode) {
      case this.CATEGORY.COMM.SUBCATEGORY.ovens:
        this.setRequiredField('subCatType', true);
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
      case this.CATEGORY.COMM.SUBCATEGORY.medical:
        this.setRequiredField('subCatType', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField3 = true;
        break;
    }
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
      case EnumValues.getNameFromValue(PickListType, PickListType.POWER_SOURCE):
        this.powerSources = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.SHAPE):
        this.shapes = Utils.convertListItemToCodeValue(data);
        break;
    }
  }

  contactForPriceFg() {
    this.setRequiredField('price', true);
    if (this.commForm.get('contactForPrice').value) {
      this.setRequiredField('price', false);
    }
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
    this.isField3 = false;
    this.isField4 = false;
    this.setRequiredField('subCatType', false);
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
      subCatType: [this.commercial.subCatType ? this.commercial.subCatType.code ? this.commercial.subCatType : null : null],
      itemCondition: [this.commercial.itemCondition ? this.commercial.itemCondition :
        EnumValues.getNameFromValue(Condition, Condition.NEW)],
      price: [this.commercial.price],
      powerSource: [this.commercial.powerSource ? this.commercial.powerSource.code ? this.commercial.powerSource : null : null],
      contactForPrice: [this.commercial.contactForPrice],
      deckNo: [this.commercial.deckNo],
      shape: [this.commercial.shape ? this.commercial.shape.code ? this.commercial.shape : null : null],
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
