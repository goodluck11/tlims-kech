import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Category} from 'core/model/category';

@Component({
  selector: 'tlims-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit, OnDestroy {

  mForm: FormGroup;
  @Input()
  subCategories: Array<Category> = [];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.mForm = this.fb.group({});
  }

  ngOnDestroy(): void {
  }

}
