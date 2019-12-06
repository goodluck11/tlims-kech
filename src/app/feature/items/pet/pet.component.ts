import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, PickListType} from 'core/model/category';
import {CATEGORY} from 'core/constant/category.const';
import {CodeValue, Condition, Contact, Gender} from 'core/model/base-model';
import {ItemService} from 'feature/items/item.service';
import {PickListService} from 'core/services/picklist.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {Utils} from 'core/utils/utils';
import {EnumValues} from 'enum-values';
import {BreedType, Pet, PetAge, PetGender} from 'feature/items/pet/pet';

@Component({
  selector: 'tlims-pet',
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.scss']
})
export class PetComponent implements OnInit, OnDestroy {

  pForm: FormGroup;
  pet: Pet = new Pet();
  @Input()
  subCategories: Array<Category> = [];
  CATEGORY = CATEGORY;
  isLoading = false;
  isDataLoading = false;
  files: File[];
  contact: Contact = new Contact();
  isField1 = false; // gender, type, age
  isField2 = false; // gender, breed, breed type, age
  isField3 = false; // type
  itemTypes: Array<CodeValue> = [];
  breeds: Array<CodeValue> = [];
  breedTypes: Array<any> = [];
  genders: Array<any> = [];
  ages: Array<any> = [];
  subCatCode: string;

  constructor(private fb: FormBuilder, private itemService: ItemService, private pickListService: PickListService,
              private toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute) {
    itemService.endPoint = 'pets';
  }

  ngOnInit() {
    this.breedTypes = EnumValues.getNamesAndValues(BreedType);
    this.genders = EnumValues.getNamesAndValues(PetGender);
    this.ages = EnumValues.getNamesAndValues(PetAge);
    this.reset();
  }

  getContact($event) {
    this.contact = $event;
  }

  getImages($event) {
    this.files = $event;
  }

  create() {
    this.isLoading = true;
    this.pet = this.pForm.value;
    this.pet.contact = this.contact;
    this.itemService.create('pet', this.pet, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.pet.titleDescription.title + ' successfully created');
      this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.pet.titleDescription.title);
      this.isLoading = false;
    });
  }

  cancel() {
    console.log(this.pForm.value);
  }

  reset() {
    this.pet = new Pet();
    this.files = [];
    this.initForm();
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
        this.itemTypes = Utils.convertPickListToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.BREED):
        this.breeds = Utils.convertPickListToCodeValue(data);
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
      case this.CATEGORY.ANIMAL.SUBCATEGORY.birds:
        this.setRequiredField('age', true);
        this.setRequiredField('gender', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BREED));
        this.isField1 = true;
        break;
      case this.CATEGORY.ANIMAL.SUBCATEGORY.cats:
      case this.CATEGORY.ANIMAL.SUBCATEGORY.dogs:
        this.setRequiredField('breed', true);
        this.setRequiredField('breedType', true);
        this.setRequiredField('age', true);
        this.setRequiredField('gender', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BREED));
        this.isField2 = true;
        break;
      case this.CATEGORY.ANIMAL.SUBCATEGORY.pet_access:
        this.setRequiredField('subCatType', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField3 = true;
        break;
    }
  }

  resetField() {
    this.isField1 = false;
    this.isField2 = false;
    this.isField3 = false;
    this.setRequiredField('breed', false);
    this.setRequiredField('breedType', false);
    this.setRequiredField('age', false);
    this.setRequiredField('gender', false);
    this.setRequiredField('subCatType', false);
  }

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.pForm.get(groupName).get('name').value : this.pForm.get(groupName).get('code').value;
  }

  setNameFromCodeValue(groupName, value: any) {
    this.pForm.get(groupName).get('name').setValue(value);
  }

  setRequiredField(fieldName: string, isRequired: boolean) {
    const field = this.pForm.get(fieldName);
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
    const subCategory = this.pet.subCategory.code ? this.pet.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.pForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.pet.titleDescription.title, [Validators.required]],
        description: [this.pet.titleDescription.description]
      }),
      category: this.fb.group({
        code: [this.subCategories[0].parentCategory.categoryCode.dataCode],
        name: [this.subCategories[0].parentCategory.titleDescription.title]
      }),
      subCategory: this.fb.group({
        code: [subCategory.code, [Validators.required]],
        name: [subCategory.name, [Validators.required]]
      }),
      subCatType: [this.pet.subCatType],
      itemCondition: [this.pet.itemCondition ? this.pet.itemCondition :
        EnumValues.getNameFromValue(Condition, Condition.NEW)],
      age: [this.pet.age],
      gender: [this.pet.gender],
      breed: [this.pet.breed],
      breedType: [this.pet.breedType],
      price: [this.pet.price],
      negotiable: [this.pet.negotiable]
    });
    this.resolveField();
  }

  ngOnDestroy(): void {
  }


}
