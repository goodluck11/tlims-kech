import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Category} from 'core/model/category';

@Component({
  selector: 'tlims-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.scss']
})
export class RepairComponent implements OnInit, OnDestroy {

  @Input()
  subCategories: Array<Category> = [];
  rForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.rForm = this.fb.group({});
  }

  ngOnDestroy(): void {
  }
}
