import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'tlims-beauty-health',
  templateUrl: './beauty-health.component.html',
  styleUrls: ['./beauty-health.component.scss']
})
export class BeautyHealthComponent implements OnInit, OnDestroy {

  bForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.bForm = this.fb.group({});
  }

  ngOnDestroy(): void {
  }

}
