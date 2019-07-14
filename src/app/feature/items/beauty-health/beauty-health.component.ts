import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, Picklist, PickListType} from 'core/model/category';
import {PickListService} from 'core/services/picklist.service';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {CATEGORY} from 'core/constant/category.const';
import {Beauty} from 'feature/items/beauty-health/beauty';
import {CodeValue, Contact, Gender} from 'core/model/base-model';
import {Utils} from 'core/utils/utils';
import {EnumValues} from 'enum-values';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';

@Component({
  selector: 'tlims-beauty-health',
  templateUrl: './beauty-health.component.html',
  styleUrls: ['./beauty-health.component.scss']
})
export class BeautyHealthComponent implements OnInit, OnDestroy {

  bForm: FormGroup;
  CATEGORY = CATEGORY;
  @Input()
  subCategories: Array<Category> = [];
  isField1 = false; // gender, brand, secent, formulation, volume
  isField2 = false; // type
  isField3 = false; // tone, brand, color, gender
  isField5 = false; // type, package, formulation, age group
  isField4 = false; // gender, type, target area, skin type, benefits
  genders = [];
  subCatCode: string;
  itemTypes: Array<Picklist> = [];
  brands: Array<Picklist> = [];
  scents: Array<CodeValue> = [];
  colors: Array<CodeValue> = [];
  tones: Array<CodeValue> = [];
  skinTypes: Array<CodeValue> = [];
  targetAreas: Array<CodeValue> = [];
  packages: Array<CodeValue> = [];
  benefits: Array<CodeValue> = [];
  ageGroups: Array<CodeValue> = [];
  formulations: Array<CodeValue> = [];
  isDataLoading = false;
  isLoading = false;
  files: File[] = [];
  beauty: Beauty = new Beauty();
  parentCode: string;
  contact: Contact = new Contact();

  constructor(private fb: FormBuilder, private pickListService: PickListService, private itemService: ItemService,
              private toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute) {
    itemService.endPoint = 'beauties';
  }

  ngOnInit() {
    this.genders = EnumValues.getNamesAndValues(Gender);
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((res) => {
      this.colors = Utils.convertPickListToCodeValue(res.colors);
    });
    this.initForm();
  }

  getImages($event) {
    this.files = $event;
  }

  getContact($event) {
    this.contact = $event;
  }

  setCodeValueRequiredField(groupName: string, isRequired: boolean) {
    const code = this.bForm.get(groupName).get('code');
    const name = this.bForm.get(groupName).get('name');
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
    const field = this.bForm.get(fieldName);
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

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.bForm.get(groupName).get('name').value : this.bForm.get(groupName).get('code').value;
  }

  setNameFromCodeValue(groupName, value: any) {
    this.bForm.get(groupName).get('name').setValue(value);
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
      case EnumValues.getNameFromValue(PickListType, PickListType.BRAND):
        this.brands = data;
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.SCENT):
        this.scents = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.FORMULA):
        this.formulations = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.SKIN):
        this.skinTypes = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.TARGET_AREA):
        this.targetAreas = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.AGE_GROUP):
        this.ageGroups = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.PACKAGE):
        this.packages = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.BENEFIT):
        this.benefits = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.TONE):
        this.tones = Utils.convertPickListToCodeValue(data);
        break;
    }
  }

  resolveField() {
    const subCatCode = this.getValueFromCodeValue('subCategory');
    this.subCatCode = subCatCode;
    this.resetField();
    switch (subCatCode) {
      case this.CATEGORY.BEAUTY.SUBCATEGORY.body:
        break;
      case this.CATEGORY.BEAUTY.SUBCATEGORY.fragrance:
        this.isField1 = true;
        this.setCodeValueRequiredField('brand', true);
        this.setRequiredField('formulation', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.SCENT));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.FORMULA));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        break;
      case this.CATEGORY.BEAUTY.SUBCATEGORY.sexual:
      case this.CATEGORY.BEAUTY.SUBCATEGORY.hair:
        this.setCodeValueRequiredField('subCatType', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField2 = true;
        break;
      case this.CATEGORY.BEAUTY.SUBCATEGORY.makeup:
        this.setCodeValueRequiredField('subCatType', true);
        this.setCodeValueRequiredField('brand', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.TONE));
        this.isField3 = true;
        break;
      case this.CATEGORY.BEAUTY.SUBCATEGORY.skin:
        this.setCodeValueRequiredField('subCatType', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.SKIN));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.TARGET_AREA));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BENEFIT));
        this.isField4 = true;
        break;
      case this.CATEGORY.BEAUTY.SUBCATEGORY.supplements:
        this.setCodeValueRequiredField('subCatType', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.FORMULA));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.AGE_GROUP));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.PACKAGE));
        this.isField5 = true;
        break;
    }
  }

  resetField() {
    this.isField1 = false;
    this.isField2 = false;
    this.isField3 = false;
    this.isField4 = false;
    this.isField5 = false;
    this.removeConstraints();
  }

  removeConstraints() {
    this.setCodeValueRequiredField('subCatType', false);
    this.setCodeValueRequiredField('brand', false);
    this.setRequiredField('formulation', false);
  }

  initForm() {
    const subCategory = this.beauty.subCategory.code ? this.beauty.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.bForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.beauty.titleDescription.title, [Validators.required]],
        description: [this.beauty.titleDescription.description]
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
        name: [this.beauty.subCatType.name]
      }),
      brand: this.fb.group({
        code: [this.beauty.brand.code],
        name: [this.beauty.brand.name]
      }),
      price: [this.beauty.price, [Validators.required]],
      scent: [this.beauty.scent],
      vPackage: [this.beauty.vPackage],
      tone: [this.beauty.tone],
      gender: [this.beauty.gender],
      volume: [this.beauty.volume],
      ageGroup: [this.beauty.ageGroup],
      formulation: [this.beauty.formulation],
      benefits: [this.beauty.benefits],
      color: [this.beauty.color],
      skinType: [this.beauty.skinType],
      targetArea: [this.beauty.targetArea],
      negotiable: [this.beauty.negotiable],
    });
    this.resolveField();
  }

  create() {
    this.isLoading = true;
    this.beauty = this.bForm.value;
    this.beauty.contact = this.contact;
    this.transformObj();
    this.itemService.create('beauty', this.beauty, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.beauty.titleDescription.title + ' successfully created');
      this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.beauty.titleDescription.title);
      // console.log(err);
      this.isLoading = false;
    });
  }

  cancel() {

  }

  transformObj() {
    this.beauty.targetArea = this.beauty.targetArea ? JSON.stringify(this.beauty.targetArea) : this.beauty.targetArea;
    this.beauty.color = this.beauty.color ? JSON.stringify(this.beauty.color) : this.beauty.color;
    this.beauty.formulation = this.beauty.formulation ? JSON.stringify(this.beauty.formulation) : this.beauty.formulation;
    this.beauty.scent = this.beauty.scent ? JSON.stringify(this.beauty.scent) : this.beauty.scent;
    this.beauty.tone = this.beauty.tone ? JSON.stringify(this.beauty.tone) : this.beauty.tone;
    this.beauty.skinType = this.beauty.skinType ? JSON.stringify(this.beauty.skinType) : this.beauty.skinType;
    this.beauty.benefits = this.beauty.benefits ? JSON.stringify(this.beauty.benefits) : this.beauty.benefits;
    this.beauty.vPackage = this.beauty.vPackage ? JSON.stringify(this.beauty.vPackage) : this.beauty.vPackage;
    this.beauty.ageGroup = this.beauty.ageGroup ? JSON.stringify(this.beauty.ageGroup) : this.beauty.ageGroup;
  }

  reset() {
    this.beauty = new Beauty();
    this.initForm();
    this.files = [];
  }

  ngOnDestroy(): void {
  }

}
