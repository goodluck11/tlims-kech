import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Estate, FurnishType} from 'feature/items/real-estate/estate';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, PickListType} from 'core/model/category';
import {CATEGORY} from 'core/constant/category.const';
import {CodeValue, Contact} from 'core/model/base-model';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {EnumValues} from 'enum-values';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {Utils} from 'core/utils/utils';
import {ListItemService} from 'core/services/list-item.service';

@Component({
  selector: 'tlims-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.scss']
})
export class RealEstateComponent implements OnInit, OnDestroy {

  estate: Estate;
  rForm: FormGroup;
  @Input()
  subCategories: Array<Category> = [];
  CATEGORY = CATEGORY;
  isLoading = false;
  isDataLoading = false;
  files: File[];
  contact: Contact = new Contact();
  isField1 = false; // furnishing,
  isField2 = false; // property type, room total, bathroom, toilet, parking space
  isField3 = false; // type, square meter, broker fee
  isField4 = false; // pets, smoking
  isField5 = false; // event
  itemTypes: Array<CodeValue> = [];
  facilities: Array<CodeValue> = [];
  furnishings: Array<any> = [];
  subCatCode: string;
  priceRequired = false;
  totalRoomRequired = false;
  totalBathRequired = false;
  facilitiesSet: Set<CodeValue> = new Set<CodeValue>();
  selectedFacilities: Array<CodeValue> = [];

  constructor(private fb: FormBuilder, private itemService: ItemService, private listItemService: ListItemService,
              private toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute) {
    itemService.endPoint = 'realestates';
  }

  ngOnInit() {
    this.furnishings = EnumValues.getNamesAndValues(FurnishType);
    this.reset();
  }

  getContact($event) {
    this.contact = $event;
  }

  getImages($event) {
    this.files = $event;
  }

  addOrRemoveFacilities($event: CodeValue, checked) {
    if (checked) {
      this.facilitiesSet.add($event);
    } else {
      this.facilitiesSet.forEach(value => {
        if (value.code === $event.code) {
          this.facilitiesSet.delete(value);
        }
      });
    }
    this.selectedFacilities = Array.from(this.facilitiesSet);
    this.rForm.get('facilities').setValue(this.selectedFacilities);
  }

  create() {
    this.isLoading = true;
    this.estate = this.rForm.value;
    this.estate.contact = this.contact;
    this.itemService.create('realestate', this.estate, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.estate.titleDescription.title + ' successfully created');
      this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.estate.titleDescription.title);
      this.isLoading = false;
    });
  }

  cancel() {
    console.log(this.rForm.value);
  }

  reset() {
    this.estate = new Estate();
    this.files = [];
    this.initForm();
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
      case EnumValues.getNameFromValue(PickListType, PickListType.FACILITY):
        this.facilities = Utils.convertListItemToCodeValue(data);
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
    this.subCatCode = this.getValueFromCodeValue('subCategory');
    this.resetField();
    this.setValidationMark();
    this.setRequiredField('subCatType', true);
    switch (this.subCatCode) {
      case this.CATEGORY.ESTATE.SUBCATEGORY.rent_property:
      case this.CATEGORY.ESTATE.SUBCATEGORY.sale_property:
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField1 = true;
        this.isField3 = true;
        break;
      case this.CATEGORY.ESTATE.SUBCATEGORY.event_center:
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.FACILITY));
        this.isField5 = true;
        break;
      case this.CATEGORY.ESTATE.SUBCATEGORY.rent_apartment:
        this.setRequiredField('subCatType', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField1 = true;
        this.isField2 = true;
        this.isField3 = true;
        this.isField4 = true;
        break;
      case this.CATEGORY.ESTATE.SUBCATEGORY.sale_apartment:
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField1 = true;
        this.isField2 = true;
        this.isField3 = true;
        break;
      case this.CATEGORY.ESTATE.SUBCATEGORY.rent_land:
      case this.CATEGORY.ESTATE.SUBCATEGORY.sale_land:
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField3 = true;
        break;
      case this.CATEGORY.ESTATE.SUBCATEGORY.shortlet:
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField2 = true;
        break;
    }
  }

  resetField() {
    this.isField1 = false;
    this.isField2 = false;
    this.isField3 = false;
    this.isField4 = false;
    this.isField5 = false;
    this.setRequiredField('subCatType', false);
    this.setRequiredField('totalBathroom', false);
    this.setRequiredField('totalRoom', false);
    this.setRequiredField('price', false);
    this.selectedFacilities = [];
    this.facilitiesSet.clear();
  }

  setValidationMark() {
    this.priceRequired = false;
    this.totalRoomRequired = false;
    this.totalBathRequired = false;

    switch (this.subCatCode) {
      case this.CATEGORY.ESTATE.SUBCATEGORY.shortlet:
      case this.CATEGORY.ESTATE.SUBCATEGORY.sale_apartment:
      case this.CATEGORY.ESTATE.SUBCATEGORY.rent_apartment:
        this.priceRequired = true;
        this.totalRoomRequired = true;
        this.totalBathRequired = true;
        this.setRequiredField('totalBathroom', true);
        this.setRequiredField('totalRoom', true);
        this.setRequiredField('price', true);
        break;
      case this.CATEGORY.ESTATE.SUBCATEGORY.event_center:
      case this.CATEGORY.ESTATE.SUBCATEGORY.rent_land:
      case this.CATEGORY.ESTATE.SUBCATEGORY.sale_land:
      case this.CATEGORY.ESTATE.SUBCATEGORY.rent_property:
      case this.CATEGORY.ESTATE.SUBCATEGORY.sale_property:
        this.setRequiredField('price', true);
        this.priceRequired = true;
        break;
    }
  }

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.rForm.get(groupName).get('name').value : this.rForm.get(groupName).get('code').value;
  }

  setNameFromCodeValue(groupName, value: any) {
    this.rForm.get(groupName).get('name').setValue(value);
  }

  setRequiredField(fieldName: string, isRequired: boolean) {
    const field = this.rForm.get(fieldName);
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
    const subCategory = this.estate.subCategory.code ? this.estate.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.rForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.estate.titleDescription.title, [Validators.required]],
        description: [this.estate.titleDescription.description]
      }),
      category: this.fb.group({
        code: [this.subCategories[0].parentCategory.categoryCode.dataCode],
        name: [this.subCategories[0].parentCategory.titleDescription.title]
      }),
      subCategory: this.fb.group({
        code: [subCategory.code, [Validators.required]],
        name: [subCategory.name, [Validators.required]]
      }),
      subCatType: [this.estate.subCatType ? this.estate.subCatType.code ? this.estate.subCatType : null : null],
      brokerFeeFg: [this.estate.brokerFeeFg],
      furnishType: [this.estate.furnishType],
      parkingSpaceFg: [this.estate.parkingSpaceFg],
      facilities: [],
      petsAllowed: [this.estate.petsAllowed],
      contactForPrice: [this.estate.contactForPrice],
      squareMeter: [this.estate.squareMeter],
      capacity: [this.estate.capacity],
      smokingAllowed: [this.estate.smokingAllowed],
      totalBathroom: [this.estate.totalBathroom],
      totalRoom: [this.estate.totalRoom],
      price: [this.estate.price],
      negotiable: [this.estate.negotiable]
    });
    this.resolveField();
  }

  ngOnDestroy(): void {
  }


}
