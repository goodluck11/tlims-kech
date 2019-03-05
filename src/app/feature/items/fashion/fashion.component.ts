import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'tlims-fashion',
  templateUrl: './fashion.component.html',
  styleUrls: ['./fashion.component.scss']
})
export class FashionComponent implements OnInit, OnDestroy {

  fForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.fForm = this.fb.group({});
  }

  ngOnDestroy(): void {
  }
}
