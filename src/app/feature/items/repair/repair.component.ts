import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'tlims-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.scss']
})
export class RepairComponent implements OnInit, OnDestroy {

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
