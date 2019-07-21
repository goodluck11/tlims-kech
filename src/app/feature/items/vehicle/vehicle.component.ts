import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, PickListType} from 'core/model/category';
import {Transmission, Vehicle} from 'feature/items/vehicle/vehicle';
import {CATEGORY} from 'core/constant/category.const';
import {CodeValue, Contact} from 'core/model/base-model';
import {PickListService} from 'core/services/picklist.service';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Utils} from 'core/utils/utils';
import {EnumValues} from 'enum-values';
import {APP_URL} from 'core/constant/tlims.url';

@Component({
  selector: 'tlims-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private pickListService: PickListService, private itemService: ItemService,
              private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) {
    itemService.endPoint = 'vehicles';
  }

  vehicleForm: FormGroup;
  @Input()
  subCategories: Array<Category> = [];
  vehicle: Vehicle = new Vehicle();
  CATEGORY = CATEGORY;
  isDataLoading = false;
  isLoading = false;
  files: File[] = [];
  conditions = [];
  subCatCode: string;
  parentCode: string;
  itemTypes: Array<CodeValue> = [];
  brands: Array<CodeValue> = [];
  models: Array<CodeValue> = [];
  makes: Array<CodeValue> = [];
  colors: Array<CodeValue> = [];
  years: Array<CodeValue> = [];
  transmissions: Array<any> = [];
  contact: Contact = new Contact();
  isField1 = false; // car
  isField2 = false; // heavy_equip
  isField3 = false; // motorcycle
  isField4 = false; // truck_trailer
  isField5 = false; // condition

  static markFields(control) {
    control.markAsPristine();
    control.markAsUntouched();
  }

  ngOnInit() {
    this.transmissions = EnumValues.getNamesAndValues(Transmission);
    this.getResolvedData();
    this.initForm();
    this.resolveField();
  }

  cancel() {
  }

  create() {
    this.isLoading = true;
    this.vehicle = this.vehicleForm.value;
    this.vehicle.contact = this.contact;
    this.transformObj();
    this.itemService.create('vehicle', this.vehicle, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.vehicle.titleDescription.title + ' successfully created');
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.vehicle.titleDescription.title);
      this.isLoading = false;
    });
  }

  transformObj() {
    this.vehicle.color = this.vehicle.color ? JSON.stringify(this.vehicle.color) : this.vehicle.color;
    this.vehicle.year = this.vehicle.year ? JSON.stringify(this.vehicle.year) : this.vehicle.year;
    this.vehicle.make = this.vehicle.make ? JSON.stringify(this.vehicle.make) : this.vehicle.make;
    this.vehicle.model = this.vehicle.model ? JSON.stringify(this.vehicle.model) : this.vehicle.model;
  }

  getImages($event) {
    this.files = $event;
  }

  getContact($event) {
    this.contact = $event;
  }

  getResolvedData() {
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.colors = Utils.convertPickListToCodeValue(data.colors);
    });
  }

  populateCodeValueName(groupName) {
    if ('subCategory' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromCategory(this.subCategories, this.getValueFromCodeValue(groupName)));
      this.resolveField();
    }
  }

  getDependentList(groupName) {
    this.parentCode = this.vehicleForm.get(groupName)['value'].code;
    this.isDataLoading = true;
    this.pickListService.getPicklistsByByTypeAndCategoryAndParent(EnumValues.getNameFromValue(PickListType, PickListType.MODEL),
      this.getValueFromCodeValue('category'),
      this.subCatCode, this.parentCode).pipe(untilDestroyed(this)).subscribe((data: any) => {
      if (Array(data)) {
        this.models = Utils.convertPickListToCodeValue(data);
      }
      this.isDataLoading = false;
    }, (err) => {
      this.isDataLoading = false;
    });
  }

  getPickList(listType, noParent?: boolean) {
    if (EnumValues.getNameFromValue(PickListType, PickListType.YEAR) === listType && this.years.length > 0) {
      return;
    }
    let obs$ = this.pickListService.getPicklistsByByTypeAndCategory(listType, this.getValueFromCodeValue('category'), this.subCatCode);
    if (noParent) {
      obs$ = this.pickListService.findByListType(listType);
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
        this.itemTypes = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.ITEM_MAKE):
        this.makes = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.BRAND):
        this.brands = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.YEAR):
        this.years = Utils.convertPickListToCodeValue(data);
        break;
    }
  }

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.vehicleForm.get(groupName).get('name').value : this.vehicleForm.get(groupName).get('code').value;
  }

  setNameFromCodeValue(groupName, value: any) {
    this.vehicleForm.get(groupName).get('name').setValue(value);
  }

  resolveField() {
    this.subCatCode = this.getValueFromCodeValue('subCategory');
    this.vehicle = new Vehicle();
    this.vehicle.subCategory = CodeValue.of(this.subCatCode, Utils.getNameFromCategory(this.subCategories, this.subCatCode));
    this.initForm();
    this.resetField();
    this.clearArrays();
    switch (this.subCatCode) {
      case this.CATEGORY.VEHICLE.SUBCATEGORY.cars:
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.YEAR), true);
        this.isField1 = true;
        break;
      case this.CATEGORY.VEHICLE.SUBCATEGORY.heavy_equip:
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_MAKE));
        this.isField2 = true;
        break;
      case this.CATEGORY.VEHICLE.SUBCATEGORY.mcycles_scooter:
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_MAKE));
        this.isField3 = true;
        break;
      case this.CATEGORY.VEHICLE.SUBCATEGORY.truck_trailer:
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_MAKE));
        this.isField4 = true;
        break;
    }
  }

  clearArrays() {
    this.models = [];
    this.brands = [];
    this.makes = [];
    this.itemTypes = [];
  }

  resetField() {
    this.isField1 = false;
    this.isField2 = false;
    this.isField3 = false;
    this.isField4 = false;
  }

  removeConstraints() {

  }

  setRequiredField(fieldName: string, isRequired: boolean) {
    const field = this.vehicleForm.get(fieldName);
    if (isRequired) {
      field.setValidators([Validators.required]);
      VehicleComponent.markFields(field);
    } else {
      field.clearValidators();
    }
    field.updateValueAndValidity();
  }

  initForm() {
    const subCategory = this.vehicle.subCategory.code ? this.vehicle.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.vehicleForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.vehicle.titleDescription.title, [Validators.required]],
        description: [this.vehicle.titleDescription.description]
      }),
      category: this.fb.group({
        code: [this.subCategories[0].parentCategory.categoryCode.dataCode],
        name: [this.subCategories[0].parentCategory.titleDescription.title]
      }),
      subCategory: this.fb.group({
        code: [subCategory.code, [Validators.required]],
        name: [subCategory.name, [Validators.required]]
      }),
      subCatType: [this.vehicle.subCatType ? this.vehicle.subCatType.code ? this.vehicle.subCatType : null : null],
      brand: [this.vehicle.brand ? this.vehicle.brand.code ? this.vehicle.brand : null : null],
      make: [this.vehicle.make],
      price: [this.vehicle.price],
      model: [this.vehicle.model],
      color: [this.vehicle.color],
      year: [this.vehicle.year],
      mileage: [this.vehicle.mileage],
      exchangeable: [this.vehicle.exchangeable],
      transmission: [this.vehicle.transmission],
      negotiable: [this.vehicle.negotiable],
    });
  }

  ngOnDestroy(): void {
  }
}
