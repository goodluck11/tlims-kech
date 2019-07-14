import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, Picklist, PickListType} from 'core/model/category';
import {Electronic} from 'feature/items/electronics/electronic';
import {CATEGORY} from 'core/constant/category.const';
import {EnumValues} from 'enum-values';
import {CodeValue, Condition, Contact} from 'core/model/base-model';
import {Utils} from 'core/utils/utils';
import {PickListService} from 'core/services/picklist.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {APP_URL} from 'core/constant/tlims.url';

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
  itemTypes: Array<Picklist> = [];
  itemMakes: Array<Picklist> = [];
  brands: Array<Picklist> = [];
  rams: Array<Picklist> = [];
  cores: Array<Picklist> = [];
  models: Array<Picklist> = [];
  subTypes: Array<Picklist> = [];
  processors: Array<Picklist> = [];
  isDataLoading = false;
  isLoading = false;
  files: File[] = [];
  parentCode: string;
  contact: Contact = new Contact();

  constructor(private fb: FormBuilder, private pickListService: PickListService, private itemService: ItemService,
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
    if ('subCatType' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromPicklist(this.itemTypes, this.getValueFromCodeValue(groupName)));
      if (this.isField4) {
        this.parentCode = this.getValueFromCodeValue(groupName);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND), true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.SUB_TYPE), true);
      }
    }
    if ('electMake' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromPicklist(this.itemMakes, this.getValueFromCodeValue(groupName)));
    }
    if ('electModel' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromPicklist(this.models, this.getValueFromCodeValue(groupName)));
    }
    if ('brand' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromPicklist(this.brands, this.getValueFromCodeValue(groupName)));
      if (this.isField4) {
        this.parentCode = this.getValueFromCodeValue(groupName);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.MODEL), true);
      }
    }
    if ('electSubType' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromPicklist(this.subTypes, this.getValueFromCodeValue(groupName)));
    }
    if ('processor' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromPicklist(this.processors, this.getValueFromCodeValue(groupName)));
    }
    if ('coreNo' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromPicklist(this.cores, this.getValueFromCodeValue(groupName)));
    }
    if ('ram' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromPicklist(this.rams, this.getValueFromCodeValue(groupName)));
    }
  }

  resolveField() {
    const subCatCode = this.getValueFromCodeValue('subCategory');
    this.subCatCode = subCatCode;
    this.resetField();
    switch (subCatCode) {
      case this.CATEGORY.ELECT.SUBCATEGORY.audio:
      case this.CATEGORY.ELECT.SUBCATEGORY.videos:
        this.isField1 = true;
        this.setCodeValueRequiredField('subCatType', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.cameras:
        this.setCodeValueRequiredField('subCatType', true);
        this.setCodeValueRequiredField('electMake', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField3 = true;
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.comp_access:
        this.setCodeValueRequiredField('subCatType', true);
        this.setCodeValueRequiredField('brand', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.isField2 = true;
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.comp_hardware:
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.laptops:
        this.setCodeValueRequiredField('subCatType', true);
        this.setCodeValueRequiredField('brand', true);
        this.setCodeValueRequiredField('electModel', true);
        this.setCodeValueRequiredField('electSubType', true);
        this.setCodeValueRequiredField('processor', true);
        this.setCodeValueRequiredField('coreNo', true);
        this.setCodeValueRequiredField('ram', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.PROCESSOR));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.RAM));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.CORES));
        this.isField4 = true;
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.tv_equip:
        this.setCodeValueRequiredField('subCatType', true);
        this.setCodeValueRequiredField('brand', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.isField2 = true;
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.vid_games:
        break;
      case this.CATEGORY.ELECT.SUBCATEGORY.vidcam:
        this.setCodeValueRequiredField('subCatType', true);
        this.setCodeValueRequiredField('electMake', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_MAKE));
        this.isField3 = true;
        break;
    }
  }

  getPickList(listType, withParent?: boolean) {
    let obs$ = this.pickListService.getPicklistsByByTypeAndCategory(listType, this.getValueFromCodeValue('category'), this.subCatCode);
    if (withParent) {
      obs$ = this.pickListService.getPicklistsByByTypeAndCategoryAndParent(listType, this.getValueFromCodeValue('category'),
        this.subCatCode, this.parentCode);
    }
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
      case EnumValues.getNameFromValue(PickListType, PickListType.ITEM_MAKE):
        this.itemMakes = data;
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.BRAND):
        this.brands = data;
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.MODEL):
        this.models = data;
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.PROCESSOR):
        this.processors = data;
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.RAM):
        this.rams = data;
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.SUB_TYPE):
        this.subTypes = data;
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.CORES):
        this.cores = data;
        break;
    }
  }

  setCodeValueRequiredField(groupName: string, isRequired: boolean) {
    const code = this.eForm.get(groupName).get('code');
    const name = this.eForm.get(groupName).get('name');
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

  markFields(control) {
    control.markAsPristine();
    control.markAsUntouched();
  }

  resetField() {
    this.isField1 = false;
    this.isField2 = false;
    this.isField3 = false;
    this.isField4 = false;
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
      subCatType: this.fb.group({
        code: [],
        name: [this.electronic.subCatType.name]
      }),
      brand: this.fb.group({
        code: [this.electronic.brand.code],
        name: [this.electronic.brand.name]
      }),
      electMake: this.fb.group({
        code: [this.electronic.electMake.code],
        name: [this.electronic.electMake.name]
      }),
      electModel: this.fb.group({
        code: [this.electronic.electModel.code],
        name: [this.electronic.electModel.name]
      }),
      electSubType: this.fb.group({
        code: [this.electronic.electSubType.code],
        name: [this.electronic.electSubType.name]
      }),
      processor: this.fb.group({
        code: [this.electronic.processor.code],
        name: [this.electronic.processor.name]
      }),
      coreNo: this.fb.group({
        code: [this.electronic.coreNo.code],
        name: [this.electronic.coreNo.name]
      }),
      ram: this.fb.group({
        code: [this.electronic.ram.code],
        name: [this.electronic.ram.name]
      }),
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
