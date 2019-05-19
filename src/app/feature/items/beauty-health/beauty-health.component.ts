import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Category} from 'core/model/category';

@Component({
  selector: 'tlims-beauty-health',
  templateUrl: './beauty-health.component.html',
  styleUrls: ['./beauty-health.component.scss']
})
export class BeautyHealthComponent implements OnInit, OnDestroy {

  bForm: FormGroup;
  @Input()
  subCategories: Array<Category> = [];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initForm();
  }

  getImages($event) {

  }

  initForm() {
    this.bForm = this.fb.group({});
  }

  ngOnDestroy(): void {
  }

}
