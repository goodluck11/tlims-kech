import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, PickListType} from 'core/model/category';
import {Electronic} from 'feature/items/electronics/electronic';
import {CATEGORY} from 'core/constant/category.const';
import {EnumValues} from 'enum-values';
import {CodeValue, Condition, Contact} from 'core/model/base-model';
import {Utils} from 'core/utils/utils';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {APP_URL} from 'core/constant/tlims.url';
import {ListItemService} from 'core/services/list-item.service';

@Component({
  selector: 'tlims-electronics',
  templateUrl: './electronics.component.html',
  styleUrls: ['./electronics.component.scss']
})
export class ElectronicsComponent implements OnInit, OnDestroy {

  eForm: FormGroup;
  electronic: Electronic = new Electronic();
  CATEGORY = CATEGORY;
  @Input()
  subCategories: Array<Category> = [];
  isField1 = false; // type
  isField2 = false; // brand, type
  isField3 = false;
  isField4 = false; // brand, type, subtype, ram, processor, model, core
  conditions = [];
  subCatCode: string;
  itemTypes: Array<CodeValue> = [];
  itemMakes: Array<CodeValue> = [];
  brands: Array<CodeValue> = [];
  rams: Array<CodeValue> = [];
  cores: Array<CodeValue> = [];
  storeCapacities: Array<CodeValue> = [];
  processors: Array<CodeValue> = [];
  isDataLoading = false;
  isLoading = false;
  files: File[] = [];
  contact: Contact = new Contact();

  constructor(private fb: FormBuilder, private listItemService: ListItemService, private itemService: ItemService,
              private toastr: ToastrService, private router: Router) {
    itemService.endPoint = 'electronics';
  }

  ngOnInit() {
    this.conditions = EnumValues.getNamesAndValues(Condition);
    this.initForm();
  }

  getImages($event) {
    this.files = $event;
  }

  getContact($event) {
    this.contact = $event;
  }

  create() {
    this.isLoading = true;
    this.electronic = this.eForm.value;
    this.electronic.contact = this.contact;
    this.itemService.create('electronic', this.electronic, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.electronic.titleDescription.title + ' successfully created');
      this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.electronic.titleDescription.title);
      // console.log(err);
      this.isLoading = false;
    });
  }

  cancel() {

  }

  reset() {
    this.electronic = new Electronic();
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
      case this.CATEGORY.ELECT.SUBCATEGORY.audio:
      case this.CATEGORY.ELECT.SUBCATEGORY.videos:
      case this.CATEGORY.ELECT.SUBCATEGORY.comp_hardware:
        this.setRequiredField('subCatType', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField1 = true;
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.photos:
        this.setRequiredField('subCatType', true);
        this.setRequiredField('electMake', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_MAKE));
        this.isField3 = true;
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.comp_access:
        this.setRequiredField('subCatType', true);
        this.setRequiredField('brand', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.isField2 = true;
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.laptops:
        this.setRequiredField('subCatType', true);
        this.setRequiredField('brand', true);
        this.setRequiredField('model', true);
        this.setRequiredField('processor', true);
        this.setRequiredField('coreNo', true);
        this.setRequiredField('ram', true);
        this.setRequiredField('capacity', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.PROCESSOR));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.RAM));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.CORES));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.STORE_CAPACITY));
        this.isField4 = true;
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.tv_equip:
        this.setRequiredField('subCatType', true);
        this.setRequiredField('brand', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.isField2 = true;
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.vid_games:
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
      case EnumValues.getNameFromValue(PickListType, PickListType.ITEM_MAKE):
        this.itemMakes = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.BRAND):
        this.brands = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.PROCESSOR):
        this.processors = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.RAM):
        this.rams = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.CORES):
        this.cores = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.STORE_CAPACITY):
        this.storeCapacities = Utils.convertListItemToCodeValue(data);
        break;
    }
  }

  setRequiredField(fieldName: string, isRequired: boolean) {
    const field = this.eForm.get(fieldName);
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
    this.setRequiredField('model', false);
    this.setRequiredField('subCatType', false);
    this.setRequiredField('brand', false);
    this.setRequiredField('processor', false);
    this.setRequiredField('coreNo', false);
    this.setRequiredField('ram', false);
    this.setRequiredField('electMake', false);
    this.setRequiredField('capacity', false);
  }

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.eForm.get(groupName).get('name').value : this.eForm.get(groupName).get('code').value;
  }

  setNameFromCodeValue(groupName, value: any) {
    this.eForm.get(groupName).get('name').setValue(value);
  }

  initForm() {
    const subCategory = this.electronic.subCategory.code ? this.electronic.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.eForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.electronic.titleDescription.title, [Validators.required]],
        description: [this.electronic.titleDescription.description]
      }),
      category: this.fb.group({
        code: [this.subCategories[0].parentCategory.categoryCode.dataCode],
        name: [this.subCategories[0].parentCategory.titleDescription.title]
      }),
      subCategory: this.fb.group({
        code: [subCategory.code, [Validators.required]],
        name: [subCategory.name, [Validators.required]]
      }),
      subCatType: [this.electronic.subCatType ? this.electronic.subCatType.code ? this.electronic.subCatType : null : null],
      brand: [this.electronic.brand ? this.electronic.brand.code ? this.electronic.brand : null : null],
      electMake: [this.electronic.electMake ? this.electronic.electMake.code ? this.electronic.electMake : null : null],
      model: [this.electronic.model],
      processor: [this.electronic.processor ? this.electronic.processor.code ? this.electronic.processor : null : null],
      coreNo: [this.electronic.coreNo ? this.electronic.coreNo.code ? this.electronic.coreNo : null : null],
      ram: [this.electronic.ram ? this.electronic.ram.code ? this.electronic.ram : null : null],
      capacity: [this.electronic.capacity ? this.electronic.capacity.code ? this.electronic.capacity : null : null],
      itemCondition: [this.electronic.itemCondition, [Validators.required]],
      price: [this.electronic.price, [Validators.required]],
      negotiable: [this.electronic.negotiable],
      contact: []
    });
    this.resolveField();
  }

  ngOnDestroy(): void {
  }
}
