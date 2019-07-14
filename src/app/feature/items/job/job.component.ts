import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, PickListType} from 'core/model/category';
import {Job} from 'feature/items/job/job';
import {CodeValue, Contact} from 'core/model/base-model';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {PickListService} from 'core/services/picklist.service';
import {EnumValues} from 'enum-values';
import {forkJoin} from 'rxjs';
import {Utils} from 'core/utils/utils';

@Component({
  selector: 'tlims-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit, OnDestroy {

  jForm: FormGroup;
  job: Job = new Job();
  @Input()
  subCategories: Array<Category> = [];
  isDataLoading = false;
  isLoading = false;
  files: File[] = [];
  contact: Contact = new Contact();
  jobTypes: Array<CodeValue> = [];
  experiences: Array<CodeValue> = [];

  constructor(private fb: FormBuilder, private itemService: ItemService, private pickListService: PickListService,
              private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) {
    itemService.endPoint = 'jobs';
  }

  ngOnInit() {
    this.getPickListItems();
    this.initForm();
  }

  getPickListItems() {
    const jobTypes = this.pickListService.findByListType(EnumValues.getNameFromValue(PickListType, PickListType.JOB_TYPE));
    const jobExperiences = this.pickListService.findByListType(EnumValues.getNameFromValue(PickListType, PickListType.JOB_EXPERIENCE));
    forkJoin([jobTypes, jobExperiences]).pipe(untilDestroyed(this)).subscribe((data: any) => {
      this.jobTypes = Utils.convertPickListToCodeValue(data[0]);
      this.experiences = Utils.convertPickListToCodeValue(data[1]);
    }, error1 => {
      this.toastr.error('Error loading picklist items');
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
    this.job = this.jForm.value;
    this.job.contact = this.contact;
    this.transformObj();
    this.itemService.create('job', this.job, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.job.titleDescription.title + ' successfully created');
      // this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.job.titleDescription.title);
      this.isLoading = false;
    });
  }

  transformObj() {
    this.job.jobType = this.job.jobType ? JSON.stringify(this.job.jobType) : this.job.jobType;
    this.job.minimumExp = this.job.minimumExp ? JSON.stringify(this.job.minimumExp) : this.job.minimumExp;
  }

  cancel() {
    console.log(this.jForm);
  }

  initForm() {
    const subCategory = this.job.subCategory.code ? this.job.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.jForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.job.titleDescription.title, [Validators.required]],
        description: [this.job.titleDescription.description]
      }),
      category: this.fb.group({
        code: [this.subCategories[0].parentCategory.categoryCode.dataCode],
        name: [this.subCategories[0].parentCategory.titleDescription.title]
      }),
      subCategory: this.fb.group({
        code: [subCategory.code, [Validators.required]],
        name: [subCategory.name, [Validators.required]]
      }),
      companyName: [this.job.companyName, [Validators.required]],
      jobType: [this.job.jobType, [Validators.required]],
      minimumExp: [this.job.minimumExp, [Validators.required]],
      miniQualification: [this.job.miniQualification, [Validators.required]],
      requirements: [this.job.requirements, [Validators.required]],
      responsibilities: [this.job.responsibilities, [Validators.required]],
      salaryFrom: [this.job.salaryFrom, [Validators.required]],
      salaryTo: [this.job.salaryTo]
    });
  }

  ngOnDestroy(): void {
  }

}
