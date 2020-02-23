import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Services} from 'feature/items/services/services';
import {Category} from 'core/model/category';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CATEGORY} from 'core/constant/category.const';
import {CodeValue, Contact} from 'core/model/base-model';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {Utils} from 'core/utils/utils';

@Component({
  selector: 'tlims-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {

  services: Services;
  @Input()
  subCategories: Array<Category> = [];
  sForm: FormGroup;
  CATEGORY = CATEGORY;
  isLoading = false;
  files: File[];
  contact: Contact = new Contact();
  tagSuggestions = ['google', 'apple', 'microsoft'];

  constructor(private fb: FormBuilder, private itemService: ItemService,
              private toastr: ToastrService, private router: Router) {
    itemService.endPoint = 'services';
  }

  ngOnInit() {
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
    this.services = this.sForm.value;
    this.services.contact = this.contact;
    this.itemService.create('services', this.services, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.services.titleDescription.title + ' successfully created');
      this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.services.titleDescription.title);
      this.isLoading = false;
    });
  }

  cancel() {
    console.log(this.sForm.value);
  }

  reset() {
    this.services = new Services();
    this.files = [];
    this.initForm();
  }

  populateCodeValueName(groupName) {
    if ('subCategory' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromCategory(this.subCategories, this.getValueFromCodeValue(groupName)));
    }
  }

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.sForm.get(groupName).get('name').value : this.sForm.get(groupName).get('code').value;
  }

  setNameFromCodeValue(groupName, value: any) {
    this.sForm.get(groupName).get('name').setValue(value);
  }

  contactForPriceFg(val?) {
    this.setRequiredField('price', true);
    val = val || this.sForm.get('contactForPrice').value;
    if (val) {
      this.setRequiredField('price', false);
      this.sForm.get('price').setValue(null);
    }
  }

  setRequiredField(fieldName: string, isRequired: boolean) {
    const field = this.sForm.get(fieldName);
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
    const subCategory = this.services.subCategory.code ? this.services.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.sForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.services.titleDescription.title, [Validators.required]],
        description: [this.services.titleDescription.description]
      }),
      category: this.fb.group({
        code: [this.subCategories[0].parentCategory.categoryCode.dataCode],
        name: [this.subCategories[0].parentCategory.titleDescription.title]
      }),
      subCategory: this.fb.group({
        code: [subCategory.code, [Validators.required]],
        name: [subCategory.name, [Validators.required]]
      }),
      contactForPrice: [this.services.contactForPrice],
      price: [this.services.price],
      tags: [this.services.tags],
      negotiable: [this.services.negotiable]
    });
    this.contactForPriceFg();
  }

  ngOnDestroy(): void {
  }

}
