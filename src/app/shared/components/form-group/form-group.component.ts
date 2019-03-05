import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tlims-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss']
})
export class FormGroupComponent implements OnInit {

  @Input()
  hint: string;
  @Input()
  label: string;
  @Input()
  labelWidth: string;
  @Input()
  inputWidth: string;
  @Input()
  required: string;
  @Input()
  inputGroup = false;
  @Input()
  styleClass: string;
  @Input()
  checkBox = false;

  constructor() { }

  ngOnInit() {
  }

}
