import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, PickListType} from 'core/model/category';
import {CATEGORY} from 'core/constant/category.const';
import {Fashion} from 'feature/items/fashion/fashion';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {EnumValues} from 'enum-values';
import {CodeValue, Condition, Contact, Gender} from 'core/model/base-model';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Utils} from 'core/utils/utils';
import {ActivatedRoute, Router} from '@angular/router';
import {APP_URL} from 'core/constant/tlims.url';
import {TLIMS_CONST} from 'core/constant/tlims.const';
import {ListItemService} from 'core/services/list-item.service';

@Component({
  selector: 'tlims-fashion',
  templateUrl: './fashion.component.html',
  styleUrls: ['./fashion.component.scss']
})
export class FashionComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private listItemService: ListItemService, private itemService: ItemService,
              private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) {
    itemService.endPoint = 'fashions';
  }

  fForm: FormGroup;
  fashion: Fashion = new Fashion();
  @Input()
  subCategories: Array<Category> = [];
  CATEGORY = CATEGORY;
  isDataLoading = false;
  isLoading = false;
  files: File[] = [];
  conditions = [];
  genders = [];
  subCatCode: string;
  itemTypes: Array<CodeValue> = [];
  itemTypes2: Array<CodeValue> = [];
  brands: Array<CodeValue> = [];
  materials: Array<CodeValue> = [];
  closures: Array<CodeValue> = [];
  colors: Array<CodeValue> = [];
  styles: Array<CodeValue> = [];
  sizes: Array<CodeValue> = [];
  stones: Array<CodeValue> = [];
  features: Array<CodeValue> = [];
  fastenings: Array<CodeValue> = [];
  displays: Array<CodeValue> = [];
  movements: Array<CodeValue> = [];
  outSoleMaterials: Array<CodeValue> = [];
  isField1 = false; // type, gender, brand, material, closure, color
  isField2 = false; // brand, type2, color, size, style, gender
  isField3 = false; // main material, type, color 2, gender, stone
  isField4 = false; // brand, type, subtype, ram, processor, model, core
  isField5 = false; // brand, gender, movement
  isField6 = false;
  isField7 = false;
  materialStore: Array<CodeValue> = [];
  material2Store: Array<CodeValue> = [];
  closureStore: Array<CodeValue> = [];
  colorStore: Array<CodeValue> = [];
  typeStore: Array<CodeValue> = [];
  sizeStore: Array<CodeValue> = [];
  fastenStore: Array<CodeValue> = [];
  featureStore: Array<CodeValue> = [];
  styleStore: Array<CodeValue> = [];
  contact: Contact = new Contact();
  kidsItemTypes = `${TLIMS_CONST.FASHION_KIDS_CODE}`;

  static markFields(control) {
    control.markAsPristine();
    control.markAsUntouched();
  }

  ngOnInit() {
    this.genders = EnumValues.getNamesAndValues(Gender);
    this.conditions = EnumValues.getNamesAndValues(Condition);
    this.getResolvedData();
    this.initForm();
    this.resolveField();
  }

  getResolvedData() {
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.colors = Utils.convertPickListToCodeValue(data.colors);
    });
  }

  getImages($event) {
    this.files = $event;
  }

  getContact($event) {
    this.contact = $event;
  }

  create() {
    this.isLoading = true;
    this.fashion = this.fForm.value;
    this.fashion.contact = this.contact;
    this.itemService.create('fashion', this.fashion, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.fashion.titleDescription.title + ' successfully created');
      this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.fashion.titleDescription.title);
      this.isLoading = false;
    });
  }

  cancel() {
    console.log(this.fForm);
  }

  reset() {
    this.resolveField();
  }

  displayKidsFields() {
    this.isField7 = false;
    const subCatType = this.fForm.get('subCatType').value;
    const itemCodes = this.kidsItemTypes.split(',');
    const item = itemCodes.filter(value => value.includes(subCatType.code))[0];
    if (item) {
      this.isField7 = true;
    }
  }

  addOrRemoveMaterial(mat, $event, isCheckBox: boolean) {
    if (!isCheckBox) {
      if ($event) {
        this.materialStore.push(mat);
      } else {
        const index = this.materialStore.indexOf(mat);
        this.materialStore.splice(index, 1);
      }
    } else {
      this.materialStore = [];
      if (this.getFieldValue('materialTemp')) {
        this.materialStore.push(this.getFieldValue('materialTemp'));
      }
    }
    this.setPickFieldValue('material', this.materialStore);
  }


  addOrRemoveMaterial2(mat, $event) {
    if ($event) {
      this.material2Store.push(mat);
    } else {
      const index = this.material2Store.indexOf(mat);
      this.material2Store.splice(index, 1);
    }
    this.setPickFieldValue('material2', this.material2Store);
  }

  addOrRemoveClosure(mat, $event) {
    if ($event) {
      this.closureStore.push(mat);
    } else {
      const index = this.closureStore.indexOf(mat);
      this.closureStore.splice(index, 1);
    }
    this.setPickFieldValue('closure', this.closureStore);
  }

  addOrRemoveColor(mat, $event, isCheckBox: boolean) {
    if (!isCheckBox) {
      if ($event) {
        this.colorStore.push(mat);
      } else {
        const index = this.colorStore.indexOf(mat);
        this.colorStore.splice(index, 1);
      }
    } else {
      this.colorStore = [];
      if (this.getFieldValue('colorTemp')) {
        this.colorStore.push(this.getFieldValue('colorTemp'));
      }
    }
    this.setPickFieldValue('color', this.colorStore);
  }

  addOrRemoveStyle(mat, $event, isCheckBox: boolean) {
    if (!isCheckBox) {
      if ($event) {
        this.styleStore.push(mat);
      } else {
        const index = this.styleStore.indexOf(mat);
        this.styleStore.splice(index, 1);
      }
    } else {
      this.styleStore = [];
      if (this.getFieldValue('fashionStyleTemp')) {
        this.styleStore.push(this.getFieldValue('fashionStyleTemp'));
      }
    }
    this.setPickFieldValue('fashionStyle', this.styleStore);
  }

  addOrRemoveType(mat, $event) {
    if ($event) {
      this.typeStore.push(mat);
    } else {
      const index = this.typeStore.indexOf(mat);
      this.typeStore.splice(index, 1);
    }
    this.setPickFieldValue('typeList', this.typeStore);
  }

  addOrRemoveSize(mat, $event) {
    if ($event) {
      this.sizeStore.push(mat);
    } else {
      const index = this.sizeStore.indexOf(mat);
      this.sizeStore.splice(index, 1);
    }
    this.setPickFieldValue('fashionSize', this.sizeStore);
  }

  addOrRemoveFeature(cs, $event) {
    if ($event) {
      this.featureStore.push(cs);
    } else {
      const index = this.featureStore.indexOf(cs);
      this.featureStore.splice(index, 1);
    }
    this.setPickFieldValue('features', this.featureStore);
  }

  addOrRemoveFastening(cs, $event) {
    if ($event) {
      this.fastenStore.push(cs);
    } else {
      const index = this.fastenStore.indexOf(cs);
      this.fastenStore.splice(index, 1);
    }
    this.setPickFieldValue('fastening', this.fastenStore);
  }

  setPickFieldValue(fieldName, value: CodeValue[]) {
    const val = value.length === 0 ? null : JSON.stringify(value);
    this.fForm.get(fieldName).setValue(val);
  }

  getFieldValue(fieldName) {
    return this.fForm.get(fieldName).value;
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
    this.fashion = new Fashion();
    this.fashion.subCategory = CodeValue.of(this.subCatCode, Utils.getNameFromCategory(this.subCategories, this.subCatCode));
    this.initForm();
    this.resetField();
    this.clearArrays();
    switch (subCatCode) {
      case this.CATEGORY.FASHION.SUBCATEGORY.bags:
        this.isField1 = true;
        this.setRequiredField('subCatType', true);
        this.setRequiredField('brand', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.MATERIAL));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.CLOSURE));
        break;
      case this.CATEGORY.FASHION.SUBCATEGORY.clothing:
        this.isField2 = true;
        this.setRequiredField('brand', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.SIZE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.STYLE));
        break;
      case this.CATEGORY.FASHION.SUBCATEGORY.jewelry:
        this.isField3 = true;
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.STONE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.MATERIAL));
        break;
      case this.CATEGORY.FASHION.SUBCATEGORY.shoes:
        this.isField4 = true;
        this.setRequiredField('brand', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.SIZE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.STYLE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.FASTEN));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.MATERIAL));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.OUTSOLE));
        break;
      case this.CATEGORY.FASHION.SUBCATEGORY.watches:
        this.isField5 = true;
        this.setRequiredField('brand', true);
        this.setRequiredField('display', true);
        this.setRequiredField('movement', true);
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.BRAND));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.MOVEMENT));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.DISPLAY));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.MATERIAL));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.FEATURE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.STYLE));
        break;
      case this.CATEGORY.FASHION.SUBCATEGORY.kids:
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.SIZE));
        this.setRequiredField('subCatType', true);
        this.isField6 = true;
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

  clearArrays() {
    this.sizes = [];
    this.materials = [];
    this.styles = [];
    this.brands = [];
    this.fastenings = [];
    this.displays = [];
    this.features = [];
    this.closures = [];
    this.stones = [];
    this.outSoleMaterials = [];
    this.movements = [];
    this.materialStore = [];
    this.material2Store = [];
    this.closureStore = [];
    this.colorStore = [];
    this.typeStore = [];
    this.sizeStore = [];
    this.fastenStore = [];
    this.featureStore = [];
    this.styleStore = [];
    this.removeConstraints();
  }

  mapValues(listType, data) {
    switch (listType) {
      case EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE):
        if (this.isField2 || this.isField4) {
          this.itemTypes2 = Utils.convertListItemToCodeValue(data);
        } else {
          this.itemTypes = Utils.convertListItemToCodeValue(data);
        }
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.BRAND):
        this.brands = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.MATERIAL):
        this.materials = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.CLOSURE):
        this.closures = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.STYLE):
        this.styles = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.SIZE):
        this.sizes = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.STONE):
        this.stones = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.FEATURE):
        this.features = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.FASTEN):
        this.fastenings = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.DISPLAY):
        this.displays = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.MOVEMENT):
        this.movements = Utils.convertListItemToCodeValue(data);
        break;
      case EnumValues.getNameFromValue(PickListType, PickListType.OUTSOLE):
        this.outSoleMaterials = Utils.convertListItemToCodeValue(data);
        break;
    }
  }

  setRequiredField(fieldName: string, isRequired: boolean) {
    const field = this.fForm.get(fieldName);
    if (isRequired) {
      field.setValidators([Validators.required]);
      FashionComponent.markFields(field);
    } else {
      field.clearValidators();
    }
    field.updateValueAndValidity();
  }

  resetField() {
    this.isField1 = false;
    this.isField2 = false;
    this.isField3 = false;
    this.isField4 = false;
    this.isField5 = false;
    this.isField6 = false;
  }

  removeConstraints() {
    this.setRequiredField('subCatType', false);
    this.setRequiredField('brand', false);
    this.setRequiredField('movement', false);
    this.setRequiredField('display', false);
  }

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.fForm.get(groupName).get('name').value : this.fForm.get(groupName).get('code').value;
  }

  setNameFromCodeValue(groupName, value: any) {
    this.fForm.get(groupName).get('name').setValue(value);
  }

  initForm() {
    const subCategory = this.fashion.subCategory.code ? this.fashion.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.fForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.fashion.titleDescription.title, [Validators.required]],
        description: [this.fashion.titleDescription.description]
      }),
      category: this.fb.group({
        code: [this.subCategories[0].parentCategory.categoryCode.dataCode],
        name: [this.subCategories[0].parentCategory.titleDescription.title]
      }),
      subCategory: this.fb.group({
        code: [subCategory.code, [Validators.required]],
        name: [subCategory.name, [Validators.required]]
      }),
      subCatType: [this.fashion.subCatType ? this.fashion.subCatType.code ? this.fashion.subCatType : null : null],
      brand: [this.fashion.brand ? this.fashion.brand.code ? this.fashion.brand : null : null],
      material: [],
      materialTemp: [null],
      material2: [],
      closure: [],
      fastening: [],
      fashionSize: [],
      fashionStyle: [this.fashion.fashionStyle],
      fashionStyleTemp: [null],
      jewelStone: [this.fashion.jewelStone ? this.fashion.jewelStone.code ? this.fashion.jewelStone : null : null],
      movement: [this.fashion.movement ? this.fashion.movement.code ? this.fashion.movement : null : null],
      display: [this.fashion.display ? this.fashion.display.code ? this.fashion.display : null : null],
      color: [this.fashion.color],
      colorTemp: [null],
      gender: [this.fashion.gender ? this.fashion.gender : EnumValues.getNameFromValue(Gender, Gender.MALE)],
      typeList: [this.fashion.typeList],
      features: [this.fashion.features],
      price: [this.fashion.price, [Validators.required]],
      negotiable: [this.fashion.negotiable]
    });
  }

  ngOnDestroy(): void {
  }
}
