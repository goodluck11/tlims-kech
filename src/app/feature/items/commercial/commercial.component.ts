import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'tlims-commercial',
  templateUrl: './commercial.component.html',
  styleUrls: ['./commercial.component.scss']
})
export class CommercialComponent implements OnInit, OnDestroy {

  commForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.commForm = this.fb.group({});
  }

  ngOnDestroy(): void {
  }

}
