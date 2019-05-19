import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Category} from 'core/model/category';

@Component({
  selector: 'tlims-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit, OnDestroy {

  vehicleForm: FormGroup;
  @Input()
  subCategories: Array<Category> = [];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initForm();
  }

  getImages($event) {
    console.log($event);
  }

  initForm() {
    this.vehicleForm = this.fb.group({});
  }

  ngOnDestroy(): void {
  }
}
