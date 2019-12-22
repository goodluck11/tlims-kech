import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, PickListType} from 'core/model/category';
import {CodeValue, Condition, Contact} from 'core/model/base-model';
import {ItemService} from 'feature/items/item.service';
import {PickListService} from 'core/services/picklist.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Repair} from 'feature/items/repair/repair';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {EnumValues} from 'enum-values';
import {CATEGORY} from 'core/constant/category.const';
import {Utils} from 'core/utils/utils';

@Component({
  selector: 'tlims-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.scss']
})
export class RepairComponent implements OnInit, OnDestroy {

  @Input()
  subCategories: Array<Category> = [];
  rForm: FormGroup;
  isDataLoading = false;
  isLoading = false;
  files: File[] = [];
  contact: Contact = new Contact();
  itemTypes: Array<CodeValue> = [];
  private repair: Repair = new Repair();
  conditions = [];
  isField1 = false;
  CATEGORY = CATEGORY;
  isField2 = false;
  private subCatCode: string;

  constructor(private fb: FormBuilder, private itemService: ItemService, private pickListService: PickListService,
              private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) {
    itemService.endPoint = 'repairs';
  }

  ngOnInit() {
    this.conditions = EnumValues.getNamesAndValues(Condition);
    this.initForm();
  }

  create() {
    this.isLoading = true;
    this.repair = this.rForm.value;
    this.repair.contact = this.contact;
    this.itemService.create('repair', this.repair, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.repair.titleDescription.title + ' successfully created');
      // this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.repair.titleDescription.title);
      console.log(err);
      this.isLoading = false;
    });
  }

  cancel() {
    console.log(this.rForm);
  }

  getImages($event) {
    this.files = $event;
  }

  getContact($event) {
    this.contact = $event;
  }

  getPickList(listType) {
    const obs$ = this.pickListService.getPicklistsByByTypeAndCategory(listType, this.getValueFromCodeValue('category'), this.subCatCode);
    obs$.pipe(untilDestroyed(this)).subscribe((data: any) => {
      if (Array(data)) {
        this.itemTypes = Utils.convertPickListToCodeValue(data);
      }
    }, (err) => {
      // console.log(err);
    });
  }

  resolveFields() {
    const subCatCode = this.getValueFromCodeValue('subCategory');
    this.subCatCode = subCatCode;
    this.resetField();
    this.itemTypes = [];
    switch (subCatCode) {
      case this.CATEGORY.REPAIR.SUBCATEGORY.b_materials:
      case this.CATEGORY.REPAIR.SUBCATEGORY.plumb_water:
        this.isField1 = true;
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        break;
      case this.CATEGORY.REPAIR.SUBCATEGORY.solar_energy:
      case this.CATEGORY.REPAIR.SUBCATEGORY.elect_equip:
      case this.CATEGORY.REPAIR.SUBCATEGORY.elect_tools:
      case this.CATEGORY.REPAIR.SUBCATEGORY.hand_tools:
      case this.CATEGORY.REPAIR.SUBCATEGORY.measure_layout:
        this.getPickList(EnumValues.getNameFromValue(PickListType, PickListType.ITEM_TYPE));
        this.isField1 = true;
        this.isField2 = true;
        break;
    }
  }

  resetField() {
    this.isField1 = false;
    this.isField2 = false;
  }

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.rForm.get(groupName).get('name').value : this.rForm.get(groupName).get('code').value;
  }

  initForm() {
    const subCategory = this.repair.subCategory.code ? this.repair.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.rForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.repair.titleDescription.title, [Validators.required]],
        description: [this.repair.titleDescription.description]
      }),
      category: this.fb.group({
        code: [this.subCategories[0].parentCategory.categoryCode.dataCode],
        name: [this.subCategories[0].parentCategory.titleDescription.title]
      }),
      subCategory: this.fb.group({
        code: [subCategory.code, [Validators.required]],
        name: [subCategory.name, [Validators.required]]
      }),
      price: [this.repair.price, [Validators.required]],
      subCatType: [this.repair.subCatType ? this.repair.subCatType.code ? this.repair.subCatType.code : null : null],
      negotiable: [this.repair.negotiable],
      itemCondition: [this.repair.itemCondition]
    });
    this.resolveFields();
  }

  ngOnDestroy(): void {
  }
}
